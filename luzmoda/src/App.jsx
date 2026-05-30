import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Trench Coat Estruturado", price: 2890, originalPrice: 3400, category: "Casacos", sizes: ["P","M","G","GG"], colors: ["Camel","Preto","Marfim"], rating: 4.9, reviews: 284, badge: "Novo", description: "Trench coat premium em gabardine italiana com forro de seda natural. Corte oversized contemporâneo com detalhes em couro dourado.", images: ["coat"] },
  { id: 2, name: "Blazer Oversized Premium", price: 1890, originalPrice: null, category: "Blazers", sizes: ["P","M","G"], colors: ["Preto","Cinza Chumbo","Off White"], rating: 4.8, reviews: 156, badge: null, description: "Blazer em crepe italiano de alta gramatura. Ombros estruturados e lapela notched com forro completo.", images: ["blazer"] },
  { id: 3, name: "Vestido Midi Satin", price: 3200, originalPrice: 3800, category: "Vestidos", sizes: ["PP","P","M","G"], colors: ["Champagne","Preto","Borgonha"], rating: 4.9, reviews: 412, badge: "Mais Vendido", description: "Vestido midi em satin de seda com corte enviesado. Exclusivo para a coleção Luz Inverno 2026.", images: ["dress"] },
  { id: 4, name: "Calça Wide Leg Alfaiataria", price: 1290, originalPrice: null, category: "Calças", sizes: ["34","36","38","40","42"], colors: ["Preto","Camel","Cinza"], rating: 4.7, reviews: 203, badge: null, description: "Calça wide leg em lã merino italiana. Alta costura com acabamento premium e fechamento invisível.", images: ["pants"] },
  { id: 5, name: "Bolsa Structured Leather", price: 4800, originalPrice: 5600, category: "Bolsas", sizes: ["Único"], colors: ["Preto","Caramelo","Borgonha"], rating: 5.0, reviews: 89, badge: "Exclusivo", description: "Bolsa structured em couro bovino full-grain italiano. Ferragens banhadas a ouro 18k. Peça numerada.", images: ["bag"] },
  { id: 6, name: "Camisa Oversized Popeline", price: 890, originalPrice: 1100, category: "Camisas", sizes: ["P","M","G","GG"], colors: ["Branco","Azul Marinho","Listrado"], rating: 4.6, reviews: 318, badge: null, description: "Camisa em popeline egípcio 200 fios. Corte oversized com manga longa e colarinho italiano.", images: ["shirt"] },
  { id: 7, name: "Saia Midi Plissada", price: 1450, originalPrice: null, category: "Saias", sizes: ["PP","P","M","G","GG"], colors: ["Preto","Champagne","Terracota"], rating: 4.8, reviews: 167, badge: "Nova Coleção", description: "Saia midi com pregas permanentes em georgette italiana. Caimento impecável, exclusiva para Luz Moda.", images: ["skirt"] },
  { id: 8, name: "Scarpin Sculptura", price: 1980, originalPrice: 2300, category: "Calçados", sizes: ["34","35","36","37","38","39"], colors: ["Preto","Nude","Borgonha"], rating: 4.9, reviews: 234, badge: "Coleção LUX", description: "Scarpin de salto sculptural em couro nappa. Salto 9cm com plataforma discreta. Palmilha acolchoada.", images: ["heels"] },
];

const CATEGORIES = ["Todos","Casacos","Blazers","Vestidos","Calças","Bolsas","Camisas","Saias","Calçados"];

const HERO_SLIDES = [
  { title: "COLEÇÃO", subtitle: "INVERNO 2026", tag: "Nova Coleção", cta: "Explorar" },
  { title: "LUXO", subtitle: "REDEFINIDO", tag: "Edição Limitada", cta: "Ver Peças" },
  { title: "ARTE &", subtitle: "ELEGÂNCIA", tag: "Alta Costura", cta: "Descobrir" },
];

// ─── REVIEWS DATA ─────────────────────────────────────────────────────────────
const REVIEWS_SEED = {
  1: [
    { id: 1, author: "Isabella F.", avatar: "IF", rating: 5, date: "12 Mai 2026", title: "Perfeito em todos os detalhes", body: "O caimento é impecável. O tecido é muito mais luxuoso do que esperava — a gabardine tem um peso incrível. Uso no trabalho e recebo elogios toda vez. Comprei no Camel e fica ainda mais bonito pessoalmente.", size: "M", color: "Camel", helpful: 42, photos: ["photo1", "photo2"], verified: true, criteria: { qualidade: 5, caimento: 5, custo: 4 } },
    { id: 2, author: "Rodrigo A.", avatar: "RA", rating: 5, date: "28 Abr 2026", title: "Melhor compra do ano", body: "Estava com receio de comprar online mas a peça superou todas as expectativas. O forro de seda desliza perfeitamente, os detalhes em couro dourado são sutis e elegantes. Vale cada centavo.", size: "G", color: "Preto", helpful: 38, photos: ["photo3"], verified: true, criteria: { qualidade: 5, caimento: 5, custo: 5 } },
    { id: 3, author: "Fernanda C.", avatar: "FC", rating: 4, date: "15 Abr 2026", title: "Lindo, mas atenção ao tamanho", body: "O trench é absolutamente lindo e a qualidade é indiscutível. Recomendo pegar um tamanho acima se você preferir o look oversized real — no M ficou um pouco mais ajustado do que imaginei.", size: "M", color: "Marfim", helpful: 27, photos: [], verified: true, criteria: { qualidade: 5, caimento: 3, custo: 4 } },
    { id: 4, author: "Thiago S.", avatar: "TS", rating: 5, date: "02 Abr 2026", title: "Presente perfeito", body: "Comprei para minha esposa e ela ficou apaixonada. A embalagem da Luz Moda já é uma experiência por si só — chegou numa caixa premium com laço dourado. A peça em si é digna de boutique europeia.", size: "P", color: "Camel", helpful: 31, photos: ["photo4", "photo5"], verified: false, criteria: { qualidade: 5, caimento: 5, custo: 5 } },
    { id: 5, author: "Juliana L.", avatar: "JL", rating: 5, date: "19 Mar 2026", title: "Uso diariamente", body: "Tenho usado quase todo dia desde que chegou. Lavei na mão como indicado e o tecido manteve toda a estrutura e brilho. A gabardine não amarrotou nem desbotou. Compra certíssima.", size: "G", color: "Preto", helpful: 55, photos: ["photo6"], verified: true, criteria: { qualidade: 5, caimento: 5, custo: 5 } },
  ],
};

// ─── QA DATA ──────────────────────────────────────────────────────────────────
const QA_SEED = {
  1: [
    { id: 1, question: "O trench tem forro em toda a extensão ou apenas na parte superior?", askedBy: "mariana_s", date: "20 Mai 2026", answer: "O forro de seda cobre toda a extensão interna da peça, do ombro até a bainha — sem exceção. Isso garante o caimento fluido que você vê nas fotos.", answeredBy: "Equipe Luz Moda", answerDate: "20 Mai 2026", official: true, helpful: 18 },
    { id: 2, question: "Qual a altura das modelos nas fotos? Estou em dúvida entre M e G.", askedBy: "carol_b", date: "14 Mai 2026", answer: "Nossas modelos têm 1,75m e usam tamanho M. Se você tem entre 1,65–1,75m com quadril médio, o M é ideal. Para uma silhueta mais oversized, suba um tamanho.", answeredBy: "Equipe Luz Moda", answerDate: "14 Mai 2026", official: true, helpful: 24 },
    { id: 3, question: "Pode ser usado na chuva? O tecido é impermeável?", askedBy: "pedro_m", date: "8 Mai 2026", answer: "A gabardine tem resistência natural à água leve, mas não é impermeável para chuva intensa. Para garoa e tempo fechado funciona perfeitamente.", answeredBy: "Equipe Luz Moda", answerDate: "9 Mai 2026", official: true, helpful: 31 },
    { id: 4, question: "Tem entretela estruturada nos ombros?", askedBy: "ana_f", date: "1 Mai 2026", answer: null, answeredBy: null, answerDate: null, official: false, helpful: 0 },
  ],
};

// ─── BLOG DATA ────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  { id: 1, slug: "tendencias-inverno-2026", category: "Tendências", title: "As 7 tendências que vão dominar o inverno 2026", excerpt: "Da alfaiataria desconstruída ao maximalismo em couro, mapeamos os movimentos que estão redefinindo a moda nesta temporada.", author: "Sofia Andrade", authorRole: "Diretora Criativa", date: "26 Mai 2026", readTime: "6 min", cover: "coat", featured: true },
  { id: 2, slug: "guia-looks-trabalho", category: "Estilo", title: "Como montar looks impecáveis para o ambiente corporativo", excerpt: "O equilíbrio entre elegância e praticidade começa com as peças certas. Um guia definitivo para o guarda-roupa executivo moderno.", author: "Carla Mendonça", authorRole: "Editora de Moda", date: "22 Mai 2026", readTime: "8 min", cover: "blazer", featured: false },
  { id: 3, slug: "cuidados-pecas-premium", category: "Cuidados", title: "O guia completo para conservar suas peças de luxo", excerpt: "Saber cuidar de peças premium é tão importante quanto escolhê-las. Dicas de conservação para que suas peças durem décadas.", author: "Equipe Luz Moda", authorRole: "Editorial", date: "18 Mai 2026", readTime: "5 min", cover: "dress", featured: false },
  { id: 4, slug: "bolsas-investimento-2026", category: "Investimento", title: "Bolsas que valorizam com o tempo — escolha certa em 2026", excerpt: "Assim como arte e imóveis, certas bolsas são ativos que se valorizam. Saiba quais peças da temporada prometem retorno.", author: "Ricardo Lopes", authorRole: "Consultor de Moda", date: "14 Mai 2026", readTime: "7 min", cover: "bag", featured: false },
  { id: 5, slug: "bastidores-colecao-inverno", category: "Bastidores", title: "Por dentro da criação da Coleção Inverno 2026", excerpt: "Viajamos até Milão para acompanhar o processo criativo da nossa coleção mais ambiciosa. Da inspiração ao produto final.", author: "Sofia Andrade", authorRole: "Diretora Criativa", date: "10 Mai 2026", readTime: "10 min", cover: "shirt", featured: false },
  { id: 6, slug: "capsule-wardrobe", category: "Estilo", title: "Como construir um guarda-roupa cápsula com 12 peças", excerpt: "Menos é mais. Descubra como 12 peças estratégicas podem gerar mais de 60 combinações e revolucionar sua relação com a moda.", author: "Carla Mendonça", authorRole: "Editora de Moda", date: "5 Mai 2026", readTime: "9 min", cover: "pants", featured: false },
];

const COMPLETE_THE_LOOK = {
  1: [2, 4, 8], 2: [1, 4, 7], 3: [5, 8, 6],
  4: [2, 6, 8], 5: [3, 6, 7], 6: [2, 4, 5],
  7: [3, 5, 8], 8: [3, 7, 5],
};

const fmt = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const colorMap = { "Preto": "#1a1410", "Camel": "#c9a96e", "Marfim": "#f5f0e8", "Cinza Chumbo": "#555", "Off White": "#f0ece4", "Champagne": "#c9a96e", "Borgonha": "#6b2737", "Cinza": "#888", "Caramelo": "#a0622d", "Branco": "#f8f8f6", "Azul Marinho": "#1a2c4a", "Listrado": "#1a2c4a", "Terracota": "#c26b4a", "Nude": "#d4a882" };

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    bag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill: <svg width={size} height={size} viewBox="0 0 24 24" fill="#c9a96e" stroke="#c9a96e" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="#c9a96e" stroke="#c9a96e" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    starEmpty: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.3)" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    arrowLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    secure: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    truck: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    return: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    camera: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    thumbUp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    verified: <svg width={size} height={size} viewBox="0 0 24 24" fill="#c9a96e" stroke="#c9a96e" strokeWidth="0"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
    question: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    img: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  };
  return icons[name] || null;
};

// ─── PRODUCT VISUAL ──────────────────────────────────────────────────────────
const ProductVisual = ({ type, size = "full" }) => {
  const h = size === "full" ? 320 : 200;
  const palette = { coat:["#2c2416","#c9a96e","#f5f0e8"], blazer:["#0d0d0d","#888","#e8e8e8"], dress:["#c9a96e","#2c1810","#f5f0e8"], pants:["#1a1a1a","#555","#e0e0e0"], bag:["#1a0f05","#c9a96e","#8b5a2b"], shirt:["#f8f8f8","#c9a96e","#ddd"], skirt:["#0d0d0d","#888","#f0f0f0"], heels:["#1a1a1a","#c9a96e","#555"] };
  const p = palette[type] || palette.coat;
  const visuals = {
    coat: <g transform="translate(50,20) scale(0.85)"><path d="M80 20 Q90 15 100 20 L120 80 L150 260 L50 260 L80 80 Z" fill={p[0]}/><path d="M80 20 L70 50 L60 80 Q55 100 58 120 L65 260 L50 260 L80 80 Z" fill={p[1]} opacity="0.3"/><path d="M100 20 Q110 30 115 50 L130 80 Q140 100 138 120 L142 260 L150 260 L120 80 Z" fill={p[1]} opacity="0.2"/><path d="M80 20 Q90 35 100 20" stroke={p[1]} strokeWidth="2" fill="none"/><rect x="85" y="90" width="30" height="3" rx="1.5" fill={p[1]} opacity="0.6"/><rect x="85" y="100" width="30" height="3" rx="1.5" fill={p[1]} opacity="0.6"/><rect x="85" y="110" width="30" height="3" rx="1.5" fill={p[1]} opacity="0.6"/></g>,
    blazer: <g transform="translate(45,20) scale(0.88)"><path d="M85 10 Q95 8 105 10 L130 50 L155 260 L45 260 L70 50 Z" fill={p[0]}/><path d="M85 10 Q95 30 105 10 Q95 20 85 10" fill={p[2]} opacity="0.8"/><circle cx="95" cy="130" r="3" fill={p[1]} opacity="0.5"/><circle cx="95" cy="150" r="3" fill={p[1]} opacity="0.5"/></g>,
    dress: <g transform="translate(55,10) scale(0.85)"><path d="M80 30 Q90 25 100 30 L115 100 L140 270 L60 270 L85 100 Z" fill={p[0]}/><path d="M80 30 Q90 10 100 30" stroke={p[1]} strokeWidth="2" fill="none"/><path d="M75 100 Q90 110 105 100" stroke={p[1]} strokeWidth="1" fill="none" opacity="0.5"/><path d="M65 180 Q90 200 115 180" stroke={p[1]} strokeWidth="1" fill="none" opacity="0.3"/></g>,
    pants: <g transform="translate(50,10) scale(0.88)"><path d="M70 10 L130 10 L130 130 Q130 150 120 270 L100 270 Q95 150 95 130 L95 10" fill={p[0]}/><path d="M70 10 L95 10 L95 130 Q95 150 80 270 L60 270 Q75 150 70 130 Z" fill={p[0]}/><line x1="70" y1="10" x2="130" y2="10" stroke={p[1]} strokeWidth="2"/></g>,
    bag: <g transform="translate(40,30) scale(0.9)"><rect x="30" y="70" width="140" height="100" rx="8" fill={p[0]}/><path d="M60 70 Q60 40 90 40 L110 40 Q140 40 140 70" stroke={p[1]} strokeWidth="3" fill="none"/><rect x="70" y="105" width="60" height="30" rx="4" fill="none" stroke={p[1]} strokeWidth="1.5"/><circle cx="100" cy="120" r="3" fill={p[1]}/></g>,
    shirt: <g transform="translate(45,20) scale(0.88)"><path d="M75 15 L50 50 L65 65 L70 260 L130 260 L135 65 L150 50 L125 15 Q105 35 95 35 Q85 35 75 15" fill={p[0]}/></g>,
    skirt: <g transform="translate(55,40) scale(0.88)"><rect x="65" y="10" width="70" height="20" rx="3" fill={p[0]}/><path d="M65 30 Q50 150 40 260 L160 260 Q150 150 135 30 Z" fill={p[0]}/></g>,
    heels: <g transform="translate(30,60) scale(0.9)"><path d="M60 200 Q80 180 120 180 L160 200 L150 210 L110 195 Q80 195 70 210 Z" fill={p[0]}/><path d="M120 180 Q130 130 130 80 Q130 50 115 40 Q100 30 90 40 Q80 50 80 80 L80 180" fill={p[0]}/><path d="M150 210 L155 250 L160 250 L158 210 Z" fill={p[0]}/><path d="M90 40 Q115 38 130 50" stroke={p[1]} strokeWidth="2" fill="none"/></g>,
  };
  return (
    <svg width="100%" height={h} viewBox="0 0 200 290" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="290" fill="#f5f3f0"/>
      {visuals[type] || visuals.coat}
    </svg>
  );
};

