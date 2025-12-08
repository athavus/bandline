Funcionalidade: Perfil do usuário
  Para gerenciar minha conta
  Como usuário autenticado
  Quero consultar e atualizar minhas informações

  Cenário: Consultar perfil
    Dado que estou autenticado
    Quando envio GET "/profile"
    Então recebo status 200
    E o corpo contém id, username, email, bio, avatarUrl, históricos recentes e favoritos

  Cenário: Atualizar todos os campos
    Dado que estou autenticado
    Quando envio PUT "/profile" com username, email, bio e avatarUrl
    Então recebo status 200
    E a mensagem "Perfil atualizado com sucesso"
    E o corpo reflete os novos valores

  Cenário: Atualizar campo opcional
    Dado que estou autenticado
    Quando envio PUT "/profile" apenas com bio
    Então recebo status 200
    E apenas o campo bio é alterado

  Cenário: Requer autenticação
    Quando envio GET "/profile" sem autenticação
    Então recebo status 401
    E a mensagem "Não autenticado, ação não permitida"

