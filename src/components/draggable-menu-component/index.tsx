import StarScore from "@/components/star-score";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dot, Landmark, Search, X } from "lucide-react";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DraggableMenuComponent = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    <section
      className={
        "z-50 absolute w-full bottom-0 h-auto flex justify-center items-center "
      }
    >
      <div
        className={
          "bg-white w-full pt-[9px] px-[27px] pb-[18px] text-center space-y-[14px] rounded-t-[24px]"
        }
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          type={"button"}
          className={
            "w-[64px] h-[5px] rounded-full bg-[#D9D9D9] hover:bg-gray-400 transition-all"
          }
        ></button>
        {children}
      </div>
    </section>
  );
};

export default DraggableMenuComponent;
