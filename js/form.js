
const f=document.getElementById("form"),msg=document.getElementById("fm");
f.addEventListener("submit",e=>{e.preventDefault();let ok=true;
 f.querySelectorAll(".em").forEach(x=>x.remove());f.querySelectorAll(".err").forEach(x=>x.classList.remove("err"));
 const bad=(el,m)=>{ok=false;el.classList.add("err");const s=document.createElement("span");s.className="em";s.textContent=m;el.parentNode.appendChild(s)};
 f.querySelectorAll("[required]").forEach(el=>{if(!el.value.trim())bad(el,"এই তথ্যটি আবশ্যক।")});
 const p=f.phone;if(p.value.trim()&&!/^(\+?88)?01[3-9]\d{8}$/.test(p.value.replace(/[\s-]/g,"").replace(/[০-৯]/g,d=>"০১২৩৪৫৬৭৮৯".indexOf(d))))bad(p,"সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)।");
 if(f.email.value&&!f.email.validity.valid)bad(f.email,"সঠিক ইমেইল ঠিকানা দিন।");
 msg.style.color="#c0392b";if(!ok){msg.textContent="অনুগ্রহ করে চিহ্নিত তথ্যগুলো ঠিক করুন।";return}
 const wa=(window.CONFIG&&CONFIG.whatsapp||"").trim();
 if(!wa){msg.textContent="হোয়াটসঅ্যাপ নম্বর এখনো কনফিগার করা হয়নি, তাই তথ্য পাঠানো যায়নি। অনুগ্রহ করে অন্য মাধ্যমে যোগাযোগ করুন।";return}
 const v=n=>f[n].value.trim()||"—",sv=[...f.querySelectorAll("[name=service]:checked")].map(x=>x.value).join(", ")||"—";
 const t=`নতুন অনুসন্ধান\nনাম: ${v("name")}\nমোবাইল: ${v("phone")}\nইমেইল: ${v("email")}\nঅবস্থান: ${v("loc")}\nজমির পরিমাণ: ${v("land")}\nপ্রকল্পের ধরন: ${v("type")}\nবাজেট: ${v("budget")}\nতলা: ${v("floors")}\nসেবা: ${sv}\nবিবরণ: ${v("msg")}`;
 window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(t),"_blank","noopener");
 msg.style.color="#1a7f4b";msg.textContent="হোয়াটসঅ্যাপ খোলা হয়েছে। সেখানে বার্তাটি পাঠালে আমরা আপনার সঙ্গে যোগাযোগ করব।"});
