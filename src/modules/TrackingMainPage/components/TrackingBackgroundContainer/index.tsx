import Image from "next/image";

const TrackingBackgroundContainer = () => {
  return (
    <>
      <div className={"z-[1] absolute w-full h-full bg-[#C11221]"}></div>
      <div className={"z-[1] absolute w-full h-full"}>
        <Image
          src={"/bg-image.png"}
          alt="bg-image"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className={"opacity-25"}
        />
      </div>
    </>
  );
};

export default TrackingBackgroundContainer;
