import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  templateUrl: './success.component.html'
})
export class SuccessComponent implements OnInit {

  session_id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    // ✔ Stripe redirige sur /paiement-retour?session_id=XXXX
    this.session_id = this.route.snapshot.queryParams['session_id'];

    if (!this.session_id) {
      console.error("❌ session_id manquant.");
      return;
    }

    console.log("🎉 Paiement Stripe réussi :", this.session_id);

    // ❤️ Webhook Stripe active déjà l’abonnement côté backend
    // 👉 Donc on n’a rien à valider ici.

    // 🧹 Nettoyage du localStorage
    localStorage.removeItem("subscription_id");

    // ⏳ Petite pause visuelle puis redirection
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }
}
