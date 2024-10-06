"use client";

import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Notifications = () => {
  const router = useRouter();
  return (
    <ContentContainer className={"bg-white"}>
      <DynamicContent
        heading={"Enable Notifcations"}
        subheading={
          "This lets show you which museums in Rizal are currently near you."
        }
        image={"/icons/cellphone-art.png"}
        imageFallback={"/icons/cellphone-art.png"}
        children={
          <>
            <Button
              onClick={() => router.push("/tracking/traffic")}
              type={"button"}
              variant={"default"}
              className={
                " w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
              }
            >
              Enable Notifications
            </Button>
            <Button
              type={"button"}
              onClick={() => router.push("/tracking")}
              variant={"outline"}
              className={
                "w-full h-auto py-[18px] text-[20px] font-semibold rounded-[33px]"
              }
            >
              Skip for now
            </Button>
          </>
        }
      />
    </ContentContainer>
  );
};

export default Notifications;
