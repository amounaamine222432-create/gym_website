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

  <button class="btn btn-primary w-100">Créer un compte</button>
</form>


      <div *ngIf="success" class="alert alert-success mt-3 text-center">
        {{ success }}
      </div>
      <div *ngIf="error" class="alert alert-danger mt-3 text-center">
        {{ error }}
      </div>

      <div class="mt-3 text-center small">
        Déjà un compte ?
        <button class="btn btn-link p-0 fw-semibold text-primary text-decoration-none" (click)="goToLogin()">
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

  constructor(private api: ApiService, private router: Router) {}

  // ✅ Fonction d'inscription
selectedFile!: File;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

submit(f: NgForm) {
  if (f.invalid) return;

  const formData = new FormData();
  formData.append('username', f.value.username);
  formData.append('email', f.value.email);
  formData.append('password', f.value.password);
  formData.append('first_name', f.value.first_name);
  formData.append('last_name', f.value.last_name);
  formData.append('age', f.value.age);
  formData.append('sex', f.value.sex);

  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }

  this.api.signup(formData).subscribe({
    next: () => {
      alert("Compte créé avec succès !");
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error(err);
      alert("Erreur lors de l'inscription.");
    }
  });
}


  // ✅ Redirection vers la page de connexion
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
