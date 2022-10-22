import {
  collection,
  orderBy,
  query as firebaseQuery,
  limit,
  where,
  getDocs,
} from "firebase/firestore";

import { getUserWithUsername, postToJson } from "../../lib/firebase";
import UserFeed from "../../components/UserFeed";
import UserProfile from "../../components/UserProfile";
import MetaTag from "../../components/MetaTag";

export const getServerSideProps = async ({ query }) => {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  if (!userDoc)
    return {
      notFound: true,
    };

  let user, posts;

  if (userDoc) {
    user = userDoc.data();

    const postQuery = collection(userDoc.ref, "posts");

    const q = firebaseQuery(
      postQuery,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(q)).docs.map(postToJson);
  }

  return {
    props: {
      user,
      posts,
    },
  };
};

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <MetaTag title={user.username} image={user.photoURL} />
      <UserProfile user={user} />
      <UserFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
