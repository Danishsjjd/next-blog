import { initializeApp, getApp, getApps } from "firebase/app"
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)

/**
 * @param {string} username
 */

export async function getUserWithUsername(username) {
  const usersCollection = collection(db, "users")
  const q = query(usersCollection, where("username", "==", username, limit(1)))

  const userDoc = await getDocs(q)
  const user = userDoc.docs[0]

  return user
}

export function postToJson(doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}
