import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { data } from "./CarouselData"

export function CarouselDemo() {
  return (
    <Carousel className=" w-[80vw] lg:h-[80vh] md:h-[60vh] max-sm:h-[20vh] flex items-center justify-center mt-40 lg:ml-[7.5rem]  md:ml-20 ml-10" >
      <CarouselContent>
        {data.map((item) => (
            
          <CarouselItem key={item.id}>
            <div className="p-1">
              <Card>
                <CardContent className=" bg-slate-300 rounded-lg flex items-center justify-center p-6">
                  <img src={item.src} alt={`Carousel item ${item.id}`} className="w-full lg:h-[80vh] md:h-[60vh] max-sm:h-[20vh] rounded-6xl object-fill"/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-500"/>
      <CarouselNext className='bg-slate-500'/>
    </Carousel>
  )
}
