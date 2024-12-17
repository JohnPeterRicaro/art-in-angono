import StarScore from "@/components/star-score";
import { Button } from "@/components/ui/button";
import useGetBudget from "@/hooks/useGetBudget";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { Museums } from "@/modules/ManualMapping";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Dot, Search, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  filteredMuseums: Museums[];
  startMultipleNavigation?: () => any;
}

const SearchMuseums = ({
  input,
  setInput,
  isOpen,
  filteredMuseums,
  startMultipleNavigation,
}: Props) => {
  const [museums, setMuseums] = useState<google.maps.places.PlaceResult[]>([]);
  const [expandedMuseum, setExpandedMuseum] = useState<string | null>(null);
  const { museumsInRoute, setMuseumsInRoute } = useTrackingContainerStore();

  const handleMuseumsToRoute = () => {
    const combinedMuseums = [...museumsInRoute, ...museums].filter(
      (museum, index, self) =>
        index ===
        self.findIndex(
          (m) =>
            m.geometry?.location?.lat() === museum.geometry?.location?.lat() &&
            m.geometry?.location?.lng() === museum.geometry?.location?.lng()
        )
    );

    setMuseumsInRoute(combinedMuseums);
  };

  const museumBugdet = useGetBudget(museumsInRoute?.length);

  const handleRemoveMuseum = (museum: google.maps.places.PlaceResult) => {
    setMuseums((prevMuseums) =>
      prevMuseums.filter((item) => item.place_id !== museum.place_id)
    );

    const updatedMuseumsInRoute = museumsInRoute.filter(
      (item) => item.place_id !== museum.place_id
    );

    setMuseumsInRoute(updatedMuseumsInRoute);
  };

  console.log(museumsInRoute);

  useEffect(() => {
    if (museums.length > 0) handleMuseumsToRoute();
  }, [museums]);

  return (
    <>
      {museumsInRoute.length > 0 && (
        <div
          className={
            "w-full flex flex-col justify-end items-end gap-1 text-[14px] leading-[14px]"
          }
        >
          <div className={"flex justify-end items-center gap-1"}>
            <h1 className={"text-gray-950 font-semibold"}>
              total museums in route:
            </h1>
            <p className={"text-gray-800 font-semibold"}>
              {museumsInRoute?.length}
            </p>
          </div>
          <div className={"flex justify-end items-center gap-1"}>
            <h1 className={"text-gray-950 font-semibold"}>total budget:</h1>
            <p className={"text-gray-800 font-semibold"}>₱ {museumBugdet}</p>
          </div>
          <p className={"text-[11.11px] leading-none text-gray-500 italic"}>
            The budget provided is an estimate and is subject to change.
          </p>
        </div>
      )}
      {museums.length > 0 && (
        <div className={"w-full h-auto space-y-3"}>
          <ScrollArea
            className={
              "space-y-3 max-h-[200px] w-full overflow-y-auto overflow-x-hidden custom-scrollbar"
            }
          >
            {museums.map((museum, index, array) => {
              const isLastIndex = index === array.length - 1;
              return (
                <div
                  key={index}
                  className={
                    "w-full flex flex-col justify-center items-center gap-2"
                  }
                >
                  <div
                    className={
                      "w-[70%] flex justify-between items-center border border-gray-100 shadow-sm rounded-3xl px-4 py-3"
                    }
                  >
                    <div className={"flex justify-start items-center gap-2"}>
                      <img
                        className={
                          "h-[40px] w-[40px] object-cover rounded-[8px]"
                        }
                        src={
                          museum?.photos?.[0]?.getUrl() ||
                          "/place-holder-place-icon.png"
                        }
                        alt={`museum-icon`}
                      />
                      <p
                        className={"text-[11.11px] leading-none text-gray-950"}
                      >
                        {`${museum.name}`}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRemoveMuseum(museum)}
                      type={"button"}
                      variant={"outlineDestructive"}
                      className={"p-[6px] h-auto "}
                    >
                      <Trash2Icon size={12} strokeWidth={2} />
                    </Button>
                  </div>
                  {!isLastIndex && (
                    <div
                      className={
                        "w-full h-auto flex flex-col justify-center items-center gap-2"
                      }
                    >
                      <div
                        className={"w-[8px] h-[8px] rounded-full bg-gray-300"}
                      ></div>
                      <div
                        className={"w-[8px] h-[8px] rounded-full bg-gray-300"}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollArea>
          <Button
            disabled={museumsInRoute.length < 3 || museumsInRoute.length === 12}
            type={"button"}
            onClick={() => {
              startMultipleNavigation?.();
              setMuseums([]);
            }}
            className="h-auto py-[5px] px-[33px] bg-[#0094FF] hover:bg-[#0094FF]/75 rounded-[14.5px] text-white"
          >
            {museumsInRoute.length === 12
              ? "Maximum of 12 museums"
              : museumsInRoute.length < 3
              ? "Minimum of 3 Museums"
              : museumsInRoute.length >= 3
              ? "Add to Navigation"
              : "Start Navigation"}
          </Button>
        </div>
      )}
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
            isOpen && "overflow-y-auto max-h-[423px]",
            museums.length > 0 && "max-h-[300px]"
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
                    "w-full relative h-auto border border-gray-200 rounded-[18px]"
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
                      "px-[16px] py-[15px] rounded-[18px] flex flex-col justify-start items-stretch gap-[14px]"
                    }
                  >
                    <div className="flex justify-start items-center gap-[14px]">
                      <img
                        className={
                          "h-[99px] w-[99px] object-cover rounded-[8px]"
                        }
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
                            <StarScore
                              score={museum?.rating || 0}
                              sizes={"sm"}
                            />
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
                          className={
                            "flex justify-start items-center gap-[7px]"
                          }
                        >
                          <Button
                            disabled={museumsInRoute.some(
                              (m) =>
                                m.geometry?.location?.lat() ===
                                  museum.geometry?.location?.lat() &&
                                m.geometry?.location?.lng() ===
                                  museum.geometry?.location?.lng()
                            )}
                            onClick={() => {
                              setMuseums((prev) => {
                                if (
                                  prev.some(
                                    (_museum) =>
                                      _museum.place_id === museum.place_id
                                  ) ||
                                  museumsInRoute.some(
                                    (_museum) =>
                                      _museum.place_id === museum.place_id
                                  )
                                ) {
                                  return prev;
                                }
                                return [...prev, museum];
                              });
                            }}
                            type={"button"}
                            variant={"default"}
                            className={
                              "h-auto py-[5px] px-[33px] bg-[#0094FF] hover:bg-[#0094FF]/75 rounded-[14.5px] text-white"
                            }
                          >
                            Add Museum
                          </Button>
                        </div>
                      </div>
                    </div>
                    {museum?.description && (
                      <div className="w-full">
                        <Button
                          onClick={() =>
                            setExpandedMuseum(
                              expandedMuseum === museum.place_id &&
                                museum.place_id
                                ? null
                                : museum.place_id || null
                            )
                          }
                          type="button"
                          variant="ghost"
                          className="w-full flex justify-between items-center py-2 text-gray-600 hover:text-gray-900"
                        >
                          <span className="text-sm font-medium">
                            View Description
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedMuseum === museum.place_id
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </Button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedMuseum === museum.place_id
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="px-4 py-3 text-sm text-gray-600 bg-gray-50 rounded-lg mt-2">
                            {museum.description}
                          </p>
                        </div>
                      </div>
                    )}
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
