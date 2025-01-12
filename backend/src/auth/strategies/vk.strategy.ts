import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
  constructor() {
    super({
      clientID: '013b61f0013b61f0013b61f094021c3c420013b013b61f066b88466ba66d696129044fe',
      clientSecret: 'cadaQWrIYUk0J0SwT66K',
      callbackURL: 'https://wcuqeq-178-65-23-254.ru.tuna.am/api/auth/vk/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('VK Profile:', profile);
    return profile;
  }
}
