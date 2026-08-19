const shopProducts = [
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Pandan Chiffon Cake",
    price: 12,
    category: "cake"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Pandan Chiffon Cake",
    price: 12,
    category: "cake"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Pandan Chiffon Cake",
    price: 12,
    category: "cake"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Pandan Chiffon Cake",
    price: 12,
    category: "cake"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Pandan Chiffon Cake",
    price: 12,
    category: "cake"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Pandan Chiffon Cake",
    price: 12,
    category: "cake"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Butter Cookies",
    price: 20,
    category: "cookies"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Almond Croissant",
    price: 4,
    category: "puff-pastries"
  },
  {
    image: "assets/Image/Chiffon.png",
    hoverImage: "assets/Image/Chiffon 2.jpg",
    name: "Sourdough Loaf",
    price: 8,
    category: "bread"
  }
];

let activeCategory = null;

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

function renderShopProducts() {
  const grid = document.querySelector("#shop-product-grid");
  if (!grid) return;

  const filtered = activeCategory
    ? shopProducts.filter((product) => product.category === activeCategory)
    : shopProducts.slice(0, 6);

  grid.innerHTML = filtered
    .map(
      (product) => `
        <article class="shop-product-card">
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
              data-product-id="${productId(product)}"
              data-product-name="${product.name}"
              data-product-price="${product.price}"
              data-product-image="${product.image}"
            >ADD TO CART</button>
          </div>
        </article>
      `
    )
    .join("");
}

function setupCategoryFilters() {
  const categoryLinks = document.querySelectorAll(".category-link");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
      activeCategory = link.dataset.category;

      categoryLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");

      renderShopProducts();
    });
  });
}

function setupAddToCart() {
  const grid = document.querySelector("#shop-product-grid");
  if (!grid) return;

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart-btn");
    if (!button) return;

    window.SoonBakeryCart.addItem({
      id: button.dataset.productId,
      name: button.dataset.productName,
      price: Number(button.dataset.productPrice),
      image: button.dataset.productImage
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShopProducts();
  setupCategoryFilters();
  setupAddToCart();
});
