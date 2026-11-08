/* Testes do site com Playwright.
   Como rodar, na raiz do projeto:  node tests/site.cjs
   O script sobe um servidor local (python3 -m http.server 8317, na pasta acima, para o site
   responder em /consultoria/ como no GitHub Pages), abre o site em três tamanhos
   (1280x900, iPhone 13 e 320px), exercita as quatro funções, confere console, rolagem
   horizontal e textos cortados. Com CAPTURAS=1 salva PNGs em CAP_DIR (depois convertidos
   para webp em docs/) e, com SHOTS_DIR definido, salva a abertura em 1440x900 e no celular. */
"use strict";
const { chromium, devices } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORTA = 8317;
const RAIZ = path.resolve(__dirname, "..");
const SLUG = path.basename(RAIZ);
const URL = `http://127.0.0.1:${PORTA}/${SLUG}/`;
const CAPTURAS = process.env.CAPTURAS === "1";
const SHOTS_DIR = process.env.SHOTS_DIR || "";
const CAP_DIR = process.env.CAP_DIR || path.join(RAIZ, "tests", "capturas");

const falhas = [];
function checa(cond, msg) { if (!cond) falhas.push(msg); }
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const txt = async (page, sel) => (await page.textContent(sel)).replace(/\u00a0/g, " ").trim();

async function servidor() {
  const proc = spawn("python3", ["-m", "http.server", String(PORTA), "--bind", "127.0.0.1"], { cwd: path.dirname(RAIZ), stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(URL); if (r.ok) return proc; } catch (e) { /* ainda subindo */ }
    await espera(150);
  }
  proc.kill();
  throw new Error("Servidor local não subiu na porta " + PORTA);
}

