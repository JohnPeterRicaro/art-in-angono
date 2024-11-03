import { MuseumWithDistanceAndEta } from "@/components/MapComponent";
import SearchMuseums from "@/components/search-museums";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Landmark, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  eta: string | null;
  museums: MuseumWithDistanceAndEta[];
  museumsInRoute: MuseumWithDistanceAndEta[];
  setDestination: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    } | null>
  >;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  startMultipleNavigation: () => any;
  startNavigation: () => any;
  haversineDistance: () => any;
}

const AutomatedMapping = ({
  museums,
  museumsInRoute,
  setDestination,
  isOpen,
  setIsOpen,
  startMultipleNavigation,
  startNavigation,
  eta,
  haversineDistance,
}: Props) => {
  const [isMultipleNav, setIsMultipleNav] = useState<boolean>(true);
  const [museum, setMuseum] = useState<google.maps.places.PlaceResult>();
  const [input, setInput] = useState<string>("");

  const filteredMuseums = museums.filter((museum) =>
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
      ) : !isMultipleNav && museum ? (
        <div
          className={
            "relative w-full flex flex-col justify-start items-start gap-[7px]"
          }
        >
          <X
            onClick={() => {
              setMuseum(undefined);
              setIsOpen(true);
            }}
            size={24}
            strokeWidth={2}
            className={"absolute top-0 right-0 text-gray-950 cursor-pointer"}
          />
          <h1 className={"text-[24px] font-medium"}>{museum?.name || ""}</h1>
          <div className={"flex flex-col justify-start items-start"}>
            <p className={"text-[13px] leading-[15.73px] text-[#969291]"}>
              {museum?.vicinity}
            </p>
            <h3 className={"text-[16px] leading-[19.36px] font-bold"}>
              {eta} | {museum?.opening_hours?.open_now ? "OPEN NOW" : "CLOSE"}
            </h3>
          </div>
          <Button
            onClick={() => {
              if (museum?.geometry?.location) {
                const lat = museum.geometry.location.lat();
                const lng = museum.geometry.location.lng();

                if (lat !== undefined && lng !== undefined) {
                  setIsOpen(false);
                  startNavigation();
                  setMuseum(undefined);
                }
              }
            }}
            type={"button"}
            variant={"default"}
            className={
              "my-[12px] w-full h-[50px] py-[5px] px-[33px] bg-[#0094FF] text-[20px] leading-[24.2px] hover:bg-[#0094FF]/75 rounded-full text-white"
            }
          >
            Start Navigation
          </Button>
          <div className={"flex justify-start items-center gap-[21px]"}>
            <Landmark size={30} strokeWidth={2} className={"text-gray-950"} />
            <p className={"text-[20px] font-semibold"}>History Museum</p>
          </div>
        </div>
      ) : (
        <SearchMuseums
          setDestination={setDestination}
          isOpen={isOpen}
          filteredMuseums={filteredMuseums}
          setInput={setInput}
          setMuseum={setMuseum}
          input={input}
        />
      )}
    </>
  );
};
export default AutomatedMapping;
