"use client";

import ImageWithFallback from "@/components/imagewithfallback";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TrackignMainSection = () => {
  return (
    <section
      className={
        "z-30 w-full h-full flex justify-center items-center font-bold"
      }
    >
      <div
        className={
          "z-30 px-[24px] flex flex-col justify-center items-center gap-[94px]"
        }
      >
        <ImageWithFallback
          width={388}
          height={388}
          src={"/art-in-angono-logo.png"}
          alt={"/art-in-angono-logo.png"}
        />
        <Button
          type={"button"}
          variant={"default"}
          size={"lg"}
          className={
            "relative px-[88px] w-full py-[28px] text-white text-[24px] font-semibold rounded-[33px]"
          }
        >
          <Link
            href={"/tracking/notifications"}
            className={
              "absolute px-[88px] w-full h-full flex justify-center items-center"
            }
          >
            Taralets!
          </Link>
        </Button>
      </div>
    </section>
  );
};
export default TrackignMainSection;