// ─── PHOTO PLACEHOLDER (UGC) ─────────────────────────────────────────────────
const ReviewPhoto = ({ seed, small }) => {
  const sz = small ? 72 : 160;
  const colors = ["#2c2416","#1a1410","#0d0f14","#1a0f05","#14100a","#0a0f14"];
  const bg = colors[seed % colors.length];
  return (
    <svg width={sz} height={sz} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="160" fill={bg}/>
      <rect x="20" y="20" width="120" height="120" fill="rgba(201,169,110,0.08)"/>
      <line x1="20" y1="20" x2="140" y2="140" stroke="rgba(201,169,110,0.15)" strokeWidth="1"/>
      <line x1="140" y1="20" x2="20" y2="140" stroke="rgba(201,169,110,0.15)" strokeWidth="1"/>
      <circle cx="80" cy="80" r="30" fill="rgba(201,169,110,0.12)"/>
      <text x="80" y="86" textAnchor="middle" fill="rgba(201,169,110,0.4)" fontSize="11" fontFamily="Montserrat,sans-serif" letterSpacing="2">FOTO</text>
    </svg>
  );
};

// ─── STAR DISPLAY ─────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => (
  <span style={{ display:"inline-flex", gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i}><Icon name={i <= Math.round(rating) ? "star" : "starEmpty"} size={size}/></span>
    ))}
  </span>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = "#c9a96e";
const S = {
  app: { fontFamily:"'Playfair Display','Georgia',serif", background:"#0a0a0a", color:"#f5f0e8", minHeight:"100vh", overflowX:"hidden" },
  container: { maxWidth:1200, margin:"0 auto", padding:"0 24px" },
  nav: { position:"fixed", top:0, left:0, right:0, zIndex:100, borderBottom:"1px solid rgba(201,169,110,0.15)", backdropFilter:"blur(20px)", background:"rgba(10,10,10,0.95)" },
  navInner: { display:"flex", alignItems:"center", justifyContent:"space-between", height:72, maxWidth:1200, margin:"0 auto", padding:"0 24px" },
  logo: { fontFamily:"'Playfair Display',serif", fontSize:22, letterSpacing:8, color:"#f5f0e8", cursor:"pointer", textTransform:"uppercase" },
  navLinks: { display:"flex", gap:36, listStyle:"none", margin:0, padding:0 },
  navLink: { fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#a89880", cursor:"pointer" },
  navIcons: { display:"flex", gap:20, alignItems:"center" },
  navIcon: { color:"#a89880", cursor:"pointer", position:"relative", display:"flex", alignItems:"center" },
  badge: { position:"absolute", top:-6, right:-6, background:G, color:"#0a0a0a", borderRadius:"50%", width:16, height:16, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Montserrat',sans-serif", fontWeight:700 },
  hero: { height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:"#0a0a0a" },
  heroContent: { textAlign:"center", zIndex:2, position:"relative" },
  heroTag: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:6, color:G, textTransform:"uppercase", marginBottom:20 },
  heroTitle: { fontFamily:"'Playfair Display',serif", fontSize:"clamp(64px,12vw,140px)", lineHeight:0.9, color:"#f5f0e8", margin:"0 0 8px" },
  heroSubtitle: { fontFamily:"'Playfair Display',serif", fontSize:"clamp(64px,12vw,140px)", lineHeight:0.9, color:"transparent", WebkitTextStroke:"1px rgba(201,169,110,0.6)", margin:"0 0 48px" },
  heroCta: { display:"inline-flex", alignItems:"center", gap:12, fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:4, textTransform:"uppercase", color:"#f5f0e8", border:"1px solid rgba(201,169,110,0.5)", padding:"16px 36px", cursor:"pointer", background:"transparent" },
  heroScroll: { position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:4, color:"rgba(201,169,110,0.5)", textTransform:"uppercase" },
  heroLine: { width:1, height:48, background:"linear-gradient(to bottom,rgba(201,169,110,0.5),transparent)", margin:"8px auto 0" },
  section: { padding:"100px 0" },
  eyebrow: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:5, color:G, textTransform:"uppercase", marginBottom:16 },
  sectionTitle: { fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4vw,52px)", color:"#f5f0e8", margin:"0 0 24px", fontWeight:400 },
  productsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:2 },
  productCard: { background:"#f5f3f0", position:"relative", cursor:"pointer", overflow:"hidden" },
  productInfo: { padding:"20px 20px 24px" },
  productCategory: { fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"#9b8570", marginBottom:6 },
  productName: { fontFamily:"'Playfair Display',serif", fontSize:17, color:"#1a1410", marginBottom:8, fontWeight:400 },
  productPrice: { fontFamily:"'Montserrat',sans-serif", fontSize:14, color:"#1a1410", letterSpacing:1 },
  productOriginal: { fontSize:11, color:"#9b8570", textDecoration:"line-through", marginLeft:8 },
  productWish: { position:"absolute", top:16, right:16, background:"rgba(245,240,232,0.9)", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  productBadge: { position:"absolute", top:16, left:16, background:G, color:"#0a0a0a", fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, textTransform:"uppercase", padding:"4px 10px" },
  filters: { display:"flex", gap:2, marginBottom:40, flexWrap:"wrap" },
  filterBtn: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", padding:"10px 20px", border:"1px solid rgba(201,169,110,0.2)", background:"transparent", color:"#6b5a48", cursor:"pointer" },
  filterBtnActive: { background:G, color:"#0a0a0a", borderColor:G },
  detail: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, minHeight:"calc(100vh - 72px)", paddingTop:72 },
  detailImg: { background:"#f5f3f0", display:"flex", alignItems:"center", justifyContent:"center", position:"sticky", top:72, height:"calc(100vh - 72px)" },
  detailInfo: { padding:"60px 56px", background:"#0a0a0a" },
  detailBrand: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:5, color:G, textTransform:"uppercase", marginBottom:12 },
  detailName: { fontFamily:"'Playfair Display',serif", fontSize:42, color:"#f5f0e8", marginBottom:16, fontWeight:400, lineHeight:1.1 },
  detailPrice: { fontFamily:"'Playfair Display',serif", fontSize:28, color:G, marginBottom:8 },
  detailDesc: { fontFamily:"'Montserrat',sans-serif", fontSize:13, lineHeight:1.9, color:"rgba(245,240,232,0.65)", marginBottom:40, borderTop:"1px solid rgba(201,169,110,0.15)", paddingTop:32 },
  sizeBtn: { fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:1, padding:"10px 18px", border:"1px solid rgba(201,169,110,0.3)", background:"transparent", color:"rgba(245,240,232,0.7)", cursor:"pointer" },
  sizeBtnActive: { border:"1px solid #c9a96e", color:G },
  colorDot: { width:24, height:24, borderRadius:"50%", cursor:"pointer", border:"2px solid transparent" },
  addBtn: { width:"100%", padding:"18px 32px", background:G, color:"#0a0a0a", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:4, textTransform:"uppercase", border:"none", cursor:"pointer", marginBottom:12 },
  wishBtn: { width:"100%", padding:"16px 32px", background:"transparent", color:G, fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:4, textTransform:"uppercase", border:"1px solid rgba(201,169,110,0.4)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 },
  cartOverlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, backdropFilter:"blur(4px)" },
  cart: { position:"fixed", top:0, right:0, bottom:0, width:"min(440px,100vw)", background:"#0f0e0c", zIndex:201, display:"flex", flexDirection:"column" },
  cartHeader: { padding:"28px 28px 20px", borderBottom:"1px solid rgba(201,169,110,0.15)", display:"flex", alignItems:"center", justifyContent:"space-between" },
  cartTitle: { fontFamily:"'Playfair Display',serif", fontSize:22, color:"#f5f0e8", fontWeight:400 },
  cartItems: { flex:1, overflowY:"auto", padding:"20px 28px" },
  cartItem: { display:"flex", gap:16, paddingBottom:24, borderBottom:"1px solid rgba(201,169,110,0.1)", marginBottom:24 },
  cartItemImg: { width:88, height:110, background:"#f5f3f0", flexShrink:0, overflow:"hidden" },
  cartItemInfo: { flex:1 },
  cartItemName: { fontFamily:"'Playfair Display',serif", fontSize:15, color:"#f5f0e8", marginBottom:4, fontWeight:400 },
  cartItemMeta: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:1, color:"rgba(245,240,232,0.45)", marginBottom:12 },
  qtyBtn: { width:28, height:28, border:"1px solid rgba(201,169,110,0.3)", background:"transparent", color:G, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  cartFooter: { padding:"20px 28px 32px", borderTop:"1px solid rgba(201,169,110,0.15)" },
  checkoutBtn: { width:"100%", padding:"18px", background:G, color:"#0a0a0a", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:4, textTransform:"uppercase", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12 },
  emptyCart: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:280, gap:16, color:"rgba(245,240,232,0.3)" },
  checkout: { minHeight:"100vh", paddingTop:72, background:"#0a0a0a", display:"grid", gridTemplateColumns:"1fr 400px" },
  checkoutLeft: { padding:"60px 56px", borderRight:"1px solid rgba(201,169,110,0.1)" },
  checkoutRight: { padding:"60px 40px", background:"#0f0e0c" },
  inputLabel: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:"rgba(245,240,232,0.5)", textTransform:"uppercase", marginBottom:8, display:"block" },
  input: { width:"100%", padding:"14px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,169,110,0.2)", color:"#f5f0e8", fontFamily:"'Montserrat',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box" },
  paymentOption: { padding:"16px 20px", border:"1px solid rgba(201,169,110,0.2)", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer" },
  backBtn: { display:"inline-flex", alignItems:"center", gap:8, fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"rgba(245,240,232,0.5)", cursor:"pointer", marginBottom:40, padding:"8px 0", background:"none", border:"none" },
  toast: { position:"fixed", bottom:32, right:32, background:G, color:"#0a0a0a", padding:"14px 24px", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:2, zIndex:500, display:"flex", alignItems:"center", gap:10 },
  features: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderTop:"1px solid rgba(201,169,110,0.15)", borderBottom:"1px solid rgba(201,169,110,0.15)" },
  featureItem: { padding:"32px 0", display:"flex", alignItems:"center", gap:16, justifyContent:"center", borderRight:"1px solid rgba(201,169,110,0.1)" },
  featureText: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(245,240,232,0.6)", lineHeight:1.6 },
  banner: { display:"grid", gridTemplateColumns:"1fr 1fr" },
  bannerItem: { height:480, display:"flex", alignItems:"flex-end", padding:40, position:"relative", overflow:"hidden" },
  bannerContent: { position:"relative", zIndex:2 },
  bannerTag: { fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:8 },
  bannerTitle: { fontFamily:"'Playfair Display',serif", fontSize:36, color:"#f5f0e8", marginBottom:20, fontWeight:400 },
  bannerCta: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"#f5f0e8", borderBottom:"1px solid rgba(201,169,110,0.5)", paddingBottom:4, cursor:"pointer", display:"inline-block" },
  footer: { background:"#050504", borderTop:"1px solid rgba(201,169,110,0.12)", padding:"64px 0 40px" },
  footerGrid: { display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 },
  footerBrand: { fontFamily:"'Playfair Display',serif", fontSize:20, letterSpacing:6, color:"#f5f0e8", marginBottom:16 },
  footerTagline: { fontFamily:"'Montserrat',sans-serif", fontSize:12, lineHeight:1.8, color:"rgba(245,240,232,0.4)", maxWidth:260 },
  footerHeading: { fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, color:G, textTransform:"uppercase", marginBottom:20 },
  footerLink: { fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"rgba(245,240,232,0.45)", marginBottom:12, cursor:"pointer", display:"block" },
  footerBottom: { borderTop:"1px solid rgba(201,169,110,0.1)", paddingTop:28, display:"flex", alignItems:"center", justifyContent:"space-between" },
  footerCopy: { fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:1, color:"rgba(245,240,232,0.25)" },
  admin: { display:"flex", minHeight:"100vh", background:"#0d0c0a" },
  adminSidebar: { width:260, background:"#080807", borderRight:"1px solid rgba(201,169,110,0.12)", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, overflowY:"auto" },
  adminContent: { marginLeft:260, flex:1, padding:"40px" },
  adminTitle: { fontFamily:"'Playfair Display',serif", fontSize:30, color:"#f5f0e8", fontWeight:400 },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:40 },
  statCard: { background:"#100f0c", border:"1px solid rgba(201,169,110,0.1)", padding:"24px 24px 28px" },
  statLabel: { fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, color:"rgba(201,169,110,0.5)", textTransform:"uppercase", marginBottom:12 },
  statValue: { fontFamily:"'Playfair Display',serif", fontSize:32, color:"#f5f0e8", marginBottom:6, fontWeight:400 },
  statDelta: { fontFamily:"'Montserrat',sans-serif", fontSize:10, color:"#5c8a4a", letterSpacing:1 },
  adminCard: { background:"#100f0c", border:"1px solid rgba(201,169,110,0.1)", padding:"28px", marginBottom:20 },
  adminCardTitle: { fontFamily:"'Playfair Display',serif", fontSize:18, color:"#f5f0e8", marginBottom:24, fontWeight:400 },
  adminTh: { fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, color:"rgba(201,169,110,0.5)", textTransform:"uppercase", padding:"12px 16px", textAlign:"left", borderBottom:"1px solid rgba(201,169,110,0.1)" },
  adminTd: { fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"rgba(245,240,232,0.7)", padding:"16px 16px", borderBottom:"1px solid rgba(201,169,110,0.06)" },
  statusBadge: { fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, textTransform:"uppercase", padding:"4px 10px", borderRadius:2 },
};

// ─── NOTIFICATION BANNER ─────────────────────────────────────────────────────
const NotificationBanner = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{ background:"#0f0e0c", borderBottom:"1px solid rgba(201,169,110,0.2)", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:20, flexWrap:"wrap" }}>
      {!sent ? (
        <>
          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(245,240,232,0.6)", display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="bell" size={14}/> Novidades exclusivas + 10% na primeira compra
          </span>
          <div style={{ display:"flex", gap:0 }}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu melhor e-mail" style={{ padding:"8px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(201,169,110,0.25)", borderRight:"none", color:"#f5f0e8", fontFamily:"'Montserrat',sans-serif", fontSize:11, outline:"none", width:220 }}/>
            <button onClick={()=>{if(email){setSent(true)}}} style={{ padding:"8px 16px", background:G, color:"#0a0a0a", fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", border:"none", cursor:"pointer" }}>OK</button>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(245,240,232,0.3)", cursor:"pointer" }}><Icon name="close" size={14}/></button>
        </>
      ) : (
        <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:G, display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="check" size={14}/> Perfeito! Seu cupom de 10% foi enviado para {email}
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(245,240,232,0.3)", cursor:"pointer", marginLeft:8 }}><Icon name="close" size={14}/></button>
        </span>
      )}
    </div>
  );
};

