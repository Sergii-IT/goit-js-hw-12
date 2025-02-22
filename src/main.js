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
  resetOnHover: true, // Не закривати повідомлення при наведенні
});

// отримання зображень із завантажувачем
async function fetchImagesWithLoader(query, page) {
  iziToast.info({
    title: "Info",
    message: "Loading...",
    position: "topRight",
    timeout: false, // Повідомлення не зникає автоматично
  });

  loader.classList.remove("hidden"); // Показую анімований спінер

  try {
    const { images, totalHits } = await fetchImages(query, page, perPage);
    return { images, totalHits };
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

  searchQuery = form.searchQuery.value.trim();
  if (!searchQuery)if (!query) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search term",
      position: "topRight",
    });
    return;
  }
  currentPage = 1;
  gallery.innerHTML = "";
  loadMoreBtn.classList.add("hidden");

  try {
    const { images, totalHits } = await fetchImagesWithLoader(searchQuery, currentPage);
    if (!images || images.length === 0) {
      iziToast.error({
        title: "Error",
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    // gallery.innerHTML = ""; // Очищення перед новим запитом
    renderGallery(images);
    lightbox.refresh(); // Оновлення SimpleLightbox після рендеру
    
    smoothScroll();

    if (currentPage * perPage >= totalHits) {
      iziToast.info({
        title: "Info",
        message: "You've reached the end of search results.",
        position: "topRight",
      });
      loadMoreBtn.classList.add("hidden");
    } else {
      loadMoreBtn.classList.remove("hidden"); // Показуємо кнопку
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  }
});

// Обробник кнопки "Load more"
loadMoreBtn.addEventListener("click", async () => {
  currentPage++;

  try {
    const { images, totalHits } = await fetchImagesWithLoader(searchQuery, currentPage);

    if (!images || images.length === 0) {
      iziToast.info({
        title: "Info",
        message: "You've reached the end of search results.",
        position: "topRight",
      });
      loadMoreBtn.classList.add("hidden");
      return;
    }

    renderGallery(images);
    lightbox.refresh();
    
    smoothScroll();

    if (currentPage * perPage >= totalHits) {
      iziToast.info({
        title: "Info",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
      loadMoreBtn.classList.add("hidden");
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  }
});

// Функція для плавного прокручування сторінки
function smoothScroll() {
  const cardHeight = document.querySelector(".gallery-item").getBoundingClientRect().height;
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
