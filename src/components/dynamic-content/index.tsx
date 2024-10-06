import Header from "@/components/header";
import HeadingAndSubheading from "@/components/heading-subheading";
import ImageWithFallback from "@/components/imagewithfallback";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface Props {
  size?: number;
  smallSize?: number;
  image: string;
  imageFallback: string;
  children?: ReactNode;
  heading: string;
  subheading: string;
  detailsComponent?: ReactNode;
}

const DynamicContent = ({
  size,
  smallSize,
  image,
  imageFallback,
  children,
  heading = "",
  subheading = "",
  detailsComponent,
}: Props) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const width = useMemo(() => {
    if (windowWidth < 400) return smallSize || 150;
    return size || 259;
  }, [windowWidth, smallSize, size]);

  const ImageAndDetails = useMemo(() => {
    if (detailsComponent)
      return (
        <div
          className={
            "w-full flex flex-col justify-center items-center gap-[40px]"
          }
        >
          {detailsComponent}
          <div className={" w-full h-auto flex justify-center items-center"}>
            <ImageWithFallback
              src={image ? image : "/icons/cellphone-art.png"}
              alt={imageFallback ? imageFallback : "/icons/cellphone-art.png"}
              width={width}
              height={width}
              fallbackImage={
                imageFallback ? imageFallback : "/icons/cellphone-art.png"
              }
            />
          </div>
        </div>
      );

    return (
      <div className={" w-full h-auto flex justify-center items-center"}>
        <ImageWithFallback
          src={image ? image : "/icons/cellphone-art.png"}
          alt={imageFallback ? imageFallback : "/icons/cellphone-art.png"}
          width={width}
          height={width}
          fallbackImage={
            imageFallback ? imageFallback : "/icons/cellphone-art.png"
          }
        />
      </div>
    );
  }, [detailsComponent, imageFallback, image, width]);

  return (
    <section
      className={
        "p-[24px] relative h-full w-full flex flex-col justify-between items-center"
      }
    >
      <Header
        image="/art-in-angono-header-logo.png"
        fallBackImage="/art-in-angono-header-logo.png"
        width={252}
        height={38}
        className={"pb-0"}
      />
      <HeadingAndSubheading heading={heading} subheading={subheading} />
      {ImageAndDetails}
      <div className={" w-full space-y-[17px]"}>{children}</div>
    </section>
  );
};

export default DynamicContent;
