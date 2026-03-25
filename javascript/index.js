  const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    reveals.forEach(r => obs.observe(r));

    function handleSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.textContent = '✓ Message Received';
      btn.style.background = '#2D6A4F';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; e.target.reset(); }, 4000);
    }

  /*
   * ─────────────────────────────────────────────
   *  PHOTO DATA
   *  To use your own photos, replace the `src`
   *  values below with real image paths or URLs.
   *  e.g. src: "images/service-01.jpg"
   * ─────────────────────────────────────────────
   */
  const photos = [
    { cat: "sunday",    label: "Message session",        src: "asset/IMG-20260325-WA0069.jpg", h: 280 },
    { cat: "sunday",    label: "Ministers of God",           src: "asset/IMG-20260325-WA0063.jpg", h: 200 },
    { cat: "community",  label: "Evangelism",           src: "asset/IMG-20260325-WA0096.jpg", h: 340 },
    { cat: "events", label: "Women program",              src: "asset/IMG-20260325-WA0031.jpg", h: 220 },
    { cat: "community",    label: "Evangelism",       src: "asset/IMG-20260325-WA0094.jpg", h: 260 },
    { cat: "sunday",    label: "Women sunday",       src: "asset/IMG-20260325-WA0055.jpg", h: 200 },
    { cat: "events",    label: "Women program",       src: "asset/IMG-20260325-WA0036.jpg", h: 210 },
    { cat: "events",  label: "Women program",          src: "asset/IMG-20260325-WA0055.jpg", h: 190 },
    { cat: "community", label: "Evangelism",   src: "asset/IMG-20260325-WA0090.jpg", h: 260 },
    { cat: "sunday",    label: " Sunday jpeg",           src: "asset/IMG-20260325-WA0038.jpg", h: 220 },
    { cat: "events",    label: "Thanksgiving ceremony",        src: "asset/IMG-20260325-WA0039.jpg", h: 300 },
    { cat: "building",  label: "Chapel interior",         src: "", h: 240 },
    { cat: "sunday", label: "After-church jpeg",    src: "asset/IMG-20260325-WA0054.jpg", h: 400 },
    { cat: "sunday",    label: "Sunday prayer",           src: "asset/pastor.png", h: 320 },
    { cat: "events",    label: "Thanksgiving festival",        src: "asset/IMG-20260325-WA0072.jpg", h: 210 },
    { cat: "events", label: "Praise night",      src: "asset/IMG-20260325-WA0061.jpg", h: 280 },
  ];

  /* Category config */
  const catConfig = {
    sunday:    { label: "Sunday service",     badge: "badge-sunday",    color: "#c8b6e2", icon: "✝" },
    events:    { label: "Events & programs",  badge: "badge-events",    color: "#a8d8c2", icon: "★" },
    building:  { label: "Church building",    badge: "badge-building",  color: "#f5d5a0", icon: "⛪" },
    community: { label: "Community outreach", badge: "badge-community", color: "#f0b8a0", icon: "❤" },
  };

  /* ── Generate a placeholder canvas image ── */
  function makePlaceholder(p) {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = p.h * 2;
    const ctx = canvas.getContext("2d");
    const cfg = catConfig[p.cat];

    ctx.fillStyle = cfg.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.font = `${Math.min(canvas.height * 0.38, 140)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cfg.icon, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  }

  /* ── Build the grid ── */
  const grid = document.getElementById("grid");

  photos.forEach((p) => {
    const cfg = catConfig[p.cat];
    const card = document.createElement("div");
    card.className = "photo-card";
    card.dataset.cat = p.cat;

    const img = document.createElement("img");
    /* Use real src if provided, otherwise generate placeholder */
    img.src = p.src || makePlaceholder(p);
    img.alt = p.label;
    img.style.height = p.h + "px";
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "photo-overlay";

    const lbl = document.createElement("span");
    lbl.className = "photo-label";
    lbl.textContent = p.label;

    const badge = document.createElement("span");
    badge.className = "cat-badge " + cfg.badge;
    badge.textContent = cfg.label;

    overlay.appendChild(lbl);
    card.appendChild(img);
    card.appendChild(overlay);
    card.appendChild(badge);
    grid.appendChild(card);

    /* Open lightbox on click */
    card.addEventListener("click", () => openLightbox(img.src, p.label));
  });

  /* ── Filter logic ── */
  const countLabel = document.getElementById("count-label");

  function applyFilter(filter) {
    let visible = 0;
    document.querySelectorAll(".photo-card").forEach((card) => {
      const show = filter === "all" || card.dataset.cat === filter;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    countLabel.textContent = visible + " photo" + (visible !== 1 ? "s" : "");
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  applyFilter("all");

  /* ── Lightbox ── */
  const lightbox  = document.getElementById("lightbox");
  const lbImg     = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  const branches = [
    {
      name: "Abundant Life Assembly  — Ayeteju Branch",
      tag: "Branch 1",
      tagClass: "tag-1",
      pinClass: "pin-1",
      icon: "✝",
      pastor: "Pastor Julius Banjo",
      address: "-",
      phone: "+234 ",
      email: "--",
      services: "Sundays 8:00 AM & 10:30 AM · Wednesdays 6:00 PM",
    },
    {
      name: "Abundant Life Assembly  — Deb0jo   Branch",
      tag: "Branch 2",
      tagClass: "tag-2",
      pinClass: "pin-2",
      icon: "✝",
      pastor: "Pastor Gbenga Banjo",
      address: "-- ",
      phone: "+234 ",
      email: "--",
      services: "Sundays 9:00 AM & 11:00 AM · Fridays 6:30 PM",
    },
    {
      name: "Abundant Life Assembly — Sala Branch",
      tag: "Branch 3",
      tagClass: "tag-3",
      pinClass: "pin-3",
      icon: "✝",
      pastor: "Pastor Olujimi Ajose",
      address: "--",
      phone: "+234 816 776 3048",
      email: "--",
      services: "Sundays 9:30 AM & 12:00 PM · Wednesday 6:00 PM",
    },
    
  ];

  /* ── Render branch list ── */
  const branchList = document.getElementById("branch-list");

  branches.forEach((b, i) => {
    const num = String(i + 1).padStart(2, "0");
    const item = document.createElement("div");
    item.className = "branch-item";
    item.innerHTML = `
      <div class="pin-col">
        <div class="pin ${b.pinClass}">
          <span class="pin-inner">${b.icon}</span>
        </div>
        <span class="pin-num">${num}</span>
      </div>
      <div class="branch-content">
        <div class="branch-name">${b.name}</div>
        <span class="branch-tag ${b.tagClass}">${b.tag}</span>
        <div class="branch-details">
          <div class="detail-row">
            <span class="detail-label">Pastor / Leader</span>
            <span class="detail-value">${b.pastor}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service times</span>
            <span class="detail-value">${b.services}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Address</span>
            <span class="detail-value">${b.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone</span>
            <span class="detail-value"><a href="tel:${b.phone.replace(/\s/g,'')}">${b.phone}</a></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value"><a href="mailto:${b.email}">${b.email}</a></span>
          </div>
        </div>
      </div>
    `;
    branchList.appendChild(item);
  });
