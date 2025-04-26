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
    '/api/Brand',
    '/api/Category',
    '/api/Order',
    '/api/Payment',
    '/api/Review',
    '/api/Product',
    '/api/WishList',
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
