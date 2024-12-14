import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './Articles.module.css';

interface User {
  id: string;
  role: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  dt_published: string;
}

export default function Articles() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter usuário:', error.message);
        return;
      }
      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', data.user.id)
          .single();

        setUser(userData || null);
      }
    };

    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('id, title, description, category, dt_published')
        .eq('status', 'aprovado');

      if (error) {
        console.error('Erro ao carregar artigos:', error.message);
      } else {
        setArticles(data || []);
      }
    };

    fetchUser();
    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      alert('Preencha todos os campos!');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('guides').insert({
      title,
      description,
      category,
      author_id: user?.id,
      dt_published: new Date(),
      status: 'aprovado',
    });

    if (error) {
      console.error('Erro ao criar artigo:', error.message);
      alert('Erro ao criar artigo. Tente novamente mais tarde.');
    } else {
      setSuccessMessage('Artigo criado com sucesso!');
      setTitle('');
      setDescription('');
      setCategory('');
    }

    setIsSubmitting(false);
  };

  return (
    <section className={styles.container}>
      
      {user?.role === 'coach' && (
        <button
          className={`${styles.toggleFormButton} ${
            isFormVisible ? styles.openForm : styles.closeForm
          }`}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Fechar Formulário' : 'Criar Novo Artigo'}
        </button>
      )}

      
      {isFormVisible && user?.role === 'coach' && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.labelForms} htmlFor="title">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do artigo"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.labelForms} htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva a descrição do artigo"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.labelForms} htmlFor="category">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              <option value="campeões">Campeões</option>
              <option value="runas">Runas</option>
              <option value="builds">Builds</option>
              <option value="conta">Conta</option>
              <option value="ranqueadas">Ranqueadas</option>
              <option value="itens">Itens</option>
              <option value="espólios">Espólios</option>
              <option value="punições">Punições</option>
              <option value="patch notes">Patch Notes</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Criar Artigo'}
          </button>
          {successMessage && (
            <p className={styles.successMessage}>{successMessage}</p>
          )}
        </form>
      )}


      <div className={styles.articlesList}>
        <h2 className={styles.articlesSectionTitle}>Artigos</h2>
        {articles.map((article) => (
          <div key={article.id} className={styles.article}>
            <h2 className={styles.articleTitle}>{article.title}</h2>
            <p className={styles.articleDescription}>{article.description}</p>
            <p className={styles.category}>Categoria: {article.category}</p>
            <p className={styles.dtPublished}>
              Publicado em: {new Date(article.dt_published).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

