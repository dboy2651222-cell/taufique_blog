/* script.js — data + render + admin (localStorage) */

/* ---------- sample posts (you can edit in admin) ----------
 each post: {id, title, slug, img, excerpt, content(html), tags:[..], category, date}
------------------------------------------------------------*/
const STORAGE_KEY = 'taufique_posts_v1';

const DEFAULT_POSTS = [
  {
    id:'b1',
    title:"Wear the Code — Why Design Matters in Dev",
    slug:"wear-the-code",
    img:"https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1200&q=80",
    excerpt:"Design isn’t just pixels — it’s feeling. How design choices change the way people trust your product.",
    content:`<p>Design drives trust. A clean interface tells your user: I care about details. As a developer you must think like a designer — typography, spacing and light.</p>
             <h3>Small things matter</h3><p>Micro-interactions... (write your full article here).</p>`,
    tags:['design','product'],
    category:'Design',
    date:'2025-08-01'
  },
  {
    id:'b2',
    title:"From Idea to Launch — My 30 Day Workflow",
    slug:"30-day-workflow",
    img:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    excerpt:"A step-by-step playbook I follow to ship projects fast — cut the noise, build the thing.",
    content:`<p>If you want speed, you need a plan. Day 1 to 7: research. Day 8 to 21: build fast. Day 22 to 30: polish & launch.</p>`,
    tags:['workflow','startup'],
    category:'Productivity',
    date:'2025-06-20'
  },
  {
    id:'b3',
    title:"The Quiet Hustle — Mindset Over Hype",
    slug:"quiet-hustle",
    img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    excerpt:"Hustle doesn’t mean noise. It means showing up and doing the work every single day.",
    content:`<p>Results are the language that speaks when words fail. Focus on output, not applause.</p>`,
    tags:['mindset','life'],
    category:'Mindset',
    date:'2025-04-05'
  }
];

/* ---------- storage helpers ---------- */
function loadPosts(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){ localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS)); return DEFAULT_POSTS }
  try{ return JSON.parse(raw) }catch(e){ return DEFAULT_POSTS }
}
function savePosts(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) }

/* ---------- helpers ---------- */
function q(sel,root=document){return root.querySelector(sel)}
function qAll(sel,root=document){return Array.from(root.querySelectorAll(sel))}
function uid(prefix='p'){return prefix+Math.random().toString(36).slice(2,9)}
function formatDate(d){ const dt=new Date(d); return dt.toLocaleDateString() }

/* ---------- HOME (index.html) ---------- */
function renderHome(){
  const posts = loadPosts()
  // hero featured (first post)
  const featured = posts[0]
  if(q('#hero-title')){ q('#hero-title').innerText = featured.title; q('#hero-excerpt').innerText = featured.excerpt; q('#hero-img').src = featured.img }
  // grid
  const grid = q('#posts-grid'); grid.innerHTML = ''
  posts.forEach(p=>{
    const div=document.createElement('div'); div.className='post-card fade-up'
    div.innerHTML = `<img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><div class="meta small">${formatDate(p.date)} • ${p.category}</div><p class="small" style="margin-top:8px">${p.excerpt}</p>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
      <a href="post.html?id=${p.id}" class="btn-ghost">Read</a>
      <div class="small" style="color:var(--muted)">${p.tags.map(t=>`<span style="margin-right:6px;color:var(--accent1)">#${t}</span>`).join('')}</div>
      </div>`
    grid.appendChild(div)
  })
  // sidebar recent
  const recent = q('#recent-list'); recent.innerHTML = ''; posts.slice(0,4).forEach(p=>{
    const li = document.createElement('div'); li.className='small'; li.innerHTML = `<a href="post.html?id=${p.id}" style="color:var(--accent1);text-decoration:none">${p.title}</a><div style="color:var(--muted);font-size:13px">${formatDate(p.date)}</div>`
    recent.appendChild(li)
  })
}

/* ---------- POST PAGE (post.html) ---------- */
function renderPost(){
  const posts = loadPosts()
  const url = new URL(location.href)
  const id = url.searchParams.get('id') || posts[0].id
  const p = posts.find(x=>x.id===id) || posts[0]
  q('#post-title').innerText = p.title
  q('#post-meta').innerText = `${formatDate(p.date)} • ${p.category} • ${p.tags.join(', ')}`
  q('#post-img').src = p.img
  q('#post-content').innerHTML = p.content
  // set document title
  document.title = p.title + ' — Taufique'
  // share links
  q('#share-twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}%20${encodeURIComponent(location.href)}`
  q('#share-link').value = location.href
}

/* ---------- ADMIN (admin.html) ---------- */
function initAdmin(){
  // simple form submit
  q('#admin-form').addEventListener('submit', e=>{
    e.preventDefault()
    const posts = loadPosts()
    const id = uid('b')
    const title = q('#a-title').value.trim()
    const slug = title.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'')
    const img = q('#a-img').value.trim() || 'https://source.unsplash.com/1200x600/?tech'
    const excerpt = q('#a-excerpt').value.trim()
    const content = q('#a-content').value.trim()
    const tags = q('#a-tags').value.split(',').map(s=>s.trim()).filter(Boolean)
    const category = q('#a-category').value.trim() || 'General'
    const date = new Date().toISOString()
    posts.unshift({id,title,slug,img,excerpt,content,tags,category,date})
    savePosts(posts)
    alert('Post added to local storage — visit home to see it.')
    q('#admin-form').reset()
  })
  // clear posts (danger)
  q('#clear-storage').addEventListener('click', ()=>{
    if(confirm('Clear ALL local posts and restore defaults?')){ localStorage.removeItem(STORAGE_KEY); alert('Cleared — reload page.'); location.reload(); }
  })
}

/* ---------- small init for index/shop/post pages ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.body.classList.contains('home')) renderHome()
  if(document.body.classList.contains('post')) renderPost()
  if(document.body.classList.contains('admin')) initAdmin()
})
