Funcionalidade: Listagem de faixas do álbum
  Para ouvir um álbum
  Como usuário
  Quero ver a lista de faixas e metadados essenciais

  Cenário: Faixas retornadas com sucesso
    Quando envio GET "/albumTracks/1To7kv722A8SpZF7M07D4p"
    Então recebo status 200
    E o corpo contém total_tracks e items
    E cada faixa possui id, name, track_number, duration_ms, href e artists

  Cenário: Erro ao obter faixas
    Quando envio GET "/albumTracks/invalid_id"
    Então recebo status 500
    E um corpo com erro indicando falha na obtenção das músicas

