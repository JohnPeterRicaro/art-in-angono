const TOUR_BUDGET = {
  1: "200-300",
  2: "300-400",
  3: "400-500",
  4: "500-600",
  5: "600-700",
  6: "700-800",
  7: "800-900",
  8: "900-1000",
  9: "1000-1100",
  10: "1100-1200",
  11: "1200-1300",
  12: "1300-1400",
};

const useGetBudget = (museums_count: number) => {
  return TOUR_BUDGET[museums_count as keyof typeof TOUR_BUDGET];
};

export default useGetBudget;
