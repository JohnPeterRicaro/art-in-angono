import { MuseumWithDistanceAndEta } from "@/components/MapComponent";
import { SetStoreItem } from "@/types/StoreTypes";
import { create } from "zustand";

interface State {
  isLoading: boolean;
  refresh: () => any;
  suggestiveSystem: boolean;
  notifications: boolean;
  availableTime: number;
  museumsInRoute: MuseumWithDistanceAndEta[];
  museums: google.maps.places.PlaceResult[];
}

interface Actions {
  reset: () => any;
  setIsLoading: SetStoreItem<boolean>;
  setSuggestiveSystem: SetStoreItem<boolean>;
  setNotifications: SetStoreItem<boolean>;
  setAvailableTime: SetStoreItem<number>;
  setMuseums: SetStoreItem<google.maps.places.PlaceResult[]>;
  setMuseumsInRoute: SetStoreItem<MuseumWithDistanceAndEta[]>;
  setRefresh: (refresh: any) => void;
}

const initialState: State = {
  isLoading: false,
  museums: [],
  museumsInRoute: [],
  suggestiveSystem: false,
  notifications: false,
  availableTime: 1,
  refresh: () => {},
};

const useTrackingContainerStore = create<State & Actions>((set) => {
  return {
    ...initialState,
    reset: () => set(() => ({ ...initialState })),
    setIsLoading: (isLoading: boolean) =>
      set((state) => ({ ...state, isLoading })),
    setSuggestiveSystem: (suggestiveSystem) =>
      set((state) => ({ ...state, suggestiveSystem })),
    setNotifications: (notifications) =>
      set((state) => ({ ...state, notifications })),
    setAvailableTime: (availableTime) =>
      set((state) => ({ ...state, availableTime })),
    setMuseums: (museums) => set((state) => ({ ...state, museums })),
    setMuseumsInRoute: (museumsInRoute) =>
      set((state) => ({ ...state, museumsInRoute })),
    setRefresh: (refresh: any) => set((state) => ({ ...state, refresh })),
  };
});

export default useTrackingContainerStore;
