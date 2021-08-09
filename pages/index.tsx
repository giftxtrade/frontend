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
                  playsInline
                  preload="none"
                >
                  <source src="/clips/intro-landing.mp4" />
                </video>
              </div>

              <div className={styles.details}>
                <h3>1. Create an Event</h3>
                <p>Creating an event is as simple as tapping the "+" icon and adding an event name, budget, and draw date.</p>
                <p>Inviting friends and family to your event is extremely easy, via link sharing. Simply copy the link and share with friends and family.</p>
              </div>
            </div>

            <div className={styles.demoContainer + " " + styles.demoRight}>
              <div className={styles.phoneHolder}>
                <video
                  loop
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                  playsInline
                  preload="none"
                >
                  <source src="/clips/intro-landing.mp4" />
                </video>
              </div>

              <div className={styles.details}>
                <h3>2. Make your wish list</h3>
                <p>Create your wish list by searching products from the event wishlist. You can sort by price, and rating to find the perfect item.</p>
                <p>GiftTrade also offers an easy to use item selector to help stay within the event budget without the need for a calculator!</p>
              </div>
            </div>

            <div className={styles.demoContainer}>
              <div className={styles.phoneHolder}>
                <video
                  loop
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                  playsInline
                  preload="none"
                >
                  <source src="/clips/intro-landing.mp4" />
                </video>
              </div>

              <div className={styles.details}>
                <h3>3. Draw participants</h3>
                <p>Once everyone has joined the event, the organizer can draw names to assign each participant a random name from the list.</p>
                <p>When the organization has found the perfect pairing, they can confirm the draw so that all participants are notified about their draw.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await redirectHomeIfLoggedIn(ctx);
