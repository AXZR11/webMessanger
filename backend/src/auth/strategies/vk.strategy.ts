import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-vkontakte";

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
    constructor() {
        super({
            clientID: 'oB3oRmMN5aWQDxcLvegV',
            clientSecret: 'dff846d4dff846d4dff846d422dcdf690dddff8dff846d4b884c6dc96230ae9d916c509',
            callbackURL: 'https://nfhdn1-2a12-5940-1e45--2.ru.tuna.am/api/auth/vk/callback',
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return { oauthId: profile.id, username: profile.displayName, provider: 'vk' }
    }
}