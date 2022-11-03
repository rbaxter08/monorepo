import Head from 'next/head';
import { SocialIcon } from 'react-social-icons';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Robert Baxter</title>
        <meta name="description" content="Robert Baxter's dev portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="flex space-x-8">
          <SocialIcon url="https://twitter.com/Baxtbox" />
          <SocialIcon url="https://www.linkedin.com/in/iam-baxter/" />
          <SocialIcon url="https://github.com/rbaxter08" />
          <SocialIcon url="https://discordapp.com/users/Wootastic#5550" />
        </div>
      </main>
    </div>
  );
}
