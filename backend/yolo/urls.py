from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from backend.yolo.views import predict_image # Import your view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/predict/', predict_image, name='predict_image'), # Add this line
]
