import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const secureUrls = [
    '/api/ClientProfile',
    '/api/ClientInfo',
    '/api/Post',
    '/api/Comment',
    '/api/Vote',
    '/api/CoachCertificate',
    '/api/WorkSample',
    '/api/CoachPortfolio',
    '/api/CoachClients',
    '/api/payment-success',
    '/api/checkout',
    '/api/wish-list',
    '/api/create-category',
    '/api/create-brand',
    '/api/create-product',
  ];
  const shouldAttach = secureUrls.some(url => req.url.includes(url));

  if (token && shouldAttach) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};
