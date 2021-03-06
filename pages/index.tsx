import Head from "next/head";
import { useEffect, useState } from "react";
import { authStore } from "../store/auth-store";
import styles from "../styles/landing-page.module.css";
import { content } from "../util/content";
import { base } from "../util/site";
import Link from "next/link";
import PhoneHolder from "../components/PhoneHolder";
import Aos from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/router"
import NextGenImg from "../components/NextGenImg"

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(authStore.getState().loggedIn)
  const router = useRouter()

  useEffect(() => {
    Aos.init({ duration: 500 })

    const unsubscribe = authStore.subscribe(() => {
      setLoggedIn(authStore.getState().loggedIn)
    })

    if (loggedIn && authStore.getState().loggedIn) {
      router.push("/home")
      return () => {
        unsubscribe()
      }
    }

    return () => unsubscribe()
  }, [loggedIn])

  const link = loggedIn ? `/home` : "/login"

  if (loggedIn) return <></>

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
            <nav className={styles.heroNav} data-aos="fade">
              <div className={styles.left}>
                <Link href="/">
                  <a className={styles.logotype}>
                    <span className={styles.logo}></span>
                  </a>
                </Link>
              </div>

              <div className={styles.right}>
                <Link href={link}>
                  <a>
                    <div className={styles.navLogin}>Login</div>
                  </a>
                </Link>
              </div>
            </nav>

            <div className={styles.hero}>
              <div className={styles.heroCaption} data-aos="fade-down">
                <div className={styles.heroCaptionHeading}>
                  <h1>Gift Exchange.</h1>
                  <h1>Simplified.</h1>
                </div>

                <div className={styles.button}>
                  <Link href={link}>
                    <a>
                      <div className={styles.loginButton}>
                        Start your Gift Exchange
                      </div>
                    </a>
                  </Link>
                </div>
              </div>

              <div className={styles.sitePreviewPanel} data-aos="fade-up">
                <div
                  className={
                    styles.mobilePreview + " " + styles.mobilePreviewImg
                  }
                ></div>
                <div
                  className={
                    styles.laptopPreview + " " + styles.laptopPreviewImg
                  }
                ></div>
              </div>
            </div>

            <div className={styles.sitePreviewPanelSm} data-aos="fade-up">
              <div
                className={
                  styles.mobilePreviewSm + " " + styles.mobilePreviewImg
                }
              ></div>
            </div>
          </div>
        </div>

        <div className={styles.howToPage}>
          <div className={styles.howToHeading}>
            <h2 className={styles.underlineHeading}>How it works</h2>
          </div>

          <div className={styles.instructions}>
            <div
              className={`${styles.demoContainer} ${styles.newEvent} ${styles.imageDemo}`}
            >
              <div className={styles.featureImgHolder}>
                <NextGenImg
                  nextGenSources={[
                    {
                      srcSet: "/screenshots/new_event.webp",
                      type: "image/webp",
                    },
                  ]}
                  src="/screenshots/new_event.png"
                  loading="lazy"
                />
              </div>

              <div className={styles.details}>
                <h3>Create an Event</h3>
                <p>
                  We've made it extremely simple to create a new event. Simply
                  press the <i>add event</i> button, name your event, set a
                  budget, set the draw date, and enjoy!
                </p>
              </div>
            </div>

            <div
              className={`${styles.demoContainer} ${styles.blockDemo} ${styles.demoCenter}`}
            >
              <div className={styles.details}>
                <h3>Invite with Ease</h3>
                <div className={styles.detailInfo}>
                  <Link href="/i/gOxFJ7d66kr1KY7">
                    <a>
                      <div className={styles.featureImgHolder}>
                        <NextGenImg
                          nextGenSources={[
                            {
                              srcSet: "/screenshots/get_link.webp",
                              type: "image/webp",
                            },
                          ]}
                          src="/screenshots/get_link.png"
                          loading="lazy"
                          alt="Join this event to explore GiftTrade"
                          title="Click to join this public event and explore GiftTrade!"
                        />
                      </div>
                    </a>
                  </Link>
                  <p>
                    Inviting friends and family to your event couldn't have been
                    easier. With link sharing, simply copy and share the invite
                    link with friends and family.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.demoContainer + " " + styles.demoRight}>
              <PhoneHolder video="/clips/wishlist_demo.mp4" />

              <div className={styles.details}>
                <h3>Make your wish list</h3>
                <p>
                  Create your wish list by searching products from the event
                  wishlist. Sort products using the filter tool to find the
                  perfect item.
                </p>
              </div>
            </div>

            <div
              className={`${styles.demoContainer} ${styles.drawSection} ${styles.imageDemo}`}
            >
              <div className={styles.featureImgHolder}>
                <NextGenImg
                  nextGenSources={[
                    {
                      srcSet: "/screenshots/draw.webp",
                      type: "image/webp",
                    },
                  ]}
                  src="/screenshots/draw.png"
                  loading="lazy"
                />
              </div>

              <div className={styles.details}>
                <h3>Draw participants</h3>
                <p>
                  Once everyone has joined the event, the organizer can draw
                  names to assign each participant a random name from the list.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.closingSection}>
          <div className={styles.closingInner}>
            <h2>
              Start <i>your</i> Gift Exchange Today!
            </h2>

            <div className={styles.button}>
              <Link href={link}>
                <a>
                  <div className={styles.loginButton}>Start Today!</div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
