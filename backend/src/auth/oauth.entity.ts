import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('oauth_tokens')
export class OAuthTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string

    @Column()
    provider: string

    @Column()
    accessToken: string

    @Column({ nullable: true })
    refreshToken: string

    @Column({ nullable: true })
    expiresAt: Date

    @CreateDateColumn()
    createdAt: Date
}