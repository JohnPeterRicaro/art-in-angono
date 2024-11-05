import { MuseumWithDistanceAndEta } from "@/components/MapComponent";
import { SetStoreItem } from "@/types/StoreTypes";
import { create } from "zustand";

//This entire code basically saves the data that we've gathered on the current session we have.
//For example, if we run this app and we used suggestive system, we want to use the museums that
//the suggestive system has created on the entirety of the code.
//Instead of passing them as Props, we can pass the data as a store value using zustand store.
//Zustand store allows us to reuse the data gathered in all of our code.
//Meaning, we don't need to think about which component should be a child or not.
//We can just create component wherever we want.
//Redefining the flow of the app.

interface State {
  isLoading: boolean;
  refresh: () => any;
  hasLocations: boolean;
  suggestiveSystem: boolean;
  notifications: boolean;
  availableTime: number;
  museumsInRoute: MuseumWithDistanceAndEta[];
  museums: google.maps.places.PlaceResult[];
}

interface Actions {
  reset: () => any;
  setIsLoading: SetStoreItem<boolean>;
  setHasLocations: SetStoreItem<boolean>;
  setSuggestiveSystem: SetStoreItem<boolean>;
  setNotifications: SetStoreItem<boolean>;
  setAvailableTime: SetStoreItem<number>;
  setMuseums: SetStoreItem<google.maps.places.PlaceResult[]>;
  setMuseumsInRoute: SetStoreItem<MuseumWithDistanceAndEta[]>;
  setRefresh: (refresh: any) => void;
}

const initialState: State = {
  isLoading: false,
  hasLocations: false,
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
    setHasLocations: (hasLocations: boolean) =>
      set((state) => ({ ...state, hasLocations })),
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
