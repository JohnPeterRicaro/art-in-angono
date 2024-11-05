import SearchMuseums from "@/components/search-museums";
import { Button } from "@/components/ui/button";
import { Landmark, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  eta: string | null;
  museums: google.maps.places.PlaceResult[];
  setDestination: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    } | null>
  >;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  startNavigation: () => any;
}

const ManualMapping = ({
  eta,
  museums,
  setDestination,
  isOpen,
  setIsOpen,
  startNavigation,
}: Props) => {
  const [museum, setMuseum] = useState<google.maps.places.PlaceResult>();
  const [input, setInput] = useState<string>("");

  const filteredMuseums = museums.filter((museum) =>
    museum?.name?.toLocaleLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      {museum ? (
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
          input={input}
          setInput={setInput}
          filteredMuseums={filteredMuseums}
          setMuseum={setMuseum}
        />
      )}
    </>
  );
};

export default ManualMapping;
