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
    const [showSolution, setShowSolution] = useState(false);

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

    // Check if any disease is detected
    const hasDisease = () => {
        return detections.some(det => 
            det.class.toLowerCase().includes('black sigatoka') || 
            det.class.toLowerCase().includes('fusarium wilt')
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
        const diseases = detections.map(det => det.class.toLowerCase());

        if (diseases.some(d => d.includes('black sigatoka'))) {
            return {
                title: "Black Sigatoka Treatment Solution",
                treatments: [
                    "Apply fungicides containing triazoles or strobilurins",
                    "Remove and destroy infected leaves promptly",
                    "Improve air circulation through proper plant spacing",
                    "Avoid overhead irrigation to reduce leaf wetness",
                    "Use resistant banana varieties when available",
                    "Implement regular monitoring and early detection programs"
                ]
            };
        }

        if (diseases.some(d => d.includes('fusarium wilt'))) {
            return {
                title: "Fusarium Wilt Treatment Solution",
                treatments: [
                    "Use certified disease-free planting material",
                    "Practice crop rotation with non-host crops",
                    "Solarize soil to reduce pathogen levels",
                    "Apply biological control agents like Trichoderma species",
                    "Remove and destroy infected plants immediately",
                    "Avoid moving soil from infected to healthy areas",
                    "Implement strict quarantine measures",
                    "Plant resistant varieties when possible"
                ]
            };
        }

        return null;
    };

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
        <div className="live-detection-container">
            <div className="live-content-wrapper">
                {/* Header Section */}
                <div className="live-header">
                    <h1 className="live-title">Real-Time Disease Detection</h1>
                    <p className="live-subtitle">Live Camera Analysis for Banana Diseases</p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="live-main-content">
                    {/* Video Section */}
                    <div className="video-section">
                        <div className="video-wrapper">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`video-element ${isCameraOn ? 'active' : 'hidden'}`}
                            />

                            <canvas
                                ref={canvasRef}
                                className={`canvas-overlay ${isCameraOn ? 'active' : 'hidden'}`}
                            />

                            {!isCameraOn && (
                                <div className="camera-placeholder">
                                    <div className="placeholder-icon">📹</div>
                                    <p className="placeholder-text">Camera is off</p>
                                    <p className="placeholder-subtext">Click "Start Camera" to begin detection</p>
                                </div>
                            )}
                        </div>

                        {/* Camera Controls */}
                        <div className="camera-controls">
                            <button 
                                onClick={toggleCamera}
                                className={`camera-toggle-btn ${isCameraOn ? 'stop' : 'start'}`}
                            >
                                <span className="btn-icon">{isCameraOn ? '⏹' : '▶'}</span>
                                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                            </button>

                            {/* Stats Display */}
                            {isCameraOn && (
                                <div className="stats-display">
                                    <div className="stat-item">
                                        <span className="stat-label">FPS:</span>
                                        <span className="stat-value">{fps}</span>
                                    </div>
                                    <div className="stat-divider">|</div>
                                    <div className="stat-item">
                                        <span className="stat-label">Detections:</span>
                                        <span className="stat-value">{detections.length}</span>
                                    </div>
                                    <div className="stat-divider">|</div>
                                    <div className="stat-item">
                                        <span className="stat-label">Inference:</span>
                                        <span className="stat-value">{processingTime.toFixed(2)}ms</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detection Results Sidebar */}
                    {isCameraOn && (
                        <div className="detection-sidebar">
                            <h3 className="sidebar-title">Detection Results</h3>
                            
                            {detections.length > 0 ? (
                                <>
                                    <div className="detections-list">
                                        {detections.map((detection, index) => (
                                            <div key={index} className="detection-card">
                                                <div className="detection-class">{detection.class}</div>
                                                <div className="detection-confidence">
                                                    {(detection.confidence * 100).toFixed(1)}% confidence
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Treatment Solution Button */}
                                    {hasDisease() && (
                                        <button
                                            onClick={handleShowSolution}
                                            className="treatment-btn"
                                        >
                                            <span className="btn-icon">💊</span>
                                            View Treatment Solution
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="no-detection">
                                    <div className="no-detection-icon">🔍</div>
                                    <p className="no-detection-text">No diseases detected</p>
                                    <p className="no-detection-subtext">Point camera at banana leaves</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Solution Popup Modal */}
            {showSolution && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        position: 'relative',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                    }}>
                        <button 
                            onClick={handleCloseSolution}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                fontSize: '28px',
                                cursor: 'pointer',
                                color: '#999',
                                lineHeight: '1',
                                padding: '0',
                                width: '30px',
                                height: '30px'
                            }}
                            aria-label="Close solution popup"
                        >
                            &times;
                        </button>

                        {getSolution() && (
                            <div>
                                <h2 style={{ 
                                    color: '#2c3e50', 
                                    marginBottom: '20px', 
                                    fontSize: '28px', 
                                    fontWeight: '700' 
                                }}>
                                    {getSolution().title}
                                </h2>
                                <h3 style={{ 
                                    color: '#5a6c7d', 
                                    marginBottom: '15px', 
                                    fontSize: '18px', 
                                    fontWeight: '600' 
                                }}>
                                    Recommended Treatments:
                                </h3>
                                <ul style={{ 
                                    textAlign: 'left', 
                                    paddingLeft: '20px',
                                    color: '#5a6c7d'
                                }}>
                                    {getSolution().treatments.map((treatment, index) => (
                                        <li key={index} style={{ 
                                            marginBottom: '10px', 
                                            lineHeight: '1.6',
                                            fontSize: '15px'
                                        }}>
                                            {treatment}
                                        </li>
                                    ))}
                                </ul>
                                <p style={{ 
                                    marginTop: '20px', 
                                    fontStyle: 'italic', 
                                    color: '#5a6c7d', 
                                    fontSize: '13px', 
                                    background: '#f5f7fa', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    borderLeft: '3px solid #4a90e2' 
                                }}>
                                    <strong>Note:</strong> Consult with agricultural experts for specific application rates and timing.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Live;