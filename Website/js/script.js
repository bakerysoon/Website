const products = [
  {
    image: "assets/Image/Products/Traditional White Lotus 1.webp",
    hoverImage: "assets/Image/Products/Traditional White Lotus 2.webp",
    availability: true,
    name: "Traditional White Lotus Mooncake (Less Sugar) (Box of 4)",
    price: 13,
    category: "mid-autumn",
    description: "The classic baked mooncake with white lotus paste. For even the health conscious to enjoy."
  },
  {
    image: "assets/Image/Products/Traditional Single Yolk 1.webp",
    hoverImage: "assets/Image/Products/Traditional Single Yolk 2.webp",
    availability: true,
    name: "Traditional Single Yolk Mooncake (Box of 4)",
    price: 14,
    category: "mid-autumn",
    description: "Some say a mooncake isn't complete without a yolk."
  },
  {
    image: "assets/Image/Products/Lychee Osmanthus 1.webp",
    hoverImage: "assets/Image/Products/Lychee Osmanthus 2.webp",
    availability: true,
    name: "Lychee Snowskin with Osmanthus Filling",
    price: 5,
    category: "mid-autumn",
    description: `Lychee Snowskin with Osmanthus Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Mango Osmanthus 1.webp",
    hoverImage: "assets/Image/Products/Mango Osmanthus 2.webp",
    availability: true,
    name: "Mango Snowskin with Osmanthus Filling",
    price: 5,
    category: "mid-autumn",
    description: `Mango Snowskin with Osmanthus Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Passionfruit Mango 1.webp",
    hoverImage: "assets/Image/Products/Passionfruit Mango 2.webp",
    availability: true,
    name: "Passionfruit Snowskin with Mango Filling",
    price: 4,
    category: "mid-autumn",
    description: `Passionfruit Snowskin with Mango Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Triple Chocolate 1.webp",
    hoverImage: "assets/Image/Products/Triple Chocolate 2.webp",
    availability: true,
    name: "Triple Chocolate Snowskin",
    price: 4,
    category: "mid-autumn",
    description: `Triple Chocolate Snowskin
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
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

function isProductAvailable(product) {
  return product.availability !== false;
}

function getProductImage(product, type = "primary") {
  if (!isProductAvailable(product)) return "assets/Image/not_available.jpg";
  if (type === "hover") return product.hoverImage || product.image;
  return product.image;
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
          class="shop-product-card product-modal-trigger${isProductAvailable(product) ? "" : " is-unavailable"}"
          data-product-index="${index}"
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
              data-product-index="${index}"
              aria-label="${isProductAvailable(product) ? `Add ${product.name} to cart` : `${product.name} is currently unavailable`}"
            >${isProductAvailable(product) ? "ADD TO CART" : "UNAVAILABLE"}</button>
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
    image: getProductImage(product),
    hoverImage: getProductImage(product, "hover"),
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
      const product = products[Number(addButton.dataset.productIndex)];
      if (product && !isProductAvailable(product)) {
        window.SoonBakeryCart?.showMessage("Our apologies, this item is currently unavailable");
        return;
      }
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
