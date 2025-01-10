import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatsEntity } from "./chats.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatsService{
    constructor(@InjectRepository(ChatsEntity) private chatsRepository: Repository<ChatsEntity>){}

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

        await this.chatsRepository.remove(chat)
    }
}