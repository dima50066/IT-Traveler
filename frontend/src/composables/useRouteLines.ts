import type { Map as MapboxMapInstance } from 'mapbox-gl';
import type { Point } from '../types';
import { generateLineId } from '../map/mapUtils';
import type { Feature, LineString } from 'geojson';
import { getRoutePolyline } from '../map/mapboxRoutes';

let lineIds: string[] = [];

export const useRouteLines = () => {
  const getLineColor = (mode: string) => {
    switch (mode) {
      case 'plane':
        return '#00bcd4';
      case 'car':
        return '#4caf50';
      case 'walk':
        return '#ff9800';
      case 'bike':
        return '#9c27b0';
      default:
        return '#607d8b';
    }
  };

  const drawLines = async (map: MapboxMapInstance, points: Point[]) => {
    if (!map || points.length < 2) return;

    removeLines(map);

    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i];
      const to = points[i + 1];
      const id = generateLineId(from._id, to._id);
      const color = getLineColor(from.transportMode || 'default');

      let coordinates: [number, number][];

      const mode = to.transportMode ?? 'default';

      try {
        if (mode === 'plane') {
          coordinates = [
            [from.coordinates.lng, from.coordinates.lat],
            [to.coordinates.lng, to.coordinates.lat]
          ];
        } else {
          const profile =
            mode === 'car'
              ? 'driving'
              : mode === 'bike'
                ? 'cycling'
                : mode === 'walk'
                  ? 'walking'
                  : null;

          if (profile) {
            coordinates = await getRoutePolyline(
              [from.coordinates.lng, from.coordinates.lat],
              [to.coordinates.lng, to.coordinates.lat],
              profile
            );
          } else {
            coordinates = [
              [from.coordinates.lng, from.coordinates.lat],
              [to.coordinates.lng, to.coordinates.lat]
            ];
          }
        }
      } catch (err) {
        console.error(err);
        coordinates = [
          [from.coordinates.lng, from.coordinates.lat],
          [to.coordinates.lng, to.coordinates.lat]
        ];
      }

      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);

      const geojson: Feature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates
        },
        properties: {}
      };

      map.addSource(id, {
        type: 'geojson',
        data: geojson
      });

      map.addLayer({
        id,
        type: 'line',
        source: id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-opacity': 0.7
        }
      });

      lineIds.push(id);
    }
  };

  const removeLines = (map: MapboxMapInstance) => {
    for (const id of lineIds) {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
    }
    lineIds = [];
  };

  return { drawLines, removeLines };
};
