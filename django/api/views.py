from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile

# ---------------------------------------------------------
# 1️⃣ INSCRIPTION (signup)
# ---------------------------------------------------------
@api_view(['POST'])
def register(request):

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    first_name = request.data.get('first_name')
    last_name  = request.data.get('last_name')
    age = request.data.get('age')
    sex = request.data.get('sex')
    photo = request.FILES.get('photo', None)

    if not all([username,email, password, first_name, last_name, age, sex]):
        return Response({'error': 'Tous les champs sont requis.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    Profile.objects.create(
        user=user,
        first_name=first_name,
        last_name=last_name,
        age=int(age),
        sex=sex,
        photo=photo
    )

    return Response({"message": "Compte créé !"}, status=201)


# ---------------------------------------------------------
# 2️⃣ LOGIN PAR EMAIL (email + password)
# ---------------------------------------------------------

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError({"detail": "Email et mot de passe requis."})

        users = User.objects.filter(email=email)
        if not users.exists():
            raise serializers.ValidationError({"detail": "Email introuvable."})

        user = users.first()

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Mot de passe incorrect."})

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer



# ---------------------------------------------------------
# 3️⃣ PROFIL UTILISATEUR (protégé)
# --------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile = Profile.objects.get(user=user)

    return Response({
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "age": profile.age,
        "sex": profile.sex,
        "photo": request.build_absolute_uri(profile.photo.url) if profile.photo else None,
        "date_joined": user.date_joined,
    })
