import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header'
import Home from './pages/Home/Home';
import Coaching from './pages/Coaching/Coaching';
import Forum from './pages/Forum/Forum';
import CadastroCoaching from './pages/CadastroCoaching/CadastroCoaching';
// import LoginModal from './components/Login/loginModal';


export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/forum" element={<Forum />} />
        {/* <Route path="/login" element={<LoginModal />} /> */}
        <Route path="/cadastro-coaching" element={<CadastroCoaching />} />
      </Routes>
    </Router>
  );
}



