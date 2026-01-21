document.addEventListener('DOMContentLoaded', ()=>{
    const addBtns = document.querySelectorAll('.btn-add');
    const cart = {};
    const cartTableBody = document.querySelector('#cartTable tbody');
    const totalAmt = document.getElementById('totalAmt');
    const timeBtn = document.getElementById('timeBtn');
    const timeModal = document.getElementById('timeModal');
    const closeTime = document.getElementById('closeTime');
    const timeGrid = document.getElementById('timeGrid');
    const saveTime = document.getElementById('saveTime');
    const pickupDate = document.getElementById('pickupDate');
    let selectedTime = null;

    // Initialize date to today
    const today = new Date().toISOString().slice(0,10);
    pickupDate.value = today;

    addBtns.forEach(btn => btn.addEventListener('click', ()=>{
        const card = btn.closest('.dish-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        if(cart[id]){ cart[id].qty += 1; }
        else cart[id] = {id, name, price, qty:1};
        renderCart();
    }));

    function formatINR(n){
        // n is number in rupees
        return n.toLocaleString('en-IN', {style:'currency', currency:'INR'});
    }

    function renderCart(){
        cartTableBody.innerHTML = '';
        const items = Object.values(cart);
        if(items.length === 0){
            cartTableBody.innerHTML = '<tr class="empty"><td colspan="5">No items yet</td></tr>';
            totalAmt.textContent = formatINR(0);
            return;
        }
        let total = 0;
        items.forEach(it=>{
            const row = document.createElement('tr');
            const subtotal = +(it.price * it.qty);
            total += subtotal;
            row.innerHTML = `
                <td>${escapeHtml(it.name)}</td>
                <td><input type="number" min="1" value="${it.qty}" data-id="${it.id}" class="qty-input" style="width:60px"></td>
                <td>${formatINR(it.price)}</td>
                <td>${formatINR(subtotal)}</td>
                <td><button class="rm" data-id="${it.id}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
        });
        totalAmt.textContent = formatINR(total);

        // attach events
        cartTableBody.querySelectorAll('.rm').forEach(b=> b.addEventListener('click', ()=>{
            const id = b.dataset.id; delete cart[id]; renderCart();
        }));
        cartTableBody.querySelectorAll('.qty-input').forEach(inp=> inp.addEventListener('change', ()=>{
            const id = inp.dataset.id; let v = Number(inp.value); if(v<1) v=1; inp.value = v; cart[id].qty = v; renderCart();
        }));
    }

    // Time modal logic
    timeBtn.addEventListener('click', ()=>{ openTimeModal(); });
    closeTime.addEventListener('click', ()=>{ closeModal(); });
    saveTime.addEventListener('click', ()=>{ saveSelection(); });

    function openTimeModal(){
        generateTimeButtons();
        timeModal.classList.remove('hidden');
    }
    function closeModal(){ timeModal.classList.add('hidden'); }

    function generateTimeButtons(){
        timeGrid.innerHTML = '';
        // Opening hours: 12:00 to 21:00, every 15 minutes (like reference images)
        const start = 12*60; const end = 21*60; const step = 15;
        for(let m = start; m <= end; m += step){
            const h = Math.floor(m/60); const mm = m%60;
            const label = pad(h) + ':' + pad(mm) + (h>=12? ' PM' : ' AM');
            const btn = document.createElement('button'); btn.type='button'; btn.textContent = label; btn.dataset.time = `${pad(h)}:${pad(mm)}`;
            btn.addEventListener('click', ()=>{
                // deselect others
                timeGrid.querySelectorAll('button').forEach(b=> b.classList.remove('selected'));
                btn.classList.add('selected'); selectedTime = btn.dataset.time;
            });
            timeGrid.appendChild(btn);
        }
    }

    function saveSelection(){
        if(!selectedTime){ alert('Please pick a time'); return; }
        const mode = document.querySelector('input[name="mode"]:checked').value;
        const date = pickupDate.value;
        // show chosen info in button text
        timeBtn.textContent = `${mode.toUpperCase()}: ${date} ${formatTime(selectedTime)}`;
        closeModal();
    }

    // helper functions
    function pad(n){ return (''+n).padStart(2,'0'); }
    function formatTime(t){ // t like HH:MM
        const [hh,mm] = t.split(':').map(Number); const ampm = hh>=12? 'PM':'AM'; const h12 = ((hh+11)%12)+1; return `${h12}:${pad(mm)} ${ampm}`;
    }
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

    // checkout (simple behavior)
    document.getElementById('checkoutBtn').addEventListener('click', ()=>{
        const items = Object.values(cart);
        if(items.length===0){ alert('Add some items first'); return; }
        const mode = document.querySelector('input[name="mode"]:checked').value;
        const chosenTimeText = timeBtn.textContent.includes(':') ? timeBtn.textContent : 'No time selected';
        alert(`Order placed (${mode.toUpperCase()}).\n${chosenTimeText}\nTotal: ${totalAmt.textContent}`);
        // reset cart
        for(const k of Object.keys(cart)) delete cart[k];
        renderCart();
        timeBtn.textContent = 'Choose time';
    });

    // initial render
    renderCart();
});
