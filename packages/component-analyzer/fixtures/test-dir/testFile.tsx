import Head from 'next/head';
import { SocialIcon } from 'react-social-icons';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header></header>
      <Head>
        <title>Robert Baxter</title>
        <meta name="description" content="Robert Baxter's dev portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div></div>
      </main>
    </div>
  );
}
