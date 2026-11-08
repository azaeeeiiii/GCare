/* ===== GCare - shared scripts (loaded on every page) =====
   Put things here that every page needs: footer year, shared helpers,
   later maybe auth state / nav highlighting. Page logic goes in its own file. */

// Keep the footer copyright year current
document.querySelectorAll(".copyright-year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});