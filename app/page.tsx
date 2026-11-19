'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Heart,
  Menu,
  Moon,
  Music,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { getBooks } from '@/lib/firebase'
import { BOOKS, type Book } from '@/lib/products'

const categories = [
  'Todos',
  'Fábulas',
  'Contos de Fadas',
  'Lendas e Mitos',
  'Contos de aventura',
  'Poemas e Cantigas',
  'Crônicas',
]

const categoryItems = [
  {
    name: 'Fábulas',
    image: '/images/fabula_imagem.jpg',
    description: 'Ensinamentos mágicos e personagens encantadores',
    icon: BookOpen,
    badgeBg: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    badgeColor: '#78350F',
  },
  {
    name: 'Contos de Fadas',
    image: '/images/conto_de_fadas.jpg',
    description: 'Reinos encantados, magia e sonhos',
    icon: Sparkles,
    badgeBg: 'linear-gradient(135deg, #FBCFE8 0%, #EC4899 100%)',
    badgeColor: '#831843',
  },
  {
    name: 'Lendas e Mitos',
    image: '/images/lendas_e_mitos.jpg',
    description: 'Mistérios antigos e criaturas lendárias',
    icon: Moon,
    badgeBg: 'linear-gradient(135deg, #DDD6FE 0%, #8B5CF6 100%)',
    badgeColor: '#4C1D95',
  },
  {
    name: 'Contos de aventura',
    image: '/images/contos_de_aventura.jpg',
    description: 'Jornadas corajosas e descobertas sem fim',
    icon: Compass,
    badgeBg: 'linear-gradient(135deg, #A7F3D0 0%, #10B981 100%)',
    badgeColor: '#064E3B',
  },
  {
    name: 'Poemas e Cantigas',
    image: '/images/poemas_e_cantigas.png',
    description: 'Rimas musicais e versos cheios de ritmo',
    icon: Music,
    badgeBg: 'linear-gradient(135deg, #BAE6FD 0%, #0EA5E9 100%)',
    badgeColor: '#0C4A6E',
  },
  {
    name: 'Crônicas',
    image: '/images/cropped-Cronicas-infantis.jpg',
    description: 'Pequenos momentos do dia a dia cheios de poesia',
    icon: Heart,
    badgeBg: 'linear-gradient(135deg, #FECDD3 0%, #F43F5E 100%)',
    badgeColor: '#881337',
  },
]

const heroSlides = [
  {
    image: '/images/livros-hero.png',
    alt: 'Três livros infantis ilustrados em destaque',
    tag: 'Coleção Destaque',
    caption: 'Histórias ilustradas para ler em família',
  },
  {
    image: '/images/livros-aventura.png',
    alt: 'Livro ilustrado com uma aventura na floresta',
    tag: 'Aventuras na Floresta',
    caption: 'Descobertas mágicas em cada página',
  },
  {
    image: '/images/livros-contos.png',
    alt: 'Livro ilustrado com uma princesa e um dragão',
    tag: 'Contos & Fantasia',
    caption: 'Reinos encantados para pequenos sonhadores',
  },
]

