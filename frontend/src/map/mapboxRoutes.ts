import axios from 'axios';

const token = import.meta.env.VITE_MAPBOX_API_TOKEN;

export const getRoutePolyline = async (
  from: [number, number],
  to: [number, number],
  mode: 'driving' | 'walking' | 'cycling'
): Promise<[number, number][]> => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${token}`;

  const res = await axios.get(url);
  if (!res.data.routes || !res.data.routes[0]) {
    return [];
  }

  return res.data.routes[0].geometry.coordinates;
};
