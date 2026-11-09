/* Alqueire Consultoria: comportamento do site de demonstração.
   Tudo roda no navegador. Nenhum dado sai daqui, nada é guardado.
   Partes: cápsula de navegação e menu do celular, rise reveal, bloom do hero,
   diagnóstico (radar), calculadora de ponto de equilíbrio, casos antes e depois com filtro,
   e pedido de conversa com resumo. */
(function () {
  "use strict";

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
  const SVG = "http://www.w3.org/2000/svg";
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");

  function el(tag, attrs, texto) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (texto !== undefined) n.textContent = texto;
    return n;
  }
  function svgEl(tag, attrs, texto) {
    const n = document.createElementNS(SVG, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (texto !== undefined) n.textContent = texto;
    return n;
  }
  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  const umaCasa = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  /* ---------- Cápsula de navegação: fica mais opaca e com sombra mais funda depois de 40px ---------- */
  const topo = $(".topo");
  if (topo) {
    let agendado = false;
    const atualizaTopo = () => { topo.classList.toggle("rolado", window.scrollY > 40); agendado = false; };
    window.addEventListener("scroll", () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizaTopo); } }, { passive: true });
    atualizaTopo();
  }

  /* ---------- Rise reveal: blocos sobem 14px ao entrar 12% na tela, 90ms entre irmãos ---------- */
  (function riseReveal() {
    const alvos = $$(".secao > .miolo > *, .frente, .caso, .numero");
    if (!alvos.length) return;
    alvos.forEach((n) => { if (!n.hasAttribute("hidden")) n.setAttribute("data-rise", ""); });
    if (movimentoReduzido.matches || !("IntersectionObserver" in window)) {
      alvos.forEach((n) => n.classList.add("visto"));
      return;
    }
    const io = new IntersectionObserver((entradas) => {
      /* ordena os que entraram juntos para escalonar 90ms entre irmãos */
      const vistos = entradas.filter((e) => e.isIntersecting).map((e) => e.target);
      vistos.forEach((n, i) => {
        n.style.setProperty("--rise-delay", `${Math.min(i, 8) * 90}ms`);
        n.classList.add("visto");
        io.unobserve(n);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    alvos.forEach((n) => io.observe(n));
    /* elementos que nascem escondidos (resultado do diagnóstico) entram quando aparecem */
    const obsHidden = new MutationObserver(() => {
      $$("[data-rise]:not(.visto)").forEach((n) => { if (!n.closest("[hidden]")) io.observe(n); });
    });
    obsHidden.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["hidden"] });
  })();

  /* ---------- Bloom do hero: mancha radial de Menta a 6% que segue o ponteiro (canvas 2D, sem chuva) ---------- */
  (function bloom() {
    const canvas = $("#hero-bloom");
    const hero = canvas && canvas.closest(".hero");
    if (!canvas || !hero || movimentoReduzido.matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const toque = window.matchMedia("(pointer: coarse)").matches;
    let W = 0, H = 0, alvoX = 0, alvoY = 0, posX = 0, posY = 0, quadro = null;
    function tamanho() {
      const r = hero.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width / 2)); H = Math.max(1, Math.round(r.height / 2));
      canvas.width = W; canvas.height = H;
      desenha();
    }
    function desenha() {
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.38 + posX / 2, cy = H * 0.45 + posY / 2;
      const raio = Math.max(W, H) * 0.42;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, raio);
      g.addColorStop(0, "rgba(201, 228, 197, 0.06)");
      g.addColorStop(0.5, "rgba(201, 228, 197, 0.035)");
      g.addColorStop(1, "rgba(201, 228, 197, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    function anima() {
      posX += (alvoX - posX) * 0.08;
      posY += (alvoY - posY) * 0.08;
      desenha();
      if (Math.abs(alvoX - posX) > 0.2 || Math.abs(alvoY - posY) > 0.2) quadro = requestAnimationFrame(anima);
      else { quadro = null; posX = alvoX; posY = alvoY; desenha(); }
    }
    tamanho();
    window.addEventListener("resize", tamanho);
    if (!toque) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        alvoX = ((e.clientX - r.left) / r.width - 0.5) * 26;
        alvoY = ((e.clientY - r.top) / r.height - 0.5) * 20;
        if (!quadro) quadro = requestAnimationFrame(anima);
      });
      hero.addEventListener("pointerleave", () => { alvoX = 0; alvoY = 0; if (!quadro) quadro = requestAnimationFrame(anima); });
    }
  })();

  /* ---------- Menu do celular ---------- */
  const menuBotao = $(".menu-botao");
  const menu = $("#menu");
  if (menuBotao && menu) {
    menuBotao.addEventListener("click", () => {
      const aberto = menuBotao.getAttribute("aria-expanded") === "true";
      menuBotao.setAttribute("aria-expanded", String(!aberto));
      menu.classList.toggle("aberto", !aberto);
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => {
      menuBotao.setAttribute("aria-expanded", "false");
      menu.classList.remove("aberto");
    }));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("aberto")) {
        menuBotao.setAttribute("aria-expanded", "false");
        menu.classList.remove("aberto");
        menuBotao.focus();
      }
    });
  }

  /* ---------- Diagnóstico rápido ---------- */
  const AREAS = [
    { id: "financas", nome: "Finanças", sigla: "F",
      dica: "Comece separando as contas da empresa das suas e calculando a margem dos três produtos que mais vendem. Uma planilha simples resolve o primeiro mês." },
    { id: "processos", nome: "Processos", sigla: "P",
      dica: "Escolha a tarefa que mais dá retrabalho e escreva, com quem a executa, o passo a passo em uma página. Teste por duas semanas antes de escrever a próxima." },
    { id: "equipe", nome: "Equipe", sigla: "E",
      dica: "Liste o que só você sabe fazer e escolha uma dessas coisas para ensinar a alguém este mês. Férias sem a operação parar começam aí." },
    { id: "clientes", nome: "Clientes e vendas", sigla: "C",
      dica: "Pergunte aos próximos vinte clientes como chegaram até você e anote. Em um mês dá para saber qual canal merece mais atenção." },
    { id: "gestao", nome: "Gestão", sigla: "G",
      dica: "Escreva três metas para os próximos 12 meses, com um número cada, e marque trinta minutos por semana para olhar os mesmos cinco indicadores." }
  ];

  const formDiag = $("#form-diag");
  const diagResultado = $("#diag-resultado");
  const diagProgresso = $("#diag-progresso");
  const diagErro = $("#diag-erro");
  const radar = $("#radar");
  let radarAtual = AREAS.map(() => 0);

  function respostasDiag() {
    const porArea = {};
    AREAS.forEach((a) => { porArea[a.id] = []; });
    let respondidas = 0;
    $$(".diag-item", formDiag).forEach((item) => {
      const marcado = $("input:checked", item);
      if (marcado) {
        respondidas++;
        porArea[item.dataset.area].push(Number(marcado.value));
      }
    });
    return { porArea, respondidas };
  }

  function atualizaProgresso() {
    const { respondidas } = respostasDiag();
    diagProgresso.textContent = `${respondidas} de 10 respondidas`;
    if (respondidas === 10) diagErro.hidden = true;
  }

  function pontoRadar(cx, cy, raio, indice, total) {
    const ang = -Math.PI / 2 + (2 * Math.PI * indice) / total;
    return [cx + raio * Math.cos(ang), cy + raio * Math.sin(ang)];
  }

  function desenhaRadarBase(valores) {
    while (radar.lastChild && radar.lastChild.tagName !== "desc") radar.removeChild(radar.lastChild);
    const cx = 160, cy = 164, R = 108, n = AREAS.length;
    for (let anel = 1; anel <= 4; anel++) {
      const pts = [];
      for (let i = 0; i < n; i++) pts.push(pontoRadar(cx, cy, (R * anel) / 4, i, n).map((v) => v.toFixed(1)).join(","));
      radar.appendChild(svgEl("polygon", { class: "teia", points: pts.join(" ") }));
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pontoRadar(cx, cy, R, i, n);
      radar.appendChild(svgEl("line", { class: "eixo", x1: cx, y1: cy, x2: x.toFixed(1), y2: y.toFixed(1) }));
      const [lx, ly] = pontoRadar(cx, cy, R + 30, i, n);
      const anchor = Math.abs(lx - cx) < 4 ? "middle" : lx > cx ? "start" : "end";
      const ajusteX = anchor === "middle" ? 0 : lx > cx ? -6 : 6;
      radar.appendChild(svgEl("text", { class: "rotulo", x: (lx + ajusteX).toFixed(1), y: (ly + 4).toFixed(1), "text-anchor": anchor }, AREAS[i].sigla));
      radar.appendChild(svgEl("text", { class: "rotulo-valor", x: (lx + ajusteX).toFixed(1), y: (ly + 19).toFixed(1), "text-anchor": anchor }, `${Math.round(valores[i])}%`));
    }
    const poligono = svgEl("polygon", { class: "poligono", points: pontosPoligono(valores.map(() => 0)) });
    radar.appendChild(poligono);
    const grupoPontos = svgEl("g", { class: "pontos" });
    valores.forEach((v, i) => {
      const [x, y] = pontoRadar(cx, cy, (R * v) / 100, i, n);
      grupoPontos.appendChild(svgEl("circle", { class: v <= 50 ? "ponto ponto-fraco" : "ponto", cx: x.toFixed(1), cy: y.toFixed(1), r: 5 }));
    });
    radar.appendChild(grupoPontos);
    return poligono;
  }

  function pontosPoligono(valores) {
    const cx = 160, cy = 164, R = 108, n = AREAS.length;
    return valores.map((v, i) => pontoRadar(cx, cy, (R * Math.max(v, 2)) / 100, i, n).map((c) => c.toFixed(1)).join(",")).join(" ");
  }

  function animaRadar(poligono, de, para) {
    if (movimentoReduzido.matches) { poligono.setAttribute("points", pontosPoligono(para)); return; }
    const inicio = performance.now(), dur = 600;
    function passo(agora) {
      const t = Math.min(1, (agora - inicio) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      poligono.setAttribute("points", pontosPoligono(de.map((v, i) => v + (para[i] - v) * e)));
      if (t < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  function mostraDiagnostico() {
    const { porArea, respondidas } = respostasDiag();
    if (respondidas < 10) {
      diagErro.hidden = false;
      const primeiroVazio = $$(".diag-item", formDiag).find((item) => !$("input:checked", item));
      if (primeiroVazio) $("input", primeiroVazio).focus();
      return;
    }
    diagErro.hidden = true;
    const valores = AREAS.map((a) => {
      const r = porArea[a.id];
      const media = r.reduce((s, v) => s + v, 0) / r.length;
      return ((media - 1) / 4) * 100;
    });
    const poligono = desenhaRadarBase(valores);
    animaRadar(poligono, radarAtual.map(() => 0), valores);
    radarAtual = valores;

    const lista = $("#diag-areas");
    lista.textContent = "";
    const menorValor = Math.min.apply(null, valores);
    valores.forEach((v, i) => {
      /* token card: chave, valor, média de 1 a 5 e barra de sinal; a área mais fraca recebe borda Vinho */
      const classes = [v <= 50 ? "fraca" : "", v === menorValor ? "mais-fraca" : ""].filter(Boolean).join(" ");
      const li = el("li", { class: classes });
      li.appendChild(el("span", { class: "chave" }, AREAS[i].nome));
      li.appendChild(el("span", { class: "valor" }, `${Math.round(v)}%`));
      const media = 1 + (v / 100) * 4;
      li.appendChild(el("span", { class: "media" }, `${umaCasa.format(media)} de 5`));
      const trilho = el("span", { class: "trilho" });
      const barra = el("span", { class: "barra" });
      trilho.appendChild(barra);
      li.appendChild(trilho);
      lista.appendChild(li);
      requestAnimationFrame(() => { barra.style.width = `${Math.max(v, 2)}%`; });
    });

    const ordem = valores.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const fracas = ordem.filter((o) => o.v <= 50);
    const escolhidas = (fracas.length ? fracas : ordem).slice(0, Math.max(1, Math.min(3, fracas.length || 1)));
    const dicas = $("#diag-dicas");
    dicas.textContent = "";
    escolhidas.forEach((o) => {
      const li = el("li");
      li.appendChild(el("strong", null, AREAS[o.i].nome + (o.v <= 50 ? ": é por aqui" : ": a área com mais espaço")));
      li.appendChild(el("span", null, AREAS[o.i].dica));
      dicas.appendChild(li);
    });
    if (!fracas.length) {
      const li = el("li");
      li.appendChild(el("strong", null, "Nenhuma área abaixo de 50%"));
      li.appendChild(el("span", null, "Pelo seu retrato, a casa está arrumada. O próximo passo costuma ser escolher onde crescer, com conta feita."));
      dicas.insertBefore(li, dicas.firstChild);
    }

    const forte = ordem[ordem.length - 1], fraca = ordem[0];
    diagResultado.dataset.resumo = `Fiz o diagnóstico rápido no site. Área mais forte: ${AREAS[forte.i].nome} (${Math.round(forte.v)}%). Área para começar: ${AREAS[fraca.i].nome} (${Math.round(fraca.v)}%). Resultados: ` +
      AREAS.map((a, i) => `${a.nome} ${Math.round(valores[i])}%`).join(", ") + ".";

    diagResultado.hidden = false;
    diagResultado.scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth", block: "start" });
    $("#diag-areas").closest(".diag-leitura").querySelector("h3").setAttribute("tabindex", "-1");
    $("#diag-areas").closest(".diag-leitura").querySelector("h3").focus({ preventScroll: true });
  }

  if (formDiag) {
    formDiag.addEventListener("change", atualizaProgresso);
    formDiag.addEventListener("submit", (e) => { e.preventDefault(); mostraDiagnostico(); });
    $("#diag-refazer").addEventListener("click", () => {
      formDiag.reset();
      diagResultado.hidden = true;
      delete diagResultado.dataset.resumo;
      radarAtual = AREAS.map(() => 0);
      atualizaProgresso();
      formDiag.scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth", block: "start" });
      $("input", formDiag).focus({ preventScroll: true });
    });
    $("#diag-levar").addEventListener("click", () => {
      const assunto = $("#assunto");
      if (assunto && diagResultado.dataset.resumo) assunto.value = diagResultado.dataset.resumo;
    });
  }

  /* ---------- Calculadora de ponto de equilíbrio ---------- */
  function leNumero(input) {
    const bruto = input.value.trim();
    if (!bruto) return null;
    const limpo = bruto.replace(/\s|R\$/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number(limpo);
    return Number.isFinite(n) ? n : NaN;
  }
  function mostraErroCampo(input, msg) {
    const erro = $("#" + input.id + "-erro");
    if (msg) {
      erro.textContent = msg; erro.hidden = false;
      input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", erro.id);
    } else {
      erro.hidden = true; erro.textContent = "";
      input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby");
    }
    return !msg;
  }
  function formataCampo(input) {
    const n = leNumero(input);
    if (n === null || Number.isNaN(n)) return;
    input.value = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(n);
  }

  const formCalc = $("#form-calc");
  const grafico = $("#grafico-pe");

  function desenhaGrafico(fixos, preco, variavel, peUnidades, metaUnidades) {
    while (grafico.lastChild && grafico.lastChild.tagName !== "desc") grafico.removeChild(grafico.lastChild);
    const W = 560, H = 320, mL = 56, mR = 20, mT = 20, mB = 44;
    const w = W - mL - mR, h = H - mT - mB;
    const maxU = Math.max(peUnidades * 2, (metaUnidades || 0) * 1.15, 10);
    const maxY = Math.max(preco * maxU, fixos + variavel * maxU) * 1.05;
    const X = (u) => mL + (u / maxU) * w;
    const Y = (v) => mT + h - (v / maxY) * h;

    for (let i = 0; i <= 4; i++) {
      const y = mT + (h * i) / 4;
      grafico.appendChild(svgEl("line", { class: "grade", x1: mL, y1: y.toFixed(1), x2: W - mR, y2: y.toFixed(1) }));
      const valor = maxY * (1 - i / 4);
      grafico.appendChild(svgEl("text", { class: "texto", x: mL - 8, y: (y + 4).toFixed(1), "text-anchor": "end" }, abreviaReais(valor)));
    }
    /* área de prejuízo: entre custo e receita, de 0 até o PE */
    const prejuizo = `${X(0)},${Y(fixos)} ${X(peUnidades)},${Y(preco * peUnidades)} ${X(0)},${Y(0)}`;
    grafico.appendChild(svgEl("polygon", { class: "area-prejuizo", points: prejuizo }));
    /* área de lucro: entre receita e custo, do PE até o fim */
    const lucro = `${X(peUnidades)},${Y(preco * peUnidades)} ${X(maxU)},${Y(preco * maxU)} ${X(maxU)},${Y(fixos + variavel * maxU)}`;
    grafico.appendChild(svgEl("polygon", { class: "area-lucro", points: lucro }));

    grafico.appendChild(svgEl("line", { class: "eixo", x1: mL, y1: mT + h, x2: W - mR, y2: mT + h }));
    grafico.appendChild(svgEl("line", { class: "eixo", x1: mL, y1: mT, x2: mL, y2: mT + h }));
    grafico.appendChild(svgEl("line", { class: "linha-custo", x1: X(0), y1: Y(fixos), x2: X(maxU), y2: Y(fixos + variavel * maxU) }));
    grafico.appendChild(svgEl("line", { class: "linha-receita", x1: X(0), y1: Y(0), x2: X(maxU), y2: Y(preco * maxU) }));

    const px = X(peUnidades), py = Y(preco * peUnidades);
    grafico.appendChild(svgEl("line", { class: "guia", x1: px.toFixed(1), y1: py.toFixed(1), x2: px.toFixed(1), y2: mT + h }));
    grafico.appendChild(svgEl("circle", { class: "marca-pe", cx: px.toFixed(1), cy: py.toFixed(1), r: 6 }));
    /* rótulo à direita do ponto e abaixo da linha de custo, onde não cruza linha nenhuma */
    const direita = px < W - 170;
    const yCustoAli = Y(fixos + variavel * (peUnidades + maxU * 0.28));
    const yRotulo = Math.min(mT + h - 24, Math.max(py + 20, yCustoAli + 18));
    const xRotulo = (direita ? px + 12 : px - 12).toFixed(1);
    grafico.appendChild(svgEl("text", { class: "texto-forte", x: xRotulo, y: yRotulo.toFixed(1), "text-anchor": direita ? "start" : "end" }, "Equilíbrio"));
    grafico.appendChild(svgEl("text", { class: "texto-forte", x: xRotulo, y: (yRotulo + 16).toFixed(1), "text-anchor": direita ? "start" : "end" }, `${inteiro.format(Math.ceil(peUnidades))} vendas`));

    if (metaUnidades && metaUnidades <= maxU) {
      const mx = X(metaUnidades), my = Y(preco * metaUnidades);
      grafico.appendChild(svgEl("line", { class: "guia", x1: mx.toFixed(1), y1: my.toFixed(1), x2: mx.toFixed(1), y2: mT + h }));
      grafico.appendChild(svgEl("circle", { class: "marca-pe", cx: mx.toFixed(1), cy: my.toFixed(1), r: 5 }));
      /* rótulo da meta acima e à esquerda do ponto: ali só há ar, porque o custo fica abaixo da receita depois do equilíbrio */
      grafico.appendChild(svgEl("text", { class: "texto", x: (mx - 10).toFixed(1), y: Math.max(mT + 10, my - 12).toFixed(1), "text-anchor": "end" }, `Meta: ${inteiro.format(Math.ceil(metaUnidades))} vendas`));
    }

    for (let i = 0; i <= 4; i++) {
      const u = (maxU * i) / 4;
      grafico.appendChild(svgEl("text", { class: "texto", x: X(u).toFixed(1), y: H - 22, "text-anchor": i === 0 ? "start" : i === 4 ? "end" : "middle" }, inteiro.format(Math.round(u))));
    }
    grafico.appendChild(svgEl("text", { class: "texto", x: mL + w / 2, y: H - 4, "text-anchor": "middle" }, "vendas no mês"));
  }

  function abreviaReais(v) {
    if (v >= 1e6) return "R$ " + umaCasa.format(v / 1e6).replace(",0", "") + " mi";
    if (v >= 1e3) return "R$ " + inteiro.format(Math.round(v / 1e3)) + " mil";
    return "R$ " + inteiro.format(Math.round(v));
  }

  function calcula() {
    const fixosEl = $("#fixos"), precoEl = $("#preco"), variavelEl = $("#variavel"), metaEl = $("#meta");
    const fixos = leNumero(fixosEl), preco = leNumero(precoEl), variavel = leNumero(variavelEl), meta = leNumero(metaEl);
    let ok = true;
    ok = mostraErroCampo(fixosEl, fixos === null || Number.isNaN(fixos) || fixos < 0 ? "Digite os custos fixos, em reais." : "") && ok;
    ok = mostraErroCampo(precoEl, preco === null || Number.isNaN(preco) || preco <= 0 ? "Digite um preço maior que zero." : "") && ok;
    ok = mostraErroCampo(variavelEl, variavel === null || Number.isNaN(variavel) || variavel < 0 ? "Digite o custo variável, em reais (pode ser zero)." : "") && ok;
    ok = mostraErroCampo(metaEl, meta !== null && (Number.isNaN(meta) || meta < 0) ? "Digite um valor em reais ou deixe em branco." : "") && ok;
    const aviso = $("#calc-aviso");
    const blocos = $$(".numero");
    if (!ok) { aviso.hidden = true; return; }

    const mc = preco - variavel;
    if (mc <= 0) {
      aviso.textContent = "Com esse preço e esse custo variável, cada venda dá prejuízo. Não existe ponto de equilíbrio: é preciso subir o preço ou baixar o custo por venda.";
      aviso.hidden = false;
      blocos.forEach((b) => b.classList.add("indisponivel"));
      $("#mc-valor").textContent = moeda.format(mc);
      $("#mc-pct").textContent = `${inteiro.format((mc / preco) * 100)}% do preço`;
      $("#pe-vendas").textContent = "não existe";
      $("#pe-valor").textContent = "a receita nunca cobre o custo";
      $("#meta-vendas").textContent = "não existe";
      $("#meta-apoio").textContent = "";
      while (grafico.lastChild && grafico.lastChild.tagName !== "desc") grafico.removeChild(grafico.lastChild);
      return;
    }
    aviso.hidden = true;
    blocos.forEach((b) => b.classList.remove("indisponivel"));
    const pe = fixos / mc;
    const peArred = Math.ceil(pe);
    $("#mc-valor").textContent = moeda.format(mc);
    $("#mc-pct").textContent = `${inteiro.format((mc / preco) * 100)}% do preço`;
    $("#pe-vendas").textContent = `${inteiro.format(peArred)} ${peArred === 1 ? "venda" : "vendas"}`;
    $("#pe-valor").textContent = `${moeda.format(pe * preco)} de faturamento no mês`;
    let metaU = null;
    if (meta !== null && meta > 0) {
      metaU = (fixos + meta) / mc;
      const extra = Math.ceil(metaU) - peArred;
      $("#meta-vendas").textContent = `${inteiro.format(Math.ceil(metaU))} vendas`;
      $("#meta-apoio").textContent = `${inteiro.format(extra)} ${extra === 1 ? "venda" : "vendas"} além do equilíbrio`;
    } else {
      $("#meta-vendas").textContent = "informe a meta";
      $("#meta-apoio").textContent = "preencha o lucro desejado para ver";
    }
    desenhaGrafico(fixos, preco, variavel, pe, metaU);
  }

  if (formCalc) {
    formCalc.addEventListener("submit", (e) => { e.preventDefault(); calcula(); });
    $$("input", formCalc).forEach((i) => {
      i.addEventListener("input", calcula);
      i.addEventListener("blur", () => { formataCampo(i); calcula(); });
    });
    calcula();
  }

  /* ---------- Casos antes e depois ---------- */
  const SETORES = { comercio: "Comércio", servicos: "Serviços", industria: "Indústria", alimentacao: "Alimentação" };
  const CASOS = [
    { setor: "alimentacao", titulo: "Padaria com 3 lojas, 32 pessoas",
      foto: { src: "img/caso-padaria-balcao.webp", largura: 1456, altura: 970,
        alt: "Interior de padaria pequena com balcão de madeira clara, vitrine de pães, prateleiras de cerâmica creme e um avental verde-escuro pendurado." },
      problema: "Desperdício no fim do dia, custo de mercadoria sem controle e lucro que não aparecia.",
      feito: "Ficha técnica dos 40 produtos, produção por histórico de venda de cada loja e compra centralizada.",
      metricas: [
        { nome: "Desperdício", antes: 9, depois: 4, unidade: "%", menorMelhor: true },
        { nome: "Custo da mercadoria vendida", antes: 42, depois: 36, unidade: "%", menorMelhor: true },
        { nome: "Margem líquida", antes: 3, depois: 7, unidade: "%" }
      ], prazo: "7 meses" },
    { setor: "comercio", titulo: "Loja de materiais de construção, 14 pessoas",
      problema: "Estoque alto, prateleira vazia nos itens que mais giram e margem apertada.",
      feito: "Curva ABC do estoque, compra semanal por giro e revisão de preço nos 60 itens principais.",
      metricas: [
        { nome: "Estoque parado", antes: 310, depois: 190, unidade: " mil", prefixo: "R$ ", menorMelhor: true },
        { nome: "Margem bruta", antes: 22, depois: 27, unidade: "%" },
        { nome: "Falta de itens de giro", antes: 18, depois: 7, unidade: "%", menorMelhor: true }
      ], prazo: "8 meses" },
    { setor: "servicos", titulo: "Escritório de contabilidade, 9 pessoas",
      problema: "Fechamento atrasado todo mês, retrabalho entre as equipes e o dono revisando tudo.",
      feito: "Checklist por cliente, calendário de entregas e conferência por amostragem no lugar da revisão total.",
      metricas: [
        { nome: "Prazo de fechamento", antes: 22, depois: 9, unidade: " dias", menorMelhor: true },
        { nome: "Retrabalho", antes: 15, depois: 6, unidade: "%", menorMelhor: true },
        { nome: "Clientes por pessoa", antes: 28, depois: 34, unidade: "" }
      ], prazo: "6 meses" },
    { setor: "industria", titulo: "Fábrica de esquadrias, 40 pessoas",
      problema: "Entregas atrasadas, refugo alto e o caixa sofrendo com prazo de recebimento longo.",
      feito: "Programação semanal da produção, inspeção na entrada do alumínio e política de recebimento com entrada.",
      metricas: [
        { nome: "Entregas no prazo", antes: 61, depois: 88, unidade: "%" },
        { nome: "Refugo", antes: 6.5, depois: 3.1, unidade: "%", menorMelhor: true },
        { nome: "Custo com pessoal", sub: "subiu: contratamos um planejador", antes: 18, depois: 20, unidade: "%", menorMelhor: true, piorou: true }
      ], prazo: "10 meses" },
    { setor: "servicos", titulo: "Clínica odontológica, 6 pessoas",
      problema: "Agenda com buracos, pacientes faltando e recebíveis atrasados.",
      feito: "Confirmação dois dias antes, lista de espera para encaixe e cobrança em etapas combinadas no orçamento.",
      metricas: [
        { nome: "Faltas em consultas", antes: 23, depois: 11, unidade: "%", menorMelhor: true },
        { nome: "Ocupação da agenda", antes: 58, depois: 79, unidade: "%" },
        { nome: "Recebíveis atrasados", antes: 17, depois: 8, unidade: "%", menorMelhor: true }
      ], prazo: "5 meses" },
    { setor: "comercio", titulo: "Distribuidora de bebidas, 25 pessoas",
      problema: "Vendia muito e sobrava pouco: prazo longo para receber, devolução alta e margem sem acompanhamento.",
      feito: "Margem por cliente e por rota, limite de crédito por cliente e conferência de carga na saída.",
      metricas: [
        { nome: "Prazo de recebimento", antes: 41, depois: 28, unidade: " dias", menorMelhor: true },
        { nome: "Margem de contribuição", antes: 19, depois: 24, unidade: "%" },
        { nome: "Devoluções", antes: 4, depois: 1.8, unidade: "%", menorMelhor: true }
      ], prazo: "9 meses" }
  ];

  const listaCasos = $("#lista-casos");
  function formataMetrica(m, v) {
    const num = Number.isInteger(v) ? inteiro.format(v) : umaCasa.format(v);
    return `${m.prefixo || ""}${num}${m.unidade}`;
  }
  function montaCasos() {
    CASOS.forEach((c, indice) => {
      const art = el("article", { class: "caso", "data-setor": c.setor });
      /* coluna de texto */
      const corpo = el("div", { class: "caso-corpo" });
      corpo.appendChild(el("p", { class: "caso-setor" }, `${SETORES[c.setor]} · ${c.prazo} de trabalho`));
      corpo.appendChild(el("h3", null, c.titulo));
      const p1 = el("p", { class: "caso-texto" });
      p1.appendChild(el("strong", null, "Antes: "));
      p1.appendChild(document.createTextNode(c.problema));
      corpo.appendChild(p1);
      const p2 = el("p", { class: "caso-texto" });
      p2.appendChild(el("strong", null, "O que fizemos: "));
      p2.appendChild(document.createTextNode(c.feito));
      corpo.appendChild(p2);
      corpo.appendChild(el("p", { class: "caso-nota" }, "Caso fictício, montado para demonstrar o formato do relatório."));
      art.appendChild(corpo);
      /* painel interno Papel escuro com a foto (só no primeiro caso) e as barras antes e depois */
      const painel = el("div", { class: "caso-painel" });
      if (c.foto) {
        const fig = el("figure", { class: "foto caso-foto" });
        fig.appendChild(el("img", { src: c.foto.src, width: c.foto.largura, height: c.foto.altura, alt: c.foto.alt, loading: "lazy", decoding: "async" }));
        painel.appendChild(fig);
      }
      const ul = el("ul", { class: "metricas" });
      c.metricas.forEach((m) => {
        const li = el("li", { class: "metrica" });
        const nome = el("span", { class: "metrica-nome" }, m.nome);
        if (m.sub) nome.appendChild(el("small", null, m.sub));
        li.appendChild(nome);
        const melhorou = m.menorMelhor ? m.depois < m.antes : m.depois > m.antes;
        const variacao = m.unidade === "%" ? `${m.depois > m.antes ? "+" : ""}${umaCasa.format(m.depois - m.antes).replace(",0", "")} pontos` : `${m.depois > m.antes ? "+" : ""}${inteiro.format(Math.round(((m.depois - m.antes) / m.antes) * 100))}%`;
        li.appendChild(el("span", { class: "metrica-direcao" + (melhorou ? "" : " piorou") }, `${variacao}${m.menorMelhor ? " (menor é melhor)" : ""}`));
        const barras = el("div", { class: "metrica-barras" });
        const maximo = Math.max(m.antes, m.depois);
        [["antes", m.antes], ["depois", m.depois]].forEach(([rot, v]) => {
          const linha = el("div", { class: "metrica-linha " + rot });
          linha.appendChild(el("span", { class: "rotulo" }, rot));
          const trilho = el("span", { class: "trilho" });
          const barra = el("span", { class: "barra" });
          barra.dataset.largura = String((v / maximo) * 100);
          trilho.appendChild(barra);
          linha.appendChild(trilho);
          linha.appendChild(el("span", { class: "num" }, formataMetrica(m, v)));
          barras.appendChild(linha);
        });
        li.appendChild(barras);
        ul.appendChild(li);
      });
      painel.appendChild(ul);
      art.appendChild(painel);
      listaCasos.appendChild(art);
    });
    crescerBarras();
  }
  function crescerBarras() {
    $$(".metrica-linha .barra", listaCasos).forEach((b) => { b.style.width = "0%"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$(".metrica-linha .barra", listaCasos).forEach((b) => { b.style.width = b.dataset.largura + "%"; });
    }));
  }
  if (listaCasos) {
    montaCasos();
    $$(".filtro").forEach((botao) => botao.addEventListener("click", () => {
      const f = botao.dataset.filtro;
      $$(".filtro").forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));
      let visiveis = 0;
      $$(".caso", listaCasos).forEach((c) => {
        const mostra = f === "todos" || c.dataset.setor === f;
        c.hidden = !mostra;
        if (mostra) visiveis++;
      });
      $("#filtro-contagem").textContent = `${visiveis} ${visiveis === 1 ? "caso" : "casos"}${f === "todos" ? "" : " em " + SETORES[f]}`;
      crescerBarras();
    }));
  }

  /* ---------- Pedido de conversa ---------- */
  const formConversa = $("#form-conversa");
  const resumo = $("#conversa-resumo");
  const PORTES = { ate5: "Até 5 pessoas", "6a20": "6 a 20 pessoas", "21a50": "21 a 50 pessoas", "51a200": "51 a 200 pessoas", mais200: "Mais de 200 pessoas" };
  const SETORES_FORM = Object.assign({ outro: "Outro" }, SETORES);
  const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  function montaDias() {
    const caixa = $("#dias");
    const hoje = new Date();
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    let n = 0;
    while (n < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      n++;
      const valor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = el("label");
      const input = el("input", { type: "radio", name: "dia", value: valor, "data-texto": `${DIAS_SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}` });
      const span = el("span");
      span.appendChild(el("small", null, DIAS_SEMANA[d.getDay()]));
      span.appendChild(el("b", null, String(d.getDate())));
      span.appendChild(el("small", null, MESES[d.getMonth()]));
      label.appendChild(input);
      label.appendChild(span);
      caixa.appendChild(label);
    }
  }

  function mascaraTelefone(input) {
    const d = input.value.replace(/\D/g, "").slice(0, 11);
    let s = d;
    if (d.length > 2) s = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) {
      const corpo = d.slice(2);
      const corte = corpo.length > 8 ? 5 : 4;
      s = `(${d.slice(0, 2)}) ${corpo.slice(0, corte)}-${corpo.slice(corte)}`;
    }
    input.value = s;
  }

  function mostraErroGrupo(idErro, msg) {
    const erro = $("#" + idErro);
    erro.textContent = msg || "";
    erro.hidden = !msg;
    return !msg;
  }

  function validaConversa() {
    const nome = $("#nome"), empresa = $("#empresa"), porte = $("#porte"), setor = $("#setor"), tel = $("#telefone"), email = $("#email");
    const problemas = [];
    if (!mostraErroCampo(nome, nome.value.trim().length < 2 ? "Digite seu nome." : "")) problemas.push(nome);
    if (!mostraErroCampo(empresa, empresa.value.trim().length < 2 ? "Digite o nome da empresa." : "")) problemas.push(empresa);
    if (!mostraErroCampo(porte, !porte.value ? "Escolha quantas pessoas trabalham na empresa." : "")) problemas.push(porte);
    if (!mostraErroCampo(setor, !setor.value ? "Escolha o setor." : "")) problemas.push(setor);
    const digitos = tel.value.replace(/\D/g, "");
    if (!mostraErroCampo(tel, digitos.length < 10 ? "Digite o telefone com DDD, com 10 ou 11 números." : "")) problemas.push(tel);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    if (!mostraErroCampo(email, emailOk ? "" : "Digite um e-mail completo, como nome@empresa.com.br.")) problemas.push(email);
    const dia = $('input[name="dia"]:checked', formConversa);
    if (!mostraErroGrupo("dia-erro", dia ? "" : "Escolha um dia.")) problemas.push($('input[name="dia"]', formConversa));
    const hora = $('input[name="hora"]:checked', formConversa);
    if (!mostraErroGrupo("hora-erro", hora ? "" : "Escolha um horário.")) problemas.push($('input[name="hora"]', formConversa));
    return { ok: problemas.length === 0, primeiro: problemas[0], dia, hora };
  }

  function protocolo() {
    const d = new Date();
    const aa = String(d.getFullYear()).slice(2), mm = String(d.getMonth() + 1).padStart(2, "0");
    return `AL-${aa}${mm}-${String(Math.floor(Math.random() * 900) + 100)}`;
  }

  if (formConversa) {
    montaDias();
    $("#telefone").addEventListener("input", (e) => mascaraTelefone(e.target));
    formConversa.addEventListener("submit", (e) => {
      e.preventDefault();
      const r = validaConversa();
      const erroGeral = $("#conversa-erro");
      if (!r.ok) {
        erroGeral.hidden = false;
        if (r.primeiro) r.primeiro.focus();
        return;
      }
      erroGeral.hidden = true;
      $("#res-nome").textContent = $("#nome").value.trim();
      $("#res-protocolo").textContent = protocolo();
      $("#res-empresa").textContent = $("#empresa").value.trim();
      $("#res-porte").textContent = PORTES[$("#porte").value];
      $("#res-setor").textContent = SETORES_FORM[$("#setor").value];
      $("#res-quando").textContent = `${r.dia.dataset.texto}, às ${r.hora.value}`;
      $("#res-contato").textContent = `${$("#telefone").value} · ${$("#email").value.trim()}`;
      const assunto = $("#assunto").value.trim();
      $("#res-assunto").textContent = assunto || "Não informado. Conversamos sobre isso na hora.";
      formConversa.hidden = true;
      resumo.hidden = false;
      resumo.scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth", block: "start" });
      const h3 = $("h3", resumo);
      h3.setAttribute("tabindex", "-1");
      h3.focus({ preventScroll: true });
    });
    $("#res-editar").addEventListener("click", () => {
      resumo.hidden = true;
      formConversa.hidden = false;
      $("#nome").focus();
    });
    $("#res-novo").addEventListener("click", () => {
      formConversa.reset();
      $$("[aria-invalid]", formConversa).forEach((i) => { i.removeAttribute("aria-invalid"); i.removeAttribute("aria-describedby"); });
      $$(".erro", formConversa).forEach((e) => { e.hidden = true; });
      resumo.hidden = true;
      formConversa.hidden = false;
      $("#nome").focus();
    });
  }
})();
