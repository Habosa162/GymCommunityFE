// src/app/app.config.ts
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ChatbotComponent } from './presentation/ChatBot/chatbot.component';
import { socialLoginConfig } from './services/social-login.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),

    // Social login provider setup
    { provide: 'SocialAuthServiceConfig', useValue: socialLoginConfig },
    SocialAuthService,
    provideHttpClient(),
    { provide: ChatbotComponent, useClass: ChatbotComponent },
  ],
};
