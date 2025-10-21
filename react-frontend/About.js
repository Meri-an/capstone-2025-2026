export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        {/* Header Section */}
        <section className="about-header">
          <h1>About Banana Disease Detection System</h1>
          <p className="about-subtitle">
            Advanced Agricultural Health Monitoring Platform
          </p>
        </section>

        {/* Introduction Section */}
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To minimize huge crop loss and improve crop yields, automated disease detection 
            will greatly help in the agricultural sector. Disease monitoring and detection are 
            extremely beneficial for sustainable agriculture. Our system leverages advanced 
            machine learning technology to provide rapid, accurate identification of banana 
            diseases, enabling farmers to take timely action and protect their crops.
          </p>
        </section>

        {/* Disease Information Section */}
        <section className="about-section">
          <h2>Detected Diseases</h2>
          
          <div className="disease-card">
            <div className="disease-header">
              <h3>Black Sigatoka Disease</h3>
              <span className="disease-badge black-sigatoka-badge">Fungal Disease</span>
            </div>
            <p className="disease-description">
              Black Sigatoka is one of the most destructive diseases affecting banana plantations 
              worldwide. Caused by the fungus <em>Mycosphaerella fijiensis</em>, it significantly 
              reduces photosynthetic capacity and can lead to severe yield losses if left untreated.
            </p>
            <div className="solutions-box">
              <h4>Treatment Solutions:</h4>
              <ul>
                <li>Apply fungicides containing triazoles or strobilurins</li>
                <li>Remove and destroy infected leaves promptly</li>
                <li>Improve air circulation through proper plant spacing</li>
                <li>Avoid overhead irrigation to reduce leaf wetness</li>
                <li>Use resistant banana varieties when available</li>
                <li>Implement regular monitoring and early detection programs</li>
              </ul>
            </div>
          </div>

          <div className="disease-card">
            <div className="disease-header">
              <h3>Fusarium Wilt Disease</h3>
              <span className="disease-badge fusarium-badge">Soil-Borne Disease</span>
            </div>
            <p className="disease-description">
              Fusarium Wilt, also known as Panama disease, is caused by the soil-borne fungus 
              <em> Fusarium oxysporum f. sp. cubense</em>. This devastating disease blocks the 
              plant's vascular system, leading to wilting and eventual death of the banana plant.
            </p>
            <div className="solutions-box">
              <h4>Treatment Solutions:</h4>
              <ul>
                <li>Use certified disease-free planting material</li>
                <li>Practice crop rotation with non-host crops</li>
                <li>Solarize soil to reduce pathogen levels</li>
                <li>Apply biological control agents like Trichoderma species</li>
                <li>Remove and destroy infected plants immediately</li>
                <li>Avoid moving soil from infected to healthy areas</li>
                <li>Implement strict quarantine measures</li>
                <li>Plant resistant varieties when possible</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="about-section">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Upload Image</h4>
              <p>Upload a clear photo of banana leaves showing symptoms</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Crop & Adjust</h4>
              <p>Crop the image to focus on the affected area</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>AI Analysis</h4>
              <p>Our system analyzes the image using machine learning</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h4>Get Results</h4>
              <p>Receive disease identification and treatment recommendations</p>
            </div>
          </div>
        </section>

        {/* Important Note Section */}
        <section className="about-section note-section">
          <h2>Important Note</h2>
          <p>
            While our system provides accurate disease detection, we strongly recommend 
            consulting with agricultural experts and plant pathologists for specific 
            application rates, timing, and comprehensive disease management strategies 
            tailored to your local conditions.
          </p>
        </section>

        {/* Developers Section */}
        <section className="about-section developers-section">
          <h2>Developed By</h2>
          <div className="developers-container">
            <div className="developer-card">
              <div className="developer-icon">MA</div>
              <h3>Mary Ann M. Bano</h3>
              <p>Researchers</p>
            </div>
            <div className="developer-card">
              <div className="developer-icon">SR</div>
              <h3>Saeedomar A. Razuman</h3>
              <p>Researchers</p>
            </div>
          </div>
          <p className="capstone-info">
            Capstone Project 2025-2026
          </p>
        </section>
      </div>

      <style jsx>{`
        .about-container {
          min-height: calc(100vh - 150px);
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
          padding: 40px 20px 80px 20px;
        }

        .about-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .about-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .about-header h1 {
          font-size: 42px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .about-subtitle {
          font-size: 18px;
          color: #5a6c7d;
          font-weight: 400;
        }

        .about-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 36px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e1e8ed;
        }

        .about-section h2 {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 20px;
          letter-spacing: -0.3px;
        }

        .about-section p {
          font-size: 16px;
          line-height: 1.8;
          color: #5a6c7d;
          margin-bottom: 16px;
        }

        .disease-card {
          background: #f5f7fa;
          border-radius: 10px;
          padding: 28px;
          margin-bottom: 24px;
          border: 1px solid #e1e8ed;
        }

        .disease-card:last-child {
          margin-bottom: 0;
        }

        .disease-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .disease-header h3 {
          font-size: 22px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .disease-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .black-sigatoka-badge {
          background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
          color: #ffffff;
        }

        .fusarium-badge {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: #ffffff;
        }

        .disease-description {
          font-size: 15px;
          line-height: 1.7;
          color: #5a6c7d;
          margin-bottom: 20px;
        }

        .disease-description em {
          font-style: italic;
          color: #4a90e2;
        }

        .solutions-box {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #4a90e2;
        }

        .solutions-box h4 {
          font-size: 17px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 12px;
        }

        .solutions-box ul {
          margin: 0;
          padding-left: 24px;
        }

        .solutions-box li {
          font-size: 15px;
          line-height: 1.7;
          color: #5a6c7d;
          margin-bottom: 8px;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .step-card {
          background: #f5f7fa;
          border-radius: 10px;
          padding: 24px;
          text-align: center;
          border: 1px solid #e1e8ed;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(74, 144, 226, 0.15);
        }

        .step-number {
          width: 50px;
          height: 50px;
          background: #4a90e2;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          margin: 0 auto 16px auto;
        }

        .step-card h4 {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .step-card p {
          font-size: 14px;
          color: #5a6c7d;
          margin: 0;
          line-height: 1.6;
        }

        .note-section {
          background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
          border-left: 4px solid #f39c12;
        }

        .note-section h2 {
          color: #d68910;
        }

        .developers-section {
          text-align: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
        }

        .developers-container {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 32px 0;
          flex-wrap: wrap;
        }

        .developer-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 32px 28px;
          min-width: 220px;
          border: 1px solid #e1e8ed;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .developer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(74, 144, 226, 0.2);
        }

        .developer-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          margin: 0 auto 16px auto;
          letter-spacing: 1px;
        }

        .developer-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 6px;
        }

        .developer-card p {
          font-size: 15px;
          color: #7f8c8d;
          margin: 0;
        }

        .capstone-info {
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 500;
          margin-top: 24px;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .about-header h1 {
            font-size: 32px;
          }

          .about-section {
            padding: 24px;
          }

          .disease-card {
            padding: 20px;
          }

          .steps-container {
            grid-template-columns: 1fr;
          }

          .developers-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
