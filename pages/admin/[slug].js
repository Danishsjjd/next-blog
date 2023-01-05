import { getAuth } from "firebase/auth"
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import ReactMarkdown from "react-markdown"

import AuthCheck from "../../components/AuthCheck"
import ImageUploader from "../../components/ImageUploader"
import MetaTag from "../../components/MetaTag"
import { db } from "../../lib/firebase"
import styles from "../../styles/Admin.module.css"

const index = () => {
  return (
    <AuthCheck>
      <MetaTag title={"Admin"} />
      <PostManager />
    </AuthCheck>
  )
}

function PostManager({}) {
  const [preview, setPreview] = useState(false)
  const [post, setPost] = useState({})

  const router = useRouter()
  const { slug } = router.query

  const postRef = doc(db, `users/${getAuth().currentUser.uid}/posts/${slug}`)

  useEffect(() => {
    const getPost = async () => {
      const postDoc = await getDoc(postRef)
      setPost(postDoc.data())
    }
    getPost()
  }, [])

  const deletePost = async () => {
    if (!window.confirm("Are You Sure?")) return
    await deleteDoc(postRef)
    toast("Post is Deleted")
    router.push(`/admin`)
  }

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post?.title}</h1>
            <p>{post?.slug}</p>
            {post?.content && (
              <PostForm
                postRef={postRef}
                defaultValues={post}
                preview={preview}
              />
            )}
          </section>
          <aside>
            <h3>Tools</h3>

            <button onClick={() => setPreview((pre) => !pre)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live View</button>
            </Link>
            <button onClick={deletePost} className="btn-red">
              Delete
            </button>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ postRef, defaultValues, preview }) {
  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  })

  const updateForm = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    })

    reset({ content, published })

    toast.success("Post is updated!!")
  }

  return (
    <form onSubmit={handleSubmit(updateForm)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register("content", {
            minLength: { value: 10, message: "content is too short" },
          })}
        ></textarea>
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

export default index
