export default function Home() {
  return (
    <div className="container">
      <div className="left-panel">
        <div className="image-container">
          {/* Decorative yellow shape */}
          <div className="decorative-shape" />
          {/* Person holding flowers */}
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=320&h=320&facepad=2"
            alt="Person holding flowers"
            className="profile-image"
          />
        </div>
        <h1 className="title">
          Identify Banana<br />Disease
        </h1>
        <div className="disease-tags">
          <span className="disease-tag black-sigatoka">Black Sigatoka Disease</span>
          <span> and </span>
          <span className="disease-tag fusarium-wilt">Fusarium Wilt</span>
        </div>
      </div>

      {/* Right: Upload Box */}
      <div className="right-panel">
        <div className="upload-box">
          <button className="upload-button">
            <a href="/upload">Upload Image</a>
          </button>
          <div className="or-text">
            or
          </div>
          <button className="capture-button">
            <a href="/live">Live Capture</a>
          </button>
        </div>
        <div className="sample-images-section">
          No image?<br />Try one of these:
          <div className="sample-images">
            <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_1.jpg?raw=true" alt="sample1" className="sample-img" />
            <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_12.jpg?raw=true" alt="sample2" className="sample-img" />
            <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_4.jpg?raw=true" alt="sample3" className="sample-img" />
            <img src="https://github.com/Meri-an/capstone-2025-2026/blob/main/Image_6.jpg?raw=true" alt="sample4" className="sample-img" />
          </div>
        </div>
        <div className="terms">
          By uploading an image <a href="#" className="terms-link">Terms of Service</a>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 48px 0 0 0;
        }
        
        .left-panel {
            flex: 1;
            max-width: 500px;
            padding-left: 60px;
        }
        
        .image-container {
            position: relative;
            width: 320px;
            height: 320px;
        }
        
        .decorative-shape {
            position: absolute;
            top: 40px;
            left: 40px;
            width: 180px;
            height: 120px;
            background: #ffe25c;
            border-radius: 60px 80px 80px 60px;
            z-index: 0;
        }
        
        .profile-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 320px;
            height: 320px;
            object-fit: cover;
            border-radius: 16px;
            z-index: 1;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .title {
            font-size: 48px;
            font-weight: 700;
            margin: 48px 0 0 0;
            color: #23272f;
            line-height: 1.2;
        }
        
        .disease-tags {
            font-size: 24px;
            font-weight: 500;
            margin-top: 16px;
            line-height: 1.5;
        }
        
        .disease-tag {
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            margin: 4px 0;
        }
        
        .black-sigatoka {
            background: #1976d2;
            color: #fff;
        }
        
        .fusarium-wilt {
            background: #ffe25c;
            color: #23272f;
        }
        
        .right-panel {
            flex: 1;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .upload-box {
            background: #fff;
            border-radius: 32px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.08);
            padding: 48px 32px;
            width: 340px;
            text-align: center;
        }
        
        .upload-button, .capture-button {
            border: none;
            border-radius: 24px;
            font-size: 22px;
            font-weight: 600;
            padding: 16px 32px;
            cursor: pointer;
            margin-bottom: 16px;
            width: 100%;
            display: block;
            transition: all 0.3s ease;
        }
        
        .upload-button {
            background: #1976d2;
            color: #fff;
        }
        
        .upload-button:hover {
            background: #1565c0;
            transform: translateY(-2px);
        }
        
        .upload-button a {
            color: #fff;
            text-decoration: none;
        }
        
        .capture-button {
            background: #19d285;
            color: #fff;
        }
        
        .capture-button:hover {
            background: #16bb78;
            transform: translateY(-2px);
        }
        
        .or-text {
            font-size: 18px;
            color: #23272f;
            margin-bottom: 8px;
        }
        
        .sample-images-section {
            margin-top: 24px;
            font-size: 16px;
            color: #5a6e7f;
            text-align: center;
        }
        
        .sample-images {
            display: flex;
            gap: 12px;
            margin-top: 8px;
            justify-content: center;
        }
        
        .sample-img {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: cover;
            transition: transform 0.3s ease;
            cursor: pointer;
        }
        
        .sample-img:hover {
            transform: scale(1.1);
        }
        
        .terms {
            margin-top: 24px;
            font-size: 12px;
            color: #5a6e7f;
            max-width: 340px;
            text-align: center;
        }
        
        .terms-link {
            color: #1976d2;
            text-decoration: none;
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
        
      `}</style>
    </div>
  );
}