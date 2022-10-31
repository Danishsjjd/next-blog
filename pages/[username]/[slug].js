import {
  getDoc,
  doc,
  collectionGroup,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Link from "next/link";

import style from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { db, getUserWithUsername, postToJson } from "../../lib/firebase";
import MetaTag from "../../components/MetaTag";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";

const Post = ({ path, post }) => {
  const postRef = doc(db, path);
  const [realtimePost, setRealtimePost] = useState(null);

  const finalPost = realtimePost || post;
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    onSnapshot(postRef, (data) => {
      setRealtimePost(data.data());
      console.log("inside snapshot", data.data());
    });
  }, []);

  return (
    <main className={style.container}>
      <MetaTag title={post.title} />
      <section>
        <PostContent post={finalPost} />
      </section>

      <aside className="card">
        <p>
          <strong>{finalPost.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
};

export const getStaticProps = async ({ params }) => {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let post, path;

  if (userDoc) {
    const postRef = doc(db, "users", userDoc.id, "posts", slug);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) return { notFound: true };

    post = postToJson(postDoc);
    path = postRef.path;
  }

  return {
    props: { path, post },
    revalidate: 5000,
  };
};

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collectionGroup(db, "posts"));

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export default Post;
