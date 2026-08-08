# Backlog

## Configuração Inicial
- [x] Inicialização do projeto React usando Vite


## Visitantes
- [x] Cadastro inicial parcial de usuário (tela de boas-vindas com registro no localStorage)
- [x] Cronograma
- [x] Integração do cronograma com dados reais (oficinas.json)
- [x] Alternador de visualização do cronograma (Grade vs. Linha do Tempo Vertical)
- [ ] Filtros do cronograma

## Oficinas
- [x] Ver detalhes de uma oficina pelo cronograma
- [x] Navegação direta do cronograma para tela de detalhes (substituído modal intermediário)
- [x] Marcar como concluído uma oficina (avaliação Like/Dislike salva no Supabase)
- [x] Integração Supabase via client oficial (@supabase/supabase-js) em vez de fetch manual
- [x] Modal de tolerância de 7 minutos entre conclusões de oficinas (sem exibir o tempo ao usuário)
- [x] Exposições não exibem botão "Concluir" nem permitem avaliação
- [x] Botão "Concluir" disponível apenas no período atual do usuário (Manhã/Tarde/Noite)
- [ ] Cadastrar uma nova oficina no sistema

## Administrativo
- [x] Visualizar relatórios e integração do dashboard com banco de dados Supabase
- [x] Corrigir indicadores do dashboard (Cadastrados, Total de Avaliações, Oficina Mais Visitada)
- [x] Total de oficinas baseado no arquivo oficinas.json (todas as 47 oficinas)
- [x] Gráfico "Visitas por oficina" exibindo todas as oficinas com zero avaliações incluídas
- [x] Gráfico "Período de maior visita" por categoria de oficina × período de cadastro do usuário
- [x] Bar Race animado mostrando ranking de avaliações por oficina
- [x] Layout desktop reorganizado: 5 KPIs em linha, gráficos em 3 colunas

## Estrutura e Navegação
- [x] Tela de boas-vindas com design premium (glassmorphism, background logomobile, logo Senac SVG)
- [x] Roteamento configurado (/, /cronograma, /relatorios, /detalhes)
- [x] Resolução de conflito de merge entre branches