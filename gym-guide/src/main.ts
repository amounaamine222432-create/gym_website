import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Animation On Scroll (AOS)
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialisation des animations
AOS.init({
  duration: 800, // Durée de l’animation
  once: true     // Ne rejoue pas à chaque scroll
});

// Lancement de l’application Angular
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

