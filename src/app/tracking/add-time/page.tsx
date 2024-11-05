"use client";

import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const Page = () => {
  const [time, setTime] = useState<number>(5);
  const router = useRouter();

  const { museumsInRoute, setMuseumsInRoute } = useTrackingContainerStore();

  const handleConfirm = () => {
    if (museumsInRoute.length === 0) return;

    let remainingTime = time;
    const updatedMuseums = [...museumsInRoute];

    updatedMuseums[0] = {
      ...updatedMuseums[0],
      tour_eta: {
        eta: updatedMuseums[0].tour_eta?.eta ?? 0,
        tour_time: remainingTime,
      },
    };

    while (remainingTime > 0 && updatedMuseums.length > 1) {
      const lastMuseumIndex = updatedMuseums.length - 1;
      const lastMuseum = updatedMuseums[lastMuseumIndex];
      const lastMuseumTourTime = lastMuseum.tour_eta?.tour_time ?? 0;

      if (lastMuseumTourTime <= remainingTime) {
        remainingTime -= lastMuseumTourTime;
        updatedMuseums.pop();
      } else {
        updatedMuseums[lastMuseumIndex] = {
          ...lastMuseum,
          tour_eta: {
            eta: lastMuseum.tour_eta?.eta ?? 0,
            tour_time: lastMuseumTourTime - remainingTime,
          },
        };

        remainingTime = 0;
      }
    }

    setMuseumsInRoute(updatedMuseums);
    router.push("/tracking/timer");
  };

  return (
    <ContentContainer>
      <DynamicContent
        size={199}
        smallSize={125}
        image={"/icons/clock-art.png"}
        imageFallback={"/icons/clock-art.png"}
        heading={"Input Available Time"}
        subheading={"Input Your Available Time (Max: 60 minutes)"}
        detailsComponent={
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className={
                  "w-[280px] px-[24px] py-[22px] bg-[#D9D9D9] flex justify-center items-center"
                }
              >
                {time} Minutes
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={
                "w-[280px] h-auto p-1 flex flex-col justify-start items-start transition-all"
              }
            >
              <ScrollArea
                className={"max-h-[200px] custom-scrollbar overflow-y-auto"}
              >
                {Array.from({ length: 12 }).map((_, index) => {
                  const optionTime = (index + 1) * 5;
                  return (
                    <button
                      key={optionTime}
                      disabled={time === optionTime}
                      type={"button"}
                      onClick={() => setTime(optionTime)}
                      className={twMerge(
                        "w-full py-[8px] px-[12px] text-gray-800 font-semibold text-[11.67px] leading-[11.67px] hover:bg-gray-100 cursor-default",
                        time === optionTime && "bg-gray-100 opacity-50",
                        optionTime === time && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {optionTime} minutes
                    </button>
                  );
                })}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <Button
          onClick={handleConfirm}
          type={"button"}
          variant={"default"}
          className={
            " w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
          }
        >
          Confirm
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default Page;
