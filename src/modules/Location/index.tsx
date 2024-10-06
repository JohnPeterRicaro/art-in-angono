import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Location = () => {
  const router = useRouter();

  return (
    <ContentContainer>
      <DynamicContent
        heading={"Allow location access"}
        subheading={
          "This lets show you which museums in Rizal are currently near you"
        }
        image={"/icons/location-art.png"}
        imageFallback={"/icons/location-art.png"}
        children={
          <>
            <Button
              onClick={() => router.push("/tracking/suggestive-system")}
              type={"button"}
              variant={"default"}
              className={
                " w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
              }
            >
              Yes
            </Button>
            <Button
              type={"button"}
              onClick={() => router.push("/tracking")}
              variant={"outline"}
              className={
                "w-full h-auto py-[18px] text-[20px] font-semibold rounded-[33px]"
              }
            >
              No, thanks
            </Button>
          </>
        }
      />
    </ContentContainer>
  );
};

export default Location;
