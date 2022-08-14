import { useAddress, useDisconnect, useChainId } from "@thirdweb-dev/react";
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from "react"
import {
 RiWallet3Fill,
 RiPlayCircleFill,
 RiArrowLeftCircleLine,
 RiLogoutCircleRLine
 } from "react-icons/ri";
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.scss'
import Modal from '../components/utils/Modal'
import Link from 'next/link'
import Router from 'next/router'

const name = 'TESTnet'
export const siteTitle = 'web3 NFT marketplace project'

export default function Layout({ children, home, collection, listingId, about }) {
  const [showModal, setShowModal] = useState(false);

  const address = useAddress();
  const disconnectWallet = useDisconnect();
  const chainId = useChainId();

  return (
    <div className={styles.main}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
          <div className={styles.rightHead}>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={40}
              width={40}
              alt={name}
            />
            <span className={utilStyles.heading}>{name}</span>
          </div>
          <div className={styles.leftHead}>
        {address ? (
          <>
            <RiLogoutCircleRLine size={32} onClick={() => disconnectWallet()} />
          </>
        ) : (
            <RiWallet3Fill size={32} onClick={() => setShowModal(true)} />
        )}
          </div>
          </>
        ) : (
          <>
          <div className={styles.rightHead}>
              <a onClick={() => Router.back()}
                 style={{height: '35px',
                 cursor: 'pointer'}}>
                <RiArrowLeftCircleLine
                  color={'currentcolor'}
                  size={35}
                />
              </a>
            <span className={utilStyles.heading}>
                <span className={utilStyles.colorInherit}>{name}</span>
            </span>
            </div>
          <div className={styles.leftHead}>
        {address ? (
          <>
            <p style={{margin: 0}}>{address.slice(0, 2).concat("*").concat(address.slice(-4))}</p>
            <RiLogoutCircleRLine size={32} onClick={() => disconnectWallet()} />
          </>
        ) : (
            <RiWallet3Fill size={32} onClick={() => setShowModal(true)} />
        )}
          </div>
          </>
        )}
      </header>
      <main className={styles.container}>{children}</main>
      <footer className={styles.footBar}>
      {!home ? (
        <>
    <Link href="/"><a>
      <div className={styles.linkTab}>Blog</div>
    </a></Link>
    <Link href="/listing"><a>
      <div className={styles.linkTab}>Collection</div>
    </a></Link>
      <div className={styles.linkTab}>About</div>
         </>
        ) : (
          <>
    <Link href="/"><a>
      <div className={styles.linkTab}>Blog</div>
    </a></Link>
    <Link href="/collection"><a>
      <div className={styles.linkTab}>Collection</div>
    </a></Link>
      <div className={styles.linkTab}>About</div>
          </>
      )}
      </footer>
            <Modal onClose={() => setShowModal(false)}
                show={showModal}></Modal>
    </div>
  )
}
