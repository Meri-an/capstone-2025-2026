import './App.css';
import Home from './home';
import Upload from './upload';
import Live from './live';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    
    <div className="App">
      
    {/* Header */}
      <header style={{ display: "flex", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid #eee" }}>
        
        <img src="https://tse4.mm.bing.net/th/id/OIP._PxkZGsum64KmFXeO17HnAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="remove.bg logo" style={{ height: 32, marginRight: 16 }} />
        
      <a href='/'> <span style={{ fontWeight: 700, fontSize: 24, color: "#5a6e7f", letterSpacing: "1px" }}>Banana Disease <span style={{ color: "#b3c6d6" }}>Identifier</span></span></a> 
        <nav style={{ float: "right",marginLeft: 32, display: "flex", gap: 32 }}>
          <a href="/" style={{ color: "#5a6e7f", textDecoration: "none", fontWeight: 500 }}>Home</a>
          <a href="#" style={{ color: "#5a6e7f", textDecoration: "none", fontWeight: 500 }}>About</a>

        </nav>
        
      </header>
      
      

    <main >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/live" element={<Live />} />
        </Routes>
         {/* Main Section */}
     
      
      
     
      </main>

    

      

      <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', backgroundColor: '#f1f1f1', padding: '5px 0' }}>
        <p>Capstone Project 2025-2026</p>
      </footer>
    </div>
  );
}

export default App;