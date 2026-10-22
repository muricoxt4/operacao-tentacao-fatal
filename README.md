# Arquivo 031 — Operação Tentação Fatal

Site estático em HTML, CSS e JavaScript. Capa e folhas com animação de virada, navegação por toque, mouse e teclado, adaptação para celular e redução de movimento.

Endereço: https://muricoxt4.github.io/operacao-tentacao-fatal/

Uma folha por vez em todas as telas. Toque no lado direito para avançar, no lado esquerdo para voltar ou deslize horizontalmente. Os botões Anterior/Próxima também funcionam por toque. As imagens foram otimizadas para conexões móveis.

## Publicar no GitHub Pages

1. Envie **o conteúdo desta pasta** para a raiz de um repositório no GitHub, incluindo `assets/`, `vendor/` e `.nojekyll`.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**, a branch **main** e a pasta **/(root)**. Salve.
4. O GitHub mostrará o endereço quando terminar a publicação.

Não exige Node.js, npm, instalação, build, API ou servidor. Todos os caminhos são relativos, portanto funciona em URLs de projeto como `usuario.github.io/nome-do-repositorio/`. Também funciona abrindo `index.html` diretamente no navegador.

## Arquivos

- `index.html`: conteúdo e estrutura das páginas.
- `styles.css`: mesa, pasta, papel envelhecido e disposição das folhas.
- `app.js`: abertura, navegação, acessibilidade e animação.
- `assets/`: imagens locais.
- `vendor/page-flip.browser.js`: StPageFlip 2.0.7, incluída localmente para não depender de CDN.
- `vendor/LICENSE-StPageFlip.txt`: licença MIT da biblioteca.

## Referências técnicas

- Animação StPageFlip: https://github.com/Nodlik/StPageFlip
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

A licença da biblioteca se aplica ao código em `vendor/`; ela não concede direitos sobre as imagens ou demais conteúdos do projeto.
