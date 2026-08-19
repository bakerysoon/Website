const products = [
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
    name: "Butter Cookies",
    price: 20,
    category: "cookies"
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
    name: "Butter Cookies",
    price: 20,
    category: "cookies"
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
    name: "Butter Cookies",
    price: 20,
    category: "cookies"
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
              data-product-id="${bestSellerProductId(product)}"
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

function setupBestSellerCart() {
  const productGrid = document.querySelector("#product-grid");
  if (!productGrid || !window.SoonBakeryCart) return;

  productGrid.addEventListener("click", (event) => {
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
  setupBestSellerCart();
});