// ─── STOCK ALERT MODAL ────────────────────────────────────────────────────────
const StockAlertModal = ({ product, onClose, showToast }) => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#0f0e0c", border:"1px solid rgba(201,169,110,0.2)", padding:"48px", maxWidth:440, width:"90%", textAlign:"center" }} onClick={e=>e.stopPropagation()}>
        <span style={{ color:G }}><Icon name="bell" size={32}/></span>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#f5f0e8", margin:"16px 0 8px", fontWeight:400 }}>Avise-me quando chegar</h3>
        <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"rgba(245,240,232,0.5)", lineHeight:1.7, marginBottom:28 }}>Fique na fila VIP para <strong style={{color:"#f5f0e8"}}>{product?.name}</strong>. Você será o primeiro a saber quando voltar ao estoque.</p>
        {!done ? (
          <>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" style={{ ...S.input, marginBottom:12, textAlign:"center" }}/>
            <button style={{ ...S.addBtn, margin:0 }} onClick={()=>{if(email){setDone(true);showToast("Alerta criado! Você será avisado em breve.");}}}>Criar Alerta <Icon name="bell" size={14}/></button>
          </>
        ) : (
          <div style={{ color:G, fontFamily:"'Montserrat',sans-serif", fontSize:12, letterSpacing:2 }}>
            <Icon name="check" size={20}/><br/>Alerta criado com sucesso!
          </div>
        )}
        <button onClick={onClose} style={{ display:"block", margin:"20px auto 0", background:"none", border:"none", color:"rgba(245,240,232,0.3)", cursor:"pointer", fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2 }}>Cancelar</button>
      </div>
    </div>
  );
};

// ─── REVIEWS SECTION ─────────────────────────────────────────────────────────
const ReviewsSection = ({ productId, productName, showToast }) => {
  const seed = REVIEWS_SEED[productId] || REVIEWS_SEED[1];
  const [reviews, setReviews] = useState(seed);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [lightbox, setLightbox] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating:5, title:"", body:"", size:"", color:"" });
  const [hoverStar, setHoverStar] = useState(0);

  const avg = (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1);
  const dist = [5,4,3,2,1].map(n=>({ n, count:reviews.filter(r=>r.rating===n).length }));

  const filtered = reviews
    .filter(r => filter === "all" || r.rating === parseInt(filter))
    .sort((a,b) => sort === "helpful" ? b.helpful - a.helpful : sort === "lowest" ? a.rating - b.rating : new Date(b.date) - new Date(a.date));

  const submitReview = () => {
    if(!newReview.title || !newReview.body) return;
    const r = { id: Date.now(), author:"Você", avatar:"VO", rating:newReview.rating, date:"28 Mai 2026", title:newReview.title, body:newReview.body, size:newReview.size||"M", color:newReview.color||"Preto", helpful:0, photos:[], verified:true, criteria:{qualidade:newReview.rating,caimento:newReview.rating,custo:newReview.rating} };
    setReviews(prev=>[r,...prev]);
    setShowForm(false);
    setNewReview({rating:5,title:"",body:"",size:"",color:""});
    showToast("Avaliação publicada! Obrigado pelo feedback.");
  };

  const markHelpful = (id) => setReviews(prev=>prev.map(r=>r.id===id?{...r,helpful:r.helpful+1}:r));

  const gold = "rgba(201,169,110,";
  const dim = "rgba(245,240,232,";

  return (
    <div style={{ marginTop:64, paddingTop:48, borderTop:`1px solid ${gold}0.15)` }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:40 }}>
        <div>
          <p style={S.eyebrow}>Avaliações dos Clientes</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:"#f5f0e8", fontWeight:400, margin:"0 0 4px" }}>{productName}</h2>
        </div>
        <button style={{ ...S.addBtn, width:"auto", padding:"14px 24px", margin:0 }} onClick={()=>setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Escrever Avaliação"}
        </button>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:48, marginBottom:40, padding:"32px 40px", background:"rgba(201,169,110,0.04)", border:`1px solid ${gold}0.1)` }}>
        {/* Big score */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:72, color:G, lineHeight:1, marginBottom:8 }}>{avg}</div>
          <Stars rating={parseFloat(avg)} size={16}/>
          <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:`${dim}0.4)`, marginTop:6 }}>{reviews.length} avaliações</div>
        </div>
        {/* Bar chart */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:6 }}>
          {dist.map(({n,count}) => {
            const pct = reviews.length ? Math.round((count/reviews.length)*100) : 0;
            return (
              <div key={n} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>setFilter(filter===String(n)?"all":String(n))}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:filter===String(n)?G:`${dim}0.5)`, width:8 }}>{n}</span>
                <Icon name="star" size={10}/>
                <div style={{ flex:1, height:6, background:`${gold}0.12)` }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:filter===String(n)?G:`${gold}0.4)`, transition:"width 0.5s" }}/>
                </div>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.4)`, width:24, textAlign:"right" }}>{count}</span>
              </div>
            );
          })}
        </div>
        {/* Criteria */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:14, minWidth:200 }}>
          {[["Qualidade do material","qualidade"],["Caimento / tamanho","caimento"],["Custo-benefício","custo"]].map(([label,key])=>{
            const avg2 = reviews.reduce((s,r)=>s+(r.criteria?.[key]||0),0)/reviews.length;
            return (
              <div key={key}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:1, color:`${dim}0.5)` }}>{label}</span>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:G }}>{avg2.toFixed(1)}</span>
                </div>
                <div style={{ height:3, background:`${gold}0.12)` }}>
                  <div style={{ height:"100%", width:`${(avg2/5)*100}%`, background:G }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review form */}
      {showForm && (
        <div style={{ background:"rgba(201,169,110,0.04)", border:`1px solid ${gold}0.15)`, padding:"32px", marginBottom:32 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#f5f0e8", marginBottom:24, fontWeight:400 }}>Sua avaliação</h3>
          {/* Star picker */}
          <div style={{ marginBottom:20 }}>
            <label style={S.inputLabel}>Nota geral</label>
            <div style={{ display:"flex", gap:4 }}>
              {[1,2,3,4,5].map(n=>(
                <span key={n} style={{ cursor:"pointer", fontSize:28 }} onMouseEnter={()=>setHoverStar(n)} onMouseLeave={()=>setHoverStar(0)} onClick={()=>setNewReview(r=>({...r,rating:n}))}>
                  <Icon name={n<=(hoverStar||newReview.rating)?"star":"starEmpty"} size={28}/>
                </span>
              ))}
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:G, marginLeft:8, alignSelf:"center" }}>{["","Péssimo","Ruim","Regular","Bom","Excelente"][hoverStar||newReview.rating]}</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div><label style={S.inputLabel}>Tamanho comprado</label><input style={S.input} placeholder="Ex: M" value={newReview.size} onChange={e=>setNewReview(r=>({...r,size:e.target.value}))}/></div>
            <div><label style={S.inputLabel}>Cor comprada</label><input style={S.input} placeholder="Ex: Preto" value={newReview.color} onChange={e=>setNewReview(r=>({...r,color:e.target.value}))}/></div>
          </div>
          <div style={{ marginBottom:16 }}><label style={S.inputLabel}>Título</label><input style={S.input} placeholder="Resuma sua experiência" value={newReview.title} onChange={e=>setNewReview(r=>({...r,title:e.target.value}))}/></div>
          <div style={{ marginBottom:20 }}>
            <label style={S.inputLabel}>Avaliação detalhada</label>
            <textarea style={{ ...S.input, minHeight:100, resize:"vertical" }} placeholder="Conte sua experiência com essa peça — caimento, qualidade, combinações..." value={newReview.body} onChange={e=>setNewReview(r=>({...r,body:e.target.value}))}/>
          </div>
          {/* Photo upload placeholder */}
          <div style={{ border:`1px dashed ${gold}0.3)`, padding:"20px", display:"flex", alignItems:"center", justifyContent:"center", gap:12, cursor:"pointer", marginBottom:24, color:G }}>
            <Icon name="camera" size={18}/><span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:2 }}>Adicionar fotos (até 5)</span>
          </div>
          <button style={{ ...S.addBtn, margin:0 }} onClick={submitReview}>Publicar Avaliação</button>
        </div>
      )}

      {/* Photo gallery */}
      {reviews.some(r=>r.photos?.length>0) && (
        <div style={{ marginBottom:36 }}>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:3, color:`${dim}0.4)`, textTransform:"uppercase", marginBottom:14 }}>Fotos dos Clientes</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {reviews.flatMap((r,ri)=>r.photos?.map((ph,pi)=>({ r, ri, pi, ph }))).map(({r,ri,pi,ph},idx)=>(
              <div key={idx} style={{ cursor:"pointer", border:`2px solid ${gold}0)`, transition:"border-color 0.2s", overflow:"hidden" }}
                   onClick={()=>setLightbox({review:r,photoIdx:pi})}>
                <ReviewPhoto seed={ri*10+pi} small/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", gap:2, flexWrap:"wrap" }}>
          {[["all","Todos"],["5","★ 5"],["4","★ 4"],["3","★ 3"]].map(([val,label])=>(
            <button key={val} style={{ ...S.filterBtn, ...(filter===val?S.filterBtnActive:{}) }} onClick={()=>setFilter(val)}>{label}</button>
          ))}
        </div>
        <select style={{ ...S.filterBtn, padding:"10px 16px", appearance:"none", color:"rgba(245,240,232,0.6)" }} value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="recent">Mais recentes</option>
          <option value="helpful">Mais úteis</option>
          <option value="lowest">Menor nota</option>
        </select>
      </div>

      {/* Review cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        {filtered.map((review,i)=>(
          <div key={review.id} style={{ padding:"32px 0", borderBottom:`1px solid ${gold}0.1)`, animation:`fadeIn 0.3s ease ${i*0.05}s both` }}>
            <div style={{ display:"flex", gap:24 }}>
              {/* Avatar */}
              <div style={{ flexShrink:0 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`${gold}0.15)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Montserrat',sans-serif", fontSize:13, fontWeight:600, color:G }}>
                  {review.avatar}
                </div>
              </div>
              {/* Content */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:"#f5f0e8", fontWeight:500 }}>{review.author}</span>
                  {review.verified && (
                    <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:1, color:G, textTransform:"uppercase" }}>
                      <Icon name="verified" size={12}/> Compra verificada
                    </span>
                  )}
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.35)`, marginLeft:"auto" }}>{review.date}</span>
                </div>
                <Stars rating={review.rating} size={13}/>
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#f5f0e8", margin:"10px 0 8px", fontWeight:400 }}>{review.title}</h4>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, lineHeight:1.8, color:`${dim}0.65)`, marginBottom:12 }}>{review.body}</p>
                <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                  {[["Tamanho",review.size],["Cor",review.color]].map(([k,v])=>(
                    <span key={k} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:1, color:`${dim}0.4)` }}>{k}: <span style={{color:`${dim}0.65)`}}>{v}</span></span>
                  ))}
                </div>
                {/* Photos */}
                {review.photos?.length > 0 && (
                  <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                    {review.photos.map((ph,pi)=>(
                      <div key={pi} style={{ cursor:"pointer", overflow:"hidden" }} onClick={()=>setLightbox({review,photoIdx:pi})}>
                        <ReviewPhoto seed={i*10+pi} small/>
                      </div>
                    ))}
                  </div>
                )}
                {/* Helpful */}
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.4)` }}>Esta avaliação foi útil?</span>
                  <button style={{ display:"flex", alignItems:"center", gap:6, background:`${gold}0.08)`, border:`1px solid ${gold}0.2)`, color:G, fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:1, padding:"5px 12px", cursor:"pointer" }} onClick={()=>markHelpful(review.id)}>
                    <Icon name="thumbUp" size={12}/> Sim ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setLightbox(null)}>
          <div style={{ maxWidth:600, textAlign:"center" }}>
            <ReviewPhoto seed={lightbox.photoIdx} small={false}/>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:`${dim}0.5)`, marginTop:16 }}>{lightbox.review.author} · {lightbox.review.date}</p>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:G, marginTop:4 }}>"{lightbox.review.title}"</p>
          </div>
          <button style={{ position:"absolute", top:24, right:24, background:"none", border:"none", color:`${dim}0.5)`, cursor:"pointer" }}><Icon name="close" size={24}/></button>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
};

