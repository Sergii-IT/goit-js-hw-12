import axios from "axios";

const API_KEY = "48862394-3b6e651acc095b3f3f471775f";
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
      },
    });

    return response.data.hits; // Повертаю масив знайдених зображень
  } catch (error) {
    console.error("Помилка при отриманні зображень:", error);
    throw error;
  }
}