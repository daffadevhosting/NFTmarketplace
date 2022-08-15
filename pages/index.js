import { useState } from 'react';
import {
  ChainId,
  useClaimedNFTSupply,
  useContractMetadata,
  useNetwork,
  useNFTDrop,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
} from '@thirdweb-dev/react';
import { useNetworkMismatch } from '@thirdweb-dev/react';
import { useAddress } from '@thirdweb-dev/react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import Head from 'next/head'
import Image from 'next/image'
import { NFT_DROP_ADDRESS } from "../const/contract";
import { RiLoader4Fill, RiIndeterminateCircleLine, RiAddCircleLine } from "react-icons/ri";
import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/utils.module.scss'
import Link from 'next/link'

const myNftDropContractAddress = NFT_DROP_ADDRESS;
const pageTitle = 'Home'

export default function Home() {
  const nftDrop = useNFTDrop(myNftDropContractAddress);
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const claimNFT = useClaimNFT(nftDrop);
  const [, switchNetwork] = useNetwork();

  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(
    myNftDropContractAddress,
  );

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);

  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || '0',
    activeClaimCondition?.currencyMetadata.decimals,
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.loading}>
                <RiLoader4Fill className={styles.spinner} />
        </div>;
  }

  // Function to mint/claim an NFT
  const mint = async () => {
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Fantom);
      return;
    }

    claimNFT.mutate(
      { to: address, quantity },
      {
        onSuccess: () => {
          alert(`Successfully minted NFT${quantity > 1 ? 's' : ''}!`);
        },
        onError: (err) => {
          console.error(err);
          alert(err?.message || 'Something went wrong');
        },
      },
    );
  };

  return (
    <Layout home>
      <Head>
        <title>{pageTitle} - {siteTitle}</title>
      </Head>
        <div className={styles.detailPageContainer} style={{textAlign: 'center'}}>
              <h1>{contractMetadata?.name}</h1>
              <p style={{margin: '0'}}>{contractMetadata?.description}</p>
        </div>
        <div className={styles.nftDropSection}>
          {/* Image Preview of NFTs */}
          <img
            className={`${styles.imageDrop} ${styles.spin}`}
            src={contractMetadata?.image}
            alt={`${contractMetadata?.name} preview image`}
          />

          {/* Amount claimed so far */}
          <div className={styles.mintCompletionArea}>
            <div className={styles.mintAreaLeft}>
              <p>Total Minted</p>
            </div>
            <div className={styles.mintAreaRight}>
              {claimedSupply && unclaimedSupply ? (
                <p>
                  {/* Claimed supply so far */}
                  <b>{claimedSupply?.toNumber()}</b>
                  {' / '}
                  {
                    // Add unclaimed and claimed supply to get the total supply
                    claimedSupply?.toNumber() + unclaimedSupply?.toNumber()
                  }
                </p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* Show claim button or connect wallet button */}
          {address ? (
            // Sold out or show the claim button
            isSoldOut ? (
              <div>
                <h4>Sold Out</h4>
              </div>
            ) : isNotReady ? (
              <div>
                <h2>Not ready to be minted yet</h2>
              </div>
            ) : (
              <>
                <p></p>
<div className={styles.mintBtnArea}>
                <div className={styles.quantityContainer}>
                  <button
                    className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <RiIndeterminateCircleLine size={25} />
                  </button>

                  <h5 style={{margin: '0px'}}>{quantity}</h5>

                  <button
                    className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={
                      quantity >=
                      parseInt(
                        activeClaimCondition?.quantityLimitPerTransaction ||
                          '0',
                      )
                    }
                  >
                    <RiAddCircleLine size={25} />
                  </button>
                </div>

                <button
                  className={`${styles.mainButton} ${styles.spacerTop} ${styles.spacerBottom}`}
                  onClick={mint}
                  disabled={claimNFT.isLoading}
                >
                  {claimNFT.isLoading
                    ? 'Minting...'
                    : `Mint${quantity > 1 ? ` ${quantity}` : ''}${
                        activeClaimCondition?.price.eq(0)
                          ? ' (Free)'
                          : activeClaimCondition?.currencyMetadata.displayValue
                          ? ` (${formatUnits(
                              priceToMint,
                              activeClaimCondition.currencyMetadata.decimals,
                            )} ${
                              activeClaimCondition?.currencyMetadata.symbol
                            })`
                          : ''
                      }`}
                </button>
</div>
              </>
            )
          ) : (
            <><span style={{textAlign: 'center'}}><p>Connect Wallet</p></span></>
          )}
        </div>
    </Layout>
  );
}
