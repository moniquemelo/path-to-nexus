import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../../assets/banner.png';
import coaching from '../../assets/coaching.jpg';
import styles from './Home.module.css';
import LoginModal from '../../components/Login/loginModal';

export default function Home() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const handleCadastreSeClick = () => {
    navigate('/cadastro-coaching'); 
  };

  const articles = [
    {
      title: 'Liga das Américas 2025: Isurus Estral quer top ex-LCK e LPL, diz jornalista',
      description: 'A Isurus Estral, equipe da LTA Sul, está em negociações avançadas com o jogador sul-coreano Burdol...',
    },
    {
      title: 'Arcane: Campeões do LoL que aparecem na 2° temporada',
      description: 'A aguardada segunda temporada de Arcane, baseada no universo de League of Legends, trouxe diversos campeões...',
    },
    {
      title: 'LoL: Riot passará a banir jogadores por mau comportamento em streams',
      description: 'A Riot Games anunciou uma atualização significativa em seus Termos de Serviço, que entrará em vigor no dia 1º de dezembro...',
    },
  ];

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
        <img src={bannerImage} alt="Banner principal" />
      </section>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      
      <section className={styles.services}>
        <div className={styles.servicesInner}>
          <img src={bannerImage} alt="" />
          <div className={styles.servicesText}>
            <p className={styles.servicesTitle}>Nosso objetivo é formar um ecossistema completo de diversão, aprendizagem e interação com a comunidade de League of Legends.</p>
            <p className={styles.servicesSubtitle}>O nexusGG é para você que quer:</p>
            <p className={styles.servicesSubtitle}>Contratar um coaching</p>
            <p className={styles.servicesSubtitle}>Ler guias e artigos para aprender cada vez mais</p>
            <p className={styles.servicesSubtitle}>Interagir com a comunidade através dos fóruns e workshops</p>
          </div>
        </div> 
      </section>

      <section className={styles.gridCoachings}>
        <h1 className={styles.gridTitle}>Encontre o coaching perfeito!</h1>
        <div className={styles.gridCards}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.card}>
              <img width={200} src={coaching} alt="" />
              <div className={styles.cardText}>
                <h2 className={styles.cardTitle}>Monique Melo</h2>
                <p className={styles.cardSubtitle}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto animi porro consectetur dolorem sunt nihil.</p>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.button}>Ver Mais</button>
      </section>

      <section>
        <div className={styles.articleList}>
          <h1 className={styles.articleListTitle}>Os melhores artigos e guias para você aprimorar sua gameplay</h1>
          {articles.map((article, index) => (
            <div key={index} className={styles.article}>
              <h2 className={styles.title}>{article.title}</h2>
              <p className={styles.description}>{article.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className={styles.forumAndWorkshops}>
          <h1 className={styles.forumAndWorkshopsTitle}>Acesse o nosso fórum e workshop gratuitamente!</h1> 
          <div className={styles.forumAndWorkshopsImages}>
            <img width={400} height={400} src={coaching} alt="" />
            <img width={400} height={400} src={bannerImage} alt="" />        
          </div>
        </div>
      </section>
    </main>
  );
}
