/* ===== GCare - Terms & Privacy pages (terms.html, privacy.html) ===== */

/* Back arrow / "Back to home": go to the previous page if it was on this site,
   otherwise fall back to index.html (the href). */
document.querySelectorAll("[data-back]").forEach((a) =>
  a.addEventListener("click", (e) => {
    const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
    if (cameFromSite && history.length > 1) { e.preventDefault(); history.back(); }
  }));

/* Highlight the current section in "On this page" while scrolling */
const sections = [...document.querySelectorAll(".legal-article section[id]")];
const links = new Map([...document.querySelectorAll(".toc a")].map((a) => [a.getAttribute("href").slice(1), a]));

if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.remove("active"));
        links.get(en.target.id)?.classList.add("active");
      }
    });
  }, { rootMargin: "-15% 0px -70% 0px" });
  sections.forEach((s) => io.observe(s));
}