// Personalização: altere os dados da loja aqui.
const CONFIG = {
  nome: 'Mundo Pet',
  whatsapp: '5511999999999',
  mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre os serviços do Mundo Pet.',
  instagram: {
    perfil: '@mundopet.exemplo',
    link: 'https://www.instagram.com/mundopet.exemplo/',
  },
  endereco: 'Rua das Patinhas, 123 – Vila Mariana, São Paulo – SP',
  enderecoResumido: 'Vila Mariana, São Paulo – SP',
  horarios: {
    semana: 'Seg a sáb, das 8h às 19h',
    domingo: 'Dom, das 9h às 13h',
  },
  telefone: '(11) 99999-9999',
  mapa: {
    // Use a busca para gerar ambos os links ou cole os links reais nos campos abaixo.
    busca: 'Vila Mariana, São Paulo',
    legenda: 'Mapa de referência · Vila Mariana, São Paulo',
    link: '', // Link de compartilhamento para o botão “Como chegar”.
    incorporado: '', // No Google Maps, use Compartilhar > Incorporar um mapa e copie só a URL do src.
  },
};

function setText(selector, text) {
  document.querySelectorAll(selector).forEach(element => {
    element.textContent = text;
  });
}

// Contatos, redes sociais e mapa
const whatsappNumber = CONFIG.whatsapp.replace(/\D/g, '');
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const message = link.dataset.message || CONFIG.mensagemWhatsApp;
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
});

document.querySelectorAll('[data-instagram]').forEach(link => {
  link.href = CONFIG.instagram.link;
});

setText('[data-store]', CONFIG.nome);
setText('[data-instagram-handle]', CONFIG.instagram.perfil);
setText('[data-address]', CONFIG.endereco);
setText('[data-address-short]', CONFIG.enderecoResumido);
setText('[data-hours-week]', CONFIG.horarios.semana);
setText('[data-hours-sunday]', CONFIG.horarios.domingo);
setText('[data-phone]', CONFIG.telefone);
setText('.map-card figcaption', CONFIG.mapa.legenda);

document.querySelectorAll('[data-brand-image]').forEach(image => {
  image.alt = CONFIG.nome;
});
document.querySelectorAll('[data-brand-link]').forEach(link => {
  link.setAttribute('aria-label', `${CONFIG.nome}, início`);
});
document.querySelector('.insta-avatar').alt = `Símbolo de ${CONFIG.nome}`;

const phone = CONFIG.telefone.replace(/\D/g, '');
document.querySelector('[data-phone]').href = `tel:+${phone.length <= 11 ? '55' : ''}${phone}`;
const mapQuery = encodeURIComponent(CONFIG.mapa.busca || CONFIG.endereco);
const mapLink = document.querySelector('[data-map-link]');
const mapFrame = document.querySelector('[data-map-frame]');
mapLink.href = CONFIG.mapa.link || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const mapEmbed = CONFIG.mapa.incorporado || `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
if (mapFrame.getAttribute('src') !== mapEmbed) mapFrame.src = mapEmbed;
mapFrame.title = `Mapa — ${CONFIG.mapa.busca || CONFIG.endereco}`;

// Menu móvel e indicação da seção atual
const header = document.querySelector('.site-header');
const menu = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const desktop = window.matchMedia('(min-width: 1024px)');
const navLinks = Array.from(menu.querySelectorAll('.nav-link'));
const sections = navLinks.map(link => document.querySelector(link.hash));

document.body.classList.add('menu-ready');
menuToggle.hidden = false;

function toggleMenu(open) {
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

menuToggle.addEventListener('click', () => {
  toggleMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || desktop.matches) return;

  toggleMenu(false);
  if (!link.hash) {
    menuToggle.focus();
    return;
  }

  const section = document.querySelector(link.hash);
  section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    toggleMenu(false);
    menuToggle.focus();
  }
});
desktop.addEventListener('change', () => toggleMenu(false));

let scrollPending = false;
let activeLink;

function updateHeader() {
  scrollPending = false;
  header.classList.toggle('scrolled', window.scrollY > 8);

  const threshold = header.offsetHeight + 36;
  const activeIndex = sections.findLastIndex(section => section.getBoundingClientRect().top <= threshold);
  const nextLink = navLinks[Math.max(0, activeIndex)];
  if (nextLink === activeLink) return;

  navLinks.forEach(link => {
    link.classList.toggle('current', link === nextLink);
    if (link === nextLink) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  activeLink = nextLink;
}

function requestHeaderUpdate() {
  if (scrollPending) return;
  scrollPending = true;
  window.requestAnimationFrame(updateHeader);
}

window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
window.addEventListener('resize', requestHeaderUpdate);
updateHeader();

// Entrada suave, uma vez por elemento. O conteúdo fica disponível sem a animação.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('can-reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
