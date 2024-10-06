import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
}

const ContentContainer = ({ children, className }: Props) => {
  return (
    <section
      className={cn("relative mx-auto max-w-[500px] w-full h-full", className)}
    >
      {children}
    </section>
  );
};

export default ContentContainer;
