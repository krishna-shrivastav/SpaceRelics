// SPACE RELICS V2 interactions: NASA public media search and Apollo model inspector.
(() => {
  const $ = (s) => document.querySelector(s);
  const components = {
    descent: ["Descent stage", "The lower stage carried the landing engine, propellant tanks, landing legs and equipment. It supported the Lunar Module during powered descent and remained on the Moon after the crew departed in the ascent stage."],
    ascent: ["Ascent stage", "The upper stage housed the crew cabin and ascent propulsion system. After lunar surface operations, it lifted the astronauts from the Moon and rendezvoused with the Command/Service Module in lunar orbit."],
    landing: ["Landing gear", "Four landing legs absorbed touchdown loads and supported the vehicle on uneven lunar terrain. Footpads spread the load over the surface; one leg carried the ladder used by the crew."],
    propulsion: ["Propulsion system", "The descent propulsion system controlled the powered landing. The ascent propulsion system was a separate engine used to return the crew cabin to lunar orbit. The two stages had distinct roles."],
    crew: ["Crew and life-support systems", "The pressurized crew cabin supported two astronauts during lunar operations. Displays, controls, communications and environmental systems allowed the crew to operate the vehicle in a vacuum."]
  };
  document.querySelectorAll("[data-component]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-component]").forEach(x => x.classList.toggle("active", x === btn));
    const item = components[btn.dataset.component];
    $("#componentDetail").innerHTML = `<h4>${item[0]}</h4><p>${item[1]}</p>`;
  }));

  const model = $("#apolloModel");
  let modelRotating = true;
  $("#modelRotate")?.addEventListener("click", () => {
    modelRotating = !modelRotating;
    if (modelRotating) model?.play(); else model?.pause();
    $("#modelRotate").textContent = modelRotating ? "PAUSE ROTATION" : "RESUME ROTATION";
  });
  $("#modelHome")?.addEventListener("click", () => {
    if (model) { model.cameraOrbit = "0deg 75deg 105%"; model.fieldOfView = "30deg"; }
  });

  const gallery = $("#nasaGalleryGrid");
  const status = $("#nasaSearchStatus");
  const searchInput = $("#nasaSearchInput");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  async function searchNASA() {
    const q = searchInput.value.trim();
    if (!q) { status.textContent = "ENTER A SEARCH TERM"; return; }
    status.textContent = "SEARCHING NASA MEDIA ARCHIVE…";
    gallery.innerHTML = `<div class="nasa-gallery-placeholder"><span>⌁</span><b>Retrieving NASA records…</b><p>Connecting to images-api.nasa.gov</p></div>`;
    try {
      const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page_size=16`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`NASA API returned ${response.status}`);
      const payload = await response.json();
      const items = (payload.collection?.items || []).filter(item => item.links?.some(link => link.render === "image") || item.links?.length);
      if (!items.length) {
        gallery.innerHTML = `<div class="nasa-gallery-placeholder"><span>⌕</span><b>No matching images found</b><p>Try another mission name or a broader search phrase.</p></div>`;
        status.textContent = "0 RESULTS · TRY ANOTHER QUERY";
        return;
      }
      gallery.innerHTML = items.slice(0, 16).map(item => {
        const d = item.data?.[0] || {};
        const image = item.links?.find(link => link.render === "image")?.href || item.links?.[0]?.href || "";
        const nasaId = d.nasa_id || "";
        const description = (d.description || d.title || "").replace(/<[^>]*>/g, " ").slice(0, 260);
        const page = `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`;
        return `<article class="nasa-media-card"><a href="${page}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(image)}" alt="${esc(d.title || "NASA archive image")}"></a><div class="nasa-media-info"><small>${esc(d.date_created?.slice(0,10) || "NASA ARCHIVE")} · ${esc(d.media_type || "IMAGE")}</small><h4>${esc(d.title || "Untitled NASA media")}</h4><p>${esc(description)}</p><a href="${page}" target="_blank" rel="noopener">VIEW NASA RECORD ↗</a></div></article>`;
      }).join("");
      status.textContent = `${items.length} NASA RECORDS FOUND · DISPLAYING ${Math.min(items.length,16)}`;
    } catch (error) {
      gallery.innerHTML = `<div class="nasa-gallery-placeholder"><span>!</span><b>NASA archive could not be reached</b><p>${esc(error.message)}. Check your internet connection, then retry. The rest of the website remains available.</p></div>`;
      status.textContent = "ARCHIVE CONNECTION FAILED";
    }
  }
  $("#nasaSearchBtn")?.addEventListener("click", searchNASA);
  searchInput?.addEventListener("keydown", e => { if (e.key === "Enter") searchNASA(); });
  searchNASA();
})();