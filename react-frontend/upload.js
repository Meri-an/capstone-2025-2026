import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Upload() {
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  
  // Crop states
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);

  // New: track touch start positions
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);


 const hasDisease = () => {
    return predictions.some(pred => 
      pred.class.toLowerCase().includes('black sigatoka') || 
      pred.class.toLowerCase().includes('fusarium wilt')
    );
  };

  // Function to show solution popup
  const handleShowSolution = () => {
    setShowSolution(true);
  };

  // Function to close solution popup
  const handleCloseSolution = () => {
    setShowSolution(false);
  };

  // Get specific solution based on disease
  const getSolution = () => {
    const diseases = predictions.map(pred => pred.class.toLowerCase());
    
    if (diseases.some(d => d.includes('black sigatoka'))) {
      return {
        title: "Black Sigatoka Solution",
        treatments: [
          "Apply fungicides containing triazoles or strobilurins",
          "Remove and destroy infected leaves",
          "Improve air circulation by proper spacing",
          "Avoid overhead irrigation",
          "Use resistant banana varieties if available"
        ]
      };
    }
    
    if (diseases.some(d => d.includes('fusarium wilt'))) {
      return {
        title: "Fusarium Wilt Solution",
        treatments: [
          "Use disease-free planting material",
          "Practice crop rotation with non-host crops",
          "Solarize soil to reduce pathogen levels",
          "Apply biological control agents like Trichoderma",
          "Remove and destroy infected plants immediately",
          "Avoid moving soil from infected to healthy areas"
        ]
      };
    }
    
    return null;
  };

  // Handle image selection - show crop modal
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize crop area when image loads in crop modal
  const handleCropImageLoad = () => {
    if (cropImageRef.current) {
      const img = cropImageRef.current;
      const containerWidth = cropContainerRef.current.offsetWidth;
      const containerHeight = cropContainerRef.current.offsetHeight;
      
      // Calculate display dimensions
      let displayWidth = img.naturalWidth;
      let displayHeight = img.naturalHeight;
      const maxWidth = containerWidth - 40;
      const maxHeight = containerHeight - 40;
      
      if (displayWidth > maxWidth) {
        const ratio = maxWidth / displayWidth;
        displayWidth = maxWidth;
        displayHeight = displayHeight * ratio;
      }
      
      if (displayHeight > maxHeight) {
        const ratio = maxHeight / displayHeight;
        displayHeight = maxHeight;
        displayWidth = displayWidth * ratio;
      }
      
      // Set initial crop to center 80% of image
      const cropWidth = displayWidth * 0.8;
      const cropHeight = displayHeight * 0.8;
      setCrop({
        x: (displayWidth - cropWidth) / 2,
        y: (displayHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  };

  // Enhanced mouse/touch down handler
  const handleCropMouseDown = (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('crop-handle')) {
      setIsResizing(true);
      setResizeHandle(e.target.dataset.handle);
    } else if (e.target.classList.contains('crop-area')) {
      setIsDragging(true);
      
      // Support both mouse and touch events
      const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
      
      setDragStart({ 
        x: (clientX || 0) - crop.x, 
        y: (clientY || 0) - crop.y 
      });
      setTouchStart({ x: clientX || 0, y: clientY || 0 });
    }
  };

  // Enhanced mouse/touch move handler
  const handleCropMouseMove = (e) => {
    if (!cropImageRef.current) return;
    
    const img = cropImageRef.current;
    const rect = img.getBoundingClientRect();
    
    // Support both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    
    if (!clientX || !clientY) return;
    
    if (isDragging) {
      let newX = clientX - dragStart.x;
      let newY = clientY - dragStart.y;
      
      // Constrain to image bounds
      newX = Math.max(0, Math.min(newX, rect.width - crop.width));
      newY = Math.max(0, Math.min(newY, rect.height - crop.height));
      
      setCrop({ ...crop, x: newX, y: newY });
    } else if (isResizing && resizeHandle) {
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      
      let newCrop = { ...crop };
      
      if (resizeHandle.includes('e')) {
        newCrop.width = Math.max(50, Math.min(mouseX - crop.x, rect.width - crop.x));
      }
      if (resizeHandle.includes('s')) {
        newCrop.height = Math.max(50, Math.min(mouseY - crop.y, rect.height - crop.y));
      }
      if (resizeHandle.includes('w')) {
        const newWidth = crop.width + (crop.x - mouseX);
        if (newWidth > 50 && mouseX >= 0) {
          newCrop.width = newWidth;
          newCrop.x = mouseX;
        }
      }
      if (resizeHandle.includes('n')) {
        const newHeight = crop.height + (crop.y - mouseY);
        if (newHeight > 50 && mouseY >= 0) {
          newCrop.height = newHeight;
          newCrop.y = mouseY;
        }
      }
      
      setCrop(newCrop);
    }
  };

  // Enhanced mouse/touch up handler
  const handleCropMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // Add touch-specific handler to prevent default behavior
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleCropMouseDown(e);
  };

  // Apply crop and process image
  const handleApplyCrop = async () => {
    if (!cropImageRef.current) return;
    
    const img = cropImageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate scale factor between displayed and natural size
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    // Set canvas size to cropped dimensions
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    // Draw cropped image
    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    // Convert to blob and process
    canvas.toBlob((blob) => {
      const croppedUrl = canvas.toDataURL('image/jpeg');
      setShowCropModal(false);
      processImage(croppedUrl, blob);
    }, 'image/jpeg', 0.95);
  };

  // Cancel crop
  const handleCancelCrop = () => {
    setShowCropModal(false);
    setImageToCrop(null);
  };

  // Skip crop and use original
  const handleSkipCrop = () => {
    setShowCropModal(false);
    processImage(imageToCrop);
  };


  // Process image and send to API
  const processImage = async (imageUrl, blob = null) => {
    document.getElementById('upload-hr').style.display = 'none';
    const appUploadElements = document.getElementsByClassName('App-upload');
    if (appUploadElements.length > 0) {
      appUploadElements[0].style.display = 'none';
    }
    document.querySelector('section').style.display = 'block';

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setPreview(imageUrl);
    setImageLoaded(false);
    setShowPopup(false);
    setShowSolution(false);
    setPredictions([]);
    setLoading(true);

    const formData = new FormData();
    if (blob) {
      formData.append('image', blob, 'cropped.jpg');
    } else {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      formData.append('image', imageBlob, 'image.jpg');
    }

    try {
      const startTime = performance.now();
      const response = await axios.post('http://localhost:8000/api/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const endTime = performance.now();
      setInferenceTime(endTime - startTime);
      setPredictions(response.data.predictions);
      setShowPopup(true);
    } catch (error) {
      console.error('Error making prediction:', error);
      alert('Error making prediction! Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Close popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest('.popup-content')) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // Calculate dimensions to fit within container while maintaining aspect ratio
  const calculateDisplayDimensions = (naturalWidth, naturalHeight) => {
    const maxWidth = 500;
    const maxHeight = 500;
    
    let width = naturalWidth;
    let height = naturalHeight;
    
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = height * ratio;
    }
    
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = width * ratio;
    }
    
    return { width, height };
  };

  useEffect(() => {
    if (preview && predictions.length === 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    } else if (imageLoaded && predictions.length > 0) {
      drawBoundingBoxes();
    }
  }, [predictions, preview, imageLoaded, imgDims]);

  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || predictions.length === 0) return;

    const ctx = canvas.getContext('2d');
    const displayDims = calculateDisplayDimensions(image.naturalWidth, image.naturalHeight);
    
    // Set canvas dimensions to match the displayed image
    canvas.width = displayDims.width;
    canvas.height = displayDims.height;
    
    // Clear the canvas before drawing new boxes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling factors
    const scaleX = displayDims.width / image.naturalWidth;
    const scaleY = displayDims.height / image.naturalHeight;
    
    // Draw each bounding box
    predictions.forEach((prediction) => {
      const { x1, y1, x2, y2 } = prediction.bbox;
      const label = `${prediction.class} ${(prediction.confidence * 100).toFixed(1)}%`;
      
      // Scale coordinates to match displayed image
      const scaledX1 = x1 * scaleX;
      const scaledY1 = y1 * scaleY;
      const scaledX2 = x2 * scaleX;
      const scaledY2 = y2 * scaleY;
      
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
      ctx.stroke();
      
      ctx.fillStyle = '#FF0000';
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(scaledX1, scaledY1 - 20, textWidth + 10, 20);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, scaledX1 + 5, scaledY1 - 5);
    });
  };

  return (
    <div className="App">
      <div className="App-upload">
        <h2 id="upload-hr">Upload Banana Leaf Image<br></br>for Disease Detection</h2>
        <form onSubmit={e => e.preventDefault()} style={{ marginBottom: '20px' }}>
          <label htmlFor="file-upload" style={{ marginRight: '10px' }}>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              id="upload-btn"
              type="button"
              onClick={() => document.getElementById('file-upload').click()}
            >
              Upload Image
              <svg 
                style={{ marginLeft: '8px' }}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </button>
          </label>
        </form>
      </div>
      
      <section style={{ display: 'none', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
    <h3>Image Preview & Analysis</h3>
    <label htmlFor="file-upload" style={{ marginLeft: '10px' }}>
      <input
        id="file-upload"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <button
        id="upload-btn"
        type="button"
        onClick={() => document.getElementById('file-upload').click()}
        title="Upload new image"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </button>
    </label>
  </div> 
  
  {/* Preview Area with Image, Canvas, and Results Sidebar */}
  {preview && (
    <div className="preview-container">
      {/* Image and Canvas */}
      <div className="preview-wrapper">
        <img
          ref={imageRef}
          src={preview}
          alt="Preview"
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '500px',
            width: 'auto',
            height: 'auto'
          }}
          onLoad={e => {
            setImageLoaded(true);
            const displayDims = calculateDisplayDimensions(
              e.target.naturalWidth, 
              e.target.naturalHeight
            );
            setImgDims(displayDims);
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      </div>
      
       {/* Detection Results Sidebar */}
            <div className="results-sidebar">
              {loading ? (
                <p>Analyzing image...</p>
              ) : predictions.length > 0 ? (
                <div>
                  <h2>Detection Results</h2>
                  {inferenceTime && (
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      marginBottom: '10px',
                      fontStyle: 'italic'
                    }}>
                      Inference time: {inferenceTime.toFixed(2)}ms
                    </p>
                  )}
                  <ul className="results-list">
                    {predictions.map((pred, index) => (
                      pred.class.toLowerCase() === 'fusarium wilt' ||   pred.class.toLowerCase() === 'black sigatoka' ?(
                        <li key={index}>
                          {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
                        </li>
                      ) : (
                        <li key={index} style={{color: '#ff4444', fontStyle: 'italic'}}>
                          No detection results
                        </li>
                      )
                    ))}
                  </ul>
                  
                  {/* Recommended Solution Button */}
                  {hasDisease() && (
                    <button
                      id="solution-btn"
                      onClick={handleShowSolution}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        marginTop: '15px',
                        transition: 'all 0.3s',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
                        letterSpacing: '0.3px'
                      }}
                    >
                      View Treatment Solution
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <h2>No Disease Detected</h2>
                  <p 
                    style={{textDecoration: 'underline', fontWeight: '600', cursor: 'pointer', color: '#4a90e2'}} 
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    Upload a valid banana leaf image
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Popup Modal for Results 
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button 
                className="popup-close" 
                onClick={() => setShowPopup(false)}
                aria-label="Close popup"
              >
                &times;
              </button>

             
              
             
            </div>
          </div> 
        )}  */}


         {/* Solution Popup Modal */}
      {showSolution && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button 
              className="popup-close" 
              onClick={handleCloseSolution}
              aria-label="Close solution popup"
            >
              &times;
            </button>
            
            {getSolution() && (
              <div>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>
                  {getSolution().title}
                </h2>
                <h3 style={{ color: '#5a6c7d', marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>Recommended Treatments:</h3>
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  {getSolution().treatments.map((treatment, index) => (
                    <li key={index} style={{ marginBottom: '10px', lineHeight: '1.4' }}>
                      {treatment}
                    </li>
                  ))}
                </ul>
                <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#5a6c7d', fontSize: '13px', background: '#f5f7fa', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #4a90e2' }}>
                  <strong>Note:</strong> Consult with agricultural experts for specific application rates and timing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </section>

      {/* Crop Modal */}
      {showCropModal && (
        <div
          className="crop-modal-overlay"
          onMouseMove={handleCropMouseMove}
          onMouseUp={handleCropMouseUp}
          onTouchMove={handleCropMouseMove}
          onTouchEnd={handleCropMouseUp}
        >
          <div className="crop-modal-content">
            <div className="crop-modal-header">
              <h2>Crop Image</h2>
              <button className="crop-close-btn" onClick={handleCancelCrop}>&times;</button>
            </div>
            
            <div className="crop-container" ref={cropContainerRef}>
              <img
                ref={cropImageRef}
                src={imageToCrop}
                alt="Crop preview"
                className="crop-image"
                onLoad={handleCropImageLoad}
                draggable={false}
              />
              
              {crop.width > 0 && (
                <div
                  className="crop-area"
                  style={{
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    width: `${crop.width}px`,
                    height: `${crop.height}px`
                  }}
                  onMouseDown={handleCropMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <div className="crop-handle nw" data-handle="nw"></div>
                  <div className="crop-handle ne" data-handle="ne"></div>
                  <div className="crop-handle sw" data-handle="sw"></div>
                  <div className="crop-handle se" data-handle="se"></div>
                  <div className="crop-handle n" data-handle="n"></div>
                  <div className="crop-handle s" data-handle="s"></div>
                  <div className="crop-handle w" data-handle="w"></div>
                  <div className="crop-handle e" data-handle="e"></div>
                </div>
              )}
            </div>
            
            <div className="crop-modal-footer">
              <button className="crop-btn crop-skip-btn" onClick={handleSkipCrop}>Skip Crop</button>
              <button className="crop-btn crop-cancel-btn" onClick={handleCancelCrop}>Cancel</button>
              <button className="crop-btn crop-apply-btn" onClick={handleApplyCrop}>Apply & Detect</button>
            </div>
          </div>
        </div>
      )}
      
    </div>

    
  );

 
}

export default Upload;