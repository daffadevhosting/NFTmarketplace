import Head from 'next/head'
import {
  MediaRenderer,
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useAddress,
  useMakeBid,
  useBuyNow,
} from "@thirdweb-dev/react";
import { ChainId, ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout, { siteTitle } from '../../components/layout';
import { RiLoader4Fill } from "react-icons/ri";
import { MARKETPLACE_ADDRESS } from "../../const/contractAddresses";
import styles from '../../styles/utils.module.scss'

export default function ListingPage() {
  const router = useRouter();
  const { listingId } = router.query;

  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const marketplace = useMarketplace(MARKETPLACE_ADDRESS);
  const { data: listing, isLoading: loadingListing } = useListing(
    marketplace,
    listingId
  );

  if (listing?.secondsUntilEnd === 0) {
  }

  const [bidAmount, setBidAmount] = useState("");

  if (loadingListing) {
    return  <div className={styles.loading}>
                <RiLoader4Fill className={styles.spinner} />
            </div>;
  }

  if (!listing) {
    return <div className={styles.loading}>Listing not found</div>;
  }

  async function createBidOrOffer() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          NATIVE_TOKENS[ChainId.Rinkeby].wrapped.address, // Wrapped Ether address on Rinkeby
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        await marketplace?.auction.makeBid(listingId, bidAmount);
      }

      alert(
        `${
          listing?.type === ListingType.Auction ? "Bid" : "Offer"
        } created successfully!`
      );
    } catch (error) {
      console.error(error.message || "something went wrong");
      alert(error.message || "something went wrong");
    }
  }

  async function buyNft() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      // Simple one-liner for buying the NFT
      await marketplace?.buyoutListing(listingId, 1);
      alert("NFT bought successfully!");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
<Layout listingId>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className={styles.mainNftImage}
          />
        </div>

        <div className={styles.rightListing}>
        <div className={styles.dflex}>
          <h1>{listing.asset.name}</h1>
          <p>
            Owned by <b>{listing.sellerAddress?.slice(0, 6)}</b>
          </p>
        </div>
          <h2 className={styles.priceSection}><i className={styles.polygon} />
            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
            {listing.buyoutCurrencyValuePerToken.symbol}
          </h2>

          <div className={styles.buySection}
          >
            <button
              style={{ borderStyle: "none" }}
              className={styles.buyBtn}
              onClick={buyNft}
            >
              Buy
            </button>

            <div className={styles.auctionSection}
            >
              <input
                type="text"
                name="bidAmount"
                className={styles.inputAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Amount"
              />
              <button
                className={styles.btnAuction}
                onClick={createBidOrOffer}
              >
                Bid
              </button>
            </div>
          </div>
        </div>
      </div>
</Layout>
  );
}
