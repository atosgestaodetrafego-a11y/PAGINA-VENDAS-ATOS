# ATOS Clientes Locais — WordPress

Página de vendas da ATOS Gestão de Tráfego. Tema de blocos próprio, com a copy fornecida por Leandro Gomes, identidade preto `#151515`, creme `#FBF6ED` e âmbar `#ED9C08` e WhatsApp **+55 (11) 95731-4749**.

## Instalar

1. Faça um backup se já existir um site na hospedagem. A ativação troca a apresentação do site.
2. Tenha o WordPress instalado, versão 6.6 ou superior, e PHP 8.2 ou superior.
3. Baixe **[atos-clientes-locais.zip](dist/atos-clientes-locais.zip)**. Use o ZIP do tema, não o “Download ZIP” do repositório inteiro.
4. No painel, entre em **Aparência → Temas → Adicionar novo tema → Enviar tema**.
5. Selecione o ZIP, instale e ative **ATOS Clientes Locais**.
6. Abra **Aparência → Configurar ATOS** para revisar o WhatsApp, escolher a foto de Leandro e substituir a logomarca se necessário.
7. Abra a página inicial e teste os botões no celular. Eles abrem o WhatsApp com uma mensagem pronta.

O tema apresenta a página de vendas na raiz do site ao ser ativado, preservando páginas, posts e banco de dados existentes. Não cria usuários, não altera plugins e não publica em sua hospedagem a partir do GitHub.

## Editar o conteúdo

Entre em **Aparência → Editor → Design → Modelos → Página inicial**. Os nomes podem variar ligeiramente entre versões. Selecione os títulos, parágrafos, listas e cartões para editar visualmente. Salve ao concluir. Cabeçalho e rodapé são partes de modelo, também editáveis no Editor.

Os blocos de shortcode `[atos_cta]`, `[atos_portrait]` e `[atos_brand]` recebem seus dados de **Configurar ATOS**. Não remova os colchetes. O rótulo de cada botão pode ser editado no atributo `label` do shortcode. Preço e demais textos são blocos comuns, editáveis no modelo.

As edições feitas pelo Editor ficam no banco de dados do WordPress e prevalecem sobre arquivos atualizados do tema. Para voltar ao modelo original, use a opção de limpar personalizações do modelo, após backup. Para desfazer a instalação, reative o tema anterior.

## Foto e tipografia

A foto mencionada no pedido não veio anexada nesta conversa. O tema utiliza uma composição gráfica da ATOS enquanto não há foto cadastrada. **Envie a foto no painel Configurar ATOS**; ela substituirá a composição na capa e na seção sobre Leandro, sem código. Não foi utilizada uma foto de outra pessoa.

A fonte oficial informada é Gotham. Ela não foi redistribuída por não ter sido fornecido um arquivo com licença web. O CSS prioriza Gotham, quando disponível, e usa Arial como alternativa. Um arquivo WOFF2 licenciado pode ser incluído posteriormente com `@font-face` no CSS. Nenhuma fonte ou script de terceiros é carregado pelo tema.

## O que está incluído

- As 11 seções da copy original, incluindo detalhes de escopo, preço, condição inicial e ressalva dos números da esmalteria.
- Layout responsivo, navegação com âncoras, atalho para WhatsApp e FAQ nativo com teclado.
- Edição visual, seleção de imagens na Biblioteca de Mídia e configuração única do contato.
- SEO básico pelo título nativo do WordPress e descrição da página inicial. Sem scripts de rastreamento ou cookies publicitários pré-instalados.
- Link para política de privacidade quando uma página for configurada em **Configurações → Privacidade**.

A condição “quatro primeiras empresas” é texto da oferta e não possui contador automático de vagas. Revise quando deixar de ser válida. O tema não atribui os resultados da esmalteria a campanhas.

## Medição e privacidade

Os links de contato têm `data-atos-cta`. Ao clicar, o tema dispara o evento de navegador `atos:whatsapp` com o rótulo do botão, sem telefone ou dados de visitantes. Isso não envia nada ao Google ou à Meta. Para medir conversões, configure as ferramentas de análise e a gestão de consentimento conforme o projeto. O tema não registra vendas nem promete resultados.

## Desenvolvimento

```sh
node tools/build.mjs
node tools/validate.mjs
```

O build gera `theme/templates/front-page.html`, a prévia estática `preview/index.html` e o manifesto do pacote. Compacte apenas a pasta `theme/`, renomeada para `atos-clientes-locais/`, ou use a rotina do GitHub Actions. O ZIP pronto fica em `dist/`.

A prévia estática ajuda a revisar o layout; não substitui o teste em WordPress. A automação do repositório faz lint do PHP, instala o WordPress de teste com MySQL, ativa o tema, verifica a página, testa as configurações e registra capturas em computador e celular. Consulte o resultado em **Actions**.

## Estrutura

`theme/` contém o tema instalável. `tools/` contém o gerador e as verificações. `preview/` contém uma prévia local. `dist/` contém o ZIP para instalação. `docs/` contém as verificações de publicação.

## Referências técnicas

- [Estrutura dos temas WordPress](https://developer.wordpress.org/themes/core-concepts/theme-structure/)
- [Configuração do theme.json](https://developer.wordpress.org/themes/global-settings-and-styles/)
- [Settings API](https://developer.wordpress.org/plugins/settings/settings-api/)

## Direitos

Código PHP, HTML, CSS e JavaScript: GPL-2.0-or-later. A logomarca ATOS e os textos comerciais pertencem aos seus respectivos titulares; sua inclusão não concede licença de uso da marca a terceiros. Nenhum arquivo da fonte Gotham é distribuído.
