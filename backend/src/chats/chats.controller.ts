import { Controller, Delete, Get, Param } from "@nestjs/common";
import { ChatsService } from "./chats.service";

@Controller('api/chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService){}

    @Get('user/:userId')
    async getUserChats(@Param('userId') userId: string) {
        return this.chatsService.getUserChats(userId);
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

    @Delete(':id')
    async deleteChat(@Param('id') chatId: string): Promise<{ message: string }> {
        await this.chatsService.deleteChat(chatId)
        return { message: 'Чат успешно удален' }
    }
}