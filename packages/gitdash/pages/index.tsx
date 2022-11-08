import { useEffect } from 'react';
import { Example } from '../snippiets/dashboard';
export default function Home() {
  useEffect(() => {
    async function doFetch() {
      const resp = await fetch('/api/hello');
      console.log(resp.body);
    }
    doFetch();
  }, []);

  return <Example />;
}
