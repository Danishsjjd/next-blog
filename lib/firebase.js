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
  apiKey: "AIzaSyApDQ6crRP02Ff3Pyx2kxOYCXP9BJ3lKHA",
  authDomain: "next-blog-e5541.firebaseapp.com",
  projectId: "next-blog-e5541",
  storageBucket: "next-blog-e5541.appspot.com",
  messagingSenderId: "1019672354071",
  appId: "1:1019672354071:web:e3728cc25187f959422b52",
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
