import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OkarinaPlayer } from "@/components/okarina-player";
import { Hero } from "@/components/sections/hero";
import { Incantation } from "@/components/sections/incantation";
import { SonicRelics } from "@/components/sections/sonic-relics";
import { Bloodline } from "@/components/sections/bloodline";
import { Covenant } from "@/components/sections/covenant";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <OkarinaPlayer />
      <main className="flex-1">
        <Hero />
        <Incantation />
        <SonicRelics />
        <Bloodline />
        <Covenant />
      </main>
      <SiteFooter />
    </>
  );
}
