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

    // 🔐 Connexion → Django
    this.api.login(email, password).subscribe({

      next: (res) => {
        this.loading = false;

        if (res?.access && res?.refresh) {

          // 💾 Stockage tokens
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);

          this.success = '🎉 Connexion réussie !';

          // 📌 Vérifier état du profil : /user/status
          this.api.getStatus().subscribe({

            next: (status) => {
              // Stocker l’utilisateur dans localStorage
            localStorage.setItem("user", JSON.stringify({
                  username: res.username,
                  email: res.email,
                  first_name: res.first_name,
                  last_name: res.last_name,
                  photo: res.photo
              }));

              localStorage.setItem(
                    "user_status",
                    JSON.stringify({ is_profile_completed: res.is_profile_completed })
                  );


              // Redirection → DASHBOARD (toujours)
              this.router.navigate(['/dashboard']);
            },

            // ❌ Erreur getStatus()
            error: (err: any) => {
              this.loading = false;
              console.error('Erreur statut utilisateur :', err);

              if (err.status === 401) {
                this.error = '❌ Email ou mot de passe incorrect.';
              }
              else if (err.status === 400) {
                this.error = '⚠️ Requête invalide. Vérifie les champs.';
              }
              else if (err.status === 0) {
                this.error = '⚠️ Impossible de contacter le serveur.';
              }
              else {
                this.error = '⚠️ Erreur inconnue. Réessayez plus tard.';
              }
            }
          });

        } else {
          this.error = '⚠️ Réponse invalide du serveur.';
        }
      },

      // ❌ Erreur login()
      error: (err: any) => {
        this.loading = false;
        console.error('Erreur connexion :', err);

        if (err.status === 401) {
          this.error = '❌ Email ou mot de passe incorrect.';
        }
        else if (err.status === 400) {
          this.error = '⚠️ Requête invalide. Vérifie les champs.';
        }
        else if (err.status === 0) {
          this.error = '⚠️ Impossible de contacter le serveur.';
        }
        else {
          this.error = '⚠️ Erreur inconnue. Réessayez plus tard.';
        }
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
