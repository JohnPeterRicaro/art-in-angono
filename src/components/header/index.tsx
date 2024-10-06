"use client";

import ImageWithFallback from "@/components/imagewithfallback";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  image: string;
  fallBackImage: string;
  component?: ReactNode;
  width: number;
  height: number;
}

const Header = ({
  className,
  image,
  component,
  fallBackImage,
  width,
  height,
}: Props) => {
  if (image === "") return <></>;

  return (
    <div
      className={twMerge(
        "w-full p-[24px] flex justify-center items-center",
        className
      )}
    >
      <ImageWithFallback
        src={image}
        fallbackImage={fallBackImage}
        alt={fallBackImage}
        width={width}
        height={height}
      />
      {component}
    </div>
  );
};

export default Header;