// ─── Q&A SECTION ─────────────────────────────────────────────────────────────
const QASection = ({ productId, showToast }) => {
  const seed = QA_SEED[productId] || QA_SEED[1];
  const [qa, setQa] = useState(seed);
  const [question, setQuestion] = useState("");
  const [expanded, setExpanded] = useState(null);
  const gold = "rgba(201,169,110,";
  const dim = "rgba(245,240,232,";

  const submitQ = () => {
    if(!question.trim()) return;
    setQa(prev=>[...prev, { id:Date.now(), question:question.trim(), askedBy:"você", date:"28 Mai 2026", answer:null, answeredBy:null, answerDate:null, official:false, helpful:0 }]);
    setQuestion("");
    showToast("Pergunta enviada! Nossa equipe responderá em breve.");
  };

  return (
    <div style={{ marginTop:56, paddingTop:48, borderTop:`1px solid ${gold}0.15)` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
        <div>
          <p style={S.eyebrow}>Perguntas & Respostas</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#f5f0e8", fontWeight:400, margin:0 }}>Tire suas dúvidas</h2>
        </div>
        <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:`${dim}0.4)` }}>{qa.filter(q=>q.answer).length} perguntas respondidas</span>
      </div>

      {/* Ask field */}
      <div style={{ display:"flex", gap:0, marginBottom:40 }}>
        <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitQ()} placeholder="Tem alguma dúvida sobre esta peça? Pergunte aqui..." style={{ ...S.input, flex:1, borderRight:"none" }}/>
        <button style={{ padding:"14px 20px", background:G, border:"none", color:"#0a0a0a", cursor:"pointer" }} onClick={submitQ}><Icon name="send" size={16}/></button>
      </div>

      {/* Q&A list */}
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {qa.map((item,i)=>(
          <div key={item.id} style={{ background:`${gold}0.03)`, border:`1px solid ${gold}0.08)`, marginBottom:8 }}>
            {/* Question */}
            <div style={{ padding:"20px 24px", display:"flex", gap:16, cursor:"pointer", alignItems:"flex-start" }} onClick={()=>setExpanded(expanded===item.id?null:item.id)}>
              <span style={{ color:G, flexShrink:0, marginTop:2 }}><Icon name="question" size={18}/></span>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:"#f5f0e8", margin:"0 0 6px", lineHeight:1.5 }}>{item.question}</p>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.35)`, letterSpacing:1 }}>{item.askedBy} · {item.date}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                {item.answer && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, color:G, textTransform:"uppercase", background:`${gold}0.12)`, padding:"3px 8px" }}>Respondida</span>}
                {!item.answer && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, color:`${dim}0.35)`, textTransform:"uppercase", background:`${dim}0.05)`, padding:"3px 8px" }}>Aguardando</span>}
                <span style={{ color:`${dim}0.4)`, fontSize:16 }}>{expanded===item.id?"▲":"▼"}</span>
              </div>
            </div>
            {/* Answer */}
            {expanded===item.id && item.answer && (
              <div style={{ borderTop:`1px solid ${gold}0.1)`, padding:"20px 24px 20px 62px", background:`${gold}0.04)` }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:32, height:32, background:G, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"#0a0a0a", fontWeight:700 }}>L</span>
                  </div>
                  <div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:G, letterSpacing:1 }}>{item.answeredBy}</span>
                      {item.official && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#0a0a0a", background:G, padding:"2px 7px" }}>Oficial</span>}
                      <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.35)` }}>{item.answerDate}</span>
                    </div>
                    <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:`${dim}0.7)`, lineHeight:1.8, margin:"0 0 12px" }}>{item.answer}</p>
                    <button style={{ display:"flex", alignItems:"center", gap:6, background:`${gold}0.08)`, border:`1px solid ${gold}0.2)`, color:G, fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:1, padding:"4px 12px", cursor:"pointer" }}>
                      <Icon name="thumbUp" size={12}/> Útil ({item.helpful})
                    </button>
                  </div>
                </div>
              </div>
            )}
            {expanded===item.id && !item.answer && (
              <div style={{ borderTop:`1px solid ${gold}0.1)`, padding:"16px 24px 16px 62px" }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:`${dim}0.35)`, fontStyle:"italic" }}>Nossa equipe está preparando uma resposta. Normalmente respondemos em até 24h.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COMPLETE THE LOOK ────────────────────────────────────────────────────────
const CompleteTheLook = ({ currentProductId, setDetail, setPage, wishlist, toggleWish }) => {
  const related = (COMPLETE_THE_LOOK[currentProductId] || [1,2,3]).map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  const gold = "rgba(201,169,110,";
  return (
    <div style={{ marginTop:56, paddingTop:48, borderTop:`1px solid ${gold}0.15)` }}>
      <p style={S.eyebrow}>Styling</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#f5f0e8", fontWeight:400, marginBottom:28 }}>Complete o Look</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {related.map(p=>(
          <div key={p.id} style={{ background:"#f5f3f0", cursor:"pointer", position:"relative" }} onClick={()=>{setDetail(p);setPage("product");}}>
            <ProductVisual type={p.images[0]}/>
            <div style={{ position:"absolute", top:12, right:12, background:"rgba(245,240,232,0.9)", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }} onClick={e=>{e.stopPropagation();toggleWish(p.id);}}>
              <Icon name={wishlist.includes(p.id)?"heartFill":"heart"} size={14}/>
            </div>
            <div style={{ padding:"16px 16px 20px", background:"#f5f3f0" }}>
              <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"#9b8570", marginBottom:4 }}>{p.category}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#1a1410", marginBottom:4, fontWeight:400 }}>{p.name}</div>
              <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:"#1a1410" }}>{fmt(p.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── RECENTLY VIEWED ─────────────────────────────────────────────────────────
const RecentlyViewed = ({ history, currentId, setDetail, setPage }) => {
  const recent = history.filter(id=>id!==currentId).slice(0,4).map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  if(!recent.length) return null;
  return (
    <section style={{ ...S.section, background:"#050504", paddingTop:64 }}>
      <div style={S.container}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
          <div>
            <p style={S.eyebrow}>Seu histórico</p>
            <h2 style={S.sectionTitle}>Vistos Recentemente</h2>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
          {recent.map(p=>(
            <div key={p.id} style={{ background:"#f5f3f0", cursor:"pointer" }} onClick={()=>{setDetail(p);setPage("product");}}>
              <ProductVisual type={p.images[0]}/>
              <div style={{ padding:"16px 16px 20px" }}>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"#9b8570", marginBottom:4 }}>{p.category}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#1a1410", fontWeight:400 }}>{p.name}</div>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:"#1a1410", marginTop:4 }}>{fmt(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
const BlogPage = ({ setPage, setDetail, setBlogPost }) => {
  const [activeCat, setActiveCat] = useState("Todos");
  const cats = ["Todos", ...new Set(BLOG_POSTS.map(p=>p.category))];
  const filtered = BLOG_POSTS.filter(p=>activeCat==="Todos"||p.category===activeCat);
  const featured = BLOG_POSTS.find(p=>p.featured);
  const gold = "rgba(201,169,110,";
  const dim = "rgba(245,240,232,";

  return (
    <div style={{ paddingTop:72, background:"#0a0a0a", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ padding:"64px 0 48px", borderBottom:`1px solid ${gold}0.12)`, textAlign:"center" }}>
        <p style={S.eyebrow}>Revista Luz Moda</p>
        <h1 style={{ ...S.sectionTitle, textAlign:"center" }}>Editorial</h1>
        <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:`${dim}0.45)`, maxWidth:480, margin:"0 auto" }}>Tendências, estilo e os bastidores da moda global</p>
      </div>

      <div style={S.container}>
        {/* Featured article */}
        {featured && (
          <div style={{ marginTop:56, cursor:"pointer" }} onClick={()=>{setBlogPost(featured);setPage("blogpost");}}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, background:"#f5f3f0", minHeight:400 }}>
              <div style={{ overflow:"hidden", background:"#1a1410", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ opacity:0.4, transform:"scale(1.2)" }}>
                  <ProductVisual type={featured.cover} size="full"/>
                </div>
              </div>
              <div style={{ padding:"52px", display:"flex", flexDirection:"column", justifyContent:"center", background:"#111009" }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:12 }}>Em Destaque · {featured.category}</span>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#f5f0e8", fontWeight:400, lineHeight:1.2, marginBottom:16 }}>{featured.title}</h2>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, lineHeight:1.8, color:`${dim}0.55)`, marginBottom:24 }}>{featured.excerpt}</p>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:`${gold}0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Montserrat',sans-serif", fontSize:12, fontWeight:600, color:G }}>
                    {featured.author.split(" ").map(w=>w[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"#f5f0e8" }}>{featured.author}</div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.4)`, letterSpacing:1 }}>{featured.date} · {featured.readTime} de leitura</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div style={{ display:"flex", gap:2, margin:"48px 0 32px", flexWrap:"wrap" }}>
          {cats.map(c=>(
            <button key={c} style={{ ...S.filterBtn, ...(activeCat===c?S.filterBtnActive:{}) }} onClick={()=>setActiveCat(c)}>{c}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginBottom:80 }}>
          {filtered.filter(p=>!p.featured).map(post=>(
            <div key={post.id} style={{ background:"#0f0e0c", border:`1px solid ${gold}0.08)`, cursor:"pointer", overflow:"hidden" }} onClick={()=>{setBlogPost(post);setPage("blogpost");}}>
              <div style={{ height:200, background:"#1a1410", overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ opacity:0.35, transform:"scale(1.1)" }}><ProductVisual type={post.cover}/></div>
                <span style={{ position:"absolute", top:14, left:14, fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", background:G, color:"#0a0a0a", padding:"4px 10px" }}>{post.category}</span>
              </div>
              <div style={{ padding:"24px 24px 28px" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#f5f0e8", fontWeight:400, lineHeight:1.3, marginBottom:10 }}>{post.title}</h3>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, lineHeight:1.7, color:`${dim}0.5)`, marginBottom:20 }}>{post.excerpt}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.35)`, letterSpacing:1 }}>{post.author} · {post.date}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.35)` }}><Icon name="clock" size={11}/>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter section */}
        <div style={{ background:"#0f0e0c", border:`1px solid ${gold}0.15)`, padding:"60px", textAlign:"center", marginBottom:80 }}>
          <p style={S.eyebrow}>Newsletter Editorial</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:"#f5f0e8", fontWeight:400, marginBottom:12 }}>Moda que inspira, toda semana</h2>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:`${dim}0.45)`, marginBottom:32, maxWidth:440, margin:"0 auto 32px" }}>Tendências, editoriais exclusivos e primeiro acesso às novas coleções. Sem spam, apenas o que vale a pena.</p>
          <div style={{ display:"flex", gap:0, maxWidth:420, margin:"0 auto" }}>
            <input placeholder="seu@email.com" style={{ ...S.input, flex:1, borderRight:"none", textAlign:"center" }}/>
            <button style={{ padding:"14px 20px", background:G, border:"none", color:"#0a0a0a", fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", cursor:"pointer" }}>Assinar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── BLOG POST PAGE ───────────────────────────────────────────────────────────
const BlogPostPage = ({ post, setPage }) => {
  if(!post) return null;
  const gold = "rgba(201,169,110,";
  const dim = "rgba(245,240,232,";
  const paras = [
    post.excerpt,
    "A moda nunca foi apenas sobre roupas — é sobre identidade, expressão e o modo como navegamos pelo mundo que nos cerca. Esta temporada, os criadores apostam numa síntese entre o clássico atemporal e o contemporâneo ousado, resultando em peças que simultaneamente honram o passado e desafiam o presente.",
    "O que mais chama atenção é a atenção aos detalhes: costuras visíveis como elemento decorativo, forros estampados que se revelam em movimento, botões esculturais que elevam o simples ao extraordinário. São decisões de design que exigem maestria técnica e visão artística.",
    "Para incorporar essas tendências de forma elegante, a recomendação dos estilistas é clara: comece com uma peça âncora de alta qualidade e construa o look ao redor dela. Um blazer estruturado, um vestido de corte impecável ou uma bolsa statement são pontos de partida poderosos.",
    "A sustentabilidade também ganha protagonismo: tecidos reciclados com acabamento premium, tingimento natural que cria gradações únicas em cada peça, e produções em edições limitadas que valorizam tanto o artesão quanto o comprador.",
  ];

  return (
    <div style={{ paddingTop:72, background:"#0a0a0a", minHeight:"100vh" }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"60px 24px 80px" }}>
        <button style={S.backBtn} onClick={()=>setPage("blog")}><Icon name="arrowLeft" size={14}/> Voltar ao Editorial</button>
        <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:16, display:"block" }}>{post.category}</span>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,5vw,52px)", color:"#f5f0e8", fontWeight:400, lineHeight:1.2, marginBottom:20 }}>{post.title}</h1>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40, paddingBottom:40, borderBottom:`1px solid ${gold}0.15)` }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:`${gold}0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Montserrat',sans-serif", fontSize:13, fontWeight:600, color:G }}>
            {post.author.split(" ").map(w=>w[0]).join("")}
          </div>
          <div>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"#f5f0e8" }}>{post.author}</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.4)`, letterSpacing:1 }}>{post.authorRole} · {post.date}</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.4)` }}>
            <Icon name="clock" size={12}/>{post.readTime} de leitura
          </div>
        </div>
        {/* Cover visual */}
        <div style={{ height:360, background:"#1a1410", marginBottom:48, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          <div style={{ opacity:0.5, transform:"scale(1.4)" }}><ProductVisual type={post.cover} size="full"/></div>
        </div>
        {/* Body */}
        {paras.map((p,i)=>(
          <p key={i} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:15, lineHeight:1.9, color:i===0?`${dim}0.8)`:`${dim}0.6)`, marginBottom:24, ...(i===0?{fontSize:17,fontStyle:"italic"}:{}) }}>{p}</p>
        ))}
        {/* Pull quote */}
        <blockquote style={{ borderLeft:`3px solid ${G}`, paddingLeft:28, margin:"40px 0", fontFamily:"'Playfair Display',serif", fontSize:24, color:"#f5f0e8", fontWeight:400, lineHeight:1.4, fontStyle:"italic" }}>
          "Uma peça premium não é um gasto — é um investimento em como você se apresenta ao mundo."
        </blockquote>
        {paras.slice(2).map((p,i)=>(
          <p key={i} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:15, lineHeight:1.9, color:`${dim}0.6)`, marginBottom:24 }}>{p}</p>
        ))}
        {/* Back */}
        <div style={{ marginTop:56, paddingTop:40, borderTop:`1px solid ${gold}0.15)`, display:"flex", justifyContent:"center" }}>
          <button style={S.heroCta} onClick={()=>setPage("blog")}>Ver mais artigos <Icon name="arrow" size={14}/></button>
        </div>
      </div>
    </div>
  );
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
// ─── SEARCH MODAL ──────────────────────────────────────────────────────────
const SearchModal = ({ onClose, setDetail, setPage }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    setResults(PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.colors.some(c => c.toLowerCase().includes(q))
    ));
  }, [query]);

  const pick = (p) => { setDetail(p); setPage("product"); onClose(); };
  const suggestions = ["Trench Coat","Vestido","Blazer","Bolsa","Calças","Calçados","Casacos"];
  const gold = "rgba(201,169,110,", dim = "rgba(245,240,232,";

  return (
    <>
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:300,backdropFilter:"blur(6px)" }} onClick={onClose}/>
      <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:301,background:"#080807",borderBottom:`1px solid ${gold}0.25)` }}>
        {/* Input bar */}
        <div style={{ maxWidth:860,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",gap:16,height:80,borderBottom:`1px solid ${gold}0.1)` }}>
          <span style={{ color:G,flexShrink:0 }}><Icon name="search" size={22}/></span>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Escape") onClose(); if(e.key==="Enter"&&results.length>0) pick(results[0]); }}
            placeholder="Buscar produtos, categorias, cores..."
            style={{ flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'Playfair Display',serif",fontSize:"clamp(18px,3vw,26px)",color:"#f5f0e8",caretColor:G }}
          />
          {query && <button onClick={()=>setQuery("")} style={{ background:"none",border:"none",color:`${dim}0.35)`,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center" }}><Icon name="close" size={18}/></button>}
          <button onClick={onClose} style={{ background:"none",border:"1px solid rgba(201,169,110,0.2)",padding:"6px 12px",color:`${dim}0.4)`,cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",flexShrink:0 }}>ESC</button>
        </div>

        {/* Content */}
        <div style={{ maxWidth:860,margin:"0 auto",padding:"24px 28px 36px",maxHeight:"75vh",overflowY:"auto" }}>
          {/* No query: suggestions */}
          {!query && (
            <div>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:4,color:`${gold}0.45)`,textTransform:"uppercase",marginBottom:14 }}>Sugestões populares</p>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:32 }}>
                {suggestions.map(s=>(
                  <button key={s} onClick={()=>setQuery(s)} style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,letterSpacing:2,padding:"8px 18px",border:`1px solid ${gold}0.2)`,background:"transparent",color:`${dim}0.55)`,cursor:"pointer",textTransform:"uppercase",transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.color=G;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,169,110,0.2)";e.currentTarget.style.color="rgba(245,240,232,0.55)";}}>
                    {s}
                  </button>
                ))}
              </div>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:4,color:`${gold}0.45)`,textTransform:"uppercase",marginBottom:14 }}>Destaques da coleção</p>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:2 }}>
                {PRODUCTS.filter(p=>p.badge).map(p=>(
                  <div key={p.id} onClick={()=>pick(p)} style={{ cursor:"pointer",background:"rgba(245,243,240,1)",overflow:"hidden" }}>
                    <div style={{ height:140,overflow:"hidden" }}><ProductVisual type={p.images[0]} size="small"/></div>
                    <div style={{ padding:"10px 12px 14px",background:"#f5f3f0" }}>
                      <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9b8570",marginBottom:2 }}>{p.category}</p>
                      <p style={{ fontFamily:"'Playfair Display',serif",fontSize:13,color:"#1a1410",fontWeight:400 }}>{p.name}</p>
                      <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:12,color:"#1a1410",marginTop:3 }}>{fmt(p.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query but no results */}
          {query && results.length===0 && (
            <div style={{ textAlign:"center",padding:"48px 0" }}>
              <p style={{ fontFamily:"'Playfair Display',serif",fontSize:22,color:`${dim}0.35)`,marginBottom:8 }}>Nenhum resultado para "{query}"</p>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,letterSpacing:2,color:`${dim}0.2)`,marginBottom:24 }}>Tente outro termo ou explore a coleção completa</p>
              <button onClick={()=>{setPage("shop");onClose();}} style={{ ...S.heroCta,fontSize:10 }}>Ver toda a loja <Icon name="arrow" size={13}/></button>
            </div>
          )}

          {/* Results */}
          {query && results.length>0 && (
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:4,color:`${gold}0.45)`,textTransform:"uppercase" }}>
                  {results.length} resultado{results.length!==1?"s":""} para "{query}"
                </p>
                <button onClick={()=>{setPage("shop");onClose();}} style={{ background:"none",border:"none",color:G,fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
                  Ver todos <Icon name="arrow" size={12}/>
                </button>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:2 }}>
                {results.map(p=>(
                  <div key={p.id} onClick={()=>pick(p)} style={{ cursor:"pointer",background:"rgba(245,243,240,1)",overflow:"hidden",transition:"opacity 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    <div style={{ height:160,overflow:"hidden" }}><ProductVisual type={p.images[0]} size="small"/></div>
                    <div style={{ padding:"12px 14px 16px",background:"#f5f3f0" }}>
                      <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9b8570",marginBottom:3 }}>{p.category}</p>
                      <p style={{ fontFamily:"'Playfair Display',serif",fontSize:14,color:"#1a1410",fontWeight:400,lineHeight:1.2,marginBottom:4 }}>{p.name}</p>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:13,color:"#1a1410" }}>{fmt(p.price)}</p>
                        {p.originalPrice&&<p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:"#9b8570",textDecoration:"line-through" }}>{fmt(p.originalPrice)}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Navbar = ({ page, setPage, cartCount, setCartOpen, notifDot, onSearchOpen, clientUser, onUserClick }) => (
  <nav style={S.nav}>
    <div style={S.navInner}>
      <div style={S.logo} onClick={()=>setPage("home")}>LUZ <span style={{color:G}}>MODA</span></div>
      <ul style={S.navLinks}>
        {[["Coleção","home"],["Loja","shop"],["Editorial","blog"]].map(([l,pg])=>(
          <li key={l} style={{ ...S.navLink, color:page===pg?G:"#a89880" }} onClick={()=>setPage(pg)}>{l}</li>
        ))}
      </ul>
      <div style={S.navIcons}>
        <span style={{ ...S.navIcon }} onClick={onSearchOpen}><Icon name="search" size={18}/></span>
        <span style={{ ...S.navIcon, position:"relative" }} onClick={onUserClick}>{clientUser ? (<><Icon name="user" size={18}/><span style={{ position:"absolute",top:-5,right:-5,width:8,height:8,background:"#c9a96e",borderRadius:"50%",border:"1.5px solid #0a0a0a" }}/></>) : <Icon name="user" size={18}/>}{notifDot&&<span style={{ ...S.badge, background:"#c04040" }}>!</span>}</span>
        <span style={S.navIcon} onClick={()=>setCartOpen(true)}><Icon name="bag" size={18}/>{cartCount>0&&<span style={S.badge}>{cartCount}</span>}</span>
      </div>
    </div>
  </nav>
);

const Toast = ({ msg }) => <div style={S.toast}><Icon name="check" size={14}/>{msg}</div>;

const ProductCard = ({ product, onDetail, wishlist, toggleWish }) => (
  <div style={S.productCard} onClick={()=>onDetail(product)}>
    <div style={{ position:"relative" }}>
      <ProductVisual type={product.images[0]}/>
      {product.badge&&<div style={S.productBadge}>{product.badge}</div>}
      <div style={S.productWish} onClick={e=>{e.stopPropagation();toggleWish(product.id);}}>
        <Icon name={wishlist.includes(product.id)?"heartFill":"heart"} size={16}/>
      </div>
    </div>
    <div style={S.productInfo}>
      <div style={S.productCategory}>{product.category}</div>
      <div style={S.productName}>{product.name}</div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <Stars rating={product.rating} size={11}/>
        <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:"rgba(26,20,16,0.5)" }}>({product.reviews})</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", marginTop:6 }}>
        <span style={S.productPrice}>{fmt(product.price)}</span>
        {product.originalPrice&&<span style={S.productOriginal}>{fmt(product.originalPrice)}</span>}
      </div>
    </div>
  </div>
);

// ─── SHOP ─────────────────────────────────────────────────────────────────────
const ShopPage = ({ setPage, setDetail, wishlist, toggleWish, initialSearch }) => {
  const [cat, setCat] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState(initialSearch || "");
  const searchRef = useRef();

  const filtered = PRODUCTS.filter(p => {
    const matchCat = cat === "Todos" || p.category === cat;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.colors.some(c => c.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
  const sorted = [...filtered].sort((a,b)=>sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);

  return (
    <div style={{ paddingTop:72, background:"#0a0a0a", minHeight:"100vh" }}>
      <div style={{ padding:"48px 0 36px", borderBottom:"1px solid rgba(201,169,110,0.12)" }}>
        <div style={S.container}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
            <div>
              <p style={S.eyebrow}>Coleção Completa</p>
              <h1 style={{ ...S.sectionTitle, margin:0 }}>Loja</h1>
            </div>
            {/* Search bar */}
            <div style={{ display:"flex", alignItems:"center", gap:0, border:"1px solid rgba(201,169,110,0.25)", background:"rgba(255,255,255,0.03)", flex:"0 0 auto", width:"min(360px, 100%)" }}>
              <span style={{ padding:"0 14px", color:"rgba(201,169,110,0.6)", display:"flex", alignItems:"center" }}><Icon name="search" size={16}/></span>
              <input
                ref={searchRef}
                value={search}
                onChange={e=>setSearch(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Escape") setSearch(""); }}
                placeholder="Buscar na loja..."
                style={{ flex:1, padding:"13px 0", background:"transparent", border:"none", outline:"none", fontFamily:"'Montserrat',sans-serif", fontSize:12, letterSpacing:1, color:"#f5f0e8" }}
              />
              {search && (
                <button onClick={()=>setSearch("")} style={{ padding:"0 14px", background:"none", border:"none", color:"rgba(245,240,232,0.35)", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <Icon name="close" size={14}/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={S.container}>
        <div style={{ paddingTop:36 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:2, flexWrap:"wrap" }}>
              {CATEGORIES.map(c=>(
                <button key={c} style={{ ...S.filterBtn, ...(cat===c?S.filterBtnActive:{}) }} onClick={()=>setCat(c)}>{c}</button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:"rgba(245,240,232,0.35)", letterSpacing:1 }}>
                {sorted.length} peça{sorted.length!==1?"s":""}
                {search && ` para "${search}"`}
              </span>
              <select style={{ ...S.filterBtn, padding:"10px 16px", appearance:"none" }} value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="featured">Destaque</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliação</option>
              </select>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"rgba(245,240,232,0.3)", marginBottom:12 }}>
                Nenhum resultado para "{search}"
              </p>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:2, color:"rgba(245,240,232,0.2)", marginBottom:24 }}>
                Tente outro termo ou remova os filtros
              </p>
              <button onClick={()=>{ setSearch(""); setCat("Todos"); }} style={{ ...S.filterBtn, ...S.filterBtnActive }}>
                Limpar busca
              </button>
            </div>
          ) : (
            <div style={{ ...S.productsGrid, marginBottom:80 }}>
              {sorted.map(p=>(
                <ProductCard key={p.id} product={p} onDetail={()=>{setDetail(p);setPage("product");}} wishlist={wishlist} toggleWish={toggleWish}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCT PAGE (with all new features) ────────────────────────────────────
const ProductPage = ({ product, setPage, setCart, wishlist, toggleWish, showToast, viewHistory, setDetail, setAlertProduct }) => {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const discount = product.originalPrice ? Math.round((1-product.price/product.originalPrice)*100) : null;
  const gold = "rgba(201,169,110,";
  const dim = "rgba(245,240,232,";

  const add = () => {
    setCart(c=>{
      const ex=c.find(i=>i.id===product.id&&i.selectedSize===size);
      if(ex) return c.map(i=>i.id===product.id&&i.selectedSize===size?{...i,qty:i.qty+1}:i);
      return [...c,{...product,qty:1,selectedSize:size,selectedColor:color}];
    });
    setAdded(true);
    showToast("Adicionado ao carrinho");
    setTimeout(()=>setAdded(false),2000);
  };

  const reviewCount = (REVIEWS_SEED[product.id]||REVIEWS_SEED[1]).length;

  return (
    <div style={{ paddingTop:0, background:"#0a0a0a" }}>
      {/* Top layout: image + info */}
      <div style={S.detail}>
        <div style={S.detailImg}><ProductVisual type={product.images[0]} size="full"/></div>
        <div style={{ ...S.detailInfo, overflowY:"auto", maxHeight:"calc(100vh - 72px)", marginTop:72 }}>
          <button style={S.backBtn} onClick={()=>setPage("shop")}><Icon name="arrowLeft" size={14}/> Voltar à loja</button>
          <p style={S.detailBrand}>LUZ MODA</p>
          <h1 style={S.detailName}>{product.name}</h1>
          {/* Stars with review count */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, cursor:"pointer" }} onClick={()=>setActiveTab("reviews")}>
            <Stars rating={product.rating} size={14}/>
            <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:G }}>{product.rating}</span>
            <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:`${dim}0.4)`, borderBottom:`1px solid ${gold}0.3)` }}>{reviewCount} avaliações</span>
          </div>
          {/* Price */}
          <div style={{ marginBottom:4 }}>
            <span style={S.detailPrice}>{fmt(product.price)}</span>
            {product.originalPrice&&<span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:14, color:`${dim}0.4)`, textDecoration:"line-through", marginLeft:12 }}>{fmt(product.originalPrice)}</span>}
            {discount&&<span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:G, marginLeft:12, background:`${gold}0.1)`, padding:"3px 8px" }}>-{discount}%</span>}
          </div>
          <p style={S.detailDesc}>{product.description}</p>
          {/* Colors */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:`${dim}0.5)`, textTransform:"uppercase", marginBottom:12 }}>Cor — <span style={{color:G}}>{color}</span></div>
            <div style={{ display:"flex", gap:10 }}>{product.colors.map(c=>(
              <div key={c} title={c} onClick={()=>setColor(c)} style={{ ...S.colorDot, background:colorMap[c]||"#888", outline:color===c?"2px solid #c9a96e":"none", outlineOffset:3 }}/>
            ))}</div>
          </div>
          {/* Sizes */}
          <div style={{ marginBottom:36 }}>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:`${dim}0.5)`, textTransform:"uppercase", marginBottom:12 }}>Tamanho — <span style={{color:G}}>{size}</span></div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {product.sizes.map(s=>(
                <button key={s} style={{ ...S.sizeBtn, ...(size===s?S.sizeBtnActive:{}) }} onClick={()=>setSize(s)}>{s}</button>
              ))}
            </div>
          </div>
          <button style={{ ...S.addBtn, background:added?"#5c8a4a":G }} onClick={add}>
            {added?<><Icon name="check" size={16}/> Adicionado!</>:<>Adicionar ao Carrinho</>}
          </button>
          <button style={S.wishBtn} onClick={()=>{toggleWish(product.id);showToast(wishlist.includes(product.id)?"Removido dos favoritos":"Adicionado aos favoritos");}}>
            <Icon name={wishlist.includes(product.id)?"heartFill":"heart"} size={16}/>
            {wishlist.includes(product.id)?"Nos seus favoritos":"Adicionar aos favoritos"}
          </button>
          {/* Stock alert */}
          <button style={{ width:"100%", padding:"12px", background:"transparent", border:`1px dashed ${gold}0.3)`, color:`${dim}0.5)`, fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", cursor:"pointer", marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }} onClick={()=>setAlertProduct(product)}>
            <Icon name="bell" size={13}/> Alerta de estoque / queda de preço
          </button>
          {/* Specs */}
          <div style={{ marginTop:40, paddingTop:32, borderTop:`1px solid ${gold}0.15)` }}>
            {[["Composição","100% lã merino italiana certificada"],["Origem","Milão, Itália"],["Cuidados","Lavar à mão ou lavagem delicada"],["Entrega","2–5 dias úteis · Frete Grátis"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", paddingBottom:14, marginBottom:14, borderBottom:`1px solid ${gold}0.07)` }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:1, color:`${dim}0.4)` }}>{k}</span>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:`${dim}0.7)`, maxWidth:240, textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + reviews/Q&A below */}
      <div style={{ background:"#080807", borderTop:`1px solid ${gold}0.1)` }}>
        <div style={S.container}>
          {/* Tab bar */}
          <div style={{ display:"flex", borderBottom:`1px solid ${gold}0.1)` }}>
            {[["reviews",`Avaliações (${reviewCount})`],["qa","Perguntas & Respostas"],["look","Complete o Look"]].map(([key,label])=>(
              <button key={key} onClick={()=>setActiveTab(key)} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", padding:"20px 28px", background:"transparent", border:"none", color:activeTab===key?G:`${dim}0.4)`, borderBottom:activeTab===key?`2px solid ${G}`:"2px solid transparent", cursor:"pointer", transition:"all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ paddingBottom:80 }}>
            {activeTab==="reviews" && <ReviewsSection productId={product.id} productName={product.name} showToast={showToast}/>}
            {activeTab==="qa" && <QASection productId={product.id} showToast={showToast}/>}
            {activeTab==="look" && (
              <div style={{ paddingTop:48 }}>
                <CompleteTheLook currentProductId={product.id} setDetail={setDetail} setPage={setPage} wishlist={wishlist} toggleWish={toggleWish}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CART DRAWER ─────────────────────────────────────────────────────────────
const CartDrawer = ({ open, setOpen, cart, setCart, setPage }) => {
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const updQty = (id,size,d)=>setCart(c=>c.map(i=>i.id===id&&i.selectedSize===size?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0));
  const rm = (id,size)=>setCart(c=>c.filter(i=>!(i.id===id&&i.selectedSize===size)));
  if(!open) return null;
  return (
    <>
      <div style={S.cartOverlay} onClick={()=>setOpen(false)}/>
      <div style={S.cart}>
        <div style={S.cartHeader}>
          <span style={S.cartTitle}>Carrinho</span>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {cart.length>0&&<span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, color:"rgba(245,240,232,0.4)" }}>{cart.reduce((s,i)=>s+i.qty,0)} peças</span>}
            <button style={{ background:"none", border:"none", color:"rgba(245,240,232,0.5)", cursor:"pointer" }} onClick={()=>setOpen(false)}><Icon name="close" size={20}/></button>
          </div>
        </div>
        <div style={S.cartItems}>
          {cart.length===0?(
            <div style={S.emptyCart}><Icon name="bag" size={40}/><span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, letterSpacing:2, textTransform:"uppercase" }}>Carrinho vazio</span></div>
          ):cart.map(item=>(
            <div key={`${item.id}-${item.selectedSize}`} style={S.cartItem}>
              <div style={S.cartItemImg}><ProductVisual type={item.images[0]} size="small"/></div>
              <div style={S.cartItemInfo}>
                <div style={S.cartItemName}>{item.name}</div>
                <div style={S.cartItemMeta}>{item.selectedSize} · {item.selectedColor}</div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <button style={S.qtyBtn} onClick={()=>updQty(item.id,item.selectedSize,-1)}><Icon name="minus" size={12}/></button>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:"#f5f0e8", minWidth:20, textAlign:"center" }}>{item.qty}</span>
                  <button style={S.qtyBtn} onClick={()=>updQty(item.id,item.selectedSize,1)}><Icon name="plus" size={12}/></button>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:14, color:G }}>{fmt(item.price*item.qty)}</span>
                  <button style={{ background:"none", border:"none", color:"rgba(201,169,110,0.4)", cursor:"pointer" }} onClick={()=>rm(item.id,item.selectedSize)}><Icon name="trash" size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div style={S.cartFooter}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"rgba(245,240,232,0.55)" }}>Total</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:G }}>{fmt(total*1.1)}</span>
            </div>
            <button style={S.checkoutBtn} onClick={()=>{setOpen(false);setPage("checkout");}}>Finalizar Compra <Icon name="arrow" size={16}/></button>
          </div>
        )}
      </div>
    </>
  );
};

