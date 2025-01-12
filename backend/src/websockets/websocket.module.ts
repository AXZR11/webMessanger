import { Module } from '@nestjs/common';
import { WebsocketsService } from './websocket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/chats/messages.entity';
import { ChatsService } from 'src/chats/chats.service';
import { ChatsEntity } from 'src/chats/chats.entity';
import { UsersEntity } from 'src/users/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity, ChatsEntity, UsersEntity])],  // Регистрируем сущность
    providers: [WebsocketsService, ChatsService],
    exports: [WebsocketsService]
  })
export class WebsocketsModule {}
