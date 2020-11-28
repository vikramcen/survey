import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  submitted = false;

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    terms: new FormControl('', [Validators.required]),
    question_1: new FormControl('', [Validators.required]),
    question_2: new FormControl('', [Validators.required]),
    question_3: new FormControl('', [Validators.required]),
    q3additional_message: new FormControl('', [Validators.required]),
    q5additional_message1: new FormControl('', [Validators.required]),
    q5additional_message2: new FormControl('', [Validators.required]),
    q5additional_message3: new FormControl('', [Validators.required]),
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

  createSurvey(): void {
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }
    console.log(this.form.value);
    const data = this.form.value;
    this._apiService.create('survey', data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
          this.toastr.success(response.message || 'Survey Successful');
          this.router.navigate(['/all-survey']);
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

}

// https://stackblitz.com/edit/angular-form-wizard?file=src%2Fapp%2Fapp.component.html
