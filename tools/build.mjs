import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const theme = path.join(root, 'theme');
const block = (name, attrs, html) => `<!-- wp:${name}${Object.keys(attrs || {}).length ? ' ' + JSON.stringify(attrs) : ''} -->\n${html}\n<!-- /wp:${name} -->\n`;
const p = (html, cls = '') => block('paragraph', cls ? {className:cls} : {}, `<p${cls ? ` class="${cls}"` : ''}>${html}</p>`);
const h = (html, level=2, cls='') => block('heading', {...(level!==2?{level}:{}),...(cls?{className:cls}:{})}, `<h${level} class="wp-block-heading${cls?' '+cls:''}">${html}</h${level}>`);
const group = (html, cls='', tag='div', anchor='') => block('group',{...(tag!=='div'?{tagName:tag}:{}),...(anchor?{anchor}:{}),...(cls?{className:cls}:{}),layout:{type:'default'}},`<${tag}${anchor?` id="${anchor}"`:''} class="wp-block-group${cls?' '+cls:''}">${html}</${tag}>`);
const cols = (items, widths=[]) => block('columns',{},`<div class="wp-block-columns">${items.map((item,i)=>block('column',widths[i]?{width:widths[i]}:{},`<div class="wp-block-column"${widths[i]?` style="flex-basis:${widths[i]}"`:''}>${item}</div>`)).join('')}</div>`);
const sc = text => block('shortcode',{},text);
const cta = (label,style='',small=false) => sc(`[atos_cta label="${label}"${style?` style="${style}"`:''}${small?' small="1"':''}]`);
const eyebrow = (t,inverse=false) => p(t, 'eyebrow'+(inverse?' inverse':''));
const list = (items,cls='') => block('list',cls?{className:cls}:{},`<ul class="wp-block-list${cls?' '+cls:''}">${items.map(x=>block('list-item',{},`<li>${x}</li>`)).join('')}</ul>`);
const intro = (e,title,text='') => group(eyebrow(e)+h(title)+(text?p(text):''),'section-intro');
const section = (content,cls='',anchor='') => group(group(content,'atos-shell'),'atos-section '+cls,'section',anchor);

const header = group(group(sc('[atos_brand]')+sc('[atos_nav]')+cta('Vamos conversar','','1'),'atos-shell atos-nav-inner'),'atos-nav');
const footer = group(group(group(sc('[atos_brand]')+p('Tráfego pago e conteúdo para negócios locais.'),'atos-footer-top')+group(p('ATOS Gestão de Tráfego · Leandro Gomes')+sc('[atos_privacy]'),'atos-footer-bottom'),'atos-shell'),'atos-footer');

const hero = section(cols([
  eyebrow('ATOS CLIENTES LOCAIS')+
  h('Sua empresa precisa ser encontrada por quem pode se tornar <span class="text-amber">cliente.</span>',1)+
  p('<strong>Tráfego pago e conteúdo para divulgar seu negócio na sua região, apresentar seus serviços e facilitar o contato.</strong>','hero-subtitle')+
  p('Com a ATOS, você conta com planejamento, gestão de anúncios e oito conteúdos mensais para manter sua divulgação em movimento.','hero-text')+
  p('<strong>Você cuida do negócio. A ATOS organiza e acompanha a divulgação.</strong>','hero-promise')+
  cta('Quero divulgar minha empresa')+p('Atendimento para negócios locais. Planos com escopo definido e acompanhamento mensal.','hero-note'),
  group(p('ESTRATÉGIA PERTO DE VOCÊ','art-label')+sc('[atos_portrait priority="1"]')+p('Seu negócio. Sua região.<br><strong>Uma divulgação com direção.</strong><span aria-hidden="true">↗</span>','hero-art-caption'),'hero-art')
],['59%','41%']),'hero atos-dark','inicio');
const strip = group(group(p('Google Ads')+p('Meta Ads')+p('Conteúdo')+p('Negócios locais'),'atos-shell hero-strip-inner'),'hero-strip');

