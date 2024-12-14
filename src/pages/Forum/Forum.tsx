import styles from '../Forum/Forum.module.css';

export default function Forum(){
  return (
    <section>
      <div className={styles.forum}>
        <div className={styles.forumInner}>
          <div className={styles.forumCategories}>
            <ul className={styles.forumCategoriesList}>
              <h2 className={styles.forumCategoriesTitle}>CATEGORIAS</h2>
              <li className={styles.forumCategoriesItem}>Campeões</li>
              <li className={styles.forumCategoriesItem}>Runas</li>
              <li className={styles.forumCategoriesItem}>Espólio</li>
              <li className={styles.forumCategoriesItem}>Loja</li>
              <li className={styles.forumCategoriesItem}>Skins</li>
              <li className={styles.forumCategoriesItem}>Conta</li>
              <li className={styles.forumCategoriesItem}>Punições</li>
            </ul>
          </div>

          {/* <div className={styles.forumPosts}>
            <ul className={styles.forumPostsList}>
              <li className={styles.forumPostsItem}>Post1</li>
              <li className={styles.forumPostsItem}>Post1</li>
              <li className={styles.forumPostsItem}>Post1</li>
              <li className={styles.forumPostsItem}>Post1</li>
              <li className={styles.forumPostsItem}>Post1</li>
              <li className={styles.forumPostsItem}>Post1</li>
              <li className={styles.forumPostsItem}>Post1</li>
            </ul>
          </div> */}
        </div>
      </div>
    </section> 
  );
};