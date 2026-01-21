document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('bookingForm');
    const confirmBox = document.getElementById('confirm');
    const cancelBtn = document.getElementById('cancelBtn');

    cancelBtn.addEventListener('click', ()=>{
        form.reset();
        window.scrollTo({top:0,behavior:'smooth'});
    });

    form.addEventListener('submit', function(e){
        e.preventDefault();
        // simple validation
        const name = form.name.value.trim();
        const phone = form.phone.value.trim();
        const email = form.email.value.trim();
        const date = form.date.value;
        const time = form.time.value;
        const people = Number(form.people.value);

        if(!name){ return showError('Please enter your name.'); }
        if(!/^[0-9+\s\-()]{7,20}$/.test(phone)){ return showError('Please enter a valid phone number.'); }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ return showError('Please enter a valid email.'); }
        if(!date){ return showError('Please select a date.'); }
        if(!time){ return showError('Please select a time.'); }
        if(!people || people < 1){ return showError('Please enter number of people.'); }

        // all good -> show confirmation
        confirmBox.classList.remove('hidden');
        window.scrollTo({top:confirmBox.offsetTop - 20, behavior:'smooth'});

        // example: you might send data via fetch to server here
        // reset form after short delay
        setTimeout(()=>{
            form.reset();
        }, 1200);
    });

    function showError(msg){
        // small ephemeral error alert
        const el = document.createElement('div');
        el.textContent = msg;
        el.style.background = '#fff1f0';
        el.style.border = '1px solid #ffd6d0';
        el.style.padding = '10px 12px';
        el.style.borderRadius = '6px';
        el.style.margin = '12px 0';
        const wrap = document.querySelector('.booking-wrap');
        wrap.insertBefore(el, wrap.firstChild);
        setTimeout(()=> el.remove(), 3800);
    }
});
