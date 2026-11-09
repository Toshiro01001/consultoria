# Identidade visual: Alqueire Consultoria

Estudo curto feito antes do código. Tudo aqui é fictício: a empresa, as pessoas, o endereço, o telefone, os casos de cliente e os números das calculadoras.

## Nome e posicionamento

**Alqueire Consultoria de Negócios.** Consultoria para pequenas e médias empresas (de 5 a 200 pessoas) em Cuiabá, com quatro frentes: diagnóstico, processos, finanças e crescimento.

Frase de posicionamento: **"Primeiro a medida. Depois o passo."**

O alqueire é a medida de terra que todo mundo em Mato Grosso conhece. Antes de plantar, de cercar ou de vender, a terra é medida. A marca pega essa ideia e aplica ao negócio: a gente mede antes de mexer, e só promete o que o número sustenta. Por isso o site não tem seta subindo para sempre, não tem aperto de mão e não fala em "alavancar". Fala em primeira pessoa, em frases curtas, com número onde cabe número e com aviso onde cabe aviso.

## Paleta

Fugi do azul-corporativo e do gradiente roxo de startup. As cores vêm da mesa de trabalho de quem fecha o mês: papel quente, a capa verde-escura do livro-caixa, a lombada vinho do caderno de anotações e um único traço claro de caneta marca-texto verde.

| Papel | Nome | Hex | Uso |
|---|---|---|---|
| Fundo | Papel | `#F3EDE2` | fundo de toda a página |
| Fundo 2 | Papel escuro | `#E6DDCC` | campos de formulário, faixas de apoio, fundo das barras |
| Texto e bloco escuro | Mata | `#16302B` | todo o texto principal, o cabeçalho, as seções escuras (hero e diagnóstico) e os botões primários |
| Superfície no escuro | Mata clara | `#244A41` | caixas, campos e trilhos dentro das seções escuras |
| Texto secundário | Terra | `#5C5247` | legendas, textos de apoio, eixos de gráfico sobre fundo claro |
| Texto secundário no escuro | Terra clara | `#B9AE9C` | legendas sobre Mata |
| Linha | Linha | `#D6CBB8` | bordas de 1px, divisórias, grade dos gráficos |
| Destaque | Menta | `#C9E4C5` | o único destaque claro: uma vez por tela |
| Apoio | Vinho | `#7A2E3B` | o "antes" nos casos, a área fraca no radar, a faixa de prejuízo na calculadora e as mensagens de erro |

Regras de uso:

- A Menta aparece **uma vez por tela**: o grifo de uma palavra no título do hero, o polígono do radar, a linha de receita na calculadora, o "depois" nos casos, o dia escolhido no agendamento. Nunca como fundo de seção inteira e **nunca como texto sobre Papel** (o contraste não passa). Texto sobre Menta é sempre Mata.
- O Vinho é o contraponto honesto da Menta: onde há "depois" em Menta, há "antes" em Vinho; onde há lucro em Menta, há prejuízo em Vinho. Nunca aparece sozinho como enfeite.
- Não existe gradiente decorativo nem sombra em cartão. O que separa um bloco do outro é uma linha de 1px cor Linha ou a troca de fundo (Papel para Papel escuro, ou para Mata).
- Contraste conferido (WCAG): Mata sobre Papel 12,1:1; Mata sobre Papel escuro 10,4:1; Terra sobre Papel 6,5:1; Terra sobre Papel escuro 5,7:1; Papel sobre Mata 12,1:1; Papel sobre Mata clara 8,5:1; Menta sobre Mata 10,3:1; Menta sobre Mata clara 7,2:1; Mata sobre Menta 10,3:1; Vinho sobre Papel 7,9:1; Vinho sobre Papel escuro 6,8:1; Papel sobre Vinho 7,9:1; Terra clara sobre Mata 6,4:1. Tudo AA; a maior parte AAA.

## Tipografia

Duas famílias, ambas com licença SIL OFL 1.1, servidas da pasta `fonts/` (arquivos woff2 do subconjunto latino, licenças ao lado):

