/*
JUKIE: aquí se administran las categorías y los productos.
Para añadir contenido, modifica las listas categories y products.
*/

const categories = [
  { name: "Sala de estar", icon: "🛋️", color: "#FFF0E8" },
  { name: "Dormitorio", icon: "🛏️", color: "#FFF3A6" },
  { name: "Comedor", icon: "🪑", color: "#E4EBFF" },
  { name: "Cocina", icon: "🍽️", color: "#F7F3EA" },
  { name: "Baño", icon: "🪞", color: "#FFE4DD" },
  { name: "Iluminación", icon: "💡", color: "#E7EDFF" },
  { name: "Decoración", icon: "🏺", color: "#FFF0D9" },
  { name: "Exterior", icon: "🪴", color: "#FCE2DF" }
];

/*
Cada producto contiene:
id: número único
name: nombre visible
store: nombre de la tienda
price: precio orientativo (actualízalo al verificar el producto)
country: usa o rd
category: debe coincidir exactamente con una categoría
image: ruta de la foto dentro de la carpeta imagenes/
colors: lista de colores con nombre y código hexadecimal
description: descripción corta
url: enlace DIRECTO a la página oficial del producto
*/
const products = [
  {
    id: 1,
    name: "Mueble de TV",
    store: "IKEA",
    price: "RD$9,495",
    country: "RD AND USA",
    category: "Sala de estar",
    image: "FOTOS PAGINA WEB/MUEBLE XBOX.webp",
    colors: [{ name: "Blanco", hex: "#ffffff" }, { name: "Negro", hex: "#000000" }, { name: "Crema", hex: "#F5F0E7" }],
    description: "Mueble de TV gaming+ruedas, blanco.",
    url: "https://www.ikea.com.do/es/pd/yxstaby-mueble-de-tv-gaming-ruedas-blanco-art-70638898"
  },
  {
    id: 2,
    name: "Mueble de pasillo",
    store: "IKEA",
    price: "RD$5,460",
    country: "RD AND USA",
    category: "Sala de estar",
    image: "FOTOS PAGINA WEB/mueble de pasillo azul.webp",
    colors: [{ name: "Azul", hex: "#2bb1ff" }, { name: "Gris", hex: "#909090" }, { name: "Verde", hex: "#B6C49A" }],
    description: "Mueble de pasillo, juego de 8, gris",
    url: "https://www.ikea.com.do/es/pd/grejig-mueble-de-pasillo-juego-de-8-gris-spr-59618000"
  },
  {
    id: 3,
    name: "Mueble para pasillos",
    store: "IKEA",
    price: "RD$2,975",
    country: "RD AND USA",
    category: "Sala de estar",
    image: "FOTOS PAGINA WEB/1500546_PE1007014_S4.webp",
    colors: [{ name: "Azul", hex: "#2bb1ff" }, { name: "Gris", hex: "#909090" }, { name: "Verde", hex: "#B6C49A" }],
    url: "https://www.ikea.com.do/es/pd/grejig-muebles-para-pasillos-juego-de-5-gris-spr-19618002"
  },
  {
  id: 4,
  name: "Lampara esferica",
  store: "IKEA",
  price: "RD$2,590",
  country: "RD, USA",
  category: "Iluminación",
  image: "/Users/inanyelie/Desktop/FOTOS PAGINA WEB/Lampara Esferica.jpg",
  colors: [ ],
  description: "Lámpara mesa+bombilla, inteligente color y espectro blanco.",
  url: "https://www.ikea.com.do/es/pd/fado-kajplats-lampara-mesa-bombilla-color-y-espectro-blanco-spr-29654971"
}
];

let activeCategory = "all";
let activeOrigin = "all";
let selectedColorByProduct = {};

const $ = (selector) => document.querySelector(selector);

function renderCategories() {
  $("#categoryGrid").innerHTML = categories.map((category) => `
    <button class="category-card" type="button" data-category="${escapeHTML(category.name)}">
      <span class="category-art" style="--cat-bg:${category.color}">${category.icon}</span>
      <span class="category-name">${escapeHTML(category.name)} →</span>
    </button>
  `).join("");
}

function getVisibleProducts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesOrigin = activeOrigin === "all" || product.country === activeOrigin;
    const searchable = `${product.name} ${product.store} ${product.category} ${product.country}`.toLowerCase();
    return matchesCategory && matchesOrigin && searchable.includes(query);
  });
}

