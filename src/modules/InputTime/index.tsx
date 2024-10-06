import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const InputTime = () => {
  const router = useRouter();
  return (
    <ContentContainer>
      <DynamicContent
        size={199}
        smallSize={125}
        image={"/icons/clock-art.png"}
        imageFallback={"/icons/clock-art.png"}
        heading={"Input Available Time"}
        subheading={"Input Your Available Time (Max: 9 Hours)"}
        detailsComponent={
          <div
            className={
              "w-full px-[24px] py-[22px] bg-[#D9D9D9] flex justify-center items-center"
            }
          >
            1 Hour
          </div>
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
          Confirm
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default InputTime;
