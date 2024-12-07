/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from '../Header/Header.module.css';
import LoginModal from '../Login/loginModal';

export default function Header() {
  const navigate = useNavigate();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleLoginModal = () => {
    setIsLoginOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);  
    setDropdownOpen(false); 
    navigate('/'); 
  };

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user); 
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user); 
      } else {
        setUser(null); 
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); 

  return (
    <header>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.companyName}>PathToNexus</Link>
        <nav className={styles.menu}>
          <Link to="/coachings" className={styles.menuItem}>Coaching</Link>
          <Link to="/artigos" className={styles.menuItem}>Artigos</Link>
          <Link to="/forum" className={styles.menuItem}>Forum</Link>
          <Link to="/workshops" className={styles.menuItem}>Workshops</Link>
          {!user ? (
            <button 
              className={styles.button} 
              onClick={toggleLoginModal}>
              Login
            </button>
          ) : (
            <div className={styles.userSection}>
              <FaUserCircle
                className={styles.avatar}
                onClick={() => setDropdownOpen(!dropdownOpen)}  
              />
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <Link to="/perfil" className={styles.dropdownItem}>Perfil</Link>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
      {isLoginOpen && <LoginModal closeModal={toggleLoginModal} />}
    </header>
  );
}