// ─── CHECKOUT ────────────────────────────────────────────────────────────────
const CheckoutPage = ({ cart, setPage, setCart, showToast }) => {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("card");
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)*1.1;
  const gold="rgba(201,169,110,", dim="rgba(245,240,232,";
  const place=()=>{ setCart([]); showToast("Pedido confirmado!"); setPage("home"); };
  return (
    <div style={S.checkout}>
      <div style={S.checkoutLeft}>
        <button style={S.backBtn} onClick={()=>setPage("shop")}><Icon name="arrowLeft" size={14}/> Continuar comprando</button>
        <div style={{ display:"flex", gap:0, marginBottom:48 }}>
          {["Entrega","Pagamento","Revisão"].map((l,i)=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",border:`1px solid ${step>=i+1?G:"rgba(201,169,110,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",fontSize:11,color:step>=i+1?G:`${dim}0.3)` }}>
                  {step>i+1?<Icon name="check" size={12}/>:i+1}
                </div>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:step>=i+1?"#f5f0e8":`${dim}0.3)` }}>{l}</span>
              </div>
              {i<2&&<div style={{ width:40,height:1,background:`${gold}0.2)`,margin:"0 8px" }}/>}
            </div>
          ))}
        </div>
        {step===1&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:"#f5f0e8", marginBottom:32, fontWeight:400 }}>Endereço de entrega</h2>
            {[["Nome",""],["Email","email@exemplo.com"],["CEP",""],["Endereço",""]].map(([l,ph])=>(
              <div key={l} style={{ marginBottom:16 }}><label style={S.inputLabel}>{l}</label><input style={S.input} placeholder={ph}/></div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              <div><label style={S.inputLabel}>Cidade</label><input style={S.input} placeholder=""/></div>
              <div><label style={S.inputLabel}>Estado</label><input style={S.input} placeholder="SP"/></div>
            </div>
            <button style={{ ...S.addBtn, margin:0 }} onClick={()=>setStep(2)}>Continuar para Pagamento <Icon name="arrow" size={16}/></button>
          </div>
        )}
        {step===2&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:"#f5f0e8", marginBottom:32, fontWeight:400 }}>Pagamento</h2>
            {[["card","Cartão de Crédito/Débito","Visa · Master · Amex"],["pix","PIX","Aprovação imediata"],["paypal","PayPal","Conta PayPal"]].map(([id,l,sub])=>(
              <div key={id} style={{ ...S.paymentOption, ...(payment===id?{borderColor:G}:{}) }} onClick={()=>setPayment(id)}>
                <div style={{ width:16,height:16,borderRadius:"50%",border:`1px solid ${gold}0.4)`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {payment===id&&<div style={{ width:8,height:8,borderRadius:"50%",background:G }}/>}
                </div>
                <div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"#f5f0e8" }}>{l}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.35)` }}>{sub}</div>
                </div>
              </div>
            ))}
            {payment==="card"&&(
              <div style={{ marginTop:20 }}>
                <div style={{ marginBottom:16 }}><label style={S.inputLabel}>Número do Cartão</label><input style={S.input} placeholder="0000 0000 0000 0000"/></div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                  <div><label style={S.inputLabel}>Validade</label><input style={S.input} placeholder="MM/AA"/></div>
                  <div><label style={S.inputLabel}>CVV</label><input style={S.input} placeholder="000"/></div>
                </div>
              </div>
            )}
            <div style={{ display:"flex",gap:12,marginTop:24 }}>
              <button style={{ ...S.wishBtn, flex:1 }} onClick={()=>setStep(1)}><Icon name="arrowLeft" size={14}/> Voltar</button>
              <button style={{ ...S.addBtn, flex:2, margin:0 }} onClick={()=>setStep(3)}>Revisar Pedido <Icon name="arrow" size={16}/></button>
            </div>
          </div>
        )}
        {step===3&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, color:"#f5f0e8", marginBottom:32, fontWeight:400 }}>Confirmar pedido</h2>
            {cart.map(item=>(
              <div key={item.id} style={{ display:"flex",gap:16,marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${gold}0.1)` }}>
                <div style={{ width:60,height:75,background:"#f5f3f0",flexShrink:0,overflow:"hidden" }}><ProductVisual type={item.images[0]} size="small"/></div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#f5f0e8" }}>{item.name}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, color:`${dim}0.4)`, marginTop:4 }}>{item.selectedSize} · {item.qty}x</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:G, marginTop:6 }}>{fmt(item.price*item.qty)}</div>
                </div>
              </div>
            ))}
            <div style={{ display:"flex",gap:12,marginTop:24 }}>
              <button style={{ ...S.wishBtn, flex:1 }} onClick={()=>setStep(2)}><Icon name="arrowLeft" size={14}/> Voltar</button>
              <button style={{ ...S.addBtn, flex:2, margin:0 }} onClick={place}>Confirmar Pedido <Icon name="check" size={16}/></button>
            </div>
          </div>
        )}
      </div>
      <div style={S.checkoutRight}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#f5f0e8", marginBottom:28, fontWeight:400 }}>Resumo</h3>
        {cart.map(i=>(
          <div key={i.id} style={{ display:"flex",justifyContent:"space-between",marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${gold}0.08)` }}>
            <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:`${dim}0.55)` }}>{i.name} ×{i.qty}</span>
            <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:"#f5f0e8" }}>{fmt(i.price*i.qty)}</span>
          </div>
        ))}
        <div style={{ display:"flex",justifyContent:"space-between",paddingTop:16,marginTop:8 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#f5f0e8" }}>Total</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:G }}>{fmt(total)}</span>
        </div>
      </div>
    </div>
  );
};


// ─── ADMIN LOGIN PAGE ─────────────────────────────────────────────────────────
const AdminLoginPage = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const gold = "rgba(201,169,110,", dim = "rgba(245,240,232,";

  // Hardcoded credentials for demo (in production: call /api/auth/login)
  const ADMIN_CREDENTIALS = [
    { email: "admin@luzmoda.com", password: "Admin@2026", role: "superadmin", name: "Admin Geral" },
    { email: "manager@luzmoda.com", password: "Manager@2026", role: "admin", name: "Gerente" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = ADMIN_CREDENTIALS.find(c => c.email === email.toLowerCase() && c.password === password);
      if (match) {
        onLogin(match);
      } else {
        setError("Credenciais inválidas. Verifique e-mail e senha.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#050504", display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      {/* Background grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(201,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.03) 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>
      {/* Corner decoration */}
      <div style={{ position:"absolute", top:0, right:0, width:300, height:300, background:"radial-gradient(circle at top right, rgba(201,169,110,0.06), transparent 70%)" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, width:300, height:300, background:"radial-gradient(circle at bottom left, rgba(201,169,110,0.04), transparent 70%)" }}/>

      <div style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, letterSpacing:8, color:"#f5f0e8", marginBottom:8 }}>
            LUZ <span style={{color:"#c9a96e"}}>MODA</span>
          </div>
          <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:5, color:"rgba(201,169,110,0.5)", textTransform:"uppercase" }}>
            Acesso Restrito
          </div>
        </div>

        {/* Card */}
        <div style={{ background:"#0f0e0c", border:`1px solid ${gold}0.15)`, padding:"44px 40px" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#f5f0e8", fontWeight:400, marginBottom:6 }}>Painel Administrativo</h2>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:`${dim}0.35)`, letterSpacing:1, marginBottom:36 }}>
            Acesso exclusivo para colaboradores autorizados
          </p>

          {error && (
            <div style={{ background:"rgba(192,64,64,0.12)", border:"1px solid rgba(192,64,64,0.3)", padding:"12px 16px", marginBottom:24, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:"#c07070", fontSize:16 }}>⚠</span>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, color:"#c07070", letterSpacing:1 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <label style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, color:`${dim}0.45)`, textTransform:"uppercase", display:"block", marginBottom:8 }}>
                E-mail corporativo
              </label>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                placeholder="seu@luzmoda.com" autoComplete="username"
                style={{ width:"100%", padding:"14px 16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${gold}0.2)`, color:"#f5f0e8", fontFamily:"'Montserrat',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                onFocus={e=>e.target.style.borderColor="#c9a96e"} onBlur={e=>e.target.style.borderColor="rgba(201,169,110,0.2)"}
              />
            </div>
            <div>
              <label style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, color:`${dim}0.45)`, textTransform:"uppercase", display:"block", marginBottom:8 }}>
                Senha
              </label>
              <div style={{ position:"relative" }}>
                <input
                  type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ width:"100%", padding:"14px 44px 14px 16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${gold}0.2)`, color:"#f5f0e8", fontFamily:"'Montserrat',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                  onFocus={e=>e.target.style.borderColor="#c9a96e"} onBlur={e=>e.target.style.borderColor="rgba(201,169,110,0.2)"}
                />
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:`${dim}0.3)`, cursor:"pointer", fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:1 }}>
                  {showPass?"OCULTAR":"MOSTRAR"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width:"100%", padding:"16px", background:loading?"rgba(201,169,110,0.5)":"#c9a96e", color:"#0a0a0a", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:4, textTransform:"uppercase", border:"none", cursor:loading?"not-allowed":"pointer", marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"background 0.2s" }}>
              {loading ? (
                <>
                  <span style={{ width:14, height:14, border:"2px solid rgba(0,0,0,0.3)", borderTopColor:"#0a0a0a", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>
                  Verificando...
                </>
              ) : "Entrar no Painel"}
            </button>
          </form>

          <div style={{ marginTop:28, paddingTop:24, borderTop:`1px solid ${gold}0.1)`, textAlign:"center" }}>
            <button onClick={onBack} style={{ background:"none", border:"none", color:`${dim}0.35)`, cursor:"pointer", fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", display:"inline-flex", alignItems:"center", gap:6 }}>
              <Icon name="arrowLeft" size={12}/> Voltar ao site
            </button>
          </div>
        </div>

        {/* Security note */}
        <div style={{ textAlign:"center", marginTop:24, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Icon name="secure" size={12}/>
          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:2, color:`${dim}0.2)`, textTransform:"uppercase" }}>
            Conexão segura · SSL 256-bit
          </span>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
const ADMIN_ORDERS=[
  {id:"#LUZ-8821",customer:"Isabella Ferreira",items:3,total:"R$ 7.830",status:"Entregue",date:"28 Mai 2026"},
  {id:"#LUZ-8820",customer:"Rodrigo Almeida",items:1,total:"R$ 4.800",status:"Em Trânsito",date:"28 Mai 2026"},
  {id:"#LUZ-8819",customer:"Fernanda Costa",items:2,total:"R$ 3.080",status:"Em Trânsito",date:"27 Mai 2026"},
  {id:"#LUZ-8818",customer:"Thiago Santos",items:1,total:"R$ 2.890",status:"Confirmado",date:"27 Mai 2026"},
  {id:"#LUZ-8817",customer:"Juliana Lima",items:4,total:"R$ 9.120",status:"Entregue",date:"26 Mai 2026"},
];
const statusColors={ "Entregue":{bg:"rgba(92,138,74,0.15)",color:"#5c8a4a"}, "Em Trânsito":{bg:"rgba(201,169,110,0.15)",color:"#c9a96e"}, "Confirmado":{bg:"rgba(24,95,165,0.15)",color:"#5490d0"}, "Cancelado":{bg:"rgba(162,45,45,0.15)",color:"#c07070"} };

const AdminPage = ({ setPage }) => {
  const [sec, setSec] = useState("dashboard");
  const sales=[65,80,55,90,75,95,88,72,85,92,78,96];
  const months=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const navItems=[["dashboard","chart","Dashboard"],["orders","package","Pedidos"],["products","grid","Produtos"],["reviews","star","Avaliações"],["customers","users","Clientes"],["settings","settings","Configurações"]];
  const gold="rgba(201,169,110,", dim="rgba(245,240,232,";

  // Reviews admin data
  const allReviews = Object.values(REVIEWS_SEED).flat();
  const pendingReviews = allReviews.filter((_,i)=>i%3===0);

  return (
    <div style={S.admin}>
      <div style={S.adminSidebar}>
        <div style={{ padding:"28px 24px", borderBottom:`1px solid ${gold}0.12)` }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, letterSpacing:6, color:"#f5f0e8" }}>LUZ <span style={{color:G}}>MODA</span></div>
          <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, color:G, textTransform:"uppercase", marginTop:4 }}>Painel Admin</div>
        </div>
        <nav style={{ padding:"20px 0", flex:1 }}>
          <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:3, color:`${gold}0.4)`, textTransform:"uppercase", padding:"0 24px", marginBottom:8, marginTop:8 }}>Principal</div>
          {navItems.map(([id,icon,label])=>(
            <div key={id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 24px",cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontSize:12,letterSpacing:1,color:sec===id?G:`${dim}0.5)`,borderLeft:`2px solid ${sec===id?G:"transparent"}`,background:sec===id?`${gold}0.06)`:"transparent",transition:"all 0.2s" }} onClick={()=>setSec(id)}>
              <Icon name={icon} size={16}/>{label}
              {id==="reviews"&&<span style={{ marginLeft:"auto",background:"rgba(201,169,110,0.2)",color:G,fontFamily:"'Montserrat',sans-serif",fontSize:9,padding:"2px 6px",borderRadius:2 }}>{pendingReviews.length}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding:"20px 24px", borderTop:`1px solid ${gold}0.12)` }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`${gold}0.15)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:G,fontWeight:600 }}>A</div>
            <div>
              <div style={{ fontSize:11, color:"#f5f0e8" }}>Admin Geral</div>
              <div style={{ fontSize:9, letterSpacing:1, color:`${gold}0.5)`, textTransform:"uppercase" }}>Super Admin</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:11,color:`${dim}0.4)`,cursor:"pointer",fontFamily:"'Montserrat',sans-serif" }} onClick={()=>setPage("adminLogout")}>
            <Icon name="logout" size={14}/> Sair do painel
          </div>
        </div>
      </div>

      <div style={S.adminContent}>
        {sec==="dashboard"&&(
          <>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:40 }}>
              <div><div style={S.adminTitle}>Dashboard</div><div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:`${gold}0.6)`,letterSpacing:2 }}>Quinta-feira, 28 de Maio de 2026</div></div>
              <button style={{ ...S.addBtn, width:"auto",padding:"10px 20px",margin:0 }}>+ Novo Produto</button>
            </div>
            <div style={S.statsGrid}>
              {[["Receita Mensal","R$ 284.750","↑ 18% vs mês anterior"],["Pedidos Hoje","142","↑ 24 vs ontem"],["Avaliações (mês)","89","★ 4.8 média"],["Ticket Médio","R$ 2.005","↑ 6% vs mês anterior"]].map(([l,v,d])=>(
                <div key={l} style={S.statCard}><div style={S.statLabel}>{l}</div><div style={S.statValue}>{v}</div><div style={S.statDelta}>{d}</div></div>
              ))}
            </div>
            <div style={S.adminCard}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <div style={S.adminCardTitle}>Vendas 2026</div>
                <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:1,color:G }}>Últimos 12 meses</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:4,marginTop:24 }}>
                {sales.map((v,i)=>(
                  <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
                    <div style={{ height:140,width:"100%",display:"flex",alignItems:"flex-end" }}>
                      <div style={{ width:"100%",height:`${v}%`,background:i===4?G:`${gold}0.2)` }}/>
                    </div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1,color:`${gold}0.6)`,textAlign:"center",marginTop:8 }}>{months[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.adminCard}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                <div style={S.adminCardTitle}>Pedidos Recentes</div>
                <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:1,color:G,cursor:"pointer" }} onClick={()=>setSec("orders")}>Ver todos →</span>
              </div>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["Pedido","Cliente","Total","Status","Data"].map(h=><th key={h} style={S.adminTh}>{h}</th>)}</tr></thead>
                <tbody>{ADMIN_ORDERS.slice(0,4).map(o=>(
                  <tr key={o.id}>
                    <td style={{ ...S.adminTd,color:G }}>{o.id}</td>
                    <td style={S.adminTd}>{o.customer}</td>
                    <td style={S.adminTd}>{o.total}</td>
                    <td style={S.adminTd}><span style={{ ...S.statusBadge,...(statusColors[o.status]||{}) }}>{o.status}</span></td>
                    <td style={S.adminTd}>{o.date}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {sec==="reviews"&&(
          <>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:40 }}>
              <div><div style={S.adminTitle}>Avaliações</div><div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:`${gold}0.6)`,letterSpacing:2 }}>{allReviews.length} avaliações · {pendingReviews.length} aguardando resposta de Q&A</div></div>
            </div>
            {/* Summary cards */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32 }}>
              {[["Total","47"],["Nota Média","4.82 ★"],["Com Fotos","28"],["Verificadas","41"]].map(([l,v])=>(
                <div key={l} style={S.statCard}><div style={S.statLabel}>{l}</div><div style={{ ...S.statValue,fontSize:28 }}>{v}</div></div>
              ))}
            </div>
            <div style={S.adminCard}>
              <div style={S.adminCardTitle}>Avaliações Recentes</div>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["Cliente","Produto","Nota","Título","Status","Data"].map(h=><th key={h} style={S.adminTh}>{h}</th>)}</tr></thead>
                <tbody>{allReviews.map(r=>(
                  <tr key={r.id}>
                    <td style={{ ...S.adminTd,color:"#f5f0e8" }}>{r.author}</td>
                    <td style={S.adminTd}>Trench Coat</td>
                    <td style={{ ...S.adminTd,color:G }}>{"★".repeat(r.rating)}</td>
                    <td style={S.adminTd}>{r.title}</td>
                    <td style={S.adminTd}><span style={{ ...S.statusBadge,...(r.verified?statusColors["Entregue"]:statusColors["Confirmado"]) }}>{r.verified?"Verificada":"Pendente"}</span></td>
                    <td style={S.adminTd}>{r.date}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {/* Q&A pending */}
            <div style={S.adminCard}>
              <div style={S.adminCardTitle}>Perguntas Aguardando Resposta</div>
              {(QA_SEED[1]||[]).filter(q=>!q.answer).map(q=>(
                <div key={q.id} style={{ padding:"16px 0",borderBottom:`1px solid ${gold}0.08)` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16 }}>
                    <div>
                      <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:13,color:"#f5f0e8",marginBottom:4 }}>{q.question}</p>
                      <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:`${dim}0.4)` }}>{q.askedBy} · {q.date}</span>
                    </div>
                    <button style={{ ...S.addBtn,width:"auto",padding:"8px 16px",margin:0,fontSize:10,letterSpacing:2,flexShrink:0 }}>Responder</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {sec==="orders"&&(
          <>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:40 }}>
              <div style={S.adminTitle}>Pedidos</div>
            </div>
            <div style={S.adminCard}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["Pedido","Cliente","Itens","Total","Status","Data"].map(h=><th key={h} style={S.adminTh}>{h}</th>)}</tr></thead>
                <tbody>{ADMIN_ORDERS.map(o=>(
                  <tr key={o.id}>
                    <td style={{ ...S.adminTd,color:G }}>{o.id}</td>
                    <td style={S.adminTd}>{o.customer}</td>
                    <td style={S.adminTd}>{o.items}</td>
                    <td style={S.adminTd}>{o.total}</td>
                    <td style={S.adminTd}><span style={{ ...S.statusBadge,...(statusColors[o.status]||{}) }}>{o.status}</span></td>
                    <td style={S.adminTd}>{o.date}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {sec==="products"&&(
          <>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:40 }}>
              <div style={S.adminTitle}>Produtos</div>
              <button style={{ ...S.addBtn,width:"auto",padding:"10px 24px",margin:0 }}>+ Novo Produto</button>
            </div>
            <div style={S.adminCard}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["Produto","Categoria","Preço","Avaliação","Reviews","Status"].map(h=><th key={h} style={S.adminTh}>{h}</th>)}</tr></thead>
                <tbody>{PRODUCTS.map(p=>(
                  <tr key={p.id}>
                    <td style={{ ...S.adminTd,color:"#f5f0e8" }}>{p.name}</td>
                    <td style={S.adminTd}>{p.category}</td>
                    <td style={{ ...S.adminTd,color:G }}>{fmt(p.price)}</td>
                    <td style={S.adminTd}><Stars rating={p.rating} size={11}/> {p.rating}</td>
                    <td style={S.adminTd}>{p.reviews}</td>
                    <td style={S.adminTd}><span style={{ ...S.statusBadge,background:"rgba(92,138,74,0.15)",color:"#5c8a4a" }}>Ativo</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {sec==="customers"&&(
          <>
            <div style={{ marginBottom:40 }}><div style={S.adminTitle}>Clientes</div></div>
            <div style={S.statsGrid}>
              {[["Total","8.431"],["Novos (mês)","312"],["VIP LUX","1.204"],["Com Avaliação","2.847"]].map(([l,v])=>(
                <div key={l} style={S.statCard}><div style={S.statLabel}>{l}</div><div style={S.statValue}>{v}</div></div>
              ))}
            </div>
            <div style={S.adminCard}>
              <div style={S.adminCardTitle}>Top Clientes</div>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr>{["Nome","Pedidos","Total","Reviews","Nível"].map(h=><th key={h} style={S.adminTh}>{h}</th>)}</tr></thead>
                <tbody>{[["Isabella F.",28,"R$ 82.400",12,"VIP Platina"],["Rodrigo A.",19,"R$ 54.200",5,"VIP Ouro"],["Fernanda C.",15,"R$ 38.900",8,"VIP Prata"],["Thiago S.",11,"R$ 24.100",3,"Premium"]].map(([n,p,t,r,l])=>(
                  <tr key={n}>
                    <td style={{ ...S.adminTd,color:"#f5f0e8" }}>{n}</td>
                    <td style={S.adminTd}>{p}</td>
                    <td style={{ ...S.adminTd,color:G }}>{t}</td>
                    <td style={S.adminTd}>{r}</td>
                    <td style={S.adminTd}><span style={{ ...S.statusBadge,background:`${gold}0.15)`,color:G }}>{l}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {sec==="settings"&&(
          <div><div style={{ marginBottom:40 }}><div style={S.adminTitle}>Configurações</div></div>
          <div style={S.adminCard}><div style={{ textAlign:"center",padding:"48px 0",color:`${dim}0.3)` }}><div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,marginBottom:8 }}>Configurações do Sistema</div><div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:12,letterSpacing:1 }}>Módulo Enterprise</div></div></div></div>
        )}
      </div>
    </div>
  );
};

// ─── HOME ─────────────────────────────────────────────────────────────────────


// ─── AUTH MODAL (Login / Cadastro) ────────────────────────────────────────────
const AuthModal = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const gold = "rgba(201,169,110,", dim = "rgba(245,240,232,";

  const DEMO_USERS = [
    { id:"u1", name:"Isabella Ferreira", email:"isabella@email.com", password:"Senha@123", vipLevel:"platinum", points:8240 },
    { id:"u2", name:"Rodrigo Almeida",   email:"rodrigo@email.com",  password:"Senha@123", vipLevel:"gold",     points:5420 },
  ];

  const set = (k, v) => { setForm(f=>({...f,[k]:v})); setError(""); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    setTimeout(() => {
      if (mode === "login") {
        const u = DEMO_USERS.find(u => u.email === form.email.toLowerCase() && u.password === form.password);
        if (u) { onLogin(u); onClose(); }
        else setError("E-mail ou senha incorretos.");
      } else {
        if (!form.name.trim()) { setError("Informe seu nome."); setLoading(false); return; }
        if (form.password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres."); setLoading(false); return; }
        const exists = DEMO_USERS.find(u => u.email === form.email.toLowerCase());
        if (exists) { setError("Este e-mail já está cadastrado."); setLoading(false); return; }
        const newUser = { id:"u"+Date.now(), name:form.name.trim(), email:form.email.toLowerCase(), vipLevel:"standard", points:0 };
        onLogin(newUser); onClose();
      }
      setLoading(false);
    }, 700);
  };

  return (
    <>
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,backdropFilter:"blur(6px)" }} onClick={onClose}/>
      <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:301,width:"min(440px,92vw)",background:"#0f0e0c",border:`1px solid ${gold}0.18)`,padding:"44px 40px",boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute",top:16,right:16,background:"none",border:"none",color:`${dim}0.3)`,cursor:"pointer" }}><Icon name="close" size={18}/></button>

        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,letterSpacing:6,color:"#f5f0e8" }}>LUZ <span style={{color:"#c9a96e"}}>MODA</span></div>
        </div>

        {/* Tab switcher */}
        <div style={{ display:"flex",gap:0,marginBottom:32,borderBottom:`1px solid ${gold}0.12)` }}>
          {[["login","Entrar"],["register","Criar conta"]].map(([m,l]) => (
            <button key={m} onClick={()=>{ setMode(m); setError(""); setForm({name:"",email:"",password:""}); }}
              style={{ flex:1,padding:"12px 0",background:"transparent",border:"none",borderBottom:mode===m?`2px solid #c9a96e`:"2px solid transparent",fontFamily:"'Montserrat',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:mode===m?"#c9a96e":`${dim}0.4)`,cursor:"pointer",marginBottom:-1,transition:"all 0.2s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"rgba(192,64,64,0.1)",border:"1px solid rgba(192,64,64,0.25)",padding:"10px 14px",marginBottom:20,fontFamily:"'Montserrat',sans-serif",fontSize:11,color:"#c07070",letterSpacing:0.5 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:16 }}>
          {mode === "register" && (
            <div>
              <label style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:`${dim}0.4)`,textTransform:"uppercase",display:"block",marginBottom:7 }}>Nome completo</label>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Seu nome" required
                style={{ width:"100%",padding:"13px 15px",background:"rgba(255,255,255,0.04)",border:`1px solid ${gold}0.2)`,color:"#f5f0e8",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#c9a96e"} onBlur={e=>e.target.style.borderColor="rgba(201,169,110,0.2)"}/>
            </div>
          )}
          <div>
            <label style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:`${dim}0.4)`,textTransform:"uppercase",display:"block",marginBottom:7 }}>E-mail</label>
            <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="seu@email.com" required
              style={{ width:"100%",padding:"13px 15px",background:"rgba(255,255,255,0.04)",border:`1px solid ${gold}0.2)`,color:"#f5f0e8",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor="#c9a96e"} onBlur={e=>e.target.style.borderColor="rgba(201,169,110,0.2)"}/>
          </div>
          <div>
            <label style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:`${dim}0.4)`,textTransform:"uppercase",display:"block",marginBottom:7 }}>Senha</label>
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" required
                style={{ width:"100%",padding:"13px 44px 13px 15px",background:"rgba(255,255,255,0.04)",border:`1px solid ${gold}0.2)`,color:"#f5f0e8",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#c9a96e"} onBlur={e=>e.target.style.borderColor="rgba(201,169,110,0.2)"}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:`${dim}0.3)`,cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1 }}>
                {showPass?"OCULTAR":"MOSTRAR"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width:"100%",padding:"15px",background:loading?"rgba(201,169,110,0.5)":"#c9a96e",color:"#0a0a0a",fontFamily:"'Montserrat',sans-serif",fontSize:11,letterSpacing:4,textTransform:"uppercase",border:"none",cursor:loading?"not-allowed":"pointer",marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"background 0.2s" }}>
            {loading
              ? <><span style={{ width:13,height:13,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0a0a0a",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite" }}/> Aguarde...</>
              : mode==="login" ? "Entrar na minha conta" : "Criar conta grátis"}
          </button>
        </form>

        {/* Demo hint */}
        {mode === "login" && (
          <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1,color:`${dim}0.22)`,textAlign:"center",marginTop:20,lineHeight:1.7 }}>
            Demo: isabella@email.com · Senha@123
          </p>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

// ─── ACCOUNT DRAWER ────────────────────────────────────────────────────────────
const AccountDrawer = ({ user, onClose, onLogout, orders, wishlist, setDetail, setPage }) => {
  const [tab, setTab] = useState("overview");
  const gold = "rgba(201,169,110,", dim = "rgba(245,240,232,";

  const VIP_LEVELS = { standard:"Padrão", silver:"Prata", gold:"Ouro", platinum:"Platina" };
  const VIP_COLORS = { standard:"#888", silver:"#aaa", gold:"#c9a96e", platinum:"#e0d0ff" };
  const nextPoints = { standard:1000, silver:3000, gold:8000, platinum:99999 };
  const progress = Math.min(100, ((user.points||0) / (nextPoints[user.vipLevel||"standard"]||1000)) * 100);

  const SAMPLE_ORDERS = [
    { id:"LUZ-8821", date:"20 Mai 2026", status:"Entregue", total:8459, items:2 },
    { id:"LUZ-8819", date:"27 Mai 2026", status:"Em Separação", total:3520, items:1 },
  ];

  return (
    <>
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <div style={{ position:"fixed",top:0,right:0,bottom:0,width:"min(400px,100vw)",background:"#0f0e0c",zIndex:201,display:"flex",flexDirection:"column",boxShadow:"-4px 0 40px rgba(0,0,0,0.5)",overflow:"hidden" }}>

        {/* Header */}
        <div style={{ padding:"28px 28px 0",borderBottom:`1px solid ${gold}0.12)`,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
            <span style={{ fontFamily:"'Playfair Display',serif",fontSize:20,color:"#f5f0e8",fontWeight:400 }}>Minha Conta</span>
            <button onClick={onClose} style={{ background:"none",border:"none",color:`${dim}0.4)`,cursor:"pointer" }}><Icon name="close" size={20}/></button>
          </div>

          {/* User info */}
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:20 }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:`${gold}0.15)`,border:`1px solid ${gold}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Playfair Display',serif",fontSize:18,color:"#c9a96e" }}>
              {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:13,color:"#f5f0e8",fontWeight:500,marginBottom:3 }}>{user.name}</div>
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:`${dim}0.4)`,letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.email}</div>
            </div>
            <span style={{ marginLeft:"auto",flexShrink:0,fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",padding:"3px 9px",background:`${gold}0.12)`,color:VIP_COLORS[user.vipLevel||"standard"],border:`1px solid ${gold}0.2)`,whiteSpace:"nowrap" }}>
              {VIP_LEVELS[user.vipLevel||"standard"]}
            </span>
          </div>

          {/* VIP Points bar */}
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,color:`${dim}0.4)`,textTransform:"uppercase" }}>Pontos LUX</span>
              <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:"#c9a96e",fontWeight:500 }}>{(user.points||0).toLocaleString("pt-BR")}</span>
            </div>
            <div style={{ height:3,background:`${gold}0.1)`,borderRadius:2 }}>
              <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(to right,#c9a96e,#e8d5a3)",borderRadius:2,transition:"width 1s ease" }}/>
            </div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,color:`${dim}0.25)`,marginTop:4,letterSpacing:1 }}>
              {(nextPoints[user.vipLevel||"standard"]||0) - (user.points||0) > 0
                ? `${((nextPoints[user.vipLevel||"standard"]||0) - (user.points||0)).toLocaleString("pt-BR")} pts para o próximo nível`
                : "Nível máximo atingido 🏆"}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",gap:0 }}>
            {[["overview","Início"],["orders","Pedidos"],["wishlist","Favoritos"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"10px 0",background:"transparent",border:"none",borderBottom:tab===t?`2px solid #c9a96e`:"2px solid transparent",fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:tab===t?"#c9a96e":`${dim}0.35)`,cursor:"pointer",marginBottom:-1,transition:"all 0.2s" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1,overflowY:"auto",padding:"24px 28px" }}>

          {tab === "overview" && (
            <div>
              {/* Quick stats */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24 }}>
                {[["Pedidos","2",`${gold}0.15)`],["Favoritos",wishlist.length,`${gold}0.15)`],["Pontos",(user.points||0).toLocaleString("pt-BR"),`${gold}0.15)`],["Nível",VIP_LEVELS[user.vipLevel||"standard"],`${gold}0.15)`]].map(([l,v,bg])=>(
                  <div key={l} style={{ background:bg,border:`1px solid ${gold}0.1)`,padding:"16px 14px",textAlign:"center" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,color:"#c9a96e",marginBottom:2 }}>{v}</div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:`${dim}0.4)` }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Last order */}
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:`${gold}0.5)`,textTransform:"uppercase",marginBottom:12 }}>Último pedido</p>
              <div style={{ background:`${gold}0.04)`,border:`1px solid ${gold}0.08)`,padding:"16px",marginBottom:24 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:12,color:"#c9a96e" }}>{SAMPLE_ORDERS[0].id}</span>
                  <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:`${dim}0.4)` }}>{SAMPLE_ORDERS[0].date}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:1,padding:"3px 8px",background:"rgba(92,138,74,0.15)",color:"#5c8a4a" }}>{SAMPLE_ORDERS[0].status}</span>
                  <span style={{ fontFamily:"'Playfair Display',serif",fontSize:16,color:"#f5f0e8" }}>{fmt(SAMPLE_ORDERS[0].total)}</span>
                </div>
              </div>

              {/* Coupon for new user */}
              {(user.vipLevel==="standard") && (
                <div style={{ background:`${gold}0.06)`,border:`1px dashed ${gold}0.3)`,padding:"16px",textAlign:"center",marginBottom:24 }}>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:G,textTransform:"uppercase",marginBottom:6 }}>Seu cupom de boas-vindas</div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,color:"#f5f0e8",letterSpacing:4 }}>BEMVINDO10</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:`${dim}0.4)`,marginTop:4 }}>10% de desconto na primeira compra</div>
                </div>
              )}

              {/* Go to shop */}
              <button onClick={()=>{ setPage("shop"); onClose(); }} style={{ width:"100%",padding:"14px",background:"#c9a96e",color:"#0a0a0a",fontFamily:"'Montserrat',sans-serif",fontSize:11,letterSpacing:4,textTransform:"uppercase",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                Ir para a loja <Icon name="arrow" size={14}/>
              </button>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:`${gold}0.5)`,textTransform:"uppercase",marginBottom:16 }}>Meus pedidos</p>
              {SAMPLE_ORDERS.map(o=>(
                <div key={o.id} style={{ background:`${gold}0.03)`,border:`1px solid ${gold}0.08)`,padding:"18px",marginBottom:8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                    <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:12,color:"#c9a96e" }}>{o.id}</span>
                    <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:`${dim}0.4)` }}>{o.date}</span>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                    <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:`${dim}0.55)` }}>{o.items} peça{o.items!==1?"s":""}</span>
                    <span style={{ fontFamily:"'Playfair Display',serif",fontSize:16,color:"#f5f0e8" }}>{fmt(o.total)}</span>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",padding:"3px 9px",background:o.status==="Entregue"?"rgba(92,138,74,0.15)":"rgba(201,169,110,0.15)",color:o.status==="Entregue"?"#5c8a4a":"#c9a96e" }}>{o.status}</span>
                    <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:1,color:"#c9a96e",cursor:"pointer",borderBottom:"1px solid rgba(201,169,110,0.3)" }}>Ver detalhes →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,color:`${gold}0.5)`,textTransform:"uppercase",marginBottom:16 }}>
                Favoritos ({wishlist.length})
              </p>
              {wishlist.length === 0 ? (
                <div style={{ textAlign:"center",padding:"48px 0",color:`${dim}0.25)` }}>
                  <Icon name="heart" size={32}/>
                  <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginTop:12 }}>Nenhum favorito ainda</p>
                  <button onClick={()=>{ setPage("shop"); onClose(); }} style={{ marginTop:16,background:"transparent",border:`1px solid ${gold}0.3)`,color:"#c9a96e",fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",padding:"10px 20px",cursor:"pointer" }}>
                    Explorar loja
                  </button>
                </div>
              ) : (
                PRODUCTS.filter(p=>wishlist.includes(p.id)).map(p=>(
                  <div key={p.id} style={{ display:"flex",gap:12,marginBottom:12,padding:"12px",background:`${gold}0.03)`,border:`1px solid ${gold}0.08)`,cursor:"pointer" }}
                    onClick={()=>{ setDetail(p); setPage("product"); onClose(); }}>
                    <div style={{ width:56,height:70,background:"#f5f3f0",flexShrink:0,overflow:"hidden" }}>
                      <ProductVisual type={p.images[0]} size="small"/>
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9b8570",marginBottom:3 }}>{p.category}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:13,color:"#f5f0e8",fontWeight:400,marginBottom:4,lineHeight:1.2 }}>{p.name}</div>
                      <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:12,color:"#c9a96e" }}>{fmt(p.price)}</div>
                    </div>
                    <Icon name="arrow" size={14}/>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 28px 28px",borderTop:`1px solid ${gold}0.1)`,flexShrink:0 }}>
          <button onClick={()=>{ onLogout(); onClose(); }} style={{ width:"100%",padding:"13px",background:"transparent",border:`1px solid ${gold}0.15)`,color:`${dim}0.4)`,fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(201,169,110,0.4)";e.currentTarget.style.color="rgba(245,240,232,0.7)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,169,110,0.15)";e.currentTarget.style.color="rgba(245,240,232,0.4)";}}>
            <Icon name="logout" size={14}/> Sair da conta
          </button>
        </div>
      </div>
    </>
  );
};

// ─── HIDDEN ADMIN TRIGGER ─────────────────────────────────────────────────────
// Clicking the copyright text 5 times quickly opens admin login
const FooterAdminTrigger = ({ setPage }) => {
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef();
  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    clearTimeout(timerRef.current);
    if (next >= 5) { setClicks(0); setPage("admin"); }
    else { timerRef.current = setTimeout(() => setClicks(0), 2000); }
  };
  return (
    <span style={S.footerCopy} onClick={handleClick} style={{ ...S.footerCopy, cursor:"default", userSelect:"none" }}>
      © 2026 Luz Moda Global. Todos os direitos reservados.
      {clicks > 1 && clicks < 5 && <span style={{ opacity:0, fontSize:1 }}>{clicks}</span>}
    </span>
  );
};

