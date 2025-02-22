import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let lightbox = null; // Створюю змінну для SimpleLightbox

export function renderGallery(images) {
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = ""; // Очищаю попередні результати

  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="gallery-item">
          <a href="${largeImageURL}" class="gallery-link">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
          </a>
          <div class="image-info">
            <p><strong>Likes:</strong> ${likes}</p>
            <p><strong>Views:</strong> ${views}</p>
            <p><strong>Comments:</strong> ${comments}</p>
            <p><strong>Downloads:</strong> ${downloads}</p>
          </div>
        </div>`
    )
    .join("");

  gallery.innerHTML = markup;

  // Ініціалізація SimpleLightbox або оновлення
  if (!lightbox) {
    lightbox = new SimpleLightbox("#gallery a", {
      captionsData: "alt",
      captionDelay: 250,
    });
  } else {
    lightbox.refresh(); // Оновлюється після додавання нових зображень
  }
}