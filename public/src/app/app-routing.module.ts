import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { SurveyComponent } from './pages/survey/survey.component';

import { GuardService as AuthGuard } from './common/services/auth/guard.service';
import { AllSurveysComponent } from './pages/all-surveys/all-surveys.component';
import { CreateSurveyComponent } from './pages/create-survey/create-survey.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'all-survey', canActivate: [AuthGuard], component: AllSurveysComponent },
  { path: 'create-survey', canActivate: [AuthGuard], component: CreateSurveyComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      // Tell the router to use the hash instead of HTML5 pushstate.
      useHash: true,
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