- **Newsreader** (variável, eixos peso 200 a 800 e tamanho óptico 6 a 72, com itálico): títulos, subtítulos e a frase de posicionamento. É uma serifada de jornal desenhada para tela, com contraste alto nos tamanhos grandes (o eixo óptico engrossa as hastes e afina os traços finos conforme o tamanho). Dá a cara de relatório impresso e de editorial de negócios sem parecer escritório de advocacia. Títulos em peso 500, nunca em caixa alta, nunca em negrito pesado. O itálico aparece em um lugar só: a frase de posicionamento no hero.
- **Manrope** (variável, peso 200 a 800): corpo, botões, formulários, rótulos e **todos os números**. É uma grotesca geométrica, limpa, com algarismos tabulares (`font-variant-numeric: tabular-nums`), o que mantém os valores em reais alinhados em coluna nos resultados da calculadora e nos casos. Corpo em 400, dados e botões em 600, rótulos pequenos em 500.

Escala (base 16px, razão 1,25, com `clamp` para o celular):

| Papel | Tamanho | Família e peso | Entrelinha |
|---|---|---|---|
| Título do hero | 42 a 76px | Newsreader 500, opsz automático | 1,0 |
| Título de seção | 32 a 48px | Newsreader 500 | 1,08 |
| Subtítulo | 22 a 26px | Newsreader 500 | 1,25 |
| Corpo | 17px | Manrope 400 | 1,6 |
| Corpo pequeno | 15px | Manrope 400 | 1,5 |
| Número grande (resultado) | 32 a 44px | Manrope 600, tabular | 1,1 |
| Rótulo | 13px | Manrope 500 | 1,4 |

Regra de peso: Newsreader só em 500 (e itálico 400 na frase de posicionamento); Manrope em 400, 500 e 600. Rótulos nunca em caixa alta, exceto as siglas dos eixos do radar (F, P, E, C, G), que são siglas mesmo.

## Layout

- Grade de 12 colunas, largura máxima de 1160px, calha de 24px. No celular, uma coluna com margem lateral de 20px (16px em 320px).
- Alinhamento à esquerda em tudo. Nenhum texto centralizado, a não ser dentro de botões e nos rótulos dos eixos dos gráficos.
- Ritmo em múltiplos de 8px: seções respiram 104px no computador e 64px no celular. Dentro das seções, blocos a 32px.
- Cada seção abre com um título curto em Newsreader e uma frase em Manrope que diz o que é e o que fazer. Não há numeração de seção, porque as seções não seguem ordem obrigatória.
- Seções claras e escuras alternam: hero escuro, frentes de trabalho claro, diagnóstico escuro, calculadora claro, casos Papel escuro, conversa claro, "como funciona" Papel escuro, rodapé escuro.
- Cantos: 4px em botões e campos, 12px na foto do hero e nos blocos escuros grandes (canto de caderno). Nada de círculos perfeitos em botões.
- Os gráficos são o elemento gráfico da marca e são honestos: a linha do hero sobe, cai e volta a subir; o radar mostra o fraco junto do forte; a calculadora mostra a faixa de prejuízo antes do ponto de equilíbrio; nos casos, um indicador que piorou aparece com a mesma tipografia dos que melhoraram.

## Imagem forte

A imagem forte é a **foto do hero**: um contêiner 4:3 à direita do título, cantos de 12px, com uma legenda curta por baixo. Enquanto a foto do Canva não chega, `img/hero.webp` é uma composição abstrata gerada com Pillow nas cores da identidade (papel com grão, um bloco verde-mata como feltro de mesa, um caderno vinho, uma folha de relatório e a linha de menta que sobe, cai e sobe), 1600px de largura, sem texto.

As demais ilustrações são SVG inline ou CSS: a linha de resultado do hero, o radar do diagnóstico, o gráfico de ponto de equilíbrio e as barras de antes e depois dos casos. Na leva final, os quatro ícones das frentes de trabalho deram lugar a fotos quadradas (veja "Fotos da leva final" abaixo).

## Foto do hero

Proporção esperada: **4:3 horizontal, 1600 × 1200 px** (ou maior na mesma proporção), exportada em webp, salva em `img/hero.webp`. A imagem é cortada pelo contêiner com `object-fit: cover`, então o objeto principal deve ficar no centro e à direita, com ar à esquerda e em cima.

Prompt em português para gerar no Canva:

