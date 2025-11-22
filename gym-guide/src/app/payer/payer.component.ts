import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeService } from '../services/stripe.service';

@Component({
  selector: 'app-payer',
  standalone: true,
  templateUrl: './payer.component.html'
})
export class PayerComponent implements OnInit {

  amount: number = 0;
  subscription_id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private stripe: StripeService   // ✅ On utilise Stripe, pas Paymee
  ) {}

  ngOnInit() {
    // Récupération du montant envoyé depuis subscription.component
    this.amount = Number(this.route.snapshot.queryParams['price']);

    // Récupération de l'ID abonnement stocké dans localStorage
    this.subscription_id = Number(localStorage.getItem("subscription_id"));

    if (!this.amount || !this.subscription_id) {
      alert("Erreur : informations de paiement manquantes.");
      return;
    }

    console.log("💰 AMOUNT =", this.amount);
    console.log("🆔 SUBSCRIPTION ID =", this.subscription_id);
  }

  payer() {

    if (!this.amount || !this.subscription_id) {
      alert("Erreur : abonnement introuvable.");
      return;
    }

    console.log("📤 Envoi Stripe →", {
      subscription_id: this.subscription_id,
      amount: this.amount
    });

    // 👉 Stripe checkout session
    this.stripe.createPayment(this.subscription_id).subscribe({
      next: (res: any) => {
        console.log("✔️ REPONSE STRIPE =", res);

        if (res.payment_url) {
          window.location.href = res.payment_url;   // 🔥 Redirection Stripe Checkout
        } else {
          console.error("❌ Réponse Stripe invalide :", res);
          alert("Erreur Stripe : URL introuvable.");
        }
      },
      error: (err) => {
        console.error("❌ Erreur Stripe :", err);
        alert(err.message || "Erreur lors de la création du paiement.");
      }
    });
  }
}
