import { useContext, useEffect, useState } from "react"
import {
  onSnapshot,
  collection,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"
import kebab from "lodash.kebabcase"
import { useRouter } from "next/router"

import AuthCheck from "../../components/AuthCheck"
import { UserContext } from "../../lib/context"
import { db } from "../../lib/firebase"
import UserFeed from "../../components/UserFeed"
import { toast } from "react-hot-toast"
import MetaTag from "../../components/MetaTag"

const index = () => {
  const { user } = useContext(UserContext)
  return (
    <main>
      <MetaTag />
      <AuthCheck>
        <PostList user={user} />
        <CreateNewPost user={user} />
      </AuthCheck>
    </main>
  )
}

export default index

function PostList({ user }) {
  const [posts, setPosts] = useState([])
  const ref = collection(db, "users", user.uid, "posts")

  useEffect(() => {
    onSnapshot(ref, (data) => {
      setPosts(data.docs.map((doc) => doc.data()))
    })
  }, [])

  return (
    <>
      <h1>Manage your Posts</h1>
      <UserFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost({ user }) {
  const [title, setTitle] = useState("")
  const [isValid, setIsValid] = useState(false)

  const router = useRouter()

  const slug = encodeURI(kebab(title))

  const handleChange = (e) => {
    const { value } = e.target
    setTitle(value)
    if (value.length < 3 || value.length > 100) return setIsValid(false)
    setIsValid(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    const docRef = doc(db, "users", user.uid, "posts", slug)
    const ifExist = await getDoc(docRef)
    if (ifExist) return toast.error("Blog already exists")
    await setDoc(docRef, {
      title,
      slug,
      uid: user.uid,
      username: user.username,
      published: false,
      content: "# Hello World",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    })

    toast.success("Post Created!")

    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type={"text"}
        onChange={handleChange}
        placeholder="Title"
        value={title}
      />
      <button type="submit" className="btn-success" disabled={!isValid}>
        Choose
      </button>
      <br />
      <p>Slug:- {slug}</p>
    </form>
  )
}
