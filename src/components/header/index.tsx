import Image from "next/image";
import { SignInButton } from "../signInButton";
import { useState } from "react";

import logo from "../../../public/images/title.svg";
import { BiMenuAltRight } from "react-icons/bi";

import styles from "./style.module.scss";

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
          <Image src={logo} alt="Best Article" layout="responsive" />
        </span>

        <span className={styles.menuIconContainer}>
          <BiMenuAltRight onClick={handleOpen} />
        </span>

        <div className={styles.headerInteractions}>
          <nav>
            <a className={styles["active"]} href="#">
              Home
            </a>
            <a href="#">Posts</a>
          </nav>
          <SignInButton />
          <span className={styles.bgWhenOpen} onClick={handleOpen}></span>
        </div>
      </div>
    </header>
  );
}
