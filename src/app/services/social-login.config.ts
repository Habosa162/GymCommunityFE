// src/app/core/auth/social-login.config.ts
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

export const socialLoginConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('542482302983-oeddeor9j8rirdjnf99oe2um6sucgi58.apps.googleusercontent.com'),
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('FACEBOOK_APP_ID'),
    },
  ],
};
