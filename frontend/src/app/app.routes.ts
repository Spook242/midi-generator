import { Routes } from '@angular/router';
import { Home } from './home/home';
import { GeneratorComponent } from './generator/generator';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'generator', component: GeneratorComponent }
];
