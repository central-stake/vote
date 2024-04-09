import { ReactNode } from "react";
import VoteResultBySeat from "./VoteResultBySeat";
import VoteSystemComparison from "./VoteSystemComparison";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function VoteResults({ children } : { children: ReactNode}) {
  return (
    <div className="flex items-center justify-center">
      <Carousel className="max-w-screen-md">
        <CarouselContent>
          {children && (
            <CarouselItem>
              {children}
            </CarouselItem>
          )}
          <CarouselItem>
            <VoteSystemComparison />
          </CarouselItem>
          <CarouselItem>
          <VoteResultBySeat />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}