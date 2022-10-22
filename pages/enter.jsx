import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import debounce from "just-debounce-it";
import { useCallback, useContext, useEffect, useState } from "react";

import MetaTag from "../components/MetaTag";
import { UserContext } from "../lib/context";
import app from "../lib/firebase";

const EnterPage = () => {
  const auth = getAuth(app);

  const { user, username } = useContext(UserContext);

  return (
    <main>
      <MetaTag />
      {user ? (
        !username ? (
          <UsernameForm user={user} />
        ) : (
          <SignOutButton auth={auth} />
        )
      ) : (
        <SignInButton auth={auth} />
      )}
    </main>
  );
};

export default EnterPage;

function UsernameForm({ user }) {
  const [formValue, setFormValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const db = getFirestore(app);

  const changeHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setFormValue(value);
    if (value.length < 4) {
      setIsValid(false);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(db, "users", user.uid);
    const usernameDoc = doc(db, "username", formValue);

    const batch = writeBatch(db);

    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
      uid: user.uid,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length > 3) {
        const docRef = doc(db, "username", username);
        const docSnap = await getDoc(docRef);

        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);
  return (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={formValue}
          onChange={changeHandler}
        />
        <UsernameMessage
          username={formValue}
          loading={loading}
          isValid={isValid}
        />
        <button type="submit" disabled={!isValid} className="btn-green">
          Choose
        </button>
      </form>

      <h3>Debug State</h3>
      <div>
        Username: {formValue.toString()}
        <br />
        Loading: {loading.toString()}
        <br />
        is valid: {isValid.toString()}
      </div>
    </section>
  );
}

function SignOutButton({ auth }) {
  const signOutFunc = async () => await signOut(auth);
  return <button onClick={signOutFunc}>Sign out</button>;
}

function SignInButton({ auth }) {
  const googleProvide = new GoogleAuthProvider();

  const signWithGoogle = async () => {
    await signInWithPopup(auth, googleProvide);
  };
  return (
    <button className="btn-google" onClick={signWithGoogle}>
      sign with google
    </button>
  );
}

function UsernameMessage({ loading, isValid, username }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">{username} is not available!</p>;
  } else {
    <p></p>;
  }
}
