import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatsEntity } from "./chats.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "./messages.entity";
import { UsersEntity } from "src/users/users.entity";

@Injectable()
export class ChatsService{
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messagesRepositroy: Repository<MessageEntity>,
        @InjectRepository(ChatsEntity) 
        private readonly chatsRepository: Repository<ChatsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
    ){}

    async getUserChats(userId: string): Promise<any[]> {
        const chats = await this.chatsRepository.find({
            relations: ['participants', 'messages'],
            order: { updatedAt: 'DESC' },
        });
    
        return chats.filter(chat =>
            chat.participants.some(participant => participant.id === userId)
        );
    }      

    async getAllChats(): Promise<ChatsEntity[]> {
        return this.chatsRepository.find({
            relations: ['participants', 'messages'],
            order: { updatedAt: 'DESC' }
        });
    }

    async deleteChat(chatId: string): Promise<void> {
        const chat = await this.chatsRepository.findOne({ where: { id: chatId } })

        if (!chat) {
            throw new NotFoundException('Чат не найден')
        }

        await this.messagesRepositroy.delete({ chatId });

        await this.chatsRepository.remove(chat)
    }

    async createMessage(
        chatId: string,
        senderId: string,
        content: string,
      ): Promise<MessageEntity> {
        const message = this.messagesRepositroy.create({
          chatId,
          senderId,
          content,
          createdAt: new Date(),
        });
    
        try {
          const savedMessage = await this.messagesRepositroy.save(message);
          return savedMessage;
        } catch (error) {
          console.error('Error saving message:', error);
          throw error;
        }
      }

    async getMessages(chatId: string): Promise<MessageEntity[]> {
        return this.messagesRepositroy.find({
            where: { chatId },
            order: { createdAt: 'ASC' }
        })
    }

    async getOrCreateChat(userId: string, friendId: string): Promise<ChatsEntity> {
        const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['chats'] })
        const friend = await this.usersRepository.findOne({ where: { id: friendId } })

        if (!user || !friend) {
            throw new Error('User or friend not found')
        }

        const existingChat = await this.chatsRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.participants', 'participant')
        .where(':userId IN (participant.id)', { userId })
        .andWhere(':friendId IN (participant.id)', { friendId })
        .andWhere('chat.isGroup = false')
        .getOne()

        if (existingChat) {
            return existingChat
        }

        const chat = this.chatsRepository.create({ isGroup: false, participants: [user, friend] })
        return this.chatsRepository.save(chat)
    }
}