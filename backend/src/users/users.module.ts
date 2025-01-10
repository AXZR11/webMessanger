import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersEntity } from "./users.entity";
import { FriendshipEntity } from "./friendships.entity";
import { AuthModule } from "src/auth/auth.module";
import { ChatsModule } from "src/chats/chats.module";
import { ChatsEntity } from "src/chats/chats.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, FriendshipEntity, ChatsEntity]),
    AuthModule,
    ChatsModule
],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}