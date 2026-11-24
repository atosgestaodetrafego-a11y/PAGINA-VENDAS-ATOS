import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const theme=path.join(root,'theme');
const config=JSON.parse(fs.readFileSync(path.join(theme,'theme.json'),'utf8'));
assert.equal(config.version,3);
assert.deepEqual(config.settings.color.palette.map(x=>x.color),['#151515','#FBF6ED','#ED9C08']);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
for (const file of walk(theme).filter(x=>x.endsWith('.html'))) {
  const html=fs.readFileSync(file,'utf8');
  const stack=[];
  for(const m of html.matchAll(/<!--\s*(\/)?wp:([\w/-]+)([^]*?)-->/g)) {
    if(m[1]) assert.equal(stack.pop(),m[2],`Bloco desbalanceado em ${file}`);
    else {const attrs=m[3].trim().replace(/\/$/,'').trim(); if(attrs)JSON.parse(attrs);if(!/\/\s*$/.test(m[3]))stack.push(m[2]);}
  }
  assert.equal(stack.length,0,`Blocos não fechados em ${file}`);
}
const html=fs.readFileSync(path.join(theme,'templates/front-page.html'),'utf8');
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert.equal((html.match(/<section\b/g)||[]).length,11);
assert.equal((html.match(/<details\b/g)||[]).length,8);
const anchors=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(anchors).size,anchors.length,'Âncoras duplicadas');
for(const literal of ['R$ 2.500','quatro primeiras empresas','691','330','4,9','135 avaliações','2 carrosséis de até 5 slides','2 vídeos de até 60 segundos','dias úteis','uma rodada de ajustes por lote','não são atribuídos a uma campanha específica','Google Ads <strong>ou</strong> Meta Ads'])assert.ok(html.includes(literal),'Copy ausente: '+literal);
assert.ok(fs.readFileSync(path.join(theme,'functions.php'),'utf8').includes('5511957314749'));
for(const file of walk(theme).filter(x=>/\.(html|css|js)$/.test(x))) {
 const content=fs.readFileSync(file,'utf8');
 assert.ok(!/https?:\/\/(?:fonts\.googleapis|connect\.facebook|www\.googletagmanager)/.test(content),'Recurso externo inesperado');
 assert.ok(!content.includes('11999999999'),'Telefone fictício');
}
assert.ok(fs.existsSync(path.join(theme,'assets/atos-logo-escuro.png')),'Logo ausente');
console.log('OK: 11 seções, 8 dúvidas, copy comercial, identidade, contato e estrutura de blocos.');