function renderProducts() {
  const visible = getVisibleProducts();
  if (!visible.length) {
    $("#productGrid").innerHTML = '<div class="empty">No encontramos productos con esos filtros.</div>';
    return;
  }

  $("#productGrid").innerHTML = visible.map((product) => {
    const selected = selectedColorByProduct[product.id] ?? 0;
    return `
      <article class="product-card">
        <button class="product-photo" type="button" data-open="${product.id}" aria-label="Ver ${escapeHTML(product.name)}">
          <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x600/F7F3EA/25241F?text=Agrega+tu+foto';">
        </button>
        <div class="product-info">
          <span class="store-tag">${escapeHTML(product.store)}</span>
          <h3 class="product-name">${escapeHTML(product.name)}</h3>
          <div class="product-meta">
            <span class="price">${escapeHTML(product.price)}</span>
            <span class="origin">${product.country === "usa" ? "USA · courier" : "Rep. Dominicana"}</span>
          </div>
          <div class="swatches" aria-label="Colores de ${escapeHTML(product.name)}">
            ${product.colors.map((color, index) => `
              <button class="swatch ${selected === index ? "selected" : ""}" type="button"
                style="background:${color.hex}" title="${escapeHTML(color.name)}"
                aria-label="${escapeHTML(color.name)}" data-color="${product.id}:${index}"></button>
            `).join("")}
          </div>
          <button class="product-link" type="button" data-open="${product.id}">Ver producto →</button>
        </div>
      </article>
    `;
  }).join("");
}

function openProduct(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;
  const selectedIndex = selectedColorByProduct[product.id] ?? 0;
  $("#dialogImage").src = product.image;
  $("#dialogImage").alt = product.name;
  $("#dialogStore").textContent = product.store;
  $("#dialogName").textContent = product.name;
  $("#dialogDescription").textContent = product.description;
  $("#dialogPrice").textContent = product.price;
  $("#dialogShipping").textContent = product.country === "usa"
    ? "Producto de Estados Unidos: confirma que la tienda envíe a tu courier antes de comprar."
    : "Producto listado para compra en República Dominicana.";
  $("#dialogColors").innerHTML = product.colors.map((color, index) => `
    <button type="button" class="${selectedIndex === index ? "selected" : ""}"
      style="background:${color.hex}" title="${escapeHTML(color.name)}"
      aria-label="${escapeHTML(color.name)}" data-dialog-color="${product.id}:${index}"></button>
  `).join("");
  $("#buyButton").href = product.url;
  $("#productDialog").showModal();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function setOrigin(origin) {
  activeOrigin = origin;
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === origin);
  });
  renderProducts();
}

renderCategories();
renderProducts();

$("#categoryGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

const categoryName = button.textContent.trim();
$("#productsTitle").textContent = activeCategory === "all"
  ? "Productos destacados"
  : categoryName; 

   renderProducts();
  $("#productos").scrollIntoView({ behavior: "smooth" });
});

$("#productGrid").addEventListener("click", (event) => {
  const colorButton = event.target.closest("[data-color]");
  if (colorButton) {
    const [id, index] = colorButton.dataset.color.split(":").map(Number);
    selectedColorByProduct[id] = index;
    renderProducts();
    return;
  }
  const openButton = event.target.closest("[data-open]");
  if (openButton) openProduct(openButton.dataset.open);
});

$("#filterRow").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (button) setOrigin(button.dataset.filter);
});

document.querySelectorAll("[data-origin-link]").forEach((link) => {
  link.addEventListener("click", () => setOrigin(link.dataset.originLink));
});

$("#searchInput").addEventListener("input", renderProducts);

$("#resetFilters").addEventListener("click", () => {
  activeCategory = "all";
  setOrigin("all");
  $("#searchInput").value = "";
  renderProducts();
});

$("#closeDialog").addEventListener("click", () => $("#productDialog").close());

$("#productDialog").addEventListener("click", (event) => {
  if (event.target === $("#productDialog")) $("#productDialog").close();
});

$("#dialogColors").addEventListener("click", (event) => {
  const button = event.target.closest("[data-dialog-color]");
  if (!button) return;
  const [id, index] = button.dataset.dialogColor.split(":").map(Number);
  selectedColorByProduct[id] = index;
  openProduct(id);
});
