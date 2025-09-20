import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageChange = async (e) => {

    document.getElementById('upload-hr').style.display = 'none';
    const appUploadElements = document.getElementsByClassName('App-upload');
    if (appUploadElements.length > 0) {
      appUploadElements[0].style.height = 'auto';
      appUploadElements[0].style.marginTop = '20px';
    }
    document.querySelector('section').style.display = 'block';
    

    const file = e.target.files[0];
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPreview(reader.result);
        setPredictions([]); // Clear previous predictions
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
          setTimeout(drawBoundingBoxes, 0);
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

  useEffect(() => {
    if (preview && predictions.length === 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    } else {
      drawBoundingBoxes();
    }
  }, [predictions, preview]); // This effect runs when these variables change

  // Function to draw bounding boxes on the canvas
  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || predictions.length === 0) return;

    const ctx = canvas.getContext('2d');
    // Set canvas dimensions to match the displayed image
    canvas.width = image.width;
    canvas.height = image.height;
    // Clear the canvas before drawing new boxes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw each bounding box
    predictions.forEach((prediction) => {
      const { x1, y1, x2, y2 } = prediction.bbox;
      const label = `${prediction.class} ${(prediction.confidence * 100).toFixed(1)}%`;
      ctx.strokeStyle = '#FF0000'; // Red box
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.stroke();
      ctx.fillStyle = '#FF0000'; // Red background
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x1, y1 - 20, textWidth + 10, 20);
      ctx.fillStyle = '#FFFFFF'; // White text
      ctx.font = '16px Arial';
      ctx.fillText(label, x1 + 5, y1 - 5);
    });
  };

  return (
    <div className="App">
      
    <header className="App-header">
      <ul className="header-list">
        <li className="header-left">Banana Disease Detector</li>
        <li className="header-right">About</li>
      </ul>
    </header>

    <div className="App-upload">
      <h2 id = "upload-hr">Upload an image of <br></br> banana leaves for detection</h2>


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
              </button>
              </label>
      </form>


      </div>

      <section style={{ display: 'none' }}>
        <h3>Preview</h3>
        {/* Preview Area with Image and Canvas Overlay */}
        {preview && (
          <div className='preview' style={{ position: 'relative', display: 'inline-block', marginTop: '0px' }}>
            {/* The image is hidden but used as a reference for the canvas */}
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              style={{ display: 'block', maxWidth: '100%', height: '300px' }}
            />
            {/* The canvas is absolutely positioned over the image */}
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '300px'
              }}
            />
          </div>
        )}
        {/* Loading indicator */}
        {loading && <p>Processing...</p>}
        {/* Text Results List */}
         {predictions.length > 0 && (
          <div>
            <h2>Result</h2>
            <ul style={{ listStyleType: 'none', padding: 0, textTransform: 'capitalize', fontWeight: 'bold' }}>
              {predictions.map((pred, index) => (
                <li key={index}>
                  {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
        )}

        {predictions.length === 0 && preview && !loading && (
          <div>
            <h2>No predictions found</h2>
            <p style={{textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => document.getElementById('file-upload').click()}>Upload valid image.</p>
           
          </div>
        )}
       
      </section>

      <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', backgroundColor: '#f1f1f1', padding: '10px 0' }}>
        <p>Developed by Mary Ann Bano, Saeedomar Razuman</p>
      </footer>
    </div>
  );
}

export default App;