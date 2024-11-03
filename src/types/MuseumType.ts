export interface MuseumType {
  business_satatus: string;
  geometry: {
    location: {
      lat: any;
      lng: any;
    };
    viewport: {
      Gh: {
        hi: number;
        lo: number;
      };
      ei: {
        hi: number;
        lo: number;
      };
    };
  };
  html_attributions: any[];
  icon: string;
  icon_background_color: string;
  icon_mask_base_url: string;
  name: string;
  opening_hours: {
    isOpen: () => void;
    open_now: boolean;
  };
  photos: {
    getURl: () => void;
    height: number;
    html_attributions: string[];
    width: number;
  }[];
  place_id: string;
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
}
