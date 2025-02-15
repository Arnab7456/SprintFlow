import {DemoHeroGeometric} from "@/components/StandPage";
import Company from "@/components/Company";
import {SpotlightNewDemo} from "@/components/SpotLight";
import FAQPage from "@/components/Faq";
import Pricing from "@/components/Prcing";
export default function Home() {
  return (
   <div>
    <DemoHeroGeometric />
    <section className="container mx-auto py-5 text-center dark:bg-black/[0.96] ">
      <h1 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-400 dark:from-neutral-50 dark:to-neutral-200 bg-opacity-80 dark:bg-opacity-50 mb-4">Our Partners</h1>
    <Company  />
    </section>
      <SpotlightNewDemo />
      <FAQPage />
      {/* <section className="container mx-auto py-5 text-center dark:bg-black/[0.96] ">
     
      {/* </section> */}
       <Pricing />
   </div>
  );
}
