import Head from 'next/head';
import { BsPersonCircle } from 'react-icons/bs';
import { SocialIcon } from 'react-social-icons';
import { useWebsocket } from '../src/useWebsocket';

import styles from '../styles/Home.module.css';

export default function Home() {
  const { connections } = useWebsocket();

  return (
    <div className={styles.container}>
      <header>
        <div className="flex justify-end">
          {connections.map(({ id, color }) => (
            <BsPersonCircle className="m-1" key={id} color={color} size={32} />
          ))}
        </div>
      </header>
      <Head>
        <title>Robert Baxter</title>
        <meta name="description" content="Robert Baxter's dev portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div></div>
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
