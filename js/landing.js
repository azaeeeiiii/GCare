/* ===== GCare - landing page only (index.html) ===== */

/*
 * ALERT DATA
 * Placeholder content. Later, replace this with a fetch() to your backend
 * so the banner and the pop-up show whatever the admin posts.
 * Example: fetch('/api/alerts/active').then(r => r.json()).then(renderAlert)
 */
const activeAlert = {
  level: "Critical",
  headline: "Heavy Rainfall Advisory",
  area: "Batangas Province",
  issued: "November 7, 2026  10:30 AM",
  body: [
    "Heavy to intense rainfall is expected over Batangas Province in the next 24 hours. Flooding and landslides are possible in low-lying and mountainous areas.",
    "Residents near rivers and slopes should prepare to evacuate. Keep your emergency kit ready, charge your phone, and follow instructions from your local DRRMO."
  ]
};

/* Status line. Update from your backend / location check later. */
const areaStatus = { text: "No active emergency in your area", updated: "November 7, 2026 3:39 PM" };

const $ = (id) => document.getElementById(id);
const modal = $("alertModal");

function renderAlert(a) {
  $("alertLevel").textContent = a.level;
  $("alertHeadline").textContent = a.headline;
  $("alertArea").textContent = a.area;
  $("alertIssued").textContent = "Issued: " + a.issued;

  $("modalLevel").textContent = a.level;
  $("modalTitle").textContent = a.headline;
  $("modalMeta").textContent = a.area + " \u2022 Issued: " + a.issued;
  $("modalBody").replaceChildren(...a.body.map((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    return p;
  }));
}

renderAlert(activeAlert);
$("statusText").textContent = areaStatus.text;
$("statusTime").textContent = areaStatus.updated;

/* Pop-up open / close */
$("viewDetailsBtn").addEventListener("click", () => modal.showModal());
$("modalClose").addEventListener("click", () => modal.close());
$("modalDone").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); }); // click outside to close