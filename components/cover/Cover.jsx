import { useContractMetadata, useAddress, useMetamask, useWalletConnect, useCoinbaseWallet } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../const/contract";
import styles from "../../styles/utils.module.scss";
import { RiWallet3Fill } from "react-icons/ri";

export const title = 'Sign Your Wallet'
export default function Cover() {
  const { contractMetadata, isLoading: loadingMetadata } = useContractMetadata(MARKETPLACE_ADDRESS);

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  return (
<div className={styles.loadingOrError}>
          {!loadingMetadata ? (
        <>
            <div className={styles.loading}><h4 style={{display: 'flex', alignItems: 'center', gap: '10px'}}><RiWallet3Fill /> Sign Your Wallet</h4></div>
        </>
          ) : (
            <p className={styles.loading}>authorized...</p>
          )}
</div>
  );
}
