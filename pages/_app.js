import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import '../styles/global.css'

const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
		<Component {...pageProps} />
    </ThirdwebProvider>
	);
}
