import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, onSnapshot, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

import { app } from "../firebase"

const useUser = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const auth = getAuth(app)
  const firestore = getFirestore(app)

  useEffect(() => {
    let snapshot = null

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        const getUserName = async () => {
          const docRef = doc(firestore, "users", user.uid)
          snapshot = onSnapshot(docRef, (doc) => {
            const data = doc.data()
            if (data) {
              setUser(data)
              setUsername(data.username)
            }
          })
        }

        getUserName()
      } else {
        setUser(null)
        setUsername(null)
      }
    })

    return () => {
      snapshot && snapshot()
    }
  }, [])
  return { user, username }
}

export default useUser
