const CONFIG = {
  LOGO_SRC: "../img/logo.png",
  VIDEO_SRC: "../vid/vid.mp4",
  TRY_IMG_SRC: "../img/tre.png",
  TERMS_URL: "https://crstudio911.github.io/hhkehbkhf6347WFGHJ649iffk/",
  DOWNLOAD_URL: "../solveV10.zip",
  SECRET_WORD: "-SOLVE-",
  GREETING_WORDS: ["Hi", "مرحبا", "Bonjour", "你好", "Ciao", "هيا بنا"],
  QNA: [{
    q: "أمن علي الحساب؟",
    a: "أمان و ملهاش اي علاقه بلحساب هي بتقرء الشات فقط"
  }, {
    q: "التجربه المجانيه قد ايه؟",
    a: "15دقيقه"
  }, {
    q: "بتسحب كريديت",
    a: "يرجي اتباع خطوات فيديو الشرح"
  }, {
    q: "مش شغاله",
    a: "يرجي اتباع خطوات فيديو الشرح"
  }, {
    q: "اعمل ايه",
    a: "يرجي اتباع خطوات فيديو الشرح"
  }, {
    q: "استخدم اي متصفح؟",
    a: "ايوا اي متصفح في وضع المطور في الاضافات"
  }, {
    q: "اخري",
    a: "تواصل معا خدمه العملاء"
  }],
  REFUND_WARRANTY_DAYS: 10,
  OPERATION_WARRANTY_DAYS: 30,
  FLOW_NEW: ["whoareyou", "newvideo", "download", "tryit", "qna", "form", "invoice"],
  FLOW_OLD: ["whoareyou", "oldcode", "oldvideo"]
};
const state = {
  watchStoppedAt: 0,
  formData: {},
  activeFlow: CONFIG.FLOW_NEW
};
function codeContainsTarget(input) {
  return typeof input === "string" && input.includes(CONFIG.SECRET_WORD);
}
function applyDownloadTarget(el) {
  if (!el) return;
  const url = CONFIG.DOWNLOAD_URL || "#";
  el.href = url;
  const isRemote = /^https?:\/\//i.test(url);
  if (isRemote) {
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
    el.removeAttribute("download");
  } else if (url !== "#") {
    el.removeAttribute("target");
    el.setAttribute("download", "");
  }
}
function formatClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  return {
    time,
    date,
    raw: now
  };
}
function tickClock() {
  const timeEl = document.getElementById("clock-time");
  const dateEl = document.getElementById("clock-date");
  if (!timeEl || !dateEl) return;
  const {
    time,
    date
  } = formatClock();
  timeEl.textContent = time;
  dateEl.textContent = date;
}
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
function openModal({
  title,
  sub,
  actions
}) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const actionsHtml = actions.map((a, i) => `<button class="${a.primary ? "btn-primary" : "btn-outline"}" data-idx="${i}"><span>${a.label}</span></button>`).join("");
  overlay.innerHTML = `
    <div class="modal-box">
      <p>${title}</p>
      ${sub ? `<p class="modal-sub">${sub}</p>` : ""}
      <div class="modal-actions">${actionsHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
  overlay.querySelectorAll("[data-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 350);
      if (actions[idx].onClick) actions[idx].onClick();
    });
  });
}
function attachRipple() {
  document.addEventListener("click", e => {
    const btn = e.target.closest(".btn-primary, .btn-outline, .choice-card");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.style.position = btn.style.position || "relative";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 620);
  });
}
let currentScreen = "greeting";
function renderSteps(flow, screenName) {
  const track = document.getElementById("steps-track");
  if (!track) return;
  const idx = flow.indexOf(screenName);
  if (idx === -1) {
    track.classList.remove("show");
    track.innerHTML = "";
    return;
  }
  track.innerHTML = flow.map((_, i) => {
    if (i < idx) return `<span class="dot done"></span>`;
    if (i === idx) return `<span class="dot current"></span>`;
    return `<span class="dot"></span>`;
  }).join("");
  track.classList.add("show");
}
function goToScreen(name) {
  const next = document.querySelector(`.screen[data-screen="${name}"]`);
  const prev = document.querySelector(`.screen[data-screen="${currentScreen}"]`);
  if (!next || next === prev) return;
  if (prev) {
    prev.classList.add("leaving");
    prev.classList.remove("active");
    setTimeout(() => prev.classList.remove("leaving"), 600);
  }
  next.classList.add("active");
  currentScreen = name;
  const breadcrumb = document.getElementById("breadcrumb");
  const persistentFrom = ["download", "tryit", "qna", "form", "invoice", "oldvideo"];
  if (breadcrumb) breadcrumb.classList.toggle("show", persistentFrom.includes(name));
  renderSteps(state.activeFlow, name);
}
function runGreeting() {
  const words = CONFIG.GREETING_WORDS;
  const el = document.getElementById("greet-word");
  const startBtn = document.getElementById("btn-start-journey");
  let i = 0;
  el.style.transition = "opacity .28s ease, transform .28s ease";
  const interval = setInterval(() => {
    i++;
    if (i < words.length) {
      el.style.opacity = 0;
      el.style.transform = "translateY(10px)";
      setTimeout(() => {
        el.textContent = words[i];
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, 280);
    } else {
      clearInterval(interval);
      startBtn.classList.add("shown");
    }
  }, 900);
}
function buildQna() {
  const list = document.getElementById("qna-questions");
  const slot = document.getElementById("qna-answer-slot");
  CONFIG.QNA.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "qna-q-btn";
    btn.textContent = item.q;
    btn.addEventListener("click", () => {
      list.querySelectorAll(".qna-q-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      slot.style.opacity = 0;
      setTimeout(() => {
        slot.innerHTML = `<p class="qna-answer-text">${item.a}</p>`;
        slot.style.opacity = 1;
      }, 200);
    });
    list.appendChild(btn);
  });
}
function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function initCustomPlayer(root) {
  const video = root.querySelector("video");
  if (!video) return;
  const overlay = root.querySelector("[data-overlay]");
  const bigPlay = root.querySelector("[data-bigplay]");
  const playBtn = root.querySelector("[data-playpause]");
  const muteBtn = root.querySelector("[data-mute]");
  const fsBtn = root.querySelector("[data-fullscreen]");
  const seek = root.querySelector("[data-seek]");
  const seekFill = root.querySelector("[data-seekfill]");
  const bufferedEl = root.querySelector("[data-buffered]");
  const thumb = root.querySelector("[data-thumb]");
  const currentEl = root.querySelector("[data-current]");
  const durationEl = root.querySelector("[data-duration]");
  let isDragging = false;
  let hideTimer = null;
  function setPlayIcon(playing) {
    const icon = playing ? "fa-pause" : "fa-play";
    [playBtn, bigPlay].forEach(btn => {
      if (!btn) return;
      const i = btn.querySelector("i");
      if (i) i.className = `fa-solid ${icon}`;
    });
    root.classList.toggle("is-playing", playing);
  }
  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().catch(() => {});
      const box = root.closest(".video-box") || root;
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (!isFullscreen) {
        if (box.requestFullscreen) {
          box.requestFullscreen();
        } else if (box.webkitRequestFullscreen) {
          box.webkitRequestFullscreen();
        } else if (box.mozRequestFullScreen) {
          box.mozRequestFullScreen();
        } else if (box.msRequestFullscreen) {
          box.msRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      }
    } else {
      video.pause();
    }
  }
  function updateProgress() {
    if (!video.duration || isDragging) return;
    const pct = video.currentTime / video.duration * 100;
    if (seekFill) seekFill.style.width = `${pct}%`;
    if (thumb) thumb.style.left = `${pct}%`;
    if (currentEl) currentEl.textContent = formatTime(video.currentTime);
  }
  function updateBuffered() {
    if (!video.duration || !video.buffered.length || !bufferedEl) return;
    const end = video.buffered.end(video.buffered.length - 1);
    bufferedEl.style.width = `${Math.min(100, end / video.duration * 100)}%`;
  }
  function seekToClientX(clientX) {
    if (!seek || !video.duration) return;
    const rect = seek.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    if (seekFill) seekFill.style.width = `${ratio * 100}%`;
    if (thumb) thumb.style.left = `${ratio * 100}%`;
    if (currentEl) currentEl.textContent = formatTime(video.currentTime);
  }
  function showUiTemporarily() {
    root.classList.add("show-ui");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused) root.classList.remove("show-ui");
    }, 2600);
  }
  video.addEventListener("loadedmetadata", () => {
    if (durationEl) durationEl.textContent = formatTime(video.duration);
  });
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("progress", updateBuffered);
  video.addEventListener("play", () => {
    setPlayIcon(true);
    showUiTemporarily();
  });
  video.addEventListener("pause", () => {
    setPlayIcon(false);
    root.classList.add("show-ui");
    clearTimeout(hideTimer);
  });
  video.addEventListener("ended", () => {
    setPlayIcon(false);
    root.classList.add("show-ui");
  });
  video.addEventListener("click", togglePlay);
  if (overlay) overlay.addEventListener("click", togglePlay);
  if (bigPlay) {
    bigPlay.addEventListener("click", e => {
      e.stopPropagation();
      togglePlay();
    });
  }
  if (playBtn) {
    playBtn.addEventListener("click", e => {
      e.stopPropagation();
      togglePlay();
    });
  }
  if (muteBtn) {
    muteBtn.addEventListener("click", e => {
      e.stopPropagation();
      video.muted = !video.muted;
      const i = muteBtn.querySelector("i");
      if (i) i.className = `fa-solid ${video.muted || video.volume === 0 ? "fa-volume-xmark" : "fa-volume-high"}`;
    });
  }
  if (fsBtn) {
    fsBtn.addEventListener("click", e => {
      e.stopPropagation();
      const box = root.closest(".video-box") || root;
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (!isFullscreen) {
        if (box.requestFullscreen) {
          box.requestFullscreen();
        } else if (box.webkitRequestFullscreen) {
          box.webkitRequestFullscreen();
        } else if (box.mozRequestFullScreen) {
          box.mozRequestFullScreen();
        } else if (box.msRequestFullscreen) {
          box.msRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    });
    const updateFullscreenIcon = () => {
      const i = fsBtn.querySelector("i");
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (i) i.className = `fa-solid ${isFullscreen ? "fa-compress" : "fa-expand"}`;
    };
    document.addEventListener("fullscreenchange", updateFullscreenIcon);
    document.addEventListener("webkitfullscreenchange", updateFullscreenIcon);
    document.addEventListener("mozfullscreenchange", updateFullscreenIcon);
    document.addEventListener("MSFullscreenChange", updateFullscreenIcon);
  }
  if (seek) {
    seek.addEventListener("pointerdown", e => {
      isDragging = true;
      seek.classList.add("seeking");
      seekToClientX(e.clientX);
      seek.setPointerCapture(e.pointerId);
    });
    seek.addEventListener("pointermove", e => {
      if (isDragging) seekToClientX(e.clientX);
    });
    ["pointerup", "pointercancel"].forEach(evt => {
      seek.addEventListener(evt, () => {
        isDragging = false;
        seek.classList.remove("seeking");
      });
    });
    seek.addEventListener("click", e => e.stopPropagation());
  }
  root.addEventListener("mousemove", showUiTemporarily);
  root.addEventListener("touchstart", showUiTemporarily, {
    passive: true
  });
  root.classList.add("show-ui");
}
function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
function softGlow(ctx, x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function generateInvoiceId(data, now) {
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const seed = hashString(`${data.name}|${data.phone}|${now.getTime()}`);
  const code = (seed % 65535).toString(16).toUpperCase().padStart(4, "0");
  return {
    id: `SLV-${datePart}-${code}`,
    seed
  };
}
function drawBarcode(ctx, x, y, w, h, seed) {
  let cursor = x;
  let s = seed || 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  while (cursor < x + w) {
    const barW = 1 + Math.floor(rand() * 3);
    if (rand() > 0.42) {
      ctx.fillStyle = "rgba(249,249,252,.55)";
      ctx.fillRect(cursor, y, barW, h);
    }
    cursor += barW + 2;
  }
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  const lines = [];
  words.forEach(word => {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = test;
    }
  });
  lines.push(line.trim());
  lines.forEach(l => {
    ctx.fillText(l, x, curY);
    curY += lineHeight;
  });
  return curY;
}
function loadImage(src) {
  return new Promise(resolve => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
function drawImageContain(ctx, img, x, y, w, h, pad) {
  const availW = w - pad * 2;
  const availH = h - pad * 2;
  const scale = Math.min(availW / img.width, availH / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}
function drawWarrantyCard(ctx, x, y, w, h, title, sub, dateLabel) {
  ctx.fillStyle = "rgba(63,169,255,.06)";
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(63,169,255,.28)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 14);
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "700 12px 'IBM Plex Mono', monospace";
  ctx.fillText("\u2713", x + 14, y + 24);
  ctx.textAlign = "right";
  ctx.fillStyle = "#7ec8ff";
  ctx.font = "700 13px Tajawal, sans-serif";
  ctx.fillText(title, x + w - 14, y + 24);
  ctx.fillStyle = "#918da0";
  ctx.font = "11px Tajawal, sans-serif";
  wrapText(ctx, sub, x + w - 14, y + 42, w - 28, 15);
  ctx.fillStyle = "#f9f9fc";
  ctx.font = "700 11px 'IBM Plex Mono', monospace";
  ctx.fillText(dateLabel, x + w - 14, y + h - 14);
}
async function drawInvoice(data) {
  const canvas = document.getElementById("invoice-canvas");
  if (!canvas) return;
  const logoImg = await loadImage(CONFIG.LOGO_SRC);
  const W = 640;
  const H = 1080;
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const now = new Date();
  const time = now.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const date = now.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const {
    id: invoiceId,
    seed
  } = generateInvoiceId(data, now);
  const fmtDate = d => d.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const refundUntil = new Date(now);
  refundUntil.setDate(refundUntil.getDate() + CONFIG.REFUND_WARRANTY_DAYS);
  const operationUntil = new Date(now);
  operationUntil.setDate(operationUntil.getDate() + CONFIG.OPERATION_WARRANTY_DAYS);
  const PAD = 46;
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#121116");
  bgGrad.addColorStop(0.55, "#0d0c10");
  bgGrad.addColorStop(1, "#08080a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  roundRect(ctx, 0, 0, W, H, 26);
  ctx.clip();
  softGlow(ctx, W - 60, 40, 260, "rgba(63,169,255,.14)");
  softGlow(ctx, 40, H - 60, 240, "rgba(255,45,71,.10)");
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "#3fa9ff";
  for (let gx = 30; gx < W; gx += 26) {
    for (let gy = 30; gy < H; gy += 26) {
      ctx.beginPath();
      ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  const outerBorder = ctx.createLinearGradient(0, 0, W, H);
  outerBorder.addColorStop(0, "rgba(63,169,255,.5)");
  outerBorder.addColorStop(1, "rgba(255,45,71,.35)");
  ctx.strokeStyle = outerBorder;
  ctx.lineWidth = 1.4;
  roundRect(ctx, 10, 10, W - 20, H - 20, 22);
  ctx.stroke();
  let y = PAD + 4;
  const emblemSize = 46;
  const emblemX = W - PAD - emblemSize;
  if (logoImg) {
    ctx.save();
    roundRect(ctx, emblemX, y, emblemSize, emblemSize, 14);
    ctx.clip();
    ctx.fillStyle = "#0d0c10";
    ctx.fillRect(emblemX, y, emblemSize, emblemSize);
    ctx.restore();
    ctx.strokeStyle = "rgba(63,169,255,.35)";
    ctx.lineWidth = 1;
    roundRect(ctx, emblemX, y, emblemSize, emblemSize, 14);
    ctx.stroke();
    drawImageContain(ctx, logoImg, emblemX, y, emblemSize, emblemSize, 5);
  } else {
    const emblemGrad = ctx.createLinearGradient(emblemX, y, emblemX + emblemSize, y + emblemSize);
    emblemGrad.addColorStop(0, "#3fa9ff");
    emblemGrad.addColorStop(1, "#57101a");
    ctx.fillStyle = emblemGrad;
    roundRect(ctx, emblemX, y, emblemSize, emblemSize, 14);
    ctx.fill();
    ctx.fillStyle = "#f9f9fc";
    ctx.font = "700 22px Tajawal, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("S", emblemX + emblemSize / 2, y + emblemSize / 2 + 1);
    ctx.textBaseline = "alphabetic";
  }
  ctx.fillStyle = "#f9f9fc";
  ctx.font = "700 21px Tajawal, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Solve_Ai", emblemX - 14, y + 20);
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "600 10px 'IBM Plex Mono', monospace";
  ctx.fillText("DIGITAL PRODUCT INVOICE", emblemX - 14, y + 38);
  ctx.textAlign = "left";
  ctx.fillStyle = "#5c5967";
  ctx.font = "600 9px 'IBM Plex Mono', monospace";
  ctx.fillText("INVOICE NO.", PAD, y + 12);
  ctx.fillStyle = "#f9f9fc";
  ctx.font = "700 16px 'IBM Plex Mono', monospace";
  ctx.fillText(invoiceId, PAD, y + 32);
  y += emblemSize + 26;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 34;
  const colW = (W - PAD * 2) / 3;
  const metaCols = [{
    label: "تاريخ الإصدار",
    value: date,
    x: W - PAD
  }, {
    label: "وقت الإصدار",
    value: time,
    x: W - PAD - colW
  }];
  ctx.textAlign = "right";
  metaCols.forEach(col => {
    ctx.fillStyle = "#5c5967";
    ctx.font = "600 10px 'IBM Plex Mono', monospace";
    ctx.fillText(col.label, col.x, y);
    ctx.fillStyle = "#f9f9fc";
    ctx.font = "700 15px Tajawal, sans-serif";
    ctx.fillText(col.value, col.x, y + 22);
  });
  const badgeW = 108;
  const badgeH = 30;
  const badgeX = PAD;
  const badgeY = y - 21;
  ctx.fillStyle = "rgba(63,169,255,.12)";
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 999);
  ctx.fill();
  ctx.strokeStyle = "rgba(63,169,255,.45)";
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 999);
  ctx.stroke();
  ctx.fillStyle = "#7ec8ff";
  ctx.font = "700 12px Tajawal, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✓ الحالة: مؤكد", badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
  ctx.textBaseline = "alphabetic";
  y += 58;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 34;
  ctx.textAlign = "right";
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "600 10px 'IBM Plex Mono', monospace";
  ctx.fillText("CUSTOMER", W - PAD, y);
  y += 26;
  const custRows = [["الاسم", data.name], ["رقم الهاتف", data.phone]];
  custRows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,.02)";
      ctx.fillRect(PAD - 10, y - 20, W - PAD * 2 + 20, 40);
    }
    ctx.fillStyle = "#918da0";
    ctx.font = "13px Tajawal, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(label, W - PAD, y);
    ctx.fillStyle = "#f9f9fc";
    ctx.font = "700 15px Tajawal, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(value || "-", PAD, y);
    ctx.textAlign = "right";
    y += 40;
  });
  y += 14;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 34;
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "600 10px 'IBM Plex Mono', monospace";
  ctx.fillText("PRODUCT", W - PAD, y);
  y += 20;
  const itemH = 74;
  const itemGrad = ctx.createLinearGradient(PAD, y, W - PAD, y + itemH);
  itemGrad.addColorStop(0, "rgba(63,169,255,.09)");
  itemGrad.addColorStop(1, "rgba(87,16,26,.09)");
  ctx.fillStyle = itemGrad;
  roundRect(ctx, PAD, y, W - PAD * 2, itemH, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(63,169,255,.22)";
  ctx.lineWidth = 1;
  roundRect(ctx, PAD, y, W - PAD * 2, itemH, 16);
  ctx.stroke();
  const iconCX = PAD + 34;
  const iconCY = y + itemH / 2;
  ctx.fillStyle = "rgba(63,169,255,.16)";
  ctx.beginPath();
  ctx.arc(iconCX, iconCY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7ec8ff";
  ctx.font = "16px 'Font Awesome 6 Free'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 14px Tajawal, sans-serif";
  ctx.fillText("Ai", iconCX, iconCY + 1);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "right";
  ctx.fillStyle = "#f9f9fc";
  ctx.font = "700 16px Tajawal, sans-serif";
  ctx.fillText("Solve_Ai — Lovable", W - PAD - 16, iconCY - 6);
  ctx.fillStyle = "#918da0";
  ctx.font = "12px Tajawal, sans-serif";
  ctx.fillText("ترخيص استخدام مفعّل", W - PAD - 16, iconCY + 16);
  y += itemH + 34;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 34;
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "600 10px 'IBM Plex Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText("WARRANTY", W - PAD, y);
  y += 22;
  const warrantyGap = 14;
  const warrantyW = (W - PAD * 2 - warrantyGap) / 2;
  const warrantyH = 108;
  const card1X = W - PAD - warrantyW;
  const card2X = card1X - warrantyGap - warrantyW;
  drawWarrantyCard(ctx, card1X, y, warrantyW, warrantyH, "ضمان استرداد الأموال", `في حالة وجود مشكلة كبيرة، استرداد المستحق خلال ${CONFIG.REFUND_WARRANTY_DAYS} أيام`, `حتى ${fmtDate(refundUntil)}`);
  drawWarrantyCard(ctx, card2X, y, warrantyW, warrantyH, "ضمان التشغيل", `تشغيل واستخدام الإضافة مضمون لمدة ${CONFIG.OPERATION_WARRANTY_DAYS} يوم`, `حتى ${fmtDate(operationUntil)}`);
  y += warrantyH + 34;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 34;
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "600 10px 'IBM Plex Mono', monospace";
  ctx.fillText("CUSTOMER FEEDBACK", W - PAD, y);
  y += 22;
  const opinion = data.opinion || "-";
  ctx.font = "14px Tajawal, sans-serif";
  const tmpLines = Math.ceil(ctx.measureText(opinion).width / (W - PAD * 2 - 48));
  const noteH = Math.max(78, 34 + tmpLines * 24);
  ctx.fillStyle = "rgba(255,255,255,.03)";
  roundRect(ctx, PAD, y, W - PAD * 2, noteH, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  roundRect(ctx, PAD, y, W - PAD * 2, noteH, 16);
  ctx.stroke();
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "700 22px Georgia, serif";
  ctx.textAlign = "right";
  ctx.fillText("”", W - PAD - 20, y + 34);
  ctx.fillStyle = "#d6d3e0";
  ctx.font = "14px Tajawal, sans-serif";
  wrapText(ctx, opinion, W - PAD - 24, y + 34, W - PAD * 2 - 48, 24);
  y += noteH + 40;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 34;
  drawBarcode(ctx, W / 2 - 90, y, 180, 30, seed);
  y += 50;
  ctx.textAlign = "center";
  ctx.fillStyle = "#5c5967";
  ctx.font = "11px Tajawal, sans-serif";
  ctx.fillText("تم إصدار هذه الفاتورة إلكترونيًا بواسطة Solve_Ai", W / 2, y);
  ctx.fillStyle = "#3fa9ff";
  ctx.font = "600 10px 'IBM Plex Mono', monospace";
  ctx.fillText(`VERIFY · ${invoiceId}`, W / 2, y + 20);
}
function setupStageParticles() {
  const canvas = document.getElementById("stage-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width, height, particles;
  const mouse = {
    x: null,
    y: null
  };
  const colors = ["rgba(63,169,255,", "rgba(255,45,71,", "rgba(249,249,252,"];
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(60, Math.floor(width * height / 24000));
    particles = Array.from({
      length: count
    }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.5 + 0.5,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  function step() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          p.x += dx / dist * 0.5;
          p.y += dy / dist * 0.5;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + "0.8)";
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(63,169,255,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!reduced) requestAnimationFrame(step);
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  step();
}
function setSafeSrc(el, src) {
  if (!el || !src) return;
  el.addEventListener("error", () => el.classList.add("broken"), {
    once: true
  });
  el.src = src;
}
function setSafeVideoSrc(el, src) {
  if (!el || !src) return;
  el.setAttribute("src", src);
}
document.addEventListener("DOMContentLoaded", () => {
  setSafeVideoSrc(document.getElementById("old-video"), CONFIG.VIDEO_SRC);
  setSafeVideoSrc(document.getElementById("new-video"), CONFIG.VIDEO_SRC);
  setSafeSrc(document.getElementById("try-img"), CONFIG.TRY_IMG_SRC);
  setSafeSrc(document.getElementById("hud-logo"), CONFIG.LOGO_SRC);
  document.querySelectorAll(".custom-player").forEach(initCustomPlayer);
  const termsLink = document.getElementById("terms-link-start");
  if (termsLink) termsLink.href = CONFIG.TERMS_URL;
  applyDownloadTarget(document.getElementById("btn-download-old"));
  applyDownloadTarget(document.getElementById("btn-download-main"));
  tickClock();
  setInterval(tickClock, 1000);
  setupStageParticles();
  attachRipple();
  runGreeting();
  buildQna();
  document.getElementById("btn-start-journey").addEventListener("click", () => goToScreen("whoareyou"));
  document.getElementById("btn-new-customer").addEventListener("click", () => {
    state.activeFlow = CONFIG.FLOW_NEW;
    goToScreen("newvideo");
  });
  document.getElementById("btn-old-customer").addEventListener("click", () => {
    state.activeFlow = CONFIG.FLOW_OLD;
    goToScreen("oldcode");
  });
  document.getElementById("btn-back-from-oldcode").addEventListener("click", () => goToScreen("whoareyou"));
  document.getElementById("btn-check-code").addEventListener("click", () => {
    const inputEl = document.getElementById("old-code-input");
    const input = inputEl.value;
    const errorEl = document.getElementById("code-error");
    if (codeContainsTarget(input)) {
      errorEl.classList.remove("show");
      showToast("تم التحقق بنجاح", "success");
      goToScreen("oldvideo");
    } else {
      errorEl.classList.add("show");
      inputEl.classList.remove("shake");
      void inputEl.offsetWidth;
      inputEl.classList.add("shake");
      showToast("الكود غير صحيح", "error");
    }
  });
  document.getElementById("old-code-input").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("btn-check-code").click();
  });
  document.getElementById("btn-show-old-video").addEventListener("click", () => {
    document.getElementById("old-video-box").classList.remove("hidden");
    document.getElementById("old-video").play().catch(() => {});
  });
  document.getElementById("btn-download-old").addEventListener("click", () => {
    showToast("جاري بدء التحميل", "success");
  });
  const newVideo = document.getElementById("new-video");
  document.getElementById("btn-watched-continue").addEventListener("click", () => {
    const minutes = Math.floor(newVideo.currentTime / 60);
    const seconds = Math.floor(newVideo.currentTime % 60).toString().padStart(2, "0");
    state.watchStoppedAt = newVideo.currentTime;
    openModal({
      title: "متأكد انك اتفرجت؟",
      sub: `وقفت عند الدقيقه ${minutes}:${seconds}`,
      actions: [{
        label: "هرجع اكمل الفيديو",
        onClick: () => newVideo.play().catch(() => {})
      }, {
        label: "نكمل",
        primary: true,
        onClick: () => goToScreen("download")
      }]
    });
  });
  document.getElementById("btn-download-main").addEventListener("click", () => {
    showToast("جاري بدء التحميل", "success");
  });
  document.getElementById("btn-downloaded-continue").addEventListener("click", () => goToScreen("tryit"));
  document.getElementById("btn-tried-continue").addEventListener("click", () => goToScreen("qna"));
  document.getElementById("btn-qna-continue").addEventListener("click", () => goToScreen("form"));
  const termsCheckbox = document.getElementById("form-terms");
  const continueBtn = document.getElementById("btn-form-continue");
  termsCheckbox.addEventListener("change", () => {
    continueBtn.disabled = !termsCheckbox.checked;
  });
  document.getElementById("data-form").addEventListener("submit", e => {
    e.preventDefault();
    if (!termsCheckbox.checked) {
      showToast("لازم توافق على شروط الاستخدام الاول", "error");
      return;
    }
    const name = document.getElementById("form-name").value.trim();
    const phone = document.getElementById("form-phone").value.trim();
    const opinion = document.getElementById("form-opinion").value.trim();
    if (!name || !phone || !opinion) {
      showToast("برجاء ملء كل البيانات", "error");
      return;
    }
    termsCheckbox.disabled = true;
    document.querySelector(".terms-row").classList.add("locked");
    document.getElementById("form-name").disabled = true;
    document.getElementById("form-phone").disabled = true;
    document.getElementById("form-opinion").disabled = true;
    state.formData = {
      name,
      phone,
      opinion
    };
    showToast("تم الحفظ بنجاح", "success");
    goToScreen("invoice");
    const renderInvoice = () => drawInvoice(state.formData);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(renderInvoice, 150));
    } else {
      setTimeout(renderInvoice, 150);
    }
  });
  document.getElementById("btn-download-invoice").addEventListener("click", () => {
    const canvas = document.getElementById("invoice-canvas");
    const link = document.createElement("a");
    link.download = "solve-ai-invoice.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("تم حفظ صوره الفاتوره", "success");
  });
});
