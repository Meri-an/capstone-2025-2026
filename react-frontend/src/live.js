import { useRef, useCallback, useState, useEffect } from 'react';
import './Live.css';

function Live() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detections, setDetections] = useState([]);
    const [processingTime, setProcessingTime] = useState(0);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [fps, setFps] = useState(0);
    const [error, setError] = useState('');
    
    // Refs for mutable values that don't trigger re-renders
    const streamRef = useRef(null);
    const frameCountRef = useRef(0);
    const lastFpsUpdateRef = useRef(0);
    const animationRef = useRef(null);
    const isMountedRef = useRef(true);
    const detectionActiveRef = useRef(false);
    const lastDetectionsRef = useRef([]);
    const lastDrawTimeRef = useRef(0);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            stopCamera();
        };
    }, []);

    // Start camera
    const startCamera = async () => {
        try {
            setError('');
            setDetections([]);
            setProcessingTime(0);
            setFps(0);
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'environment' 
                } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                detectionActiveRef.current = true;
                
                // Wait for video to be ready
                await new Promise((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = resolve;
                    }
                });
                
                setIsCameraOn(true);
                startDetectionLoop();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setError('Cannot access camera. Please check permissions.');
        }
    };

    // Stop camera - completely stops everything
    const stopCamera = useCallback(() => {
        console.log('Stopping camera and detection loop...');
        
        // Stop the detection loop first
        detectionActiveRef.current = false;
        
        if (animationRef.current) {
            clearTimeout(animationRef.current);
            animationRef.current = null;
        }
        
        // Stop all media tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }
        
        // Clear video source
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        
        // Clear canvas
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        // Reset states
        if (isMountedRef.current) {
            setIsCameraOn(false);
            setIsProcessing(false);
            setDetections([]);
            setProcessingTime(0);
            setFps(0);
            setError('');
        }
        
        console.log('Camera stopped successfully');
    }, []);

    // Draw detections on canvas (always draws over current video frame)
    const drawDetections = useCallback((predictions) => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Always sync canvas size to video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        // Draw current video frame
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        predictions.forEach(prediction => {
            const { x1, y1, x2, y2 } = prediction.bbox;
            const label = `${prediction.class} ${(prediction.confidence * 100).toFixed(1)}%`;

            // Draw bounding box
            context.strokeStyle = '#00FF00';
            context.lineWidth = 3;
            context.strokeRect(x1, y1, x2 - x1, y2 - y1);

            // Draw label background
            context.fillStyle = '#00FF00';
            const textWidth = context.measureText(label).width;
            const textHeight = 30;
            context.fillRect(x1 - 2, y1 - textHeight, textWidth + 10, textHeight);

            // Draw label text
            context.fillStyle = '#ffffffff';
            context.font = '25px Arial';
            context.fillText(label, x1 + 3, y1 - 5);
        });
    }, []);

    // Detection function (runs at ~3 FPS)
    const detectObjects = useCallback(async () => {
        if (!detectionActiveRef.current || isProcessing || !videoRef.current || !canvasRef.current) {
            return;
        }
        const video = videoRef.current;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        setIsProcessing(true);
        try {
            if (!detectionActiveRef.current) return;
            const response = await fetch('http://localhost:8000/api/livedetect/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frame: imageData }),
            });
            if (!detectionActiveRef.current) return;
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (detectionActiveRef.current && isMountedRef.current) {
                setDetections(data.predictions || []);
                setProcessingTime(data.processing_time || 0);
                // Save and draw new detections
                lastDetectionsRef.current = data.predictions || [];
                drawDetections(lastDetectionsRef.current);
            }
        } catch (error) {
            if (detectionActiveRef.current && isMountedRef.current) {
                console.error('Error sending frame to backend:', error);
                setError(`Connection error: ${error.message}`);
            }
        } finally {
            if (isMountedRef.current) setIsProcessing(false);
        }
    }, [isProcessing, drawDetections]);

    // FPS counter
    const updateFps = useCallback(() => {
        if (!detectionActiveRef.current) return;
        
        const now = performance.now();
        frameCountRef.current++;
        
        if (now - lastFpsUpdateRef.current >= 1000) {
            if (isMountedRef.current) {
                setFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current)));
            }
            frameCountRef.current = 0;
            lastFpsUpdateRef.current = now;
        }
    }, []);

    // Detection loop (runs at ~3 FPS)
    const detectionLoop = useCallback(() => {
        if (!detectionActiveRef.current) return;
        detectObjects();
        updateFps();
        if (detectionActiveRef.current) {
            animationRef.current = setTimeout(() => {
                detectionLoop();
            }, 333); // ~3 FPS
        }
    }, [detectObjects, updateFps]);

    // Start detection loop
    const startDetectionLoop = useCallback(() => {
        if (!detectionActiveRef.current) return;
        lastFpsUpdateRef.current = performance.now();
        frameCountRef.current = 0;
        detectionLoop();
    }, [detectionLoop]);

    // Toggle camera function
    const toggleCamera = useCallback(() => {
        if (isCameraOn) {
            stopCamera();
        } else {
            startCamera();
        }
    }, [isCameraOn, stopCamera, startCamera]);

    // Redraw detection overlay at full video FPS for smooth overlay (boxes don't blink)
    useEffect(() => {
        if (!isCameraOn) return;
        let rafId;
        const renderOverlay = () => {
            if (!isCameraOn || !videoRef.current || !canvasRef.current) return;
            if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
                rafId = requestAnimationFrame(renderOverlay);
                return;
            }
            drawDetections(lastDetectionsRef.current);
            rafId = requestAnimationFrame(renderOverlay);
        };
        rafId = requestAnimationFrame(renderOverlay);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isCameraOn, drawDetections]);

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Real-time Object Detection</h1>
            
            {/* Error Display */}
            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    border: '1px solid #ef5350',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    Error: {error}
                </div>
            )}
            
            {/* Controls */}
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={toggleCamera}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: isCameraOn ? '#f44336' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                </button>
                
                {/* Stats */}
                {isCameraOn && (
                    <div style={{ marginTop: '10px' }}>
                        <span style={{ marginRight: '15px' }}>FPS: {fps}</span>
                        <span>Detections: {detections.length}</span> <br></br>
                    </div>
                )}
            </div>
            
            {/* Video and Canvas */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        display: isCameraOn ? 'block' : 'none',
                        border: '2px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
                
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        maxWidth: '800px',
                        display: isCameraOn ? 'block' : 'none',
                        pointerEvents: 'none'
                    }}
                />
            
                {!isCameraOn && (
                    <div className = 'placeholder' >
                        Camera is off. Click "Start Camera" to begin.
                    </div>
                )}  
            </div>
            
            {/* Detections List */}
            {detections.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Detected Objects ({detections.length}):</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {detections.map((detection, index) => (
                            <div key={index} style={{
                                padding: '8px 12px',
                                backgroundColor: '#e8f5e8',
                                border: '1px solid #4caf50',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                <strong>{detection.class}</strong> - {(detection.confidence * 100).toFixed(1)}%
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Live;