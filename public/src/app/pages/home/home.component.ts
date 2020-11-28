import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { DataService } from 'src/app/common/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService, public router: Router, public dataService: DataService) {
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.dataService.setProfileObs(true);
    }
  }

}
