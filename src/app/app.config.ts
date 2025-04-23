// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { SocialAuthService, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { socialLoginConfig } from './services/social-login.config'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Social login provider setup
    { provide: 'SocialAuthServiceConfig', useValue: socialLoginConfig },
    SocialAuthService,
    
  ],
};
