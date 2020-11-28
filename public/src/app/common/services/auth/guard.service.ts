import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, public dataService: DataService) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    this.dataService.setProfileObs(true);
    return true;
  }
}
