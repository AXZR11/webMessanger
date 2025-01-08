import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatsEntity } from "./chats.entity";
import { UsersEntity } from "src/users/users.entity";

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    chatId: string

    @Column()
    senderId: string

    @Column()
    content: string

    @Column('simple-array', { nullable: true })
    readBy: string[]

    @ManyToOne(() => ChatsEntity, (chat) => chat.messages)
    chat: ChatsEntity

    @ManyToOne(() => UsersEntity, (user) => user.id)
    sender: UsersEntity
    
    @CreateDateColumn()
    createdAt: Date
}