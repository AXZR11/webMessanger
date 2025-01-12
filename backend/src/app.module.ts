import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { UsersEntity } from './users/users.entity';
import { WebsocketsModule } from './websockets/websocket.module';
import { FriendshipEntity } from './users/friendships.entity';
import { ChatsEntity } from './chats/chats.entity';
import { MessageEntity } from './chats/messages.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgresChat',
      port: 5432,
      username: 'postgres',
      password: '232332321',
      database: 'chat',
      entities: [UsersEntity, FriendshipEntity, ChatsEntity, MessageEntity
      ],
      synchronize: true
    }),
    TypeOrmModule.forFeature([UsersEntity, FriendshipEntity, ChatsEntity, MessageEntity]),
    UsersModule,
    AuthModule,
    ChatsModule,
    WebsocketsModule,
    WebsocketsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
