"use client";

import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { setMuseumsInRoute, museumsInRoute } = useTrackingContainerStore();

  const handleNextDestination = () => {
    museumsInRoute.length === 1 && setMuseumsInRoute([]);
    setMuseumsInRoute(museumsInRoute.slice(1));

    router.push("/tracking/map");
  };

  return (
    <ContentContainer>
      <DynamicContent
        heading={"Times Up!"}
        subheading={`Your time is up! You can choose to extend your visit or proceed to your next destination.`}
        image={"/icons/timer-icon.png"}
        imageFallback={"/icons/timer-icon.png"}
        detailsComponent={
          <div
            className={
              "max-w-[280px] w-full h-auto py-[16px] flex justify-center items-center text-[32px] leading-[32px] bg-black text-white"
            }
          >
            {0}
            {" : "}
            {0}
          </div>
        }
      >
        <Button
          onClick={() => router.push("/tracking/add-time")}
          type={"button"}
          variant={"default"}
          className={
            "w-full h-auto py-[18px] text-white text-[20px] bg-black hover:bg-gray-700 font-semibold rounded-[33px] capitalize"
          }
        >
          Add More Time
        </Button>
        <Button
          type={"button"}
          onClick={handleNextDestination}
          variant={"default"}
          className={
            "w-full h-auto py-[18px] text-[20px] text-white bg-black hover:bg-gray-700 font-semibold rounded-[33px]"
          }
        >
          Next Destination
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default Page;
