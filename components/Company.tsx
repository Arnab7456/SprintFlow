'use client'
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import EmblaCarouselAutoplay from 'embla-carousel-autoplay';
import companies from "../data/companies.json";
import Image from "next/image";
export default function Company() {
    return (
        <Carousel 
            plugins={[
                EmblaCarouselAutoplay({
                    delay: 2000,
                })
            ]}
             className="w-full py-10 dark:bg-black/[0.96] "
        >
            <CarouselContent  className="flex gap-5 sm:gap-20 items-center dark:bg-black/[0.96] ">
                {companies.map((company) => (
                    <CarouselItem key={company.id} className="basis-1/3 lg:basis-1/6 ">
                        <Image
                            src={company.path}
                            alt={company.name}
                            className="h-9 sm:h-14 w-auto object-contain"
                            width={100}
                            height={100}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
