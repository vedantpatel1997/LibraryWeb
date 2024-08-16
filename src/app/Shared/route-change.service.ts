import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteChangeService {
  private routeChangeSubject = new BehaviorSubject<string>('');
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        this.routeChangeSubject.next(currentUrl);
      }
    });
  }

  getRouteChangeObservable(): Observable<string> {
    return this.routeChangeSubject.asObservable();
  }
}
