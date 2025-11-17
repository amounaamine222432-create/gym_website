import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FullProfile } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-profil',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container py-5" *ngIf="profile">

    <h3 class="fw-bold mb-4 text-center">👤 Mon Profil</h3>

    <div class="card shadow-soft rounded-4 p-4 mx-auto" style="max-width:600px">

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

      <!-- INFORMATIONS PERSO -->
      <h5 class="fw-bold">Informations personnelles</h5>

      <input class="form-control my-2" [(ngModel)]="profile.first_name" placeholder="Prénom">
      <input class="form-control my-2" [(ngModel)]="profile.last_name" placeholder="Nom">
      <input class="form-control my-2" [(ngModel)]="profile.age" type="number" placeholder="Âge">

      <select class="form-control my-2" [(ngModel)]="profile.sex">
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>

      <hr>

      <!-- COMPTE -->
      <h5 class="fw-bold">Compte utilisateur</h5>
      <input class="form-control my-2" [(ngModel)]="profile.username" placeholder="Nom d'utilisateur">
      <input class="form-control my-2" [(ngModel)]="profile.email" type="email" placeholder="Email">

      <hr>

      <!-- INFORMATIONS SPORTIVES -->
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

      <button class="btn btn-primary mt-3 w-100" (click)="saveChanges()">
        💾 Enregistrer les modifications
      </button>

    </div>

  </div>

  <div *ngIf="!profile" class="text-center text-muted mt-5">
    Chargement du profil...
  </div>
  `
})
export class ProfilComponent implements OnInit {

  profile!: FullProfile;
  selectedPhoto!: File | null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: (res) => {
        console.log("Profil reçu :", res);
        this.profile = res;
      },
      error: (err) => {
        console.error("Erreur profil:", err);
        alert("Impossible de charger votre profil. Vérifiez votre connexion.");
      }
    });
  }

  onPhotoSelected(event: any) {
    this.selectedPhoto = event.target.files[0];
  }

  saveChanges() {
    const formData = new FormData();

    // USER
    formData.append("email", this.profile.email);
    formData.append("username", this.profile.username);

    // PROFILE
    formData.append("first_name", this.profile.first_name);
    formData.append("last_name", this.profile.last_name);
    formData.append("age", String(this.profile.age));
    formData.append("sex", this.profile.sex);

    // PHOTO
    if (this.selectedPhoto) {
      formData.append("photo", this.selectedPhoto);
    }

    // ADHERENT
    if (this.profile.date_naissance)
      formData.append("date_naissance", this.profile.date_naissance);

    formData.append("telephone", this.profile.telephone ?? "");
    formData.append("poids", String(this.profile.poids ?? ""));
    formData.append("taille", String(this.profile.taille ?? ""));
    formData.append("objectif", this.profile.objectif ?? "");
    formData.append("niveau", this.profile.niveau ?? "");
    formData.append("frequence_entrainement", String(this.profile.frequence_entrainement ?? ""));

    this.api.updateFullProfile(formData).subscribe({
      next: () => alert("Profil mis à jour avec succès 🎉"),
      error: (err) => console.error("Erreur mise à jour:", err)
    });
  }

}
