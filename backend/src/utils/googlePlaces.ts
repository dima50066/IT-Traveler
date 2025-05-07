import { env } from "./env";

const GOOGLE_API_KEY = env("GOOGLE_API_KEY");
const NEARBY_SEARCH_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const FIND_PLACE_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";
const PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/divyszzpf/image/upload/v1746613574/IT-Traveler/muc7d3j59xur3mprjbvp.png";

export const getPlacePhotoByCoordinates = async (
  lat: number,
  lng: number,
  placeName?: string
): Promise<string> => {
  try {
    console.log("[PHOTO] Starting image lookup for:", { lat, lng, placeName });

    let nameToUse = placeName;

    if (!nameToUse) {
      const nearbySearchUrl = `${NEARBY_SEARCH_URL}?location=${lat},${lng}&radius=100&rankby=prominence&type=tourist_attraction&key=${GOOGLE_API_KEY}`;
      console.log("[PHOTO] Nearby Search URL:", nearbySearchUrl);

      const nearbyRes = await fetch(nearbySearchUrl);
      const nearbyData = await nearbyRes.json();
      console.log("[PHOTO] Nearby Search response:", nearbyData);

      const firstPlace = nearbyData.results?.[0];
      nameToUse = firstPlace?.name;
      if (!nameToUse) {
        console.warn("[PHOTO] No nearby tourist attraction found.");
        return DEFAULT_IMAGE_URL;
      }

      console.log("[PHOTO] Found nearby place name:", nameToUse);
    }

    const findPlaceUrl = `${FIND_PLACE_URL}?input=${encodeURIComponent(
      nameToUse
    )}&inputtype=textquery&locationbias=point:${lat},${lng}&key=${GOOGLE_API_KEY}`;
    console.log("[PHOTO] Google FindPlaceFromText URL:", findPlaceUrl);

    const findPlaceRes = await fetch(findPlaceUrl);
    const findPlaceData = await findPlaceRes.json();
    console.log("[PHOTO] Google FindPlace response:", findPlaceData);

    const placeId = findPlaceData?.candidates?.[0]?.place_id;
    if (!placeId) {
      console.warn("[PHOTO] No place_id found.");
      return DEFAULT_IMAGE_URL;
    }
    console.log("[PHOTO] Found place_id:", placeId);

    const detailsUrl = `${PLACE_DETAILS_URL}?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    console.log("[PHOTO] Place Details response:", detailsData);

    const photoRef = detailsData?.result?.photos?.[0]?.photo_reference;
    if (!photoRef) {
      console.warn("[PHOTO] No photo reference found.");
      return DEFAULT_IMAGE_URL;
    }

    const photoUrl = `${PHOTO_URL}?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
    console.log("[PHOTO] Final photo URL:", photoUrl);

    return photoUrl;
  } catch (err) {
    console.error("[PHOTO] Failed to fetch photo:", err);
    return DEFAULT_IMAGE_URL;
  }
};
