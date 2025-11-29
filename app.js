const q = s => document.querySelector(s);
const nowYear = () => new Date().getFullYear();
if (q('#year')) q('#year').textContent = nowYear();
window.addEventListener('load', () => {
  const p = q('#preloader');
  if (p){ p.style.opacity = '0'; setTimeout(()=> p.style.display = 'none', 420); }
});
function loadUsers(){ return JSON.parse(localStorage.getItem('wanderly_users')||'[]'); }
function saveUsers(u){ localStorage.setItem('wanderly_users', JSON.stringify(u)); }
function setCurrentUser(e){ localStorage.setItem('wanderly_current', e); updateAuthUI(); }
function getCurrentUser(){ return localStorage.getItem('wanderly_current'); }
function updateAuthUI(){
  const u = getCurrentUser();
  const authLink = q('#authLink');
  const loginLink = q('#loginLink');
  const loginLink2 = q('#loginLink2');
  const dashboardLink = q('#dashboardLink');
  const myBookings = q('#myBookingsLink');
  if (authLink) authLink.textContent = u ? 'Account' : 'Log in';
  if (loginLink) loginLink.textContent = u ? 'Account' : 'Log in';
  if (loginLink2) loginLink2.textContent = u ? 'Account' : 'Log in';
  if (dashboardLink) dashboardLink.href = u ? 'dashboard.html' : 'login.html';
  if (myBookings) myBookings.href = u ? 'booking.html' : 'login.html';
}
const sampleTrips = [
  { id:'t1', type:'flight', title:'Lisbon — Roundtrip', desc:'Return flight, 4 days in Lisbon', price:349, departAirport:'DEL', arriveAirport:'LIS', duration:'8h 20m', stops:'Nonstop', img:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200', airline:'AirVista', logo:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
  { id:'t2', type:'flight', title:'Himachal Escape (Shimla)', desc:'Return flight + mountain stay, 7 days', price:279, departAirport:'DEL', arriveAirport:'IXU', duration:'3h 10m', stops:'1 stop', img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200', airline:'Horizon Air', logo:'https://images.unsplash.com/photo-1529429617124-5b1d68d8a0e0?w=200' },
  { id:'t3', type:'flight', title:'Bali Relax — Return', desc:'Return flight + resort, 6 days', price:599, departAirport:'BOM', arriveAirport:'DPS', duration:'9h 40m', stops:'1 stop', img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', airline:'IslandAir', logo:'https://images.unsplash.com/photo-1529257414772-1964b5ad6f1d?w=200' },
  { id:'t4', type:'flight', title:'Desert Rajasthan Tour (Jaisalmer)', desc:'Return flight + cultural tour, 5 days', price:199, departAirport:'DEL', arriveAirport:'JSA', duration:'2h 15m', stops:'Nonstop', img:'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1200', airline:'Desert Wings', logo:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=200' }
];
const resultsEl = q('#results');
function renderResults(trips){
  if (!resultsEl) return;
  if (!trips.length) { resultsEl.innerHTML = '<p class="muted">No results — try different dates or destination.</p>'; return; }
  resultsEl.innerHTML = trips.map(t=>`
    <div class="card" role="article">
      <div class="card-top">
        <img src="${t.img}" alt="${t.title}" onerror="this.src='https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800'">
        <div class="card-meta">
          <h4>${t.title}</h4>
          <p>${t.desc}</p>
          <div class="flight-info">
            <div class="airline-badge"><svg width="36" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12c0 5.523 4.477 10 10 10" stroke="#0B6CF0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2l-5 5" stroke="#0B6CF0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><div style="font-size:13px">${t.airline}</div></div>
            <div>${t.departAirport} → ${t.arriveAirport}</div>
            <div>· ${t.duration}</div>
            <div>· ${t.stops}</div>
          </div>
        </div>
        <div class="flight-path"><svg viewBox="0 0 80 40" preserveAspectRatio="none"><path class="path-stroke" d="M4 30 C22 12, 58 8, 76 2"></path><g class="plane-icon"><circle class="plane-dot" cx="0" cy="0" r="3"></circle></g></svg></div>
      </div>
      <div class="card-foot">
        <div class="price-badge">₹${t.price}</div>
        <div>
          <button class="btn primary" onclick="startBooking('${t.id}')">Book</button>
          <button class="btn ghost" onclick="viewDetails('${t.id}')">Details</button>
        </div>
      </div>
    </div>
  `).join('');
}
function viewDetails(id){
  const t = sampleTrips.find(x=>x.id===id);
  alert(`${t.title}\n\n${t.desc}\nFrom: ${t.departAirport}\nTo: ${t.arriveAirport}\nDuration: ${t.duration}\nPrice: ₹${t.price}`);
}
function startBooking(id){
  const user = getCurrentUser();
  if (!user){ alert('You need to log in to book. Redirecting to login.'); location.href = 'login.html'; return; }
  const trip = sampleTrips.find(x=>x.id===id);
  localStorage.setItem('wanderly_selected', JSON.stringify(trip));
  location.href = 'booking.html';
}
const searchForm = q('#searchForm');
if (searchForm){
  searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    const to = q('#to').value.trim().toLowerCase();
    const travelClass = q('#travelClass')?.value || 'economy';
    const results = sampleTrips.filter(t => t.title.toLowerCase().includes(to) || t.desc.toLowerCase().includes(to) || to==='');
    const adjusted = results.map(r => {
      let factor = travelClass === 'economy' ? 1 : travelClass==='premium' ? 1.45 : travelClass==='business' ? 2.2 : 3;
      return {...r, price: Math.round(r.price * factor)};
    });
    renderResults(adjusted);
  });
  q('#clearSearch')?.addEventListener('click', ()=>{ searchForm.reset(); renderResults(sampleTrips); });
  renderResults(sampleTrips);
}
const signupForm = q('#signupForm');
if (signupForm){
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = q('#signupName').value.trim();
    const email = q('#signupEmail').value.trim().toLowerCase();
    const pass = q('#signupPassword').value;
    const users = loadUsers();
    if (users.find(it=>it.email===email)){ q('#signupMsg').textContent = 'Account already exists. Please log in.'; return; }
    users.push({name, email, pass});
    saveUsers(users);
    q('#signupMsg').textContent = 'Account created — redirecting to login...';
    setTimeout(()=> location.href = 'login.html', 700);
  });
}
const loginForm = q('#loginForm');
if (loginForm){
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = q('#loginEmail').value.trim().toLowerCase();
    const pass = q('#loginPassword').value;
    const users = loadUsers();
    const user = users.find(it=>it.email===email && it.pass===pass);
    if (!user){ q('#loginError').textContent = 'Invalid credentials'; return; }
    setCurrentUser(user.email);
    location.href = 'index.html';
  });
}
const bookingDetails = q('#bookingDetails');
const confirmForm = q('#confirmBooking');
const seatModal = q('#seatModal');
const seatMap = q('#seatMap');
const closeSeat = q('#closeSeat');
const confirmSeats = q('#confirmSeats');
const resetSeats = q('#resetSeats');
let selectedSeats = [];
if (bookingDetails){
  const sel = JSON.parse(localStorage.getItem('wanderly_selected')||'null');
  const email = getCurrentUser();
  const users = loadUsers();
  const user = users.find(u=>u.email===email);
  if (!sel){
    bookingDetails.innerHTML = '<p class="muted">No trip selected. Go back to search to pick a trip.</p>';
    q('#confirmBooking').style.display = 'none';
  } else {
    bookingDetails.innerHTML = `
      <div><strong>${sel.title}</strong></div>
      <div class="muted">${sel.desc}</div>
      <div style="margin-top:10px">Route: <strong>${sel.departAirport}</strong> → <strong>${sel.arriveAirport}</strong></div>
      <div style="margin-top:10px;font-weight:700">Total: ₹${sel.price}</div>
    `;
    if (user) q('#confirmBooking').style.display = 'block';
    else { q('#bookingMsg').textContent = 'Please log in to confirm your booking.'; q('#confirmBooking').style.display = 'none'; }
  }
  q('#chooseSeat')?.addEventListener('click', e => {
    e.preventDefault();
    selectedSeats = [];
    openSeatMap();
  });
  confirmForm?.addEventListener('submit', e=>{
    e.preventDefault();
  });
  q('#proceedPayment')?.addEventListener('click', e=>{
    e.preventDefault();
    openPayment();
    const sel = JSON.parse(localStorage.getItem('wanderly_selected')||'null');
    if (sel) q('#payAmount').textContent = sel.price;
  });
}
function openSeatMap(){
  seatMap.innerHTML = '';
  const occupied = ['1B','2C','3D','4E','5A'];
  const rows = 8;
  const cols = ['A','B','C','D','E','F'];
  for (let r=1;r<=rows;r++){
    for (let c=0;c<cols.length;c++){
      const code = r+cols[c];
      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.textContent = code;
      if (occupied.includes(code)) seat.classList.add('occupied');
      seat.addEventListener('click', ()=> {
        if (seat.classList.contains('occupied')) return;
        if (seat.classList.contains('selected')){ seat.classList.remove('selected'); selectedSeats = selectedSeats.filter(s=>s!==code); }
        else { seat.classList.add('selected'); selectedSeats.push(code); }
        q('#seatSummary').textContent = selectedSeats.length ? 'Seats: '+selectedSeats.join(', ') : '';
      });
      seatMap.appendChild(seat);
    }
  }
  seatModal.classList.add('show');
}
closeSeat?.addEventListener('click', ()=> { seatModal.classList.remove('show'); });
resetSeats?.addEventListener('click', ()=> {
  selectedSeats = [];
  q('#seatSummary').textContent = '';
  openSeatMap();
});
confirmSeats?.addEventListener('click', ()=> {
  seatModal.classList.remove('show');
  q('#seatSummary').textContent = selectedSeats.length ? 'Seats: '+selectedSeats.join(', ') : 'No seats chosen';
});
const paymentModal = q('#paymentModal');
const closePayment = q('#closePayment');
const cancelPayment = q('#cancelPayment');
const payNow = q('#payNow');
function openPayment(){ paymentModal.classList.add('show'); }
closePayment?.addEventListener('click', ()=> paymentModal.classList.remove('show'));
cancelPayment?.addEventListener('click', ()=> paymentModal.classList.remove('show'));
payNow?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const name = q('#passengerName')?.value || '';
  const phone = q('#contactPhone')?.value || '';
  const sel = JSON.parse(localStorage.getItem('wanderly_selected')||'null');
  const users = loadUsers();
  const email = getCurrentUser();
  const user = users.find(u=>u.email===email);
  if (!sel || !user){ alert('Missing booking or user'); return; }
  const bookings = JSON.parse(localStorage.getItem('wanderly_bookings')||'[]');
  const booking = { id:'B'+Date.now(), user:email, name:user.name, passenger:name, trip:sel, phone, seats:selectedSeats, date:new Date().toISOString() };
  bookings.push(booking);
  localStorage.setItem('wanderly_bookings', JSON.stringify(bookings));
  localStorage.removeItem('wanderly_selected');
  paymentModal.classList.remove('show');
  await generatePdf(booking);
  location.href = 'dashboard.html';
});
async function generatePdf(b){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'a4' });
  doc.setFontSize(18);
  doc.text('Wanderly — Booking Confirmation', 40, 60);
  doc.setFontSize(12);
  doc.text(`Booking ID: ${b.id}`, 40, 100);
  doc.text(`Passenger: ${b.passenger}`, 40, 120);
  doc.text(`Contact: ${b.phone}`, 40, 140);
  doc.text(`Trip: ${b.trip.title}`, 40, 160);
  doc.text(`Route: ${b.trip.departAirport} → ${b.trip.arriveAirport}`, 40, 180);
  doc.text(`Seats: ${b.seats.length ? b.seats.join(', ') : 'Not selected'}`, 40, 200);
  doc.text(`Price: ₹${b.trip.price}`, 40, 220);
  doc.text(`Date: ${new Date(b.date).toLocaleString()}`, 40, 240);
  doc.save(`Wanderly-${b.id}.pdf`);
}
const bookingsList = q('#bookingsList');
if (bookingsList){
  updateAuthUI();
  const email = getCurrentUser();
  const bookings = JSON.parse(localStorage.getItem('wanderly_bookings')||'[]').filter(b => b.user === email);
  const noBookings = q('#noBookings');
  if (!bookings.length){ noBookings.textContent = 'You have no bookings yet — find a trip and book!'; bookingsList.innerHTML = ''; }
  else {
    noBookings.textContent = '';
    bookingsList.innerHTML = bookings.map(b => `
      <div class="booking-item" data-id="${b.id}">
        <img src="${b.trip.img}" alt="${b.trip.title}">
        <div class="booking-meta">
          <h4>${b.trip.title}</h4>
          <p>${b.passenger || b.name} · ₹${b.trip.price} · ${new Date(b.date).toLocaleString()}</p>
          <p class="muted">Seats: ${b.seats && b.seats.length ? b.seats.join(', ') : '—'}</p>
        </div>
        <div class="booking-actions">
          <button class="btn ghost" onclick="viewBooking('${b.id}')">View</button>
          <button class="btn primary" onclick="cancelBooking('${b.id}')">Cancel</button>
        </div>
      </div>
    `).join('');
  }
}
function viewBooking(id){
  const bookings = JSON.parse(localStorage.getItem('wanderly_bookings')||'[]');
  const b = bookings.find(x=>x.id===id);
  if (!b) return alert('Booking not found');
  alert(`Booking ${b.id}\nTrip: ${b.trip.title}\nPassenger: ${b.passenger || b.name}\nPhone: ${b.phone}\nSeats: ${b.seats?.join(', ') || '—'}\nPrice: ₹${b.trip.price}`);
}
function cancelBooking(id){
  if (!confirm('Cancel this booking?')) return;
  let bookings = JSON.parse(localStorage.getItem('wanderly_bookings')||'[]');
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('wanderly_bookings', JSON.stringify(bookings));
  location.reload();
}
updateAuthUI();
(function seedDemo(){
  const u = loadUsers();
  if (!u.find(x=>x.email==='demo@wanderly.com')){ u.push({name:'Demo User', email:'demo@wanderly.com', pass:'demo123'}); saveUsers(u); }
})();
// --- Choose Seat ---
const chooseSeatBtn = document.getElementById("chooseSeat");
if (chooseSeatBtn) {
  chooseSeatBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Simple seat selection using prompt
    let seat = prompt("Enter seat number (e.g., A1, B2):");

    if (seat) {
      localStorage.setItem("wanderly_selectedSeat", seat);
      alert("Seat selected: " + seat);
    }
  });
}

// --- Proceed to Pay ---
const payBtn = document.getElementById("proceedPayment");
if (payBtn) {
  payBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("passengerName").value.trim();
    const seat = localStorage.getItem("wanderly_selectedSeat");

    if (!name) {
      alert("Enter passenger name");
      return;
    }
    if (!seat) {
      alert("Please choose a seat first!");
      return;
    }

    alert(
      "Booking confirmed!\nPassenger: " +
        name +
        "\nSeat: " +
        seat +
        "\nPayment Successful!"
    );

    // optional: clear seat
    localStorage.removeItem("wanderly_selectedSeat");
  });
}
