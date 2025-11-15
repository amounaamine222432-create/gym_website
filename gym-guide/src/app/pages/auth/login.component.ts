import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container py-5 d-flex justify-content-center align-items-center" style="min-height:80vh;">
    <div class="bg-white p-4 rounded-4 shadow-soft" style="max-width:500px;width:100%;">
      <h3 class="mb-3 text-center fw-bold">Connexion</h3>

      <form #f="ngForm" (ngSubmit)="submit(f)">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" type="email" name="email" ngModel required>
        </div>

        <div class="mb-3">
          <label class="form-label">Mot de passe</label>
          <input class="form-control" type="password" name="password" ngModel required>
        </div>

        <button class="btn btn-brand w-100 rounded-pill py-2 fw-medium" [disabled]="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- ✅ Messages -->
      <div *ngIf="success" class="alert alert-success mt-3 text-center">
        {{ success }}
      </div>
      <div *ngIf="error" class="alert alert-danger mt-3 text-center">
        {{ error }}
      </div>

      <div class="mt-3 text-center small">
        Pas encore de compte ?
        <button class="btn btn-link p-0 fw-semibold text-primary text-decoration-none" (click)="goToSignup()">
          Créer un compte
        </button>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  loading = false;
  success = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  submit(f: NgForm) {
    if (f.invalid) return;

    this.loading = true;
    this.success = '';
    this.error = '';

    const { email, password } = f.value;

    // ✅ Appel API : login par email + mot de passe
    this.api.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = '🎉 Connexion réussie !';

        // ✅ Stockage du token JWT pour les futures requêtes
        if (res?.access) {
          localStorage.setItem('token', res.access);
        }

        // ✅ Redirection vers la page du profil utilisateur
        setTimeout(() => this.router.navigate(['/profil']), 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur connexion:', err);

        // Gestion précise des erreurs
        if (err.status === 401) {
          this.error = '❌ Email ou mot de passe incorrect.';
        } else if (err.status === 400) {
          this.error = '❌ Requête invalide. Vérifie tes informations.';
        } else {
          this.error = '⚠️ Erreur de connexion au serveur.';
        }
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
