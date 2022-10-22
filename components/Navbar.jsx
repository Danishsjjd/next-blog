import Link from "next/link";
import { useContext } from "react";

import { UserContext } from "../lib/context";
const Navbar = () => {
  const { user, username } = useContext(UserContext);
  return (
    <nav className="navbar">
      <ul>
        <li className="">
          <Link href={{ pathname: "/" }}>
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {username ? (
          <>
            <li className="push-left">
              <Link href={"/admin"}>
                <button className="btn-blue">Create Post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} alt="" />
              </Link>
            </li>
          </>
        ) : (
          <li className="push-left">
            <Link href={"/enter"}>
              <button className="btn-blue">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
