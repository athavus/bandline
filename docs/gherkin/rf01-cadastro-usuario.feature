Funcionalidade: Cadastro de usuário
  Para criar uma conta no Bandline
  Como visitante
  Quero registrar username, email e senha

  Cenário: Cadastro bem-sucedido
    Dado que informo username "alice", email "alice@example.com" e senha "Senha@123"
    Quando envio a requisição POST para "/auth/register"
    Então o sistema deve responder com status 201
    E retornar a mensagem "Usuário criado"
    E o corpo deve conter o usuário sem o campo de senha

  Cenário: Campos obrigatórios faltando
    Dado que informo apenas username "alice"
    Quando envio a requisição POST para "/auth/register"
    Então o sistema deve responder com status 400
    E retornar a mensagem "Faltam campos"

  Cenário: Usuário já existente
    Dado que já existe um usuário com username "alice" ou email "alice@example.com"
    Quando envio a requisição POST para "/auth/register" com os mesmos dados
    Então o sistema deve responder com status 400
    E retornar a mensagem "Usuário já existe"

