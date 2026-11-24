import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
if(process.argv.includes('--export')) {
 const roots=['README.md','.gitignore','theme','tools','preview','.github','dist','docs'];
 const files=roots.flatMap(x=>{const p=path.join(root,x);return fs.existsSync(p)?(fs.statSync(p).isDirectory()?walk(p):[p]):[];});
 const skip=/\/(helpers|runtime|package|node_modules)\//;
 console.log(JSON.stringify(files.filter(p=>!skip.test(p.replaceAll('\\','/'))).map(p=>({path:path.relative(root,p).replaceAll('\\','/'),content:fs.readFileSync(p).toString('base64'),encoding:'base64'}))));
}
