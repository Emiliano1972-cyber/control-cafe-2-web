const V=[['guatemala','Guatemala','#3978B8'],['finezzo','Finezzo','#8FCB7B'],['vainilla','Vainilla','#E8C95A'],['descafeinado','Descafeinado','#C75C5C'],['ristretto','Ristretto','#222'],['forte','Forte','#5A3826'],['caramello','Caramello','#C99A63'],['nocciola','Nocciola','#E8A7B7'],['indonesia','Indonesia','#5C9FD6']].map(([id,name,color])=>({id,name,color}));const KEY='cc20web1',BOX=50;const empty=()=>Object.fromEntries(V.map(v=>[v.id,0]));const clone=x=>({...empty(),...(x||{})});const total=x=>Object.values(x||{}).reduce((a,b)=>a+Number(b||0),0);const add=(a,b)=>Object.fromEntries(V.map(v=>[v.id,(+a?.[v.id]||0)+(+b?.[v.id]||0)]));const iso=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};const fmt=s=>s?new Date(s+'T12:00:00').toLocaleDateString('es-AR'):'';function mon(s){let d=new Date(s+'T12:00:00'),n=d.getDay();d.setDate(d.getDate()+(n===0?-6:1-n));return d.toISOString().slice(0,10)}function day(s){if(!db.days[s])db.days[s]={date:s,prev:empty(),initial:empty(),add:empty(),rem:empty(),used:empty(),closed:false};return db.days[s]}function load(){try{return JSON.parse(localStorage.getItem(KEY))||{days:{},weeks:[],months:[],closedWeeks:[],closedMonths:[]}}catch{return{days:{},weeks:[],months:[],closedWeeks:[],closedMonths:[]}}}let db=load(); db.closedWeeks=db.closedWeeks||[]; db.closedMonths=db.closedMonths||[];function save(){localStorage.setItem(KEY,JSON.stringify(db));render()};function sumPeriod(fn){let o=empty();Object.values(db.days).forEach(d=>{if(fn(d))o=add(o,d.used)});return o}function today(){return day(iso())}function week(){return mon(iso())}function month(){return iso().slice(0,7)}function toast(x){let t=document.querySelector('#toast');t.textContent=x;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
const nav=[['previous','1 · Ayer'],['totals','2 · Totales'],['dispenser','3 · Dispenser'],['daily','4 · Cierre día'],['boxes','5 · Cajas'],['weekly','6 · Cierre semana'],['monthly','7 · Cierre mes'],['reports','8 · Informes']];document.querySelector('#nav').innerHTML=nav.map(x=>`<button data-s="${x[0]}">${x[1]}</button>`).join('');document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.querySelector('#'+b.dataset.s).classList.add('active');document.querySelectorAll('#nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
function prev(){let d=today();document.querySelector('#prevGrid').innerHTML=V.map(v=>`<div><div class="title"><i class="swatch" style="background:${v.color}"></i>${v.name}</div><label>Cápsulas usadas ayer</label><input type="number" min="0" data-prev="${v.id}" value="${d.prev[v.id]||0}"></div>`).join('')}function totalsView(){let t=clone(today().used),w=db.closedWeeks.includes(week())?empty():sumPeriod(d=>mon(d.date)===week()),m=db.closedMonths.includes(month())?empty():sumPeriod(d=>d.date.slice(0,7)===month());let box=(title,sub,c)=>`<div class="card"><h3>${title}</h3><span class="subtitle">${sub}</span><div class="big">${total(c)}</div>${V.map(v=>`<div class="row"><span><i class="swatch" style="background:${v.color}"></i> ${v.name}</span><b>${c[v.id]||0}</b></div>`).join('')}</div>`;document.querySelector('#totalsGrid').innerHTML=box('Hoy','Consumo actual',t)+box('Esta semana','Lunes a viernes',w)+box('Este mes','Acumulado mensual',m)}function disp(){let d=today();document.querySelector('#disp').innerHTML='<div class="tableWrap"><table><tr class="tableHead"><th>Variedad</th><th>Inicial</th><th>Agregadas</th></tr>'+V.map(v=>`<tr><td data-label="Variedad"><i class="swatch" style="background:${v.color}"></i> ${v.name}</td><td data-label="Inicial"><input data-i="${v.id}" type="number" min="0" value="${d.initial[v.id]||0}"></td><td data-label="Agregadas"><input data-a="${v.id}" type="number" min="0" value="${d.add[v.id]||0}"></td></tr>`).join('')+'</table></div>'}function closeView(){let d=today();document.querySelector('#close').innerHTML='<div class="tableWrap"><table><tr class="tableHead"><th>Variedad</th><th>Disponible</th><th>Restante</th></tr>'+V.map(v=>{let av=(+d.initial[v.id]||0)+(+d.add[v.id]||0),rem=+d.rem[v.id]||0;return `<tr><td data-label="Variedad"><i class="swatch" style="background:${v.color}"></i> ${v.name}</td><td data-label="Disponible">${av}</td><td data-label="Restante"><input data-r="${v.id}" type="number" min="0" value="${rem}"></td></tr>`}).join('')+'</table></div>';preview()}function preview(){let d=today(),u=empty();V.forEach(v=>{let av=(+d.initial[v.id]||0)+(+d.add[v.id]||0),r=+document.querySelector(`[data-r="${v.id}"]`)?.value||0;u[v.id]=Math.max(0,av-r)});document.querySelector('#preview').innerHTML='<b>Vista previa</b>'+V.map(v=>`<div class="row"><span><i class="swatch" style="background:${v.color}"></i> ${v.name}</span><b>${u[v.id]}</b></div>`).join('')+`<div class="row"><b>TOTAL</b><b>${total(u)}</b></div>`}function boxes(){let m=db.closedMonths.includes(month())?empty():sumPeriod(d=>d.date.slice(0,7)===month());document.querySelector('#boxesGrid').innerHTML='<div class="tableWrap"><table><tr class="tableHead"><th>Variedad</th><th>Cápsulas</th><th>% caja</th><th>Cajas completas</th><th>Sugerido</th></tr>'+V.map(v=>{let n=m[v.id]||0,p=n/BOX*100,full=Math.floor(n/BOX),suggest=n>=BOX*0.75?Math.ceil(n/BOX):0;return `<tr><td data-label="Variedad"><i class="swatch" style="background:${v.color}"></i> ${v.name}</td><td data-label="Cápsulas">${n}</td><td data-label="% caja">${p.toFixed(0)}%</td><td data-label="Cajas completas">${full}</td><td data-label="Sugerido"><b>${suggest}</b></td></tr>`}).join('')+'</table></div>'}function summary(c,title,sub){return `<b>${title}</b><p>${sub}</p>`+V.map(v=>`<div class="row"><span><i class="swatch" style="background:${v.color}"></i> ${v.name}</span><b>${c[v.id]||0}</b></div>`).join('')+`<div class="row"><b>TOTAL</b><b>${total(c)}</b></div>`}function closures(){document.querySelector('#weeklySummary').innerHTML=summary(db.closedWeeks.includes(week())?empty():sumPeriod(d=>mon(d.date)===week()),'Semana actual','Lunes a viernes');document.querySelector('#monthlySummary').innerHTML=summary(db.closedMonths.includes(month())?empty():sumPeriod(d=>d.date.slice(0,7)===month()),'Mes actual',month())}
function reports(){let rd=document.querySelector('#rDate');if(!rd.value)rd.value=iso();let ws=document.querySelector('#rWeek'),ms=document.querySelector('#rMonth');ws.innerHTML=db.weeks.length?db.weeks.slice().reverse().map(x=>{let e=new Date(x.start+'T12:00:00');e.setDate(e.getDate()+4);return `<option value="${x.start}">${fmt(x.start)} al ${fmt(e.toISOString().slice(0,10))}</option>`}).join(''):'<option value="">Sin cierres</option>';ms.innerHTML=db.months.length?db.months.slice().reverse().map(x=>`<option value="${x.month}">${x.month}</option>`).join(''):'<option value="">Sin cierres</option>';previewReport()}function previewReport(){let d=document.querySelector('#rDate').value,c=day(d).used;document.querySelector('#reportPreview').innerHTML='<div class="reportHead"><div><h3>Informe diario</h3><span>'+fmt(d)+'</span></div><b>'+total(c)+' cápsulas</b></div>'+tableReport(c)}function tableReport(c){return '<table><tr class="tableHead"><th>Variedad</th><th>Cápsulas</th></tr>'+V.map(v=>`<tr><td data-label="Variedad"><i class="swatch" style="background:${v.color}"></i> ${v.name}</td><td data-label="Cápsulas">${c[v.id]||0}</td></tr>`).join('')+'</table>'}
function pdfEscapeHex(text){
  let out='';
  for(const ch of String(text)){
    let cp=ch.codePointAt(0);
    if(cp>255){
      const map={'–':'-','—':'-','’':"'",'“':'"','”':'"','☕':'Cafe','á':'á','é':'é','í':'í','ó':'ó','ú':'ú','ñ':'ñ','Á':'Á','É':'É','Í':'Í','Ó':'Ó','Ú':'Ú','Ñ':'Ñ'};
      const replacement=map[ch]||'?';
      for(const r of replacement) out+=r.codePointAt(0).toString(16).padStart(2,'0');
    }else out+=cp.toString(16).padStart(2,'0');
  }
  return out.toUpperCase();
}
function makePDF(title,sub,c){
  const cmds=[];
  const text=(x,y,size,value,bold=false,color=[52,42,34])=>{
    cmds.push(`${color.map(n=>(n/255).toFixed(3)).join(' ')} rg`);
    cmds.push(`BT /${bold?'F2':'F1'} ${size} Tf ${x} ${y} Td <${pdfEscapeHex(value)}> Tj ET`);
  };
  const rect=(x,y,w,h,rgb)=>{
    cmds.push(`${rgb.map(n=>(n/255).toFixed(3)).join(' ')} rg ${x} ${y} ${w} ${h} re f`);
  };
  rect(0,0,595,842,[244,236,223]);
  text(56,785,22,'Control Café 2.0',true);
  text(56,755,15,title,true);
  text(56,735,10,sub);
  text(56,705,12,'Total: '+total(c)+' cápsulas',true);
  rect(56,670,483,24,[234,218,197]);
  text(78,678,10,'Variedad',true);
  text(380,678,10,'Cápsulas utilizadas',true);
  let y=648;
  V.forEach(v=>{
    if(y<60){cmds.push('');y=780;rect(0,0,595,842,[244,236,223]);}
    const hex=v.color.replace('#','');
    const rgb=[parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
    cmds.push(`${(rgb[0]/255).toFixed(3)} ${(rgb[1]/255).toFixed(3)} ${(rgb[2]/255).toFixed(3)} rg 62 ${y-2} 9 9 re f`);
    text(82,y,10,v.name);
    text(408,y,10,String(c[v.id]||0));
    y-=23;
  });
  const stream=cmds.join('\n')+'\n';
  const objects=[
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}endstream`
  ];
  let pdf='%PDF-1.4\n%âãÏÓ\n',offsets=[0];
  for(let i=0;i<objects.length;i++){offsets.push(new TextEncoder().encode(pdf).length);pdf+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}
  const xref=new TextEncoder().encode(pdf).length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<offsets.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:'application/pdf'});
}
async function pdf(title,sub,c,file,ask=true){
  if(ask && !window.confirm('¿Deseás generar y descargar el '+title.toLowerCase()+'?')) return;
  try{
    const blob=makePDF(title,sub,c);
    const pdfFile=new File([blob],file,{type:'application/pdf'});
    if(navigator.share && navigator.canShare && navigator.canShare({files:[pdfFile]})){
      try{await navigator.share({files:[pdfFile],title:title});toast('Informe listo para compartir o guardar')}
      catch(e){if(e.name!=='AbortError')window.alert('El PDF se generó, pero no se pudo abrir el menú para compartirlo. Intentá nuevamente.')}
      return;
    }
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)){
      const url=URL.createObjectURL(blob),opened=window.open(url,'_blank');
      if(!opened){const a=document.createElement('a');a.href=url;a.download=file;a.textContent='Abrir informe PDF';a.style.cssText='display:block;padding:18px;background:#fffaf2;color:#342a22;font-size:18px';document.body.prepend(a);window.alert('El informe está listo. Tocá “Abrir informe PDF” y luego usá Compartir para guardarlo en Archivos o enviarlo.')}
      else toast('PDF generado. Desde la vista previa podés guardarlo o compartirlo.');
      setTimeout(()=>URL.revokeObjectURL(url),60000);return;
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('PDF descargado correctamente');
  }catch(e){console.error(e);window.alert('No se pudo generar el PDF. Detalle: '+(e?.message||'error desconocido'))}
}
function render(){document.querySelector('#today').textContent=fmt(iso());prev();totalsView();disp();closeView();boxes();closures();reports();document.querySelectorAll('[data-r]').forEach(x=>x.oninput=preview)}
document.querySelector('#savePrev').onclick=()=>{let d=today();document.querySelectorAll('[data-prev]').forEach(i=>{d.prev[i.dataset.prev]=+i.value||0;d.used[i.dataset.prev]=+i.value||0});save();toast('Ingreso guardado')};document.querySelector('#saveDisp').onclick=()=>{let d=today();document.querySelectorAll('[data-i]').forEach(i=>d.initial[i.dataset.i]=+i.value||0);document.querySelectorAll('[data-a]').forEach(i=>d.add[i.dataset.a]=+i.value||0);save();toast('Dispenser guardado')};document.querySelector('#closeDay').onclick=()=>{let d=today();document.querySelectorAll('[data-r]').forEach(i=>d.rem[i.dataset.r]=+i.value||0);let u=empty();V.forEach(v=>u[v.id]=Math.max(0,(+d.initial[v.id]||0)+(+d.add[v.id]||0)-(+d.rem[v.id]||0)));d.used=add(d.prev,u);d.closed=true;save();toast('Día cerrado')};document.querySelector('#closeWeek').onclick=()=>{let k=week();if(db.weeks.some(x=>x.start===k)){toast('Semana ya cerrada');return}db.weeks.push({start:k,used:sumPeriod(d=>mon(d.date)===k)});db.closedWeeks.push(k);save();toast('Semana cerrada y contador reiniciado')};document.querySelector('#closeMonth').onclick=()=>{let m=month();if(db.months.some(x=>x.month===m)){toast('Mes ya cerrado');return}if(!window.confirm('¿Cerrar el mes y generar el informe mensual?'))return;let used=sumPeriod(d=>d.date.slice(0,7)===m);db.months.push({month:m,used});db.closedMonths.push(m);save();toast('Mes cerrado; contador mensual reiniciado');pdf('Informe mensual',m,used,'control-cafe-mensual-'+m+'.pdf',false)};document.querySelector('#rDate').onchange=previewReport;document.querySelector('#pdfDay').onclick=()=>{let d=document.querySelector('#rDate').value;pdf('Informe diario',fmt(d),day(d).used,`control-cafe-diario-${d}.pdf`)};document.querySelector('#pdfWeek').onclick=()=>{let k=document.querySelector('#rWeek').value,r=db.weeks.find(x=>x.start===k);if(!r){toast('Todavía no hay un cierre semanal para informar');return}let end=new Date(k+'T12:00:00');end.setDate(end.getDate()+4);let endISO=end.toISOString().slice(0,10);pdf('Informe semanal','Semana del '+fmt(k)+' al '+fmt(endISO),r.used,'control-cafe-semanal-'+k+'.pdf')};document.querySelector('#pdfMonth').onclick=()=>{let m=document.querySelector('#rMonth').value,r=db.months.find(x=>x.month===m);if(!r){toast('Todavía no hay un cierre mensual para informar');return}pdf('Informe mensual',m,r.used,`control-cafe-mensual-${m}.pdf`)};render();document.querySelector('#nav button').classList.add('active');
