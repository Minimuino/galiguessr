export function clampLng(lng: number): number {
  return Math.min(Math.max(lng, -180.0), 180.0);
}

export function clampLat(lat: number): number {
  return Math.min(Math.max(lat, -90.0), 90.0);
}
