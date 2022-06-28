import { signIn, signOut, useSession } from "next-auth/react";

import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./style.module.scss";

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button className={styles["sign-in-button"]} type="button">
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX onClick={() => signOut()} color="#737380" />
    </button>
  ) : (
    <button
      onClick={() => signIn("github")}
      className={styles["sign-in-button"]}
      type="button"
    >
      <FaGithub color="#eba417" /> Sign in with Github
    </button>
  );
}
