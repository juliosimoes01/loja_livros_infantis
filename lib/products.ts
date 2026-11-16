export type Book = {
  id: string
  title: string
  author: string
  category: string
  price: number
  oldPrice?: number
  color: string
  art: string
  rating: string
  badge?: string
}

export const BOOKS: Book[] = [
  { id: 'raposa-estrelas', title: 'A raposa e as estrelas', author: 'Marina Valente', category: 'Fábulas', price: 39.9, oldPrice: 54.9, color: 'coral', art: '☼', rating: '4,9', badge: 'Mais amado' },
  { id: 'reino-lado-la', title: 'O reino do lado de lá', author: 'Lia Monteiro', category: 'Contos de Fadas', price: 44.9, color: 'lilac', art: '✦', rating: '5,0' },
  { id: 'lenda-lua-azul', title: 'A lenda da lua azul', author: 'Caio Nascimento', category: 'Lendas e Mitos', price: 36.9, color: 'blue', art: '☾', rating: '4,8', badge: 'Novo' },
  { id: 'viagem-nina', title: 'A grande viagem de Nina', author: 'Bia Carvalho', category: 'Contos de aventura', price: 42.9, oldPrice: 49.9, color: 'yellow', art: '↗', rating: '4,9' },
  { id: 'cantigas-sonhar', title: 'Cantigas para sonhar', author: 'Rita das Flores', category: 'Poemas e Cantigas', price: 32.9, color: 'mint', art: '♪', rating: '4,7' },
  { id: 'pequenas-coisas-enormes', title: 'Pequenas coisas enormes', author: 'Davi Luz', category: 'Crônicas', price: 34.9, color: 'peach', art: '❋', rating: '4,8' },
]
