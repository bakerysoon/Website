const shopProducts = [
  {
    image: "assets/Image/Products/Chiffon.png",
    hoverImage: "assets/Image/Products/Chiffon 2.jpg",
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
    price: 3,
    category: "bread",
    description: "Hello, this is a description"
  },
  {
    image: "assets/Image/Products/Traditional White Lotus 1.webp",
    hoverImage: "assets/Image/Products/Traditional White Lotus 2.webp",
    availability: true,
    name: "Traditional White Lotus Mooncake (Less Sugar) (Box of 4)",
    price: 40,
    category: "mid-autumn",
    description: "The classic baked mooncake with white lotus paste. For even the health conscious to enjoy."
  },
  {
    image: "assets/Image/Products/Traditional Single Yolk 1.webp",
    hoverImage: "assets/Image/Products/Traditional Single Yolk 2.webp",
    availability: true,
    name: "Traditional Single Yolk Mooncake (Box of 4)",
    price: 44,
    category: "mid-autumn",
    description: "Some say a mooncake isn't complete without a yolk."
  },
  {
    image: "assets/Image/Products/Traditional Double Yolk 1.webp",
    hoverImage: "assets/Image/Products/Traditional Double Yolk 2.webp",
    availability: true,
    name: "Traditional Double Yolk Mooncake (Box of 4)",
    price: 48,
    category: "mid-autumn",
    description: "There is no shame in being greedy, made so you don't have to share your yolk."
  },
  {
    image: "assets/Image/Products/Blueberry Chocolate 1.webp",
    hoverImage: "assets/Image/Products/Blueberry Chocolate 2.webp",
    availability: true,
    name: "Blueberry Snowskin with Chocolate Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Blueberry Snowskin with Chocolate Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Lychee Cranberry 1.webp",
    hoverImage: "assets/Image/Products/Lychee Cranberry 2.webp",
    availability: true,
    name: "Lychee Snowskin with Cranberry Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Lychee Snowskin with Cranberry Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Lychee Mango 1.webp",
    hoverImage: "assets/Image/Products/Lychee Mango 2.webp",
    availability: true,
    name: "Lychee Snowskin with Mango Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Lychee Snowskin with Mango Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Lychee Osmanthus 1.webp",
    hoverImage: "assets/Image/Products/Lychee Osmanthus 2.webp",
    availability: true,
    name: "Lychee Snowskin with Osmanthus Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Lychee Snowskin with Osmanthus Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Lychee Yuzu 1.webp",
    hoverImage: "assets/Image/Products/Lychee Yuzu 2.webp",
    availability: true,
    name: "Lychee Snowskin with Yuzu Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Lychee Snowskin with Yuzu Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Mango Osmanthus 1.webp",
    hoverImage: "assets/Image/Products/Mango Osmanthus 2.webp",
    availability: true,
    name: "Mango Snowskin with Osmanthus Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Mango Snowskin with Osmanthus Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Mango Yuzu 1.webp",
    hoverImage: "assets/Image/Products/Mango Yuzu 2.webp",
    availability: true,
    name: "Mango Snowskin with Yuzu Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Mango Snowskin with Yuzu Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Passionfruit Cranberry 1.webp",
    hoverImage: "assets/Image/Products/Passionfruit Cranberry 2.webp",
    availability: true,
    name: "Passionfruit Snowskin with Cranberry Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Passionfruit Snowskin with Cranberry Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Passionfruit Mango 1.webp",
    hoverImage: "assets/Image/Products/Passionfruit Mango 2.webp",
    availability: true,
    name: "Passionfruit Snowskin with Mango Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Passionfruit Snowskin with Mango Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Passionfruit Yuzu 1.webp",
    hoverImage: "assets/Image/Products/Passionfruit Yuzu 2.webp",
    availability: true,
    name: "Passionfruit Snowskin with Yuzu Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Passionfruit Snowskin with Yuzu Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Peppermint Chocolate 1.webp",
    hoverImage: "assets/Image/Products/Peppermint Chocolate 2.webp",
    availability: true,
    name: "Peppermint Snowskin with Chocolate Filling",
    price: 5.5,
    category: "mid-autumn",
    description: `Peppermint Snowskin with Chocolate Filling
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Triple Chocolate 1.webp",
    hoverImage: "assets/Image/Products/Triple Chocolate 2.webp",
    availability: true,
    name: "Triple Chocolate Snowskin",
    price: 5.5,
    category: "mid-autumn",
    description: `Triple Chocolate Snowskin
    Note: There is a minimum order of 4pcs of snowskin mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Dragonfruit Jelly Mooncake 1.webp",
    hoverImage: "assets/Image/Products/Dragonfruit Jelly Mooncake 2.webp",
    availability: true,
    name: "Dragonfruit Jelly Mooncake",
    price: 4.5,
    category: "mid-autumn",
    description: `Dragonfruit Jelly Mooncake
    Note: There is a minimum order of 4pcs of jelly mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Chendol Jelly Mooncake 1.webp",
    hoverImage: "assets/Image/Products/Chendol Jelly Mooncake 2.webp",
    availability: true,
    name: "Chendol Jelly Mooncake",
    price: 5.5,
    category: "mid-autumn",
    description: `Chendol Jelly Mooncake
    Note: There is a minimum order of 4pcs of jelly mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Coffee Chocolate w Baileys 1.webp",
    hoverImage: "assets/Image/Products/Coffee Chocolate w Baileys 2.webp",
    availability: true,
    name: "Coffee Chocolate Snowskin with Baileys",
    price: 6.25,
    category: "mid-autumn",
    description: `Coffee Chocolate Snowskin with Baileys
    Note: There is a minimum order of 4pcs of jelly mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Coffee Chocolate w Whisky 1.webp",
    hoverImage: "assets/Image/Products/Coffee Chocolate w Whisky 2.webp",
    availability: true,
    name: "Coffee Chocolate Snowskin with Whisky",
    price: 6.25,
    category: "mid-autumn",
    description: `Coffee Chocolate Snowskin with Whisky
    Note: There is a minimum order of 4pcs of jelly mooncake consisting of any flavor combination of your choice.`
  },
  {
    image: "assets/Image/Products/Lychee Rose Mango Filling w White Chocolate 1.webp",
    hoverImage: "assets/Image/Products/Lychee Rose Mango Filling w White Chocolate 2.webp",
    availability: true,
    name: "Lychee Rose Snowskin with Mango and White Chocolate",
    price: 6.25,
    category: "mid-autumn",
    description: `Lychee Rose Snowskin with Mango and White Chocolate
    Note: There is a minimum order of 4pcs of jelly mooncake consisting of any flavor combination of your choice.`
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
