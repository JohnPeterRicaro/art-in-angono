import { useState, useEffect } from "react";
import Image from "next/image";

import type { FC, SyntheticEvent } from "react";
import type { ImageProps } from "next/image";

export interface ImageWithFallbackProps extends ImageProps {
  fallbackImage?: string;
}

const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  fallbackImage = "",
  src,
  ...props
}) => {
  const [error, setError] = useState<SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  const getImageSrc = () => (error ? fallbackImage : src);

  useEffect(() => {
    setError(null);
  }, [src]);

  return <Image onError={setError} src={getImageSrc()} {...props} />;
};

export default ImageWithFallback;
