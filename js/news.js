/* ===== GCare - Latest News page (news.html) ===== */

/* Back arrow / "Back to home": go to the previous page if it was on this site,
   otherwise fall back to index.html (the href). */
document.querySelectorAll("[data-back]").forEach((a) =>
  a.addEventListener("click", (e) => {
    const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
    if (cameFromSite && history.length > 1) { e.preventDefault(); history.back(); }
  }));