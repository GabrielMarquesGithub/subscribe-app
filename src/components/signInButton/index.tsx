import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./style.module.scss";

export function SignInButton() {
  const isUserLoggedIn = false;

  return isUserLoggedIn ? (
    <button className={styles["sign-in-button"]} type="button">
      <FaGithub color="#04d361" />
      User Github
      <FiX color="#737380" />
    </button>
  ) : (
    <button className={styles["sign-in-button"]} type="button">
      <FaGithub color="#eba417" /> Sign in with Github
    </button>
  );
}
