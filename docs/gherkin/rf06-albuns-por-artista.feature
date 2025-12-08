Funcionalidade: Listagem de álbuns por artista
  Para explorar discografia
  Como usuário
  Quero ver os álbuns de um artista em ordem de lançamento

  Cenário: Listagem ordenada
    Quando envio GET "/artistAlbums/4Z8W4fKeB5YxbusRsdQVPb"
    Então recebo status 200
    E o corpo contém total_amount e items
    E os álbuns estão ordenados por release_date do mais antigo para o mais recente

  Cenário: Erro na API externa
    Quando envio GET "/artistAlbums/invalid_id"
    Então recebo status 500
    E um corpo com erro

