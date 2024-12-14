import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Articles from './pages/Articles/Articles';
import CadastroCoaching from './pages/CadastroCoaching/CadastroCoaching';
import Coaching from './pages/Coaching/Coaching';
import Forum from './pages/Forum/Forum';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';


export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/coachings" element={<Coaching />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/artigos" element={<Articles />} />
        <Route path="/cadastro-coaching" element={<CadastroCoaching />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </Router>
  );
}



