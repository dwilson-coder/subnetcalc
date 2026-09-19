function ipToLong(ip){return ip.split('.').reduce((a,o)=>(a<<8)+parseInt(o),0)>>>0}
function longToIp(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.')}
function cidrToMask(c){return(c===0?0:(~0<<(32-c)))>>>0}
function bin32(n){return n.toString(2).padStart(32,'0')}
function fmtBin(b){return b.match(/.{1,8}/g).join('.')}
function hex4(n){return n.toString(16).padStart(4,'0')}
function maskToDotted(m){return longToIp(m)}
function wildcard(m){return(~m)>>>0}
function ipv4Mapped(ip){const p=ip.split('.');return'::ffff:'+hex4((+p[0]<<8)|+p[1])+':'+hex4((+p[2]<<8)|+p[3])}
function sixToFour(ip){const p=ip.split('.');return'2002:'+hex4((+p[0]<<8)|+p[1])+':'+hex4((+p[2]<<8)|+p[3])+'::/48'}

function calculate(){
  const errBox=document.getElementById('errorBox'),resBox=document.getElementById('results'),loadMsg=document.getElementById('loadingMsg');
  errBox.style.display='none';resBox.classList.add('hidden');resBox.innerHTML='';
  const ipRaw=document.getElementById('ipInput').value.trim(),cidrRaw=document.getElementById('cidrSelect').value;
  if(!ipRaw){showError('Please enter an IP address.');return}
  if(!cidrRaw){showError('Please select a CIDR prefix.');return}
  const ipParts=ipRaw.split('.');
  if(ipParts.length!==4||ipParts.some(p=>!/^[0-9]{1,3}$/.test(p)||+p>255)){showError('Invalid IPv4 address. Use format: 192.168.1.1');return}
  const cidr=parseInt(cidrRaw),ip=ipRaw,ipL=ipToLong(ip),mask=cidrToMask(cidr),wild=wildcard(mask);
  const network=(ipL&mask)>>>0,broadcast=(network|wild)>>>0,total=1<<(32-cidr);
  const usable=cidr>=31?(cidr===32?1:2):total-2;
  const first=cidr>=31?network:(network+1)>>>0,last=cidr>=31?broadcast:(broadcast-1)>>>0;
  const ipBin=bin32(ipL),maskBin=bin32(mask),netBin=bin32(network),brdBin=bin32(broadcast),wildBin=bin32(wild);
  const steps=[
    {title:'Convert IP & Mask to Binary',body:`IP:   ${fmtBin(ipBin)}<br>Mask: ${fmtBin(maskBin)}`},
    {title:'Bitwise AND → Network Address',body:`${fmtBin(ipBin)}<br><span class="op">AND</span>  ${fmtBin(maskBin)}<br>=    <span class="result">${fmtBin(netBin)}  →  ${longToIp(network)}</span>`},
    {title:'Invert Mask → Wildcard',body:`~${fmtBin(maskBin)}<br>=    <span class="result">${fmtBin(wildBin)}  →  ${maskToDotted(wild)}</span>`},
    {title:'Network OR Wildcard → Broadcast',body:`${fmtBin(netBin)}<br><span class="op">OR</span>   ${fmtBin(wildBin)}<br>=    <span class="result">${fmtBin(brdBin)}  →  ${longToIp(broadcast)}</span>`},
    {title:'Calculate Host Count',body:`Host bits = 32 − ${cidr} = <span class="result">${32-cidr}</span><br>Total addresses = 2^${32-cidr} = ${total.toLocaleString()}<br>Usable hosts = ${total.toLocaleString()} − 2 = <span class="result">${usable.toLocaleString()}</span><br>First host = <span class="result">${longToIp(first)}</span><br>Last host = <span class="result">${longToIp(last)}</span>`},
    {title:'IPv6 Mappings',body:`IPv4-mapped IPv6: <span class="result">${ipv4Mapped(ip)}</span><br>6to4 prefix: <span class="result">${sixToFour(ip)}</span>`}
  ];
  const stepsHTML=steps.map((s,i)=>`<div class="step-card"><div class="step-header"><div class="step-number">${i+1}</div><div class="step-title">${s.title}</div></div><div class="step-body">${s.body}</div></div>`).join('');
  resBox.innerHTML=`<div class="card"><h2>IPv4 Subnet Details</h2><div class="grid"><div class="field"><div class="label">IP Address</div><div class="value">${ip}</div></div><div class="field"><div class="label">CIDR Prefix</div><div class="value">/${cidr}</div></div><div class="field"><div class="label">Subnet Mask</div><div class="value">${maskToDotted(mask)}</div></div><div class="field"><div class="label">Wildcard Mask</div><div class="value">${maskToDotted(wild)}</div></div><div class="field"><div class="label">Network Address</div><div class="value highlight">${longToIp(network)}/${cidr}</div></div><div class="field"><div class="label">Broadcast Address</div><div class="value highlight">${longToIp(broadcast)}</div></div><div class="field"><div class="label">First Usable Host</div><div class="value">${longToIp(first)}</div></div><div class="field"><div class="label">Last Usable Host</div><div class="value">${longToIp(last)}</div></div><div class="field"><div class="label">Total Addresses</div><div class="value">${total.toLocaleString()}</div></div><div class="field"><div class="label">Usable Hosts</div><div class="value">${usable.toLocaleString()}</div></div></div></div><div class="card"><h2>IPv6 Related Addresses</h2><div class="grid"><div class="field"><div class="label">IPv4-Mapped IPv6</div><div class="value">${ipv4Mapped(ip)}</div></div><div class="field"><div class="label">6to4 Prefix</div><div class="value">${sixToFour(ip)}</div></div></div></div><div class="card"><h2>Calculation Steps</h2><div class="steps-wrapper">${stepsHTML}</div></div>`;
  loadMsg.classList.add('active');
  setTimeout(()=>{loadMsg.classList.remove('active');resBox.classList.remove('hidden');resBox.classList.add('results-anim')},300);
}
function clearInputs(){document.getElementById('ipInput').value='';document.getElementById('cidrSelect').value='';document.getElementById('errorBox').style.display='none';document.getElementById('loadingMsg').classList.remove('active');const r=document.getElementById('results');r.classList.add('hidden');r.classList.remove('results-anim');r.innerHTML='';document.getElementById('ipInput').focus()}
function showError(msg){const b=document.getElementById('errorBox');b.textContent=msg;b.style.display='block'}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.body.classList.contains('page-calculator'))calculate()});