const problem = section(cols([
  eyebrow('SUA ROTINA, A GENTE ENTENDE')+h('Você já tem muita coisa para resolver. O marketing acaba ficando para depois?')+
  p('Entre atender clientes, organizar a equipe e cuidar da operação, sobra pouco tempo para pensar no próximo conteúdo ou acompanhar uma campanha.'),
  p('Talvez você reconheça alguma destas situações:')+list([
    'Seu Instagram passa semanas sem uma publicação.',
    'Você tem dificuldade para transformar seus serviços em conteúdos interessantes.',
    'Já impulsionou publicações, mas não entendeu o que aconteceu com o dinheiro investido.',
    'As pessoas entram no perfil e ainda precisam perguntar tudo sobre sua empresa.',
    'Seu negócio depende de indicações e você gostaria de criar outros caminhos para atrair clientes.'
  ],'problem-list')
],['44%','56%'])+p('A ATOS organiza essas ações em uma estratégia que considera sua região, sua oferta e sua capacidade de atendimento.','callout'),'problem','desafios');

const solution = section(cols([
  eyebrow('UMA ESTRATÉGIA CONECTADA')+h('Anúncios e conteúdo trabalhando com o mesmo objetivo.')+
  group(group(h('Anúncios',3)+p('O anúncio apresenta sua empresa a pessoas que podem ter interesse no que você oferece.'),'solution-item')+
    group(h('Conteúdo',3)+p('O conteúdo ajuda essas pessoas a entender seus serviços, conhecer seus diferenciais e encontrar o próximo passo para entrar em contato.'),'solution-item'),'solution-grid')+
  p('No <strong>ATOS Clientes Locais</strong>, planejamos essas duas frentes juntas: uma prioridade comercial por mês, materiais alinhados à sua empresa e acompanhamento para orientar os ajustes.')+cta('Quero conversar sobre meu negócio'),
  group(p('Planejar.<br><span class="text-amber">Divulgar.</span><br>Acompanhar.','big-statement')+p('Da primeira impressão ao próximo contato.','panel-footer'),'solution-panel')
],['57%','43%']),'solution atos-dark','solucao');

const services = section(intro('ENTREGA DEFINIDA','Conheça o ATOS Clientes Locais','<strong>Uma solução mensal de tráfego pago com conteúdo de apoio.</strong>')+
  cols([
    group(p('01 / TRÁFEGO PAGO','card-number')+h('Gestão de anúncios',3)+p('Planejamento, configuração ou revisão da conta e gestão de uma plataforma principal: <strong>Google Ads ou Meta Ads</strong>, escolhida conforme o objetivo do negócio.')+p('Definimos a região de divulgação, preparamos os anúncios e acompanhamos as campanhas em dias úteis para realizar os ajustes necessários.'),'service-card'),
    group(p('02 / CONTEÚDO','card-number')+h('Oito conteúdos por mês',3)+p('Seu pacote inclui:')+list([
      '<strong>4 artes estáticas</strong> para apresentar serviços, diferenciais e informações relevantes.',
      '<strong>2 carrosséis de até 5 slides</strong> para explicar, orientar e responder dúvidas.',
      '<strong>2 vídeos de até 60 segundos</strong>, com roteiro, edição, legendas e capa.'
    ])+p('Os conteúdos acompanham legendas e agendamento no Instagram, após sua aprovação.'),'service-card featured')
  ])+group(
    group(h('Materiais aproveitados nas campanhas',3)+p('Até quatro dos conteúdos produzidos são adaptados para anúncios, conforme o formato e a estratégia da plataforma escolhida.'))+
    group(h('Acompanhamento com clareza',3)+p('Você recebe um relatório mensal e participa de uma reunião de até 30 minutos para entender os resultados, esclarecer dúvidas e alinhar as próximas ações.')),
    'service-support'
  ),'deliverables','entregas');

