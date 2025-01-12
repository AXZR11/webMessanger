import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { MessageEntity } from 'src/chats/messages.entity';
import { Repository } from 'typeorm';

interface User {
  userId: string;
  socketId: string;
}

@Injectable()
export class WebsocketsService {
   constructor(
      @InjectRepository(MessageEntity)  // Внедряем репозиторий для работы с сущностью MessageEntity
      private messageRepository: Repository<MessageEntity>,
    ) {}

  private users: User[] = [];

  // Добавление пользователя
  addUser(userId: string, socketId: string) {
    this.users.push({ userId, socketId });
  }

  // Удаление пользователя
  removeUser(socketId: string) {
    this.users = this.users.filter(user => user.socketId !== socketId);
  }

  // Получить сокет по userId
  getSocketByUserId(userId: string): string | undefined {
    const user = this.users.find(user => user.userId === userId);
    return user?.socketId;
  }

  sendMessage(socket: Socket, chatId: string, content: string, senderId: string) {
   // Получаем все сокеты участников чата, кроме отправителя
   const recipientSockets = this.users.filter(user => user.userId !== senderId);
   
   if (recipientSockets.length > 0) {
     recipientSockets.forEach(user => {
       // Отправляем сообщение всем получателям чата
       socket.to(user.socketId).emit('receiveMessage', {
         chatId,
         content,
         senderId,
         createdAt: new Date().toISOString()
       });
     });
   } else {
     console.log('No recipients found');
   }
 } 

 async saveMessage(chatId: string, content: string, senderId: string) {
   try {
     const newMessage = this.messageRepository.create({
       chatId,
       content,
       senderId,
       createdAt: new Date(),  // Используем объект Date
     });

     await this.messageRepository.save(newMessage);  // Сохраняем сообщение в базе данных
     console.log(`Message saved: ${content}`);
   } catch (error) {
     console.error('Error saving message:', error);
   }
 }
 
}
