/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';

export default function Perfil() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Perfil do Usuário</h2>
      <p><strong>Nome:</strong> {user.user_metadata?.name || 'Não fornecido'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Avatar:</strong></p>
      {user.user_metadata?.avatar_url ? (
        <img src={user.user_metadata.avatar_url} alt="Avatar" width="100" />
      ) : (
        <p>Avatar não disponível.</p>
      )}
    </div>
  );
}
