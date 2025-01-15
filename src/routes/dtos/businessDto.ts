export interface BusinessDto {
  name: string;
  latitude: number;
  longitude: number;
  type: "restaurant" | "coffee";
  distance: number;
}