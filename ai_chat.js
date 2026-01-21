/* Embedded chat widget logic (extracted from ai_chat.html) */
document.addEventListener('DOMContentLoaded', function(){
    // Elements inside the widget
    const chatLauncher = document.getElementById('chatLauncher');
    const chatPanel = document.getElementById('chatPanel');
    const chatMessages = document.getElementById('chat-messages-embed');
    const userInput = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const quickBtns = document.querySelectorAll('.chat-quick-btn');

    // Simple restaurant data (same as original)
    const restaurantData = {
        name: "Gourmet Delights",
        address: "123 Food Street, Culinary City",
        phone: "(123) 456-7890",
        email: "info@gourmetdelights.com",
        hours: { weekdays: "11:00 AM - 10:00 PM", weekends: "10:00 AM - 11:00 PM" },
        menu: {
            appetizers: [ {name:"Bruschetta", price:"₹ 650", description:"Toasted bread with tomatoes"}, {name:"Calamari", price:"₹ 750", description:"Crispy fried squid"} ],
            mains: [ {name:"Spaghetti Carbonara", price:"₹ 1200", description:"Classic pasta"}, {name:"Grilled Salmon", price:"₹ 1600", description:"Fresh salmon"} ],
            desserts: [ {name:"Tiramisu", price:"₹ 450"} ]
        },
        reservations: []
    };

    function toggleChat(){
        const open = !chatPanel.classList.contains('hidden');
        if(open){ chatPanel.classList.add('hidden'); chatLauncher.setAttribute('aria-expanded','false'); }
        else{ chatPanel.classList.remove('hidden'); chatLauncher.setAttribute('aria-expanded','true'); userInput.focus(); }
    }

    chatLauncher?.addEventListener('click', toggleChat);

    // helpers
    function addMessage(text, isUser=false){
        const d = document.createElement('div');
        d.className = 'message ' + (isUser? 'user-message' : 'bot-message');
        d.innerHTML = text;
        chatMessages.appendChild(d);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping(){
        const t = document.createElement('div'); t.className='typing-indicator'; t.id='chat-typing';
        t.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatMessages.appendChild(t); chatMessages.scrollTop = chatMessages.scrollHeight; return t;
    }

    function addBotMessage(html){
        const typing = showTyping();
        setTimeout(()=>{ typing.remove(); addMessage(html,false); }, 700);
    }

    function showMenu(){
        let html = `<div><p>Here's our delicious menu:</p>`;
        for(const cat in restaurantData.menu){
            html += `<div class="menu-card"><h4 style="text-transform:capitalize">${cat}</h4>`;
            restaurantData.menu[cat].forEach(it => {
                html += `<div style="display:flex;justify-content:space-between;padding:6px 0"><div><strong>${it.name}</strong><div style="font-size:12px;color:#666">${it.description||''}</div></div><div style="font-weight:700">${it.price}</div></div>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
        addBotMessage(html);
    }

    function showReservationForm(){
        const now = new Date(); const today = now.toISOString().split('T')[0]; const time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
        const form = `
            <div>
                <form id="chat-reservation-form">
                    <div style="margin-bottom:8px"><label>Name</label><input class="form-input" id="chat-res-name"></div>
                    <div style="margin-bottom:8px"><label>Phone</label><input class="form-input" id="chat-res-phone"></div>
                    <div style="margin-bottom:8px"><label>Date</label><input type="date" class="form-input" id="chat-res-date" min="${today}"></div>
                    <div style="margin-bottom:8px"><label>Time</label><input type="time" class="form-input" id="chat-res-time" value="${time}"></div>
                    <button type="submit" class="submit-btn" style="background:var(--chat-success);color:#fff;padding:6px 10px;border-radius:6px;border:none">Confirm</button>
                </form>
            </div>
        `;
        addBotMessage(form);
        setTimeout(()=>{
            const formEl = document.getElementById('chat-reservation-form');
            formEl?.addEventListener('submit', (e)=>{
                e.preventDefault();
                const name = document.getElementById('chat-res-name').value;
                const phone = document.getElementById('chat-res-phone').value;
                const date = document.getElementById('chat-res-date').value;
                const time = document.getElementById('chat-res-time').value;
                restaurantData.reservations.push({name,phone,date,time});
                addBotMessage(`<p>Thanks ${name}, your table on ${date} at ${time} is booked. We'll call ${phone} to confirm.</p>`);
            });
        }, 50);
    }

    function showHours(){ addBotMessage(`<p>Hours: ${restaurantData.hours.weekdays} (weekdays), ${restaurantData.hours.weekends} (weekends)</p>`); }
    function showLocation(){ addBotMessage(`<p>${restaurantData.name}<br>${restaurantData.address}<br>Phone: ${restaurantData.phone}</p>`); }

    function processInput(){
        const text = userInput.value.trim(); if(!text) return; addMessage(text,true); userInput.value='';
        setTimeout(()=>{
            const lt = text.toLowerCase();
            if(lt.includes('menu')||lt.includes('order')) showMenu();
            else if(lt.includes('book')||lt.includes('table')||lt.includes('reservation')) showReservationForm();
            else if(lt.includes('hour')||lt.includes('open')) showHours();
            else if(lt.includes('location')||lt.includes('address')) showLocation();
            else addBotMessage("I can show the menu, help you book a table, or give our hours and location.");
        },500);
    }

    sendBtn?.addEventListener('click', processInput);
    userInput?.addEventListener('keypress', e=>{ if(e.key==='Enter') processInput(); });

    quickBtns.forEach(b=> b.addEventListener('click', ()=>{
        const action = b.dataset.action; addMessage(b.innerHTML,true);
        setTimeout(()=>{ if(action==='menu') showMenu(); else if(action==='reservation') showReservationForm(); else if(action==='hours') showHours(); else if(action==='location') showLocation(); },300);
    }));

    // initial message
    setTimeout(()=> addBotMessage(`Hello! 👋 I'm FoodieBot at ${restaurantData.name}. How can I help?`),400);
});
