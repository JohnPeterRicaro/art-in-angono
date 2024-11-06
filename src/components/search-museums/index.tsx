import StarScore from "@/components/star-score";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Dot, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  filteredMuseums: google.maps.places.PlaceResult[];
  setMuseum: Dispatch<
    SetStateAction<google.maps.places.PlaceResult | undefined>
  >;
  setDestination: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    } | null>
  >;
}

const SearchMuseums = ({
  input,
  setInput,
  isOpen,
  filteredMuseums,
  setMuseum,
  setDestination,
}: Props) => {
  return (
    <>
      <div
        className={"relative w-full h-auto flex justify-center items-center"}
      >
        <input
          value={input}
          onInput={(e) => setInput(e.currentTarget.value.toString())}
          className={
            "w-full h-[50px] rounded-[24px] bg-white shadow-input-shadow pr-[53px] pl-[16px] py-[18px] placeholder:text-black/75"
          }
          placeholder={"Search Museum"}
        />
        <Search size={28} strokeWidth={2} className={"absolute right-[18px]"} />
      </div>
      <div
        className={twMerge(
          "w-full space-y-[12px] max-h-0 overflow-hidden transition-all",
          isOpen && "max-h-[459px] overflow-y-auto"
        )}
      >
        <h1 className={"text-[16px] font-bold text-start"}>Nearby Museums</h1>
        <ScrollArea
          className={twMerge(
            "custom-scrollbar max-h-0 overflow-y-hidden transition-all",
            isOpen && "overflow-y-auto max-h-[423px]"
          )}
        >
          {filteredMuseums.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No results found
            </div>
          ) : (
            <div className={" space-y-[18px]"}>
              {filteredMuseums.map((museum, index) => (
                <div
                  key={index}
                  className={
                    "w-full relative h-[131px] border border-gray-200 rounded-[18px]"
                  }
                >
                  {museum?.business_status?.toString().toLocaleUpperCase() ===
                    "CLOSED_TEMPORARILY" && (
                    <div
                      className={
                        "absolute z-50 w-full h-full rounded-[18px] flex justify-center items-center backdrop-blur-sm text-gray-950 font-bold text-center"
                      }
                    >
                      Closed Temporarily
                    </div>
                  )}
                  <div
                    className={
                      "px-[16px] py-[15px] rounded-[18px] flex justify-start items-center gap-[14px]"
                    }
                  >
                    <img
                      className={"h-[99px] w-[99px] object-cover rounded-[8px]"}
                      src={
                        museum?.photos?.[0]?.getUrl() ||
                        "/place-holder-place-icon.png"
                      }
                      alt={`museum-icon`}
                    />
                    <div className={"space-y-[8px]"}>
                      <h1
                        className={
                          "text-start text-[16.66px] leading-[16.66px] font-bold"
                        }
                      >
                        {museum?.name}
                      </h1>
                      <div className={"space-y-[4px]"}>
                        <div
                          className={
                            "flex justify-start items-center gap-[4px]"
                          }
                        >
                          <h3
                            className={
                              "text-[11.11px] leading-[11.11px] text-gray-600 font-semibold"
                            }
                          >
                            {museum?.rating || 0}
                          </h3>
                          <StarScore score={museum?.rating || 0} sizes={"sm"} />
                          <p
                            className={
                              "text-[8.88px] leading-[8.88px] text-gray-500y-"
                            }
                          >
                            {`(${museum?.user_ratings_total || 0})`}
                          </p>
                        </div>
                        <div
                          className={
                            "flex justify-start items-center gap-[2px]"
                          }
                        >
                          <p
                            className={
                              "text-start text-[11.11px] leading-[11.11px] text-gray-600 capitalize"
                            }
                          >
                            {museum?.types?.[0] || "Museum"}
                          </p>
                          <Dot
                            size={12}
                            strokeWidth={2}
                            className={"text-gray-600"}
                          />
                        </div>
                      </div>
                      <div
                        className={"flex justify-start items-center gap-[7px]"}
                      >
                        <Button
                          onClick={() => {
                            const lat = museum?.geometry?.location?.lat();
                            const lng = museum?.geometry?.location?.lng();

                            if (lat !== undefined && lng !== undefined) {
                              setDestination({ lat, lng });
                              setMuseum(museum);
                            }
                          }}
                          type={"button"}
                          variant={"default"}
                          className={
                            "h-auto py-[5px] px-[33px] bg-[#0094FF] hover:bg-[#0094FF]/75 rounded-[14.5px] text-white"
                          }
                        >
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default SearchMuseums;