const HeroSection = ({ setPage }) => {
  const [slide, setSlide] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setSlide(s=>(s+1)%HERO_SLIDES.length),5000);return()=>clearInterval(t);},[]);
  const h = HERO_SLIDES[slide];
  return (
    <section style={S.hero}>
      <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(201,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.03) 1px,transparent 1px)",backgroundSize:"80px 80px" }}/>
      <div style={{ position:"absolute",left:32,top:"50%",transform:"translateY(-50%) rotate(-90deg)",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:5,color:"rgba(201,169,110,0.3)",textTransform:"uppercase",whiteSpace:"nowrap" }}>Coleção Inverno 2026</div>
      <div style={{ position:"absolute",right:32,top:"50%",transform:"translateY(-50%) rotate(90deg)",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:5,color:"rgba(201,169,110,0.3)",textTransform:"uppercase",whiteSpace:"nowrap" }}>Luz Moda Global</div>
      <div style={{ position:"absolute",bottom:80,right:40,display:"flex",gap:8 }}>
        {HERO_SLIDES.map((_,i)=>(
          <div key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?24:6,height:6,background:i===slide?G:"rgba(201,169,110,0.3)",cursor:"pointer",transition:"all 0.3s" }}/>
        ))}
      </div>
      <div style={S.heroContent}>
        <p style={S.heroTag}>{h.tag}</p>
        <h1 style={S.heroTitle}>{h.title}</h1>
        <h1 style={S.heroSubtitle}>{h.subtitle}</h1>
        <button style={S.heroCta} onClick={()=>setPage("shop")}>{h.cta} <Icon name="arrow" size={14}/></button>
      </div>
      <div style={S.heroScroll}><div>Scroll</div><div style={S.heroLine}/></div>
    </section>
  );
};

