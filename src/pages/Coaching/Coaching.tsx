/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import CoachingCard from '../../components/CoachingCard/CoachingCard';
import { supabase } from '../../supabaseClient';
import styles from './Coaching.module.css';

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

export default function Coaching() {
  const [filters, setFilters] = useState({
    mainRole: '',
    secondaryRole: '',
    priceRange: [20, 500],
    firstClassFree: false,
  });
  const [coachings, setCoachings] = useState<Coaching[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState<number>(filters.priceRange[1]);
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [prevFilters.priceRange[0], newValue],
    }));
    setPriceDisplay(newValue); 
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleChampionSearch = debounce((value) => {
    setFilters((prev) => ({
      ...prev,
      champion: value, 
    }));
  }, 300);

  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
  
  useEffect(() => {
    const fetchCoachings = async () => {
      setLoading(true);
      try {
        const query = supabase
          .from('announcements')
          .select(
            `
            id,
            title,
            description,
            price,
            main_role,
            secondary_role,
            first_class_free,
            users (
              username,
              profile_image_url
            )
          `
          )
          .eq('status', 'ativo');

        if (filters.mainRole) {
          query.eq('main_role', filters.mainRole);
        }
        if (filters.secondaryRole) {
          query.eq('secondary_role', filters.secondaryRole);
        }
        if (filters.priceRange) {
          query
            .gte('price', filters.priceRange[0])
            .lte('price', filters.priceRange[1]);
        }
        if (filters.firstClassFree) {
          query.eq('first_class_free', true);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar coachings:', error.message);
          return;
        }

        const coachingsWithDetails = data.map((coaching: any) => ({
          ...coaching,
          username: coaching.users?.username || 'Desconhecido',
          profile_image_url: coaching.users?.profile_image_url || null,
        }));

        setCoachings(coachingsWithDetails);
      } catch (err) {
        console.error('Erro ao buscar coachings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachings();
  }, [filters]);

  return (
    <section className={styles.gridCoachings}>
      <h1 className={styles.gridTitle}>Encontre o melhor Coaching para você!</h1>
      <div className={styles.filtersContainer}>
  <div className={styles.inlineFilters}>
    <div className={styles.filterItem}>
      <label htmlFor="mainRole">Main Role</label>
      <select
        id="mainRole"
        name="mainRole"
        value={filters.mainRole}
        onChange={handleFilterChange}
      >
        <option value="">Todos</option>
        <option value="TOP">Top</option>
        <option value="JUNGLE">Jungle</option>
        <option value="MID">Mid</option>
        <option value="ADC">ADC</option>
        <option value="SUPPORT">Support</option>
      </select>
    </div>

    <div className={styles.filterItem}>
      <label htmlFor="secondaryRole">Secondary Role</label>
      <select
        id="secondaryRole"
        name="secondaryRole"
        value={filters.secondaryRole}
        onChange={handleFilterChange}
      >
        <option value="">Todos</option>
        <option value="TOP">Top</option>
        <option value="JUNGLE">Jungle</option>
        <option value="MID">Mid</option>
        <option value="ADC">ADC</option>
        <option value="SUPPORT">Support</option>
      </select>
    </div>

    <div className={styles.filterItem}>
      <label htmlFor="championsSearch">Melhores Campeões</label>
      <div className={styles.searchChampions}>
        <input
          type="text"
          id="championsSearch"
          placeholder="Digite o nome do campeão"
          onChange={(e) => handleChampionSearch(e.target.value)}
        />
      </div>
    </div>
  </div>

  <div className={styles.inlineFilters}>
    <div className={styles.filterItem}>
    <label htmlFor="priceRange">Preço (R$)</label>
    <div className={styles.rangeWrapper}>
      <div className={styles.rangeInput}>
        {isHovering && (
          <div
            className={styles.priceIndicator}
            style={{
              left: `${((priceDisplay - 20) / (500 - 20)) * 100}%`,
            }}
          >
            R$ {priceDisplay}
          </div>
        )}
        <input
          id="priceRange"
          name="priceRange"
          type="range"
          min="20"
          max="500"
          step="10"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave} 
        />
      </div>
      <div className={styles.rangeValues}>
        <span>{`R$ ${filters.priceRange[0]}`}</span>
        <span>{`R$ ${filters.priceRange[1]}`}</span>
      </div>
    </div>
    </div>

    <div className={styles.filterItem}>
      <label htmlFor="firstClassFree" className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          name="firstClassFree"
          checked={filters.firstClassFree}
          onChange={handleFilterChange}
        />
        Primeira aula grátis
      </label>
    </div>
  </div>
</div>

      <div className={styles.gridCards}>
        {loading ? (
          <p>Carregando...</p>
        ) : coachings.length === 0 ? (
          <p className={styles.NotFoundCoaching}>Nenhum coaching encontrado.</p>
        ) : (
          coachings.map((coaching) => (
            <CoachingCard
              key={coaching.id}
              title={coaching.title}
              description={coaching.description}
              price={coaching.price}
              image_url={coaching.profile_image_url}
              mainRole={coaching.main_role}
              secondaryRole={coaching.secondary_role}
              username={coaching.username}
              rating={coaching.averageRating}
              ratingCount={coaching.ratingCount}
            />
          ))
        )}
      </div>
    </section>
  );
}