const method = section(intro('MÉTODO ATOS','Antes de anunciar, precisamos entender seu negócio.','O trabalho segue o método ATOS:')+cols([
  ['A','Analisar','Conhecemos sua empresa, sua região, seus serviços e o que você deseja movimentar.'],
  ['T','Traçar a estratégia','Definimos a prioridade do mês, a mensagem, o canal e o caminho que a pessoa seguirá até o contato.'],
  ['O','Operar','Produzimos os materiais aprovados, colocamos as campanhas em funcionamento e organizamos as publicações.'],
  ['S','Supervisionar','Acompanhamos os dados disponíveis e os contatos registrados para identificar o que precisa ser mantido, testado ou ajustado.']
].map(([letter,title,text])=>group(p(letter,'method-letter')+h(title,3)+p(text),'method-card'))),'method atos-dark','metodo');

const process = section(cols([
  eyebrow('COMO FUNCIONA A PARCERIA')+h('Você participa com o conhecimento do seu negócio. Nós conduzimos a execução.')+p('A implantação e o calendário de entregas são definidos após o recebimento dos acessos e materiais necessários.','note'),
  group([
    ['Entendemos sua realidade','Começamos com um alinhamento sobre serviços, público, região, objetivos e capacidade de atendimento.'],
    ['Planejamos a divulgação','Organizamos a prioridade comercial e os conteúdos do mês.'],
    ['Você envia os materiais','Solicitamos fotos, informações e gravações. Nos vídeos, você recebe os roteiros e orientações para gravar.'],
    ['Produzimos e enviamos para aprovação','Preparamos os conteúdos e anúncios, com uma rodada de ajustes por lote.'],
    ['Publicamos, anunciamos e acompanhamos','Após as aprovações, seguimos o calendário combinado e acompanhamos as campanhas.']
  ].map(([title,text])=>group(h(title,3)+p(text),'process-step')).join(''),'process-steps')
],['44%','56%']),'process','parceria');

const founder = section(cols([
  group(sc('[atos_portrait]'),'atos-portrait')+p('<strong>Leandro Gomes</strong><br>Fundador da ATOS Gestão de Tráfego','portrait-caption'),
  eyebrow('QUEM ESTÁ À FRENTE')+h('Quem vai cuidar da sua divulgação?')+p('<strong>Sou Leandro Gomes, fundador da ATOS Gestão de Tráfego.</strong>')+
  p('Durante 15 anos, fui professor de tecnologia. Na pandemia, comecei a estudar marketing digital para aplicar na escola onde trabalhava.')+
  p('Desde então, mantenho uma rotina prática com campanhas no Google Ads e no Meta Ads, ajudando negócios locais a organizar sua divulgação.')+
  p('Também vivo os desafios de empreender: construí a Esmalteria Letícia Gomes ao lado da minha esposa e sócia, Letícia.')+
  p('Conheço a responsabilidade de cuidar da operação, atender pessoas e fazer escolhas sobre onde investir.')+
  p('Na ATOS, reúno essa experiência com a clareza que trouxe da sala de aula: <strong>você precisa entender o que está sendo feito e como isso se conecta ao seu negócio.</strong>')
],['40%','60%']),'founder','sobre');

const caseSection = section(eyebrow('VIVÊNCIA COM NEGÓCIO LOCAL',true)+h('Uma experiência que também acontece dentro do nosso próprio negócio.')+
  p('Na Esmalteria Letícia Gomes, acompanhamos de perto a relação entre comunicação, atendimento, organização e experiência da cliente.','case-intro')+
  p('Em <strong>outubro de 2026</strong>, o sistema registrou:')+
  group(
    group(p('691','stat-number')+p('atendimentos<br><small>Outubro de 2026</small>','stat-label'),'stat')+
    group(p('330','stat-number')+p('clientes atendidas<br><small>Outubro de 2026</small>','stat-label'),'stat')+
    group(p('4,9','stat-number')+p('nota no Google · 135 avaliações<br><small>Consulta compartilhada em novembro de 2026</small>','stat-label'),'stat'),
    'stats'
  )+
  p('No Google, o perfil apresentava <strong>nota 4,9, com 135 avaliações</strong>, conforme consulta compartilhada em novembro de 2026.')+
  p('Essa vivência ajuda a compreender os desafios de quem precisa divulgar uma empresa e, ao mesmo tempo, entregar um bom atendimento.')+
  p('Os números apresentam o desempenho da esmalteria nos períodos indicados e não são atribuídos a uma campanha específica nem representam previsão de resultados para outros negócios.','note'),
  'case atos-amber','experiencia');

