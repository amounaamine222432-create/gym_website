from django.urls import path
import api.views as views  # ✅ important ici
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import cours_list, mes_cours,rejoindre_cours, quitter_cours,get_cours,cours_coachs,choisir_coach,seances_cours,get_coachs_by_cours

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', views.EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("user/profile/", views.full_profile, name="full-profile"),
    path("user/update-profile/", views.update_full_profile, name="update-full-profile"),
  
   path("cours/", get_cours),                # liste complète des cours
    path("cours/list/", cours_list),          # petite liste rapide
    path("cours/mes/", mes_cours),            # mes participations
    path("cours/join/", rejoindre_cours),     # rejoindre un cours
    path("cours/quit/<int:cours_id>/", quitter_cours),  # quitter un cours



   path("cours/coachs/<int:cours_id>/", cours_coachs),
path("cours/choisir-coach/", choisir_coach),
path("cours/seances/<int:cours_id>/", seances_cours),
    path("cours/<int:cours_id>/coachs/", get_coachs_by_cours),

]

