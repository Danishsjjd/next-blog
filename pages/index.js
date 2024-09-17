import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore"
import { useState } from "react"

import Loader from "../components/Loader"
import MetaTag from "../components/MetaTag"
import { default as PostFeed } from "../components/UserFeed"
import { db, postToJson } from "../lib/firebase"

const LIMIT = 1

export const getServerSideProps = async () => {
  const posts = collectionGroup(db, "posts")
  const postsQuery = query(
    posts,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  )

  const postDocs = (await getDocs(postsQuery)).docs.map(postToJson)

  return {
    props: { posts: postDocs },
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)

    const last = posts[posts.length - 1]

    const cursor =
      typeof last?.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last?.createdAt

    const postsGroup = collectionGroup(db, "posts")
    const postsQuery = query(
      postsGroup,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT),
      startAfter(cursor ?? "")
    )

    const newPosts = (await getDocs(postsQuery)).docs.map(postToJson)

    setPosts(posts.concat(newPosts))
    setLoading(false)
    if (newPosts.length < LIMIT) setPostsEnd(true)
  }
  return (
    <main>
      <MetaTag />
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  )
}
