# Página de entrada da OCUPA

## Objetivo
Criar uma página de entrada responsiva e coerente com a identidade editorial existente, sem autenticação real.

## Implementação
- Criar a rota `/entrar` com um painel visual arquitetônico no desktop e uma versão de marca compacta no celular.
- Reutilizar uma fotografia já existente da OCUPA, a paleta off-white, verde e terracota, as fontes DM Serif Display e Inter e os componentes de botão atuais.
- Componentizar a tela em `AuthLayout`, `LoginForm`, `FormField`, `PasswordInput` e `SocialLoginButton`.
- Adicionar validação acessível para e-mail e senha, alternância de visibilidade, mensagens vinculadas aos campos e estados de foco e desabilitado.
- Simular o acesso com um breve estado “Entrando...” e, em seguida, navegar para a página principal na área de exploração.
- Criar uma rota simples `/cadastro` para que “Criar conta” tenha destino funcional, sem implementar cadastro real.
- Atualizar “Entrar” na barra superior para abrir a nova página.
- Incluir metadados próprios nas novas páginas e manter o restante do site inalterado.

## Verificação
- Conferir visualmente a tela em desktop e celular.
- Testar erros de campos vazios, e-mail inválido, exibição da senha e acesso simulado.
- Confirmar que os links de entrada, cadastro e retorno funcionam e que a aplicação permanece sem erros.
