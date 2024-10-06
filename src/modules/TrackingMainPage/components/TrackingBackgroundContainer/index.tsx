import Image from "next/image";

const TrackingBackgroundContainer = () => {
  return (
    <>
      <div className={"z-[1] absolute w-full h-full bg-[#C11221]"}></div>
      <Image
        src={"bg-image.png"}
        alt="bg-image"
        className={"z-[1] absolute w-full h-full object-center opacity-25"}
      />
    </>
  );
};

export default TrackingBackgroundContainer;
