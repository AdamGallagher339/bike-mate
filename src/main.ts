import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAFnq6ZrUXxuj18D_bgp_f2oiSvhZSM4yM",
  authDomain: "bikemate-136e8.firebaseapp.com",
  projectId: "bikemate-136e8",
  storageBucket: "bikemate-136e8.firebasestorage.app",
  messagingSenderId: "336063401187",
  appId: "1:336063401187:web:c76e6a95bc240548fe49d6",
  measurementId: "G-08CR395KEY"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(IonicModule.forRoot()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
});
