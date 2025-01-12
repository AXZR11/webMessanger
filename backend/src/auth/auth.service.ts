import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { verifyVkToken } from "./utils/verify-vk-token";
import { verifyYandexToken } from "./utils/verify-yandex-token";
import axios from "axios";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async register(username: string, email: string, password: string): Promise<UsersEntity> {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            status: 'offline'
        })

        return this.usersRepository.save(user)
    }

    async login(username: string, password: string): Promise<{ accessToken: string, userId: string }> {
        const user = await this.usersRepository.findOne({ where: { username } })

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error('Invalid credentials')
        }

        const payload = { username: user.username, sub: user.id }
        const accessToken = this.jwtService.sign(payload)

        return { accessToken, userId: user.id }
    }

    async oauthLogin(oauthProvider: string, accessToken: string, refreshToken: string): Promise<{ accessToken: string, userId: string }> {
        let oauthId: string;
        let username: string;
    
        console.log('OAuth Provider:', oauthProvider);
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
    
        try {
            if (oauthProvider === 'vk') {
                const vkData = await verifyVkToken(accessToken);
                oauthId = vkData.id.toString();
                username = vkData.name || vkData.id.toString();
            } else if (oauthProvider === 'yandex') {
                const yandexData = await verifyYandexToken(accessToken);
                oauthId = yandexData.id.toString();
                username = yandexData.email || yandexData.id.toString();
            } else {
                throw new Error('Unsupported OAuth provider');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            
            if (error.message.includes('expired_token') && refreshToken) {
                console.log('Attempting to refresh token...');
                const newAccessToken = await this.refreshYandexToken(refreshToken);
                return this.oauthLogin(oauthProvider, newAccessToken, refreshToken);
            }
            
            throw new Error('Failed to verify OAuth token');
        }
    
        console.log('OAuth ID:', oauthId);
        console.log('Username:', username);
    
        let user = await this.usersRepository.findOne({
            where: { oauthProvider, oauthId },
        });
    
        if (!user) {
            user = this.usersRepository.create({
                oauthProvider,
                oauthId,
                username,
                status: 'offline',
            });
    
            await this.usersRepository.save(user);
        }
    
        const payload = { sub: user.id, oauthId };
        const newAccessToken = this.jwtService.sign(payload);
    
        console.log('Generated JWT Access Token:', newAccessToken);
    
        return { accessToken: newAccessToken, userId: user.id };
    }
    
    async refreshYandexToken(refreshToken: string): Promise<string> {
        try {
            const response = await axios.post('https://oauth.yandex.ru/token', {
                client_id: '037d9dc17bd042e5b3d1394bbd4eb056',
                client_secret: '8b059f16046a4fbea62fbc47ef9f066a',
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            });
    
            return response.data.access_token;
        } catch (error) {
            console.error('Error refreshing Yandex token:', error);
            throw new Error('Failed to refresh Yandex token');
        }
    }    

    async validateUser(oauthId: string, provider: string) {
        return this.usersService.findByOAuth(oauthId, provider)
    }

    async loginJwt(user: any) {
        const payload = { sub: user.id, username: user.username }
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}