const HomePage = ({ setPage, setDetail, wishlist, toggleWish, setCart, showToast }) => (
  <div>
    <HeroSection setPage={setPage}/>
    <div style={S.features}>
      {[["truck","Frete Grátis","Acima de R$ 500"],["return","Troca Fácil","30 dias"],["secure","Pag. Seguro","SSL 256-bit"],["globe","Entrega Global","60 países"]].map(([icon,t,s])=>(
        <div key={t} style={S.featureItem}>
          <span style={{color:G}}><Icon name={icon} size={22}/></span>
          <div><div style={{ ...S.featureText,color:"#f5f0e8",fontWeight:500 }}>{t}</div><div style={S.featureText}>{s}</div></div>
        </div>
      ))}
    </div>
    <section style={{ ...S.section,background:"#0a0a0a" }}>
      <div style={S.container}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48 }}>
          <div><p style={S.eyebrow}>Recém-chegados</p><h2 style={S.sectionTitle}>Nova Coleção</h2></div>
          <button style={{ ...S.backBtn,margin:0 }} onClick={()=>setPage("shop")}>Ver tudo <Icon name="arrow" size={14}/></button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2 }}>
          {PRODUCTS.slice(0,4).map(p=>(
            <ProductCard key={p.id} product={p} onDetail={()=>{setDetail(p);setPage("product");}} wishlist={wishlist} toggleWish={toggleWish}/>
          ))}
        </div>
      </div>
    </section>
    <div style={S.banner}>
      <div style={{ ...S.bannerItem,background:"#1a1410" }}>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:60,opacity:0.15 }}><ProductVisual type="coat" size="full"/></div>
        <div style={S.bannerContent}><div style={S.bannerTag}>Alta Costura</div><div style={S.bannerTitle}>Casacos<br/>de Inverno</div><div style={S.bannerCta} onClick={()=>setPage("shop")}>Explorar Coleção</div></div>
      </div>
      <div style={{ ...S.bannerItem,background:"#0d0f14" }}>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:40,opacity:0.15 }}><ProductVisual type="bag" size="full"/></div>
        <div style={S.bannerContent}><div style={S.bannerTag}>Edição Limitada</div><div style={S.bannerTitle}>Bolsas<br/>Artesanais</div><div style={S.bannerCta} onClick={()=>setPage("shop")}>Ver Coleção</div></div>
      </div>
    </div>
    <section style={{ ...S.section,background:"#0a0a0a" }}>
      <div style={S.container}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48 }}>
          <div><p style={S.eyebrow}>Editorial</p><h2 style={S.sectionTitle}>Últimas do Blog</h2></div>
          <button style={{ ...S.backBtn,margin:0 }} onClick={()=>setPage("blog")}>Ver tudo <Icon name="arrow" size={14}/></button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2 }}>
          {BLOG_POSTS.slice(0,3).map(post=>(
            <div key={post.id} style={{ background:"#0f0e0c",border:"1px solid rgba(201,169,110,0.08)",cursor:"pointer" }} onClick={()=>setPage("blog")}>
              <div style={{ height:180,background:"#1a1410",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative" }}>
                <div style={{ opacity:0.3,transform:"scale(1.1)" }}><ProductVisual type={post.cover}/></div>
                <span style={{ position:"absolute",top:12,left:12,fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:3,textTransform:"uppercase",background:G,color:"#0a0a0a",padding:"3px 9px" }}>{post.category}</span>
              </div>
              <div style={{ padding:"20px 20px 24px" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:"#f5f0e8",fontWeight:400,marginBottom:8,lineHeight:1.3 }}>{post.title}</h3>
                <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:"rgba(245,240,232,0.35)",letterSpacing:1 }}>{post.author} · {post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section style={{ ...S.section,background:"#050504",textAlign:"center",padding:"120px 0" }}>
      <div style={{ maxWidth:720,margin:"0 auto",padding:"0 24px" }}>
        <p style={{ ...S.eyebrow,textAlign:"center" }}>Nossa filosofia</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,48px)",color:"#f5f0e8",fontWeight:400,lineHeight:1.4,marginBottom:32 }}>
          Onde a arte encontra a moda. Onde o luxo encontra a acessibilidade.
        </h2>
        <button style={S.heroCta} onClick={()=>setPage("shop")}>Conheça a marca <Icon name="arrow" size={14}/></button>
      </div>
    </section>
    <footer style={S.footer}>
      <div style={S.container}>
        <div style={S.footerGrid}>
          <div>
            <div style={S.footerBrand}>LUZ <span style={{color:G}}>MODA</span></div>
            <div style={S.footerTagline}>Moda global de luxo. Criada para quem valoriza a excelência em cada detalhe.</div>
          </div>
          {[{title:"Empresa",links:["Sobre nós","Sustentabilidade","Imprensa","Carreiras"]},{title:"Suporte",links:["Central de Ajuda","Devoluções","Rastrear Pedido","Contato"]},{title:"Compras",links:["Nova Coleção","Promoções","Gift Cards","Programa VIP"]}].map(col=>(
            <div key={col.title}>
              <div style={S.footerHeading}>{col.title}</div>
              {col.links.map(l=><span key={l} style={S.footerLink}>{l}</span>)}
            </div>
          ))}
        </div>
        <div style={S.footerBottom}>
          <FooterAdminTrigger setPage={setPage}/>
          <div style={{ display:"flex",gap:20 }}>{["PT","EN","ES","FR","DE"].map(l=><span key={l} style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:1,color:"rgba(245,240,232,0.25)",cursor:"pointer" }}>{l}</span>)}</div>
        </div>
      </div>
    </footer>
  </div>
);

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function LuzModa() {
  const [page, setPage] = useState("home");
  const [detail, setDetail] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [notifBanner, setNotifBanner] = useState(true);
  const [alertProduct, setAlertProduct] = useState(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [blogPost, setBlogPost] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [clientUser, setClientUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2800); };
  const toggleWish = (id) => setWishlist(w=>w.includes(id)?w.filter(i=>i!==id):[...w,id]);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  // Track view history
  const handleSetDetail = (product) => {
    setDetail(product);
    if(product) setViewHistory(h=>{const f=h.filter(id=>id!==product.id);return[product.id,...f].slice(0,8);});
  };

  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Montserrat:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  },[]);

  useEffect(()=>{
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  },[]);

  if(page==="admin") {
    if(!adminUser) return <AdminLoginPage onLogin={(u)=>setAdminUser(u)} onBack={()=>setPage("home")}/>;
    return (
      <div style={{ fontFamily:"'Montserrat',sans-serif" }}>
        <AdminPage setPage={(p)=>{ if(p==="adminLogout"){setAdminUser(null);setPage("home");}else setPage(p); }} adminUser={adminUser}/>
        {toast&&<Toast msg={toast}/>}
      </div>
    );
  }

  const shared = { wishlist, toggleWish, showToast };

  return (
    <div style={S.app}>
      {/* Notification banner */}
      {notifBanner && page==="home" && <NotificationBanner onClose={()=>setNotifBanner(false)}/>}

      {page!=="checkout" && (
        <Navbar page={page} setPage={setPage} cartCount={cartCount} setCartOpen={setCartOpen} notifDot={notifBanner} onSearchOpen={()=>setSearchOpen(true)} clientUser={clientUser} onUserClick={()=>clientUser ? setAccountOpen(true) : setAuthOpen(true)}/>
      )}

      {page==="home" && <HomePage setPage={setPage} setDetail={handleSetDetail} setCart={setCart} {...shared}/>}
      {page==="shop" && <ShopPage setPage={setPage} setDetail={p=>{handleSetDetail(p);setPage("product");}} {...shared}/>}
      {page==="product" && detail && (
        <>
          <ProductPage product={detail} setPage={setPage} setCart={setCart} setDetail={handleSetDetail} setAlertProduct={setAlertProduct} viewHistory={viewHistory} {...shared}/>
          <RecentlyViewed history={viewHistory} currentId={detail.id} setDetail={handleSetDetail} setPage={setPage}/>
        </>
      )}
      {page==="checkout" && <CheckoutPage cart={cart} setPage={setPage} setCart={setCart} showToast={showToast}/>}
      {page==="blog" && <BlogPage setPage={setPage} setDetail={handleSetDetail} setBlogPost={setBlogPost}/>}
      {page==="blogpost" && <BlogPostPage post={blogPost} setPage={setPage}/>}

      <CartDrawer open={cartOpen} setOpen={setCartOpen} cart={cart} setCart={setCart} setPage={setPage}/>
      {searchOpen && <SearchModal onClose={()=>setSearchOpen(false)} setDetail={handleSetDetail} setPage={setPage}/>}
      {authOpen && <AuthModal onClose={()=>setAuthOpen(false)} onLogin={(u)=>{ setClientUser(u); }} />}
      {accountOpen && clientUser && <AccountDrawer user={clientUser} onClose={()=>setAccountOpen(false)} onLogout={()=>setClientUser(null)} orders={[]} wishlist={wishlist} setDetail={handleSetDetail} setPage={setPage}/>}
      {alertProduct && <StockAlertModal product={alertProduct} onClose={()=>setAlertProduct(null)} showToast={showToast}/>}
      {toast && <Toast msg={toast}/>}
    </div>
  );
}
