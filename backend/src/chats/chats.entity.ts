import { UsersEntity } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MessageEntity } from "./messages.entity";

@Entity({name: 'chats'})
export class ChatsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    name: string

    @Column({ default: false })
    isGroup: boolean

    @ManyToMany(() => UsersEntity, (user) => user.chats)
    participants: UsersEntity[]

    @OneToMany(() => MessageEntity, (message) => message.chat)
    messages: MessageEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}