import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './CadastroCoaching.module.css';

export default function CadastroCoaching() {
  const [isCoaching, setIsCoaching] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    senha: '',
    rotaMain: '',
    rotaSecundaria: '',
    melhoresCampeoes: '',
    tituloDoAnuncio: '',
    descricaoMetodologia: '',
    precoHora: '',
    aulaGratuita: false, 
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, senha, aulaGratuita } = form;  
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    
    if (error) {
      console.error('Erro ao cadastrar usuário no Auth:', error.message);
      alert('Erro no cadastro. Tente novamente.');
      return;
    }

    const userId = data.user?.id;

    const { error: dbError } = await supabase.from('users').insert([
      {
        id: userId,
        username,
        email,
        role: isCoaching ? 'coach' : 'aluno',
      },
    ]);

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError.message);
      alert('Erro ao salvar dados adicionais. Tente novamente.');
      return;
    }

    if (isCoaching) {
      const { rotaMain, rotaSecundaria, melhoresCampeoes, tituloDoAnuncio, descricaoMetodologia, precoHora } = form;
      const { error: announcementError } = await supabase.from('announcements').insert([
        {
          user_id: userId,
          main_role: rotaMain,
          secondary_role: rotaSecundaria || null,
          title: tituloDoAnuncio,
          best_champions_role: melhoresCampeoes.split(',').map(champ => champ.trim()),
          description: descricaoMetodologia,
          price: parseFloat(precoHora),
          status: 'pendente',
          dt_create: new Date().toISOString(),
          first_class_free: aulaGratuita,
        },
      ]);

      if (announcementError) {
        console.error('Erro ao criar anúncio:', announcementError.message);
        alert('Erro ao salvar anúncio. Tente novamente.');
        return;
      }
    }

    alert('Cadastro realizado com sucesso!');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className={styles.inputForm}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.inputForm}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className={styles.inputForm}
          required
        />
        <div className={styles.toggleWrapper}>
          <span className={styles.toggleLabel}>Quero ser Coaching</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isCoaching}
              onChange={() => setIsCoaching((prev) => !prev)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {isCoaching && (
          <>
            <select
              name="rotaMain"
              value={form.rotaMain}
              onChange={handleChange}
              className={styles.inputSelect}
              required
            >
              <option value="">Selecione sua Main Role</option>
              <option value="top">Top</option>
              <option value="jungle">Jungle</option>
              <option value="mid">Mid</option>
              <option value="atirador">Atirador</option>
              <option value="suporte">Suporte</option>
            </select>

            <select
              name="rotaSecundaria"
              value={form.rotaSecundaria}
              onChange={handleChange}
              className={styles.inputSelect}
            >
              <option value="">Selecione sua Rota Secundária (opcional)</option>
              <option value="top">Top</option>
              <option value="jungle">Jungle</option>
              <option value="mid">Mid</option>
              <option value="atirador">Atirador</option>
              <option value="suporte">Suporte</option>
            </select>

            <textarea
              name="melhoresCampeoes"
              placeholder="Melhores Campeões (separados por vírgula)"
              value={form.melhoresCampeoes}
              onChange={handleChange}
              className={styles.textarea}
            />
            <input
              type="text"
              name="tituloDoAnuncio"
              placeholder="Título do seu anúncio"
              value={form.tituloDoAnuncio}
              onChange={handleChange}
              className={styles.inputForm}
              required
            />
            <textarea
              name="descricaoMetodologia"
              placeholder="Descrição da metodologia"
              value={form.descricaoMetodologia}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
            <div className={styles.inlineInputs}>
              <input
                type="number"
                name="precoHora"
                placeholder="Preço Hora / Aula"
                value={form.precoHora}
                onChange={handleChange}
                className={`${styles.inputForm} ${styles.inputPrecoHora}`}
                required
              />
              <div className={styles.checkboxCustom}>
                <input
                  type="checkbox"
                  name="aulaGratuita"
                  checked={form.aulaGratuita}
                  onChange={handleChange}
                  className={styles.inputForm}
                />
                <p>Oferecer primeira aula gratuita?</p>
              </div>
            </div>
          </>
        )}
        <button type="submit" className={styles.submitButton}>
          Enviar
        </button>
      </form>
    </div>
  );
}

