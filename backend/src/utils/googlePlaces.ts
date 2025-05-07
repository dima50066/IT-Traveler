const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const FIND_PLACE_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";
const PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/divyszzpf/image/upload/v1746613574/IT-Traveler/muc7d3j59xur3mprjbvp.png";

export const getPlacePhotoByCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const geocodeRes = await fetch(
      `${GEOCODE_URL}?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const geocodeData = await geocodeRes.json();
    const placeName = geocodeData.results?.[0]?.formatted_address;
    if (!placeName) return DEFAULT_IMAGE_URL;

    const findPlaceRes = await fetch(
      `${FIND_PLACE_URL}?input=${encodeURIComponent(
        placeName
      )}&inputtype=textquery&locationbias=point:${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const findPlaceData = await findPlaceRes.json();
    const placeId = findPlaceData?.candidates?.[0]?.place_id;
    if (!placeId) return DEFAULT_IMAGE_URL;

    const detailsRes = await fetch(
      `${PLACE_DETAILS_URL}?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`
    );
    const detailsData = await detailsRes.json();
    const photoRef = detailsData?.result?.photos?.[0]?.photo_reference;
    if (!photoRef) return DEFAULT_IMAGE_URL;

    const photoUrl = `${PHOTO_URL}?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
    return photoUrl;
  } catch (err) {
    console.error("[GOOGLE_PLACES] Failed to get accurate photo:", err);
    return DEFAULT_IMAGE_URL;
  }
};
