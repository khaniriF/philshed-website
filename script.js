// Philshed Learning Center - site interactions

// Keep the footer year current.
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Accessible mobile navigation.
const menuButton = document.querySelector(".menu-btn");
const navigationMenu = document.getElementById("menu");

if (menuButton && navigationMenu) {
  const closeMenu = () => {
    navigationMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = navigationMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  // Close the menu after a visitor chooses a page.
  navigationMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu with Escape for keyboard users.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// Reveal content as it enters the viewport. Respect reduced-motion settings.
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          activeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("show"));
}

// Contact form: submit through Web3Forms and show clear success/error feedback.
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const statusMessage = document.getElementById("form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    statusMessage.textContent = "";
    statusMessage.className = "form-status";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "The message could not be sent.");
      }

      statusMessage.textContent =
        "Thank you! Your message has been sent to Philshed Learning Center.";
      statusMessage.classList.add("success");
      contactForm.reset();
    } catch (error) {
      statusMessage.textContent =
        "Sorry, your message could not be sent. Please try again or contact the school by phone or WhatsApp.";
      statusMessage.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* Keep the mobile menu tidy when the viewport changes back to desktop. */
window.addEventListener("resize", () => {
  if (window.innerWidth > 720 && navigationMenu && menuButton) {
    navigationMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }
});

/* Close the mobile menu when a visitor clicks outside the navigation. */
document.addEventListener("click", (event) => {
  if (!menuButton || !navigationMenu || !navigationMenu.classList.contains("open")) return;
  if (!event.target.closest(".nav")) {
    navigationMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }
});
