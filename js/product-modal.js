(() => {
  let modal = null;
  let currentProduct = null;
  let currentImages = [];
  let imageIndex = 0;
  let quantity = 1;
  let lastFocusedElement = null;

  function formatPrice(price) {
    return `$${Number(price).toFixed(2).replace(/\.00$/, "")}`;
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "product-modal";
    modal.id = "product-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="product-modal-backdrop" data-modal-close></div>
      <section
        class="product-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button type="button" class="product-modal-close" data-modal-close aria-label="Close product details">×</button>

        <div class="product-modal-gallery">
          <div class="product-modal-image-wrap">
            <img class="product-modal-image" src="" alt="">
            <button type="button" class="product-modal-arrow product-modal-arrow-prev" data-image-prev aria-label="Previous image">‹</button>
            <button type="button" class="product-modal-arrow product-modal-arrow-next" data-image-next aria-label="Next image">›</button>
            <span class="product-modal-image-count" aria-live="polite"></span>
          </div>
        </div>

        <div class="product-modal-details">
          <p class="product-modal-eyebrow">Soon Bakery</p>
          <h2 id="product-modal-title" class="product-modal-title"></h2>
          <p class="product-modal-price"></p>
          <p class="product-modal-description"></p>

          <div class="product-modal-purchase-row">
            <div>
              <span class="product-modal-quantity-label">Quantity</span>
              <div class="product-modal-quantity" aria-label="Select quantity">
                <button type="button" data-quantity-minus aria-label="Decrease quantity">−</button>
                <span data-quantity-value aria-live="polite">1</span>
                <button type="button" data-quantity-plus aria-label="Increase quantity">+</button>
              </div>
            </div>

            <button type="button" class="product-modal-add-btn" data-modal-add-to-cart>ADD TO CART</button>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-modal-close]")) {
        close();
        return;
      }

      if (event.target.closest("[data-image-prev]")) {
        changeImage(-1);
        return;
      }

      if (event.target.closest("[data-image-next]")) {
        changeImage(1);
        return;
      }

      if (event.target.closest("[data-quantity-minus]")) {
        setQuantity(quantity - 1);
        return;
      }

      if (event.target.closest("[data-quantity-plus]")) {
        setQuantity(quantity + 1);
        return;
      }

      if (event.target.closest("[data-modal-add-to-cart]")) {
        addCurrentProductToCart();
      }
    });

    return modal;
  }

  function setQuantity(nextQuantity) {
    quantity = Math.min(99, Math.max(1, Number(nextQuantity) || 1));
    const quantityValue = modal?.querySelector("[data-quantity-value]");
    if (quantityValue) quantityValue.textContent = quantity;
  }

  function renderImage() {
    if (!modal || currentImages.length === 0) return;

    const image = modal.querySelector(".product-modal-image");
    const count = modal.querySelector(".product-modal-image-count");
    const prev = modal.querySelector("[data-image-prev]");
    const next = modal.querySelector("[data-image-next]");

    image.src = currentImages[imageIndex];
    image.alt = `${currentProduct.name} — image ${imageIndex + 1}`;
    count.textContent = `${imageIndex + 1} / ${currentImages.length}`;

    const multipleImages = currentImages.length > 1;
    prev.hidden = !multipleImages;
    next.hidden = !multipleImages;
    count.hidden = !multipleImages;
  }

  function changeImage(direction) {
    if (currentImages.length <= 1) return;
    imageIndex = (imageIndex + direction + currentImages.length) % currentImages.length;
    renderImage();
  }

  function addCurrentProductToCart() {
    if (!currentProduct || !window.SoonBakeryCart) return;

    if (currentProduct.availability === false) {
      window.SoonBakeryCart.showMessage("Our apologies, this item is currently unavailable");
      return;
    }

    window.SoonBakeryCart.addItem(
      {
        id: currentProduct.id,
        name: currentProduct.name,
        price: Number(currentProduct.price),
        image: currentProduct.image
      },
      quantity
    );

    close();
  }

  function open(product) {
    if (!product) return;
    ensureModal();

    currentProduct = product;
    const isAvailable = product.availability !== false;
    const unavailableImage = "assets/Image/not_available.jpg";

    currentImages = isAvailable
      ? [product.image, product.hoverImage]
          .filter(Boolean)
          .filter((image, index, images) => images.indexOf(image) === index)
      : [unavailableImage];

    imageIndex = 0;
    quantity = 1;
    lastFocusedElement = document.activeElement;

    modal.querySelector(".product-modal-title").textContent = product.name || "Product";
    modal.querySelector(".product-modal-price").textContent = formatPrice(product.price || 0);
    modal.querySelector(".product-modal-description").textContent =
      product.description || "Hello, this is a description";

    const addButton = modal.querySelector("[data-modal-add-to-cart]");
    const quantityButtons = modal.querySelectorAll("[data-quantity-minus], [data-quantity-plus]");

    if (addButton) {
      addButton.textContent = isAvailable ? "ADD TO CART" : "UNAVAILABLE";
      addButton.classList.toggle("is-unavailable", !isAvailable);
      addButton.setAttribute(
        "aria-label",
        isAvailable ? `Add ${product.name} to cart` : `${product.name} is currently unavailable`
      );
    }

    quantityButtons.forEach((button) => {
      button.disabled = !isAvailable;
    });

    setQuantity(1);
    renderImage();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("product-modal-open");

    window.requestAnimationFrame(() => {
      modal.querySelector(".product-modal-close")?.focus();
    });
  }

  function close() {
    if (!modal || !modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("product-modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  document.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowLeft") {
      changeImage(-1);
    } else if (event.key === "ArrowRight") {
      changeImage(1);
    }
  });

  window.SoonBakeryProductModal = {
    open,
    close
  };
})();
