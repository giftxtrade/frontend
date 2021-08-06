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
  const router = useRouter()

  useEffect(() => {
    authStore.subscribe(() => setLoggedIn(authStore.getState().loggedIn))
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
                  <a className={styles.logotype}>
                    <span className={styles.logo}></span>
                    <span className={styles.logotext}>GiftTrade</span>
                  </a>
                </Link>
              </div>

              <div className={styles.right}>
                <Link href="/login">
                  <a>
                    <div className={styles.navLogin}>Login</div>
                  </a>
                </Link>
              </div>
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
                      <div className={styles.loginButton}>Start your Gift Exchange</div>
                    </a>
                  </Link>
                </div>
              </div>

              <div className={styles.sitePreviewPanel}>
                <div className={styles.mobilePreview + " " + styles.mobilePreviewImg}></div>
                <div className={styles.laptopPreview + " " + styles.laptopPreviewImg}></div>
              </div>
            </div>

            <div className={styles.sitePreviewPanelSm}>
              <div className={styles.mobilePreviewSm + " " + styles.mobilePreviewImg}></div>
            </div>

          </div>
        </div>

        <div className={styles.howToPage}>

          <div className={styles.howToHeading}>
            <h2>How it works</h2>
          </div>

          <div className={styles.instructions}>
            <div className={styles.demoContainer}>
              <div className={styles.phoneHolder}>
                <video
                  loop
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                >
                  <source src="/clips/intro-landing.mp4" />
                </video>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await redirectHomeIfLoggedIn(ctx);
