Funcionalidade: Busca de artistas
  Para encontrar artistas no Spotify
  Como usuário autenticado ou visitante
  Quero buscar por nome e obter resultados limitados

  Cenário: Query muito curta
    Quando envio GET "/searchArtists?q=a"
    Então recebo status 200
    E a lista de artistas é vazia

  Cenário: Busca sem query
    Quando envio GET "/searchArtists"
    Então recebo status 200
    E a lista de artistas é vazia

  Cenário: Busca bem-sucedida
    Quando envio GET "/searchArtists?q=Radiohead"
    Então recebo status 200
    E a resposta contém uma lista de até 10 artistas
    E cada item possui id, name, popularity, genres e total_followers

  Cenário: Erro na API do Spotify
    Dado que a API do Spotify retorna erro 500
    Quando envio GET "/searchArtists?q=Radiohead"
    Então recebo status 500
    E a resposta contém "Erro ao buscar artistas"

