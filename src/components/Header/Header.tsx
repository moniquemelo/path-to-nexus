import { Link, useNavigate } from 'react-router-dom';
import styles from '../Header/Header.module.css';

export default function Header() {
  const navigate = useNavigate(); 

  return (
    <header>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.companyName}>PathToNexus</Link>
        <nav className={styles.menu}>
          <Link to="/coaching" className={styles.menuItem}>Coaching</Link>
          <Link to="/artigos" className={styles.menuItem}>Artigos</Link>
          <Link to="/forum" className={styles.menuItem}>Forum</Link>
          <Link to="/workshops" className={styles.menuItem}>Workshops</Link>
          <button 
            className={styles.button} 
            onClick={() => navigate('/login')}>
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
