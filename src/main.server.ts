import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { HomeComponent } from './app/router-outlet/homepage/home';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(HomeComponent, config, context);

export default bootstrap;
