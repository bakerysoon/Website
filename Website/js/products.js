const shopProducts = [
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    availability: true,
    name: "Pandan Chiffon Cake 8'",
    price: 10,
    category: "cake",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/not_available.jpg",
    hoverImage: "assets/Image/not_available.jpg",
    availability: false,
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/not_available.jpg",
    hoverImage: "assets/Image/not_available.jpg",
    availability: false,
    name: "Almond Croissant",
    price: 4,
    category: "puff-pastries",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/not_available.jpg",
    hoverImage: "assets/Image/not_available.jpg",
    availability: false,
    name: "Sourdough Loaf",
    price: 8,
    category: "bread",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/not_available.jpg",
    hoverImage: "assets/Image/not_available.jpg",
    availability: false,
    name: "Traditional White Lotus Mooncake",
    price: 15,
    category: "mid-autumn",
    description: "Hello, this is a description"
  }
];

let activeCategory = "all";

function productId(product) {
  return `${product.category}-${product.name}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2).replace(/\.00$/, "")}`;
}

function isProductAvailable(product) {
  return product.availability !== false;
}

function getProductImage(product, type = "primary") {
  if (!isProductAvailable(product)) return "assets/Image/not_available.jpg";
  if (type === "hover") return product.hoverImage || product.image;
  return product.image;
}

function getVisibleProducts() {
  if (activeCategory === "all") return shopProducts;
  return shopProducts.filter((product) => product.category === activeCategory);
}

function renderShopProducts() {
  const grid = document.querySelector("#shop-product-grid");
  if (!grid) return;

  const filtered = getVisibleProducts();

  grid.innerHTML = filtered
    .map((product) => {
      const originalIndex = shopProducts.indexOf(product);
      return `
        <article
          class="shop-product-card product-modal-trigger${isProductAvailable(product) ? "" : " is-unavailable"}"
          data-product-index="${originalIndex}"
          role="button"
          tabindex="0"
          aria-label="View details for ${product.name}"
        >
          <div class="shop-product-image">
            <img
              class="shop-product-image-primary"
              src="${getProductImage(product)}"
              alt="${product.name}"
            >
            <img
              class="shop-product-image-hover"
              src="${getProductImage(product, "hover")}"
              alt=""
              aria-hidden="true"
            >
          </div>
          <div class="shop-product-info">
            <h3>${product.name}</h3>
            <p class="shop-product-price">${formatPrice(product.price)}</p>
            <button
              type="button"
              class="add-to-cart-btn${isProductAvailable(product) ? "" : " is-unavailable"}"
              data-product-index="${originalIndex}"
              aria-label="${isProductAvailable(product) ? `Add ${product.name} to cart` : `${product.name} is currently unavailable`}"
            >${isProductAvailable(product) ? "ADD TO CART" : "UNAVAILABLE"}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function openShopProduct(productIndex) {
  const product = shopProducts[Number(productIndex)];
  if (!product || !window.SoonBakeryProductModal) return;

  window.SoonBakeryProductModal.open({
    ...product,
    image: getProductImage(product),
    hoverImage: getProductImage(product, "hover"),
    id: productId(product)
  });
}

function setupCategoryFilters() {
  const categoryLinks = document.querySelectorAll(".category-link");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
      activeCategory = link.dataset.category || "all";

      categoryLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");

      renderShopProducts();
    });
  });
}

function setupProductModalTriggers() {
  const grid = document.querySelector("#shop-product-grid");
  if (!grid) return;

  grid.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart-btn");
    if (addButton) {
      event.stopPropagation();
      const product = shopProducts[Number(addButton.dataset.productIndex)];
      if (product && !isProductAvailable(product)) {
        window.SoonBakeryCart?.showMessage("Our apologies, this item is currently unavailable");
        return;
      }
      openShopProduct(addButton.dataset.productIndex);
      return;
    }

    const card = event.target.closest(".shop-product-card");
    if (!card) return;
    openShopProduct(card.dataset.productIndex);
  });

  grid.addEventListener("keydown", (event) => {
    if (event.target.closest(".add-to-cart-btn")) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".shop-product-card");
    if (!card) return;

    event.preventDefault();
    openShopProduct(card.dataset.productIndex);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShopProducts();
  setupCategoryFilters();
  setupProductModalTriggers();
});
