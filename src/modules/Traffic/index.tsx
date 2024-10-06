import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Traffic = () => {
  const router = useRouter();
  return (
    <ContentContainer>
      <DynamicContent
        image={"/icons/traffic-art.png"}
        imageFallback={"/icons/traffic-art.png"}
        heading={"Traffic?"}
        subheading={
          "The map currently displays in standard mode, and real-time traffic updates are not available at this time. Would you like to proceed with this setting?"
        }
      >
        <Button
          onClick={() => router.push("/tracking/location")}
          type={"button"}
          variant={"default"}
          className={
            " w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
          }
        >
          Proceed
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default Traffic;
