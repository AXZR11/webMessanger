import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatsEntity } from "./chats.entity";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";

@Module({
    imports: [TypeOrmModule.forFeature([ChatsEntity])],
    controllers: [ChatsController],
    providers: [ChatsService]
})
export class ChatsModule {}