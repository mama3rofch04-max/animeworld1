// Basic dynamic data + interactive behaviors for Anime Yanna
const latest = [
  { id:1, title:"Attack on Titan - الحلقة 28", img:"https://i.imgur.com/u6lZt3y.jpg", meta:"الموسم 4 • الحلقة 28", video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:2, title:"Demon Slayer - الحلقة 12", img:"https://i.imgur.com/tGbaZCY.jpg", meta:"الموسم 2 • الحلقة 12", video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:3, title:"One Piece - الحلقة 1052", img:"https://i.imgur.com/8Km9tLL.jpg", meta:"الموسم 20 • الحلقة 1052", video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" }
];

const allAnime = [
  { id:101, title:"Attack on Titan", img:"https://i.imgur.com/u6lZt3y.jpg", eps:28 },
  { id:102, title:"Demon Slayer", img:"https://i.imgur.com/tGbaZCY.jpg", eps:26 },
  { id:103, title:"One Piece", img:"https://i.imgur.com/8Km9tLL.jpg", eps:1052 },
  { id:104, title:"My Hero Academia", img:"https://i.imgur.com/2WZt6tS.jpg", eps:140 }
];

// render helper
function el(tag, cls='', attrs={}){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function renderGrid(list, containerId, isLatest=false){
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = '';
  list.forEach(item=>{
    const card = el('div','anime-card');
    const img = el('img','anime-thumb',{src:item.img, alt:item.title});
    const body = el('div','anime-body');
    const h = el('h3','anime-title'); h.textContent = item.title;
    const meta = el('div','anime-meta'); meta.textContent = isLatest ? item.meta : (item.eps ? `${item.eps} حلقة` : '');
    const btn = el('button','watch-btn'); btn.textContent = 'مشاهدة';
    btn.addEventListener('click',()=> openModal(item));
    body.appendChild(h);
    body.appendChild(meta);
    body.appendChild(btn);
    card.appendChild(img);
    card.appendChild(body);
    wrap.appendChild(card);
  });
}

function openModal(item){
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  document.getElementById('modal-title').textContent = item.title || 'عنوان الحلقة';
  document.getElementById('modal-desc').textContent = item.meta || (item.eps ? `${item.eps} حلقة` : '');
  video.src = item.video || '';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  video.play().catch(()=>{ /* ignore autoplay block */ });
}

function closeModal(){
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  video.pause();
  video.src = '';
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

// search
function searchTerm(q){
  q = q.trim().toLowerCase();
  if(!q) { renderGrid(allAnime, 'all-grid'); renderGrid(latest, 'latest-grid', true); return; }
  const res = allAnime.filter(a=> a.title.toLowerCase().includes(q) );
  renderGrid(res, 'all-grid');
}

// theme toggle (simple)
function toggleTheme(){
  const root = document.documentElement;
  if(root.style.getPropertyValue('--bg') === '#0b0b0d'){
    root.style.setProperty('--bg','#f6f7fb');
    root.style.setProperty('--card','#ffffff');
    root.style.setProperty('--muted','#4a4a4a');
    root.style.setProperty('--accent','#ff6a00');
    document.body.style.color = '#0b0b0d';
  } else {
    root.style.setProperty('--bg','#0b0b0d');
    root.style.setProperty('--card','#111217');
    root.style.setProperty('--muted','#bfbfc5');
    document.body.style.color = '#fff';
  }
}

// init
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  renderGrid(latest,'latest-grid', true);
  renderGrid(allAnime,'all-grid');
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.getElementById('search-input').addEventListener('input', e=> searchTerm(e.target.value));
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // delegate play button in featured
  document.querySelector('.featured-card .play').addEventListener('click', function(){
    const v = this.dataset.video;
    openModal({ title: 'حلقات مميزة', meta:'Featured', video: v });
  });
});
