/* ============================================================
   Sajjad Limon — Portfolio scripts
   ============================================================ */
// --------- Custom Cursor Tracker -----------

var mainDiv = document.querySelector("#main-content")
var cursor = document.querySelector("#cursor")

// custom cursor tracking
mainDiv.addEventListener("mousemove", function(dets) {
  
  gsap.to(cursor, {
    x: dets.x,
    y: dets.y,
    opacity: 1,
    duration: .5,
    ease: "sine-out"
  })
})


// Year
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Nav: scrolled state ----------
const nav = document.getElementById("nav");
const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 20);
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    mobileMenu.classList.remove("open");
  })
);

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || "0", 10);
        setTimeout(() => e.target.classList.add("is-visible"), delay);
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => io.observe(el));

// ---------- Projects slider ----------
(function initSlider() {
  const track = document.getElementById("slider-track");
  if (!track) return;
  const cards = Array.from(track.children);
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  const dotsWrap = document.getElementById("slider-dots");

  let perView = 3;
  let index = 0;

  const computePerView = () => {
    const w = window.innerWidth;
    if (w <= 700) return 1;
    if (w <= 1000) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, cards.length - perView);

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    }
  };

  const update = () => {
    const card = cards[0];
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 0;
    const cardW = card.getBoundingClientRect().width;
    const offset = index * (cardW + gap);
    track.style.transform = `translateX(-${offset}px)`;
    Array.from(dotsWrap.children).forEach((d, i) =>
      d.classList.toggle("active", i === index)
    );
  };

  const go = (i) => {
    index = Math.max(0, Math.min(i, maxIndex()));
    update();
  };

  prevBtn.addEventListener("click", () => go(index === 0 ? maxIndex() : index - 1));
  nextBtn.addEventListener("click", () => go(index >= maxIndex() ? 0 : index + 1));

  // Touch / drag
  let startX = 0, dragging = false;
  track.addEventListener("pointerdown", (e) => { dragging = true; startX = e.clientX; });
  window.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (dx > 60) go(index === 0 ? maxIndex() : index - 1);
    else if (dx < -60) go(index >= maxIndex() ? 0 : index + 1);
  });

  // Autoplay
  let timer = setInterval(() => go(index >= maxIndex() ? 0 : index + 1), 5500);
  track.parentElement.addEventListener("mouseenter", () => clearInterval(timer));
  track.parentElement.addEventListener("mouseleave", () => {
    timer = setInterval(() => go(index >= maxIndex() ? 0 : index + 1), 5500);
  });

  const refresh = () => {
    const newPerView = computePerView();
    if (newPerView !== perView) {
      perView = newPerView;
      index = Math.min(index, maxIndex());
      buildDots();
    }
    update();
  };

  buildDots();
  update();
  window.addEventListener("resize", refresh);
})();

// ---------- Contact form validation ----------
const form = document.getElementById("contact-form");
const success = document.getElementById("form-success");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(formData).toString()

    });
    if (response.ok) {

      success.hidden = false;

      form.reset();

      setTimeout(() => {

        success.hidden = true;

      }, 3500);

    }
  } catch (error) {

    console.error(error);
    alert("Something went wrong on your form data!");
  }
});


// ---------- Scroll to top ----------
const scrollTopBtn = document.getElementById("scroll-top");
const onScrollTop = () => scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
onScrollTop();
window.addEventListener("scroll", onScrollTop, { passive: true });
scrollTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ---------- Lenis smooth scroll ----------
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);