> Fotografia editorial de site premium de consultoria de negócios. Sobre uma mesa de madeira clara coberta por um feltro verde-escuro (#16302B), vista de cima em ângulo de 35 graus, estão: um caderno de capa dura cor vinho (#7A2E3B) fechado, com uma fita marcadora; sobre ele, uma folha de papel creme (#F3EDE2) com um gráfico de linha desenhado à mão em caneta verde-escura, uma linha que sobe, cai um pouco e volta a subir, sem texto legível; ao lado, uma caneta-tinteiro de latão escurecido e uma xícara pequena de café em cerâmica creme. Um único detalhe em verde-menta claro (#C9E4C5): um marcador de página ou um clipe. Luz natural de janela vinda da esquerda, fim de manhã, sombras suaves e longas. Paleta restrita a verde-escuro, creme, vinho, madeira clara e o único acento menta. Fundo limpo, sem textura chamativa. Profundidade de campo curta, foco na folha com o gráfico. Sem pessoas, sem mãos, sem texto legível, sem logotipo, sem marca d'água, sem aperto de mão, sem notebook aberto. Estilo sóbrio, minimalista, fotografia de produto de revista de economia. Proporção 4:3 horizontal, alta resolução.

## Movimento

Um só momento orquestrado: na abertura, o título do hero, a frase de apoio e a foto sobem 12px e aparecem em sequência (0,6s no total). Depois disso, só respostas a ações: o polígono do radar cresce do centro quando é gerado, as barras dos casos crescem ao filtrar, o resumo da conversa aparece com um fade. Com `prefers-reduced-motion: reduce`, tudo isso vira troca instantânea.

## Design systems aplicados (leva final)

A paleta acima não mudou. O que mudou foi a superfície, a navegação, os botões, os cartões, as faixas e o movimento, misturando dois sistemas do catálogo da Mil e Uma Linhas!:

- **Dupla:** `terrasprint-ai-design-system` (claro) e `ix7-mission-design-system` (escuro).
- **Mistura:** as seções claras (`#frentes`, `#calculadora`, `#casos`, `#conversa`, `#como-funciona`) usam os padrões do terrasprint-ai com Papel no lugar do branco, Papel escuro nos tiles, Linha nas bordas, Mata no lugar do pine e Menta a 35% no fundo do eyebrow; a chuva de partículas ficou de fora, só o bloom suave entrou. As seções escuras (`.hero`, `#diagnostico`, `.rodape`) usam os padrões do ix7-mission com Mata no lugar da tinta, Mata clara a 48% com blur de 4px nos painéis de vidro, Papel a 16% e a 27% nas bordas e Menta como sinal, uma vez por tela; o Vinho continua o contraponto do "antes".
- **Regra relaxada:** a identidade dizia "sem sombra em cartão". A leva final admite a sombra tingida de tinta do terrasprint-ai (`0 14px 28px -18px` Mata a 25%, com highlight branco de 1px no topo), porque é o que dá o ar de papel físico aos cartões e pílulas. Gradiente decorativo continua proibido.

Componentes aplicados:

| Padrão | De | Onde |
|---|---|---|
| Cápsula de navegação fosca flutuante (880px, Papel a 78%, blur 18px, raio 36px; a 90% com sombra funda depois de 40px de rolagem; no celular vira botão redondo que abre uma folha Papel) | terrasprint-ai | `.topo`, `.topo-linha`, `.menu` |
| Service card r12 com sombra tingida e highlight no topo, sobe 4px no hover | terrasprint-ai | `.frente` em `#frentes` |
| Section eyebrow (pílula Menta a 35%, Manrope 500 12px, sem caixa alta) | terrasprint-ai | `.eyebrow` em `.secao-cabeca` de todas as seções |
| Três pílulas-estádio sobrepostas e inclinadas (a do meio em Mata, escala 1,04) | terrasprint-ai | `dl.numeros` em `#calculadora` |
| Case study card de duas colunas com painel interno Papel escuro (margem 12px, raio 8px), lados alternados | terrasprint-ai | `.caso` em `#lista-casos` |
| Primary pill com highlight superior, hover -2px e seta que desce 2px | terrasprint-ai | `.botao`, `.botao-claro`, `.botao-contorno`, `.botao-contorno-claro` |
| Rise reveal `[data-rise]` (14px, 800ms, 90ms de escada, IntersectionObserver a 12%) | terrasprint-ai | filhos diretos de cada `.secao > .miolo`, `.frente`, `.caso`, `.numero` |
| Bloom verde que segue o ponteiro (canvas 2D, Menta a 6%, blur 60px, sem chuva; parado no toque e em reduced motion) | terrasprint-ai | `#hero-bloom` em `.hero` |
| Glass panel (Mata clara a 48%, blur 4px, borda Papel a 16%, raio 12px) | ix7-mission | `.diag-item` e `.radar-caixa` em `#diagnostico` |
| Status strip (rótulo Manrope 500 12px com .12em e valor Manrope 600, separados por hairlines Papel a 16%) | ix7-mission | `.hero-status` abaixo de `.hero-grade` |
| Token cards (chave, valor, média de 1 a 5 e barra de sinal de 4px; a área mais fraca com borda Vinho) | ix7-mission | `#diag-areas li` no resultado do diagnóstico |
| Hero brief (kicker .12em em Terra clara, título em Newsreader, linha de status com ponto Menta de 8px) | ix7-mission | `.hero-texto`; a frase em itálico desceu para o rodapé |
| Directional control (cinco segmentos contíguos de 44px com bordas compartilhadas; o marcado em Menta com texto Mata) | ix7-mission | `.escala` em cada `.diag-item` |
| Action panel (borda Papel a 27%, padding 24px, botões ghost Papel a 69% que vão a 100% em 160ms) | ix7-mission | `.diag-acoes` e `.rodape-painel` |

Tudo em código próprio: sem biblioteca, sem fonte externa, sem script de terceiros. O rise reveal, o bloom e as transições dos botões desligam com `prefers-reduced-motion`.

## Fotos da leva final

Todas geradas por IA no Canva, ilustrativas, a partir dos prompts do plano. Os arquivos em `img/` são as fotos finais, convertidas para webp no nome e na proporção certos. Contraste conferido nas novas superfícies: Mata sobre a cápsula no hero 7,9:1; Papel a 69% sobre Mata 6,5:1; Terra clara sobre o vidro 5,5:1; Papel sobre o vidro 10,3:1; Menta sobre o vidro 8,8:1; Mata sobre o eyebrow 11,4:1.

| Arquivo | Proporção | Onde | Alt |
|---|---|---|---|
| `img/mesa-reuniao-papeis.webp` | 16:9 (1456x816) | `.frentes-foto`, à direita da cabeça de `#frentes` | Mesa de madeira clara com feltro verde-escuro, folhas de relatório desfocadas, caderno vinho e duas mãos adultas apontando um gráfico. |
| `img/quadro-post-its.webp` | 4:5 (1088x1360) | `.diag-foto`, à direita da cabeça de `#diagnostico` (oculta no celular) | Quadro branco com post-its em verde-menta, creme e vinho organizados em cinco colunas, e uma mão adulta colando um deles. |
| `img/frente-diagnostico-trena.webp` | 1:1 (1024x1024) | ícone da frente Diagnóstico | Trena de agrimensor de fita amarela desbotada e um caderno quadriculado sobre feltro verde-escuro, vistos de cima. |
| `img/frente-processos-fichas.webp` | 1:1 (1024x1024) | ícone da frente Processos | Fichas de papel kraft ligadas por um fio verde-escuro formando um fluxograma simples sobre uma mesa de madeira clara. |
| `img/frente-financas-planilha.webp` | 1:1 (1024x1024) | ícone da frente Finanças | Planilha impressa com colunas desfocadas, uma calculadora de mesa creme e uma caneta verde-escura sobre o caderno vinho. |
| `img/frente-crescimento-muda.webp` | 1:1 (1024x1024) | ícone da frente Crescimento | Muda verde em vaso de cerâmica creme apoiada sobre um livro-caixa fechado de capa verde-escura, com uma régua de madeira ao lado. |
| `img/caso-padaria-balcao.webp` | 3:2 (1456x970) | painel interno do caso da padaria, primeiro de `#lista-casos` | Interior de padaria pequena com balcão de madeira clara, vitrine de pães, prateleiras de cerâmica creme e um avental verde-escuro pendurado. |
| `img/sala-conversa.webp` | 4:3 (1456x1088) | `.conversa-foto`, entre a lista e o endereço em `#conversa` | Sala de reunião pequena com mesa redonda de madeira clara, duas cadeiras, duas xícaras de café, um caderno vinho e janela com luz de manhã. |

Prompts para o Canva (um por foto):

1. **mesa-reuniao-papeis:** Fotografia editorial de site premium de consultoria de negócios, horizontal 16:9. Mesa de madeira clara parcialmente coberta por um feltro verde-escuro (#16302B), folhas de papel creme com gráficos desenhados à mão e texto desfocado, um caderno de capa vinho (#7A2E3B) fechado, uma caneta de latão e duas mãos adultas de pessoas diferentes apontando para a mesma folha; um único detalhe verde-menta claro: um clipe. Luz natural de janela à esquerda, fim de manhã, sombras suaves. Sem rostos, sem texto legível, sem logotipos, sem notebook, sem aperto de mão.
2. **quadro-post-its:** Fotografia editorial de consultoria de negócios, vertical 4:5. Quadro branco em parede de sala de reunião com post-its em verde-menta claro, creme e vinho organizados em cinco colunas sem texto legível, uma mão adulta de camisa verde-escura colando um post-it, canetas de quadro na calha. Luz natural lateral, paleta restrita a verde-escuro, creme, vinho e menta. Sem rostos, sem texto legível, sem logotipos.
3. **frente-diagnostico-trena:** Fotografia editorial de produto, quadrada 1:1, vista de cima. Uma trena de agrimensor antiga com carcaça de couro e fita de medição em tom creme desbotado parcialmente estendida sobre um feltro verde-escuro (#16302B), ao lado de um caderno pequeno quadriculado fechado e um lápis. Luz natural suave, sombras curtas. Sem pessoas, sem texto legível, sem logotipos.
4. **frente-processos-fichas:** Fotografia editorial de produto, quadrada 1:1, vista de cima. Seis fichas de papel kraft em branco dispostas como um fluxograma sobre mesa de madeira clara, ligadas por um fio de lã verde-escuro preso com alfinetes, uma das fichas com um canto verde-menta claro. Luz natural suave de janela, sombras longas e macias. Sem pessoas, sem texto, sem logotipos.
5. **frente-financas-planilha:** Fotografia editorial de produto, quadrada 1:1, vista de cima em leve ângulo. Uma folha de planilha impressa com colunas e números totalmente desfocados, uma calculadora de mesa em cerâmica creme com teclas escuras, uma caneta verde-escura e o canto de um caderno de capa vinho (#7A2E3B), sobre feltro verde-escuro. Luz natural suave, foco raso na caneta. Sem pessoas, sem texto legível, sem logotipos, sem dinheiro.
6. **frente-crescimento-muda:** Fotografia editorial de produto, quadrada 1:1. Uma muda de folhas verdes em vaso pequeno de cerâmica creme apoiada sobre um livro-caixa fechado de capa dura verde-escura (#16302B), uma régua de madeira clara deitada ao lado, sobre mesa de madeira clara e fundo creme. Luz natural de janela, sombras suaves. Sem pessoas, sem texto legível, sem logotipos, sem seta.
7. **caso-padaria-balcao:** Fotografia editorial de site premium, horizontal 3:2. Interior de uma padaria pequena e cuidada: balcão de madeira clara, vitrine de vidro com pães, prateleiras com louças de cerâmica creme, um avental verde-escuro pendurado em um gancho, quadro-negro ao fundo sem texto legível, piso de ladrilho claro. Luz natural de manhã pela vitrine. Sem pessoas, sem texto legível, sem logotipos, sem marcas de produtos.
8. **sala-conversa:** Fotografia editorial de site premium de consultoria, horizontal 4:3. Sala de reunião pequena e silenciosa: mesa redonda de madeira clara com duas xícaras de café em cerâmica creme, um caderno de capa vinho (#7A2E3B) fechado e uma caneta de latão, duas cadeiras de madeira com assento em tecido verde-escuro, parede creme e janela com cortina de linho e luz de manhã. Sem pessoas, sem texto, sem logotipos, sem notebook aberto.
