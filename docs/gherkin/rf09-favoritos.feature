Funcionalidade: Favoritos de álbuns
  Para salvar álbuns preferidos
  Como usuário autenticado
  Quero adicionar, listar, checar e remover favoritos

  Cenário: Adicionar favorito
    Dado que estou autenticado
    Quando envio POST "/favorites" com albumId e albumName
    Então recebo status 200
    E a mensagem "Álbum favoritado com sucesso"

  Cenário: Campos obrigatórios faltando
    Dado que estou autenticado
    Quando envio POST "/favorites" sem albumName
    Então recebo status 400
    E a mensagem "albumId e albumName são obrigatórios"

  Cenário: Duplicidade
    Dado que já favoritei o albumId "existing_album"
    Quando envio POST "/favorites" com o mesmo albumId
    Então recebo status 409
    E a mensagem "Álbum já está nos favoritos"

  Cenário: Listar favoritos
    Dado que estou autenticado
    Quando envio GET "/favorites"
    Então recebo status 200
    E a lista contém no máximo 50 itens ordenados por favoritedAt desc

  Cenário: Checar múltiplos favoritos
    Dado que estou autenticado
    E já favoritei "album1" e "album2"
    Quando envio POST "/favorites/check" com albumIds ["album1","album2","album3"]
    Então recebo status 200
    E favoriteIds contém "album1" e "album2" mas não "album3"

  Cenário: Remover favorito
    Dado que estou autenticado
    E já favoritei "album_to_delete"
    Quando envio DELETE "/favorites" com albumId "album_to_delete"
    Então recebo status 200
    E a mensagem "Favorito removido com sucesso"

