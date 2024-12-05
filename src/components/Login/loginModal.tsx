/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  closeModal: () => void;
}

export default function LoginModal({ closeModal }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
  
      if (error) throw error;
  
      alert('Login realizado com sucesso!');
      closeModal();
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      setErrorMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };
  

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={closeModal} className={styles.closeButton}>
          &times;
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
          <button type="submit" className={styles.submitButton}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
