import { bootstrapApplication } from '@angular/platform-browser';
import { HomeComponent } from './app/router-outlet/homepage/home';
import { appConfig } from './app/app.config';

bootstrapApplication(HomeComponent, appConfig).catch(err => console.error(err));

