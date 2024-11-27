import { AuthError } from '@supabase/supabase-js';
import { useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { supabase } from '../../supabaseClient';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true); 
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Login realizado com sucesso!');
        setTimeout(() => onClose(), 2000);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Cadastro realizado com sucesso! Você já pode clicar em "Faça login" para acessar sua conta.');
      }
    } catch (error) {
      const supabaseError = error as AuthError; 
      setMessage(supabaseError.message || 'Ocorreu um erro inesperado.');
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <IoCloseCircleSharp size={40}/>
        </button>
        <h2 className={styles.titleModal}>{isLogin ? 'Login' : 'Cadastro'}</h2>
        {message && <p>{message}</p>}
        <form className={styles.form}onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Senha'
              required
            />
          </div>
          <button className={styles.submitButton} type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
        </form>
        <p className={styles.hasAccount}>
          {isLogin ? (
            <>
              Não possui conta?{' '}
              <span
                className={styles.switchMode}
                onClick={() => {
                  setMessage('');
                  setIsLogin(false);
                }}
              >
                Cadastre-se
              </span>
            </>
          ) : (
            <>
              Já possui uma conta?{' '}
              <span
                className={styles.switchMode}
                onClick={() => {
                  setMessage('');
                  setIsLogin(true);
                }}
              >
                Faça login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
