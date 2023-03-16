import Head from 'next/head';
import { SocialIcon } from 'react-social-icons';
import Image from 'next/image';

import { Button } from '../components/Button';
import vestaPic from '../public/vesta.png';
import factsetPic from '../public/factset.png';
import h1Pic from '../public/h1.webp';

import styles from '../styles/Home.module.css';
import { useState } from 'react';

export default function Home() {
  const [state, setState] = useState<'about' | 'experience' | 'projects'>(
    'about'
  );

  return (
    <div className={styles.container}>
      <header></header>
      <Head>
        <title>Robert Baxter</title>
        <meta name="description" content="Robert Baxter's dev portfolio" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <main className={styles.main}>
        <section className="flex flex-col items-center">
          <p className="font-medium text-xl py-8 font-sans">Robert Baxter</p>
          <p className="font-sans">
            Staff Software Engineer / React Fanboy / Frontend Enthusiast
          </p>
          <p className="font-sans">Brooklyn, NY</p>
          <div className="flex py-8">
            <SocialIcon className="mx-8" url="https://twitter.com/Baxtbox" />
            <SocialIcon
              className="mx-8"
              url="https://www.linkedin.com/in/iam-baxter/"
            />
            <SocialIcon className="mx-8" url="https://github.com/rbaxter08" />
            <SocialIcon
              className="mx-8"
              url="https://discordapp.com/users/Wootastic#5550"
            />
            <SocialIcon className="mx-8" url="mailto:rbaxter.08@gmail.com" />
          </div>
          <section className="flex justify-between w-full pt-24">
            <Button
              variant={state === 'about' ? 'primary' : 'tertiary'}
              rounded
              onClick={() => setState('about')}
            >
              About
            </Button>
            <Button
              variant={state === 'experience' ? 'primary' : 'tertiary'}
              rounded
              onClick={() => setState('experience')}
            >
              Experience
            </Button>
            <Button
              variant={state === 'projects' ? 'primary' : 'tertiary'}
              onClick={() => setState('projects')}
              rounded
            >
              Projects
            </Button>
          </section>
        </section>
        {state === 'about' && (
          <section className="flex w-5/6 py-16 justify-center">
            <p className="font-sans w-3/5">
              My favorite movies include: American Psycho, The Thing, and Jaws.
            </p>
          </section>
        )}
        {state === 'experience' && (
          <section className="flex w-5/6 py-16 justify-between">
            <div className="flex flex-1 flex-col justify-center items-center">
              <Image
                height={50}
                src={factsetPic}
                alt="Picture of the FactSet logo"
              />
              <p className="font-sans text-slate-400">
                Staff Software Engineer
              </p>
              <p className="font-sans text-slate-400">Jun 2021 - Mar 2022</p>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center">
              <Image
                height={75}
                src={vestaPic}
                alt="Picture of the Vesta Healthcare logo"
              />
              <p className="font-sans text-slate-400">
                Senior Software Engineer
              </p>
              <p className="font-sans text-slate-400">Jun 2018 - Mar 2019</p>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center">
              <Image height={75} src={h1Pic} alt="Picture of the H1 logo" />
              <p className="font-sans text-slate-400">Software Engineer</p>
              <p className="font-sans text-slate-400">Jul 2015 - Jun 2018</p>
            </div>
          </section>
        )}
        {state === 'projects' && (
          <section className="flex w-5/6 py-16 justify-center">
            <p className="font-sans w-3/5">check out my github</p>
          </section>
        )}
      </main>
    </div>
  );
}
