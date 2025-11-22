from rest_framework import serializers
from .models import Seance
from .models import Review, GeneralFeedback
from django.contrib.auth import get_user_model

User = get_user_model()

class SeanceSerializer(serializers.ModelSerializer):
    coach_nom = serializers.CharField(source="coach.nom", read_only=True)
    coach_prenom = serializers.CharField(source="coach.prenom", read_only=True)
    cours_titre = serializers.CharField(source="cours.titre", read_only=True)

    class Meta:
        model = Seance
        fields = "__all__"
from rest_framework import generics
from api.models import Seance
from api.serializers import SeanceSerializer

class SeancesByCoach(generics.ListAPIView):
    serializer_class = SeanceSerializer

    def get_queryset(self):
        coach_id = self.kwargs["coach_id"]
        return Seance.objects.filter(
            coach_id=coach_id,
            statut="planifie"
        ).order_by("date_seance", "heure_debut")
    

    # ===========================
#  SERIALIZER AVIS COURS + COACH
# ===========================
class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'cours',
            'coach',
            'rating',
            'comment',
            'month',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')


# ===========================
#  SERIALIZER AVIS GÉNÉRAL
# ===========================
class GeneralFeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = GeneralFeedback
        fields = [
            'id',
            'user',
            'month',
            'material',
            'equipment',
            'salle',
            'ambiance',
            'comment'
        ]
