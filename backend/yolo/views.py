from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ultralytics import YOLO
from .serializers import ImageSerializer, FrameSerializer
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.files.base import ContentFile
import cv2
import numpy as np
import os
import base64
import json
import time

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

import re
import base64
import cv2
import numpy as np
import base64
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import time

@csrf_exempt
@api_view(['POST'])
def live_detect(request):
    try:
        print("Received request for live detection")  # Debug log
        
        # Get base64 image data from request
        frame_data = request.data.get('frame', '')
        if not frame_data:
            print("No frame data received")
            return Response({"error": "No frame data provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Remove data URL prefix if present
        if ',' in frame_data:
            frame_data = frame_data.split(',')[1]
        
        # Decode base64 to image
        try:
            image_bytes = base64.b64decode(frame_data)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_cv = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        except Exception as e:
            print(f"Image decoding error: {e}")
            return Response({"error": "Invalid image data"}, status=status.HTTP_400_BAD_REQUEST)
        
        if image_cv is None:
            print("Failed to decode image")
            return Response({"error": "Invalid image data"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Image shape: {image_cv.shape}")  # Debug log
        
        # Start timing
        start_time = time.time()
        
        # Run inference
        try:
            results = model(image_cv)
            print(f"Model inference completed, {len(results)} results")  # Debug log
        except Exception as e:
            print(f"Model inference error: {e}")
            return Response({"error": "Model inference failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Process results
        predictions = []
        for result in results:
            for box in result.boxes:
                xyxy = box.xyxy[0].cpu().numpy()
                cls_id = int(box.cls[0].item())
                confidence = box.conf[0].item()
                
                if confidence >= 0.5:  # Confidence threshold
                    predictions.append({
                        "class": result.names[cls_id],
                        "confidence": float(confidence),
                        "bbox": {
                            "x1": float(xyxy[0]),
                            "y1": float(xyxy[1]),
                            "x2": float(xyxy[2]),
                            "y2": float(xyxy[3]),
                        }
                    })
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        print(f"Detection completed: {len(predictions)} objects found")  # Debug log
        
        return Response({
            "predictions": predictions,
            "processing_time": round(processing_time, 2),
            "status": "success"
        })
        
    except Exception as e:
        print(f"Unexpected error: {e}")  # Debug log
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)