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
    <>
      <div className="fixer"></div>

      <div className={`${styles.footer} footer`}>
        <div className={styles.footerInfo}>
          <div className={styles.copyInfo}>
            &copy; {new Date().getFullYear()} GiftTrade, LLC.
          </div>

          <ul className={styles.links}>
            <FooterLink
              href="/faqs"
              pageName="FAQs"
            />

            <FooterLink
              href="/about"
              pageName="About"
            />

            <FooterLink
              href="/privacy"
              pageName="Privacy"
            />
          </ul>
        </div>
      </div>
    </>
  )
}