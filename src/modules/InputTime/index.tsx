import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const InputTime = () => {
  const [time, setTime] = useState<number>(1);
  const router = useRouter();
  const { setAvailableTime } = useTrackingContainerStore();
  return (
    <ContentContainer>
      <DynamicContent
        size={199}
        smallSize={125}
        image={"/icons/clock-art.png"}
        imageFallback={"/icons/clock-art.png"}
        heading={"Input Available Time"}
        subheading={"Input Your Available Time (Max: 9 Hours)"}
        detailsComponent={
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className={
                  "w-[280px] px-[24px] py-[22px] bg-[#D9D9D9] flex justify-center items-center"
                }
              >
                {time} HOUR{time !== 1 && "S"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={
                "w-[280px] h-auto p-1 flex flex-col justify-start items-start transition-all"
              }
            >
              {Array.from({ length: 9 }).map((_, index) => (
                <button
                  disabled={time === index + 1}
                  type={"button"}
                  onClick={() => {
                    setTime(index + 1);
                    setAvailableTime(index + 1);
                  }}
                  className={twMerge(
                    "w-full py-[8px] px-[12px] text-gray-800 font-semibold text-[11.67px] leading-[11.67px] hover:bg-gray-100 cursor-default",
                    time === index + 1 && "bg-gray-100 opacity-50"
                  )}
                >
                  {index + 1} HOUR{index + 1 !== 1 && "S"}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <Button
          onClick={() => router.push("/tracking/map")}
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

export default InputTime;
