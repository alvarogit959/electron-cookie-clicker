import { Routes } from '@angular/router';
import { HomeComponent } from './router-outlet/homepage/home';
import { Scores } from './router-outlet/scoresfolder/scores';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'scores', component: Scores },
];

