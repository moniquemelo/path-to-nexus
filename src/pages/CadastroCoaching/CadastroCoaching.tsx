/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../../supabaseClient';
import styles from './CadastroCoaching.module.css';

export default function CadastroCoaching() {
  const navigate = useNavigate(); 
  const [isCoaching, setIsCoaching] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    rotaMain: '',
    rotaSecundaria: '',
    melhoresCampeoes: '',
    tituloDoAnuncio: '',
    descricaoMetodologia: '',
    precoHora: '',
    aulaGratuita: false,
  });
  
  const [showSenha, setShowSenha] = useState(false); 
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(''); 
  

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
    setError(''); 
    setSuccess(''); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    const { username, email, senha } = form;

    try {
      const { data, error } = await supabase.auth.signUp({ email, password: senha });

      if (error) {
        if (error.message.includes('password')) {
          setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
        } else if (error.message.includes('already registered')) {
          setError('O e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
        } else {
          setError('Ocorreu um erro ao cadastrar. Tente novamente mais tarde.');
        }
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
        setError('Erro ao salvar dados no banco. Por favor, tente novamente.');
        return;
      }
      setSuccess('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.');

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError('Erro inesperado. Por favor, tente novamente mais tarde.');
      console.error(err);
    }
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
        <div className={styles.passwordWrapper}>
          <input
            type={showSenha ? 'text' : 'password'}
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            className={styles.inputForm}
            required
          />
          <button
            type="button"
            onClick={() => setShowSenha((prev) => !prev)}
            className={styles.eyeButton}
          >
            {showSenha ? '🙈' : '👁️'}
          </button>
        </div>
        <div className={styles.passwordWrapper}>
          <input
            type={showSenha ? 'text' : 'password'}
            name="confirmarSenha"
            placeholder="Confirmar Senha"
            value={form.confirmarSenha}
            onChange={handleChange}
            className={styles.inputForm}
            required
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}

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

