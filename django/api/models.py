from django.db import models
from django.contrib.auth.models import User


# ===========================
#  PROFIL UTILISATEUR
# ===========================
class Profile(models.Model):

    SEX_CHOICES = (
        ("Homme", "Homme"),
        ("Femme", "Femme"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    age = models.IntegerField(null=True, blank=True)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, blank=True)
    photo = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.user.username


# ===========================
#  ADHERENT – INFOS SPORTIVES
# ===========================
class Adherent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_naissance = models.DateField(null=True, blank=True)
    telephone = models.CharField(max_length=15, null=True, blank=True)
    poids = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    taille = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    objectif = models.CharField(max_length=100, null=True, blank=True)
    niveau = models.CharField(max_length=20, null=True, blank=True)
    frequence_entrainement = models.IntegerField(null=True, blank=True)

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
    statut = models.CharField(max_length=20, choices=[
        ('planifie', 'planifié'),
        ('effectue', 'effectué'),
        ('annule', 'annulé')
    ])

    def __str__(self):
        return f"{self.cours.titre} ({self.date_seance})"


# ===========================
#  LIEN COACH–COURS
# ===========================
class CoachCours(models.Model):
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('coach', 'cours')
        verbose_name = "Coach du cours"
        verbose_name_plural = "Coachs des cours"

    def __str__(self):
        return f"{self.coach.nom} → {self.cours.titre}"
