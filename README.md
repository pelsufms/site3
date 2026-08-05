# IEEE PELS UFMS Chapter — Website

Site institucional do Capítulo Estudantil IEEE PELS UFMS, feito para o **IEEE Regional Awards &
Contests 2026 — Student Website Contest** (edital R9 SAC).

Stack: HTML + CSS + JavaScript puros (sem framework/build step), pensado para ser aberto e editado
direto no VSCode.

## Direção visual

Tema escuro/cinematográfico, com tipografia grande em caixa alta (Bebas Neue) e um único momento
forte de interação (parallax de profundidade no hero) — inspirado em
[the-goonies.webflow.io](https://the-goonies.webflow.io/): fundo quase preto, texto branco, o
vermelho da marca (`#BA0C2F`) usado só como destaque (títulos, botões, links, hover), sem gradientes
nem cards flutuantes coloridos. O impacto vem da tipografia e do contraste, não de efeitos
empilhados.

## Estrutura

```
pels-ufms-website/
├── index.html                    # página única com todas as seções exigidas pelo edital
├── css/style.css                 # design system escuro + tipografia + reveal on scroll
├── js/main.js                    # menu mobile, scrollspy, contadores, filtro da timeline, parallax do hero, lightbox
└── assets/img/
    ├── logo.png                  # logo completa (usada no header/footer)
    ├── hero-mark-icon.png        # recorte só do ícone (sem a linha de texto), usado como marca d'água do hero
    ├── favicon-*.png
    └── gallery/                  # fotos reais do capítulo
```

## Rodar localmente

Não precisa de servidor nem instalação. Basta abrir `index.html` no navegador, ou no VSCode usar a
extensão **Live Server** (botão "Go Live") para ter live-reload enquanto edita.

## Publicar no GitHub Pages (recomendado pelo edital: URL pública)

```bash
cd pels-ufms-website
git init
git add .
git commit -m "Site IEEE PELS UFMS Chapter"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/pels-ufms-website.git
git push -u origin main
```

Depois, no GitHub: **Settings → Pages → Source: branch `main` / pasta `/root`** → salvar. O site fica
disponível em `https://<seu-usuario>.github.io/pels-ufms-website/` em alguns minutos. Esse é o link
que deve ir no formulário de submissão e no relatório do edital.

## Interatividade (deliberadamente enxuta)

- **Hero com parallax de profundidade**: ao rolar, o ícone da mascote atrás do título escala e
  desaparece, como se a câmera passasse por ele — o único "momento" de scroll storytelling do site,
  em vez de vários efeitos concorrendo entre si.
- **Reveal on scroll**: seções entram com um fade + leve subida ao aparecerem na tela.
- **Diretoria em "character cards"**: hover revela uma borda vermelha e destaca o avatar, no
  espírito dos cards de personagem do site de referência.
- **Timeline filtrável** (Todos / Projetos / Eventos / Parcerias) e **galeria com lightbox**
  (setas, teclado, legenda).
- **Contadores animados** na barra de estatísticas.
- Tudo respeita `prefers-reduced-motion` (testado) e o site é responsivo (testado em mobile/desktop).

## Checklist do que ainda falta preencher (conteúdo real)

- [x] **Conselheiro(a)/Advisor** — confirmado como Raymundo Cordero, já preenchido na Diretoria.
- [ ] Fotos reais da diretoria (hoje os cards usam iniciais em vez de foto)
- [ ] **Fotos de confraternizações e do PELS Day** — a seção `#galeria` já está com 4 fotos reais
      recuperadas do Instagram público (@pels_ufms), mas o feed público é majoritariamente arte de
      divulgação (posters), não fotos de confraternização/PELS Day especificamente. Envie os arquivos
      originais (ou aponte os posts/destaques certos do Instagram) para eu trocar em
      `assets/img/gallery/` e ajustar as legendas em `index.html` (busque `TODO: substituir/completar`).
- [x] Datas específicas de alguns eventos já confirmadas via Instagram: Palestra BEM (02/04/2026),
      Webinar Mariana Espinola (26/05/2026), Power English (última edição 04/08/2026). Demais itens
      ainda usam rótulos genéricos ("Em andamento" / "Recorrente").
- [ ] Confirmar se o e-mail, WhatsApp e YouTube linkados ainda são os oficiais
- [ ] Relatório de documentação (até 4 páginas, template oficial do R9, em inglês) — não faz parte
      deste site, é um PDF separado exigido pelo edital

## Notas sobre o edital

- Critério de maior peso é **Conteúdo e Oportunidades (40/100)** — a seção `#oportunidades` foi
  priorizada para isso.
- O edital diz explicitamente que **técnica avançada de programação não é avaliada diretamente** —
  o foco da nota é relevância, acessibilidade e utilidade do conteúdo, não a complexidade do código.
- Contraste testado: texto branco sobre fundo escuro (~15:1) e o vermelho da marca só é usado em
  títulos grandes/botões (onde o contraste é suficiente), nunca em texto pequeno sobre preto.
