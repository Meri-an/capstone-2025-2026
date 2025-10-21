import './App.css';
import Home from './home';
import Upload from './upload';
import Live from './live';
import About from './About';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    
    <div className="App">
      
    {/* Header */}
      <header style={{ display: "flex", alignItems: "center", padding: "18px 40px", background: "#ffffff", borderBottom: "1px solid #e1e8ed", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
        
        <img src="https://tse4.mm.bing.net/th/id/OIP._PxkZGsum64KmFXeO17HnAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="banana logo" style={{ height: 36, marginRight: 14, borderRadius: "8px", border: "2px solid #e1e8ed" }} />
        
      <a href='/'> <span style={{ fontWeight: 600, fontSize: 22, color: "#2c3e50", letterSpacing: "0.3px" }}>Banana Disease <span style={{ color: "#4a90e2" }}>Identifier</span></span></a> 
        <nav style={{ float: "right",marginLeft: 40, display: "flex", gap: 32 }}>
          <a href="/" style={{ color: "#5a6c7d", textDecoration: "none", fontWeight: 500, fontSize: "15px", transition: "color 0.3s" }}>Home</a>
          <a href="/about" style={{ color: "#5a6c7d", textDecoration: "none", fontWeight: 500, fontSize: "15px", transition: "color 0.3s" }}>About</a>

        </nav>
        
      </header>
      
      

    <main >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/live" element={<Live />} />
          <Route path="/about" element={<About />} />
        </Routes>
         {/* Main Section */}
     
      
      
     
      </main>

    

      

      <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', background: '#ffffff', padding: '10px 0', borderTop: '1px solid #e1e8ed', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)' }}>
        <p style={{ margin: 0, color: '#7f8c8d', fontWeight: 400, fontSize: '13px' }}>Capstone Project 2025-2026 | Agricultural Health Monitoring System</p>
      </footer>
    </div>
  );
}

export default App;