const price = section(cols([
  eyebrow('INVESTIMENTO')+h('Organize sua divulgação com uma entrega definida.')+p('Tráfego pago e conteúdo para apresentar sua empresa, explicar seus serviços e facilitar o próximo contato.','pricing-sub')+
  p('Uma plataforma principal. Oito conteúdos por mês. Planejamento, execução e acompanhamento com escopo definido.','pricing-detail'),
  group(p('Condição inicial para as quatro primeiras empresas contratantes.','price-ribbon')+
    group(h('ATOS Clientes Locais',3)+p('R$ 2.500 <small>por mês</small>','price')+p('Inclui:')+list([
      'Gestão de Google Ads <strong>ou</strong> Meta Ads.',
      'Planejamento mensal.',
      'Oito conteúdos para Instagram, incluindo dois vídeos.',
      'Roteiros, legendas e agendamento das publicações.',
      'Adaptação de até quatro conteúdos para anúncios.',
      'Acompanhamento das campanhas.',
      'Relatório e reunião mensal.'
    ])+p('<strong>Benefício de entrada:</strong> revisão inicial da bio, dos links e das informações do Instagram, realizada uma vez.','entry-benefit')+
    p('<strong>O investimento para veicular os anúncios é separado e pago diretamente ao Google ou à Meta.</strong>','ad-budget')+
    cta('Quero conhecer a proposta para minha empresa'),'price-card-body'),
    'price-card')
],['47%','53%']),'pricing atos-dark','investimento');

const faqs = [
  ['O valor inclui o dinheiro dos anúncios?','Não. A mensalidade remunera os serviços descritos no pacote. A verba de veiculação é definida à parte e paga diretamente à plataforma.'],
  ['Vocês anunciam no Google e no Instagram ao mesmo tempo?','Este pacote inclui uma plataforma principal: Google Ads ou Meta Ads. A escolha considera o objetivo, a oferta e a verba disponível. A gestão simultânea dos dois canais pode receber uma proposta específica.'],
  ['Preciso gravar os vídeos?','Você envia as gravações seguindo os roteiros e as orientações da ATOS. Nós cuidamos da edição prevista no pacote, com cortes, legendas e identidade visual simples.'],
  ['Vocês publicam os conteúdos?','Sim. As oito publicações são agendadas no Instagram após sua aprovação e conforme o calendário combinado.'],
  ['Vocês respondem às mensagens dos meus clientes?','O atendimento comercial fica com sua equipe. A ATOS cuida da divulgação prevista no pacote.'],
  ['O serviço inclui stories diários, site ou automações?','Essas entregas recebem orçamento separado, assim como filmagem presencial e produções com animações complexas.'],
  ['Vocês garantem uma quantidade de clientes ou vendas?','Nosso compromisso é executar o trabalho contratado, acompanhar os dados e ajustar a estratégia. As vendas também dependem da oferta, dos preços, da procura, da verba e do atendimento da empresa.'],
  ['Como começo?','Clique no botão e conte qual é seu negócio, onde você atende e o que gostaria de melhorar. Vamos avaliar se o pacote faz sentido para sua realidade e apresentar as condições da contratação.']
];
const faq = section(cols([
  eyebrow('PERGUNTAS FREQUENTES')+h('Antes de começar, esclareça suas dúvidas.'),
  group(faqs.map(([q,a])=>block('details',{},`<details class="wp-block-details"><summary>${q}</summary>${p(a)}</details>`)).join(''),'faq-list')
],['36%','64%']),'faq','duvidas');