async function verificacoesBasicas(page, rotulo) {
  const largura = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  checa(largura.doc <= largura.win, `${rotulo}: rolagem horizontal (${largura.doc} > ${largura.win})`);

  const cortados = await page.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll("h1,h2,h3,h4,p,a,button,label,legend,li,dt,dd,summary,span,small,address,option,b");
    for (const el of els) {
      if (el.closest("[hidden]") || (el.offsetParent === null && getComputedStyle(el).position !== "fixed")) continue;
      const cs = getComputedStyle(el);
      if (cs.overflow === "hidden" || cs.overflowX === "hidden") continue;
      if (el.tagName === "OPTION") continue;
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
        out.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`);
      }
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 1 && r.width > 0) out.push(`${el.tagName.toLowerCase()}.${el.className} sai da tela (${Math.round(r.right)})`);
    }
    return out;
  });
  checa(cortados.length === 0, `${rotulo}: textos cortados ou fora da tela: ${cortados.join(" | ")}`);
}

async function capturar(page, seletor, nome) {
  await page.evaluate(() => { document.querySelector(".topo").style.position = "static"; });
  await page.locator(seletor).screenshot({ path: path.join(CAP_DIR, nome + ".png") });
  await page.evaluate(() => { document.querySelector(".topo").style.position = ""; });
}

async function testaFuncoes(page, rotulo, capturas, sufixo) {
  /* Diagnóstico: enviar incompleto, depois responder tudo */
  await page.click('#form-diag button[type="submit"]');
  checa(!(await page.isHidden("#diag-erro")), `${rotulo}: diagnóstico incompleto passou`);
  checa((await page.evaluate(() => document.activeElement.name)) === "q1", `${rotulo}: foco não foi para a primeira pergunta vazia`);
  /* Finanças 2 e 1 (12,5%), Processos 4 e 5 (87,5%), Equipe 3 e 3 (50%), Clientes 5 e 4 (87,5%), Gestão 2 e 2 (25%) */
  const respostas = [2, 1, 4, 5, 3, 3, 5, 4, 2, 2];
  for (let i = 0; i < 10; i++) await page.check(`input[name="q${i + 1}"][value="${respostas[i]}"]`);
  checa((await txt(page, "#diag-progresso")) === "10 de 10 respondidas", `${rotulo}: progresso não chegou a 10`);
  checa(await page.isHidden("#diag-erro"), `${rotulo}: erro do diagnóstico não sumiu`);
  await page.click('#form-diag button[type="submit"]');
  await page.waitForSelector("#diag-resultado:not([hidden])");
  await espera(800);
  checa((await page.locator("#radar polygon.poligono").count()) === 1, `${rotulo}: radar sem polígono`);
  checa((await page.locator("#radar circle.ponto").count()) === 5, `${rotulo}: radar sem os 5 pontos`);
  const areas = await page.$$eval("#diag-areas li .valor", (els) => els.map((e) => e.textContent));
  checa(areas.join(",") === "13%,88%,50%,88%,25%", `${rotulo}: valores do radar errados (${areas.join(",")})`);
  const fracas = await page.locator("#diag-areas li.fraca").count();
  checa(fracas === 3, `${rotulo}: esperava 3 áreas fracas, veio ${fracas}`);
  const dicas = await page.$$eval("#diag-dicas li strong", (els) => els.map((e) => e.textContent));
  checa(dicas[0].startsWith("Finanças"), `${rotulo}: primeira dica deveria ser Finanças (${dicas[0]})`);
  checa(dicas.length === 3, `${rotulo}: esperava 3 dicas, veio ${dicas.length}`);
  const pontos = await page.getAttribute("#radar polygon.poligono", "points");
  checa(pontos.split(" ").length === 5, `${rotulo}: polígono sem 5 vértices`);
  if (capturas) await capturar(page, "#diagnostico", `funcao-diagnostico${sufixo}`);

  /* Levar para a conversa preenche o assunto */
  await page.click("#diag-levar");
  const assunto = await page.inputValue("#assunto");
  checa(assunto.includes("Finanças (13%)"), `${rotulo}: levar o radar não preencheu o assunto (${assunto.slice(0, 60)})`);

  /* Refazer limpa */
  await page.click("#diag-refazer");
  checa(await page.isHidden("#diag-resultado"), `${rotulo}: refazer não escondeu o resultado`);
  checa((await txt(page, "#diag-progresso")) === "0 de 10 respondidas", `${rotulo}: refazer não zerou o progresso`);

  /* Calculadora: valores iniciais 18.000 / 350 / 210 / 8.000 */
  checa((await txt(page, "#mc-valor")) === "R$ 140,00", `${rotulo}: margem inicial errada (${await txt(page, "#mc-valor")})`);
  checa((await txt(page, "#pe-vendas")) === "129 vendas", `${rotulo}: PE inicial errado (${await txt(page, "#pe-vendas")})`);
  checa((await txt(page, "#pe-valor")).startsWith("R$ 45.000,00"), `${rotulo}: faturamento do PE errado`);
  checa((await txt(page, "#meta-vendas")) === "186 vendas", `${rotulo}: vendas da meta erradas`);
  checa((await page.locator("#grafico-pe line.linha-receita").count()) === 1, `${rotulo}: gráfico sem linha de receita`);
  checa((await page.locator("#grafico-pe polygon.area-lucro").count()) === 1, `${rotulo}: gráfico sem área de lucro`);
  await page.fill("#fixos", "24.500,50");
  await page.fill("#preco", "99,90");
  await page.fill("#variavel", "61,40");
  await page.fill("#meta", "");
  await espera(100);
  /* MC 38,50; PE 24500,5/38,5 = 636,38 → 637 vendas; faturamento 636,38 × 99,90 = 63.574,89 */
  checa((await txt(page, "#mc-valor")) === "R$ 38,50", `${rotulo}: margem com decimais errada (${await txt(page, "#mc-valor")})`);
  checa((await txt(page, "#pe-vendas")) === "637 vendas", `${rotulo}: PE com decimais errado (${await txt(page, "#pe-vendas")})`);
  checa((await txt(page, "#pe-valor")).startsWith("R$ 63.574,"), `${rotulo}: faturamento com decimais errado (${await txt(page, "#pe-valor")})`);
  checa((await txt(page, "#meta-vendas")) === "informe a meta", `${rotulo}: meta vazia não avisou`);
  await page.fill("#variavel", "120");
  await espera(100);
  checa(!(await page.isHidden("#calc-aviso")), `${rotulo}: custo maior que preço não avisou`);
  checa((await txt(page, "#pe-vendas")) === "não existe", `${rotulo}: PE deveria não existir`);
  await page.fill("#preco", "abc");
  await espera(100);
  checa(!(await page.isHidden("#preco-erro")), `${rotulo}: preço inválido não mostrou erro`);
  await page.fill("#fixos", "18000");
  await page.fill("#preco", "350");
  await page.fill("#variavel", "210");
  await page.fill("#meta", "8000");
  await page.dispatchEvent("#fixos", "blur");
  await espera(100);
  checa((await page.inputValue("#fixos")) === "18.000", `${rotulo}: blur não formatou o campo (${await page.inputValue("#fixos")})`);
  checa(await page.isHidden("#calc-aviso"), `${rotulo}: aviso da calculadora não sumiu`);
  checa((await txt(page, "#meta-vendas")) === "186 vendas", `${rotulo}: calculadora não voltou ao normal`);
  if (capturas) await capturar(page, "#calculadora", `funcao-calculadora${sufixo}`);

  /* Casos: filtros */
  checa((await page.locator("#lista-casos .caso").count()) === 6, `${rotulo}: esperava 6 casos`);
  await page.click('.filtro[data-filtro="servicos"]');
  await espera(600);
  checa((await page.locator("#lista-casos .caso:not([hidden])").count()) === 2, `${rotulo}: filtro serviços não deixou 2 casos`);
  checa((await txt(page, "#filtro-contagem")) === "2 casos em Serviços", `${rotulo}: contagem do filtro errada (${await txt(page, "#filtro-contagem")})`);
  checa((await page.getAttribute('.filtro[data-filtro="servicos"]', "aria-pressed")) === "true", `${rotulo}: aria-pressed do filtro`);
  checa((await page.getAttribute('.filtro[data-filtro="todos"]', "aria-pressed")) === "false", `${rotulo}: aria-pressed de 'todos' não soltou`);
  const larguraBarra = await page.evaluate(() => getComputedStyle(document.querySelector('#lista-casos .caso:not([hidden]) .metrica-linha.antes .barra')).width);
  checa(parseFloat(larguraBarra) > 20, `${rotulo}: barra do caso não cresceu (${larguraBarra})`);
  await page.click('.filtro[data-filtro="industria"]');
  await espera(600);
  checa((await page.locator("#lista-casos .caso:not([hidden]) .metrica-direcao.piorou").count()) === 1, `${rotulo}: o indicador que piorou não está marcado`);
  if (capturas) await capturar(page, "#casos", `funcao-casos${sufixo}`);
  await page.click('.filtro[data-filtro="todos"]');
  await espera(300);
  checa((await page.locator("#lista-casos .caso:not([hidden])").count()) === 6, `${rotulo}: voltar para todos não devolveu 6`);

  /* Conversa: envio vazio, correção e resumo */
  checa((await page.locator("#dias label").count()) === 10, `${rotulo}: esperava 10 dias úteis`);
  const diasSemana = await page.$$eval("#dias small:first-child", (els) => els.map((e) => e.textContent));
  checa(!diasSemana.includes("sáb") && !diasSemana.includes("dom"), `${rotulo}: fim de semana na lista de dias`);
  await page.click('#form-conversa button[type="submit"]');
  checa(!(await page.isHidden("#conversa-erro")), `${rotulo}: formulário vazio passou`);
  checa((await page.evaluate(() => document.activeElement.id)) === "nome", `${rotulo}: foco não foi para o primeiro erro`);
  await page.fill("#nome", "Joana de Teste");
  await page.fill("#empresa", "Padaria Exemplo");
  await page.selectOption("#porte", "6a20");
  await page.selectOption("#setor", "alimentacao");
  await page.fill("#telefone", "65999990000");
  checa((await page.inputValue("#telefone")) === "(65) 99999-0000", `${rotulo}: máscara do telefone errada (${await page.inputValue("#telefone")})`);
  await page.fill("#email", "joana@exemplo");
  await page.check('#dias input[name="dia"] >> nth=2');
  await page.check('input[name="hora"][value="14h"]');
  await page.click('#form-conversa button[type="submit"]');
  checa(!(await page.isHidden("#email-erro")), `${rotulo}: e-mail incompleto passou`);
  checa((await page.evaluate(() => document.activeElement.id)) === "email", `${rotulo}: foco não foi para o e-mail`);
  await page.fill("#email", "joana@exemplo.com.br");
  if (capturas) await capturar(page, "#conversa", `funcao-conversa${sufixo}`);
  await page.click('#form-conversa button[type="submit"]');
  await page.waitForSelector("#conversa-resumo:not([hidden])");
  checa((await txt(page, "#res-porte")) === "6 a 20 pessoas", `${rotulo}: resumo sem o porte`);
  checa((await txt(page, "#res-setor")) === "Alimentação", `${rotulo}: resumo sem o setor`);
  checa((await txt(page, "#res-quando")).includes("às 14h"), `${rotulo}: resumo sem o horário (${await txt(page, "#res-quando")})`);
  checa(/^AL-\d{4}-\d{3}$/.test(await txt(page, "#res-protocolo")), `${rotulo}: protocolo fora do padrão`);
  checa((await txt(page, "#res-assunto")).includes("Finanças (13%)"), `${rotulo}: resumo não trouxe o radar no assunto`);
  checa((await page.evaluate(() => localStorage.length + sessionStorage.length)) === 0, `${rotulo}: algo foi parar no armazenamento do navegador`);
  if (capturas) await capturar(page, "#conversa", `funcao-conversa-resumo${sufixo}`);
  await page.click("#res-editar");
  checa(!(await page.isHidden("#form-conversa")), `${rotulo}: corrigir dados não voltou ao formulário`);
  checa((await page.inputValue("#nome")) === "Joana de Teste", `${rotulo}: corrigir dados perdeu o nome`);
  await page.click('#form-conversa button[type="submit"]');
  await page.waitForSelector("#conversa-resumo:not([hidden])");
  await page.click("#res-novo");
  checa((await page.inputValue("#nome")) === "", `${rotulo}: novo pedido não limpou`);
  checa((await page.inputValue("#assunto")) === "", `${rotulo}: novo pedido não limpou o assunto`);
  checa(await page.isHidden("#nome-erro"), `${rotulo}: novo pedido deixou erro antigo`);
}

(async () => {
  if (CAPTURAS) fs.mkdirSync(CAP_DIR, { recursive: true });
  const proc = await servidor();
  const browser = await chromium.launch();
  const cenarios = [
    { nome: "1280x900", ctx: { viewport: { width: 1280, height: 900 } }, sufixo: "" },
    { nome: "iPhone 13", ctx: { ...devices["iPhone 13"] }, sufixo: "-celular" },
    { nome: "320px", ctx: { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, sufixo: "" }
  ];
  try {
    for (const c of cenarios) {
      const context = await browser.newContext(c.ctx);
      const page = await context.newPage();
      const erros = [];
      page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") erros.push(`${m.type()}: ${m.text()}`); });
      page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
      page.on("requestfailed", (r) => erros.push("requestfailed: " + r.url()));
      await page.goto(URL, { waitUntil: "networkidle" });
      await espera(1000);
      await verificacoesBasicas(page, c.nome + " (abertura)");

      await page.keyboard.press("Tab");
      const ativo = await page.evaluate(() => document.activeElement.className);
      checa(ativo.includes("pular"), `${c.nome}: primeiro Tab não foi para "Pular para o conteúdo" (${ativo})`);
      await page.mouse.click(5, 5);

      const capturas = CAPTURAS && c.nome !== "320px";
      if (capturas) await page.screenshot({ path: path.join(CAP_DIR, `capa${c.sufixo || "-desktop"}.png`) });

      if (c.nome !== "1280x900") {
        await page.click(".menu-botao");
        checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "true", `${c.nome}: menu não abriu`);
        await page.click('#menu a[href="#diagnostico"]');
        checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "false", `${c.nome}: menu não fechou ao clicar`);
      }
      await testaFuncoes(page, c.nome, capturas, c.sufixo);
      await verificacoesBasicas(page, c.nome + " (após uso)");

      await page.goto(URL + "404.html", { waitUntil: "networkidle" });
      await verificacoesBasicas(page, c.nome + " (404)");

      const errosReais = erros.filter((e) => !/404\.html|favicon/.test(e) || /pageerror/.test(e));
      checa(errosReais.length === 0, `${c.nome}: console: ${errosReais.join(" | ")}`);
      console.log(`${c.nome}: ok (console ${errosReais.length}, falhas até aqui ${falhas.length})`);
      await context.close();
    }

    if (SHOTS_DIR) {
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
      const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await d.goto(URL, { waitUntil: "networkidle" }); await espera(1000);
      await d.screenshot({ path: path.join(SHOTS_DIR, `${SLUG}-desk.png`) });
      await d.close();
      const ctx = await browser.newContext({ ...devices["iPhone 13"] });
      const m = await ctx.newPage();
      await m.goto(URL, { waitUntil: "networkidle" }); await espera(1000);
      await m.screenshot({ path: path.join(SHOTS_DIR, `${SLUG}-cel.png`) });
      await ctx.close();
    }
  } finally {
    await browser.close();
    proc.kill();
  }

  if (falhas.length) {
    console.error("\nFALHAS:\n- " + falhas.join("\n- "));
    process.exit(1);
  }
  console.log("\nTodos os testes passaram.");
})().catch((e) => { console.error(e); process.exit(1); });
