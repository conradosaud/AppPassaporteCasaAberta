// Configuração centralizada do Supabase (acesso via REST API com fetch)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Insere um registro na tabela `avaliacao` do Supabase.
 * @param {string} nome_user - Nome do visitante
 * @param {string} oficina_nome - Nome da oficina
 * @param {boolean} resposta - true = Like, false = Dislike
 */
export async function salvarAvaliacao(nome_user, oficina_nome, resposta) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/avaliacao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ nome_user, oficina_nome, resposta })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao salvar avaliação: ${errorText}`);
  }
}
