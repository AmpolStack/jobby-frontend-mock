// ── Elements ──────────────────────────────────────────────────
const screens       = document.querySelectorAll(".screen");
const menuItems     = document.querySelectorAll(".menu-item");
const toggles       = document.querySelectorAll(".item-toggle");
const navBusiness   = document.getElementById("nav-business");
const hamburger     = document.getElementById("hamburger");
const sidebar       = document.getElementById("sidebar");
const backdrop      = document.getElementById("sidebar-backdrop");
const enterButtons  = document.querySelectorAll(".enter-business");

// Progress & Toast
const progressBarTop    = document.getElementById("progress-bar");
const progressBarBottom = document.getElementById("progress-bar-bottom");
const toast             = document.getElementById("toast");
const toastMessage      = document.getElementById("toast-message");

// Modals & Forms
const employeeModal  = document.getElementById("employee-modal");
const productModal   = document.getElementById("product-modal");
const employeeForm   = document.getElementById("employee-form");
const productForm    = document.getElementById("product-form");
const closeModalBtns = document.querySelectorAll(".close-modal");

// Operation Buttons
const addEmployeeBtn  = document.getElementById("add-employee-btn");
const addProductBtn   = document.getElementById("add-product-btn");
const registerSaleBtn = document.getElementById("register-sale-btn");

// ── Modals Logic ──────────────────────────────────────────────
function openModal(modal) {
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
}

addEmployeeBtn?.addEventListener("click", () => openModal(employeeModal));
addProductBtn?.addEventListener("click", () => openModal(productModal));

closeModalBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal-overlay");
    if (modal) closeModal(modal);
  });
});

// Close modal on click outside
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal(e.target);
  }
});

// ── Success Interactions ──────────────────────────────────────
function simulateOperation(successMsg) {
  const bars = [progressBarTop, progressBarBottom];

  // Reset
  bars.forEach(bar => {
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.offsetHeight; // force reflow
    bar.classList.add("loading");
    bar.style.transition = ""; 
    bar.style.width = "100%";
  });

  setTimeout(() => {
    // Finish loading
    bars.forEach(bar => bar.classList.remove("loading"));
    
    // Show Toast
    toastMessage.textContent = successMsg;
    toast.classList.add("show");

    // Clear bars after a bit
    setTimeout(() => {
      bars.forEach(bar => { bar.style.width = "0%"; });
    }, 400);

    // Hide toast after 3s
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }, 2000); 
}

// ── Form Submissions ──────────────────────────────────────────
employeeForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal(employeeModal);
  simulateOperation("Empleado creado con éxito");
  employeeForm.reset();
});

productForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal(productModal);
  simulateOperation("Producto añadido con éxito");
  productForm.reset();
});

registerSaleBtn?.addEventListener("click", () => {
  simulateOperation("Venta registrada con éxito");
});

// ── Sidebar (mobile) ──────────────────────────────────────────
function openSidebar() {
  sidebar.classList.add("open");
  backdrop.classList.remove("hidden");
  backdrop.classList.add("visible");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("visible");
  backdrop.classList.add("hidden");
}

hamburger.addEventListener("click", openSidebar);
backdrop.addEventListener("click", closeSidebar);

// ── Screen navigation ─────────────────────────────────────────
function showScreen(screenId) {
  screens.forEach(s => s.classList.toggle("active", s.id === screenId));

  const isBoard = screenId === "board-screen";
  navBusiness.textContent = isBoard ? "JOBBY" : "Jobby-marketly";

  menuItems.forEach(item => {
    item.classList.toggle("active", item.dataset.screenTarget === screenId);
  });

  // Scroll content to top
  const content = document.getElementById("content");
  if (content) content.scrollTop = 0;

  // Close mobile sidebar after navigation
  closeSidebar();
}

// Menu items
menuItems.forEach(item => {
  item.addEventListener("click", () => showScreen(item.dataset.screenTarget));
});

// "Go to Business" cards → home/dashboard screen
enterButtons.forEach(btn => {
  btn.addEventListener("click", () => showScreen("home-screen"));
});

// ── Checkout item toggles ─────────────────────────────────────
toggles.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".checkout-item");
    card.classList.toggle("expanded");
    toggle.textContent = card.classList.contains("expanded")
      ? "Hide details"
      : "Show details";
  });
});

// ── Init ──────────────────────────────────────────────────────
showScreen("board-screen");
