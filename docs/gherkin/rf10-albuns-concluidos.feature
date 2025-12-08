Funcionalidade: Álbuns concluídos
  Para marcar álbuns que já ouvi
  Como usuário autenticado
  Quero adicionar, listar, checar e remover álbuns concluídos

  Cenário: Marcar como concluído
    Dado que estou autenticado
    Quando envio POST "/completedAlbums" com albumId e albumName
    Então recebo status 200
    E a mensagem "Álbum marcado como concluído com sucesso"

  Cenário: Campos obrigatórios faltando
    Dado que estou autenticado
    Quando envio POST "/completedAlbums" sem albumName
    Então recebo status 400
    E a mensagem "albumId e albumName são obrigatórios"

  Cenário: Duplicidade
    Dado que já marquei "albumA" como concluído
    Quando envio POST "/completedAlbums" com albumId "albumA"
    Então recebo status 409
    E a mensagem "Álbum já está nos completos"

  Cenário: Listar concluídos
    Dado que estou autenticado
    Quando envio GET "/completedAlbums"
    Então recebo status 200
    E a lista contém no máximo 50 itens ordenados por completedAt desc

  Cenário: Checar múltiplos concluídos
    Dado que estou autenticado
    E já marquei "album1" e "album2" como concluídos
    Quando envio POST "/completedAlbums/check" com albumIds ["album1","album2","album3"]
    Então recebo status 200
    E completedIds contém "album1" e "album2" mas não "album3"

  Cenário: Desmarcar concluído
    Dado que estou autenticado
    E já marquei "album_to_delete" como concluído
    Quando envio DELETE "/completedAlbums" com albumId "album_to_delete"
    Então recebo status 200
    E a mensagem "Álbum desmarcado como concluído com sucesso"

