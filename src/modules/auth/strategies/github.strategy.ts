import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-github2';
import { GitHubUser } from 'src/shared/interface/auth/auth.intergace';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): Promise<GitHubUser> {
    const { username, emails, photos } = profile;

    if (!emails?.length || !photos?.length) {
      throw new UnauthorizedException('Invalid GitHub profile data');
    }

    return {
      username,
      email: emails[0].value,
      avatar: photos[0].value,
      accessToken,
    };
  }
}
