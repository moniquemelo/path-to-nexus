import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; 
import styles from './Coaching.module.css';
import { FaStar } from 'react-icons/fa'; 
import CatDefault from '../../assets/coaching.jpg';

interface Coaching {
  id: string;
  title: string;
  description: string;
  price: number;
  main_role: string;
  secondary_role: string;
  status: string;
  user_id: string;
  username?: string;
  image_url?: string;
  averageRating?: number;
  ratingCount?: number;
}

export default function Coaching() {
  const [filters, setFilters] = useState({
    mainRole: '',
    responseTime: '',
    isPro: false,
    priceRange: [20, 500],
  });
  const [coachings, setCoachings] = useState<Coaching[]>([]); 
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchCoachings = async () => {
      setLoading(true);

      let query = supabase
        .from('announcements')
        .select(`
          id,
          title,
          description,
          price,
          main_role,
          secondary_role,
          status,
          user_id
        `)
        .eq('status', 'ativo'); 

      if (filters.mainRole) {
        query = query.eq('main_role', filters.mainRole); 
      }

      if (filters.isPro) {
        query = query.eq('is_pro', true); 
      }

      if (filters.priceRange && filters.priceRange.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange;
        query = query.gte('price', minPrice).lte('price', maxPrice); 
      }

      try {
        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar coachings:', error.message);
          return;
        }
        const userIds = data?.map((coaching) => coaching.user_id);
        if (userIds && userIds.length > 0) {
          const { data: users, error: userError } = await supabase
            .from('users')
            .select('id, username')
            .in('id', userIds);

          if (userError) {
            console.error('Erro ao buscar usuários:', userError.message);
            return;
          }

          const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('coach_id, review')
            .in('coach_id', data.map((coaching: any) => coaching.id));

          if (reviewsError) {
            console.error('Erro ao buscar avaliações:', reviewsError.message);
            return;
          }

          const coachingsWithUsersAndRatings = data?.map((coaching: any) => {
            const user = users?.find((u) => u.id === coaching.user_id);
            const coachingReviews = reviews?.filter((review: any) => review.coach_id === coaching.id);
            const averageRating = coachingReviews.length
              ? coachingReviews.reduce((sum, review) => sum + review.review, 0) / coachingReviews.length
              : null;

            return {
              ...coaching,
              username: user?.username || 'Desconhecido',
              averageRating: averageRating || 0,
              ratingCount: coachingReviews.length,
            };
          });

          setCoachings(coachingsWithUsersAndRatings || []);
        }
      } catch (err) {
        console.error('Erro na requisição ao Supabase:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachings();
  }, [filters]);

  const renderCoachingCards = () => {
    if (loading) {
      return <p className={styles.loading}>Carregando coachings...</p>;
    }

    if (coachings.length === 0) {
      return <p className={styles.noCoachings}>Nenhum coaching encontrado.</p>;
    }

    return coachings.map((coaching, index) => (
      <div key={index} className={styles.card}>
        <img width={200} src={coaching.image_url || CatDefault} alt={coaching.username} />
        <div className={styles.cardInfos}>
          <div className={styles.cardUsernameAndRating}>
            <h2 className={styles.cardTitle}>{coaching.username}</h2>
            <div className={styles.ratingContainer}>
              <FaStar color="yellow" />
              <span className={styles.rating}>
                {coaching.averageRating.toFixed(1)} ({coaching.ratingCount} {coaching.ratingCount === 1 ? 'nota' : 'notas'})
              </span>
            </div>
          </div>
          <p className={styles.cardSubtitle}>{coaching.title}</p>
          <div className={styles.bestRoles}>
            <p className={styles.cardMainRole}>{coaching.main_role.toUpperCase()}</p>
            <p className={styles.cardSecondaryRole}>{coaching.secondary_role.toUpperCase()}</p>
          </div>
          <p className={styles.cardPrice}>R$ {coaching.price.toFixed(2)}/hora</p>      
        </div>
      </div>
    ));
  };

  return (
    <section className={styles.gridCoachings}>
      <h1 className={styles.gridTitle}>Encontre agora mesmo o melhor Coaching para os seus objetivos!</h1>
      <div className={styles.filtersContainer}>
        <div className={styles.filter}>
          <label htmlFor="mainRole">Main Role</label>
          <select
            id="mainRole"
            name="mainRole"
            value={filters.mainRole}
            onChange={handleFilterChange}
          >
            <option value="">Selecione</option>
            <option value="top">Top</option>
            <option value="jungle">Jungle</option>
            <option value="mid">Mid</option>
            <option value="atirador">Atirador</option>
            <option value="suporte">Suporte</option>
          </select>
        </div>

        <div className={styles.filter}>
          <label htmlFor="responseTime">Tempo de Resposta</label>
          <select
            id="responseTime"
            name="responseTime"
            value={filters.responseTime}
            onChange={handleFilterChange}
          >
            <option value="">Selecione</option>
            <option value="fast">Rápido</option>
            <option value="medium">Médio</option>
            <option value="slow">Lento</option>
          </select>
        </div>

        <div className={styles.filter}>
          <label htmlFor="isPro">Coaching Pro</label>
          <input
            id="isPro"
            name="isPro"
            type="checkbox"
            checked={filters.isPro}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className={styles.gridCards}>
        {renderCoachingCards()}
      </div>

      <button className={styles.button}>Ver mais coachings</button>
    </section>
  );
}
