Funcionalidade: Histórico de buscas
  Para rever artistas pesquisados
  Como usuário autenticado
  Quero registrar e listar meu histórico recente

  Cenário: Adicionar histórico
    Dado que estou autenticado
    E envio POST "/history" com artistId, artistName e artistAvatar
    Então recebo status 200
    E o histórico criado contém esses campos e userId

  Cenário: Campos faltando
    Dado que estou autenticado
    Quando envio POST "/history" sem artistName
    Então recebo status 400
    E a mensagem indica campos obrigatórios

  Cenário: Listar últimos 50
    Dado que tenho mais de 50 entradas de histórico
    Quando envio GET "/history"
    Então recebo status 200
    E a lista contém no máximo 50 itens ordenados por searchedAt desc

  Cenário: Requer autenticação
    Quando envio GET "/history" sem estar autenticado
    Então recebo status 401
    E a mensagem "Não Autenticado"

