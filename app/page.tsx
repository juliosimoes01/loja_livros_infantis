'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Compass, Heart, Menu, Moon, Music, Search, ShoppingBag, Sparkles, Star, X } from 'lucide-react'
import { getBooks } from '@/lib/firebase'
import { BOOKS, type Book } from '@/lib/products'

const categories = ['Todos', 'Fábulas', 'Contos de Fadas', 'Lendas e Mitos', 'Contos de aventura', 'Poemas e Cantigas', 'Crônicas']
const categoryIcons = [BookOpen, Sparkles, Moon, Compass, Music, Heart]
const heroSlides = [
  { image: '/images/livros-hero.png', alt: 'Três livros infantis ilustrados em destaque' },
  { image: '/images/livros-aventura.png', alt: 'Livro ilustrado com uma aventura na floresta' },
  { image: '/images/livros-contos.png', alt: 'Livro ilustrado com uma princesa e um dragão' },
]
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Page() {
  const [category, setCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Book[]>([])
  const [slide, setSlide] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const { data: books = BOOKS } = useSWR('books', getBooks, { fallbackData: BOOKS })
  const filteredBooks = useMemo(() => books.filter((book) => (category === 'Todos' || book.category === category) && `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, category, query])
  const addToCart = (book: Book) => { setCart((items) => [...items, book]); setCartOpen(true) }
  const removeFromCart = (index: number) => setCart((items) => items.filter((_, itemIndex) => index !== itemIndex))
  const total = cart.reduce((sum, book) => sum + book.price, 0)

  return (
    <main className="storefront">
      <div className="announcement"><Sparkles size={13} /> Frete grátis na primeira aventura acima de R$ 99 <span>—</span> use <b>PRIMEIRAHISTORIA</b></div>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Lume Livraria, início"><span className="brand-mark"><BookOpen size={20} strokeWidth={1.8} /></span><span>lume<span className="brand-dot">.</span><small>livraria infantil</small></span></a>
        <nav className="main-nav" aria-label="Navegação principal"><a href="#livros">Livros</a><a href="#categorias">Categorias</a><a href="#sobre">Nossa história</a></nav>
        <div className="header-actions"><label className="search-box"><Search size={17} /><input aria-label="Buscar livros" placeholder="Buscar uma história..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Abrir sacola, ${cart.length} itens`}><ShoppingBag size={19} /><span>Sacola</span>{cart.length > 0 && <b>{cart.length}</b>}</button><button className="mobile-menu" aria-label="Abrir menu"><Menu /></button></div>
      </header>
      <section className="hero" id="inicio">
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line" /> UM MUNDO DE CADA VEZ</span><h1>Histórias que<br />acendem <em>mundos.</em></h1><p>Livros feitos para pequenas mãos e grandes imaginações. Cada página, uma porta para descobrir.</p><div className="hero-actions"><a className="primary-button" href="#livros">Encontrar minha história <ArrowRight size={17} /></a><a className="text-link" href="#categorias">Explorar categorias <ArrowDown size={15} /></a></div><div className="hero-proof"><div className="avatar-stack"><span>✿</span><span>☀</span><span>✦</span></div><div><div className="stars"><Star /><Star /><Star /><Star /><Star /></div><span>Mais de 2 mil famílias encantadas</span></div></div></div>
        <div className="hero-art"><div className="art-halo" /><div className="hero-image-frame"><Image src={heroSlides[slide % heroSlides.length].image} alt={heroSlides[slide % heroSlides.length].alt} fill priority sizes="(max-width: 768px) 100vw, 55vw" /></div><div className="floating-note note-top"><span>✦</span> histórias para guardar</div><div className="floating-note note-bottom"><span className="tiny-star">✳</span><div><b>Feito com carinho</b><small>do papel à imaginação</small></div></div><div className="hero-controls"><span>0{slide + 1} <i /> 0{heroSlides.length}</span><button onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)} aria-label="Livro anterior"><ArrowLeft /></button><button onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Próximo livro"><ArrowRight /></button></div><span className="hero-side-note">LEITURAS QUE FICAM <span>—</span> 2026</span></div>
      </section>
      <section className="category-strip" id="categorias"><div className="category-intro"><span className="eyebrow">ESCOLHA SEU CAMINHO</span><h2>Que história te chama?</h2></div><div className="category-pills">{categories.slice(1).map((item, index) => { const Icon = categoryIcons[index]; return <button key={item} className={`category-pill category-${index}`} onClick={() => { setCategory(item); document.getElementById('livros')?.scrollIntoView({ behavior: 'smooth' }) }}><span aria-hidden="true"><Icon size={14} /></span>{item}<ArrowUpRight size={14} /></button> })}</div></section>
      <section className="catalog" id="livros"><div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> A ESTANTE DA LUME</span><h2>Um livro, mil <em>possibilidades.</em></h2></div><button className="sort-button">Mais queridos <ChevronDown size={16} /></button></div><div className="catalog-tabs" role="tablist" aria-label="Filtrar livros por categoria">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item}</button>)}</div><div className="book-grid">{filteredBooks.map((book) => <article className="book-card" key={book.id}><div className={`book-cover cover-${book.color}`}><div className="cover-shine" /><span className="cover-label">LUME <i>•</i> HISTÓRIAS</span><div className="cover-illustration" aria-hidden="true">{book.art}</div><div className="cover-title">{book.title}</div><div className="cover-author">{book.author}</div><span className="cover-spine" />{book.badge && <span className="book-badge">{book.badge}</span>}<button className="favorite-button" aria-label={`Adicionar ${book.title} aos favoritos`}><Heart size={17} /></button></div><div className="book-info"><div className="book-meta"><span>{book.category}</span><span className="rating"><Star size={12} fill="currentColor" /> {book.rating}</span></div><h3>{book.title}</h3><p>por {book.author}</p><div className="book-buy"><div><b>{money(book.price)}</b>{book.oldPrice && <del>{money(book.oldPrice)}</del>}</div><button onClick={() => addToCart(book)} aria-label={`Adicionar ${book.title} à sacola`}><span>Adicionar</span><ShoppingBag size={16} /></button></div></div></article>)}</div>{filteredBooks.length === 0 && <p className="empty-state">Nenhuma história encontrada. Tente outra busca.</p>}<div className="catalog-footer"><span>Mostrando {filteredBooks.length} histórias para imaginar</span><button onClick={() => { setCategory('Todos'); setQuery('') }}>Ver todos os livros <ArrowRight size={16} /></button></div></section>
      <section className="reading-banner" id="sobre"><div className="banner-sparkle">✳</div><div><span className="eyebrow">PEQUENOS LEITORES, GRANDES MUNDOS</span><h2>Um ritual de carinho,<br />uma história por noite.</h2><p>Livros escolhidos por quem acredita que ler junto muda tudo.</p></div><a href="#livros" className="banner-link">Descobrir a Lume <ArrowUpRight size={17} /></a><div className="banner-orbit" aria-hidden="true">✦</div></section>
      <footer className="site-footer"><a className="brand" href="#inicio"><span className="brand-mark"><BookOpen size={18} /></span><span>lume<span className="brand-dot">.</span><small>livraria infantil</small></span></a><span>Histórias feitas para crescer com você.</span><div className="footer-promise"><Check size={14} /> Compra segura <i /> Pix e cartão <i /> Envio para todo o Brasil</div></footer>
      {cartOpen && <div className="drawer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label="Sua sacola"><div className="drawer-head"><div><span className="eyebrow">SUA PRÓXIMA AVENTURA</span><h2>Sacola <span>({cart.length})</span></h2></div><button aria-label="Fechar sacola" onClick={() => setCartOpen(false)}><X /></button></div>{cart.length === 0 ? <div className="cart-empty"><BookOpen size={30} /><h3>Sua sacola está esperando</h3><p>Escolha um livro e comece uma nova aventura.</p><button onClick={() => setCartOpen(false)}>Explorar livros <ArrowRight size={16} /></button></div> : <><div className="cart-items">{cart.map((book, index) => <div className="cart-item" key={`${book.title}-${index}`}><div className={`cart-thumb cover-${book.color}`}><span>{book.art}</span></div><div className="cart-item-info"><b>{book.title}</b><small>{book.category}</small><strong>{money(book.price)}</strong></div><button aria-label={`Remover ${book.title}`} onClick={() => removeFromCart(index)}><X size={16} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{money(total)}</b></div><div><span>Frete</span><b>{total >= 99 ? 'Grátis' : 'Calculado no checkout'}</b></div><div className="cart-total"><span>Total</span><b>{money(total)}</b></div><button className="checkout-button" onClick={() => { window.location.href = `/api/checkout?items=${encodeURIComponent(cart.map((book) => book.id).join(','))}` }}>Continuar para pagamento <ArrowRight size={17} /></button><p>Pagamento seguro via Pix ou cartão</p></div></>}</aside></div>}
    </main>
  )
}

