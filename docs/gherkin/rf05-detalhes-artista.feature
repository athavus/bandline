Funcionalidade: Detalhes do artista
  Para visualizar informações ricas do artista
  Como usuário
  Quero obter detalhes, descrição localizada e artistas relacionados

  Cenário: Detalhes em português
    Quando envio GET "/artists/4Z8W4fKeB5YxbusRsdQVPb?lang=pt"
    Então recebo status 200
    E a resposta contém id, name, total_followers, popularity, image, genres, description e relatedArtists

  Cenário: Fallback de idioma
    Dado que o idioma solicitado não é suportado
    Quando envio GET "/artists/4Z8W4fKeB5YxbusRsdQVPb?lang=xx"
    Então a API utiliza "en" como padrão
    E retorna status 200 com descrição disponível

  Cenário: Erro ao obter artista
    Quando envio GET "/artists/invalid_id"
    Então recebo status 500
    E um corpo com erro indicando falha ao buscar artista

