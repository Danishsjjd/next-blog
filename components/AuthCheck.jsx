import Link from "next/link"
import { useContext } from "react"

import { UserContext } from "../lib/context"

const AuthCheck = ({ children, fallback }) => {
  const { username } = useContext(UserContext)
  return username
    ? children
    : fallback || <Link href={"/enter"}>You must be signed in</Link>
}

export default AuthCheck
