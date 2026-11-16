import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { BOOKS } from '@/lib/products'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const MAX_ITEM_QUANTITY = 10

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const requestedIds = (searchParams.get('items') ?? '').split(',').filter(Boolean)
  if (!requestedIds.length || requestedIds.length > BOOKS.length * MAX_ITEM_QUANTITY) {
    return NextResponse.json({ error: 'Sacola inválida.' }, { status: 400 })
  }

  const quantities = new Map<string, number>()
  for (const id of requestedIds) {
    const quantity = (quantities.get(id) ?? 0) + 1
    if (quantity > MAX_ITEM_QUANTITY) {
      return NextResponse.json({ error: 'Limite de unidades excedido.' }, { status: 400 })
    }
    quantities.set(id, quantity)
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  for (const [id, quantity] of quantities) {
    const book = BOOKS.find((item) => item.id === id)
    if (!book) return NextResponse.json({ error: 'Livro não encontrado.' }, { status: 400 })
    lineItems.push({
      quantity,
      price_data: {
        currency: 'brl',
        unit_amount: Math.round(book.price * 100),
        product_data: { name: book.title, description: `${book.category} — ${book.author}` },
      },
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/?pedido=confirmado`,
      cancel_url: `${origin}/?checkout=cancelado`,
    })
    if (!session.url) throw new Error('O Stripe não retornou um endereço de checkout.')
    return NextResponse.redirect(session.url, 303)
  } catch {
    return NextResponse.json({ error: 'Não foi possível iniciar o pagamento. Verifique se Pix está habilitado na sua conta Stripe.' }, { status: 502 })
  }
}
