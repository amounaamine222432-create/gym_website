from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta, date
from django.contrib.auth import get_user_model
from datetime import date
month = date.today().replace(day=1)

User = get_user_model()
# ===========================
#  PROFIL UTILISATEUR
# ===========================
class Profile(models.Model):

    SEX_CHOICES = (
        ("Homme", "Homme"),
        ("Femme", "Femme"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Champs modifiables
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    age = models.IntegerField(null=True, blank=True)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, blank=True)

    # Facultatif → ne doit PAS bloquer l'is_completed()
    photo = models.ImageField(upload_to='profiles/', null=True, blank=True)

    # État global
    is_profile_completed = models.BooleanField(default=False)

    def is_completed(self):
        """⚡ Vérifie si le profil est complet (sans considérer la photo)"""
        return all([
            self.first_name,
            self.last_name,
            self.age,
            self.sex,
        ])

    def __str__(self):
        return self.user.username



class Adherent(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    date_naissance = models.DateField(null=True, blank=True)
    telephone = models.CharField(max_length=15, null=True, blank=True)
    poids = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    taille = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    objectif = models.CharField(max_length=100, null=True, blank=True)
    niveau = models.CharField(max_length=20, null=True, blank=True)
    frequence_entrainement = models.IntegerField(null=True, blank=True)

    def is_completed(self):
        """⚡ Vérifie si l'adhérent a complété ses infos sportives"""
        return all([
            self.date_naissance,
            self.telephone,
            self.poids,
            self.taille,
            self.objectif,
            self.niveau,
            self.frequence_entrainement
        ])

    def __str__(self):
        return f"Adhérent {self.user.username}"

# ===========================
#  COURS
# ===========================
class Cours(models.Model):
    titre = models.CharField(max_length=100)
    description = models.TextField()
    categorie = models.CharField(max_length=50)
    capacite = models.PositiveIntegerField()
    niveau = models.CharField(max_length=20)
    objectif_cible = models.CharField(max_length=100)
    photo = models.CharField(max_length=255)

    def __str__(self):
        return self.titre


# ===========================
#  PARTICIPATION COURS
# ===========================
class CoursParticipation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    date_inscription = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'cours'], name='unique_user_cours')
        ]
        ordering = ['-date_inscription']

    def __str__(self):
        return f"{self.user.username} -> {self.cours.titre}"


# ===========================
#  COACH
# ===========================
class Coach(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    specialite = models.CharField(max_length=50)
    experience = models.IntegerField()  # en années
    photo = models.CharField(max_length=255)
    start_shift_day = models.IntegerField(default=1)  # Jour départ (1-6)

    def __str__(self):
        return f"{self.prenom} {self.nom}"


# ===========================
#  SEANCES
# ===========================
class Seance(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    coach = models.ForeignKey(Coach, on_delete=models.SET_NULL, null=True)
    date_seance = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    salle = models.CharField(max_length=50)

    # ➕ AJOUTER CE CHAMP
    clients = models.ManyToManyField(User, blank=True, related_name="seances_reservees")

    statut = models.CharField(
        max_length=20,
        choices=[
            ('planifie', 'planifié'),
            ('effectue', 'effectué'),
            ('annule', 'annulé')
        ],
        default="planifie"
    )

    def __str__(self):
        return f"{self.cours.titre} ({self.date_seance})"



# ===========================
#  LIEN COACH–COURS
# ===========================
class CoachCours(models.Model):
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, null=True, blank=True)

    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('coach', 'cours')
        verbose_name = "Coach du cours"
        verbose_name_plural = "Coachs des cours"

    def __str__(self):
        return f"{self.coach.nom} → {self.cours.titre}"
    
   
class Subscription(models.Model):
    PLAN_CHOICES = (
        ("monthly", "Mensuel"),
        ("quarterly", "Trimestriel"),
        ("annual", "Annuel"),
    )

    STATUS = (
        ("pending", "En attente de paiement"),
        ("active", "Actif"),
        ("expired", "Expiré"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    transaction_id = models.CharField(max_length=200, null=True, blank=True)

    def activate(self):
        self.start_date = date.today()

        if self.plan == "monthly":
            self.end_date = self.start_date + timedelta(days=30)
        elif self.plan == "quarterly":
            self.end_date = self.start_date + timedelta(days=90)
       
        elif self.plan == "annual":
            self.end_date = self.start_date + timedelta(days=365)

        self.status = "active"
        self.save()

    def __str__(self):
        return f"{self.user.username} - {self.plan} ({self.status})"

class ClientCoachSelection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, null=True, blank=True)
    month = models.CharField(max_length=7)  # "2025-11"

    class Meta:
        unique_together = ('user', 'cours', 'month')

    def __str__(self):
        return f"{self.user.username} - {self.cours.titre} - {self.month}"


class Review(models.Model):
    """
    Un avis par cours + coach par mois.
    Exemple : un adhérent peut donner un avis sur BodyPump + Coach Karim
    une fois par mois.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, null=True, blank=True)

    rating = models.IntegerField()
    comment = models.TextField(blank=True)

    # Mois du format AAAA-MM-01
    month = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'cours', 'coach', 'month')

    def __str__(self):
        return f"{self.user.username} → {self.cours.titre} ({self.coach.nom})"


# ===========================
#  AVIS GÉNÉRAL MENSUEL
# ===========================
class GeneralFeedback(models.Model):
    """
    Un avis global par mois sur :
    - matériel
    - équipements
    - ambiance
    - salles
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.DateField()

    material = models.IntegerField(null=True)
    equipment = models.IntegerField(null=True)
    salle = models.IntegerField(null=True)
    ambiance = models.IntegerField(null=True)

    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'month')

    def __str__(self):
                return f"Avis général {self.user.username} ({self.month})"



class AIVideoCache(models.Model):
    cours = models.OneToOneField("Cours", on_delete=models.CASCADE, related_name="ai_videos")
    videos = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Videos Cache for {self.cours.titre}"

class AIVideoCache(models.Model):
    cours = models.OneToOneField("Cours", on_delete=models.CASCADE, related_name="ai_videos")
    videos = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Videos for {self.cours.titre}"
