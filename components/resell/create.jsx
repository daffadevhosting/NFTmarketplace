import Head from 'next/head'
import {
  useAddress,
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk";
import { NFT_COLLECTION } from "../../const/contract";
import { MARKETPLACE_ADDRESS } from "../../const/contract";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import styles from "../../styles/utils.module.scss";

const pageTitle = 'Resell NFT'
const siteTitle = 'DaffaDev NFT marketplace'
const contract = (NFT_COLLECTION)
export default function Create() {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const address = useAddress();

  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  // Connect to our marketplace contract via the useMarketplace hook
  const marketplace = useMarketplace(
    MARKETPLACE_ADDRESS // Your marketplace contract address here
  );

  // This function gets called when the form is submitted.
  async function handleCreateListing(e, any) {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(250);
        return;
      }

      // Prevent page from refreshing
      e.preventDefault();

      // De-construct data from form submission
      const { listingType, contractAddress, tokenId, price } =
        e.target.elements;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // For Auction Listings:
      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
      Swal.fire({
          title: 'Berhasil!',
          text: 'Posting NFT berhasil...',
          icon: 'success',
          confirmButtonText: 'Cool',
        }).then(function() {
            router.push(`/marketplace`);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(
    contractAddress,
    tokenId,
    price
  ) {
    try {
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
      Swal.fire({
          title: 'Berhasil!',
          text: 'NFT berhasil listing...',
          icon: 'success',
          confirmButtonText: 'Cool'
        }).then(function() {
            router.push(`/marketplace`);
        });
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(
    contractAddress,
    tokenId,
    price
  ) {
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
      Swal.fire({
          title: 'Berhasil!',
          text: 'NFT berhasil listing...',
          icon: 'success',
          confirmButtonText: 'Cool'
        }).then(function() {
            router.push(`/marketplace`);
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
<>
    <form onSubmit={(e) => handleCreateListing(e)}>
      <div className={styles.container}>
        {/* Form Section */}
        <div className={styles.collectionContainer}>
<div className={styles.cardStyle}>
        <div className={styles.detailPageContainer} style={{textAlign: 'center'}}>
            <h5>Reselling your NFT to marketplace</h5>
          </div>
        <div>
          <small style={{fontSize: 'small'}}>our NFT contract:<br/>{contract}</small>
        </div>
            <div className={styles.spacerBottom}></div>
          {/*  */}
          <div className={styles.hidden}>
            <input
              type="radio"
              name="listingType"
              id="directListing"
              value="directListing"
              defaultChecked
              className="btn-check"
            />
            <label htmlFor="directListing" className="btn btn-outline-success">
              Direct Listing
            </label>
            <input
              type="radio"
              name="listingType"
              id="auctionListing"
              value="auctionListing"
              className="btn-check"
            />
            <label htmlFor="auctionListing" className="btn btn-outline-info">
              Auction Listing
            </label>
          </div>
        <hr className={styles.divider}/>
          {/* NFT Contract Address Field */}
<div className="row">
    <div className="col-12">
        <div className="form-floating mb-3" style={{textAlign: "start"}}>
          <input
            type="text"
            name="contractAddress"
            className={styles.textInput} id="Contract"
            placeholder="NFT Contract Address"
          />
        </div>
       </div>
    </div>
<div className="row">
    <div className="col-12 col-sm-6">
          {/* NFT Token ID Field */}
        <div className="form-floating mb-3" style={{textAlign: "start"}}>
          <input
            type="text"
            name="tokenId"
            className={styles.textInput} id="Token"
            placeholder="NFT Token ID"
          />
        </div>
</div>
    <div className="col-12 col-sm-6">
          {/* Sale Price For Listing Field */}
        <div className="form-floating mb-3" style={{textAlign: "start"}}>
          <input
            type="text"
            name="price"
            className={styles.textInput} id="Price"
            placeholder="Sale Price"
          />
            </div>

            <div className={styles.spacer}></div>
        <div>
          <small>Setidaknya akan ada 2 kali transaksi untuk listing NFT</small>
        </div>
          <button
            type="submit"
            className={styles.mainButton}
            style={{ marginTop: 32, borderStyle: "none", float: 'right' }}
          >
            List NFT
          </button>
        </div>
    </div>
  </div>
 </div>
</div>
    </form>
</>
  );
}
