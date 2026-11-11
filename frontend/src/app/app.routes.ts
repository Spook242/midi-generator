import { Routes } from '@angular/router';
import { Home } from './home/home';
import { GeneratorComponent } from './generator/generator';
import { Signup } from './signup/signup';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'generator', component: GeneratorComponent }
];
