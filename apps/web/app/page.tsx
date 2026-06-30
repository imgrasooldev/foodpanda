import { getRestaurants } from '@/lib/data';
import { TabsBar } from '@/components/tabs-bar';
import { HomeBrowser } from '@/components/home-browser';

export default function HomePage() {
  const restaurants = getRestaurants();

  return (
    <main className="min-h-screen pb-16">
      <TabsBar />
      <HomeBrowser restaurants={restaurants} />
    </main>
  );
}
