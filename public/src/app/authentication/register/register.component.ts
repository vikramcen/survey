import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private _apiService: ApiService,
    public router: Router,
    private toastr: ToastrService) { }


  ngOnInit(): void {
  }

  get f() {
    return this.form.controls;
  }

  registerUser(): void {
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }

    const data = this.form.value;
    this._apiService.create('register', data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
          this.toastr.success(response.message || 'Registration Successful');
          this.router.navigate(['/login']);
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

}
