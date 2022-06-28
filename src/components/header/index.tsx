import Image from "next/image";
import { SignInButton } from "../signInButton";
import { useState } from "react";

import logo from "../../../public/images/title.svg";
import { BiMenuAltRight } from "react-icons/bi";

import styles from "./style.module.scss";
import { ActiveLink } from "../activeLink";

export function Header() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <header className={styles["header-container"]}>
      <div
        className={
          open
            ? styles["header-content"]
            : `${styles["header-content"]} ${styles.open}`
        }
      >
        <span className={styles.imgContainer}>
          <Image src={logo} alt="Best Article" layout="responsive" priority />
        </span>

        <span className={styles.menuIconContainer}>
          <BiMenuAltRight onClick={handleOpen} />
        </span>

        <div className={styles.headerInteractions}>
          <nav>
            {/*next disponibiliza links que substituem as ancoras*/}
            <ActiveLink activeClass={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            {/*é possível usar o prefetch para deixar uma pagina pre carregada*/}
            <ActiveLink activeClass={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </nav>
          <SignInButton />
          <span className={styles.bgWhenOpen} onClick={handleOpen}></span>
        </div>
      </div>
    </header>
  );
}
