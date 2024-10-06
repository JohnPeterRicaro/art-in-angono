import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  heading: string;
  subheading: string;
}

const HeadingAndSubheading = ({
  className,
  heading = "",
  subheading = "",
}: Props) => {
  return (
    <section className={twMerge("w-full space-y-[24px]", className)}>
      <h1 className={"font-semibold text-[40px] leading-[40px]"}>{heading}</h1>
      <h3 className={"text-[15px] text-gray-600"}>{subheading}</h3>
    </section>
  );
};

export default HeadingAndSubheading;
