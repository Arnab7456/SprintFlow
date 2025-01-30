import { Button } from "@/components/ui/button";
import Image from "next/image";
import {DemoHeroGeometric} from "@/components/StandPage";
import Company from "@/components/Company";
export default function Home() {
  return (
   <div>
    <DemoHeroGeometric />
    <section className="container mx-auto py-5   font-serif text-4xl  text-center  bg-[#030303]">
      <h1>Our Partners</h1>
    <Company  />
    </section>
   </div>
  );
}
