import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationDeleteAccountModal/ConfirmationDeleteAccountModal';
import { supabase, supabaseAdmin } from '../../supabaseClient';
import styles from './Profile.module.css';

type UserType = {
  id: string;
  username: string;
  email: string;
  created_at: string;
  profile_image_url: string;
};

type AnnouncementType = {
  id: string;
  user_id: string;
  main_role: string;
  secondary_role: string;
  title: string;
  best_champions_role: string;
  description: string;
  price: number;
  average_rating: number;
  score: number;
  classification_rank: string;
  dt_approval: string;
  dt_create: string;
  status: string;
  image_url: string;
  first_class_free: boolean;
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(null);
  const [isCoaching, setIsCoaching] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);


  const handleUploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
  
      if (!user || !event.target.files || event.target.files.length === 0) {
        throw new Error('Nenhuma imagem selecionada.');
      }
  
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
  
      if (uploadError) {
        throw uploadError;
      }

      const { data: publicURL } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
  
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: publicURL.publicUrl })
        .eq('id', user.id);
  
      if (updateError) {
        throw updateError;
      }
  
      setUser((prevUser) =>
        prevUser ? { ...prevUser, profile_image_url: publicURL.publicUrl } : null
      );
  
      alert('Imagem de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Ocorreu um erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return;
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Erro ao buscar informações do usuário:', userError);
        } else {
          setUser(userData);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!user) return;

      const { data: announcementData, error: announcementError } = await supabase
        .from('announcements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (announcementError) {
        console.error('Erro ao buscar informações do anúncio:', announcementError);
      } else {
        setAnnouncement(announcementData);
      }
    };

    fetchAnnouncement();
  }, [user]);

  const handleDeleteAccount = async () => {
    try {
      if (!user) return alert('Usuário não encontrado.');
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
    return <p>Carregando...</p>;
  }

  return (
    <section className={styles.profile}>
      <div className={styles.profileContainer}>
        <div className={styles.profileInfoContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={user.profile_image_url || 'https://via.placeholder.com/150/000000/FFFFFF?text=Sem+Foto'}
              alt="Imagem de perfil"
              className={styles.profileImage}
            />
            <label htmlFor="fileInput" className={styles.cameraButton}>
              📷
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUploadProfileImage}
              disabled={uploading}
            />
          </div>
          <p className={styles.usernameTitle}>{user.username || 'Usuário não fornecido'}</p>
          <p>
            Membro desde{' '}
            {user.created_at
              ? new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(user.created_at))
              : ''}
          </p>
        </div>

        <div className={styles.profileAccountInfo}>
          <h1 className={styles.infoAccountTitle}>INFORMAÇÕES DA CONTA</h1>
          <p>Email: {user.email}</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className={styles.btnDeleteAccount}
          >
            Excluir minha conta
          </button>
        </div>

        {announcement && (
          <div className={styles.adInfoContainer}>
            <h2>ANUNCIO COACHING</h2>
            <p className={styles.announcement}>Título: {announcement.title}</p>
            <p className={styles.announcement}>Descrição: {announcement.description}</p>
            <p className={styles.announcement}>Preço: R$ {announcement.price}</p>
            <p className={styles.announcement}>Função principal: {announcement.main_role}</p>
            <p className={styles.announcement}>Função secundária: {announcement.secondary_role}</p>
            <p className={styles.announcement}>Campeões principais: {announcement.best_champions_role}</p>
            <p className={styles.announcement}>Média Avaliações: {announcement.average_rating || 'N/A'}</p>
            <p className={styles.announcement}>Primeira aula grátis: {announcement.first_class_free ? 'Sim' : 'Não'}</p>
          
            <button>Editar anúncio</button>
          </div>

          
        )}
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


