function showPortion(portionId, btnElement) {
    document.querySelectorAll('.portion').forEach(portion => portion.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById('portion-' + portionId).classList.add('active');
    btnElement.classList.add('active');
}

function saveDiary(event) {
    event.preventDefault();

    const date = document.getElementById('diary-date').value;
    const caseTitle = document.getElementById('diary-case').value;
    const court = document.getElementById('diary-court').value;
    const stage = document.getElementById('diary-stage').value;

    const rowHTML = `
        <tr>
            <td>${date}</td>
            <td><strong>${caseTitle}</strong></td>
            <td>${court}</td>
            <td>${stage}</td>
        </tr>
    `;

    document.getElementById('diary-records-body').insertAdjacentHTML('afterbegin', rowHTML);
    document.getElementById('diary-form').reset();
}

function saveBilling(event) {
    event.preventDefault();

    const client = document.getElementById('bill-client').value;
    const caseRef = document.getElementById('bill-case').value;
    const total = parseFloat(document.getElementById('bill-amount').value);
    const paid = parseFloat(document.getElementById('bill-paid').value);
    const balance = total - paid;

    const isCleared = balance <= 0;
    const badgeHTML = isCleared 
        ? `<span class="badge cleared">Cleared</span>`
        : `<span class="badge due">Due: PKR ${balance.toLocaleString()}</span>`;

    const rowHTML = `
        <tr>
            <td><strong>${client}</strong></td>
            <td>${caseRef}</td>
            <td>PKR ${total.toLocaleString()}</td>
            <td>PKR ${paid.toLocaleString()}</td>
            <td>${badgeHTML}</td>
        </tr>
    `;

    document.getElementById('billing-records-body').insertAdjacentHTML('afterbegin', rowHTML);
    document.getElementById('billing-form').reset();
}

function calculateExpenses() {
    const stampRate = parseFloat(document.getElementById('calc-stamp').value) || 0;
    const claimVal = parseFloat(document.getElementById('calc-claim').value) || 0;
    const pages = parseFloat(document.getElementById('calc-pages').value) || 0;

    const courtFee = claimVal * (stampRate / 100);
    const printingCost = pages * 20;
    const total = courtFee + printingCost;

    const box = document.getElementById('calc-output');
    box.style.display = 'block';
    box.innerHTML = `
        <div><strong>Court Stamp Duty:</strong> PKR ${courtFee.toLocaleString()}</div>
        <div><strong>Printing/Material Expense:</strong> PKR ${printingCost.toLocaleString()}</div>
        <hr style="border:0; border-top:1px solid #cbd5e1; margin: 8px 0;">
        <div style="color: var(--cms-red); font-weight: bold;">Total Estimated Expense: PKR ${total.toLocaleString()}</div>
    `;
}

function onChatEnter(event) {
    if (event.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const display = document.getElementById('chat-box');
    const text = input.value.trim();

    if (!text) return;

    display.innerHTML += `<div class="chat-bubble user">${text}</div>`;
    input.value = '';
    display.scrollTop = display.scrollHeight;

    let reply = "Thank you for contacting the CMS office portal. Please visit during court hours for official filings.";
    const query = text.toLowerCase();

    if (query.includes('court') || query.includes('judge') || query.includes('division')) {
        reply = "Divisions include: Additional Session Judge, Civil Judge Hifsa Bukhari (INJRA), Civil Judge Yousuf Abdur Rehman (Jand), and Civil Judge Najaam Ayub.";
    } else if (query.includes('injra')) {
        reply = "INJRA Division is presided over by Civil Judge Hifsa Bukhari.";
    } else if (query.includes('jand')) {
        reply = "Jand Division is presided over by Civil Judge Yousuf Abdur Rehman.";
    }

    setTimeout(() => {
        display.innerHTML += `<div class="chat-bubble bot">${reply}</div>`;
        display.scrollTop = display.scrollHeight;
    }, 400);
}
// Module Switcher
function switchCalcModule(modId, btn) {
    document.querySelectorAll('.calc-module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));

    document.getElementById('module-' + modId).classList.add('active');
    btn.classList.add('active');
}

// -------------------------------------------------------------
// 1. GENERAL CALCULATOR LOGIC
// -------------------------------------------------------------
let genExpression = '';

function calcInput(val) {
    const display = document.getElementById('gen-display');
    if (display.value === '0' && val !== '.') {
        genExpression = '';
    }
    genExpression += val;
    display.value = genExpression;
}

function calcClearAll() {
    genExpression = '';
    document.getElementById('gen-display').value = '0';
    document.getElementById('gen-history').innerText = '';
}

function calcDeleteOne() {
    const display = document.getElementById('gen-display');
    genExpression = genExpression.slice(0, -1);
    display.value = genExpression.length > 0 ? genExpression : '0';
}

function calcEquals() {
    const display = document.getElementById('gen-display');
    const history = document.getElementById('gen-history');
    
    if (!genExpression) return;

    try {
        history.innerText = genExpression + ' =';
        let evalResult = Function('"use strict";return (' + genExpression + ')')();
        
        if (typeof evalResult === 'number' && !isNaN(evalResult)) {
            display.value = Number(evalResult.toFixed(6));
            genExpression = display.value;
        } else {
            display.value = 'Error';
            genExpression = '';
        }
    } catch (e) {
        display.value = 'Error';
        genExpression = '';
    }
}

// -------------------------------------------------------------
// 2. LAND SHARE COMPUTATION
// -------------------------------------------------------------
function computeLandShare() {
    const k = parseFloat(document.getElementById('land-kanal').value) || 0;
    const m = parseFloat(document.getElementById('land-marla').value) || 0;
    const s = parseFloat(document.getElementById('land-sarsai').value) || 0;
    const totalShares = parseFloat(document.getElementById('land-total-shares').value) || 0;
    const userShares = parseFloat(document.getElementById('land-user-shares').value) || 0;
    const out = document.getElementById('land-output');

    if (totalShares <= 0 || userShares <= 0) {
        out.style.display = 'block';
        out.innerHTML = '<b style="color:red;">Please enter valid Total and Litigant Shares.</b>';
        return;
    }

    // Convert total land to Sarsai (1 Kanal = 180 Sarsai, 1 Marla = 9 Sarsai)
    const totalSarsai = (k * 180) + (m * 9) + s;
    const userSarsaiTotal = (totalSarsai / totalShares) * userShares;

    const resKanal = Math.floor(userSarsaiTotal / 180);
    let rem = userSarsaiTotal % 180;
    const resMarla = Math.floor(rem / 9);
    const resSarsai = (rem % 9).toFixed(2);

    out.style.display = 'block';
    out.innerHTML = `
        <h4 style="color:var(--cms-navy); margin-bottom:5px;">Claimant Land Division Result:</h4>
        <p style="font-size:1.1rem; font-weight:bold; color:var(--cms-gold);">
            ${resKanal} Kanal - ${resMarla} Marla - ${resSarsai} Sarsai
        </p>
        <small style="color:gray;">Base Calculation: ${userShares}/${totalShares} Share of ${k}K-${m}M-${s}S</small>
    `;
}

// -------------------------------------------------------------
// 3. AGE COMPUTATION
// -------------------------------------------------------------
function computeAge() {
    const dob = document.getElementById('dob-val').value;
    const target = document.getElementById('target-date-val').value;
    const out = document.getElementById('age-output');

    if (!dob || !target) {
        out.style.display = 'block';
        out.innerHTML = '<b style="color:red;">Please select both dates.</b>';
        return;
    }

    let d1 = new Date(dob);
    let d2 = new Date(target);

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
        months--;
        let prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    out.style.display = 'block';
    out.innerHTML = `
        <h4 style="color:var(--cms-navy);">Calculated Age:</h4>
        <p style="font-size:1.2rem; font-weight:bold; color:var(--cms-navy); margin-top:4px;">
            ${years} Years, ${months} Months, ${days} Days
        </p>
    `;
}

// Set Today Date on Load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const targetEl = document.getElementById('target-date-val');
    if (targetEl) targetEl.value = today;
});

// -------------------------------------------------------------
// 4. COURT EXPENSE COMPUTATION
// -------------------------------------------------------------
function computeCourtExpenses() {
    const rate = parseFloat(document.getElementById('court-stamp-rate').value) || 0;
    const claim = parseFloat(document.getElementById('court-claim-val').value) || 0;
    const pages = parseFloat(document.getElementById('court-pages-val').value) || 0;
    const out = document.getElementById('court-output');

    const duty = claim * (rate / 100);
    const printing = pages * 20;
    const total = duty + printing;

    out.style.display = 'block';
    out.innerHTML = `
        <p><strong>Stamp Duty (${rate}%):</strong> PKR ${duty.toLocaleString()}</p>
        <p><strong>Printing Expense (${pages} pages):</strong> PKR ${printing.toLocaleString()}</p>
        <hr style="margin:8px 0; border:0; border-top:1px solid #ddd;">
        <p style="font-size:1.1rem; font-weight:bold; color:var(--cms-red);">
            Total Estimated Fee: PKR ${total.toLocaleString()}
        </p>
    `;
}