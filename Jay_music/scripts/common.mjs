import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';

export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const binaries=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc');
export const timeline=()=>JSON.parse(fs.readFileSync(path.join(root,'src/timeline.json'),'utf8'));
export const run=(exe,args)=>{
  const result=spawnSync(exe,args,{cwd:root,stdio:'inherit',windowsHide:true});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error(`${path.basename(exe)} exited ${result.status}`);
};
export const ffmpeg=args=>run(path.join(binaries,'ffmpeg.exe'),args);
export async function setup(id='PaperMV'){
  fs.mkdirSync(path.join(root,'out'),{recursive:true});
  const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
  const browserExecutable=process.env.REMOTION_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const puppeteerInstance=await openBrowser('chrome',{browserExecutable,chromiumOptions:{headless:true},logLevel:'error'});
  const composition=await selectComposition({serveUrl,id,puppeteerInstance,logLevel:'error'});
  return {serveUrl,composition,puppeteerInstance};
}
