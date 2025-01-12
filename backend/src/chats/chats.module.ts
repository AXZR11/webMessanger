import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatsEntity } from "./chats.entity";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { MessageEntity } from "./messages.entity";
import { UsersEntity } from "src/users/users.entity";
import { ChatGateway } from "src/websockets/websocket.gateway";
import { WebsocketsModule } from "src/websockets/websocket.module";

@Module({
    imports: [TypeOrmModule.forFeature([ChatsEntity, MessageEntity, UsersEntity]),
    WebsocketsModule
],
    controllers: [ChatsController],
    providers: [ChatGateway, ChatsService]
})
export class ChatsModule {}