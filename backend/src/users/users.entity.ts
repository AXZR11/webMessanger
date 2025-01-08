import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { FriendshipEntity } from './friendships.entity';
import { ChatsEntity } from 'src/chats/chats.entity';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    username: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    password: string

    @Column({ nullable: true })
    avatarUrl: string

    @Column({ nullable: true })
    oauthProvider: string

    @Column({ nullable: true })
    oauthId: string

    @Column({ default: 'offline' })
    status: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => FriendshipEntity, (friendship) => friendship.requester)
    sentFriendRequests: FriendshipEntity[]

    @OneToMany(() => FriendshipEntity, (friendship) => friendship.receiver)
    receivedFriendRequests: FriendshipEntity[]

    @ManyToMany(() => ChatsEntity, (chat) => chat.participants)
    @JoinTable()
    chats: ChatsEntity[]
}
