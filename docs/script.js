// ============================================
// BLISS WEBSITE - SINGLE SHARED JAVASCRIPT
// All pages, all interactivity, all animations
// ============================================

const ICONS = {
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  terminal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  "git-branch": '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  hexagon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  shield: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  database: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  layers: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  zap: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  "hard-drive": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>',
  radio: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',
  rocket: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  box: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  cloud: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  feather: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>',
  puzzle: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 7.85c-.049.014-.1.025-.151.036A3.994 3.994 0 0 0 15 4.784V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.784A3.994 3.994 0 0 0 4.712 7.886c-.051-.011-.102-.022-.151-.036A2.5 2.5 0 0 0 2 10.25V14a2 2 0 0 0 2 2h1.5v2.25a2.5 2.5 0 0 0 4.9.814c.049.014.1.025.151.036A3.994 3.994 0 0 0 14 19.216V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.784a3.994 3.994 0 0 0 3.837-3.066c.051.011.102.022.151.036A2.5 2.5 0 0 0 22 13.75V10a2 2 0 0 0-2-2h-1.5V5.75a2.5 2.5 0 0 1-4.061-1.9z"/></svg>',
  lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  gauge: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
  code: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  "book-open": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  "message-circle": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  "dollar-sign": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  star: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  download: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  leaf: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  key: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  twitter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/></svg>',
  copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  external: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  x: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  checkSquare: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
};

function getLogoSVG(color, size) {
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 4L58 19v26L32 60L6 45V19L32 4z" stroke="' + color + '" stroke-width="2" fill="none" opacity="0.3"/><path d="M32 8L54 21v22L32 56L10 43V21L32 8z" stroke="' + color + '" stroke-width="2" fill="none"/><path d="M32 14L48 24v16L32 50L16 40V24L32 14z" fill="' + color + '" opacity="0.1"/><path d="M28 20L36 20L32 32L40 32L30 44L32 32L24 32L28 20Z" fill="' + color + '"/><circle cx="32" cy="32" r="3" fill="' + color + '"/></svg>';
}

function getLogoFullSVG(color, textColor, size) {
  return '<svg width="' + (size * 4) + '" height="' + size + '" viewBox="0 0 256 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 4L58 19v26L32 60L6 45V19L32 4z" stroke="' + color + '" stroke-width="2" fill="none" opacity="0.3"/><path d="M32 8L54 21v22L32 56L10 43V21L32 8z" stroke="' + color + '" stroke-width="2" fill="none"/><path d="M32 14L48 24v16L32 50L16 40V24L32 14z" fill="' + color + '" opacity="0.1"/><path d="M28 20L36 20L32 32L40 32L30 44L32 32L24 32L28 20Z" fill="' + color + '"/><circle cx="32" cy="32" r="3" fill="' + color + '"/><text x="72" y="42" font-family="Inter, sans-serif" font-size="28" font-weight="700" fill="' + textColor + '">Bliss</text></svg>';
}

// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particleCount = Math.min(Math.floor(window.innerWidth / 15), 80);
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }
      }
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 212, 170, ' + p.opacity + ')';
      this.ctx.fill();
    }
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = 'rgba(0, 212, 170, ' + (0.15 * (1 - dist / 150)) + ')';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .stagger-children');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  reveals.forEach(el => observer.observe(el));
}

