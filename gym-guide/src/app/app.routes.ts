import { Routes } from '@angular/router';
import { ProfilComponent } from './pages/profil/profil.component';

export const routes: Routes = [

  { 
    path: '', 
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent) 
  },

  { path: 'profil', component: ProfilComponent },

  {
    path: 'courses',
    loadComponent: () =>
      import('./pages/courses/courses.component')
        .then(m => m.CoursesComponent)
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./pages/course-detail/course-detail.component')
        .then(m => m.CourseDetailComponent)
  },
  {
    path: 'coaches',
    loadComponent: () =>
      import('./pages/coaches/coaches.component')
        .then(m => m.CoachesComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component')
        .then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/auth/signup.component')
        .then(m => m.SignupComponent)
  },
  {
    path: 'otp',
    loadComponent: () =>
      import('./pages/auth/otp.component')
        .then(m => m.OtpComponent)
  },

  /** ✅ La route correcte MES COURS */
{
  path: 'mes-cours',
  loadComponent: () =>
    import('./components/mes-cours/mes-cours.component')
      .then(m => m.MesCoursComponent)
},




  /** ❗ Toujours mettre ceci *à la fin* */
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
