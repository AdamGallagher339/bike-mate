import { IonicModule } from '@ionic/angular';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig = {
  providers: [
    IonicModule.forRoot(),
    provideHttpClient(),
    provideRouter(routes)
  ]
};
