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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function VoteResults({ children } : { children: ReactNode}) {

  return (
    <div>
      <div className="mb-8">
        {children}
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center mb-4 text-[#4b4848]">
            Voting result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VoteSystemComparison />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-center mb-4 text-[#4b4848]">
            Seats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VoteResultBySeat />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex items-center justify-center">
      <Carousel className="max-w-screen-md">
        <CarouselContent>
          <CarouselItem>
            <VoteSystemComparison />
          </CarouselItem>
          {children && (
            <CarouselItem>
              {children}
            </CarouselItem>
          )}
          {/* <CarouselItem>
            <VoteResultBySeat />
          </CarouselItem> */}
        </CarouselContent>
        <CarouselPrevious variant="default" />
        <CarouselNext variant="default" />
      </Carousel>
    </div>
  );
}