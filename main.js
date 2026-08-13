const TERMS_URL = "https://crstudio911.github.io/hhkehbkhf6347WFGHJ649iffk/";

const reviews = [
  { stars: 5, img: "img/user1.jpg", name: "أحمد سعيد", text: "الاضافه سهلت عليا شغلي جدا وسريعه بشكل مش طبيعي." },
  { stars: 5, img: "img/user2.jpg", name: "منى عبدالله", text: "افضل حاجه اشتريتها الشهر ده، السعر مناسب جدا للجوده." },
  { stars: 5, img: "img/user3.jpg", name: "كريم فتحي", text: "تجربه ممتازه والدعم بيرد بسرعه لو في اي استفسار." },
  { stars: 5, img: "img/user4.jpg", name: "سارة يوسف", text: "التثبيت كان سهل جدا وواضح خطوه بخطوه." },
  { stars: 5, img: "img/user5.jpg", name: "محمود طارق", text: "بجد حاجه تستحق التجربه، هرشحها لأي حد بيدور علي حل زي كدا." },
  { stars: 5, img: "img/user6.jpg", name: "نور الهدى", text: "شغالة تمام على كل المتصفحات اللي جربتها." },
  {stars:5, img:"img/user8.jpg", name:"محمد عبد الوهاب", text:"بجد شئ ممتاز و وفر عليا فلوس كتير بارك الله فيكم"},
  {stars:3, img:"img/user9.jpg", name:"رامي عبد الله", text:"لحد دلوقتي كويسة و شغاله اتمني تفضل كدا بس بشكل عام جميله ماشاء الله"},
];

const faqs = [
  { q: "الاضافه دي شغاله على انهي متصفح؟", a: " Google Chrome, Microsoft Edge, Mozilla Firefox, Brave … واي متصفح مبني علي Chromium." },
  { q: "هل في دعم فني بعد الشراء؟", a: "اه طبعا، فريق الدعم موجود يساعدك في اي خطوه." },
  { q: "هل السعر شامل التحديثات؟", a: "اه، كل التحديثات المستقبليه متضمنه من غير اي تكلفه اضافيه." },
  { q: "هينفع استرجع فلوسي لو مكنتش عاجبني؟", a: "التفاصيل الكامله موجوده في صفحة شروط الاستخدام والخصوصيه." },
  { q: "الضمان؟", a: "ضمان تشغيل الإضافة بيستمر طول فترة الاشتراك أما بالنسبة لاسترجاع المبلغ فهو متاح خلال أول 10 أيام فقط يعني ببساطة إحنا بنضمن إن الإضافة تفضل شغالة معاك طول مدة الاشتراك ولو حصل أي مشكلة غير متوقعة وتوقفت الخدمة وكان اشتراكك لسه في أول 10 أيام هنرجعلك باقي المبلغ المستحق لكن لو فاتت الـ 10 أيام الاسترجاع مش بيكون متاح ومع ذلك إحنا بشكل مستمر بنقدّم تحديثات دورية عادة بتاخد من يوم إلى 3 أيام عمل كحد أقصى لضمان استمرار الخدمة بأفضل مستوى ولو لقدر الله ما قدرناش نوفر التحديث بيتم استرداد قيمة الاشتراك لو كنت لسه داخل فترة الضمان."},
  { q: "هل امان علي حسابي؟", a: "امان علي الحساب و في عملاء كتير بيتعاملو معانا و هي ملهاش اي علاقه بلحساب هي تعاملها فقط معا الشات"},
  { q: "هل الاضافه بتاخد وقت طويل عشان تتثبت؟", a: "لا، التثبيت بياخد اقل من دقيقتين لو اتبعت الخطوات اللي شفتها في الفيديو." },
  { q: "هل ينفع استخدمها على اكتر من جهاز؟", a: "جهاز واحد لان السريال بتاع المفتاح محفوظ علي" },
  { q: "سؤال اخر", a: "لو اسألتك مكنتش موجوده هنا تقدر تتواصل معا الدعم الفني"}
];

function starsMarkup(count) {
  let html = "";
  for (let i = 0; i < 5; i++) {
    html += `<i class="fa-solid fa-star" style="opacity:${i < count ? 1 : 0.25}"></i>`;
  }
  return html;
}

function reviewCard(r) {
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <div class="review-stars">${starsMarkup(r.stars)}</div>
    <p class="review-text">${r.text}</p>
    <div class="review-person">
      <img src="${r.img}" alt="${r.name}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'avatar-fallback',innerHTML:'<i class=\\'fa-solid fa-user\\'></i>'}))">
      <span>${r.name}</span>
    </div>
  `;
  return card;
}

function buildMarquee() {
  const rowRight = document.getElementById("row-right");
  const rowLeft = document.getElementById("row-left");
  if (!rowRight || !rowLeft) return;
  const half = Math.ceil(reviews.length / 2);
  const setA = reviews.slice(0, half);
  const setB = reviews.slice(half);
  [setA, setA].forEach((set) => set.forEach((r) => rowRight.appendChild(reviewCard(r))));
  [setB, setB].forEach((set) => set.forEach((r) => rowLeft.appendChild(reviewCard(r))));
}

function buildFaq() {
  const list = document.getElementById("faq-list");
  if (!list) return;
  faqs.forEach((f) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `
      <button class="faq-q">
        <span>${f.q}</span>
        <i class="fa-solid fa-plus"></i>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    `;
    const btn = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
    list.appendChild(item);
  });
}

function setupNavShadow() {
  const nav = document.getElementById("topbar");
  const bar = document.getElementById("progress-bar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.style.background = "rgba(5,5,6,.92)";
      nav.style.borderBottomColor = "#211f26";
    } else {
      nav.style.background = "linear-gradient(to bottom, rgba(5,5,6,.82), rgba(5,5,6,0))";
      nav.style.borderBottomColor = "transparent";
    }
    if (bar) {
      const scrolled = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : "0%";
    }
  });
}

function setupReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));
}

function setupMagneticCta() {
  const btn = document.getElementById("cta-magnetic");
  if (!btn || window.matchMedia("(pointer: coarse)").matches) return;
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${relX * 0.18}px, ${relY * 0.32}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
}

function setupCardTilt() {
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".review-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-2px)`;
  });
  document.addEventListener(
    "mouseleave",
    (e) => {
      const card = e.target.closest && e.target.closest(".review-card");
      if (card) card.style.transform = "";
    },
    true
  );
}

function setupHeroNetwork() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width, height, particles;
  const mouse = { x: null, y: null };
  const colors = ["rgba(63,169,255,", "rgba(255,45,71,", "rgba(249,249,252,"];

  function resize() {
    const hero = canvas.parentElement;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx / dist * 0.6;
          p.y += dy / dist * 0.6;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + "0.9)";
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(63,169,255,${0.14 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!reduced) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize);
  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  step();
}

document.addEventListener("DOMContentLoaded", () => {
  const termsLink = document.getElementById("terms-link");
  if (termsLink) termsLink.href = TERMS_URL;
  buildMarquee();
  buildFaq();
  setupNavShadow();
  setupReveal();
  setupMagneticCta();
  setupCardTilt();
  setupHeroNetwork();
});