/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  closeModal: () => void;
}

export default function LoginModal({ closeModal }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      setTimeout(() => {
        navigate('/'); 
        closeModal(); 
      }, 1000); 
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      setErrorMessage('Erro ao fazer login. Verifique suas credenciais.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={closeModal} className={styles.closeButton}>
          <IoCloseCircleSharp size={40} />
        </button>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.input}
            required
          />
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <span className={styles.loader}></span> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
