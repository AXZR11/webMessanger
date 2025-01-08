import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-yandex";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
    constructor() {
        super({
            clientID: '037d9dc17bd042e5b3d1394bbd4eb056',
            clientSecret: '8b059f16046a4fbea62fbc47ef9f066a',
            callbackURL: 'http://localhost:3000/api/auth/yandex/redirect',
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return {
            oauthId: profile.id,
            username: profile.displayName,
            provider: 'yandex',
            accessToken,
            refreshToken,
        };
    }
}
