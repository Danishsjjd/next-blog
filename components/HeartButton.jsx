import { useEffect, useState } from "react"
import { doc, increment, writeBatch, onSnapshot } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../lib/firebase"

const HeartButton = ({ postRef }) => {
  const uid = getAuth().currentUser.uid

  const [heartDoc, setHeartDoc] = useState(null)
  const heartRef = doc(postRef, `hearts/${uid}`)

  useEffect(() => {
    onSnapshot(heartRef, (data) => {
      setHeartDoc(data)
    })
  }, [])

  const addHeart = async () => {
    const batch = writeBatch(db)
    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })

    await batch.commit()
  }
  const removeHeart = async () => {
    const batch = writeBatch(db)
    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)

    await batch.commit()
  }

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 UnHeart</button>
  ) : (
    <button onClick={addHeart}>💖 Heart</button>
  )
}

export default HeartButton
