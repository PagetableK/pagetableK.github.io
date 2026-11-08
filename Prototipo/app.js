/* Oink Control · Prototipo de alta fidelidad (Fase 3) · P.A.T.Y. Consulting
   HTML + CSS + JS puro. Datos de demostración guardados en localStorage. */
(function () {
'use strict';

/* ---------- utilidades ---------- */
const KEY = 'oink-proto-v1';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r2 = x => Math.round((x + Number.EPSILON) * 100) / 100;
const money = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const lb = n => r2(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' lb';
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const off = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const fdate = s => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
const fts = t => { const d = new Date(t); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const num = v => { if (v === undefined || v === null || String(v).trim() === '') return NaN; const n = Number(String(v).trim().replace(',', '.')); return isFinite(n) ? n : NaN; };
const sum = (a, k) => a.reduce((t, x) => t + (typeof k === 'function' ? k(x) : x[k] || 0), 0);

const RUBROS = { costo: 'Costo de venta', fijo: 'Gastos fijos', menor: 'Gastos menores u operativos', comision: 'Comisiones comerciales' };
const BR = { chal: 'Chalchuapa', sa1: 'Santa Ana Centro', sa2: 'Santa Ana Carnicería' };
const ROLES = { enc: 'Encargada/o de sucursal', ctl: 'Responsable del control de gastos', own: 'Dueño / Dirección General' };
const TIPOS = { repo: 'Reposición de caja chica', grande: 'Compra grande', extra: 'Gasto extraordinario', insumo: 'Solicitud de insumos' };
const DOC = { fcf: 'Factura de consumidor final', ccf: 'Comprobante de crédito fiscal', ninguno: 'Sin comprobante' };
const CAJA = { chal: { chica: 120, cambio: 80 }, sa1: { chica: 150, cambio: 100 }, sa2: { chica: 100, cambio: 60 } };
const UMBRAL_REPO = 70;

const IC = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', plus: 'M12 5v14M5 12h14',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M17 14h.01',
  check: 'M5 13l4 4L19 7', chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  users: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  scale: 'M12 3v18M5 7l7-3 7 3M5 7l-3 8a4 4 0 0 0 6 0zM19 7l-3 8a4 4 0 0 0 6 0z', file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6',
  cam: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  alert: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01', x: 'M18 6L6 18M6 6l12 12',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6', link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n] || ''}"/></svg>`;

/* ---------- datos de demostración ---------- */
function seed() {
  const G = (id, branch, rubro, monto, fecha, proveedor, desc, fuente, tipo, nrc, foto, by, extra) =>
    Object.assign({ id, branch, rubro, monto, fecha, proveedor, desc, fuente, tipo, nrc, foto, by, ts: new Date(fecha + 'T10:30:00').getTime(), motivo: '', rev: false, repuesto: false, reqId: null }, extra || {});
  return {
    session: null, view: null, nextId: 100,
    users: [
      { id: 'enc', name: 'Rosa Menjívar', role: 'enc', branch: 'chal', email: 'rosa@oink.sv', pass: 'oink123', activo: true },
      { id: 'ctl', name: 'Daniel Portillo', role: 'ctl', branch: null, email: 'control@oink.sv', pass: 'oink123', activo: true },
      { id: 'own', name: 'Dirección General', role: 'own', branch: null, email: 'direccion@oink.sv', pass: 'oink123', activo: true },
      { id: 'enc2', name: 'Elmer Cruz', role: 'enc', branch: 'sa1', email: 'elmer@oink.sv', pass: 'oink123', activo: true },
      { id: 'enc3', name: 'Karla Beltrán', role: 'enc', branch: 'sa2', email: 'karla@oink.sv', pass: 'oink123', activo: true }
    ],
    gastos: [
      G(1, 'chal', 'menor', 18.5, off(-5), 'Gas Express', 'Cilindro de gas 25 lb', 'caja', 'fcf', true, 'seed', 'enc'),
      G(2, 'chal', 'menor', 12, off(-3), 'Distribuidora La Fuente', 'Bolsas térmicas para despacho', 'caja', 'ccf', true, 'seed', 'enc'),
      G(3, 'chal', 'menor', 9.75, off(-1), 'Ferretería Don Beto', 'Cloro y desengrasante', 'caja', 'fcf', true, 'seed', 'enc'),
      G(4, 'sa1', 'menor', 30, off(-6), 'Gas Express', 'Dos cilindros de gas', 'caja', 'fcf', true, 'seed', 'enc2', { repuesto: false, reqId: 'R1' }),
      G(5, 'sa1', 'menor', 25, off(-5), 'Papelería El Sol', 'Papel para despacho', 'caja', 'ccf', true, 'seed', 'enc2', { reqId: 'R1' }),
      G(6, 'sa1', 'menor', 20, off(-4), 'Hielo Santa Ana', 'Hielo para refrigerador', 'caja', 'ninguno', false, null, 'enc2', { reqId: 'R1' }),
      G(7, 'sa1', 'menor', 18, off(-3), 'Ferretería Don Beto', 'Desengrasante industrial', 'caja', 'fcf', true, 'seed', 'enc2', { reqId: 'R1' }),
      G(8, 'sa1', 'menor', 12, off(-2), 'Distribuidora La Fuente', 'Bolsas térmicas', 'caja', 'fcf', true, 'seed', 'enc2', { reqId: 'R1' }),
      G(9, 'sa2', 'menor', 22, off(-4), 'Gas Express', 'Cilindro de gas', 'caja', 'fcf', true, 'seed', 'enc3'),
      G(10, 'sa2', 'menor', 15, off(-2), 'Papelería El Sol', 'Papel y bolsas', 'caja', 'ccf', true, 'seed', 'enc3'),
      G(11, 'sa2', 'menor', 8, off(-1), 'Tienda La Esperanza', 'Hielo (se agotó la caja chica)', 'ventas', 'fcf', false, 'seed', 'enc3', { motivo: 'Caja chica agotada y la vitrina se quedaba sin hielo.' })
    ],
    base: { chal: { costo: 1460, fijo: 980, menor: 150, comision: 120 }, sa1: { costo: 2650, fijo: 1500, menor: 295, comision: 540 }, sa2: { costo: 1900, fijo: 1100, menor: 150, comision: 95 } },
    presup: { chal: { costo: 1800, fijo: 1200, menor: 300, comision: 250 }, sa1: { costo: 3200, fijo: 1800, menor: 420, comision: 520 }, sa2: { costo: 2600, fijo: 1500, menor: 330, comision: 150 } },
    umbral: 80,
    solicitudes: [
      { id: 'R1', tipo: 'repo', branch: 'sa1', by: 'enc2', monto: 105, desc: 'Reposición de caja chica (70 % liquidado)', items: [4, 5, 6, 7, 8], estado: 'pendiente', hist: [{ ts: Date.now() - 86400000, who: 'Elmer Cruz', estado: 'Enviada', c: '' }] },
      { id: 'R2', tipo: 'grande', branch: 'sa1', by: 'enc2', monto: 650, desc: 'Congelador horizontal para la vitrina', just: 'El actual pierde frío y se echó a perder producto la semana pasada.', items: [], estado: 'pendiente', hist: [{ ts: Date.now() - 7200000, who: 'Elmer Cruz', estado: 'Enviada', c: '' }] },
      { id: 'R3', tipo: 'insumo', branch: 'sa2', by: 'enc3', monto: 0, desc: 'Bolsas térmicas · 500 unidades', items: [], estado: 'enviada', hist: [{ ts: Date.now() - 20000000, who: 'Karla Beltrán', estado: 'Enviada', c: '' }] },
      { id: 'R4', tipo: 'extra', branch: 'sa2', by: 'enc3', monto: 120, desc: 'Reparación de cámara fría', just: 'Falla del compresor.', items: [], estado: 'rechazada', hist: [{ ts: Date.now() - 400000000, who: 'Karla Beltrán', estado: 'Enviada', c: '' }, { ts: Date.now() - 380000000, who: 'Dirección General', estado: 'Rechazada', c: 'Cotizar con otro proveedor antes de aprobar.' }] }
    ],
    notifs: [
      { id: 1, to: 'own', ts: Date.now() - 7200000, txt: 'Nueva solicitud de compra grande en Santa Ana Centro ($650.00).', read: false },
      { id: 2, to: 'own', ts: Date.now() - 86400000, txt: 'Solicitud de reposición de caja chica en Santa Ana Centro.', read: false },
      { id: 3, to: 'ctl', ts: Date.now() - 86000000, txt: 'Excepción RN-07: uso de efectivo de ventas en Santa Ana Carnicería ($8.00).', read: false },
      { id: 4, to: 'ctl', ts: Date.now() - 300000000, txt: 'Gasto incompleto en Santa Ana Centro: falta comprobante ($20.00).', read: false }
    ],
    cuadro: {},
    historial: [
      { fecha: off(-3), branch: 'chal', dUsd: -1.5, dLb: -0.1, flag: false },
      { fecha: off(-2), branch: 'chal', dUsd: -6.25, dLb: -0.4, flag: true },
      { fecha: off(-2), branch: 'sa1', dUsd: 0, dLb: 0.2, flag: false },
      { fecha: off(-1), branch: 'sa2', dUsd: -2, dLb: -0.7, flag: true },
      { fecha: off(-1), branch: 'sa1', dUsd: 1.1, dLb: 0, flag: false }
    ],
    perdidas: [{ branch: 'chal', fecha: off(-2), prod: 'Chicharrón de lomo' }]
  };
}
let S = load();
function load() { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) { } return seed(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
const ui = { d: {}, errs: {}, step: 1, foto: null, fotoFix: null, filter: 'todos', tab: {}, confirm: null };

/* ---------- reglas de negocio / cálculos ---------- */
const me = () => S.users.find(u => u.id === S.session && u.activo);
const nid = () => S.nextId++;
const incompleto = g => g.fuente !== 'admin' && (!g.foto || g.tipo === 'ninguno' || !g.nrc);
function caja(b) {
  const asig = CAJA[b].chica;
  const usados = S.gastos.filter(g => g.branch === b && g.fuente === 'caja' && !g.repuesto);
  const gasto = r2(sum(usados, 'monto'));
  return { asig, gasto, saldo: r2(asig - gasto), pct: Math.min(100, (gasto / asig) * 100), usados };
}
const real = (b, r) => r2((S.base[b][r] || 0) + sum(S.gastos.filter(g => g.branch === b && g.rubro === r), 'monto'));
const estadoPres = (re, pr) => { if (pr <= 0) return re > 0 ? ['bad', 'Sin presupuesto'] : ['', 'Sin datos']; const p = re / pr * 100; return p > 100 ? ['bad', 'Excedido'] : p >= S.umbral ? ['warn', 'Cerca del límite'] : ['ok', 'Dentro del presupuesto']; };
function notify(to, txt) { S.notifs.unshift({ id: nid(), to, ts: Date.now(), txt, read: false }); }
const visibleBranches = () => { const u = me(); return u.role === 'enc' ? [u.branch] : Object.keys(BR); };
const pendientesRepo = b => S.solicitudes.some(r => r.branch === b && r.tipo === 'repo' && r.estado === 'pendiente');

/* ---------- UI helpers ---------- */
function toast(title, msg, kind) {
  const t = document.createElement('div');
  t.className = 'toast ' + (kind || '');
  t.innerHTML = `<b>${esc(title)}</b>${msg ? esc(msg) : ''}`;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 5200);
}
function openModal(html) { const m = $('#modal'); m.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`; m.hidden = false; }
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; ui.confirm = null; }
const head = (code, title, sub, trace) => `<div class="phead"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><span class="trace" title="Trazabilidad con la Fase 2">${code} · ${trace}</span></div>`;
const alertBox = (kind, title, body, icon) => `<div class="alert ${kind}">${ic(icon || 'alert')}<div><b>${title}</b>${body || ''}</div></div>`;
const field = (label, name, inner, hint, err) => `<div class="field ${err ? 'has-err' : ''}"><label for="${name}">${label}</label>${inner}${hint ? `<small class="hint">${hint}</small>` : ''}${err ? `<small class="err" role="alert">${esc(err)}</small>` : ''}</div>`;
const input = (name, type, val, extra) => `<input id="${name}" name="${name}" type="${type}" value="${esc(val ?? '')}" ${extra || ''}>`;
const select = (name, opts, val, extra) => `<select id="${name}" name="${name}" ${extra || ''}>${Object.entries(opts).map(([k, v]) => `<option value="${k}" ${k === val ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>`;
const meter = (pct, cls, mark) => `<div class="meter"><span class="${cls || ''}" style="width:${pct}%"></span>${mark ? `<i style="left:${mark}%" title="Umbral de reposición ${mark} %"></i>` : ''}</div>`;
const barCls = p => p > 100 ? 'bad' : p >= S.umbral ? 'warn' : '';
const E = f => ui.errs[f] || {};

function receipt(g) {
  if (g.foto && g.foto !== 'seed') return `<img class="preview" src="${g.foto}" alt="Foto del comprobante">`;
  if (g.foto === 'seed') return `<div class="receipt"><b>${esc(g.proveedor).toUpperCase()}</b><br>${DOC[g.tipo] || 'Comprobante'}<hr>${esc(g.desc)}<br><br>TOTAL ${money(g.monto)}<hr>${g.nrc ? 'NRC Oink: 123456-7' : 'NRC: no visible'}<br>${fdate(g.fecha)}</div>`;
  return `<div class="empty">${ic('file')}<p>Sin comprobante adjunto</p></div>`;
}
function estadoChip(g) {
  const c = [];
  if (g.fuente === 'ventas') c.push('<span class="chip bad">Excepción RN-07</span>');
  if (g.fuente === 'admin') c.push('<span class="chip info">Administración</span>');
  c.push(incompleto(g) ? '<span class="chip warn">Incompleto</span>' : '<span class="chip ok">Completo</span>');
  if (g.repuesto) c.push('<span class="chip">Repuesto</span>'); else if (g.reqId) c.push('<span class="chip pink">En reposición</span>');
  return c.join(' ');
}
const histHtml = r => `<div class="timeline">${r.hist.map(h => `<div><b>${esc(h.estado)}</b> · ${esc(h.who)} · <span class="muted">${fts(h.ts)}</span>${h.c ? `<br><i>“${esc(h.c)}”</i>` : ''}</div>`).join('')}</div>`;
const solChip = r => ({ pendiente: '<span class="chip warn">Pendiente</span>', aprobada: '<span class="chip ok">Aprobada</span>', rechazada: '<span class="chip bad">Rechazada</span>', enviada: '<span class="chip info">Enviada</span>', atendida: '<span class="chip ok">Atendida</span>' }[r.estado]);

/* comprime la imagen del comprobante antes de guardarla (RNF-08) */
function processImage(file, cb) {
  if (!file) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return cb('Formato no permitido. Adjunta una foto JPG, PNG o WEBP del comprobante.');
  if (file.size > 10 * 1024 * 1024) return cb('La foto supera los 10 MB. Toma otra con menor resolución.');
  const rd = new FileReader();
  rd.onerror = () => cb('No se pudo leer el archivo.');
  rd.onload = () => {
    const im = new Image();
    im.onerror = () => cb('La imagen está dañada o no se puede abrir.');
    im.onload = () => {
      const k = Math.min(1, 900 / Math.max(im.width, im.height));
      const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      cb(null, c.toDataURL('image/jpeg', 0.6));
    };
    im.src = rd.result;
  };
  rd.readAsDataURL(file);
}

/* ---------- navegación ---------- */
const NAV = {
  enc: [['home', 'Inicio', 'home'], ['gasto', 'Nuevo gasto', 'plus'], ['gastos', 'Mis gastos', 'list'], ['repo', 'Reposición', 'wallet'], ['sol', 'Solicitudes', 'inbox'], ['cuadro', 'Cuadro', 'scale']],
  ctl: [['tablero', 'Tablero', 'chart'], ['revision', 'Revisión', 'shield'], ['fijos', 'Gastos fijos', 'file'], ['sol', 'Insumos', 'inbox'], ['cuadro', 'Diferencias', 'scale']],
  own: [['bandeja', 'Aprobaciones', 'check'], ['tablero', 'Tablero', 'chart'], ['presup', 'Presupuestos', 'sliders'], ['cuadro', 'Diferencias', 'scale'], ['usuarios', 'Usuarios', 'users']]
};
function go(v) { S.view = v; ui.errs = {}; if (v !== 'gasto') { ui.step = 1; } save(); render(); window.scrollTo(0, 0); }

function render() {
  const app = $('#app'); const u = me();
  if (!u) { S.session = null; app.innerHTML = viewLogin(); return; }
  const nav = NAV[u.role];
  if (!S.view || (!nav.some(n => n[0] === S.view) && S.view !== 'traza')) S.view = nav[0][0];
  const unread = S.notifs.filter(n => (n.to === u.id || n.to === u.role) && !n.read).length;
  const ctx = u.role === 'enc' ? 'Sucursal ' + BR[u.branch] : 'Todas las sucursales';
  app.innerHTML = `<div class="shell">
    <aside class="side"><div class="brand"><div class="logo">O</div><div><b>Oink Control</b><span>P.A.T.Y. Consulting</span></div></div>
      ${nav.map(n => `<button class="nav ${S.view === n[0] ? 'on' : ''}" data-act="go" data-v="${n[0]}">${ic(n[2])}${n[1]}</button>`).join('')}
      <div class="sp"></div>
      <button class="nav ${S.view === 'traza' ? 'on' : ''}" data-act="go" data-v="traza">${ic('link')}Trazabilidad</button>
      <div class="who"><b>${esc(u.name)}</b><small>${ROLES[u.role]}</small></div>
      <button class="nav" data-act="logout">${ic('out')}Cerrar sesión</button></aside>
    <div class="main"><header class="top"><div><b>${esc(u.name)}</b><div class="ctx">${ROLES[u.role]} · ${ctx}</div></div>
      <div class="row"><button class="icbtn" data-act="notifs" aria-label="Notificaciones">${ic('bell')}${unread ? `<span class="dot">${unread}</span>` : ''}</button><button class="icbtn" data-act="logout" aria-label="Cerrar sesión">${ic('out')}</button></div></header>
      <main id="content">${VIEWS[S.view]()}</main></div>
    <nav class="bottom">${nav.map(n => `<button class="${S.view === n[0] ? 'on' : ''}" data-act="go" data-v="${n[0]}">${ic(n[2])}<span>${n[1]}</span></button>`).join('')}</nav></div>`;
}

/* ---------- Login (RNF-13, RNF-16) ---------- */
function viewLogin() {
  const e = E('login');
  return `<div class="login"><section class="art"><div><div class="row"><div class="logo">O</div><b style="font-size:1.2rem">Oink Control</b></div>
    <h1>Cada gasto, con su comprobante y a tiempo.</h1><p>Prototipo de alta fidelidad para el control de gastos, caja chica y presupuestos de Oink Chicharrones.</p>
    <ul><li>Registro en el momento, desde el celular</li><li>Comprobante adjunto a cada gasto</li><li>Aprobaciones con historial</li><li>Presupuesto por sucursal y rubro</li></ul></div>
    <small>P.A.T.Y. Consulting · ESEN · Requerimientos y Prototipado · Fase 3</small></section>
    <section class="box"><h2 style="font-size:1.5rem">Iniciar sesión</h2><p class="muted">Cada persona usa su usuario propio; no hay cuentas compartidas.</p>
    <form data-form="login" novalidate class="mt">
      ${field('Correo', 'email', input('email', 'email', ui.d.login?.email || '', 'autocomplete="username" placeholder="nombre@oink.sv"'), '', e.email)}
      ${field('Contraseña', 'pass', input('pass', 'password', '', 'autocomplete="current-password"'), '', e.pass)}
      ${e.general ? `<p class="err" role="alert">${esc(e.general)}</p>` : ''}
      <button class="btn primary block" type="submit">Entrar</button></form>
    <div class="mt"><p class="small muted">Accesos de demostración (contraseña <b>oink123</b>):</p><div class="demo">
      <button class="btn" data-act="demo" data-u="rosa@oink.sv"><span>Rosa Menjívar · Encargada</span><span class="chip pink">Chalchuapa</span></button>
      <button class="btn" data-act="demo" data-u="control@oink.sv"><span>Daniel Portillo · Control de gastos</span><span class="chip info">Consolidado</span></button>
      <button class="btn" data-act="demo" data-u="direccion@oink.sv"><span>Dirección General · Dueño</span><span class="chip ok">Aprueba</span></button></div>
    <p class="small muted mt2">Por seguridad, la sesión se cierra tras 10 minutos sin actividad.</p></div></section></div>`;
}

const VIEWS = {};

/* ---------- Inicio encargada · F3-P03 ---------- */
VIEWS.home = () => {
  const u = me(); const c = caja(u.branch); const cls = c.pct >= UMBRAL_REPO ? 'warn' : '';
  const inc = S.gastos.filter(g => g.branch === u.branch && incompleto(g)).length;
  const ult = S.gastos.filter(g => g.branch === u.branch).slice().sort((a, b) => b.ts - a.ts).slice(0, 5);
  const pr = S.presup[u.branch].menor, re = real(u.branch, 'menor'); const [pc, pl] = estadoPres(re, pr);
  const reqs = S.solicitudes.filter(r => r.branch === u.branch).slice(0, 3);
  return head('F3-P03', `Hola, ${esc(u.name.split(' ')[0])}`, `Sucursal ${BR[u.branch]} · ${fdate(today())}`, 'HU-03 · RF-16 · RN-08, RN-10') +
    (c.pct >= UMBRAL_REPO ? alertBox('warn', `Liquidaste el ${Math.round(c.pct)} % de tu caja chica`, `Ya puedes solicitar la reposición (regla del 70 %). <button class="link" data-act="go" data-v="repo">Solicitar reposición</button>`) : '') +
    (inc ? alertBox('bad', `${inc} gasto${inc > 1 ? 's' : ''} sin comprobante completo`, `Falta la foto o el NRC de la empresa. <button class="link" data-act="go" data-v="gastos" data-f="incompleto">Revisar ahora</button>`) : '') +
    `<div class="grid g2"><div class="card hero kpi"><div class="l">Saldo de caja chica</div><div class="v">${money(c.saldo)}</div>
      ${meter(c.pct, cls, UMBRAL_REPO)}<div class="row between small"><span>Gastado ${money(c.gasto)} de ${money(c.asig)} (quincenal)</span><span>${Math.round(c.pct)} %</span></div></div>
      <div class="card kpi"><div class="l">Fondo de cambio</div><div class="v">${money(CAJA[u.branch].cambio)}</div><p class="muted small">Solo para dar vuelto; debe mantenerse intacto día con día (RN-08). No se mezcla con la caja chica.</p><span class="chip ok">Intacto</span></div></div>
    <div class="grid g2 mt"><div class="card"><div class="row between"><h2>Últimos movimientos</h2><button class="btn sm" data-act="go" data-v="gasto">${ic('plus')}Nuevo gasto</button></div>
      <div class="list">${ult.map(g => `<div class="item"><div class="ico">${ic('file')}</div><div class="grow"><b>${esc(g.proveedor)}</b><div class="small muted">${esc(g.desc)} · ${fdate(g.fecha)}</div></div><div class="right"><b>${money(g.monto)}</b><div>${incompleto(g) ? '<span class="chip warn">Incompleto</span>' : '<span class="chip ok">Completo</span>'}</div></div></div>`).join('')}</div></div>
    <div class="grid"><div class="card"><h2>Presupuesto de gastos menores</h2><div class="row between"><b>${money(re)} <span class="muted small">de ${money(pr)}</span></b><span class="chip ${pc}">${pl}</span></div>
      <div class="bar"><span class="${barCls(re / pr * 100)}" style="width:${Math.min(100, re / pr * 100)}%"></span></div></div>
      <div class="card"><h2>Mis solicitudes</h2>${reqs.length ? reqs.map(r => `<div class="item"><div class="grow"><b>${TIPOS[r.tipo]}</b><div class="small muted">${esc(r.desc)}</div></div>${solChip(r)}</div>`).join('') : '<p class="muted">Aún no tienes solicitudes.</p>'}</div></div></div>`;
};

/* ---------- Nuevo gasto · F3-P01, P02, P04 ---------- */
VIEWS.gasto = () => {
  const u = me(); const d = ui.d.gasto || (ui.d.gasto = { fecha: today(), fuente: 'caja', rubro: 'menor' }); const e = E('gasto'); const c = caja(u.branch);
  const steps = `<div class="stepper"><div class="${ui.step === 1 ? 'on' : 'done'}">1. Datos del gasto</div><div class="${ui.step === 2 ? 'on' : ''}">2. Comprobante</div></div>`;
  const hd = head('F3-P01 · F3-P02 · F3-P04', 'Registrar gasto', 'Anótalo en el momento; queda guardado con tu usuario, fecha y hora.', 'HU-01 · HU-02 · HU-04 · RF-12 a RF-15, RF-17');
  if (ui.step === 1) {
    return hd + steps + `<form class="card" data-form="gasto1" novalidate><div class="formgrid">
      ${field('Monto (USD)', 'monto', input('monto', 'text', d.monto, 'inputmode="decimal" placeholder="0.00"'), `Saldo disponible en caja chica: ${money(c.saldo)}`, e.monto)}
      ${field('Fecha del gasto', 'fecha', input('fecha', 'date', d.fecha, `max="${today()}"`), '', e.fecha)}
      ${field('Proveedor', 'proveedor', input('proveedor', 'text', d.proveedor, 'placeholder="Ej. Gas Express"'), '', e.proveedor)}
      ${field('Rubro', 'rubro', select('rubro', { menor: RUBROS.menor, costo: RUBROS.costo }, d.rubro), 'Los gastos fijos y las comisiones los registra administración.', e.rubro)}
      <div class="full">${field('Descripción', 'desc', input('desc', 'text', d.desc, 'placeholder="Ej. Cilindro de gas 25 lb"'), '', e.desc)}</div>
      <div class="full"><div class="lbl">¿De dónde sale el dinero?</div><div class="radio mt2">
        <label><input type="radio" name="fuente" value="caja" data-rerender ${d.fuente === 'caja' ? 'checked' : ''}><span>Caja chica<small>Es lo correcto (RN-09)</small></span></label>
        <label><input type="radio" name="fuente" value="ventas" data-rerender ${d.fuente === 'ventas' ? 'checked' : ''}><span>Efectivo de ventas<small>Prohibido; solo como excepción</small></span></label></div></div>
      ${d.fuente === 'ventas' ? `<div class="full mt">${alertBox('bad', 'Estás registrando una excepción a la regla RN-07', 'Usar el efectivo de las ventas del día para gastos está prohibido. El sistema no lo permite como práctica normal: lo registra como excepción, exige el motivo y avisa a control.')}${field('Motivo de la excepción', 'motivo', `<textarea id="motivo" name="motivo" placeholder="Explica por qué fue necesario usar el efectivo de ventas">${esc(d.motivo || '')}</textarea>`, '', e.motivo)}</div>` : ''}
      </div><div class="row between mt"><button type="button" class="btn" data-act="go" data-v="home">Cancelar</button><button class="btn primary" type="submit">Continuar al comprobante</button></div></form>`;
  }
  const t = d.tipo || 'fcf';
  return hd + steps + `<form class="card" data-form="gasto2" novalidate>
    <div class="row between"><div><b>${esc(d.proveedor)}</b> · ${money(num(d.monto))}<div class="small muted">${esc(d.desc)} · ${RUBROS[d.rubro]}</div></div><button type="button" class="link" data-act="step1">Editar datos</button></div><hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
    ${field('Tipo de comprobante', 'tipo', select('tipo', DOC, t), 'Se acepta factura de consumidor final o comprobante de crédito fiscal (RN-09).', e.tipo)}
    <div class="field"><label class="check"><input type="checkbox" name="nrc" ${d.nrc ? 'checked' : ''}><span>El comprobante muestra el <b>NRC de la empresa</b></span></label></div>
    <div class="field ${e.foto ? 'has-err' : ''}"><div class="lbl">Foto del comprobante</div>
      <label class="drop">${ic('cam')}<div><b>${ui.foto ? 'Cambiar foto' : 'Tomar o subir foto'}</b></div><div class="small muted">JPG, PNG o WEBP · hasta 10 MB · se comprime antes de guardar</div><input type="file" accept="image/*" capture="environment" id="foto"></label>
      ${ui.foto ? `<img class="preview" src="${ui.foto}" alt="Vista previa del comprobante">` : ''}${e.foto ? `<small class="err" role="alert">${esc(e.foto)}</small>` : ''}</div>
    ${alertBox('info', 'Si falta el comprobante o el NRC, el gasto se guarda como incompleto', 'No se pierde el registro, pero se avisa al responsable del control (RF-15).', 'alert')}
    <div class="row between"><button type="button" class="btn" data-act="step1">Atrás</button><button class="btn primary" type="submit">Guardar gasto</button></div></form>`;
};

function saveGasto() {
  const u = me(); const d = ui.d.gasto;
  const g = { id: nid(), branch: u.branch, rubro: d.rubro, monto: r2(num(d.monto)), fecha: d.fecha, proveedor: d.proveedor.trim(), desc: d.desc.trim(), fuente: d.fuente, tipo: d.tipo || 'fcf', nrc: !!d.nrc, foto: ui.foto, by: u.id, ts: Date.now(), motivo: (d.motivo || '').trim(), rev: false, repuesto: false, reqId: null };
  const antes = caja(u.branch).pct; S.gastos.push(g); const des = caja(u.branch);
  if (incompleto(g)) notify('ctl', `Gasto incompleto en ${BR[u.branch]}: ${g.tipo === 'ninguno' || !g.foto ? 'falta comprobante' : 'falta NRC'} (${money(g.monto)}).`);
  if (g.fuente === 'ventas') notify('ctl', `Excepción RN-07: uso de efectivo de ventas en ${BR[u.branch]} (${money(g.monto)}). Motivo: ${g.motivo}`);
  ui.d.gasto = null; ui.foto = null; ui.step = 1; S.view = 'gastos'; ui.filter = 'todos'; save(); closeModal(); render(); window.scrollTo(0, 0);
  toast('Gasto guardado', `${money(g.monto)} · ${esc(g.proveedor)}${incompleto(g) ? ' (marcado como incompleto)' : ''}`, incompleto(g) ? 'warn' : '');
  if (g.fuente === 'caja' && antes < UMBRAL_REPO && des.pct >= UMBRAL_REPO) { notify(u.id, 'Liquidaste el 70 % de la caja chica: ya puedes solicitar la reposición.'); toast('Alerta de reposición', 'Llegaste al 70 % de la caja chica. Ya puedes solicitar la reposición.', 'warn'); }
}

/* ---------- Mis gastos ---------- */
VIEWS.gastos = () => {
  const u = me(); let l = S.gastos.filter(g => g.branch === u.branch).sort((a, b) => b.ts - a.ts);
  const all = l.length;
  if (ui.filter === 'incompleto') l = l.filter(incompleto); else if (ui.filter === 'pend') l = l.filter(g => g.fuente === 'caja' && !g.repuesto);
  const tab = (k, t) => `<button class="tab ${ui.filter === k ? 'on' : ''}" data-act="filter" data-f="${k}">${t}</button>`;
  return head('F3-P02', 'Mis gastos', `${all} registros en ${BR[u.branch]}`, 'HU-02 · RF-14, RF-15') + `<div class="tabs">${tab('todos', 'Todos')}${tab('incompleto', 'Incompletos')}${tab('pend', 'Por reponer')}</div>
    <div class="card"><div class="tw"><table><thead><tr><th>Fecha</th><th>Proveedor</th><th>Rubro</th><th class="num">Monto</th><th>Estado</th></tr></thead><tbody>
    ${l.map(g => `<tr class="clk" data-act="gasto-det" data-id="${g.id}"><td>${fdate(g.fecha)}</td><td><b>${esc(g.proveedor)}</b><div class="small muted">${esc(g.desc)}</div></td><td>${RUBROS[g.rubro]}</td><td class="num">${money(g.monto)}</td><td>${estadoChip(g)}</td></tr>`).join('') || `<tr><td colspan="5" class="empty">No hay gastos con este filtro.</td></tr>`}
    </tbody></table></div></div>`;
};
function gastoModal(id) {
  const g = S.gastos.find(x => x.id === id); if (!g) return; const u = me(); const by = S.users.find(x => x.id === g.by);
  const canFix = u.role === 'enc' && incompleto(g) && !g.repuesto && g.fuente !== 'admin';
  ui.fotoFix = null;
  openModal(`<h2>${esc(g.proveedor)} · ${money(g.monto)}</h2><p>${estadoChip(g)}</p>
    <p class="small muted">${esc(g.desc)}<br>${RUBROS[g.rubro]} · ${g.fuente === 'caja' ? 'Caja chica' : g.fuente === 'ventas' ? 'Efectivo de ventas (excepción)' : 'Administración'} · Gasto del ${fdate(g.fecha)}<br>Registrado por ${esc(by ? by.name : 'Administración')} el ${fts(g.ts)}</p>
    ${g.motivo ? `<p class="small"><b>Motivo:</b> ${esc(g.motivo)}</p>` : ''}${receipt(g)}
    ${canFix ? `<form data-form="fix" data-id="${g.id}" novalidate><hr style="border:0;border-top:1px solid var(--line)"><h3>Completar comprobante</h3>
      <div class="field mt2">${select('tipo', DOC, g.tipo === 'ninguno' ? 'fcf' : g.tipo)}</div>
      <div class="field"><label class="check"><input type="checkbox" name="nrc" ${g.nrc ? 'checked' : ''}><span>El comprobante muestra el NRC de la empresa</span></label></div>
      <div class="field"><label class="drop">${ic('cam')}<b>Adjuntar foto</b><input type="file" accept="image/*" id="fotofix"></label><div id="fixprev"></div><small class="err" id="fixerr" role="alert"></small></div>
      <div class="acts"><button type="button" class="btn" data-act="close">Cerrar</button><button class="btn primary" type="submit">Guardar comprobante</button></div></form>` : `<div class="acts"><button class="btn" data-act="close">Cerrar</button></div>`}`);
}

/* ---------- Reposición · F3-P08 ---------- */
VIEWS.repo = () => {
  const u = me(); const c = caja(u.branch); const habil = c.pct >= UMBRAL_REPO; const pend = pendientesRepo(u.branch);
  const items = c.usados.filter(g => !g.reqId); const inc = items.filter(incompleto).length;
  const hist = S.solicitudes.filter(r => r.branch === u.branch && r.tipo === 'repo').reverse();
  return head('F3-P08', 'Reposición de caja chica', 'La reposición se solicita al liquidar el 70 % del fondo y la aprueba la Dirección General.', 'HU-08 · RF-24 · RN-10') +
    `<div class="grid g2"><div class="card"><div class="row between"><h2>Estado del fondo</h2><span class="chip ${habil ? 'warn' : 'ok'}">${habil ? 'Reposición disponible' : 'Aún no aplica'}</span></div>
      <div class="kpi"><div class="v">${money(c.saldo)}</div><div class="l">saldo disponible</div></div>${meter(c.pct, habil ? 'warn' : '', UMBRAL_REPO)}
      <p class="small muted">Liquidado ${Math.round(c.pct)} % · ${habil ? 'ya superaste el umbral.' : `faltan ${money(r2(c.asig * UMBRAL_REPO / 100 - c.gasto))} para llegar al 70 %.`}</p></div>
    <div class="card"><h2>Gastos que respaldan la solicitud</h2>${items.length ? `<div class="list">${items.map(g => `<div class="item"><div class="grow"><b>${esc(g.proveedor)}</b><div class="small muted">${esc(g.desc)} · ${fdate(g.fecha)}</div></div><div class="right"><b>${money(g.monto)}</b><div>${incompleto(g) ? '<span class="chip warn">Incompleto</span>' : '<span class="chip ok">Con comprobante</span>'}</div></div></div>`).join('')}</div><div class="row between mt2"><b>Total a reponer</b><b>${money(sum(items, 'monto'))}</b></div>` : '<p class="empty">No hay gastos pendientes de reposición.</p>'}
      ${inc ? alertBox('warn', `${inc} gasto${inc > 1 ? 's' : ''} sin comprobante completo`, 'Puedes enviar la solicitud, pero la Dirección verá la advertencia y podría rechazarla. Mejor completa los comprobantes primero.') : ''}
      ${pend ? alertBox('info', 'Ya tienes una reposición pendiente', 'Espera la decisión de la Dirección General.', 'check') : ''}
      <button class="btn primary block mt2" data-act="repo-send" ${(!habil || pend || !items.length) ? 'disabled' : ''}>Enviar solicitud de reposición</button>
      ${!habil ? '<p class="small muted mt2">Se habilita al liquidar el 70 % de la caja chica (RN-10).</p>' : ''}</div></div>
    <div class="card mt"><h2>Historial de reposiciones</h2>${hist.length ? hist.map(r => `<div class="item" style="align-items:flex-start"><div class="grow"><b>${money(r.monto)}</b> · ${r.items.length} gastos ${solChip(r)}${histHtml(r)}</div></div>`).join('') : '<p class="muted">Todavía no has solicitado reposiciones.</p>'}</div>`;
};

/* ---------- Solicitudes (compra grande, extraordinario, insumos) · F3-P09 ---------- */
VIEWS.sol = () => {
  const u = me(); const e = E('sol'); const isEnc = u.role === 'enc';
  const list = S.solicitudes.filter(r => isEnc ? (r.branch === u.branch && r.tipo !== 'repo') : r.tipo === 'insumo').reverse();
  const tipo = ui.d.sol?.tipo || 'insumo'; const d = ui.d.sol || {};
  const form = isEnc ? `<form class="card" data-form="sol" novalidate><h2>Nueva solicitud</h2>
    ${field('Tipo de solicitud', 'tipo', select('tipo', { insumo: 'Insumos (carne, bolsas, gas, sodas)', grande: 'Compra grande', extra: 'Gasto extraordinario' }, tipo, 'data-rerender'), tipo === 'insumo' ? 'Se envía al responsable del control; no requiere aprobación del dueño.' : 'Requiere aprobación de la Dirección General (RN-15). El monto que cuenta como “compra grande” está por definir con Oink.', '')}
    ${tipo === 'insumo' ? field('Insumo', 'prod', select('prod', { Carne: 'Carne de cerdo', Bolsas: 'Bolsas térmicas', Gas: 'Cilindros de gas', Sodas: 'Sodas', Limpieza: 'Cloro y desengrasante' }, d.prod || 'Carne'), '', e.prod) + field('Cantidad', 'cant', input('cant', 'text', d.cant, 'inputmode="numeric" placeholder="Ej. 100"'), '', e.cant) :
      field('¿Qué necesitas comprar o pagar?', 'concepto', input('concepto', 'text', d.concepto, 'placeholder="Ej. Congelador horizontal"'), '', e.concepto) + field('Monto estimado (USD)', 'monto', input('monto', 'text', d.monto, 'inputmode="decimal"'), '', e.monto) + field('Justificación', 'just', `<textarea id="just" name="just" placeholder="Por qué es necesaria">${esc(d.just || '')}</textarea>`, 'Mínimo 10 caracteres.', e.just)}
    <button class="btn primary block" type="submit">Enviar solicitud</button></form>` : '';
  return head('F3-P09 · F3-P10', isEnc ? 'Solicitudes' : 'Solicitudes de insumos', isEnc ? 'Pide insumos o autorización para compras y gastos extraordinarios, y sigue su estado.' : 'Pedidos de insumos enviados por las sucursales.', 'HU-09 · RF-23, RF-25') +
    `<div class="grid ${isEnc ? 'g2' : ''}">${form}<div class="card"><h2>${isEnc ? 'Mis solicitudes' : 'Pedidos recibidos'}</h2>${list.length ? list.map(r => `<div class="item" style="align-items:flex-start"><div class="grow"><b>${TIPOS[r.tipo]}</b> ${solChip(r)}<div class="small muted">${esc(r.desc)}${r.monto ? ' · ' + money(r.monto) : ''}${!isEnc ? ' · ' + BR[r.branch] : ''}</div>${histHtml(r)}${!isEnc && r.estado === 'enviada' ? `<button class="btn sm mt2" data-act="atender" data-id="${r.id}">${ic('check')}Marcar como atendida</button>` : ''}</div></div>`).join('') : '<p class="empty">No hay solicitudes.</p>'}</div></div>`;
};

/* ---------- Aprobaciones (Dirección) · F3-P10 ---------- */
VIEWS.bandeja = () => {
  const tab = ui.tab.band || 'pend';
  const pend = S.solicitudes.filter(r => r.estado === 'pendiente'); const hist = S.solicitudes.filter(r => ['aprobada', 'rechazada'].includes(r.estado)).reverse();
  const card = r => {
    const by = S.users.find(x => x.id === r.by); const items = r.items.map(id => S.gastos.find(g => g.id === id)).filter(Boolean); const inc = items.filter(incompleto).length; const e = E('dec' + r.id);
    const pr = S.presup[r.branch].menor, re = real(r.branch, 'menor');
    return `<div class="card mt"><div class="row between"><div><span class="chip pink">${TIPOS[r.tipo]}</span> <b>${BR[r.branch]}</b></div><b style="font-size:1.3rem">${money(r.monto)}</b></div>
      <p>${esc(r.desc)}</p><p class="small muted">Solicitado por ${esc(by?.name)} · ${fts(r.hist[0].ts)}</p>${r.just ? `<p class="small"><b>Justificación:</b> ${esc(r.just)}</p>` : ''}
      ${items.length ? `<div class="tw"><table><tbody>${items.map(g => `<tr class="clk" data-act="gasto-det" data-id="${g.id}"><td>${esc(g.proveedor)}<div class="small muted">${esc(g.desc)}</div></td><td class="num">${money(g.monto)}</td><td>${incompleto(g) ? '<span class="chip warn">Incompleto</span>' : '<span class="chip ok">Comprobante</span>'}</td></tr>`).join('')}</tbody></table></div>` : ''}
      ${inc ? alertBox('warn', `${inc} gasto${inc > 1 ? 's' : ''} sin comprobante completo`, 'Considera pedir que se complete antes de aprobar.') : ''}
      <p class="small muted mt2">Contexto: gastos menores de ${BR[r.branch]} ${money(re)} de ${money(pr)} (${Math.round(re / pr * 100)} %).</p>
      <div class="field mt2 ${e.c ? 'has-err' : ''}"><label for="c_${r.id}">Comentario ${''}<span class="muted small">(obligatorio al rechazar)</span></label><textarea id="c_${r.id}" placeholder="Escribe el motivo o una indicación"></textarea>${e.c ? `<small class="err" role="alert">${esc(e.c)}</small>` : ''}</div>
      <div class="row"><button class="btn good" data-act="decidir" data-id="${r.id}" data-d="ok">${ic('check')}Aprobar</button><button class="btn danger" data-act="decidir" data-id="${r.id}" data-d="no">${ic('x')}Rechazar</button></div></div>`;
  };
  return head('F3-P10', 'Aprobaciones', 'Reposiciones, compras grandes y gastos extraordinarios, desde el celular.', 'HU-10 · RF-26, RF-27 · RN-10, RN-15') +
    `<div class="tabs"><button class="tab ${tab === 'pend' ? 'on' : ''}" data-act="tab" data-k="band" data-v="pend">Pendientes (${pend.length})</button><button class="tab ${tab === 'hist' ? 'on' : ''}" data-act="tab" data-k="band" data-v="hist">Historial</button></div>` +
    (tab === 'pend' ? (pend.map(card).join('') || `<div class="card empty">${ic('check')}<p>No hay solicitudes pendientes.</p></div>`) :
      hist.map(r => `<div class="card mt"><div class="row between"><b>${TIPOS[r.tipo]} · ${BR[r.branch]}</b>${solChip(r)}</div><p class="small muted">${esc(r.desc)} · ${money(r.monto)}</p>${histHtml(r)}</div>`).join('') || '<div class="card empty">Sin decisiones registradas.</div>');
};

/* ---------- Tablero · F3-P07 ---------- */
VIEWS.tablero = () => {
  const bs = ui.tab.tb && ui.tab.tb !== 'todas' ? [ui.tab.tb] : Object.keys(BR); const rows = [];
  bs.forEach(b => Object.keys(RUBROS).forEach(r => { const p = S.presup[b][r], re = real(b, r); rows.push({ b, r, p, re, pc: p ? re / p * 100 : (re ? 999 : 0) }); }));
  const alerts = rows.filter(x => x.pc >= S.umbral).sort((a, b) => b.pc - a.pc);
  const tp = sum(rows, 'p'), tr = sum(rows, 're'); const upd = new Date();
  return head('F3-P07', 'Gasto real vs. presupuesto', `Periodo: ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][new Date().getMonth()]} ${new Date().getFullYear()} · Actualizado ${pad(upd.getHours())}:${pad(upd.getMinutes())}:${pad(upd.getSeconds())}`, 'HU-07 · RF-20, RF-21, RF-28 · RNF-09') +
    `<div class="row between"><div class="tabs">${['todas', ...Object.keys(BR)].map(k => `<button class="tab ${(ui.tab.tb || 'todas') === k ? 'on' : ''}" data-act="tab" data-k="tb" data-v="${k}">${k === 'todas' ? 'Todas las sucursales' : BR[k]}</button>`).join('')}</div><button class="btn sm" data-act="refresh">Actualizar</button></div>
    <div class="grid g3"><div class="card kpi"><div class="l">Presupuesto</div><div class="v">${money(tp)}</div></div><div class="card kpi"><div class="l">Gasto real</div><div class="v">${money(tr)}</div></div><div class="card kpi"><div class="l">Diferencia</div><div class="v" style="color:var(${tp - tr < 0 ? '--red' : '--green'})">${money(tp - tr)}</div></div></div>
    ${alerts.length ? `<div class="mt">${alertBox('warn', `${alerts.length} alerta${alerts.length > 1 ? 's' : ''} de presupuesto`, alerts.slice(0, 4).map(a => `${BR[a.b]} · ${RUBROS[a.r]}: ${a.pc > 100 ? 'excedido' : 'cerca del límite'} (${a.pc > 900 ? 's/p' : Math.round(a.pc) + ' %'})`).join('<br>'))}</div>` : ''}
    <div class="card mt"><div class="tw"><table><thead><tr><th>Sucursal</th><th>Rubro</th><th class="num">Presupuesto</th><th class="num">Real</th><th class="num">Diferencia</th><th>Consumo</th><th>Estado</th></tr></thead><tbody>
    ${rows.map(x => { const [c, l] = estadoPres(x.re, x.p); return `<tr><td>${BR[x.b]}</td><td>${RUBROS[x.r]}</td><td class="num">${money(x.p)}</td><td class="num">${money(x.re)}</td><td class="num" style="color:var(${x.p - x.re < 0 ? '--red' : '--ink'})">${money(x.p - x.re)}</td><td><div class="bar"><span class="${barCls(x.pc)}" style="width:${Math.min(100, x.pc)}%"></span></div><span class="small muted">${x.pc > 900 ? 's/p' : Math.round(x.pc) + ' %'}</span></td><td><span class="chip ${c}">${l}</span></td></tr>`; }).join('')}
    </tbody></table></div><p class="small muted mt2">Alerta al ${S.umbral} % del presupuesto y al superarlo. La nómina solo la ve control y Dirección (RN-14).</p></div>`;
};

/* ---------- Presupuestos · F3-P06 ---------- */
VIEWS.presup = () => {
  const e = E('presup');
  return head('F3-P06', 'Presupuestos y límites', 'Define el monto mensual autorizado por sucursal y rubro.', 'HU-06 · RF-19, RF-22 · RN-11, RN-15') +
    `<form class="card" data-form="presup" novalidate><div class="tw"><table><thead><tr><th>Rubro</th>${Object.keys(BR).map(b => `<th>${BR[b]}</th>`).join('')}</tr></thead><tbody>
    ${Object.keys(RUBROS).map(r => `<tr><td><b>${RUBROS[r]}</b></td>${Object.keys(BR).map(b => `<td><div class="field" style="margin:0"><input name="p_${b}_${r}" value="${S.presup[b][r]}" inputmode="decimal" aria-label="${RUBROS[r]} ${BR[b]}" style="border:1.5px solid ${e['p_' + b + '_' + r] ? 'var(--red)' : 'var(--line)'};border-radius:9px;padding:8px;width:110px">${e['p_' + b + '_' + r] ? `<small class="err">${esc(e['p_' + b + '_' + r])}</small>` : ''}</div></td>`).join('')}</tr>`).join('')}
    </tbody></table></div>
    <div class="grid g2 mt"><div>${field('Alertar al llegar a (% del presupuesto)', 'umbral', input('umbral', 'text', S.umbral, 'inputmode="numeric"'), 'Valor configurable entre 1 y 100 (RNF-22).', e.umbral)}</div>
    <div><div class="lbl">Fondos por sucursal (referencia)</div><p class="small muted mt2">${Object.keys(BR).map(b => `${BR[b]}: caja chica ${money(CAJA[b].chica)} · cambio ${money(CAJA[b].cambio)}`).join('<br>')}</p></div></div>
    <button class="btn primary" type="submit">Guardar presupuestos</button></form>`;
};

/* ---------- Revisión de gastos (control) ---------- */
VIEWS.revision = () => {
  const inc = S.gastos.filter(incompleto).sort((a, b) => b.ts - a.ts); const exc = S.gastos.filter(g => g.fuente === 'ventas');
  return head('F3-P02 · F3-P04', 'Revisión de gastos', 'Comprobantes incompletos y usos excepcionales de efectivo de ventas.', 'HU-02 · HU-04 · RF-14, RF-15, RF-17') +
    `<div class="grid g2"><div class="card"><h2>Comprobantes incompletos (${inc.length})</h2>${inc.map(g => `<div class="item"><div class="grow"><b>${esc(g.proveedor)}</b> · ${money(g.monto)}<div class="small muted">${BR[g.branch]} · ${fdate(g.fecha)} · ${!g.foto || g.tipo === 'ninguno' ? 'sin comprobante' : 'sin NRC'}</div></div><button class="btn sm" data-act="gasto-det" data-id="${g.id}">Ver</button><button class="btn sm" data-act="reclamar" data-id="${g.id}">Avisar</button></div>`).join('') || '<p class="empty">Todo en orden.</p>'}</div>
    <div class="card"><h2>Excepciones RN-07 (${exc.length})</h2>${exc.map(g => `<div class="item" style="align-items:flex-start"><div class="grow"><b>${esc(g.proveedor)}</b> · ${money(g.monto)} ${g.rev ? '<span class="chip ok">Revisada</span>' : '<span class="chip bad">Por revisar</span>'}<div class="small muted">${BR[g.branch]} · ${fdate(g.fecha)}</div><div class="small">“${esc(g.motivo)}”</div></div>${g.rev ? '' : `<button class="btn sm" data-act="revisar" data-id="${g.id}">Marcar revisada</button>`}</div>`).join('') || '<p class="empty">Sin excepciones.</p>'}</div></div>`;
};

/* ---------- Gastos fijos (control) · F3-P05 ---------- */
VIEWS.fijos = () => {
  const e = E('fijos'); const d = ui.d.fijos || {}; const l = S.gastos.filter(g => g.fuente === 'admin').sort((a, b) => b.ts - a.ts);
  return head('F3-P05', 'Gastos fijos de administración', 'Renta, energía, agua y nómina base, asociados al presupuesto mensual de cada sucursal.', 'HU-05 · RF-18 · RN-11, RN-14') +
    `<div class="grid g2"><form class="card" data-form="fijos" novalidate><h2>Registrar gasto fijo</h2>
    ${field('Sucursal', 'branch', select('branch', BR, d.branch || 'chal'), '', e.branch)}${field('Concepto', 'concepto', select('concepto', { Renta: 'Renta del local', Energía: 'Energía eléctrica', Agua: 'Agua potable', Nómina: 'Nómina base' }, d.concepto || 'Renta'), 'La nómina no se muestra a las sucursales.', e.concepto)}
    ${field('Mes', 'mes', input('mes', 'month', d.mes || today().slice(0, 7)), '', e.mes)}${field('Monto (USD)', 'monto', input('monto', 'text', d.monto, 'inputmode="decimal"'), '', e.monto)}
    <button class="btn primary block" type="submit">Registrar</button></form>
    <div class="card"><h2>Registrados</h2>${l.map(g => `<div class="item"><div class="grow"><b>${esc(g.desc)}</b><div class="small muted">${BR[g.branch]} · ${esc(g.proveedor)}</div></div><b>${money(g.monto)}</b></div>`).join('') || '<p class="empty">Aún no hay gastos fijos registrados en esta sesión.</p>'}</div></div>`;
};

/* ---------- Cuadro diario · F3-P11 a P14 ---------- */
const cu = b => { const c = S.cuadro[b]; if (!c || c.fecha !== today()) S.cuadro[b] = { fecha: today(), apertura: null, entradas: [], mermas: [], ventas: [], cierre: null }; return S.cuadro[b]; };
function teorico(c) {
  const a = c.apertura; const exh = a.cocido + a.crudo + sum(c.entradas, 'lb');
  const mer = sum(c.mermas.filter(m => m.prod === 'chich'), 'lb');
  return { lb: r2(exh - mer - sum(c.ventas, 'lb')), exh, merTec: sum(c.mermas.filter(m => m.prod === 'chich' && m.tipo === 'tec'), 'lb'), sodas: a.sodas + sum(c.entradas, 'sodas') - sum(c.mermas.filter(m => m.prod === 'soda'), 'uds') - sum(c.ventas, 'sodas'), usd: r2(sum(c.ventas, 'monto')) };
}
VIEWS.cuadro = () => {
  const u = me();
  const histo = S.historial.filter(h => u.role === 'enc' ? h.branch === u.branch : true).slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
  const histCard = `<div class="card mt"><h2>Historial de diferencias</h2><p class="small muted">Una alerta abre una revisión con evidencia; no aplica ninguna deducción automática (RN-16).</p><div class="tw"><table><thead><tr><th>Fecha</th><th>Sucursal</th><th class="num">Dif. dinero</th><th class="num">Dif. proteína</th><th>Resultado</th></tr></thead><tbody>${histo.map(h => `<tr><td>${fdate(h.fecha)}</td><td>${BR[h.branch]}</td><td class="num">${money(h.dUsd)}</td><td class="num">${lb(h.dLb)}</td><td>${h.flag ? '<span class="chip warn">Supera tolerancia · revisar</span>' : '<span class="chip ok">Dentro de tolerancia</span>'}</td></tr>`).join('')}</tbody></table></div></div>`;
  if (u.role !== 'enc') return head('F3-P13', 'Historial de diferencias', 'Faltantes y sobrantes por sucursal, con el detalle para investigarlos.', 'HU-13 · RF-09, RF-10 · RN-05, RN-06, RN-16') + histCard;
  const c = cu(u.branch); const tab = ui.tab.cu || (c.apertura ? (c.cierre ? 'cierre' : 'jornada') : 'apertura'); const e = E('cu'); const lock = !!c.cierre;
  const tabs = `<div class="tabs">${[['apertura', '1. Apertura'], ['jornada', '2. Jornada'], ['cierre', '3. Cierre ciego']].map(([k, t]) => `<button class="tab ${tab === k ? 'on' : ''}" data-act="tab" data-k="cu" data-v="${k}">${t}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'apertura') {
    const a = c.apertura;
    body = `<form class="card" data-form="apertura" novalidate><h2>Apertura de ${BR[u.branch]}</h2>${lock || a ? alertBox('ok', 'Apertura registrada', a ? `Fondo ${money(a.fondo)} · ${lb(a.cocido)} cocido · ${lb(a.crudo)} crudo · ${a.sodas} sodas` : '', 'check') : ''}<div class="formgrid">
      ${field('Fondo de cambio contado (USD)', 'fondo', input('fondo', 'text', a ? a.fondo : CAJA[u.branch].cambio, 'inputmode="decimal"' + (a ? ' disabled' : '')), `Asignado: ${money(CAJA[u.branch].cambio)}`, e.fondo)}
      ${field('Chicharrón cocido (lb)', 'cocido', input('cocido', 'text', a?.cocido, 'inputmode="decimal" placeholder="Pesar en balanza"' + (a ? ' disabled' : '')), '', e.cocido)}
      ${field('Chicharrón crudo (lb)', 'crudo', input('crudo', 'text', a?.crudo, 'inputmode="decimal"' + (a ? ' disabled' : '')), '', e.crudo)}
      ${field('Sodas en refrigerador (unidades)', 'sodas', input('sodas', 'text', a?.sodas, 'inputmode="numeric"' + (a ? ' disabled' : '')), '', e.sodas)}</div>
      ${a ? '' : '<button class="btn primary" type="submit">Guardar apertura</button>'}</form>`;
  } else if (tab === 'jornada') {
    if (!c.apertura) body = alertBox('warn', 'Primero registra la apertura', 'Sin apertura no se puede calcular el stock teórico.');
    else body = `<div class="grid g2">
      <form class="card" data-form="entrada" novalidate><h2>Entrada de producto</h2>${field('Origen', 'origen', select('origen', { cocina: 'Cocina central', prov: 'Proveedor externo' }, 'cocina'))}${field('Chicharrón recibido (lb)', 'lb', input('lb', 'text', '', 'inputmode="decimal"' + (lock ? ' disabled' : '')), '', e.lb)}${field('Sodas recibidas (unidades)', 'sodas', input('sodas', 'text', '', 'inputmode="numeric"' + (lock ? ' disabled' : '')))}<button class="btn block" ${lock ? 'disabled' : ''}>Registrar entrada</button></form>
      <form class="card" data-form="merma" novalidate><h2>Merma</h2>${field('Producto', 'prod', select('prod', { chich: 'Chicharrón (se pesa)', soda: 'Soda (por unidad)' }, ui.d.merma?.prod || 'chich', 'data-rerender'))}
        ${(ui.d.merma?.prod || 'chich') === 'chich' ? field('Peso de la merma (lb)', 'lb', input('lb', 'text', '', 'inputmode="decimal"'), 'Ninguna merma se descarta sin registrar su peso (RN-04).', e.mlb) + field('Tipo', 'tipo', select('tipo', { tec: 'Técnica (humedad y grasa en vitrina)', evi: 'Evitable (caído, descartado)' }, 'tec')) : field('Unidades dañadas', 'uds', input('uds', 'text', '', 'inputmode="numeric"'), 'Resguardar el envase con sello intacto para el proveedor (tolerancia 0 %).', e.muds)}
        ${field('Motivo', 'motivo', input('motivo', 'text', '', 'placeholder="Ej. grasa descartada"'), '', e.mmot)}<button class="btn block" ${lock ? 'disabled' : ''}>Registrar merma</button></form>
      <form class="card" data-form="venta" novalidate><h2>Venta facturada</h2>${field('Canal', 'canal', select('canal', { mostrador: 'Mostrador', mesas: 'Mesas', delivery: 'Delivery' }, 'mostrador'))}<div class="formgrid">${field('Libras', 'lb', input('lb', 'text', '', 'inputmode="decimal"'), '', e.vlb)}${field('Sodas', 'sodas', input('sodas', 'text', '', 'inputmode="numeric"'))}</div>${field('Monto (USD)', 'monto', input('monto', 'text', '', 'inputmode="decimal"'), '', e.vmonto)}<button class="btn block" ${lock ? 'disabled' : ''}>Registrar venta</button></form>
      <form class="card" data-form="perdida" novalidate><h2>Venta perdida por falta de producto</h2>${field('Producto', 'prod', input('prod', 'text', '', 'placeholder="Ej. Chicharrón de lomo"'), '', e.pprod)}${field('Fecha', 'fecha', input('fecha', 'date', today(), `max="${today()}"`))}<button class="btn block">Registrar</button>
        <p class="small muted mt2">${S.perdidas.filter(p => p.branch === u.branch).length} registradas</p></form></div>
      <div class="card mt"><h2>Movimientos de hoy</h2>${[...c.entradas.map(x => `Entrada: ${lb(x.lb)} · ${x.sodas} sodas (${x.origen === 'cocina' ? 'cocina central' : 'proveedor'})`), ...c.mermas.map(x => `Merma ${x.prod === 'chich' ? lb(x.lb) + (x.tipo === 'tec' ? ' técnica' : ' evitable') : x.uds + ' soda(s)'}: ${esc(x.motivo)}`), ...c.ventas.map(x => `Venta ${x.canal}: ${lb(x.lb)} · ${x.sodas} sodas · ${money(x.monto)}`)].map(t => `<div class="item">${t}</div>`).join('') || '<p class="muted">Aún no hay movimientos.</p>'}</div>`;
  } else {
    if (!c.apertura) body = alertBox('warn', 'Primero registra la apertura', '');
    else if (c.cierre) { const k = c.cierre; body = `<div class="card"><h2>Cierre registrado</h2>${alertBox('ok', 'Cuadro cerrado', 'No se puede modificar; cualquier corrección debe hacerse como ajuste autorizado (RNF-11).', 'check')}
      <div class="tw"><table><thead><tr><th></th><th class="num">Teórico</th><th class="num">Físico</th><th class="num">Diferencia</th></tr></thead><tbody><tr><td>Dinero (ventas vs. contado)</td><td class="num">${money(k.tUsd)}</td><td class="num">${money(k.fUsd)}</td><td class="num"><b>${money(k.dUsd)}</b></td></tr><tr><td>Chicharrón</td><td class="num">${lb(k.tLb)}</td><td class="num">${lb(k.fLb)}</td><td class="num"><b>${lb(k.dLb)}</b></td></tr><tr><td>Sodas</td><td class="num">${k.tSodas}</td><td class="num">${k.fSodas}</td><td class="num"><b>${k.dSodas}</b></td></tr></tbody></table></div>
      ${k.flags.length ? alertBox('warn', 'Alertas de tolerancia', k.flags.join('<br>') + '<br>Se abre una revisión con evidencia; no se aplica deducción automática.') : alertBox('ok', 'Dentro de tolerancia', 'Sin diferencias que requieran revisión.', 'check')}</div>`; }
    else body = `<form class="card" data-form="cierre" novalidate><h2>Cierre con conteo ciego</h2><p class="muted small">Cuenta primero; el sistema no muestra el stock teórico hasta que guardes (RF-06).</p><div class="formgrid mt">
      ${field('Efectivo + vouchers + delivery contados (USD)', 'usd', input('usd', 'text', '', 'inputmode="decimal"'), '', e.usd)}${field('Chicharrón sobrante en vitrina (lb)', 'lb', input('lb', 'text', '', 'inputmode="decimal"'), '', e.lb)}${field('Sodas remanentes (unidades)', 'sodas', input('sodas', 'text', '', 'inputmode="numeric"'), '', e.sodas)}</div><button class="btn primary" type="submit">Cerrar Cuadro</button></form>`;
  }
  return head('F3-P11 · P12 · P13 · P14', 'Cuadro diario', `${BR[u.branch]} · ${fdate(today())}`, 'HU-11 a HU-14 · RF-01 a RF-11 · RN-01 a RN-06') + tabs + body + histCard + `<p class="mt2"><button class="link" data-act="cuadro-reset">Reiniciar el día (solo demostración)</button></p>`;
};

/* ---------- Usuarios y permisos · F3-P16 ---------- */
VIEWS.usuarios = () => head('F3-P16', 'Usuarios y permisos', 'Cada persona ve solo lo que le corresponde.', 'HU-16 · RF-30 · RN-14 · RNF-13 a RNF-17') +
  `<div class="card"><div class="row between"><h2>Usuarios</h2><button class="btn sm primary" data-act="nuevo-usuario">${ic('plus')}Nuevo usuario</button></div><div class="tw"><table><thead><tr><th>Nombre</th><th>Rol</th><th>Sucursal</th><th>Activo</th></tr></thead><tbody>
  ${S.users.map(x => `<tr><td><b>${esc(x.name)}</b><div class="small muted">${esc(x.email)}</div></td><td>${ROLES[x.role]}</td><td>${x.branch ? BR[x.branch] : 'Todas'}</td><td><button class="sw ${x.activo ? 'on' : ''}" data-act="toggle-user" data-id="${x.id}" aria-label="Activar o desactivar" ${x.id === me().id ? 'disabled' : ''}></button></td></tr>`).join('')}</tbody></table></div></div>
  <div class="card mt"><h2>Matriz de acceso</h2><div class="tw"><table><thead><tr><th>Información</th><th>Encargada/o</th><th>Control</th><th>Dirección</th></tr></thead><tbody>
  ${[['Gastos y saldos de su sucursal', 1, 1, 1], ['Gastos de todas las sucursales', 0, 1, 1], ['Nómina y gastos fijos', 0, 1, 1], ['Definir presupuestos', 0, 0, 1], ['Aprobar solicitudes', 0, 0, 1], ['Gestionar usuarios', 0, 0, 1]].map(r => `<tr><td>${r[0]}</td>${r.slice(1).map(v => `<td>${v ? '<span class="chip ok">Sí</span>' : '<span class="chip">No</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;

/* ---------- Trazabilidad ---------- */
VIEWS.traza = () => {
  const rows = [['F3-P01', 'Registrar gasto (paso 1)', 'HU-01', 'RF-12, RF-13', 'Must', 'Encargada'], ['F3-P02', 'Comprobante y su estado', 'HU-02', 'RF-14, RF-15', 'Must', 'Encargada / Control'], ['F3-P03', 'Inicio: saldos y alerta del 70 %', 'HU-03', 'RF-16', 'Must', 'Encargada'], ['F3-P04', 'Excepción de efectivo de ventas', 'HU-04', 'RF-17', 'Should', 'Encargada / Control'], ['F3-P05', 'Gastos fijos de administración', 'HU-05', 'RF-18', 'Should', 'Control'], ['F3-P06', 'Presupuestos y límites', 'HU-06', 'RF-19, RF-22', 'Must', 'Dirección'], ['F3-P07', 'Tablero gasto vs. presupuesto', 'HU-07', 'RF-20, 21, 28', 'Must', 'Control / Dirección'], ['F3-P08', 'Reposición de caja chica', 'HU-08', 'RF-24', 'Must', 'Encargada'], ['F3-P09', 'Solicitud de insumos', 'HU-09', 'RF-23, RF-25', 'Should', 'Encargada / Control'], ['F3-P10', 'Aprobar o rechazar', 'HU-10', 'RF-26, RF-27', 'Must', 'Dirección'], ['F3-P11/12/13', 'Cuadro: apertura, cierre, historial', 'HU-11 a 13', 'RF-01 a RF-10', 'Should', 'Encargada / Control'], ['F3-P14', 'Ventas perdidas', 'HU-14', 'RF-11', 'Could', 'Encargada'], ['F3-P15', 'Conciliación de comisiones', 'HU-15', 'RF-29', 'Should', '—'], ['F3-P16', 'Usuarios y permisos', 'HU-16', 'RF-30', 'Must', 'Dirección']];
  const rn = [['RN-07', 'Efectivo de ventas: solo como excepción con motivo y aviso a control'], ['RN-08', 'Fondo de cambio separado e intacto'], ['RN-09', 'Comprobante con NRC; sin él, el gasto queda incompleto'], ['RN-10', 'Reposición al liquidar el 70 % y con aprobación'], ['RN-14', 'Cada rol ve solo lo que le corresponde'], ['RN-15', 'Compras grandes y extraordinarios los aprueba el dueño'], ['RN-04 / RN-05', 'Merma con peso obligatorio y tolerancias 2.5 % / 0 %'], ['RN-16', 'Las diferencias no generan deducciones automáticas']];
  return head('Matriz', 'Trazabilidad del prototipo', 'RF → historia → pantalla del prototipo. Las pruebas F4-T se completan en la Fase 4.', 'Fase 2 → Fase 3') +
    `<div class="card"><div class="tw"><table><thead><tr><th>Pantalla</th><th>Contenido</th><th>Historia</th><th>RF</th><th>Prioridad</th><th>Actor</th><th>Estado</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[0] === 'F3-P15' ? '<span class="chip">No incluida</span>' : '<span class="chip ok">Implementada</span>'}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card mt"><h2>Reglas de negocio visibles en el prototipo</h2>${rn.map(r => `<div class="item"><span class="chip pink">${r[0]}</span><div class="grow">${r[1]}</div></div>`).join('')}</div>
    <p class="mt"><button class="btn" data-act="reset">Restablecer datos de demostración</button></p>`;
};

/* ---------- acciones ---------- */
function decidir(id, ok) {
  const r = S.solicitudes.find(x => x.id === id); const c = ($('#c_' + id) || {}).value || ''; const u = me();
  if (!ok && c.trim().length < 5) { ui.errs['dec' + id] = { c: 'Para rechazar debes escribir el motivo (mínimo 5 caracteres).' }; render(); const t = $('#c_' + id); if (t) t.focus(); return; }
  r.estado = ok ? 'aprobada' : 'rechazada'; r.hist.push({ ts: Date.now(), who: u.name, estado: ok ? 'Aprobada' : 'Rechazada', c: c.trim() });
  if (ok && r.tipo === 'repo') S.gastos.forEach(g => { if (r.items.includes(g.id)) g.repuesto = true; });
  if (!ok && r.tipo === 'repo') S.gastos.forEach(g => { if (r.items.includes(g.id)) g.reqId = null; });
  notify(r.by, `Tu solicitud de ${TIPOS[r.tipo].toLowerCase()} fue ${ok ? 'aprobada' : 'rechazada'}${c.trim() ? ': ' + c.trim() : '.'}`);
  ui.errs = {}; save(); render(); toast(ok ? 'Solicitud aprobada' : 'Solicitud rechazada', `Se notificó a ${S.users.find(x => x.id === r.by).name}.`, ok ? '' : 'warn');
}
function showNotifs() {
  const u = me(); const l = S.notifs.filter(n => n.to === u.id || n.to === u.role).slice(0, 12);
  openModal(`<h2>Notificaciones</h2>${l.map(n => `<div class="item"><div class="ico">${ic('bell')}</div><div class="grow">${esc(n.txt)}<div class="small muted">${fts(n.ts)}</div></div></div>`).join('') || '<p class="empty">Sin notificaciones.</p>'}<div class="acts"><button class="btn" data-act="close">Cerrar</button></div>`);
  l.forEach(n => n.read = true); save(); render();
}

function submit(f, form) {
  const u = me(); const fd = {}; new FormData(form).forEach((v, k) => fd[k] = v); form.querySelectorAll('input[type=checkbox]').forEach(c => fd[c.name] = c.checked);
  const errs = {}; const bad = () => Object.keys(errs).length; const set = () => { const ek = ['apertura', 'entrada', 'merma', 'venta', 'perdida', 'cierre'].includes(f) ? 'cu' : (f === 'gasto1' || f === 'gasto2') ? 'gasto' : f; ui.errs[ek] = errs; render(); const k = Object.keys(errs)[0]; const el = k && document.getElementById(k); if (el) el.focus(); };
  const dd = fd.fuente === undefined ? {} : fd;
  switch (f) {
    case 'login': {
      ui.d.login = { email: fd.email }; if (!fd.email.trim()) errs.email = 'Escribe tu correo.'; else if (!/^\S+@\S+\.\S+$/.test(fd.email.trim())) errs.email = 'El correo no tiene un formato válido.'; if (!fd.pass) errs.pass = 'Escribe tu contraseña.';
      if (!bad()) { const x = S.users.find(v => v.email === fd.email.trim().toLowerCase() && v.pass === fd.pass); if (!x) errs.general = 'Correo o contraseña incorrectos.'; else if (!x.activo) errs.general = 'Tu usuario está desactivado. Contacta a la Dirección.'; else { S.session = x.id; S.view = NAV[x.role][0][0]; ui.d.login = null; ui.errs = {}; save(); render(); toast('Bienvenido/a', x.name); armIdle(); return; } }
      return set();
    }
    case 'gasto1': {
      const d = ui.d.gasto; Object.assign(d, fd); const m = num(fd.monto); const c = caja(u.branch);
      if (isNaN(m)) errs.monto = 'Escribe el monto con números, por ejemplo 12.50.'; else if (m <= 0) errs.monto = 'El monto debe ser mayor que cero.'; else if (Math.round(m * 100) !== m * 100 && !/^\d+([.,]\d{1,2})?$/.test(String(fd.monto).trim())) errs.monto = 'Usa máximo dos decimales.'; else if (fd.fuente === 'caja' && m > c.saldo) errs.monto = `Saldo insuficiente: solo hay ${money(c.saldo)} en caja chica. Solicita la reposición.`;
      if (!fd.fecha) errs.fecha = 'Indica la fecha del gasto.'; else if (fd.fecha > today()) errs.fecha = 'La fecha no puede ser futura.';
      if (!fd.proveedor.trim()) errs.proveedor = 'Indica el proveedor.'; if (fd.desc.trim().length < 5) errs.desc = 'Describe el gasto (mínimo 5 caracteres).';
      if (fd.fuente === 'ventas' && (fd.motivo || '').trim().length < 10) errs.motivo = 'Explica el motivo de la excepción (mínimo 10 caracteres).';
      if (bad()) return set(); ui.step = 2; ui.errs = {}; render(); window.scrollTo(0, 0); return;
    }
    case 'gasto2': {
      const d = ui.d.gasto; d.tipo = fd.tipo; d.nrc = fd.nrc;
      if (fd.tipo !== 'ninguno' && !ui.foto) { /* se permite, se marca incompleto */ }
      const inc = !ui.foto || fd.tipo === 'ninguno' || !fd.nrc;
      if (inc) { openModal(`<h2>El gasto quedará incompleto</h2><p>${!ui.foto || fd.tipo === 'ninguno' ? 'Falta la foto del comprobante.' : 'No marcaste el NRC de la empresa.'} Se guardará igual, pero se avisará al responsable del control y no podrá considerarse respaldado hasta que lo completes.</p><div class="acts"><button class="btn" data-act="close">Volver y completar</button><button class="btn primary" data-act="gasto-force">Guardar como incompleto</button></div>`); return; }
      return saveGasto();
    }
    case 'fix': {
      const g = S.gastos.find(x => x.id === Number(form.dataset.id)); g.tipo = fd.tipo; g.nrc = fd.nrc; if (ui.fotoFix) g.foto = ui.fotoFix;
      ui.fotoFix = null; save(); closeModal(); render(); toast(incompleto(g) ? 'Comprobante actualizado' : 'Gasto completo', incompleto(g) ? 'Todavía falta la foto o el NRC.' : 'El gasto ya está respaldado.', incompleto(g) ? 'warn' : ''); return;
    }
    case 'sol': {
      ui.d.sol = Object.assign(ui.d.sol || {}, fd); const t = fd.tipo;
      if (t === 'insumo') { const q = num(fd.cant); if (isNaN(q) || q <= 0 || !Number.isInteger(q)) errs.cant = 'Indica una cantidad entera mayor que cero.'; if (bad()) return set();
        S.solicitudes.push({ id: 'R' + nid(), tipo: 'insumo', branch: u.branch, by: u.id, monto: 0, desc: `${fd.prod} · ${q} unidades`, items: [], estado: 'enviada', hist: [{ ts: Date.now(), who: u.name, estado: 'Enviada', c: '' }] }); notify('ctl', `Pedido de insumos de ${BR[u.branch]}: ${fd.prod} (${q}).`); }
      else { const m = num(fd.monto); if (!fd.concepto.trim()) errs.concepto = 'Indica qué necesitas.'; if (isNaN(m) || m <= 0) errs.monto = 'Escribe un monto mayor que cero.'; if (fd.just.trim().length < 10) errs.just = 'Justifica la solicitud (mínimo 10 caracteres).'; if (bad()) return set();
        S.solicitudes.push({ id: 'R' + nid(), tipo: t, branch: u.branch, by: u.id, monto: r2(m), desc: fd.concepto.trim(), just: fd.just.trim(), items: [], estado: 'pendiente', hist: [{ ts: Date.now(), who: u.name, estado: 'Enviada', c: '' }] }); notify('own', `Nueva solicitud de ${TIPOS[t].toLowerCase()} en ${BR[u.branch]} (${money(m)}).`); }
      ui.d.sol = null; ui.errs = {}; save(); render(); toast('Solicitud enviada', t === 'insumo' ? 'El responsable del control la recibió.' : 'La Dirección General fue notificada.'); return;
    }
    case 'presup': {
      Object.keys(BR).forEach(b => Object.keys(RUBROS).forEach(r => { const v = num(fd[`p_${b}_${r}`]); if (isNaN(v) || v < 0) errs[`p_${b}_${r}`] = 'Monto inválido'; }));
      const um = num(fd.umbral); if (isNaN(um) || um < 1 || um > 100 || !Number.isInteger(um)) errs.umbral = 'Escribe un entero entre 1 y 100.';
      if (bad()) return set(); Object.keys(BR).forEach(b => Object.keys(RUBROS).forEach(r => S.presup[b][r] = r2(num(fd[`p_${b}_${r}`])))); S.umbral = um; ui.errs = {}; save(); render(); toast('Presupuestos guardados', 'El tablero ya refleja los nuevos límites.'); return;
    }
    case 'fijos': {
      ui.d.fijos = fd; const m = num(fd.monto); if (isNaN(m) || m <= 0) errs.monto = 'Escribe un monto mayor que cero.'; if (!fd.mes) errs.mes = 'Selecciona el mes.'; if (bad()) return set();
      S.gastos.push({ id: nid(), branch: fd.branch, rubro: 'fijo', monto: r2(m), fecha: today(), proveedor: 'Administración', desc: `${fd.concepto} · ${fd.mes}`, fuente: 'admin', tipo: 'fcf', nrc: true, foto: null, by: u.id, ts: Date.now(), motivo: '', rev: false, repuesto: false, reqId: null });
      ui.d.fijos = null; ui.errs = {}; save(); render(); toast('Gasto fijo registrado', `${fd.concepto} · ${BR[fd.branch]} · ${money(m)}`); return;
    }
    case 'apertura': {
      const fo = num(fd.fondo), co = num(fd.cocido), cr = num(fd.crudo), so = num(fd.sodas);
      if (isNaN(fo) || fo < 0) errs.fondo = 'Cuenta el fondo de cambio.'; if (isNaN(co) || co < 0) errs.cocido = 'Pesa el chicharrón cocido (puede ser 0).'; if (isNaN(cr) || cr < 0) errs.crudo = 'Pesa el chicharrón crudo (puede ser 0).'; if (isNaN(so) || so < 0 || !Number.isInteger(so)) errs.sodas = 'Cuenta las sodas (número entero).';
      if (bad()) return set(); const c = cu(u.branch); c.apertura = { fondo: fo, cocido: co, crudo: cr, sodas: so };
      if (fo !== CAJA[u.branch].cambio) { toast('Fondo distinto al asignado', `El fondo asignado es ${money(CAJA[u.branch].cambio)}; se avisó a control.`, 'warn'); notify('ctl', `Fondo de cambio en ${BR[u.branch]} abre con ${money(fo)} (asignado ${money(CAJA[u.branch].cambio)}).`); }
      ui.errs = {}; ui.tab.cu = 'jornada'; save(); render(); toast('Apertura registrada', 'Ya puedes registrar la jornada.'); return;
    }
    case 'entrada': { const l = num(fd.lb), s = fd.sodas === '' ? 0 : num(fd.sodas); if (isNaN(l) || l < 0) errs.lb = 'Pesa el chicharrón recibido (0 si no hubo).'; if (isNaN(s) || s < 0) errs.lb = 'Revisa las sodas recibidas.'; if (bad()) return set(); cu(u.branch).entradas.push({ lb: l, sodas: s || 0, origen: fd.origen }); save(); render(); toast('Entrada registrada', ''); return; }
    case 'merma': {
      ui.d.merma = { prod: fd.prod }; if (fd.prod === 'chich') { const l = num(fd.lb); if (isNaN(l) || l <= 0) errs.mlb = 'El peso es obligatorio: no se descarta merma sin pesarla.'; } else { const x = num(fd.uds); if (isNaN(x) || x < 1 || !Number.isInteger(x)) errs.muds = 'Indica cuántas unidades están dañadas.'; }
      if (!fd.motivo.trim()) errs.mmot = 'Indica el motivo.'; if (bad()) return set();
      cu(u.branch).mermas.push({ prod: fd.prod, lb: fd.prod === 'chich' ? num(fd.lb) : 0, uds: fd.prod === 'soda' ? num(fd.uds) : 0, tipo: fd.tipo || 'tec', motivo: fd.motivo.trim() }); ui.d.merma = null; save(); render(); toast('Merma registrada', fd.prod === 'soda' ? 'Resguarda el envase con el sello intacto.' : ''); return;
    }
    case 'venta': { const l = fd.lb === '' ? 0 : num(fd.lb), s = fd.sodas === '' ? 0 : num(fd.sodas), m = num(fd.monto); if (isNaN(l) || l < 0) errs.vlb = 'Libras inválidas.'; if (isNaN(m) || m <= 0) errs.vmonto = 'Escribe el monto de la venta.'; if (isNaN(s) || s < 0) errs.vlb = 'Sodas inválidas.'; if (bad()) return set(); cu(u.branch).ventas.push({ canal: fd.canal, lb: l, sodas: s, monto: m }); save(); render(); toast('Venta registrada', fd.canal); return; }
    case 'perdida': { if (!fd.prod.trim()) errs.pprod = 'Indica el producto.'; if (bad()) return set(); S.perdidas.push({ branch: u.branch, fecha: fd.fecha, prod: fd.prod.trim() }); save(); render(); toast('Venta perdida registrada', ''); return; }
    case 'cierre': {
      const c = cu(u.branch); const uu = num(fd.usd), l = num(fd.lb), s = num(fd.sodas);
      if (isNaN(uu) || uu < 0) errs.usd = 'Cuenta el efectivo, vouchers y delivery.'; if (isNaN(l) || l < 0) errs.lb = 'Pesa el sobrante (puede ser 0).'; if (isNaN(s) || s < 0 || !Number.isInteger(s)) errs.sodas = 'Cuenta las sodas (número entero).';
      if (bad()) return set(); const t = teorico(c); const k = { tUsd: t.usd, fUsd: uu, dUsd: r2(uu - t.usd), tLb: t.lb, fLb: l, dLb: r2(l - t.lb), tSodas: t.sodas, fSodas: s, dSodas: s - t.sodas, flags: [] };
      if (Math.abs(k.dUsd) > 5) k.flags.push(`Diferencia de dinero de ${money(k.dUsd)} (tolerancia $5.00).`); if (Math.abs(k.dLb) > 0.5) k.flags.push(`Diferencia de ${lb(k.dLb)} de proteína (tolerancia media libra).`);
      if (t.exh > 0 && t.merTec / t.exh * 100 > 2.5) k.flags.push(`Merma técnica de ${(t.merTec / t.exh * 100).toFixed(1)} % (máximo 2.5 %).`);
      const sm = sum(c.mermas.filter(m => m.prod === 'soda'), 'uds'); if (sm > 0) k.flags.push(`${sm} soda(s) dañada(s): tolerancia 0 %.`); if (k.dSodas !== 0) k.flags.push(`Diferencia de ${k.dSodas} soda(s).`);
      c.cierre = k; S.historial.push({ fecha: today(), branch: u.branch, dUsd: k.dUsd, dLb: k.dLb, flag: k.flags.length > 0 }); if (k.flags.length) notify('ctl', `Cierre con diferencias en ${BR[u.branch]}: ${k.flags[0]}`);
      ui.errs = {}; save(); render(); toast('Cuadro cerrado', k.flags.length ? 'Hay diferencias fuera de tolerancia.' : 'Sin diferencias.', k.flags.length ? 'warn' : ''); return;
    }
    case 'usuario': {
      if (fd.name.trim().length < 3) errs.uname = 'Escribe el nombre completo.'; if (!/^\S+@\S+\.\S+$/.test(fd.email.trim())) errs.uemail = 'Correo no válido.'; else if (S.users.some(x => x.email === fd.email.trim().toLowerCase())) errs.uemail = 'Ese correo ya está registrado.';
      if (bad()) { ui.errs.usuario = errs; usuarioModal(fd); return; }
      S.users.push({ id: 'u' + nid(), name: fd.name.trim(), role: fd.role, branch: fd.role === 'enc' ? fd.branch : null, email: fd.email.trim().toLowerCase(), pass: 'oink123', activo: true }); save(); closeModal(); render(); toast('Usuario creado', 'Contraseña inicial: oink123 (debe cambiarla).'); return;
    }
  }
}
function usuarioModal(d) {
  d = d || {}; const e = E('usuario');
  openModal(`<h2>Nuevo usuario</h2><form data-form="usuario" novalidate>${field('Nombre completo', 'uname', `<input id="uname" name="name" type="text" value="${esc(d.name || '')}">`, '', e.uname)}${field('Correo', 'uemail', `<input id="uemail" name="email" type="email" value="${esc(d.email || '')}">`, '', e.uemail)}${field('Rol', 'role', select('role', { enc: ROLES.enc, ctl: ROLES.ctl, own: ROLES.own }, d.role || 'enc'))}${field('Sucursal (solo encargadas)', 'branch', select('branch', BR, d.branch || 'chal'))}<div class="acts"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn primary" type="submit">Crear usuario</button></div></form>`);
}

/* ---------- eventos ---------- */
document.addEventListener('click', ev => {
  if (ev.target.id === 'modal') return closeModal();
  const el = ev.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act; const u = me();
  switch (a) {
    case 'go': if (el.dataset.f) ui.filter = el.dataset.f; return go(el.dataset.v);
    case 'logout': S.session = null; S.view = null; ui.d = {}; ui.step = 1; ui.foto = null; save(); closeModal(); return render();
    case 'demo': { const x = S.users.find(v => v.email === el.dataset.u); S.session = x.id; S.view = NAV[x.role][0][0]; save(); render(); armIdle(); return toast('Bienvenido/a', x.name); }
    case 'close': return closeModal();
    case 'notifs': return showNotifs();
    case 'step1': ui.step = 1; return render();
    case 'filter': ui.filter = el.dataset.f; return render();
    case 'tab': ui.tab[el.dataset.k] = el.dataset.v; return render();
    case 'gasto-det': return gastoModal(Number(el.dataset.id));
    case 'gasto-force': closeModal(); return saveGasto();
    case 'repo-send': {
      const c = caja(u.branch); const items = c.usados.filter(g => !g.reqId); if (c.pct < UMBRAL_REPO || pendientesRepo(u.branch) || !items.length) return;
      const id = 'R' + nid(); items.forEach(g => g.reqId = id); S.solicitudes.push({ id, tipo: 'repo', branch: u.branch, by: u.id, monto: r2(sum(items, 'monto')), desc: 'Reposición de caja chica (70 % liquidado)', items: items.map(g => g.id), estado: 'pendiente', hist: [{ ts: Date.now(), who: u.name, estado: 'Enviada', c: '' }] });
      notify('own', `Solicitud de reposición de caja chica en ${BR[u.branch]} (${money(sum(items, 'monto'))}).`); save(); render(); return toast('Solicitud enviada', 'La Dirección General fue notificada.');
    }
    case 'decidir': return decidir(el.dataset.id, el.dataset.d === 'ok');
    case 'atender': { const r = S.solicitudes.find(x => x.id === el.dataset.id); r.estado = 'atendida'; r.hist.push({ ts: Date.now(), who: u.name, estado: 'Atendida', c: '' }); notify(r.by, `Tu pedido de insumos (${r.desc}) fue atendido.`); save(); render(); return toast('Pedido atendido', 'Se notificó a la sucursal.'); }
    case 'reclamar': { const g = S.gastos.find(x => x.id === Number(el.dataset.id)); notify(g.by, `Control te pide completar el comprobante de ${g.proveedor} (${money(g.monto)}).`); save(); return toast('Aviso enviado', 'La encargada recibió la notificación.'); }
    case 'revisar': { S.gastos.find(x => x.id === Number(el.dataset.id)).rev = true; save(); render(); return toast('Excepción revisada', ''); }
    case 'refresh': return render();
    case 'toggle-user': { const x = S.users.find(v => v.id === el.dataset.id); x.activo = !x.activo; save(); render(); return toast(x.activo ? 'Usuario activado' : 'Usuario desactivado', x.name); }
    case 'nuevo-usuario': ui.errs.usuario = {}; return usuarioModal();
    case 'cuadro-reset': delete S.cuadro[u.branch]; ui.tab.cu = null; save(); return render();
    case 'reset': if (confirm('¿Restablecer todos los datos de demostración?')) { S = seed(); ui.d = {}; ui.errs = {}; save(); render(); toast('Datos restablecidos', ''); } return;
  }
});
document.addEventListener('submit', ev => { const f = ev.target.closest('form[data-form]'); if (!f) return; ev.preventDefault(); submit(f.dataset.form, f); });
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.id === 'foto') return processImage(el.files[0], (err, url) => { if (err) { ui.errs.gasto = { foto: err }; ui.foto = null; } else { ui.foto = url; ui.errs.gasto = {}; toast('Foto adjuntada', 'Se comprimió para ahorrar datos.'); } const d = ui.d.gasto; const fm = $('form[data-form=gasto2]'); if (fm && d) { d.tipo = fm.tipo.value; d.nrc = fm.nrc.checked; } render(); });
  if (el.id === 'fotofix') return processImage(el.files[0], (err, url) => { $('#fixerr').textContent = err || ''; if (!err) { ui.fotoFix = url; $('#fixprev').innerHTML = `<img class="preview" src="${url}" alt="Vista previa">`; } });
  if (el.hasAttribute('data-rerender')) { const fm = el.closest('form[data-form]'); if (fm) { const k = fm.dataset.form; const fd = {}; new FormData(fm).forEach((v, n) => fd[n] = v); if (k === 'gasto1') Object.assign(ui.d.gasto, fd); else if (k === 'sol') ui.d.sol = Object.assign(ui.d.sol || {}, fd); else if (k === 'merma') ui.d.merma = { prod: fd.prod }; } render(); }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !$('#modal').hidden) closeModal(); });

/* cierre por inactividad (RNF-16) */
let idle = null;
function armIdle() { clearTimeout(idle); if (!S.session) return; idle = setTimeout(() => { S.session = null; save(); closeModal(); render(); toast('Sesión cerrada', 'Se cerró por inactividad.', 'warn'); }, 10 * 60 * 1000); }
['click', 'keydown', 'touchstart'].forEach(t => document.addEventListener(t, armIdle, { passive: true }));

render(); armIdle();
})();