// ============================================
// NAVIGATION
// ============================================
function renderNavigation() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  
  let linksHTML = '';
  for (let i = 0; i < NAV_DATA.links.length; i++) {
    const link = NAV_DATA.links[i];
    const activeClass = link.id === currentPage ? 'active' : '';
    const icon = ICONS[link.icon] || '';
    linksHTML += '<li><a href="' + link.url + '" class="' + activeClass + '">' + icon + ' ' + link.label + '</a></li>';
  }
  
  const navHTML = '<nav class="nav" id="main-nav">' +
    '<a href="index.html" class="nav-brand">' +
      getLogoSVG('#00d4aa', 32) +
      '<span>' + NAV_DATA.brand.name + '</span>' +
    '</a>' +
    '<ul class="nav-links">' + linksHTML + '</ul>' +
    '<div class="nav-cta">' +
      '<a href="' + NAV_DATA.cta.secondary.url + '" class="btn btn-secondary btn-sm" target="_blank">' +
        ICONS.github + ' GitHub' +
      '</a>' +
      '<a href="' + NAV_DATA.cta.primary.url + '" class="btn btn-primary btn-sm">' +
        NAV_DATA.cta.primary.label + ' ' + ICONS.arrowRight +
      '</a>' +
    '</div>' +
    '<div class="mobile-toggle" id="mobile-toggle">' +
      '<span></span><span></span><span></span>' +
    '</div>' +
  '</nav>';
  
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('main-nav');
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('mobile-open');
    document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
  });
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ============================================
// FOOTER
// ============================================
function renderFooter() {
  let socialHTML = '';
  for (let i = 0; i < NAV_DATA.social.length; i++) {
    const s = NAV_DATA.social[i];
    socialHTML += '<a href="' + s.url + '" target="_blank" aria-label="' + s.name + '">' + (ICONS[s.icon] || '') + '</a>';
  }
  
  const footerHTML = '<footer class="footer">' +
    '<div class="footer-grid">' +
      '<div>' +
        '<div class="footer-brand">' + getLogoSVG('#00d4aa', 28) + '<span>' + NAV_DATA.brand.name + '</span></div>' +
        '<p class="footer-description">' + NAV_DATA.brand.tagline + '<br>Built for developers who ship.</p>' +
        '<div class="footer-social">' + socialHTML + '</div>' +
      '</div>' +
      '<div class="footer-column">' +
        '<h4>Product</h4>' +
        '<ul>' +
          '<li><a href="docs.html">Documentation</a></li>' +
          '<li><a href="playground.html">Playground</a></li>' +
          '<li><a href="brand.html">Brand Assets</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer-column">' +
        '<h4>Community</h4>' +
        '<ul>' +
          '<li><a href="contribute.html">Contribute</a></li>' +
          // '<li><a href="https://discord.gg/bliss" target="_blank">Discord</a></li>' +
          '<li><a href="https://github.com/mtg9ing/bliss/discussions" target="_blank">Discussions</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer-column">' +
        '<h4>Company</h4>' +
        '<ul>' +
          '<li><a href="about.html">About</a></li>' +
          '<li><a href="https://github.com/mtg9ing/bliss" target="_blank">GitHub</a></li>' +
          '<li><a href="#" onclick="alert(\'Coming soon!\')">Blog</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<p>&copy; ' + new Date().getFullYear() + ' Bliss. Open source under MIT license.</p>' +
      '<div class="footer-bottom-links">' +
        '<a href="#" onclick="alert(\'Coming soon!\')">Privacy</a>' +
        '<a href="#" onclick="alert(\'Coming soon!\')">Terms</a>' +
      '</div>' +
    '</div>' +
  '</footer>';
  
  document.querySelector('.main').insertAdjacentHTML('afterend', footerHTML);
}


