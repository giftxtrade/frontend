import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.copyInfo}>
        &copy; Copyright {new Date().getFullYear()} GiftTrade. All rights reserved.
      </div>

      <ul className={styles.links}>
        <li>
          <Link href="/about">
            <a>
              About
            </a>
          </Link>
        </li>

        <li>
          <Link href="/privacy">
            <a>
              Terms and Privacy
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}