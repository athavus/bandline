Funcionalidade: Documentação da API
  Para conhecer os endpoints disponíveis
  Como desenvolvedor cliente
  Quero acessar a especificação OpenAPI e a interface visual

  Cenário: Obter OpenAPI
    Quando envio GET "/openapi.yaml"
    Então recebo status 200
    E o conteúdo está em formato YAML da versão 3.1

  Cenário: Acessar UI de documentação
    Quando acesso "/docs" no navegador
    Então vejo a interface do Scalar com os endpoints descritos

