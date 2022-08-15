import Head from 'next/head'
import React, { useState } from "react";
import {
  useMarketplace,
  useActiveListings,
  useContractMetadata,
  ThirdwebNftMedia,
} from "@thirdweb-dev/react";
import Image from 'next/image';
import Link from 'next/link';
import { RiLoader4Fill, RiPlayListAddFill } from "react-icons/ri";
import Layout, { siteTitle } from '../components/layout';
import { MARKETPLACE_ADDRESS } from "../const/contract";
import styles from "../styles/utils.module.scss";

const pageTitle = 'Collection'
export default function Listings() {
  const marketplace = useMarketplace(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading } = useActiveListings(marketplace);

  console.log(listings);

  // Load contract metadata
  const { data: contractMetadata, isLoading: loadingMetadata } =
    useContractMetadata(MARKETPLACE_ADDRESS);

  const [filter, setFilter] = useState(0); // 0 = direct, auction = 1

  return (
<Layout collection>
      <Head>
        <title>{pageTitle}-{siteTitle}</title>
      </Head>
    <div className={styles.container}>
      <div className={styles.collectionContainer}>
        <div className={styles.detailPageContainer} style={{textAlign: 'center'}}>
          {!loadingMetadata ? (
            <>
              <h1>{contractMetadata?.name}</h1>
              <p style={{margin: '0'}}>{contractMetadata?.description}</p>
            </>
          ) : (
        <div className={styles.loading}>
            Loading...
        </div>
          )}
        </div>

        {/* Toggle between direct listing and auction listing */}
        <div className={styles.listingTypeContainer}>
          <input
            type="radio"
            name="listingType"
            id="directListing"
            value="directListing"
            defaultChecked
            className={styles.listingType}
            onClick={() => setFilter(0)}
          />
          <label htmlFor="directListing" className={styles.listingTypeLabel}>
            Direct Listing
          </label>
          <input
            type="radio"
            name="listingType"
            id="auctionListing"
            value="auctionListing"
            className={styles.listingType}
            onClick={() => setFilter(1)}
          />
          <label htmlFor="auctionListing" className={styles.listingTypeLabel}>
            Auction Listing
          </label>
        </div>
<div className={styles.boxGridcontainer}>
        {!isLoading ? (
          <div className={styles.nftBoxGrid}>
            {listings
              ?.filter((listing) => listing.type === filter)
              ?.map((listing) => (
                <a
                  className={styles.nftBox}
                  key={listing.id.toString()}
                  href={`/marketplace/${listing.id}`}
                >
                  <ThirdwebNftMedia
                    metadata={{ ...listing.asset }}
                    className={styles.nftMedia}
                  />
<div className={styles.boxBody}>
<div className={styles.avatar}>
<Image src={contractMetadata.image} width={40} height={40} alt="avatar" />
</div>
                  <h4>{listing.asset.name}</h4>
                  <p className={styles.priceSection}><i className={styles.polygon}/>
                    {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
</div>
                </a>
              ))}
          </div>
        ) : (
        <div className={styles.loading}>
          <RiLoader4Fill className={styles.spinner} />
        </div>
        )}
        </div>
      </div>
    </div>
<Link href="/resell_nft">
<a>
<RiPlayListAddFill className={styles.resellBtn} />
</a></Link>
</Layout>
  );
}
