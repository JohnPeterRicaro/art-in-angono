import { MuseumWithDistanceAndEta } from "@/components/MapComponent";
import SearchMuseums from "@/components/search-museums";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dispatch, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  angonoMuseums: MuseumWithDistanceAndEta[];
  museumsInRoute: MuseumWithDistanceAndEta[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  startMultipleNavigation: () => any;
  haversineDistance: () => any;
}

const AutomatedMapping = ({
  angonoMuseums,
  museumsInRoute,
  isOpen,
  setIsOpen,
  startMultipleNavigation,
  haversineDistance,
}: Props) => {
  const [isMultipleNav, setIsMultipleNav] = useState<boolean>(true);
  const [input, setInput] = useState<string>("");

  const filteredMuseums = angonoMuseums.filter((museum) =>
    museum?.name?.toLocaleLowerCase().includes(input.toLowerCase())
  );

  haversineDistance?.();

  return (
    <>
      {isMultipleNav ? (
        <div className={"w-full space-y-[13px]"}>
          <div
            className={twMerge(
              "max-h-[0px] transition-all overflow-hidden",
              isOpen && "max-h-[500px]"
            )}
          >
            <ScrollArea className={twMerge("w-full")}>
              <div className={"w-full py-[13px] px-0 space-y-[19px]"}>
                {museumsInRoute.map((museum, index) => (
                  <div
                    key={index}
                    className={"flex justify-start items-center gap-[12px]"}
                  >
                    <div
                      className={
                        "w-[242px] py-[10px] px-[18px] text-[18px] leading-[18px] bg-[#D9D9D9] font-bold truncate"
                      }
                    >
                      {museum?.name}
                    </div>
                    <p className={"text-[15px] leading-[15px] font-semibold"}>
                      {Math.round(
                        Number(
                          (museum?.tour_eta?.eta || 0) +
                            (museum?.tour_eta?.tour_time || 0)
                        )
                      ).toString()}{" "}
                      {"Minutes"}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              onClick={() => {
                startMultipleNavigation?.();
                setIsOpen(false);
                setIsMultipleNav(false);
              }}
              type={"button"}
              className={
                "h-auto w-full p-[13px] rounded-[25px] bg-[#0094FF] hover:bg-[#0094FF]/75"
              }
            >
              Go
            </Button>
          </div>
        </div>
      ) : (
        <SearchMuseums
          startMultipleNavigation={startMultipleNavigation}
          isOpen={isOpen}
          filteredMuseums={filteredMuseums}
          setInput={setInput}
          input={input}
        />
      )}
    </>
  );
};
export default AutomatedMapping;
