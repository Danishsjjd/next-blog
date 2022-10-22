import {
  getDoc,
  doc,
  collectionGroup,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";

import PostContent from "../../components/PostContent";
import { db, getUserWithUsername, postToJson } from "../../lib/firebase";
import MetaTag from "../../components/MetaTag";

const Post = ({ path, post }) => {
  const postRef = doc(db, path);
  const [realtimePost, setRealtimePost] = useState(null);

  const finalPost = realtimePost || post;

  onSnapshot(postRef, (data) => {
    setRealtimePost(data.data());
  });

  return (
    <main>
      <MetaTag title={post.title} />
      <section>
        <PostContent post={finalPost} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 💖</strong>
        </p>
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
