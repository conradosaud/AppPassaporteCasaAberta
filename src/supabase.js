import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Insere um registro na tabela `avaliacao` do Supabase.
 * @param {string} nome_user - Nome do visitante
 * @param {string} oficina_nome - Nome da oficina
 * @param {boolean} reposta - true = Like, false = Dislike
 */
export async function salvarAvaliacao(nome_user, oficina_nome, reposta) {
  const { error } = await supabase
    .from('avaliacao')
    .insert({ nome_user, oficina_nome, reposta });

  if (error) {
    throw new Error(`Erro ao salvar avaliação: ${error.message}`);
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
  const { error } = await supabase
    .from('usuarios')
    .insert({
      nome: fullName,
      primeiraVez: isFirstTime,
      dataCriacao: registeredAt,
      periodo: period,
    });

  if (error) {
    throw new Error(`Erro ao salvar usuário: ${error.message}`);
  }
}
