import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from 'src/shared/interface/auth/auth.intergace';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    } as StrategyOptions); 
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any
  ): Promise<GoogleUser> {
    const { name, emails, photos } = profile;

    if (!emails?.[0]?.value || !photos?.[0]?.value) {
      throw new UnauthorizedException('Invalid Google profile data');
    }

    return {
      email: emails[0].value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
  }
}
