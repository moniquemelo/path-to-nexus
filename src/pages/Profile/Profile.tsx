/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../../assets/profile.png';
import ConfirmationModal from '../../components/ConfirmationDeleteAccountModal/ConfirmationDeleteAccountModal';
import { supabase, supabaseAdmin } from '../../supabaseClient';
import styles from './Profile.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isCoaching, setIsCoaching] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      if (!user) return alert("Usuário não encontrado.");
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  
      if (error) {
        throw new Error(`Erro na exclusão: ${error.message}`);
      }
      alert('Conta excluída com sucesso!');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Ocorreu um erro ao excluir sua conta. Tente novamente mais tarde.');
    }
  };

  if (!user) {
    return; 
  }

  return (
    <section className={styles.profile}>
      <div className={styles.profileContainer}>
        <div className={styles.teste}>
          <div className={styles.profileInfoContainer}>
            <img src={ProfileImage} alt="Banner principal" />
            <p>{user.username || 'Não fornecido'}</p>
            <div className={styles.toggleWrapper}>
              <span className={styles.toggleLabel}>PERFIL COACH</span>
              <label className={styles.switch}>
                <input
                type="checkbox"
                checked={isCoaching}
                onChange={() => setIsCoaching((prev) => !prev)}
              />
              <span className={styles.slider}></span>
            </label>   
          </div>
          <p>Membro desde {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(user.created_at))}</p>
          </div>
          <div className={styles.profileAccountInfo}>
            <div className={styles.profileDescContainer}>
              <div className={styles.profileDesc}>
                <h1 className={styles.infoAccountTitle}>INFORMAÇÕES DA CONTA</h1>
                <p className={styles.acessDataTitle}>DADOS DE ACESSO <a className={styles.changeDataTitle}>Alterar</a></p>
                <div className={styles.loginAndPassword}>
                  <p>Email: {user.email}</p>
                  <p>Senha: </p>
                </div>
                <div className={styles.deleteAccountContainer}>
                  <button onClick={() => setShowDeleteModal(true)} className={styles.btnDeleteAccount}>Excluir minha conta</button>
                  <p className={styles.alertDeleteTitle}>Se você excluir sua conta, todos os dados relacionados a você serão excluídos
                  e não será possível restaura-los.</p>
                </div>
              </div>
            </div>
            <div className={styles.requestedClasses}>
              <h1 className={styles.requestedClassesTitle}>AULAS ACEITAS</h1>   
              <div className={styles.requestedClassesContainer}>         
                <img src={ProfileImage} className={styles.avatarCoaching}></img>
                <div className={styles.contactCoaching}>
                  <p className={styles.usernameCoaching}>JogadorSincero</p>
                  <p className={styles.sendMessage}>Enviar mensagem</p>
                </div>
              </div>

              <div className={styles.requestedClassesContainer}>         
                <img src={ProfileImage} className={styles.avatarCoaching}></img>
                <div className={styles.contactCoaching}>
                  <p className={styles.usernameCoaching}>JogadorSincero</p>
                  <p className={styles.sendMessage}>Enviar mensagem</p>
                </div>
              </div>

              <div className={styles.requestedClassesContainer}>         
                <img src={ProfileImage} className={styles.avatarCoaching}></img>
                <div className={styles.contactCoaching}>
                  <p className={styles.usernameCoaching}>JogadorSincero</p>
                  <p className={styles.sendMessage}>Enviar mensagem</p>
                </div>
              </div> 
            </div>

            {isCoaching && (
            <div>
              <h2>ANÚNCIO ATUAL</h2>
              <h3>Ex pro player com mais de 5 anos de experiência e main suporte</h3>
              <h1>hello world</h1>
              <h1>hello world</h1>
              <h1>hello world</h1>
              <h1>hello world</h1>
              <h1>hello world</h1>
              <h1>hello world</h1>
              <h1>hello world</h1>
            </div>
            )}             
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          message="Tem certeza de que deseja excluir sua conta? Todos os seus dados serão perdidos e não será possível recuperá-los."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )} 
    </section>
  );
}

