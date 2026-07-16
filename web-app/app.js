
/* Round One Step MVP
   1) Put your Supabase URL and anon key below.
   2) Upload this folder to Netlify.
   3) Current menu sends WhatsApp order to the existing n8n agent.
*/
const CONFIG = {
  whatsappNumber: "YOUR_WHATSAPP_NUMBER",
  supabaseUrl: "YOUR_SUPABASE_URL",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
  // Optional n8n webhook used by Paid & Close to reset customers.session_status to waiting_order.
  // Leave empty until you create the close-order-session webhook in n8n.
  closeSessionWebhook: "YOUR_N8N_CLOSE_SESSION_WEBHOOK"
};

let supabaseClient = null;
if (CONFIG.supabaseUrl.startsWith("http") && CONFIG.supabaseAnonKey.startsWith("ey")) {
  supabaseClient = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
}

const products = [
  // Hot Coffee
  ["espresso_macchiato","Espresso Macchiato","Hot Coffee",17,"https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=700&q=80"],
  ["flat_white","Flat White","Hot Coffee",22,"https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80"],
  ["spanish_latte_hot","Spanish Latte","Hot Coffee",27,"https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=700&q=80"],
  ["piccolo","Piccolo","Hot Coffee",18,"https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=700&q=80"],
  ["cortado","Cortado","Hot Coffee",20,"https://images.unsplash.com/photo-1579888071069-c107a6f79d82?auto=format&fit=crop&w=700&q=80"],
  ["espresso","Espresso","Hot Coffee",15,"https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=700&q=80"],
  ["spanish_cortado","Spanish Cortado","Hot Coffee",23,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  ["cappuccino","Cappuccino","Hot Coffee",25,"https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=80"],
  ["salted_caramel_latte","Salted Caramel Latte","Hot Coffee",28,"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"],
  ["latte","Latte","Hot Coffee",25,"https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=700&q=80"],
  ["affogato","Affogato","Hot Coffee",25,"https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=700&q=80"],
  ["americano","Americano","Hot Coffee",17,"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80"],
  // Iced Coffee
  ["spanish_latte_iced","Spanish Latte","Iced Coffee",27,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  ["iced_salted_caramel_latte","Iced Salted Caramel Latte","Iced Coffee",28,"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"],
  ["iced_latte","Iced Latte","Iced Coffee",25,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  ["iced_americano","Iced Americano","Iced Coffee",17,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  ["iced_cappuccino","Iced Cappuccino","Iced Coffee",25,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  ["iced_espresso","Iced Espresso","Iced Coffee",15,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  // Manual Brew
  ["iced_v60","Iced V60","Manual Brew",28,"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80"],
  ["hot_v60_special_beans","Hot V60 Special Beans","Manual Brew",35,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  ["cold_brew","Cold Brew","Manual Brew",25,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  // Iced Drinks
  ["green_matcha","Green Matcha","Iced Drinks",23,"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=80"],
  ["pink_matcha","Pink Matcha","Iced Drinks",25,"https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=700&q=80"],
  ["blue_matcha","Blue Matcha","Iced Drinks",25,"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80"],
  ["hibiscus","Hibiscus","Iced Drinks",22,"https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=80"],
  ["tiramisu_latte","Tiramisu Latte","Iced Drinks",32,"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"],
  // Desserts
  ["chocolate_molten_cup","Chocolate Molten Cup","Desserts",25,"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"],
  ["tiramisu_cup","Tiramisu Cup","Desserts",25,"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80"]
].map(([id,name,category,price,img])=>({id,name,category,price,img}));

const categories = ["Hot Coffee","Iced Coffee","Manual Brew","Iced Drinks","Desserts"];
const cart = {};
let currentTab = "Hot Coffee";


function queryParam(name){
  const normal = new URLSearchParams(window.location.search).get(name);
  if(normal) return normal;
  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  if(qIndex >= 0){
    return new URLSearchParams(hash.slice(qIndex+1)).get(name);
  }
  return "";
}

function getOrderContext(){
  const table = (queryParam("table") || queryParam("table_id") || "").trim();
  const typeFromUrl = (queryParam("type") || queryParam("order_type") || "").trim().toLowerCase();
  let orderType = table ? "dine_in" : (typeFromUrl === "dine_in" || typeFromUrl === "takeaway" ? typeFromUrl : "takeaway");
  return { orderType, tableId: table };
}

function setOrderType(type){
  const url = new URL(window.location.href);
  url.searchParams.set("type", type);
  if(type === "takeaway") url.searchParams.delete("table");
  history.replaceState(null, "", url.pathname + url.search + window.location.hash.split("?")[0]);
  render();
}

function orderTypeLabel(o){
  const type = (o.order_type || "unknown").toLowerCase();
  if(type === "dine_in") return `DINE IN${o.table_id ? " — Table " + o.table_id : ""}`;
  if(type === "takeaway") return "TAKEAWAY";
  return "UNKNOWN";
}

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

function route(){ return location.hash.replace("#/","") || "menu"; }
window.addEventListener("hashchange", render);

function header(active){
  return `
  <div class="topbar">
    <div class="nav">
      <div class="brand"><div class="logo">— ONE —</div><span>ROUND ONE STEP</span></div>
      <div class="navlinks">
        ${["menu","kitchen","waiter","reports"].map(r=>`<button class="${active===r?'active':''}" onclick="location.hash='/${r}'">${r.toUpperCase()}</button>`).join("")}
      </div>
    </div>
  </div>
  <section class="hero"><h1>ROUND ONE STEP</h1><p>COFFEE & MORE</p></section>`;
}

function render(){
  const r = route();
  const app = document.getElementById("app");
  if(r==="kitchen") app.innerHTML = header(r)+renderDashboard("kitchen");
  else if(r==="waiter") app.innerHTML = header(r)+renderDashboard("waiter");
  else if(r==="reports") app.innerHTML = header(r)+renderReports();
  else app.innerHTML = header("menu")+renderMenu();
  if(r==="menu"){ renderProducts(); renderCart(); }
  if(["kitchen","waiter","reports"].includes(r)){ loadOrders(r); }
}

function renderMenu(){
  const ctx = getOrderContext();
  const contextBadge = ctx.orderType === "dine_in"
    ? `<div class="order-context dinein">DINE IN${ctx.tableId ? ` — Table ${escapeHtml(ctx.tableId)}` : ""}</div>`
    : `<div class="order-context takeaway">TAKEAWAY</div>`;
  const typeControls = ctx.tableId
    ? `<div class="note">Table detected from QR code. Order type is set to Dine In automatically.</div>`
    : `<div class="order-type-toggle">
        <button class="${ctx.orderType==='takeaway'?'active':''}" onclick="setOrderType('takeaway')">Takeaway</button>
        <button class="${ctx.orderType==='dine_in'?'active':''}" onclick="setOrderType('dine_in')">Dine In</button>
      </div>`;
  return `
  <main class="wrap">
    <div class="tabs">${categories.map(c=>`<button class="${c===currentTab?'active':''}" onclick="currentTab='${c}';render()">${c}</button>`).join("")}</div>
    <div class="layout">
      <section>
        <div class="section-title"><h2>${currentTab}</h2></div>
        <div id="products" class="grid"></div>
      </section>
      <aside class="cart">
        <h2>Your Order</h2>
        ${contextBadge}
        ${typeControls}
        <div id="cartItems"></div>
        <div class="field"><label>Your Name (Optional)</label><input id="customerName" placeholder="Your name"></div>
        <div class="field"><label>${ctx.orderType==='dine_in' ? 'Table / Note' : 'Takeaway Name / Note'} (Optional)</label><input id="tableNumber" value="${escapeHtml(ctx.tableId)}" placeholder="${ctx.orderType==='dine_in' ? 'Detected from QR or enter table' : 'e.g. Badr / Pickup'}"></div>
        <div class="field"><label>Special Request (Optional)</label><textarea id="specialRequest" placeholder="Less sugar, no ice..."></textarea></div>
        <div class="total"><span>Total</span><span id="total">0 AED</span></div>
        <button class="cta" id="orderBtn" onclick="proceedToWhatsApp()" disabled>Order on WhatsApp</button>
        <div class="note">You will be redirected to WhatsApp with your order summary.</div>
      </aside>
    </div>
  </main>
  <div class="floating"><span id="mobileTotal">0 AED</span><button onclick="proceedToWhatsApp()">Order</button></div>`;
}

function renderProducts(){
  const el = document.getElementById("products");
  el.innerHTML = "";
  products.filter(p=>p.category===currentTab).forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <div class="price">${p.price}</div>
      <div class="qtybar">
        <button onclick="changeQty('${p.id}',-1)">−</button>
        <span id="qty-${p.id}">${cart[p.id]||0}</span>
        <button onclick="changeQty('${p.id}',1)">+</button>
      </div>`;
    el.appendChild(card);
  });
}

function changeQty(id, delta){
  cart[id] = Math.max(0,(cart[id]||0)+delta);
  const q = document.getElementById(`qty-${id}`);
  if(q) q.textContent = cart[id];
  renderCart();
}

function selected(){
  return products.filter(p=>cart[p.id]>0).map(p=>({...p,qty:cart[p.id], line_total:p.price*cart[p.id]}));
}

function renderCart(){
  const items = selected();
  const box = document.getElementById("cartItems");
  if(!box) return;
  box.innerHTML = items.length ? "" : `<div class="empty">No items selected yet.</div>`;
  items.forEach(i=>{
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `<div><div class="name">${i.name}</div><div class="sub">x${i.qty}</div></div><strong>${i.line_total}</strong><button class="xbtn" onclick="cart['${i.id}']=0;render()">×</button>`;
    box.appendChild(row);
  });
  const total = items.reduce((s,i)=>s+i.line_total,0);
  document.getElementById("total").textContent = `${total} AED`;
  document.getElementById("mobileTotal").textContent = `${total} AED`;
  document.getElementById("orderBtn").disabled = total===0;
}

function proceedToWhatsApp(){
  const items = selected();
  if(!items.length) return;
  const total = items.reduce((s,i)=>s+i.line_total,0);
  const name = document.getElementById("customerName")?.value || "";
  const ctx = getOrderContext();
  const tableInput = document.getElementById("tableNumber")?.value || "";
  const tableId = ctx.tableId || (ctx.orderType === "dine_in" ? tableInput : "");
  const takeawayNote = ctx.orderType === "takeaway" ? tableInput : "";
  const note = document.getElementById("specialRequest")?.value || "";
  const lines = items.map(i=>`- ${i.name} | Qty: ${i.qty} | Unit Price: ${i.price} AED`);
  const message = `NEW_RESTAURANT_ORDER\n\nRestaurant: Round One Step\nOrder Type: ${ctx.orderType}\nTable ID: ${tableId}\n\nItems:\n${lines.join("\n")}\n\nTotal: ${total} AED\n\nCustomer Name: ${name}\nTakeaway Name / Note: ${takeawayNote}\nSpecial Request: ${note}`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank");
}

function renderDashboard(type){
  const title = type==="kitchen" ? "Kitchen Dashboard" : "Waiter / Cashier Dashboard";
  const boardClass = type==="kitchen" ? "kitchen-board" : "waiter-board";
  const counters = type === "kitchen"
    ? [["Pending","countPending"],["Preparing","countPreparing"],["Ready","countReady"],["Requests","countRequests"]]
    : [["Ready","countReady"],["Served","countServed"],["Bill Requested","countBill"],["Requests","countRequests"]];
  return `
  <main class="wrap ${boardClass}">
    <div class="panel dashboard-head">
      <div>
        <h2>${title}</h2>
        <div class="small-muted" id="liveStatus">Live updates enabled</div>
      </div>
      <button class="cta" style="width:auto;padding:12px 18px" onclick="loadOrders('${type}')">Refresh</button>
    </div>
    <div class="counterbar" id="counterbar">
      ${counters.map(([label,id])=>`<div class="counter"><span>${label}</span><strong id="${id}">0</strong></div>`).join("")}
    </div>
    <div id="dashNotice" class="note" style="display:${supabaseClient?'none':'block'}">Add your Supabase URL and anon key in app.js to enable live data.</div>
    <div id="orders" class="orders"></div>
  </main>
  <div id="toast" class="toast">New order received</div>`;
}

async function loadOrders(type){
  const box = document.getElementById(type==="reports" ? "reportData" : "orders");
  if(!box || !supabaseClient) return;
  box.innerHTML = `<div class="empty">Loading...</div>`;

  let query = supabaseClient.from("orders").select("*").order("created_at",{ascending:false}).limit(100);
  if(type==="waiter"){
    query = query.in("order_status", ["ready","served","bill_requested","modification_requested","cancellation_requested"]);
  } else if(type==="kitchen"){
    query = query.in("order_status", ["pending","preparing","ready","modification_requested","cancellation_requested"]);
  }

  const {data,error} = await query;
  if(error){ box.innerHTML = `<div class="empty">${error.message}</div>`; return; }

  if(type==="reports"){ renderReportData(data||[]); return; }

  updateCounters(data||[], type);

  if(!data.length){ box.innerHTML = `<div class="empty">No active orders.</div>`; return; }
  box.innerHTML = data.map(o=>orderCard(o,type)).join("");
}

function updateCounters(data, type){
  const count = (status)=>data.filter(o=>o.order_status===status).length;
  const requests = data.filter(o=>["modification_requested","cancellation_requested"].includes(o.order_status)).length;
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  set("countPending", count("pending"));
  set("countPreparing", count("preparing"));
  set("countReady", count("ready"));
  set("countServed", count("served"));
  set("countBill", count("bill_requested"));
  set("countRequests", requests);
}

function orderCard(o,type){
  const items = Array.isArray(o.items) ? o.items.map(i=>`${i.name} x${i.qty}`).join("\n") : (o.items_text||"");
  const pillClass = `status-pill status-${o.order_status}`;
  const typeBadge = `<span class="type-badge type-${(o.order_type||'unknown').toLowerCase()}">${orderTypeLabel(o)}</span>`;
  const actions = type==="reports" ? `` : actionButtons(o,type);
  const requestNote = ["modification_requested","cancellation_requested"].includes(o.order_status)
    ? `<div class="request-alert">Action required by waiter / cashier</div>` : "";
  return `
  <div class="order-card" data-status="${o.order_status}">
    <div class="order-top">
      <div>
        <div class="order-id">${escapeHtml(o.order_id)}</div>
        <div>${escapeHtml(o.customer_name||"Guest")} · ${escapeHtml(o.customer_phone||"")}</div>
        <div class="small-muted">${formatTime(o.created_at)}</div>
      </div>
      <div class="badges"><span class="${pillClass}">${escapeHtml(o.order_status)}</span>${typeBadge}</div>
    </div>
    ${requestNote}
    <div class="order-items">${escapeHtml(items)}</div>
    <div><strong>Notes:</strong> ${escapeHtml(cleanNone(o.special_request))}</div>
    <div><strong>Total:</strong> ${escapeHtml(o.total)} AED</div>
    <div><strong>Payment:</strong> ${escapeHtml(o.payment_status || 'unpaid')}</div>
    <div class="actions">${actions}</div>
  </div>`;
}

function actionButtons(o,type){
  if(type === "kitchen"){
    if(o.order_status === "pending") return `<button class="btn-gold" onclick="updateOrder('${o.order_id}','preparing')">Start Preparing</button>`;
    if(o.order_status === "preparing") return `<button class="btn-dark" onclick="updateOrder('${o.order_id}','ready')">Mark Ready</button>`;
    if(o.order_status === "ready") return `<button class="btn-light" disabled>Waiting for waiter</button>`;
    return `<button class="btn-light" disabled>Waiter action required</button>`;
  }

  if(type === "waiter"){
    if(o.order_status === "ready") return `<button class="btn-gold" onclick="updateOrder('${o.order_id}','served')">Serve Order</button>`;
    if(o.order_status === "served") return `<button class="btn-dark" onclick="updateOrder('${o.order_id}','bill_requested')">Request Bill</button>`;
    if(o.order_status === "bill_requested") return `<button class="btn-dark" onclick="updateOrder('${o.order_id}','closed')">Paid & Close</button>`;
    if(o.order_status === "cancellation_requested") return `
      <button class="btn-danger" onclick="updateOrder('${o.order_id}','cancelled')">Approve Cancellation</button>
      <button class="btn-light" onclick="updateOrder('${o.order_id}','preparing')">Reject Cancellation</button>`;
    if(o.order_status === "modification_requested") return `
      <button class="btn-gold" onclick="updateOrder('${o.order_id}','pending')">Approve Modification</button>
      <button class="btn-light" onclick="updateOrder('${o.order_id}','preparing')">Reject Modification</button>`;
  }
  return ``;
}

function cleanNone(v){
  if(!v || v==="none") return "None";
  return v;
}

function formatTime(value){
  if(!value) return "";
  try{
    return new Date(value).toLocaleString();
  }catch(e){ return value; }
}

async function updateOrder(orderId,status){
  if(!supabaseClient) return alert("Supabase is not configured.");
  const now = new Date().toISOString();
  const updates = {order_status:status};

  // These column names match the current Supabase orders table.
  // Do not use served_at, bill_requested_at, or closed_at unless you add them to Supabase.
  if(status === "preparing") updates.preparing_at = now;
  if(status === "ready") updates.ready_at = now;
  if(status === "closed"){
    updates.payment_status = "paid";
    updates.completed_at = now;
  }
  if(status === "cancelled"){
    updates.payment_status = "unpaid";
    updates.cancelled_at = now;
  }

  const {data: orderRows, error: readError} = await supabaseClient
    .from("orders")
    .select("customer_phone")
    .eq("order_id", orderId)
    .limit(1);
  if(readError) return alert(readError.message);

  const {error} = await supabaseClient
    .from("orders")
    .update(updates)
    .eq("order_id", orderId);
  if(error) return alert(error.message);

  await supabaseClient
    .from("order_events")
    .insert({order_id:orderId,event_type:status,notes:`Status changed to ${status} from dashboard`});

  // Optional: call n8n to reset customers.session_status to waiting_order after Paid & Close.
  if(status === "closed" && CONFIG.closeSessionWebhook){
    try{
      await fetch(CONFIG.closeSessionWebhook, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({order_id:orderId, customer_phone: orderRows?.[0]?.customer_phone || ""})
      });
    }catch(e){ console.warn("close session webhook failed", e); }
  }

  await loadOrders(route());
  showToast(`Order ${orderId} updated to ${status}`);
}

function enableRealtime(){
  if(!supabaseClient) return;

  supabaseClient
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      async (payload) => {
        const current = route();
        if(["kitchen","waiter","reports"].includes(current)){
          await loadOrders(current);
        }

        if(payload.eventType === "INSERT"){
          showToast("🔔 New order received");
          playNotification();
        } else if(payload.eventType === "UPDATE") {
          showToast("Order status updated");
        }
      }
    )
    .subscribe((status) => {
      const el = document.getElementById("liveStatus");
      if(el) el.textContent = status === "SUBSCRIBED" ? "Live updates enabled" : `Realtime: ${status}`;
    });
}

function showToast(message){
  let toast = document.getElementById("toast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2600);
}

function playNotification(){
  try{
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
    audio.volume = 0.35;
    const promise = audio.play();
    if(promise && promise.catch) promise.catch(()=>{});
  }catch(e){}
}

function renderReports(){
  return `
  <main class="wrap">
    <div class="panel dashboard-head">
      <h2>Reports Dashboard</h2>
      <button class="cta" style="width:auto;padding:12px 18px" onclick="loadOrders('reports')">Refresh</button>
    </div>
    <div id="reportData"></div>
  </main>`;
}

function renderReportData(data){
  const today = new Date().toISOString().slice(0,10);
  const todayOrders = data.filter(o => (o.created_at||"").slice(0,10) === today);
  const revenue = todayOrders.filter(o=>["closed","paid"].includes(o.order_status) || o.payment_status === "paid").reduce((s,o)=>s+Number(o.total||0),0);
  const active = todayOrders.filter(o=>["pending","preparing","ready","served","bill_requested","modification_requested","cancellation_requested"].includes(o.order_status)).length;
  const closed = todayOrders.filter(o=>o.order_status==="closed" || o.payment_status === "paid").length;
  const cancelled = todayOrders.filter(o=>o.order_status==="cancelled").length;
  const dineIn = todayOrders.filter(o=>o.order_type==="dine_in").length;
  const takeaway = todayOrders.filter(o=>o.order_type==="takeaway").length;
  const aov = closed ? Math.round(revenue / closed) : 0;

  document.getElementById("reportData").innerHTML = `
    <div class="stats">
      <div class="stat">Today's Revenue<strong>${revenue} AED</strong></div>
      <div class="stat">Today's Orders<strong>${todayOrders.length}</strong></div>
      <div class="stat">Dine In<strong>${dineIn}</strong></div>
      <div class="stat">Takeaway<strong>${takeaway}</strong></div>
      <div class="stat">Active Orders<strong>${active}</strong></div>
      <div class="stat">Closed Orders<strong>${closed}</strong></div>
      <div class="stat">Cancelled<strong>${cancelled}</strong></div>
      <div class="stat">Average Order<strong>${aov} AED</strong></div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2 style="margin-top:0">Recent Orders</h2>
      <div class="orders">${data.map(o=>orderCard(o,"reports")).join("")}</div>
    </div>`;
}

render();
enableRealtime();
