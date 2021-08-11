import Link from "next/link";
import styles from "../styles/Footer.module.css";

export function FooterLink({ href: link, pageName }: { href: string, pageName: string }) {
  return (
    <li>
      <Link href={link}>
        <a>
          {pageName}
        </a>
      </Link>
    </li>
  )
}

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.copyInfo}>
        &copy; Copyright {new Date().getFullYear()} GiftTrade. All rights reserved.
      </div>

      <ul className={styles.links}>
        <FooterLink
          href="/"
          pageName="Home"
        />

        <FooterLink
          href="/about"
          pageName="About"
        />

        <FooterLink
          href="/privacy"
          pageName="Terms and Privacy"
        />
      </ul>
    </div>
  )
}