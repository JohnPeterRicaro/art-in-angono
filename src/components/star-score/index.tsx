import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type sizes = "xl" | "lg" | "md" | "sm";

interface Props {
  score?: number;
  sizes?: sizes;
}

const starSizes = {
  xl: { size: 24, stroke: 3 },
  lg: { size: 18, stroke: 3 },
  md: { size: 15, stroke: 2 },
  sm: { size: 12, stroke: 2 },
};

const getStarWidth = (normalizedScore: number, index: number) => {
  const scorePerStar = 20;
  const scoreThreshold = (index + 1) * scorePerStar;
  if (normalizedScore >= scoreThreshold) {
    return 100;
  } else if (normalizedScore >= scoreThreshold - scorePerStar) {
    const remainder = normalizedScore - index * scorePerStar;
    return (remainder / scorePerStar) * 100;
  }

  return 0;
};

const StarScore = ({ score = 5, sizes = "md" }: Props) => {
  const normalizedScore = (score / 5) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={"w-auto"}>
          <div className={"w-auto relative flex justify-center items-start"}>
            <div className={"flex justify-center items-start gap-[4px]"}>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="relative">
                  <Star
                    size={starSizes[sizes].size}
                    strokeWidth={starSizes[sizes].stroke}
                    className={"text-gray-300 fill-gray-300"}
                  />
                  <div
                    className="absolute top-0 left-0 h-full overflow-hidden"
                    style={{
                      width: `${getStarWidth(normalizedScore, index)}%`,
                    }}
                  >
                    <Star
                      size={starSizes[sizes].size}
                      strokeWidth={starSizes[sizes].stroke}
                      className={"text-dd-dark-yellow fill-dd-dark-yellow"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{`${score}`}/5 product score</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StarScore;
