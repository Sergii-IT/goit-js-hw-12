import axios from "axios";

const API_KEY = "48862394-3b6e651acc095b3f3f471775f";
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query, page = 1, perPage = 40) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: perPage, // Ось тут виправлено!
      },
    });

    return {
      images: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    console.error("Помилка при отриманні зображень:", error);
    throw error;
  }
}