// ============================================
// HOMEPAGE RENDERER
// ============================================
function renderHomepage() {
  const hero = HOME_DATA.hero;
  const features = HOME_DATA.features;
  const howItWorks = HOME_DATA.howItWorks;
  const testimonials = HOME_DATA.testimonials;
  const terminal = HOME_DATA.terminal;
  
  let featuresHTML = '';
  for (let i = 0; i < features.items.length; i++) {
    const f = features.items[i];
    featuresHTML += '<div class="feature-card" style="--card-color: ' + f.color + '">' +
      '<div class="feature-icon">' + (ICONS[f.icon] || '') + '</div>' +
      '<h3>' + f.title + '</h3>' +
      '<p>' + f.description + '</p>' +
      '<span class="feature-code">' + f.code + '</span>' +
    '</div>';
  }
  
  let stepsHTML = '';
  for (let i = 0; i < howItWorks.steps.length; i++) {
    const s = howItWorks.steps[i];
    stepsHTML += '<div class="step">' +
      '<div class="step-num">' + s.num + '</div>' +
      '<h3>' + s.title + '</h3>' +
      '<p>' + s.description + '</p>' +
      '<div class="step-code">' + s.command + '</div>' +
    '</div>';
  }
  
  let terminalHTML = '';
  for (let i = 0; i < terminal.lines.length; i++) {
    const l = terminal.lines[i];
    terminalHTML += '<div class="terminal-line ' + l.type + '" style="animation-delay: ' + (i * 0.3) + 's">' + l.content + '</div>';
  }
  
  let testimonialsHTML = '';
  for (let i = 0; i < testimonials.items.length; i++) {
    const t = testimonials.items[i];
    let starsHTML = '';
    for (let j = 0; j < t.rating; j++) {
      starsHTML += ICONS.star;
    }
    testimonialsHTML += '<div class="testimonial-card">' +
      '<div class="testimonial-stars">' + starsHTML + '</div>' +
      '<p class="testimonial-text">' + t.text + '</p>' +
      '<div class="testimonial-author">' +
        '<div class="testimonial-avatar">' + t.avatar + '</div>' +
        '<div>' +
          '<div class="testimonial-name">' + t.name + '</div>' +
          '<div class="testimonial-role">' + t.role + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  
  let statsHTML = '';
  for (let i = 0; i < hero.stats.length; i++) {
    const s = hero.stats[i];
    statsHTML += '<div class="hero-stat">' +
      '<div class="hero-stat-value">' + s.value + '</div>' +
      '<div class="hero-stat-label">' + s.label + '</div>' +
    '</div>';
  }
  
  const html = '<section class="hero">' +
    '<div class="hero-content">' +
      '<div class="hero-badge">' +
        '<span class="pulse"></span>' +
        'v2.0 is now available' +
      '</div>' +
      '<h1>' + hero.headline + '<br><span class="accent">' + hero.headlineAccent + '</span></h1>' +
      '<p class="hero-description">' + hero.subheadline + '</p>' +
      '<div class="hero-actions">' +
        '<button class="btn btn-primary btn-lg" onclick="copyToClipboard(\'' + hero.cta.primary.label + '\')">' +
          hero.cta.primary.label + ' ' + ICONS.copy +
        '</button>' +
        '<a href="' + hero.cta.secondary.url + '" class="btn btn-secondary btn-lg">' +
          hero.cta.secondary.label + ' ' + ICONS.arrowRight +
        '</a>' +
      '</div>' +
      '<div class="hero-stats">' + statsHTML + '</div>' +
    '</div>' +
    '<div class="hero-float hero-float-1"><span style="color:var(--primary)">❯</span> bliss init</div>' +
    '<div class="hero-float hero-float-2"><span style="color:var(--primary)">❯</span> bliss deploy</div>' +
    '<div class="hero-float hero-float-3"><span style="color:var(--primary)">❯</span> bliss add auth</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal">' +
      '<h2>' + features.title + '<br><span class="accent">' + features.titleAccent + '</span></h2>' +
    '</div>' +
    '<div class="features-grid stagger-children">' + featuresHTML + '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal">' +
      '<h2>' + howItWorks.title + '</h2>' +
    '</div>' +
    '<div class="steps stagger-children">' + stepsHTML + '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal">' +
      '<h2>' + terminal.title + '</h2>' +
    '</div>' +
    '<div class="terminal reveal">' +
      '<div class="terminal-header">' +
        '<span class="terminal-dot red"></span>' +
        '<span class="terminal-dot yellow"></span>' +
        '<span class="terminal-dot green"></span>' +
        '<span class="terminal-title">bliss — zsh</span>' +
      '</div>' +
      '<div class="terminal-body" id="terminal-body">' +
        terminalHTML +
        '<div class="terminal-line input" style="animation-delay: ' + (terminal.lines.length * 0.3) + 's"><span class="terminal-cursor"></span></div>' +
      '</div>' +
    '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal">' +
      '<h2>' + testimonials.title + '</h2>' +
    '</div>' +
    '<div class="testimonials-grid stagger-children">' + testimonialsHTML + '</div>' +
  '</section>';
  
  document.getElementById('app').innerHTML = html;
}

// ============================================
// DOCS PAGE RENDERER
// ============================================
function renderDocsPage() {
  let navHTML = '';
  for (let i = 0; i < DOCS_DATA.sections.length; i++) {
    const s = DOCS_DATA.sections[i];
    navHTML += '<li><a href="#' + s.id + '" class="docs-link" data-section="' + s.id + '">' + (ICONS[s.icon] || '') + ' ' + s.title + '</a></li>';
  }
  
  let contentHTML = '';
  for (let i = 0; i < DOCS_DATA.sections.length; i++) {
    const section = DOCS_DATA.sections[i];
    let blocksHTML = '';
    for (let j = 0; j < section.content.length; j++) {
      const block = section.content[j];
      if (block.type === 'heading') {
        blocksHTML += '<h' + block.level + '>' + block.text + '</h' + block.level + '>';
      } else if (block.type === 'paragraph') {
        blocksHTML += '<p>' + block.text + '</p>';
      } else if (block.type === 'code') {
        blocksHTML += '<div class="code-block">' +
          '<div class="code-block-header">' +
            '<span class="code-block-lang">' + block.language + '</span>' +
            '<button class="code-block-copy" onclick="copyToClipboard(this.nextElementSibling.textContent)">' + ICONS.copy + '</button>' +
            '<pre><code>' + escapeHtml(block.code) + '</code></pre>' +
          '</div>' +
        '</div>';
      } else if (block.type === 'table') {
        let headersHTML = '';
        for (let h = 0; h < block.headers.length; h++) {
          headersHTML += '<th>' + block.headers[h] + '</th>';
        }
        let rowsHTML = '';
        for (let r = 0; r < block.rows.length; r++) {
          let cellsHTML = '';
          for (let c = 0; c < block.rows[r].length; c++) {
            cellsHTML += '<td>' + block.rows[r][c] + '</td>';
          }
          rowsHTML += '<tr>' + cellsHTML + '</tr>';
        }
        blocksHTML += '<table class="docs-table"><thead><tr>' + headersHTML + '</tr></thead><tbody>' + rowsHTML + '</tbody></table>';
      }
    }
    contentHTML += '<section class="docs-section" id="' + section.id + '"><h2>' + section.title + '</h2>' + blocksHTML + '</section>';
  }
  
  const html = '<div class="section" style="padding-top: 8rem;">' +
    '<div class="docs-layout">' +
      '<aside class="docs-sidebar reveal">' +
        '<div class="docs-sidebar-title">On this page</div>' +
        '<ul class="docs-nav">' + navHTML + '</ul>' +
      '</aside>' +
      '<div class="docs-content">' + contentHTML + '</div>' +
    '</div>' +
  '</div>';
  
  document.getElementById('app').innerHTML = html;
  
  const sections = document.querySelectorAll('.docs-section');
  const navLinks = document.querySelectorAll('.docs-link');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        for (let i = 0; i < navLinks.length; i++) {
          navLinks[i].classList.remove('active');
        }
        const activeLink = document.querySelector('[data-section="' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  
  for (let i = 0; i < sections.length; i++) {
    observer.observe(sections[i]);
  }
}

// ============================================
// ABOUT PAGE RENDERER
// ============================================
function renderAboutPage() {
  let milestonesHTML = '';
  for (let i = 0; i < ABOUT_DATA.story.milestones.length; i++) {
    const m = ABOUT_DATA.story.milestones[i];
    milestonesHTML += '<div class="timeline-item reveal reveal-delay-' + (i + 1) + '">' +
      '<div class="timeline-dot"></div>' +
      '<div class="timeline-content">' +
        '<div class="timeline-year">' + m.year + '</div>' +
        '<div class="timeline-event">' + m.event + '</div>' +
      '</div>' +
    '</div>';
  }
  
  let paragraphsHTML = '';
  for (let i = 0; i < ABOUT_DATA.story.paragraphs.length; i++) {
    paragraphsHTML += '<p style="color:var(--text-muted); margin-bottom: 1.5rem; line-height: 1.8;">' + ABOUT_DATA.story.paragraphs[i] + '</p>';
  }
  
  let valuesHTML = '';
  for (let i = 0; i < ABOUT_DATA.values.items.length; i++) {
    const v = ABOUT_DATA.values.items[i];
    valuesHTML += '<div class="value-card">' +
      '<div class="value-icon">' + (ICONS[v.icon] || '') + '</div>' +
      '<h3>' + v.title + '</h3>' +
      '<p style="color:var(--text-muted); font-size: 0.95rem;">' + v.description + '</p>' +
    '</div>';
  }
  
  let teamHTML = '';
  for (let i = 0; i < ABOUT_DATA.team.members.length; i++) {
    const m = ABOUT_DATA.team.members[i];
    teamHTML += '<div class="team-card">' +
      '<div class="team-avatar">' + m.avatar + '</div>' +
      '<h3>' + m.name + '</h3>' +
      '<p style="color:var(--primary); font-size: 0.9rem; margin-bottom: 0.75rem;">' + m.role + '</p>' +
      '<p style="color:var(--text-muted); font-size: 0.9rem;">' + m.bio + '</p>' +
    '</div>';
  }
  
  const html = '<section class="hero" style="min-height: 60vh;">' +
    '<div class="hero-content">' +
      '<h1>' + ABOUT_DATA.hero.title + '<br><span class="accent">' + ABOUT_DATA.hero.titleAccent + '</span></h1>' +
      '<p class="hero-description">' + ABOUT_DATA.hero.description + '</p>' +
    '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal"><h2>' + ABOUT_DATA.story.title + '</h2></div>' +
    '<div class="story-timeline">' + milestonesHTML + '</div>' +
    '<div style="max-width: 700px; margin: 3rem auto 0;">' + paragraphsHTML + '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal"><h2>' + ABOUT_DATA.values.title + '</h2></div>' +
    '<div class="values-grid stagger-children">' + valuesHTML + '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal"><h2>' + ABOUT_DATA.team.title + '</h2></div>' +
    '<div class="team-grid stagger-children">' + teamHTML + '</div>' +
  '</section>';
  
  document.getElementById('app').innerHTML = html;
}

// ============================================
// PLAYGROUND PAGE RENDERER
// ============================================
function renderPlaygroundPage() {
  let controlsHTML = '';
  for (let i = 0; i < PLAYGROUND_DATA.demo.commands.length; i++) {
    const cmd = PLAYGROUND_DATA.demo.commands[i];
    controlsHTML += '<button class="playground-btn ' + (i === 0 ? 'active' : '') + '" data-cmd="' + i + '" onclick="runPlaygroundCommand(' + i + ')">' + cmd.cmd + '</button>';
  }
  
  const firstCmd = PLAYGROUND_DATA.demo.commands[0];
  let firstOutputHTML = '';
  for (let i = 0; i < firstCmd.output.length; i++) {
    firstOutputHTML += '<div class="terminal-line output">' + firstCmd.output[i] + '</div>';
  }
  
  let modulesHTML = '';
  for (let i = 0; i < PLAYGROUND_DATA.configurator.modules.length; i++) {
    const m = PLAYGROUND_DATA.configurator.modules[i];
    modulesHTML += '<div class="configurator-item" data-module="' + m.id + '" onclick="toggleModule(\'' + m.id + '\')">' +
      '<div class="checkbox">' + ICONS.check + '</div>' +
      '<div style="display:flex; align-items:center; gap:0.75rem;">' +
        '<span style="color:' + m.color + '">' + (ICONS[m.icon] || '') + '</span>' +
        '<span style="font-weight:600;">' + m.name + '</span>' +
      '</div>' +
    '</div>';
  }
  
  const html = '<section class="hero" style="min-height: 50vh;">' +
    '<div class="hero-content">' +
      '<h1>' + PLAYGROUND_DATA.hero.title + '<br><span class="accent">' + PLAYGROUND_DATA.hero.titleAccent + '</span></h1>' +
      '<p class="hero-description">' + PLAYGROUND_DATA.hero.description + '</p>' +
    '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal"><h2>' + PLAYGROUND_DATA.demo.title + '</h2></div>' +
    '<div class="playground-terminal reveal">' +
      '<div class="playground-controls" id="playground-controls">' + controlsHTML + '</div>' +
      '<div class="terminal">' +
        '<div class="terminal-header">' +
          '<span class="terminal-dot red"></span>' +
          '<span class="terminal-dot yellow"></span>' +
          '<span class="terminal-dot green"></span>' +
          '<span class="terminal-title">playground — bash</span>' +
        '</div>' +
        '<div class="terminal-body" id="playground-output">' +
          '<div class="terminal-line input">' + firstCmd.cmd + '</div>' +
          firstOutputHTML +
          '<div class="terminal-line input"><span class="terminal-cursor"></span></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal">' +
      '<h2>' + PLAYGROUND_DATA.configurator.title + '</h2>' +
      '<p>' + PLAYGROUND_DATA.configurator.description + '</p>' +
    '</div>' +
    '<div class="configurator reveal">' +
      '<div class="configurator-grid" id="configurator-grid">' + modulesHTML + '</div>' +
      '<div class="configurator-preview" id="config-preview">' +
        '<div style="color:var(--text-dim); margin-bottom:0.5rem;">// bliss.config.js</div>' +
        '<div id="config-code">export default {\n  project: "my-app",\n  modules: []\n};</div>' +
      '</div>' +
    '</div>' +
  '</section>';
  
  document.getElementById('app').innerHTML = html;
}

// Playground command runner
function runPlaygroundCommand(index) {
  const buttons = document.querySelectorAll('.playground-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  buttons[index].classList.add('active');
  
  const cmd = PLAYGROUND_DATA.demo.commands[index];
  const output = document.getElementById('playground-output');
  
  let outputHTML = '<div class="terminal-line input">' + cmd.cmd + '</div>';
  for (let i = 0; i < cmd.output.length; i++) {
    outputHTML += '<div class="terminal-line output">' + cmd.output[i] + '</div>';
  }
  outputHTML += '<div class="terminal-line input"><span class="terminal-cursor"></span></div>';
  
  output.innerHTML = outputHTML;
  
  const lines = output.querySelectorAll('.terminal-line');
  for (let i = 0; i < lines.length; i++) {
    lines[i].style.animation = 'none';
    lines[i].offsetHeight;
    lines[i].style.animation = 'terminalLineIn 0.3s ease-out ' + (i * 0.1) + 's forwards';
  }
}

// Module configurator
let selectedModules = [];
function toggleModule(id) {
  const item = document.querySelector('[data-module="' + id + '"]');
  
  if (selectedModules.includes(id)) {
    selectedModules = selectedModules.filter(function(m) { return m !== id; });
    item.classList.remove('selected');
  } else {
    selectedModules.push(id);
    item.classList.add('selected');
  }
  
  updateConfigPreview();
}

function updateConfigPreview() {
  const code = document.getElementById('config-code');
  if (selectedModules.length === 0) {
    code.textContent = 'export default {\n  project: "my-app",\n  modules: []\n};';
  } else {
    let modulesText = '';
    for (let i = 0; i < selectedModules.length; i++) {
      const id = selectedModules[i];
      modulesText += '    "' + id + '"';
      if (i < selectedModules.length - 1) modulesText += ',\n';
    }
    code.textContent = 'export default {\n  project: "my-app",\n  modules: [\n' + modulesText + '\n  ]\n};';
  }
}


// ============================================
// CONTRIBUTE PAGE RENDERER
// ============================================
function renderContributePage() {
  let waysHTML = '';
  for (let i = 0; i < CONTRIBUTE_DATA.ways.items.length; i++) {
    const w = CONTRIBUTE_DATA.ways.items[i];
    waysHTML += '<div class="way-card">' +
      '<div class="way-icon">' + (ICONS[w.icon] || '') + '</div>' +
      '<h3>' + w.title + '</h3>' +
      '<p>' + w.description + '</p>' +
      '<a href="' + w.link + '" target="_blank" class="btn btn-primary" style="width:100%;">' +
        'Get Started ' + ICONS.external +
      '</a>' +
    '</div>';
  }
  
  let statsHTML = '';
  for (let i = 0; i < CONTRIBUTE_DATA.stats.items.length; i++) {
    const s = CONTRIBUTE_DATA.stats.items[i];
    statsHTML += '<div class="community-stat">' +
      '<div class="community-stat-icon">' + (ICONS[s.icon] || '') + '</div>' +
      '<div class="community-stat-value">' + s.value + '</div>' +
      '<div class="community-stat-label">' + s.label + '</div>' +
    '</div>';
  }
  
  let guidelinesHTML = '';
  for (let i = 0; i < CONTRIBUTE_DATA.guidelines.steps.length; i++) {
    const g = CONTRIBUTE_DATA.guidelines.steps[i];
    guidelinesHTML += '<div class="guideline-step reveal reveal-delay-' + (i + 1) + '">' +
      '<div class="guideline-step-num">' + g.num + '</div>' +
      '<div class="guideline-step-content">' +
        '<h3>' + g.title + '</h3>' +
        '<div class="code-block"><pre><code>' + escapeHtml(g.code) + '</code></pre></div>' +
      '</div>' +
    '</div>';
  }
  
  const html = '<section class="hero" style="min-height: 60vh;">' +
    '<div class="hero-content">' +
      '<h1>' + CONTRIBUTE_DATA.hero.title + '<br><span class="accent">' + CONTRIBUTE_DATA.hero.titleAccent + '</span></h1>' +
      '<p class="hero-description">' + CONTRIBUTE_DATA.hero.description + '</p>' +
    '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal"><h2>' + CONTRIBUTE_DATA.ways.title + '</h2></div>' +
    '<div class="ways-grid stagger-children">' + waysHTML + '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal"><h2>' + CONTRIBUTE_DATA.stats.title + '</h2></div>' +
    '<div class="community-stats stagger-children">' + statsHTML + '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal"><h2>' + CONTRIBUTE_DATA.guidelines.title + '</h2></div>' +
    '<div class="guidelines-steps">' + guidelinesHTML + '</div>' +
  '</section>';
  
  document.getElementById('app').innerHTML = html;
}

// ============================================
// BRAND PAGE RENDERER
// ============================================
function renderBrandPage() {
  let logosHTML = '';
  for (let i = 0; i < BRAND_DATA.logos.variants.length; i++) {
    const v = BRAND_DATA.logos.variants[i];
    const logoContent = v.name === 'Icon Only' 
      ? getLogoSVG(v.color, 64) 
      : getLogoFullSVG(v.color, v.bg === 'dark' ? '#f5f5f5' : '#0a0a0a', 48);
    logosHTML += '<div class="logo-variant ' + v.bg + '">' + logoContent + '<div class="logo-variant-name">' + v.name + '</div></div>';
  }
  
  let colorsHTML = '';
  for (let i = 0; i < BRAND_DATA.colors.palette.length; i++) {
    const c = BRAND_DATA.colors.palette[i];
    colorsHTML += '<div class="color-swatch">' +
      '<div class="color-swatch-top" style="background:' + c.hex + '">' +
        '<span class="color-swatch-hex">' + c.hex + '</span>' +
      '</div>' +
      '<div class="color-swatch-info">' +
        '<div class="color-swatch-name">' + c.name + '</div>' +
        '<div class="color-swatch-usage">' + c.usage + '</div>' +
      '</div>' +
    '</div>';
  }
  
  let fontsHTML = '';
  for (let i = 0; i < BRAND_DATA.typography.fonts.length; i++) {
    const f = BRAND_DATA.typography.fonts[i];
    const fontFamily = f.name === 'Inter' ? 'Inter, sans-serif' : 'JetBrains Mono, monospace';
    const previewText = f.name === 'Inter' ? 'The quick brown fox jumps over the lazy dog.' : 'const bliss = require("@mtg9ing/bliss");';
    fontsHTML += '<div class="font-sample reveal reveal-delay-' + (i + 1) + '">' +
      '<div class="font-sample-name">' + f.name + ' — ' + f.role + '</div>' +
      '<div class="font-sample-preview" style="font-family: ' + fontFamily + '">' + previewText + '</div>' +
      '<div class="font-sample-meta">Weights: ' + f.weights + '</div>' +
    '</div>';
  }
  
  let rulesHTML = '';
  for (let i = 0; i < BRAND_DATA.usage.rules.length; i++) {
    rulesHTML += '<li class="reveal reveal-delay-' + (i + 1) + '">' + BRAND_DATA.usage.rules[i] + '</li>';
  }
  
  const html = '<section class="hero" style="min-height: 50vh;">' +
    '<div class="hero-content">' +
      '<h1><span class="accent">' + BRAND_DATA.hero.title + '</span> ' + BRAND_DATA.hero.titleAccent + '</h1>' +
      '<p class="hero-description">' + BRAND_DATA.hero.description + '</p>' +
    '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal">' +
      '<h2>' + BRAND_DATA.logos.title + '</h2>' +
      '<p>' + BRAND_DATA.logos.description + '</p>' +
    '</div>' +
    '<div class="brand-logo-showcase stagger-children">' + logosHTML + '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal"><h2>' + BRAND_DATA.colors.title + '</h2></div>' +
    '<div class="colors-grid stagger-children">' + colorsHTML + '</div>' +
  '</section>' +
  '<section class="section">' +
    '<div class="section-header reveal"><h2>' + BRAND_DATA.typography.title + '</h2></div>' +
    '<div class="typography-showcase">' + fontsHTML + '</div>' +
  '</section>' +
  '<section class="section" style="background:var(--dark-lighter)">' +
    '<div class="section-header reveal"><h2>' + BRAND_DATA.usage.title + '</h2></div>' +
    '<ul class="rules-list">' + rulesHTML + '</ul>' +
  '</section>';
  
  document.getElementById('app').innerHTML = html;
}

// ============================================
// UTILITIES
// ============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--primary); color: var(--dark); padding: 0.75rem 1.5rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.9rem; z-index: 10000; animation: fadeInUp 0.3s ease-out; box-shadow: 0 10px 30px rgba(0,0,0,0.3);';
    toast.textContent = 'Copied to clipboard!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Create particle canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  new ParticleSystem(canvas);
  
  // Render shared components
  renderNavigation();
  renderFooter();
  
  // Render page-specific content
  const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  
  switch(page) {
    case 'index':
      renderHomepage();
      break;
    case 'docs':
      renderDocsPage();
      break;
    case 'about':
      renderAboutPage();
      break;
    case 'playground':
      renderPlaygroundPage();
      break;
    case 'contribute':
      renderContributePage();
      break;
    case 'brand':
      renderBrandPage();
      break;
  }
  
  // Init scroll reveal
  initScrollReveal();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
