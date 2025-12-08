Funcionalidade: Login via Google OAuth
  Para autenticar usando Google
  Como visitante
  Quero iniciar e concluir o fluxo OAuth

  Cenário: Redirecionamento para Google
    Quando acesso GET "/auth/google"
    Então sou redirecionado para a página de autenticação do Google

  Cenário: Callback bem-sucedido
    Dado que conclui a autenticação no Google
    Quando o provedor chama GET "/auth/google/callback" com autorização válida
    Então a aplicação redireciona para "http://localhost:5173/"
    E a sessão do usuário fica ativa

  Cenário: Callback com erro
    Dado que o Google retorna erro no callback
    Quando GET "/auth/google/callback" é chamado sem autorização válida
    Então sou redirecionado para "http://localhost:5173/login?error=oauth_failed"

