import SearchMuseums from "@/components/search-museums";
import { useState } from "react";

export interface Museums extends google.maps.places.PlaceResult {
  description?: string;
}

interface Props {
  angonoMuseums: Museums[];
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
