import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getProfileObs(): Observable<boolean> {
    return this.userLoggedIn$.asObservable();
  }

  setProfileObs(profile: boolean) {
    this.userLoggedIn$.next(profile);
  }
}
