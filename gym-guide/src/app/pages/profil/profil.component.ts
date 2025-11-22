import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FullProfile } from '../../models';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profil',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">

  <h3 class="fw-bold mb-4 text-center">👤 Mon Profil</h3>

  <div class="card shadow rounded-4 p-4 mx-auto" style="max-width:600px">

    <!-- PHOTO -->
    <div class="text-center mb-4">

      <img *ngIf="profile.photo"
           [src]="profile.photo"
           class="rounded-circle shadow"
           style="width:140px; height:140px; object-fit:cover;">

      <div *ngIf="!profile.photo" class="text-muted fst-italic">
        Aucune photo de profil
      </div>

      <input type="file" class="form-control mt-3" (change)="onPhotoSelected($event)">
    </div>

    <!-- Informations personnelles -->
    <h5 class="fw-bold">Informations personnelles</h5>
      <input class="form-control my-2"
       [(ngModel)]="profile.first_name"
       (ngModelChange)="triggerAutoSave()"
       placeholder="Prénom">

<!-- Nom -->
<input class="form-control my-2"
       [(ngModel)]="profile.last_name"
       (ngModelChange)="triggerAutoSave()"
       placeholder="Nom">

<!-- Age -->
<input class="form-control my-2"
       type="number"
       [(ngModel)]="profile.age"
       (ngModelChange)="triggerAutoSave()"
       placeholder="Âge">

<!-- Sexe -->
<select class="form-control my-2"
        [(ngModel)]="profile.sex"
        (ngModelChange)="triggerAutoSave()">
  <option value="Homme">Homme</option>
  <option value="Femme">Femme</option>
</select>
    <hr>

    <!-- Compte utilisateur -->
    <h5 class="fw-bold">Compte utilisateur</h5>

    <!-- USERNAME -->
<input class="form-control my-2"
       [(ngModel)]="profile.username"
       (ngModelChange)="triggerAutoSave()"
       placeholder="Nom d'utilisateur">

<!-- EMAIL -->
<input class="form-control my-2"
       type="email"
       [(ngModel)]="profile.email"
       (ngModelChange)="triggerAutoSave()"
       placeholder="Email">

    <hr>

    <!-- Informations sportives -->
    <h5 class="fw-bold">Informations sportives</h5>

    <input class="form-control my-2" type="date" [(ngModel)]="profile.date_naissance">
    <input class="form-control my-2" [(ngModel)]="profile.telephone" placeholder="Téléphone">

    <input class="form-control my-2" type="number" step="0.1"
           [(ngModel)]="profile.poids" placeholder="Poids (kg)">

    <input class="form-control my-2" type="number" step="0.01"
           [(ngModel)]="profile.taille" placeholder="Taille (m)">

    <input class="form-control my-2" [(ngModel)]="profile.objectif" placeholder="Objectif sportif">
    <input class="form-control my-2" [(ngModel)]="profile.niveau" placeholder="Niveau sportif">

    <input class="form-control my-2" type="number"
           [(ngModel)]="profile.frequence_entrainement"
           placeholder="Fréquence / semaine">
<div class="text-end small mt-2">
  <span *ngIf="isSaving" class="text-secondary">
    ⏳ Sauvegarde...
  </span>

  <span *ngIf="isSaved" class="text-success fw-bold">
    ✔ Enregistré
  </span>
</div>

    <button class="btn btn-primary mt-3 w-100" (click)="saveChanges(true)">
      💾 Enregistrer les modifications
    </button>

  </div>

</div>

<div *ngIf="!profile" class="text-center text-muted mt-5">
  Chargement du profil...
</div>
  `,
  styles: [`
  .page-container {
      margin-top: 120px;
  }
`]
})
export class ProfilComponent implements OnInit {

  profile!: FullProfile;
  selectedPhoto: File | null = null;

  // Auto-save
  private autoSaveTimer: any = null;
  isSaving = false;
  isSaved = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: (res) => { this.profile = res; },
      error: () => alert("Impossible de charger votre profil.")
    });
  }

  // -----------------------------------
  // 🔥 AUTO-SAVE when typing
  // -----------------------------------
  triggerAutoSave() {
    this.isSaved = false;
    this.isSaving = true;

    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    // Sauvegarde après 1 seconde d'inactivité
    this.autoSaveTimer = setTimeout(() => {
      this.saveChanges(false); // false = pas de redirection
    }, 1000);
  }

  // -----------------------------------
  // 🔥 CHANGEMENT DE PHOTO → SAVE DIRECTE
  // -----------------------------------
  onPhotoSelected(event: any) {
    this.selectedPhoto = event.target.files[0];
    this.saveChanges(false); // sauvegarde instantanée
  }

  // -----------------------------------
  // 🔥 SAUVEGARDE COMPLETE
  // redirectAfter = true → bouton Enregistrer
  // redirectAfter = false → autosave
  // -----------------------------------
  saveChanges(redirectAfter: boolean = false) {

    if (!this.profile) return;

    const formData = new FormData();

    // USER
    formData.append("email", this.profile.email);
    formData.append("username", this.profile.username);

    // PROFILE
    formData.append("first_name", this.profile.first_name);
    formData.append("last_name", this.profile.last_name);
    formData.append("age", String(this.profile.age));
    formData.append("sex", this.profile.sex);

    if (this.selectedPhoto) {
      formData.append("photo", this.selectedPhoto);
    }

    // ADHERENT
    if (this.profile.date_naissance) {
      const dateFormatted = new Date(this.profile.date_naissance)
        .toISOString().slice(0, 10);
      formData.append("date_naissance", dateFormatted);
    }

    formData.append("telephone", this.profile.telephone ?? "");
    formData.append("poids", String(this.profile.poids ?? ""));
    formData.append("taille", String(this.profile.taille ?? ""));
    formData.append("objectif", this.profile.objectif ?? "");
    formData.append("niveau", this.profile.niveau ?? "");
    formData.append(
      "frequence_entrainement",
      String(this.profile.frequence_entrainement ?? "")
    );
        console.log("🔍 DEBUG FormData :");
formData.forEach((v, k) => console.log(k, v));

   this.api.updateFullProfile(formData).subscribe({

  next: (res: any) => {

    // --- FIN chargement ---
    this.isSaving = false;
    this.isSaved = true;

    // --- Mettre à jour la photo SI Changée ---
    if (res.photo_url) {
      this.profile.photo = res.photo_url;
    }

    // --- Mise à jour du statut profil ---
    localStorage.setItem(
      "user_status",
      JSON.stringify({ is_profile_completed: res.is_profile_completed })
    );

    // --- Recharger le profil depuis API pour obtenir les dernières valeurs ---
    this.api.getProfile().subscribe((updated: any) => {

      // Mise à jour interface
      this.profile = updated;

      // Mise à jour du localStorage utilisateur pour Dashboard
      localStorage.setItem("user", JSON.stringify(updated));

      // Redirection après clic sur "Enregistrer le profil"
      if (redirectAfter) {
        alert("Profil mis à jour avec succès !");
        this.router.navigate(['/dashboard']);
      }
    });

  },

  error: () => {
    this.isSaving = false;
    this.isSaved = false;
    alert("Erreur lors de la sauvegarde.");
  }

});

  }
}
