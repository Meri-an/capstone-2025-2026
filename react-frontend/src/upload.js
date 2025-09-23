import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Upload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const handleImageChange = async (e) => {
    document.getElementById('upload-hr').style.display = 'none';
    const appUploadElements = document.getElementsByClassName('App-upload');
    if (appUploadElements.length > 0) {
      appUploadElements[0].style.display = 'none';
    }
    document.querySelector('section').style.display = 'block';

    const file = e.target.files[0];
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (file) {
      setImage(file);
      setImageLoaded(false);
      setShowPopup(false); // Hide popup when new image is uploaded
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPreview(reader.result);
        setPredictions([]);
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = await axios.post('http://localhost:8000/api/predict/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setPredictions(response.data.predictions);
          setShowPopup(true); // Show popup when predictions are ready
        } catch (error) {
          console.error('Error making prediction:', error);
          alert('Error making prediction! Check console for details.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
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
        <h2 id="upload-hr">Upload an image of <br></br> banana leaves for detection</h2>
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
              Upload
            </button>
          </label>
        </form>
      </div>
      
      <section style={{ display: 'none', textAlign: 'center', padding: '20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
          <h3>Preview</h3>
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
            >
              <span className="material-icons" style={{ color: '#fff', fontSize: 24, verticalAlign: 'middle' }}>
                upload
              </span>
            </button>
          </label>
        </div> 
        
        {/* Preview Area with Image and Canvas Overlay */}
        {preview && (
          <div 
            className='preview' 
            ref={containerRef}
            style={{ 
              position: 'relative', 
              display: 'inline-block', 
              marginTop: '0px',
              maxWidth: '500px',
              maxHeight: '500px'
            }}
          >
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
        )}
        
        {/* Loading indicator */}
        {loading && <p>Processing...</p>}
        
        {/* Popup Modal for Results */}
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
              
              {predictions.length > 0 ? (
                <div>
                  <h2>Detection Results</h2>
                  <ul style={{ listStyleType: 'none', padding: 0, textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {predictions.map((pred, index) => (
                      <li key={index}>
                        {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <h2>No predictions found</h2>
                  <p 
                    style={{textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer'}} 
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    Upload valid image.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Upload;