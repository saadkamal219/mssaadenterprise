
const CONFIG = { whatsapp: "8801926659041", phone: "8801926659041", email: "saadkamal219@gmail.com", facebook: "" };
window.CONFIG = CONFIG;
document.querySelectorAll("[data-c]").forEach(e => {
    const k = e.dataset.c, c = CONFIG;
    if (k === "phone" && c.phone) e.textContent = c.phone; else if (k === "email" && c.email) e.textContent = c.email;
    else if (k === "facebook" && c.facebook) e.href = c.facebook; else if (k === "wa" && c.whatsapp) { e.href = "https://wa.me/" + c.whatsapp; if (e.tagName === "A" && e.textContent.includes("[")) e.textContent = "+" + c.whatsapp }
});
const b = document.querySelector(".burger"), n = document.getElementById("nav");
b.onclick = () => { const o = n.classList.toggle("open"); b.setAttribute("aria-expanded", o); b.setAttribute("aria-label", o ? "মেনু বন্ধ করুন" : "মেনু খুলুন") };
const t = document.querySelector(".top"); addEventListener("scroll", () => t.classList.toggle("v", scrollY > 500)); t.onclick = () => scrollTo({ top: 0 });
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { threshold: .1 }) : null;
document.querySelectorAll(".rv").forEach(e => io ? io.observe(e) : e.classList.add("in"));
const lb = document.querySelector(".lb");
document.querySelectorAll(".gal img").forEach(i => i.onclick = () => { lb.querySelector("img").src = i.src; lb.querySelector("img").alt = i.alt; lb.hidden = false });
lb.onclick = () => lb.hidden = true; addEventListener("keydown", e => { if (e.key === "Escape") lb.hidden = true });
document.querySelectorAll(".fb").forEach(f => f.onclick = () => {
    document.querySelectorAll(".fb").forEach(x => x.classList.remove("on")); f.classList.add("on");
    document.querySelectorAll("#pg .card").forEach(c => c.hidden = f.dataset.f !== "সব প্রকল্প" && c.dataset.cat !== f.dataset.f)
});
const q = document.getElementById("q"); if (q) q.oninput = () => { let s = 0; document.querySelectorAll("#mg .mt").forEach(c => { const m = c.textContent.includes(q.value.trim()); c.hidden = !m; s += m }); document.getElementById("none").hidden = s > 0 };
