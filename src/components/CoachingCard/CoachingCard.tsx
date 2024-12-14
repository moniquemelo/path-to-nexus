import React from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './CoachingCard.module.css';

interface CoachingCardProps {
  title: string;
  description: string;
  price: number;
  image_url: string;
  mainRole: string;
  secondaryRole: string;
  username: string;
  rating?: number;
  ratingCount?: number;
}

const CoachingCard: React.FC<CoachingCardProps> = ({
  title,
  price,
  image_url,
  mainRole,
  secondaryRole,
  username,
  rating = 0,
  ratingCount = 0,
}) => (
  <div className={styles.card}>
    <img
      src={image_url || '../../assets/profile.png'} 
      alt={`${username}`}
    />
    <div className={styles.cardInfos}>
      <div className={styles.cardUsernameAndRating}>
        <h2 className={styles.cardTitle}>{username}</h2>
        <div className={styles.ratingContainer}>
          <FaStar color="yellow" />
          <span className={styles.rating}>
            {rating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'nota' : 'notas'})
          </span>
        </div>
      </div>
      <p className={styles.cardSubtitle}>{title}</p>
      <div className={styles.bestRoles}>
        <span className={styles.roleBadgeMain}>{mainRole.toUpperCase()}</span>
        <span className={styles.roleBadgeSecondary}>{secondaryRole.toUpperCase()}</span>
      </div>
      <p className={styles.cardPrice}>R$ {price.toFixed(2)}/hora</p>
    </div>
  </div>
);


export default CoachingCard;
