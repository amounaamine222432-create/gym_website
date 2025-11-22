import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = null;

  // 🔥 abonnement actif Stripe
  subscription: any = null;
  hasActiveSubscription: boolean = false;

  // 🔥 état du profil
  profileCompleted = false;
  showIncompleteMessage = false;

  // ⚡ Stats dynamiques (on les remplira après)
  stats = {
  cours: 0,
  coachs: 0,
  seances: 0
};


  weeklyProgress = [35, 60, 45, 50, 75, 40, 20];

  recentActivity = [
    { title: "Cours 'HIIT Avancé' terminé", date: "Il y a 2 jours" },
    { title: "Nouveau coach assigné", date: "Il y a 5 jours" },
    { title: "Objectif mis à jour", date: "Il y a 1 semaine" }
  ];

  // 🔥 AJOUT STEP 7
  coachDuMois: any[] = [];
  nextSeances: any[] = [];
  weekSeances: any[] = [];

  constructor(
    private subService: SubscriptionService,
    private dash: DashboardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // Vérification retour Stripe
    this.route.queryParams.subscribe(params => {
      const success = params['success'];
      const session_id = params['session_id'];

      if (success && session_id) {
        console.log("Paiement Stripe confirmé !");
        this.refreshSubscription();
      }
    });

    // Chargement normal
    this.refreshSubscription();

    // Charger infos utilisateur
    const userData = localStorage.getItem("user");
    if (userData) this.user = JSON.parse(userData);

    // Vérifier si profil complet
    const status = localStorage.getItem("user_status");
    this.profileCompleted = status ? JSON.parse(status).is_profile_completed : false;

    const shown = localStorage.getItem("profile_message_shown");
    if (!this.profileCompleted && !shown) {
      this.showIncompleteMessage = true;
      localStorage.setItem("profile_message_shown", "true");
    }

    // 🔥 Charger Coach du mois + Séances + Agenda
    this.loadDashboardExtras();
  }

  loadDashboardExtras() {
    this.dash.getCoachDuMois().subscribe(r => this.coachDuMois = r as any[]);
    this.dash.getNextSeances().subscribe(r => this.nextSeances = r as any[]);
    this.dash.getWeekSeances().subscribe(r => this.weekSeances = r as any[]);
    
  this.dash.getStats().subscribe(r => this.stats = r);
}

  refreshSubscription() {
    this.subService.getMySubscription().subscribe({
      next: (res) => {
        if (res.active) {
          this.subscription = res;
          this.hasActiveSubscription = true;
        } else {
          this.hasActiveSubscription = false;
        }
      },
      error: (err) => console.error("Erreur lors de l’actualisation abonnement :", err)
    });
  }

  // Progression abonnement
  calcProgress(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const now = Date.now();

    if (now <= s) return 0;
    if (now >= e) return 100;

    return ((now - s) / (e - s)) * 100;
  }


}
