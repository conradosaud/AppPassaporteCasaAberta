// Centralized Supabase configuration (REST API access via fetch)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

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

/**
 * Insere um registro na tabela `usuarios` do Supabase.
 * @param {Object} user - Dados do usuário
 * @param {string} user.fullName - Nome completo
 * @param {boolean} user.isFirstTime - Primeira vez (true/false)
 * @param {string} user.registeredAt - Timestamp ISO
 * @param {string} user.period - Período (morning/afternoon/night)
 */
export async function salvarUsuario({ fullName, isFirstTime, registeredAt, period }) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ nome: fullName, "primeiraVez": isFirstTime, "dataCriacao": registeredAt, periodo: period })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao salvar usuário: ${errorText}`);
  }
}
