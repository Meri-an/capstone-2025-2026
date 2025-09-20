from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ultralytics import YOLO
from .serializers import ImageSerializer
import cv2
import numpy as np
import os
from django.conf import settings

model_path = os.path.join(settings.BASE_DIR,'backend', 'yolo', 'models', 'best.pt')
model = YOLO(model_path)

@api_view(['POST'])
def predict_image(request):
    serializer = ImageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    image_file = serializer.validated_data['image']
    image_bytes = np.frombuffer(image_file.read(), np.uint8)
    image_cv = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

    results = model(image_cv)  # This returns a list of Results objects

    predictions = []
    for result in results:
        for box in result.boxes:
            xyxy = box.xyxy[0].cpu().numpy()  # Get bounding box in (x1, y1, x2, y2) format
            cls_id = int(box.cls[0].item())
            confidence = box.conf[0].item()
            if confidence >= 0.5:
                # Append data for each detected object
                predictions.append({
                    "class": result.names[cls_id],      # Get class name from the model
                    "confidence": float(confidence),    # Convert to float for JSON serialization
                    "bbox": {
                        "x1": float(xyxy[0]),
                        "y1": float(xyxy[1]),
                        "x2": float(xyxy[2]),
                        "y2": float(xyxy[3]),
                    }
                })

    return Response({"predictions": predictions})