const SLIDE_DURATION = 5000

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Page() {
  const [category, setCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Book[]>([])
  const [slide, setSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const touchStartX = useRef<number | null>(null)

  const { data: books = BOOKS } = useSWR('books', getBooks, { fallbackData: BOOKS })

  const nextSlide = useCallback(() => {
    setSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - event.changedTouches[0].clientX
    if (Math.abs(diff) > 45) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          (category === 'Todos' || book.category === category) &&
          `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())
      ),
    [books, category, query]
  )

  const addToCart = (book: Book) => {
    setCart((items) => [...items, book])
    setCartOpen(true)
  }

  const removeFromCart = (index: number) => {
    setCart((items) => items.filter((_, itemIndex) => index !== itemIndex))
  }

  const total = cart.reduce((sum, book) => sum + book.price, 0)
  const currentSlide = heroSlides[slide % heroSlides.length]

  return (
    <main className="storefront lume-page-bg">
      <style jsx>{`
        .lume-page-bg {
          background-color: #faf6f0;
          color: #1c1917;
        }

        .lume-hero-bg {
          background: radial-gradient(
              circle at 85% 20%,
              rgba(253, 230, 138, 0.45) 0%,
              transparent 48%
            ),
            radial-gradient(
              circle at 12% 80%,
              rgba(254, 205, 211, 0.35) 0%,
              transparent 45%
            ),
            linear-gradient(180deg, #fffdf9 0%, #faf6f0 100%);
        }

        .lume-categories-bg {
          background: linear-gradient(180deg, #f3ece1 0%, #ede4d5 100%);
          border-top: 1px solid rgba(180, 83, 9, 0.08);
          border-bottom: 1px solid rgba(180, 83, 9, 0.08);
        }

        .lume-catalog-bg {
          background: linear-gradient(180deg, #faf6f0 0%, #fdfaf5 100%);
        }

        .lume-banner-bg {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #fffdf9;
        }

        .lume-footer-bg {
          background-color: #f1e9dc;
          border-top: 1px solid rgba(28, 25, 23, 0.08);
        }

        /* Moldura aprimorada do carrossel principal */
        :global(.hero-image-frame) {
          border-radius: 28px !important;
          border: 6px solid #fffdf9 !important;
          outline: 1px solid rgba(180, 83, 9, 0.16);
          box-shadow: 0 26px 56px -14px rgba(28, 25, 23, 0.24),
            0 0 0 1px rgba(255, 255, 255, 0.6) inset !important;
        }

        @media (max-width: 640px) {
          :global(.hero-image-frame) {
            border-radius: 22px !important;
            border-width: 4px !important;
          }
        }

        /* Grid responsivo dos cards de categoria */
        .category-cards-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          margin-top: 28px;
        }

        @media (max-width: 1200px) {
          .category-cards-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .category-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }

        /* Cards de categoria com moldura editorial e cantos arredondados */
        .category-image-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 230px;
          border-radius: 24px;
          overflow: hidden;
          border: 3px solid rgba(255, 253, 249, 0.92);
          padding: 16px;
          text-align: left;
          cursor: pointer;
          background-color: #292524;
          box-shadow: 0 12px 28px -8px rgba(28, 25, 23, 0.22),
            0 0 0 1px rgba(28, 25, 23, 0.06);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.25s ease;
        }

        @media (max-width: 640px) {
          .category-image-card {
            height: 190px;
            padding: 12px;
            border-radius: 20px;
            border-width: 2px;
          }
        }

        .category-image-card:hover {
          transform: translateY(-6px);
          border-color: #fde68a;
          box-shadow: 0 20px 38px -10px rgba(28, 25, 23, 0.3);
        }

        .category-image-card.is-selected {
          border-color: #d97706;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.25),
            0 18px 34px -10px rgba(28, 25, 23, 0.28);
        }

        .category-image-card :global(.cat-bg-img) {
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .category-image-card:hover :global(.cat-bg-img) {
          transform: scale(1.08);
        }

        /* Capas dos livros com cantos arredondados e moldura acetinada */
        :global(.book-card) {
          border-radius: 24px;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        :global(.book-cover) {
          border-radius: 22px !important;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 14px 30px -10px rgba(28, 25, 23, 0.22),
            inset 0 1px 1px rgba(255, 255, 255, 0.55),
            inset 0 -10px 24px rgba(15, 23, 42, 0.14) !important;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        :global(.book-card:hover .book-cover) {
          transform: translateY(-4px);
          box-shadow: 0 22px 40px -12px rgba(28, 25, 23, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.65),
            inset 0 -10px 24px rgba(15, 23, 42, 0.16) !important;
        }

        :global(.cover-illustration) {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          border: 1.5px solid rgba(255, 255, 255, 0.42);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08),
            inset 0 2px 6px rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(4px);
        }

        /* Botões maiores de adicionar à sacola */
        :global(.book-buy) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        :global(.add-to-bag-btn) {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 20px !important;
          min-height: 44px;
          border-radius: 999px !important;
          font-size: 0.96rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.25s ease,
            background-color 0.25s ease;
        }

        :global(.add-to-bag-btn:hover) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -6px rgba(28, 25, 23, 0.24);
        }

        :global(.add-to-bag-btn:active) {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          :global(.add-to-bag-btn) {
            width: 100%;
            padding: 13px 18px !important;
          }
        }

        :global(.cart-thumb) {
          border-radius: 14px !important;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 6px 14px -4px rgba(28, 25, 23, 0.18);
        }

        /* Botão de alto contraste no banner escuro */
        :global(.lume-banner-cta) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 999px;
          background-color: #fffdf9 !important;
          color: #0f172a !important;
          font-weight: 700 !important;
          font-size: 0.96rem;
          text-decoration: none;
          border: 2px solid #fde68a;
          box-shadow: 0 10px 24px -6px rgba(0, 0, 0, 0.35);
          transition: transform 0.25s ease, background-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        :global(.lume-banner-cta:hover) {
          background-color: #fef3c7 !important;
          color: #090d16 !important;
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.45);
        }

        @keyframes slideProgress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .carousel-progress-bar {
          transform-origin: left center;
          animation: slideProgress ${SLIDE_DURATION}ms linear forwards;
        }
      `}</style>

      <div className="announcement">
        <Sparkles size={13} /> Frete grátis na primeira aventura acima de R$ 99 <span>—</span> use{' '}
        <b>PRIMEIRAHISTORIA</b>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Lume Livraria, início">
          <span className="brand-mark">
            <BookOpen size={20} strokeWidth={1.8} />
          </span>
          <span>
            lume<span className="brand-dot">.</span>
            <small>livraria infantil</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#livros">Livros</a>
          <a href="#categorias">Categorias</a>
          <a href="#sobre">Nossa história</a>
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <Search size={17} />
            <input
              aria-label="Buscar livros"
              placeholder="Buscar uma história..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir sacola, ${cart.length} itens`}
          >
            <ShoppingBag size={19} />
            <span>Sacola</span>
            {cart.length > 0 && <b>{cart.length}</b>}
          </button>
          <button type="button" className="mobile-menu" aria-label="Abrir menu">
            <Menu />
          </button>
        </div>
      </header>

      {/* Seção Hero */}
      <section className="hero lume-hero-bg" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" /> UM MUNDO DE CADA VEZ
          </span>
          <h1>
            Histórias que
            <br />
            acendem <em>mundos.</em>
          </h1>
          <p>
            Livros feitos para pequenas mãos e grandes imaginações. Cada página, uma porta para
            descobrir.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#categorias">
              Explorar categorias <ArrowDown size={17} />
            </a>
          </div>

          <div className="hero-proof">
            <div className="avatar-stack">
              <span>✿</span>
              <span>☀</span>
              <span>✦</span>
            </div>
            <div>
              <div className="stars">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <span>Mais de 2 mil famílias encantadas</span>
            </div>
          </div>
        </div>

        {/* Carrossel fluido */}
        <div
          className="hero-art"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="art-halo" />

          <div className="hero-image-frame" style={{ overflow: 'hidden' }}>
            {heroSlides.map((item, idx) => {
              const active = idx === slide % heroSlides.length
              return (
                <div
                  key={item.image}
                  aria-hidden={!active}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: active ? 1 : 0,
                    transform: active ? 'scale(1)' : 'scale(1.08)',
                    transition:
                      'opacity 850ms cubic-bezier(0.22, 1, 0.36, 1), transform 4800ms cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: active ? 'auto' : 'none',
                    willChange: 'opacity, transform',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, 55vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )
            })}

            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'rgba(255, 255, 255, 0.28)',
                zIndex: 3,
              }}
            >
              <div
                key={`${slide}-${isPaused}`}
                className="carousel-progress-bar"
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#F59E0B',
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                bottom: 14,
                zIndex: 2,
                padding: '12px 16px',
                borderRadius: 18,
                background: 'rgba(255, 253, 249, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#B45309',
                  }}
                >
                  {currentSlide.tag}
                </span>
                <strong style={{ fontSize: '0.92rem', color: '#1C1917' }}>
                  {currentSlide.caption}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {heroSlides.map((item, idx) => {
                  const active = idx === slide % heroSlides.length
                  return (
                    <button
                      key={item.image}
                      type="button"
                      onClick={() => setSlide(idx)}
                      aria-label={`Ir para slide ${idx + 1}: ${item.tag}`}
                      style={{
                        width: active ? 24 : 8,
                        height: 8,
                        borderRadius: 999,
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        background: active ? '#D97706' : 'rgba(28, 25, 23, 0.25)',
                        transition: 'all 350ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <div className="floating-note note-top">
            <span>✦</span> histórias para guardar
          </div>
          <div className="floating-note note-bottom">
            <span className="tiny-star">✳</span>
            <div>
              <b>Feito com carinho</b>
              <small>do papel à imaginação</small>
            </div>
          </div>

          <div className="hero-controls">
            <span>
              0{slide + 1} <i /> 0{heroSlides.length}
            </span>
            <button type="button" onClick={prevSlide} aria-label="Livro anterior">
              <ArrowLeft />
            </button>
            <button type="button" onClick={nextSlide} aria-label="Próximo livro">
              <ArrowRight />
            </button>
          </div>
          <span className="hero-side-note">
            LEITURAS QUE FICAM <span>—</span> 2026
          </span>
        </div>
      </section>

      {/* Categorias de tipos de livros com imagens ilustradas */}
      <section className="category-strip lume-categories-bg" id="categorias">
        <div className="category-intro">
          <span className="eyebrow">ESCOLHA SEU CAMINHO</span>
          <h2>Que história te chama?</h2>
        </div>

        <div className="category-cards-grid">
          {categoryItems.map((item) => {
            const Icon = item.icon
            const isSelected = category === item.name

            return (
              <button
                key={item.name}
                type="button"
                className={`category-image-card ${isSelected ? 'is-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => {
                  setCategory(item.name)
                  document.getElementById('livros')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 17vw"
                  className="cat-bg-img"
                  style={{ objectFit: 'cover', zIndex: 0 }}
                />

                {/* Moldura interna sutil sobre a foto */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 6,
                    borderRadius: 18,
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />

                {/* Gradiente escuro na base para leitura nítida */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background:
                      'linear-gradient(180deg, rgba(15, 23, 42, 0.06) 0%, rgba(15, 23, 42, 0.36) 45%, rgba(15, 23, 42, 0.92) 100%)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    right: 14,
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      background: item.badgeBg,
                      color: item.badgeColor,
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <Icon size={17} strokeWidth={2.2} />
                  </span>

                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: 'rgba(255, 255, 255, 0.22)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </div>

                <div style={{ position: 'relative', zIndex: 3, color: '#FFFDF9' }}>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      marginBottom: 4,
                      textShadow: '0 2px 6px rgba(0,0,0,0.45)',
                    }}
                  >
                    {item.name}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      lineHeight: 1.3,
                      color: 'rgba(255, 253, 249, 0.88)',
                    }}
                  >
                    {item.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Catálogo de Livros */}
      <section className="catalog lume-catalog-bg" id="livros">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-line" /> A ESTANTE DA LUME
            </span>
            <h2>
              Um livro, mil <em>possibilidades.</em>
            </h2>
          </div>
        </div>

        <div className="catalog-tabs" role="tablist" aria-label="Filtrar livros por categoria">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'active' : ''}
              style={{
                fontSize: '1rem',
                fontWeight: category === item ? 700 : 500,
                padding: '10px 18px',
              }}
              onClick={() => setCategory(item)}
              role="tab"
              aria-selected={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="book-grid">
          {filteredBooks.map((book) => (
            <article className="book-card" key={book.id}>
              <div className={`book-cover cover-${book.color}`}>
                <div className="cover-shine" />
                <span className="cover-label">
                  LUME <i>•</i> HISTÓRIAS
                </span>
                <div className="cover-illustration" aria-hidden="true">
                  {book.art}
                </div>
                <div className="cover-title">{book.title}</div>
                <div className="cover-author">{book.author}</div>
                <span className="cover-spine" />
                {book.badge && <span className="book-badge">{book.badge}</span>}
                <button
                  type="button"
                  className="favorite-button"
                  aria-label={`Adicionar ${book.title} aos favoritos`}
                >
                  <Heart size={17} />
                </button>
              </div>
              <div className="book-info">
                <div className="book-meta">
                  <span>{book.category}</span>
                  <span className="rating">
                    <Star size={12} fill="currentColor" /> {book.rating}
                  </span>
                </div>
                <h3>{book.title}</h3>
                <p>por {book.author}</p>
                <div className="book-buy">
                  <div>
                    <b>{money(book.price)}</b>
                    {book.oldPrice && <del>{money(book.oldPrice)}</del>}
                  </div>
                  <button
                    type="button"
                    className="add-to-bag-btn"
                    onClick={() => addToCart(book)}
                    aria-label={`Adicionar ${book.title} à sacola`}
                  >
                    <span>Adicionar</span>
                    <ShoppingBag size={18} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <p className="empty-state">Nenhuma história encontrada. Tente outra busca.</p>
        )}

        <div className="catalog-footer">
          <span>Mostrando {filteredBooks.length} histórias para imaginar</span>
        </div>
      </section>

      {/* Banner institucional com botão de alto contraste */}
      <section className="reading-banner lume-banner-bg" id="sobre">
        <div className="banner-sparkle">✳</div>
        <div>
          <span className="eyebrow" style={{ color: '#FDE68A' }}>
            PEQUENOS LEITORES, GRANDES MUNDOS
          </span>
          <h2 style={{ color: '#FFFDF9' }}>
            Um ritual de carinho,
            <br />
            uma história por noite.
          </h2>
          <p style={{ color: 'rgba(255, 253, 249, 0.85)' }}>
            Livros escolhidos por quem acredita que ler junto muda tudo.
          </p>
        </div>
        <a href="#livros" className="banner-link lume-banner-cta">
          Descobrir a Lume <ArrowUpRight size={17} />
        </a>
        <div className="banner-orbit" aria-hidden="true">
          ✦
        </div>
      </section>

      <footer className="site-footer lume-footer-bg">
        <a className="brand" href="#inicio">
          <span className="brand-mark">
            <BookOpen size={18} />
          </span>
          <span>
            lume<span className="brand-dot">.</span>
            <small>livraria infantil</small>
          </span>
        </a>
        <span>Histórias feitas para crescer com você.</span>
        <div className="footer-promise">
          <Check size={14} /> Compra segura <i /> Pix e cartão <i /> Envio para todo o Brasil
        </div>
      </footer>

      {/* Gaveta lateral da Sacola */}
      {cartOpen && (
        <div
          className="drawer-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false)
          }}
        >
          <aside className="cart-drawer" aria-label="Sua sacola">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">SUA PRÓXIMA AVENTURA</span>
                <h2>
                  Sacola <span>({cart.length})</span>
                </h2>
              </div>
              <button
                type="button"
                aria-label="Fechar sacola"
                onClick={() => setCartOpen(false)}
              >
                <X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <BookOpen size={30} />
                <h3>Sua sacola está esperando</h3>
                <p>Escolha um livro e comece uma nova aventura.</p>
                <button type="button" onClick={() => setCartOpen(false)}>
                  Explorar livros <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((book, index) => (
                    <div className="cart-item" key={`${book.title}-${index}`}>
                      <div className={`cart-thumb cover-${book.color}`}>
                        <span>{book.art}</span>
                      </div>
                      <div className="cart-item-info">
                        <b>{book.title}</b>
                        <small>{book.category}</small>
                        <strong>{money(book.price)}</strong>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remover ${book.title}`}
                        onClick={() => removeFromCart(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <b>{money(total)}</b>
                  </div>
                  <div>
                    <span>Frete</span>
                    <b>{total >= 99 ? 'Grátis' : 'Calculado no checkout'}</b>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <b>{money(total)}</b>
                  </div>
                  <button
                    type="button"
                    className="checkout-button"
                    onClick={() => {
                      window.location.href = `/api/checkout?items=${encodeURIComponent(
                        cart.map((book) => book.id).join(',')
                      )}`
                    }}
                  >
                    Continuar para pagamento <ArrowRight size={17} />
                  </button>
                  <p>Pagamento seguro via Pix ou cartão</p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}