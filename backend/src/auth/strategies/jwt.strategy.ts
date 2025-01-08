import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNjEzMzE5OSwiaWF0IjoxNzM2MTMzMTk5fQ.-ofMIrqKrXOOaUYwgNOAHunp_jYICoTn8rWJYbA13xM'
        })
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username }
    }
}