from django.db import models
from django.contrib.auth.models import User

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