const steps=[
  {node:'n-input',conn:null,pkt:'pkt1',dur:600},
  {node:'n-ipToLong',conn:'c1',pkt:'pkt1',dur:800},
  {node:'n-cidrToMask',conn:'c2',pkt:'pkt2',dur:800},
  {node:'n-wildcard',conn:'c3',pkt:'pkt2',dur:600},
  {node:'n-and',conn:'c4',pkt:'pkt1',dur:800},
  {node:'n-and',conn:'c5',pkt:'pkt2',dur:800},
  {node:'n-or',conn:'c6',pkt:'pkt1',dur:600},
  {node:'n-or',conn:'c7',pkt:'pkt2',dur:600},
  {node:'n-longToIp',conn:'c8',pkt:'pkt3',dur:800},
  {node:'n-bin32',conn:'c9',pkt:'pkt3',dur:800},
  {node:'n-hex4',conn:'c10',pkt:'pkt3',dur:800}
];
let playing=false;
function animatePacket(pktId,connId,dur){
  return new Promise(resolve=>{
    const pkt=document.getElementById(pktId),conn=document.getElementById(connId);
    if(!conn){resolve();return}
    const len=conn.getTotalLength(),start=performance.now();
    pkt.setAttribute('opacity','1');
    function tick(now){
      const t=Math.min((now-start)/dur,1);
      const eased=t<0.5?2*t*t:-1+(4-2*t)*t;
      const pt=conn.getPointAtLength(eased*len);
      pkt.setAttribute('cx',pt.x);pkt.setAttribute('cy',pt.y);
      if(t<1)requestAnimationFrame(tick);
      else{pkt.setAttribute('opacity','0');resolve()}
    }
    requestAnimationFrame(tick);
  });
}
function flashNode(id){const el=document.getElementById(id);el.classList.add('active');setTimeout(()=>el.classList.remove('active'),1200)}
async function play(){
  if(playing)return;playing=true;resetVisuals();
  for(const s of steps){
    flashNode(s.node);
    if(s.conn){
      const conn=document.getElementById(s.conn);
      conn.classList.add('active');
      await animatePacket(s.pkt,s.conn,s.dur);
      conn.classList.remove('active');
    }
    await new Promise(r=>setTimeout(r,200));
  }
  playing=false;
}
function resetVisuals(){
  document.querySelectorAll('.node-rect').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.connector').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.packet').forEach(p=>p.setAttribute('opacity','0'));
}
function reset(){playing=false;resetVisuals()}

function showTab(i) {
  document.querySelectorAll('.tab-btn').forEach((b, idx) => b.classList.toggle('active', idx === i));
  document.querySelectorAll('.tab-panel').forEach((p, idx) => p.classList.toggle('active', idx === i));
}
