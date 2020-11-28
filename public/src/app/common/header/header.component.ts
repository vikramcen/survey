import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  constructor(public auth: AuthService, public router: Router, public dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.getProfileObs().subscribe(profile => this.isLoggedIn = profile);
  }

  logout() {
    this.auth.logout();
    this.dataService.setProfileObs(false);
  }

  openSurvey() {
    window.location.href = '/#/survey';
    window.location.reload();
  }
}
