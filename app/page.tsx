import {DemoHeroGeometric} from "@/components/StandPage";
import Company from "@/components/Company";
import {SpotlightNewDemo} from "@/components/SpotLight";
export default function Home() {
  return (
   <div>
    <DemoHeroGeometric />
    <section className="container mx-auto py-5 text-center">
      <h1 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">Our Partners</h1>
    <Company  />
    </section>
    <section>
      <SpotlightNewDemo />
    </section>
   </div>
  );
}
