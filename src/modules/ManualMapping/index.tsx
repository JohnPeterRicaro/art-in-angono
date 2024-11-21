import SearchMuseums from "@/components/search-museums";
import { useState } from "react";

interface Props {
  angonoMuseums: google.maps.places.PlaceResult[];
  isOpen: boolean;
  startMultipleNavigation: () => any;
}

const ManualMapping = ({
  angonoMuseums,
  isOpen,
  startMultipleNavigation,
}: Props) => {
  const [input, setInput] = useState<string>("");

  const filteredMuseums = angonoMuseums?.filter((museum) =>
    museum?.name?.toLocaleLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      <SearchMuseums
        startMultipleNavigation={startMultipleNavigation}
        isOpen={isOpen}
        input={input}
        setInput={setInput}
        filteredMuseums={filteredMuseums}
      />
    </>
  );
};

export default ManualMapping;
