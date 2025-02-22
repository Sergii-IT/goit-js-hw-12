import { fetchImages } from "./js/pixabay-api";
import { renderGallery } from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector("#gallery");
const loader = document.querySelector("#loader");

let lightbox = new SimpleLightbox(".gallery a");

// Налаштування iziToast
iziToast.settings({
  resetOnHover: true, // Не закривати повідомлення при наведенні
});

// отримання зображень із завантажувачем
async function fetchImagesWithLoader(query) {
  iziToast.info({
    title: "Info",
    message: "Loading...",
    position: "topRight",
    timeout: false, // Повідомлення не зникає автоматично
  });

  loader.classList.remove("hidden"); // Показую анімований спінер

  try {
    return await fetchImages(query);
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  } finally {
    loader.classList.add("hidden"); // Ховаю спінер після завантаження
    iziToast.destroy(); // Видаляємо всі iziToast повідомлення
  }
}

// Обробник форми
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = form.searchQuery.value.trim();
  if (!query) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search term",
      position: "topRight",
    });
    return;
  }

  try {
    const images = await fetchImagesWithLoader(query);

    if (!images || images.length === 0) {
      iziToast.error({
        title: "Error",
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    gallery.innerHTML = ""; // Очищення перед новим запитом
    renderGallery(images);
    lightbox.refresh(); // Оновлення SimpleLightbox після рендеру
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  }
});
