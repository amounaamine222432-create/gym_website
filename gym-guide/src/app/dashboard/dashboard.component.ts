import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = null;
  profileCompleted = false;
  showIncompleteMessage = false;

  stats: any = {
    cours: 10,
    coachs: 0,
    seances: 0
  };

  weeklyProgress = [35, 60, 45, 50, 75, 40, 20];

  recentActivity = [
    { title: "Cours 'HIIT Avancé' terminé", date: "Il y a 2 jours" },
    { title: "Nouveau coach assigné", date: "Il y a 5 jours" },
    { title: "Objectif mis à jour", date: "Il y a 1 semaine" }
  ];


  ngOnInit() {

    // ----------------------------
    // ✔ Charger user depuis localStorage
    // ----------------------------
    const userData = localStorage.getItem("user");
    if (userData) {
      this.user = JSON.parse(userData);
    }

    // ----------------------------
    // ✔ Charger statut du profil
    // ----------------------------
    const status = localStorage.getItem("user_status");

    if (status) {
      const userStatus = JSON.parse(status);
      this.profileCompleted = userStatus.is_profile_completed === true;
    } else {
      this.profileCompleted = false;
    }

    // ----------------------------
    // ✔ AFFICHER MESSAGE SEULEMENT 1 FOIS
    // ----------------------------
    const messageAlreadyShown = localStorage.getItem("profile_message_shown");

    if (!this.profileCompleted && !messageAlreadyShown) {
      this.showIncompleteMessage = true;

      // On enregistre que le message a été montré
      localStorage.setItem("profile_message_shown", "true");
    } else {
      this.showIncompleteMessage = false;
    }
  }

}
