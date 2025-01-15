export interface BusinessDto {
  name: string;
  latitude: number;
  longitude: number;
  // TODO: we should use enum
  type: "restaurant" | "coffee";
  distance: number;
}