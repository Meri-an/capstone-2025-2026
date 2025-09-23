from rest_framework import serializers
import base64
import cv2
import numpy as np
from django.core.files.base import ContentFile

class ImageSerializer(serializers.Serializer):
    """Serializer for the image input."""
    image = serializers.ImageField()

class FrameSerializer(serializers.Serializer):
    frame = serializers.CharField()
    
    def validate_frame(self, value):
        """
        Validate and process the base64 encoded frame
        """
        # Check if the frame is a base64 string
        if not value.startswith('data:image/'):
            raise serializers.ValidationError("Invalid image format")
        
        # Extract the base64 data
        format, imgstr = value.split(';base64,')
        ext = format.split('/')[-1]  # Get the image extension (jpeg, png, etc.)
        
        try:
            # Decode the base64 string
            data = ContentFile(base64.b64decode(imgstr), name=f'temp.{ext}')
            
            # Convert to numpy array
            image_array = np.frombuffer(data.read(), np.uint8)
            image_cv = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if image_cv is None:
                raise serializers.ValidationError("Invalid image data")
                
            return image_cv
        except Exception as e:
            raise serializers.ValidationError(f"Error processing image: {str(e)}")