const final = section(eyebrow('O PRÓXIMO PASSO',true)+h('Vamos organizar a divulgação da sua empresa?')+
  group(p('Você já conhece seu serviço e trabalha para entregar uma boa experiência.')+
    p('A ATOS ajuda a transformar esse conhecimento em anúncios e conteúdos que apresentam sua empresa às pessoas da sua região.')+
    p('<strong>Conte sobre seu negócio. Vamos entender qual deve ser o primeiro passo.</strong>'),'final-text')+
  cta('Conversar com Leandro no WhatsApp','dark'),'final-cta atos-amber','contato');

const main = group(hero+strip+problem+solution+services+method+process+founder+caseSection+price+faq+final,'','main','conteudo');
const floating=group(cta('Vamos conversar','','1'),'atos-floating');
const page = '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n'+main+'<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->\n'+floating;
fs.mkdirSync(path.join(theme,'parts'),{recursive:true});
fs.mkdirSync(path.join(theme,'templates'),{recursive:true});
fs.writeFileSync(path.join(theme,'parts/header.html'),header);
fs.writeFileSync(path.join(theme,'parts/footer.html'),footer);
fs.writeFileSync(path.join(theme,'templates/front-page.html'),page);

const phone='5511957314749';
const message=encodeURIComponent('Olá, Leandro! Quero conhecer o ATOS Clientes Locais para divulgar minha empresa.');
function previewRender(source) {
  return source.replace(/<!--[^]*?-->/g,'')
    .replace(/\[atos_brand\]/g,'<a class="atos-brand" href="#inicio"><img src="../theme/assets/atos-logo-escuro.png" width="2048" height="819" alt="ATOS Gestão de Tráfego"></a>')
    .replace(/\[atos_nav\]/g,'<nav class="atos-nav-links" aria-label="Navegação principal"><a href="#entregas">O que você recebe</a><a href="#metodo">Método ATOS</a><a href="#sobre">Sobre</a><a href="#investimento">Investimento</a></nav>')
    .replace(/\[atos_privacy\]/g,'')
    .replace(/\[atos_portrait[^\]]*\]/g,'<div class="portrait-placeholder" role="img" aria-label="Composição gráfica ATOS"><span class="orbit" aria-hidden="true"></span><span class="monogram" aria-hidden="true">A</span></div>')
    .replace(/\[atos_cta ([^\]]*)\]/g,(_,attrs)=>{
      const label=attrs.match(/label="([^"]*)"/)[1];
      const style=attrs.match(/style="([^"]*)"/)?.[1]||'';
      return `<div class="atos-cta-wrap"><a class="atos-button ${style}${attrs.includes('small=')?' small':''}" href="https://wa.me/${phone}?text=${message}" target="_blank" rel="noopener noreferrer" data-atos-cta="${label}">${label}</a></div>`;
    });
}
fs.mkdirSync(path.join(root,'preview'),{recursive:true});
fs.writeFileSync(path.join(root,'preview/index.html'),`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ATOS Clientes Locais — Prévia</title><meta name="description" content="Tráfego pago e conteúdo para negócios locais."><link rel="stylesheet" href="../theme/style.css"><style>.wp-block-columns{display:flex}.wp-block-column{flex:1} .screen-reader-text{position:absolute;clip:rect(1px,1px,1px,1px);width:1px;height:1px;overflow:hidden}</style></head><body><a class="skip-link" href="#conteudo">Pular para o conteúdo</a><header>${previewRender(header)}</header>${previewRender(main)}<footer>${previewRender(footer)}</footer>${previewRender(floating)}<script src="../theme/assets/site.js"></script></body></html>`);
console.log('Gerados: página inicial editável, partes de modelo e prévia estática.');
