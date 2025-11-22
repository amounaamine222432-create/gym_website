import { Routes } from '@angular/router';

export const routes: Routes = [

  // PAGE ACCUEIL
  { 
    path: '', 
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(m => m.HomeComponent)
  },

  // PROFIL (protected ? → à toi de choisir)
  {
    path: 'profil',
    loadComponent: () =>
      import('./pages/profil/profil.component')
        .then(m => m.ProfilComponent)
  },

  // COURS
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

  // COACHS
  {
    path: 'coaches',
    loadComponent: () =>
      import('./pages/coaches/coaches.component')
        .then(m => m.CoachesComponent)
  },

  // CONTACT
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component')
        .then(m => m.ContactComponent)
  },

  // AUTHENTIFICATION
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

  // MES COURS
  {
    path: 'mes-cours',
    loadComponent: () =>
      import('./components/mes-cours/mes-cours.component')
        .then(m => m.MesCoursComponent)
  },

  // DASHBOARD
  {
    path: 'dashboard',
    canActivate: [() => !!localStorage.getItem('access')],
    loadComponent: () =>
      import('./dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // PAIEMENT
  {
    path: 'payer',
    loadComponent: () =>
      import('./payer/payer.component')
        .then(m => m.PayerComponent)
  },

  // ABONNEMENT
  {
    path: 'subscription',
    loadComponent: () =>
      import('./subscription/subscription.component')
        .then(m => m.SubscriptionComponent)
  },

  // SUCCESS PAIEMENT
  {
    path: 'success',
    loadComponent: () =>
      import('./success/success.component')
        .then(m => m.SuccessComponent)
  },

  // CATCH ALL
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
