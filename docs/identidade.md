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

As demais ilustrações são SVG inline ou CSS: a linha de resultado do hero, os quatro ícones das frentes de trabalho, o radar do diagnóstico, o gráfico de ponto de equilíbrio e as barras de antes e depois dos casos.

## Foto do hero

Proporção esperada: **4:3 horizontal, 1600 × 1200 px** (ou maior na mesma proporção), exportada em webp, salva em `img/hero.webp`. A imagem é cortada pelo contêiner com `object-fit: cover`, então o objeto principal deve ficar no centro e à direita, com ar à esquerda e em cima.

Prompt em português para gerar no Canva:

> Fotografia editorial de site premium de consultoria de negócios. Sobre uma mesa de madeira clara coberta por um feltro verde-escuro (#16302B), vista de cima em ângulo de 35 graus, estão: um caderno de capa dura cor vinho (#7A2E3B) fechado, com uma fita marcadora; sobre ele, uma folha de papel creme (#F3EDE2) com um gráfico de linha desenhado à mão em caneta verde-escura, uma linha que sobe, cai um pouco e volta a subir, sem texto legível; ao lado, uma caneta-tinteiro de latão escurecido e uma xícara pequena de café em cerâmica creme. Um único detalhe em verde-menta claro (#C9E4C5): um marcador de página ou um clipe. Luz natural de janela vinda da esquerda, fim de manhã, sombras suaves e longas. Paleta restrita a verde-escuro, creme, vinho, madeira clara e o único acento menta. Fundo limpo, sem textura chamativa. Profundidade de campo curta, foco na folha com o gráfico. Sem pessoas, sem mãos, sem texto legível, sem logotipo, sem marca d'água, sem aperto de mão, sem notebook aberto. Estilo sóbrio, minimalista, fotografia de produto de revista de economia. Proporção 4:3 horizontal, alta resolução.

## Movimento

Um só momento orquestrado: na abertura, o título do hero, a frase de apoio e a foto sobem 12px e aparecem em sequência (0,6s no total). Depois disso, só respostas a ações: o polígono do radar cresce do centro quando é gerado, as barras dos casos crescem ao filtrar, o resumo da conversa aparece com um fade. Com `prefers-reduced-motion: reduce`, tudo isso vira troca instantânea.
