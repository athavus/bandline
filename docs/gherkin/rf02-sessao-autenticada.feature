Funcionalidade: Sessão autenticada
  Para acessar recursos protegidos
  Como usuário registrado
  Quero autenticar e manter sessão via cookie

  Cenário: Login bem-sucedido
    Dado que existe o usuário "loginuser" com senha "Senha@123"
    Quando envio POST para "/auth/login" com credenciais válidas
    Então recebo status 200
    E a resposta contém "Login bem-sucedido" e dados públicos do usuário
    E o cabeçalho "Set-Cookie" é retornado

  Cenário: Credenciais inválidas
    Dado que envio POST para "/auth/login" com senha incorreta
    Então recebo status 401
    E a mensagem contém "Credenciais inválidas"

  Cenário: Consultar usuário autenticado
    Dado que estou autenticado
    Quando envio GET para "/auth/me"
    Então recebo status 200 e os dados públicos do usuário

  Cenário: Logout
    Dado que estou autenticado
    Quando envio POST para "/auth/logout"
    Então recebo status 200
    E a mensagem "Logout realizado com sucesso" é retornada

