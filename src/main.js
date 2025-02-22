import { fetchImages } from "./js/pixabay-api";
import { renderGallery } from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector("#gallery");
const loader = document.querySelector("#loader");
const loadMoreBtn = document.querySelector("#load-more");

let lightbox = new SimpleLightbox(".gallery a");
let currentPage = 1;
let searchQuery = "";
const perPage = 40;

// Налаштування iziToast
iziToast.settings({
  resetOnHover: true,
});

// отримання зображень із завантажувачем
async function fetchImagesWithLoader(query, page = 1) {
  if (page === 1) {
    iziToast.info({
      title: "Info",
      message: "Loading...",
      position: "topRight",
      timeout: false,
    });
  }

  loader.classList.remove("hidden");

  try {
    return await fetchImages(query, page, perPage);
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  } finally {
    loader.classList.add("hidden");
    iziToast.destroy();
  }
}

// Обробник форми (пошук)
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

  searchQuery = query;
  currentPage = 1;
  gallery.innerHTML = "";
  loadMoreBtn.classList.add("hidden");

  try {
    const { images, totalHits } = await fetchImagesWithLoader(searchQuery, currentPage);

    if (!images || images.length === 0) {
      iziToast.error({
        title: "Error",
        message: "Sorry, there are no images matching your search query.",
        position: "topRight",
      });
      return;
    }

    renderGallery(images, false); // <--- Очищаємо галерею перед рендером нових фото
    lightbox.refresh();

    if (images.length > 0 && images.length === perPage) {
      loadMoreBtn.classList.remove("hidden");
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  }
});

// Обробник кнопки Load more (довантаження)
loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1;
  try {
    const { images } = await fetchImagesWithLoader(searchQuery, currentPage);

    if (!images || images.length === 0) {
      iziToast.error({
        title: "Error",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
      loadMoreBtn.classList.add("hidden");
      return;
    }

    renderGallery(images, true); // <--- Додаємо нові зображення до вже існуючих!
    lightbox.refresh();
    smoothScroll();
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  }
});