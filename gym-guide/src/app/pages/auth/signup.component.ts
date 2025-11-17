import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container py-5 d-flex justify-content-center align-items-center" style="min-height:80vh;">
    <div class="bg-white p-4 rounded-4 shadow-soft" style="max-width:500px;width:100%;">
      <h3 class="mb-3 text-center fw-bold">Créer un compte</h3>

      <form #f="ngForm" (ngSubmit)="submit(f)" enctype="multipart/form-data">

        <div class="mb-3">
          <label>Nom</label>
          <input name="last_name" class="form-control" ngModel required>
        </div>

        <div class="mb-3">
          <label>Prénom</label>
          <input name="first_name" class="form-control" ngModel required>
        </div>

        <div class="mb-3">
          <label>Âge</label>
          <input type="number" name="age" class="form-control" ngModel required>
        </div>

        <div class="mb-3">
          <label>Sexe</label>
          <select name="sex" class="form-control" ngModel required>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>

        <div class="mb-3">
          <label>Email</label>
          <input type="email" name="email" class="form-control" ngModel required>
        </div>

        <div class="mb-3">
          <label>Pseudo</label>
          <input name="username" class="form-control" ngModel required>
        </div>

        <div class="mb-3">
          <label>Mot de passe</label>
          <input type="password" name="password" class="form-control" ngModel required>
        </div>

        <div class="mb-3">
          <label>Photo de profil</label>
          <input type="file" (change)="onFileSelected($event)" class="form-control">
        </div>

        <button class="btn btn-primary w-100" [disabled]="loading">
          {{ loading ? 'Création...' : 'Créer un compte' }}
        </button>
      </form>

      <div *ngIf="error" class="alert alert-danger mt-3 text-center">
        {{ error }}
      </div>

      <div *ngIf="success" class="alert alert-success mt-3 text-center">
        {{ success }}
      </div>

      <div class="mt-3 text-center small">
        Déjà un compte ?
        <button class="btn btn-link p-0 fw-semibold text-primary" (click)="goToLogin()">
          Se connecter
        </button>
      </div>

    </div>
  </div>
  `
})
export class SignupComponent {
  
  loading = false;
  success = '';
  error = '';
  selectedFile: File | null = null;

  constructor(private api: ApiService, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  submit(f: NgForm) {
    if (f.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = new FormData();

    formData.append('username', f.value.username);
    formData.append('email', f.value.email);
    formData.append('password', f.value.password);
    formData.append('first_name', f.value.first_name);
    formData.append('last_name', f.value.last_name);
    formData.append('age', String(f.value.age)); // Toujours string
    formData.append('sex', f.value.sex);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.api.signup(formData).subscribe({
      next: () => {
        this.success = "Compte créé avec succès !";
        this.loading = false;

        // Petite pause UX
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.loading = false;

        if (err.error?.error) {
          this.error = err.error.error;
        } else {
          this.error = "Erreur lors de l'inscription.";
        }

        console.error(err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
