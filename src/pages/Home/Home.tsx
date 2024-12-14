/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImageServices from '../../assets/banner-principal-servicos.webp';
import bannerImage from '../../assets/banner-principal.webp';
import { FaCheck } from "react-icons/fa";
import CoachingCard from '../../components/CoachingCard/CoachingCard';
import { supabase } from '../../supabaseClient';
import styles from './Home.module.css';
import defaultProfileImage from '../../assets/profile.png';

interface Coaching {
  id: string;
  title: string;
  description: string;
  price: number;
  main_role: string;
  secondary_role: string;
  username: string;
  profile_image_url?: string;
  averageRating?: number;
  ratingCount?: number;
  first_class_free: boolean;
}

export default function Home() {
  const [coachings, setCoachings] = useState<Coaching[]>([]);
  const navigate = useNavigate(); 

  const handleCadastreSeClick = () => {
    navigate('/cadastro-coaching'); 
  };

  useEffect(() => {
    const fetchCoachings = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          description,
          price,
          main_role,
          secondary_role,
          first_class_free,
          users:fk_user_id (username, profile_image_url)
        `)
        .eq('status', 'ativo')
        .order('score', { ascending: false })
        .limit(8);
    
      if (error) {
        console.error('Erro ao buscar coachings:', error.message);
        return;
      }
    
      const coachingsWithDetails = data.map((coaching: any) => ({
        ...coaching,
        username: coaching.users?.username || 'Desconhecido',
        profile_image_url: coaching.users?.profile_image_url || defaultProfileImage
      }));
      
    
      setCoachings(coachingsWithDetails);
    };
    

    fetchCoachings();
  }, []); 

  const handleViewMore = () => {
    navigate('/coachings');
  };

  return (
    <main>
      <section className={styles.banner}>
        <div className={styles.bannerText}>
          <h1 className={styles.bannerTitle}>
            Seja o herói do seu time. Sua evolução começa <span className={styles.bannerTitleHighlighted}>aqui!</span>
          </h1>
          <p className={styles.bannerSubtitle}>
            Plataforma que conecta você aos melhores conteúdos do universo de League of Legends.
            Evolua suas habilidades com os serviços de coaching, artigos, fórum e workshops.
          </p>
          <button className={styles.button} onClick={handleCadastreSeClick}>
            Cadastre-se
          </button>
        </div>
        <img className={styles.bannerImage} src={bannerImage} alt="Banner principal" />
      </section>

      <section className={styles.services}>
        <div className={styles.servicesInner}>
          <img className={styles.servicesImage} src={bannerImageServices} alt="Serviços" />
          <div className={styles.servicesText}>
            <p className={styles.servicesTitle}>Nosso objetivo é formar um ecossistema completo de diversão, aprendizagem e interação com a comunidade.</p>
            
            <p className={styles.servicesSubtitle}>O nexusGG é para você que quer:</p>
            <p className={styles.servicesSubtitle}><FaCheck /> Contratar um coaching</p>
            <p className={styles.servicesSubtitle}><FaCheck /> Ler guias e artigos para aprender cada vez mais</p>
            <p className={styles.servicesSubtitle}><FaCheck /> Interagir com a comunidade através dos fóruns e workshops</p>
          </div>
        </div> 
      </section>

      <section className={styles.gridCoachings}>
        <h1 className={styles.gridTitle}>Encontre o coaching perfeito!</h1>
        <div className={styles.gridCards}>
        
        {coachings.map((coaching) => (
          <CoachingCard
            key={coaching.id}
            title={coaching.title}
            description={coaching.description}
            price={coaching.price}
            image_url={coaching.profile_image_url || '../../assets/profile.png'}
            mainRole={coaching.main_role}
            secondaryRole={coaching.secondary_role}
            username={coaching.username}
            rating={coaching.averageRating}
            ratingCount={coaching.ratingCount}
          />
        
        ))}
        </div>
        <button className={styles.button} onClick={handleViewMore}>Ver Mais</button>
      </section>
    </main>
  );
}



