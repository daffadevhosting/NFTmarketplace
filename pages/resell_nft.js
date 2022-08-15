import { useAddress } from "@thirdweb-dev/react";
import Head from 'next/head'
import Resell from "../components/resell/create";
import Cover, { title } from "../components/cover/Cover";
import Layout, { siteTitle } from '../components/layout'
import styles from "../styles/utils.module.scss";

const pageTitle = 'Resell NFT'
export default function Listings() {
  const address = useAddress();

  return (
<Layout Resell>
      <Head>
        <title>{pageTitle}-{siteTitle}</title>
      </Head>
<>
        {address ? (
    <Resell />
        ) : (
        <div className={styles.cover}>
      <Head>
        <title>{title}</title>
      </Head>
            <Cover />
        </div>
        )}
</>
</Layout>
  );
}

