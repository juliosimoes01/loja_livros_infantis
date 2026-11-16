import { getApp, getApps, initializeApp } from 'firebase/app'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import type { Book } from '@/lib/products'
import { BOOKS } from '@/lib/products'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)

export async function getBooks(): Promise<Book[]> {
  const snapshot = await getDocs(collection(firestore, 'books'))
  if (snapshot.empty) return BOOKS

  return snapshot.docs.flatMap((document) => {
    const data = document.data()
    if (
      typeof data.title !== 'string' ||
      typeof data.author !== 'string' ||
      typeof data.category !== 'string' ||
      typeof data.price !== 'number' ||
      typeof data.color !== 'string'
    ) return []

    return [{
      id: document.id,
      title: data.title,
      author: data.author,
      category: data.category,
      price: data.price,
      oldPrice: typeof data.oldPrice === 'number' ? data.oldPrice : undefined,
      color: data.color,
      art: typeof data.art === 'string' ? data.art : '✦',
      rating: typeof data.rating === 'string' ? data.rating : '5,0',
      badge: typeof data.badge === 'string' ? data.badge : undefined,
    }]
  })
}
