import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { useRouter } from "next/navigation";

const SuggestiveSystem = () => {
  const { setSuggestiveSystem } = useTrackingContainerStore();
  const router = useRouter();

  const handleSuggestiveMapping = () => {
    setSuggestiveSystem(true);
    router.push("/tracking/input-time");
  };
  return (
    <ContentContainer>
      <DynamicContent
        heading={"Suggestive System"}
        subheading={
          "Would you like to use the Suggestive System or Manual Mapping?"
        }
        image={"/icons/suggestive-system-art.png"}
        imageFallback={"/icons/suggestive-system-art.png"}
      >
        <Button
          onClick={handleSuggestiveMapping}
          type={"button"}
          variant={"default"}
          className={
            " w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
          }
        >
          Suggestive Mapping
        </Button>
        <Button
          type={"button"}
          onClick={() => {
            setSuggestiveSystem(false);
            router.push("/tracking/map");
          }}
          variant={"outline"}
          className={
            "w-full h-auto py-[18px] text-[20px] font-semibold rounded-[33px]"
          }
        >
          Manual Mapping
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default SuggestiveSystem;
