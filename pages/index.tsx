import { useRouter } from 'next/dist/client/router';
import { DocumentContext } from 'next/document';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { authStore } from '../store/auth-store';
import styles from '../styles/landing-page.module.css'
import { redirectHomeIfLoggedIn } from '../util/server-side-auth';
import { content } from '../util/content';
import { base } from '../util/site';
import Link from 'next/link';

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    authStore.subscribe(() => setLoggedIn(authStore.getState().loggedIn))
    setLoading(false)

    if (loggedIn) {
      router.push('/home')
    }
  })

  return (
    <>
      <Head>
        <title>Online Gift Exchange, Secret Santa Generator - GiftTrade</title>

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={content.BASE_TITLE} />
        <meta property="og:description" content={content.DESCRIPTION} />
        <meta property="og:image" content={`${base}banner.jpg`} />
        <meta property="og:url" content={base} />
        <meta property="og:site_name" content="GiftTrade" />
      </Head>

      <div className={styles.landingPage}>
        <div className={styles.pageHero}>
          <div className={styles.pageHeroInner}>

            <nav className={styles.heroNav}>
              <div className={styles.left}>
                <Link href="/">
                  <a>
                    <img src='/logos/logo_profile_rounded.svg' alt='Logo' />
                  </a>
                </Link>
              </div>

              <div className={styles.right}></div>
            </nav>

            <div className={styles.hero}>
              <div className={styles.heroCaption}>
                <div className={styles.heroCaptionHeading}>
                  <h1>Gift Exchange.</h1>
                  <h1>Simplified.</h1>
                </div>

                <div className={styles.button}>
                  <Link href="/login">
                    <a>
                      <div className={styles.loginButton}>Start your Gift Exchnage</div>
                    </a>
                  </Link>
                </div>
              </div>

              <div className={styles.sitePreviewPanel}>
                <div className={styles.mobilePreview}>
                  <img src='/screenshots/iphone-xs.png' alt='Mobile' />
                </div>

                <div className={styles.laptopPreview}>
                  <img src='/screenshots/macbook-pro-13.png' alt='Macbook' />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await redirectHomeIfLoggedIn(ctx);
