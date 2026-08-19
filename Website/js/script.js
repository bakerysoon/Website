const products = [
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies",
    description: "Hello, this is a description"
  }
];

function bestSellerProductId(product) {
  return `best-seller-${product.category}-${product.name}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2).replace(/\.00$/, "")}`;
}

const whyUsCards = [
  {
    icon: "assets/Image/leaf-icon.svg",
    iconAlt: "Leaf icon",
    title: "100% Natural",
    description:
      "We use only premium, natural ingredients for the best taste."
  },
  {
    icon: "assets/Image/mixing-bowl-icon.svg",
    iconAlt: "Mixing bowl icon",
    title: "Freshly Handmade",
    description:
      "Every product is baked fresh with care and handmade to order."
  },
  {
    icon: "assets/Image/recipe-book-icon.svg",
    iconAlt: "Recipe book icon",
    title: "Traditional Recipes",
    description:
      "Our recipes are passed down through generations for that timeless flavour."
  }
];

function renderProducts() {
  const productGrid = document.querySelector("#product-grid");
  if (!productGrid) return;

  productGrid.innerHTML = products
    .map(
      (product, index) => `
        <article
          class="shop-product-card product-modal-trigger"
          data-product-index="${index}"
          role="button"
          tabindex="0"
          aria-label="View details for ${product.name}"
        >
          <div class="shop-product-image">
            <img
              class="shop-product-image-primary"
              src="${product.image}"
              alt="${product.name}"
            >
            <img
              class="shop-product-image-hover"
              src="${product.hoverImage || product.image}"
              alt=""
              aria-hidden="true"
            >
          </div>
          <div class="shop-product-info">
            <h3>${product.name}</h3>
            <p class="shop-product-price">${formatPrice(product.price)}</p>
            <button
              type="button"
              class="add-to-cart-btn"
              data-product-index="${index}"
            >ADD TO CART</button>
          </div>
        </article>
      `
    )
    .join("");
}

function openBestSellerProduct(productIndex) {
  const product = products[Number(productIndex)];
  if (!product || !window.SoonBakeryProductModal) return;

  window.SoonBakeryProductModal.open({
    ...product,
    id: bestSellerProductId(product)
  });
}

function setupBestSellerModalTriggers() {
  const productGrid = document.querySelector("#product-grid");
  if (!productGrid) return;

  productGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart-btn");
    if (addButton) {
      event.stopPropagation();
      openBestSellerProduct(addButton.dataset.productIndex);
      return;
    }

    const card = event.target.closest(".shop-product-card");
    if (!card) return;
    openBestSellerProduct(card.dataset.productIndex);
  });

  productGrid.addEventListener("keydown", (event) => {
    if (event.target.closest(".add-to-cart-btn")) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".shop-product-card");
    if (!card) return;

    event.preventDefault();
    openBestSellerProduct(card.dataset.productIndex);
  });
}

function renderWhyUsCards() {
  const grid = document.querySelector(".why-us-grid");
  if (!grid) return;

  grid.innerHTML = whyUsCards
    .map(
      (card) => `
        <article class="why-us-card">
          <div class="card-content">
            <img
              src="${card.icon}"
              class="why-icon"
              alt="${card.iconAlt}"
            >
            <h3>${card.title}</h3>
            <img
              src="assets/Image/section-divider.png"
              class="card-divider"
              alt=""
              aria-hidden="true"
            >
            <p>${card.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderWhyUsCards();
  setupBestSellerModalTriggers();
});
