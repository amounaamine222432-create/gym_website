import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserProfile } from '../../models';


@Component({
  standalone: true,
  selector: 'app-profil',
  imports: [CommonModule],
  template: `
  <div class="container py-5">
    <h3 class="fw-bold mb-4 text-center">👤 Mon Profil</h3>

    <div class="card shadow-soft rounded-4 p-4 mx-auto" style="max-width:600px">

  <div class="text-center mb-4">
    <img *ngIf="profile?.photo"
         [src]="profile.photo"
         class="rounded-circle shadow"
         style="width:120px; height:120px; object-fit:cover;">

    <div *ngIf="!profile?.photo" class="text-muted fst-italic">
      Aucun photo de profil
    </div>
  </div>

  <p><strong>ID :</strong> {{ profile?.id }}</p>
  <p><strong>Email :</strong> {{ profile?.email }}</p>
  <p><strong>Nom d'utilisateur :</strong> {{ profile?.username }}</p>

  <hr>

  <p><strong>Nom :</strong> {{ profile?.last_name }}</p>
  <p><strong>Prénom :</strong> {{ profile?.first_name }}</p>
  <p><strong>Âge :</strong> {{ profile?.age }} ans</p>
  <p><strong>Sexe :</strong> {{ profile?.sex }}</p>

  <hr>

  <p>
    <strong>Date d'inscription :</strong>
    {{ profile?.date_joined | date:'long' }}
  </p>

</div>

  `
})
export class ProfilComponent implements OnInit {
  profile!: UserProfile;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: (res) => this.profile = res,
      error: (err) => console.error("Erreur profil:", err)
    });
  }
}

