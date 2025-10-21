export default function Home() {
  return (
    <div className="container">
      <div className="left-panel">
        <div className="image-container">
          {/* Traditional banana leaf pattern background */}
          <div className="decorative-shape" />
          <div className="banana-pattern" />
          {/* Banana disease image */}
          <img 
            src="https://github.com/Meri-an/capstone-2025-2026/blob/main/home.png?raw=true"
            alt="blacksigatoka"
            className="profile-image"
          />
        </div>
        <h1 className="title">
          Banana Disease<br />Identification System
        </h1>
        <p className="subtitle">Advanced Agricultural Diagnostics Platform</p>
        <div className="disease-tags">
          <span className="disease-tag black-sigatoka">Black Sigatoka Disease</span>
          <span className="disease-separator"> | </span>
          <span className="disease-tag fusarium-wilt">Fusarium Wilt Disease</span>
        </div>
      </div>

      {/* Right: Upload Box */}
      <div className="right-panel">
        <div className="upload-box">
          <div className="box-header">
            <h3>Disease Detection</h3>
          </div>
          <button className="upload-button">
            <a href="/upload">Upload Image</a>
          </button>
          <div className="or-divider">
            <span className="or-text">OR</span>
          </div>
          <button className="capture-button">
            <a href="/live">Live Capture</a>
          </button>
        </div>
        <div className="sample-images-section">
          <div className="sample-header">Sample Images Available:</div>
          <div className="sample-images">
            <div className="sample-wrapper">
              <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_1.jpg?raw=true" alt="sample1" className="sample-img" />
              <span className="sample-label">Sample 1</span>
            </div>
            <div className="sample-wrapper">
              <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_12.jpg?raw=true" alt="sample2" className="sample-img" />
              <span className="sample-label">Sample 2</span>
            </div>
            <div className="sample-wrapper">
              <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_4.jpg?raw=true" alt="sample3" className="sample-img" />
              <span className="sample-label">Sample 3</span>
            </div>
            <div className="sample-wrapper">
              <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_6.jpg?raw=true" alt="sample4" className="sample-img" />
              <span className="sample-label">Sample 4</span>
            </div>
          </div>
        </div>
        <div className="terms">
          By uploading an image, you agree to our <a href="#" className="terms-link">Terms of Service</a>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 48px 0 0 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
          min-height: calc(100vh - 150px);
        }
        
        .left-panel {
            flex: 1;
            max-width: 550px;
            padding-left: 60px;
        }
        
        .image-container {
            position: relative;
            width: 380px;
            height: 340px;
        }
        
        .decorative-shape {
            position: absolute;
            top: 30px;
            left: 30px;
            width: 200px;
            height: 140px;
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            border-radius: 60px 80px 80px 60px;
            z-index: 0;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
        }
        
        .banana-pattern {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, #5dade2 0%, #3498db 100%);
            border-radius: 50%;
            opacity: 0.2;
            z-index: 0;
        }
        
        .profile-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 400px;
            height: 320px;
            border-radius: 12px;
            z-index: 1;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            border: 3px solid #2c3e50;
        }
        
        .title {
            font-size: 46px;
            font-weight: 700;
            margin: 48px 0 12px 0;
            color: #2c3e50;
            line-height: 1.2;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #5a6c7d;
            font-weight: 400;
            margin-bottom: 20px;
            letter-spacing: 0.5px;
        }
        
        .disease-tags {
            font-size: 20px;
            font-weight: 600;
            margin-top: 20px;
            line-height: 1.8;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .disease-tag {
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease;
        }
        
        .disease-tag:hover {
            transform: translateY(-2px);
        }
        
        .disease-separator {
            color: #7f8c8d;
            font-weight: 400;
        }
        
        .black-sigatoka {
            background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
            color: #fff;
            border: 2px solid #2c3e50;
        }
        
        .fusarium-wilt {
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            color: #fff;
            border: 2px solid #357abd;
        }
        
        .right-panel {
            flex: 1;
            max-width: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .upload-box {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            padding: 40px 36px;
            width: 360px;
            text-align: center;
            border: 1px solid #e1e8ed;
            position: relative;
        }
        
        .box-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .box-header h3 {
            color: #2c3e50;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 24px 0;
            letter-spacing: 0.5px;
        }
        
        .upload-button, .capture-button {
            border: 2px solid;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            padding: 14px 32px;
            cursor: pointer;
            margin-bottom: 8px;
            width: 100%;
            display: block;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            letter-spacing: 0.5px;
        }
        
        .upload-button {
            background: #4a90e2;
            color: #ffffff;
            border-color: #4a90e2;
        }
        
        .upload-button:hover {
            background: #357abd;
            border-color: #357abd;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }
        
        .upload-button a {
            color: #ffffff;
            text-decoration: none;
        }
        
        .capture-button {
            background: #ffffff;
            color: #4a90e2;
            border-color: #4a90e2;
        }
        
        .capture-button:hover {
            background: #f5f7fa;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
        }
        
        .capture-button a {
            color: #4a90e2;
            text-decoration: none;
        }
        
        .or-divider {
            position: relative;
            margin: 16px 0;
        }
        
        .or-divider::before,
        .or-divider::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 42%;
            height: 1px;
            background: #e1e8ed;
        }
        
        .or-divider::before {
            left: 0;
        }
        
        .or-divider::after {
            right: 0;
        }
        
        .or-text {
            font-size: 12px;
            color: #7f8c8d;
            font-weight: 500;
            background: #ffffff;
            padding: 4px 12px;
            display: inline-block;
            letter-spacing: 1px;
        }
        
        .sample-images-section {
            margin-top: 28px;
            text-align: center;
        }
        
        .sample-header {
            font-size: 14px;
            color: #5a6c7d;
            font-weight: 500;
            margin-bottom: 12px;
            letter-spacing: 0.3px;
        }
        
        .sample-images {
            display: flex;
            gap: 16px;
            margin-top: 12px;
            justify-content: center;
        }
        
        .sample-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        
        .sample-img {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 2px solid #e1e8ed;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .sample-img:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-color: #4a90e2;
        }
        
        .sample-label {
            font-size: 11px;
            color: #7f8c8d;
            font-weight: 500;
        }
        
        .terms {
            margin-top: 24px;
            font-size: 12px;
            color: #7f8c8d;
            max-width: 360px;
            text-align: center;
            font-weight: 400;
        }
        
        .terms-link {
            color: #4a90e2;
            text-decoration: none;
            font-weight: 500;
        }
        
        .terms-link:hover {
            text-decoration: underline;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 600px) {
            .container {
                flex-direction: column;
                padding: 24px 0 0 0;
            }
            
            .left-panel {
                padding-left: 0;
                text-align: center;
                margin-bottom: 10px;
                width: 100%;
            }
            
            .image-container {
                display: none;
            }
            
            .title {
                font-size: 36px;
                margin: 24px 0 0 0;
            }
            
            .disease-tags {
                font-size: 18px;
            }
            
            .right-panel {
                width: 100%;
            }
            
            .upload-box {
                width: 70%;
                max-width: 340px;
                padding: 30px 20px;
                margin-top: 0;
            }
            
            .upload-button, .capture-button {
                font-size: 18px;
                padding: 14px 20px;
                margin-bottom: 5px;
            }
            .terms {
              font-size: 10px;
              margin-bottom: 20px;
        }
            .black-sigatoka, .fusarium-wilt {
              font-size: 13px;
              padding: 6px 12px;
              margin: auto;
            }
        }
        
      `}</style>
    </div>
  );
}