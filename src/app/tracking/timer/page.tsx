"use client";

import { useEffect, useState } from "react";
import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { useRouter } from "next/navigation";

const Page = () => {
  const { museumsInRoute } = useTrackingContainerStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const initialTourTime =
      (museumsInRoute[0]?.tour_eta?.tour_time || 0) +
      1 -
      (museumsInRoute[0]?.tour_eta?.tour_time || 0);
    if (initialTourTime) {
      setTimeLeft(initialTourTime * 60);
    }
  }, [museumsInRoute]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const countdownInterval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 0) {
      if (Notification.permission === "granted") {
        new Notification("Time's up!", {
          body: "It's time to head to your next destination.",
          icon: "/icons/timer-icon.png",
        });
      }

      router.push("/tracking/stop");
    }
  }, [timeLeft, router]);

  const hours = Math.floor((timeLeft ?? 0) / 3600);
  const minutes = Math.floor(((timeLeft ?? 0) % 3600) / 60);
  const seconds = (timeLeft ?? 0) % 60;

  return (
    <ContentContainer>
      <DynamicContent
        heading={"You have arrived!"}
        subheading={`Your timer has started. We’ll notify you when it’s time to head to your next destination. Enjoy your visit!`}
        image={"/icons/timer-icon.png"}
        imageFallback={"/icons/timer-icon.png"}
        detailsComponent={
          <div
            className={
              "max-w-[280px] w-full h-auto py-[16px] flex justify-center items-center text-[32px] leading-[32px] bg-black text-white"
            }
          >
            {hours > 0 && `${hours} : `} {minutes}
            {" : "}
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
        }
      ></DynamicContent>
    </ContentContainer>
  );
};

export default Page;
