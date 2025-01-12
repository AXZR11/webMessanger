import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { MessageEntity } from "./messages.entity";

@Controller('api/chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService){}

    @Get('user/:userId')
    async getUserChats(@Param('userId') userId: string) {
        return this.chatsService.getUserChats(userId);
    }

    @Get(':chatId/messages')
    async getMessages(@Param('chatId') chatId: string) {
        return this.chatsService.getMessages(chatId)
    }

    @Get(':userId/:friendId')
    async getOrCreateChat(
        @Param('userId') userId: string,
        @Param('friendId') friendId: string
    ) {
        const chat = await this.chatsService.getOrCreateChat(userId, friendId)
        if (!chat) {
            throw new HttpException('Chat not found', HttpStatus.NOT_FOUND)
        }
        return chat
    }

    @Get()
    async getAllChats() {
        const chats = await this.chatsService.getAllChats();

        return chats.map(chat => ({
            id: chat.id,
            name: chat.name,
            isGroup: chat.isGroup,
            participants: chat.participants.map(participant => ({
                id: participant.id,
                username: participant.username,
                avatarUrl: participant.avatarUrl
            })),
            messages: chat.messages.map(message => ({
                content: message.content,
                createdAt: message.createdAt
            })),
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        }));
    }

    @Post(':chatId')
    async createMessage(
        @Param('chatId') chatId: string,
        @Body('senderId') senderId: string,
        @Body('content') content: string,
    ): Promise<MessageEntity> {
        return this.chatsService.createMessage(chatId, senderId, content);
    }

    @Delete(':id')
    async deleteChat(@Param('id') chatId: string): Promise<{ message: string }> {
        await this.chatsService.deleteChat(chatId)
        return { message: 'Чат успешно удален' }
    }
}