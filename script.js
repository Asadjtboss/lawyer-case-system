// -------------------------------------------------------------
// 1. NAVIGATION & THEME SWITCHER
// -------------------------------------------------------------
function showPortion(portionId, btnElement) {
    document.querySelectorAll('.portion').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('portion-' + portionId).classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const btn = document.getElementById('theme-toggle-btn');
    if (document.body.classList.contains('dark-theme')) {
        btn.innerText = '☀️ Light Mode';
        localStorage.setItem('cms_theme', 'dark');
    } else {
        btn.innerText = '🌙 Dark Mode';
        localStorage.setItem('cms_theme', 'light');
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.className = "toast-notification show";
    setTimeout(() => { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

function focusAssistant() {
    const panel = document.querySelector('.assistant-panel');
    const input = document.getElementById('assistant-input');
    if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (input) {
        input.focus();
        input.select();
        setTimeout(() => {
            input.focus();
            input.select();
        }, 250);
    }
}

function selectLockerItem(itemName) {
    const fileCards = document.querySelectorAll('.file-card, .locker-drawer');
    fileCards.forEach(card => {
        const isSelected = card.textContent.trim() === itemName;
        card.classList.toggle('selected', isSelected);
    });

    const lockerInput = document.getElementById('locker-type');
    if (lockerInput && itemName) {
        lockerInput.value = itemName;
    }

    showToast(`${itemName} selected in locker.`);
}

function addAssistantMessage(text, isUser) {
    const box = document.getElementById('assistant-chat-box');
    if (!box) return;
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble ' + (isUser ? 'assistant-user' : 'assistant-bot');
    bubble.textContent = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
}

function getAssistantReply(query) {
    const q = query.toLowerCase();
    const sessionUser = getCurrentUser();
    const userName = sessionUser ? (sessionUser.fullName || sessionUser.username) : 'Advocate';

    if (q.includes('hearing') || q.includes('court') || q.includes('brief')) {
        return `For ${userName}, review the cause list, confirm the next hearing date, and verify the court stage before filing. Keep a brief checklist for client updates and document references.`;
    }
    if (q.includes('billing') || q.includes('fee') || q.includes('payment') || q.includes('invoice')) {
        return 'Check pending fee entries against each client ledger. Mark all paid amounts, follow up on overdue balances, and ensure receipts are uploaded before the next hearing.';
    }
    if (q.includes('document') || q.includes('locker') || q.includes('file') || q.includes('evidence')) {
        return 'Use the locker section to organize the final plaint, annexures, registry copies, and evidentiary documents. Confirm the latest version before court submission.';
    }
    if (q.includes('summary') || q.includes('case') || q.includes('matter')) {
        return 'Prepare a short case summary with facts, prayer, current stage, limitation status, and next action. This helps in quick court preparation and client communication.';
    }
    if (q.includes('follow') || q.includes('client') || q.includes('update')) {
        return 'Send a concise client update on hearing status, required documents, and any action that needs their response. Keep it factual and time-bound.';
    }
    return 'I can help with hearing prep, document audit, fee review, and next-step drafting. Ask about a specific case stage or legal task for a sharper answer.';
}

function askAssistantPreset(type) {
    const promptMap = {
        hearing: 'Prepare a hearing checklist for today and remind me of the next court action.',
        billing: 'Check all unpaid fees and identify pending client balances.',
        document: 'Audit the evidence locker and confirm required documents before filing.',
        summary: 'Summarize the active case status and highlight the next legal step.'
    };

    const presetPrompt = promptMap[type] || promptMap.summary;
    const input = document.getElementById('assistant-input');
    if (input) input.value = presetPrompt;
    askAssistant();
}

function askAssistant() {
    const input = document.getElementById('assistant-input');
    const box = document.getElementById('assistant-chat-box');
    if (!input || !box) return;

    const text = input.value.trim();
    if (!text) {
        showToast('Type a question or choose a quick action.');
        return;
    }

    addAssistantMessage(text, true);
    const reply = getAssistantReply(text);

    setTimeout(() => {
        addAssistantMessage(reply, false);
    }, 250);

    input.value = '';
    box.scrollTop = box.scrollHeight;
}
function getCurrentUser() {
    const raw = localStorage.getItem('cms_current_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
}

function getUsers() {
    const raw = localStorage.getItem('cms_users');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem('cms_users', JSON.stringify(users));
}

function ensureDefaultUser() {
    const users = getUsers();
    const exists = users.some(user => user.username.toLowerCase() === 'advocate');
    if (!exists) {
        users.push({
            username: 'advocate',
            password: 'admin123',
            fullName: 'Advocate Ifthekhar Ahmad Khan',
            role: 'Advocate'
        });
        saveUsers(users);
    }
}

function updateAuthUI() {
    const user = getCurrentUser();
    const loggedOut = document.getElementById('auth-logged-out');
    const loggedIn = document.getElementById('auth-logged-in');
    const badge = document.getElementById('auth-state-badge');
    const welcomeName = document.getElementById('logged-user-name');
    const roleLabel = document.getElementById('user-role-label');
    const summary = document.getElementById('status-summary');

    if (loggedOut && loggedIn) {
        loggedOut.classList.toggle('hidden', !!user);
        loggedIn.classList.toggle('hidden', !user);
    }

    if (badge) {
        badge.textContent = user ? 'User Logged In' : 'Guest Access';
        badge.className = 'auth-badge ' + (user ? 'user' : 'guest');
    }

    if (welcomeName && user) {
        welcomeName.textContent = user.fullName || user.username;
    }

    if (roleLabel && user) {
        roleLabel.textContent = user.role || 'Case Manager';
    }

    if (summary) {
        if (!user) {
            summary.textContent = 'Login to view your personal case status updates.';
            return;
        }

        const defaultDiary = [
            { date: '2026-08-25', title: 'Civil Suit #45/2026', court: 'Civil Judge Hifsa Bukhari (INJRA Division)', stage: 'Arguments Hearing', status: 'Pending', owner: 'advocate' },
            { date: '2026-08-28', title: 'Bail App #12/2026', court: 'District & Session Judge Attock', stage: 'Prosecution Response', status: 'Hearing Listed', owner: 'advocate' }
        ];
        const storedDiary = JSON.parse(localStorage.getItem('cms_diary_data') || 'null');
        const allDiary = Array.isArray(storedDiary) && storedDiary.length ? storedDiary : defaultDiary;
        const userDiary = allDiary.filter(item => !item.owner || item.owner === user.username);
        const pending = userDiary.filter(item => (item.status || 'Pending') === 'Pending').length;
        const progress = userDiary.filter(item => (item.status || 'Pending') === 'In Progress').length;
        const hearing = userDiary.filter(item => (item.status || 'Pending') === 'Hearing Listed').length;
        const closed = userDiary.filter(item => (item.status || 'Pending') === 'Closed').length;
        summary.textContent = `${userDiary.length} personal matters: ${pending} pending, ${progress} in progress, ${hearing} hearing, ${closed} closed.`;
    }
}

function registerUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        showToast('Please enter username and password.');
        return;
    }

    const users = getUsers();
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        showToast('This username already exists.');
        return;
    }

    const user = {
        username,
        password,
        fullName: username,
        role: 'Advocate'
    };

    users.push(user);
    saveUsers(users);
    localStorage.setItem('cms_current_user', JSON.stringify(user));
    updateAuthUI();
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    showToast('Account created and logged in!');
}

function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const users = getUsers();
    const matchedUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);
    if (!matchedUser) {
        showToast('Invalid username or password. Use advocate / admin123');
        return;
    }

    localStorage.setItem('cms_current_user', JSON.stringify(matchedUser));
    updateAuthUI();
    renderDiaryTable();
    renderBillingTable();
    renderLockerTable();
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    showToast('Welcome back!');
}

function logoutUser() {
    localStorage.removeItem('cms_current_user');
    updateAuthUI();
    renderDiaryTable();
    renderBillingTable();
    renderLockerTable();
    showToast('Logged out successfully.');
}

function getVisibleDiaryEntries() {
    const defaultDiary = [
        { date: '2026-08-25', title: 'Civil Suit #45/2026', court: 'Civil Judge Hifsa Bukhari (INJRA Division)', stage: 'Arguments Hearing', status: 'Pending', owner: 'advocate' },
        { date: '2026-08-28', title: 'Bail App #12/2026', court: 'District & Session Judge Attock', stage: 'Prosecution Response', status: 'Hearing Listed', owner: 'advocate' }
    ];
    const storedDiary = JSON.parse(localStorage.getItem('cms_diary_data') || 'null');
    const all = Array.isArray(storedDiary) && storedDiary.length ? storedDiary : defaultDiary;
    const user = getCurrentUser();

    if (!user) {
        return all.map((item, index) => ({ item, index }));
    }

    return all
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.owner || item.owner === user.username);
}

function getNextStatus(currentStatus) {
    const workflow = ['Pending', 'In Progress', 'Hearing Listed', 'Closed'];
    const currentIndex = workflow.indexOf(currentStatus || 'Pending');
    return workflow[(currentIndex + 1) % workflow.length];
}

function updateDiaryStatus(visibleIndex) {
    const entries = getVisibleDiaryEntries();
    const targetEntry = entries[visibleIndex];
    if (!targetEntry) {
        showToast('No record selected.');
        return;
    }

    const defaultDiary = [
        { date: '2026-08-25', title: 'Civil Suit #45/2026', court: 'Civil Judge Hifsa Bukhari (INJRA Division)', stage: 'Arguments Hearing', status: 'Pending', owner: 'advocate' },
        { date: '2026-08-28', title: 'Bail App #12/2026', court: 'District & Session Judge Attock', stage: 'Prosecution Response', status: 'Hearing Listed', owner: 'advocate' }
    ];
    const storedDiary = JSON.parse(localStorage.getItem('cms_diary_data') || 'null');
    const all = Array.isArray(storedDiary) && storedDiary.length ? storedDiary : defaultDiary;
    const currentStatus = all[targetEntry.index].status || 'Pending';
    all[targetEntry.index].status = getNextStatus(currentStatus);
    localStorage.setItem('cms_diary_data', JSON.stringify(all));
    renderDiaryTable();
    updateAuthUI();
    showToast('Case status updated.');
}

function deleteDiaryRecord(visibleIndex) {
    const entries = getVisibleDiaryEntries();
    const targetEntry = entries[visibleIndex];
    if (!targetEntry) return;

    const confirmed = window.confirm('Delete this case record?');
    if (!confirmed) return;

    const defaultDiary = [
        { date: '2026-08-25', title: 'Civil Suit #45/2026', court: 'Civil Judge Hifsa Bukhari (INJRA Division)', stage: 'Arguments Hearing', status: 'Pending', owner: 'advocate' },
        { date: '2026-08-28', title: 'Bail App #12/2026', court: 'District & Session Judge Attock', stage: 'Prosecution Response', status: 'Hearing Listed', owner: 'advocate' }
    ];
    const storedDiary = JSON.parse(localStorage.getItem('cms_diary_data') || 'null');
    const all = Array.isArray(storedDiary) && storedDiary.length ? storedDiary : defaultDiary;
    all.splice(targetEntry.index, 1);
    localStorage.setItem('cms_diary_data', JSON.stringify(all));
    renderDiaryTable();
    updateAuthUI();
    showToast('Case record deleted.');
}

// -------------------------------------------------------------
// 2. LOCALSTORAGE PERSISTENCE (SAVE & LOAD DATA)
// -------------------------------------------------------------
function saveDiary(e) {
    e.preventDefault();
    const date = document.getElementById('diary-date').value;
    const title = document.getElementById('diary-case').value;
    const court = document.getElementById('diary-court').value;
    const stage = document.getElementById('diary-stage').value;
    const user = getCurrentUser();

    const record = {
        date,
        title,
        court,
        stage,
        status: 'Pending',
        owner: user ? user.username : 'guest'
    };
    let list = JSON.parse(localStorage.getItem('cms_diary_data')) || [];
    list.unshift(record);
    localStorage.setItem('cms_diary_data', JSON.stringify(list));

    renderDiaryTable();
    updateAuthUI();
    document.getElementById('diary-form').reset();
    showToast("Cause List Entry Saved!");
}

function renderDiaryTable() {
    const defaultList = [
        { date: '2026-08-25', title: 'Civil Suit #45/2026', court: 'Civil Judge Hifsa Bukhari (INJRA Division)', stage: 'Arguments Hearing', status: 'Pending', owner: 'advocate' },
        { date: '2026-08-28', title: 'Bail App #12/2026', court: 'District & Session Judge Attock', stage: 'Prosecution Response', status: 'Hearing Listed', owner: 'advocate' }
    ];
    const storedList = JSON.parse(localStorage.getItem('cms_diary_data') || 'null');
    const allList = Array.isArray(storedList) && storedList.length ? storedList : defaultList;

    const user = getCurrentUser();
    const list = user
        ? allList.filter(item => !item.owner || item.owner === user.username)
        : allList;

    const tbody = document.getElementById('diary-records-body');
    if (!tbody) return;

    tbody.innerHTML = list.map((item, index) => {
        const status = item.status || 'Pending';
        const statusClass = status.toLowerCase().replace(/\s+/g, '-');
        const nextStatus = getNextStatus(status);
        return `<tr>
            <td>${item.date}</td>
            <td><strong>${item.title}</strong></td>
            <td>${item.court}</td>
            <td>${item.stage}</td>
            <td><span class="status-pill ${statusClass}">${status}</span></td>
            <td>
                <button type="button" class="table-action status" onclick="updateDiaryStatus(${index})">Set ${nextStatus}</button>
                <button type="button" class="table-action delete" onclick="deleteDiaryRecord(${index})">Delete</button>
            </td>
        </tr>`;
    }).join('');

    const countEl = document.getElementById('dash-active-count');
    if (countEl) countEl.innerText = list.length;
}

function saveBilling(e) {
    e.preventDefault();
    const client = document.getElementById('bill-client').value;
    const caseRef = document.getElementById('bill-case').value;
    const total = parseFloat(document.getElementById('bill-amount').value);
    const paid = parseFloat(document.getElementById('bill-paid').value);
    const user = getCurrentUser();

    const record = { client, caseRef, total, paid, owner: user ? user.username : 'guest' };
    let list = JSON.parse(localStorage.getItem('cms_billing_data')) || [];
    list.unshift(record);
    localStorage.setItem('cms_billing_data', JSON.stringify(list));

    renderBillingTable();
    updateAuthUI();
    document.getElementById('billing-form').reset();
    showToast("Financial Ledger Updated!");
}

function renderBillingTable() {
    const defaultList = [
        { client: 'Ahmad Ali', caseRef: 'Land Claim Ref #88', total: 150000, paid: 100000, owner: 'advocate' },
        { client: 'Tariq Mahmood', caseRef: 'Bail Matter #104', total: 60000, paid: 60000, owner: 'advocate' }
    ];
    const storedList = JSON.parse(localStorage.getItem('cms_billing_data') || 'null');
    const list = Array.isArray(storedList) && storedList.length ? storedList : defaultList;

    const user = getCurrentUser();
    const filteredList = user ? list.filter(item => !item.owner || item.owner === user.username) : list;

    const tbody = document.getElementById('billing-records-body');
    if (!tbody) return;
    tbody.innerHTML = filteredList.map(item => {
        const bal = item.total - item.paid;
        const badge = bal <= 0 
            ? `<span class="badge cleared">Cleared</span>` 
            : `<span class="badge due">Due: PKR ${bal.toLocaleString()}</span>`;
        return `<tr><td><strong>${item.client}</strong></td><td>${item.caseRef}</td><td>PKR ${item.total.toLocaleString()}</td><td>PKR ${item.paid.toLocaleString()}</td><td>${badge}</td></tr>`;
    }).join('');
}

function saveLocker(e) {
    e.preventDefault();
    const client = document.getElementById('locker-client').value;
    const type = document.getElementById('locker-type').value;
    const link = document.getElementById('locker-link').value;
    const user = getCurrentUser();

    const record = { client, type, link, owner: user ? user.username : 'guest' };
    let list = JSON.parse(localStorage.getItem('cms_locker_data')) || [];
    list.unshift(record);
    localStorage.setItem('cms_locker_data', JSON.stringify(list));

    renderLockerTable();
    updateAuthUI();
    document.getElementById('locker-form').reset();
    showToast("Locker Record Indexed!");
}

function renderLockerTable() {
    const defaultList = [
        { client: 'Ahmad Ali (#88)', type: 'Fard Malkiyat & Registry Copies', link: 'Physical Cabinet B - File #14', owner: 'advocate' }
    ];
    const storedList = JSON.parse(localStorage.getItem('cms_locker_data') || 'null');
    const list = Array.isArray(storedList) && storedList.length ? storedList : defaultList;

    const user = getCurrentUser();
    const filteredList = user ? list.filter(item => !item.owner || item.owner === user.username) : list;

    const tbody = document.getElementById('locker-records-body');
    if (!tbody) return;
    tbody.innerHTML = filteredList.map(item => 
        `<tr><td><strong>${item.client}</strong></td><td>${item.type}</td><td>${item.link}</td></tr>`
    ).join('');
}

// -------------------------------------------------------------
// 3. SEARCH & EXPORT UTILITIES
// -------------------------------------------------------------
function filterTable(tableBodyId, query) {
    const rows = document.querySelectorAll(`#${tableBodyId} tr`);
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query.toLowerCase()) ? '' : 'none';
    });
}

function filterLaws(query) {
    const cards = document.querySelectorAll('.law-card');
    cards.forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query.toLowerCase()) ? '' : 'none';
    });
}

function exportTableToCSV(filename, tableBodyId) {
    let csv = [];
    const rows = document.querySelectorAll(`#${tableBodyId} tr`);
    
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++) 
            row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
        csv.push(row.join(","));
    }

    const csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    showToast("Excel Export Downloading...");
}

function updateLimitationCounter(targetDateStr) {
    const target = new Date(targetDateStr);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    document.getElementById('dash-next-hearing').innerText = targetDateStr;
    document.getElementById('dash-limitation-days').innerText = diffDays > 0 ? `${diffDays} Days Left` : 'Deadline Passed';
}

// -------------------------------------------------------------
// 4. CALCULATORS SUITE
// -------------------------------------------------------------
function switchCalcModule(modId, btn) {
    document.querySelectorAll('.calc-module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('module-' + modId).classList.add('active');
    btn.classList.add('active');
}

let genExpression = '';
function calcInput(val) {
    const display = document.getElementById('gen-display');
    if (display.value === '0' && val !== '.') genExpression = '';
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
        display.value = Number(evalResult.toFixed(6));
        genExpression = display.value;
    } catch (e) {
        display.value = 'Error';
        genExpression = '';
    }
}

function computeLandShare() {
    const k = parseFloat(document.getElementById('land-kanal').value) || 0;
    const m = parseFloat(document.getElementById('land-marla').value) || 0;
    const s = parseFloat(document.getElementById('land-sarsai').value) || 0;
    const totalShares = parseFloat(document.getElementById('land-total-shares').value) || 0;
    const userShares = parseFloat(document.getElementById('land-user-shares').value) || 0;
    const out = document.getElementById('land-output');

    if (totalShares <= 0 || userShares <= 0) {
        out.style.display = 'block';
        out.innerHTML = '<b style="color:red;">Enter valid shares.</b>';
        return;
    }

    const totalSarsai = (k * 180) + (m * 9) + s;
    const userSarsaiTotal = (totalSarsai / totalShares) * userShares;

    const resKanal = Math.floor(userSarsaiTotal / 180);
    let rem = userSarsaiTotal % 180;
    const resMarla = Math.floor(rem / 9);
    const resSarsai = (rem % 9).toFixed(2);

    out.style.display = 'block';
    out.innerHTML = `<h4>Share Result:</h4><p style="font-size:1rem; font-weight:bold; color:var(--cms-gold);">${resKanal} Kanal - ${resMarla} Marla - ${resSarsai} Sarsai</p>`;
}

function computeAge() {
    const dob = document.getElementById('dob-val').value;
    const target = document.getElementById('target-date-val').value;
    const out = document.getElementById('age-output');

    if (!dob || !target) return;
    let d1 = new Date(dob), d2 = new Date(target);
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) { months--; days += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    out.style.display = 'block';
    out.innerHTML = `<h4>Age Result:</h4><p style="font-size:1rem; font-weight:bold; color:var(--cms-navy);">${years} Y, ${months} M, ${days} D</p>`;
}

function computeCourtExpenses() {
    const rate = parseFloat(document.getElementById('court-stamp-rate').value) || 0;
    const claim = parseFloat(document.getElementById('court-claim-val').value) || 0;
    const pages = parseFloat(document.getElementById('court-pages-val').value) || 0;
    const out = document.getElementById('court-output');

    const duty = claim * (rate / 100);
    const printing = pages * 20;
    const total = duty + printing;

    out.style.display = 'block';
    out.innerHTML = `<p><strong>Duty:</strong> PKR ${duty.toLocaleString()}</p><p><strong>Printing:</strong> PKR ${printing.toLocaleString()}</p><p style="font-size:1rem; font-weight:bold; color:var(--cms-red);">Total: PKR ${total.toLocaleString()}</p>`;
}

// -------------------------------------------------------------
// 5. DOCUMENT GENERATOR & HELPDESK
// -------------------------------------------------------------
function generateDocument(e) {
    e.preventDefault();
    const type = document.getElementById('doc-type-select').value;
    const court = document.getElementById('doc-court').value;
    const client = document.getElementById('doc-client').value;
    const opposite = document.getElementById('doc-opposite').value;
    const casetitle = document.getElementById('doc-casetitle').value;

    document.getElementById('w-court').innerText = court;
    document.getElementById('w-client').innerText = client;
    document.getElementById('w-opposite').innerText = opposite;
    document.getElementById('w-casetitle').innerText = casetitle;

    if (type === 'wakalatnama') {
        document.getElementById('print-doc-title').innerText = 'WAKALATNAMA / POWER OF ATTORNEY';
        document.getElementById('print-doc-body').innerHTML = 'I/We do hereby appoint and retain <strong>ADVOCATE IFTHEKHAR AHMAD KHAN</strong>, High Court, to appear and act for me/us in the above case.';
    } else if (type === 'urgent') {
        document.getElementById('print-doc-title').innerText = 'APPLICATION FOR URGENT HEARING';
        document.getElementById('print-doc-body').innerHTML = 'It is respectfully prayed that the titled matter involves urgent interim relief issues, and may kindly be fixed for immediate hearing today.';
    } else if (type === 'legal_notice') {
        document.getElementById('print-doc-title').innerText = 'FORMAL LEGAL NOTICE';
        document.getElementById('print-doc-body').innerHTML = 'Take notice that my client calls upon you to settle the outstanding dispute within 14 days of receipt of this notice.';
    }

    document.getElementById('doc-print-template').style.display = 'block';
    document.getElementById('doc-print-btn').style.display = 'block';
    showToast("Document Prepared!");
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const display = document.getElementById('chat-box');
    const text = input.value.trim();
    if (!text) return;

    display.innerHTML += `<div class="chat-bubble user">${text}</div>`;
    input.value = '';
    display.scrollTop = display.scrollHeight;

    let reply = "Thank you for contacting Office CMS. Please visit during court hours.";
    const q = text.toLowerCase();
    if (q.includes('injra')) reply = "INJRA Division is presided by Civil Judge Hifsa Bukhari.";
    else if (q.includes('jand')) reply = "Jand Division is presided by Civil Judge Yousuf Abdur Rehman.";

    setTimeout(() => {
        display.innerHTML += `<div class="chat-bubble bot">${reply}</div>`;
        display.scrollTop = display.scrollHeight;
    }, 300);
}

// Initial Load Handler
document.addEventListener('DOMContentLoaded', () => {
    ensureDefaultUser();

    // Load Saved Theme
    if (localStorage.getItem('cms_theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.innerText = '☀️ Light Mode';
    }

    // Set Default Target Date
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('target-date-val')) {
        document.getElementById('target-date-val').value = today;
    }

    // Render Saved Tables
    updateAuthUI();
    renderDiaryTable();
    renderBillingTable();
    renderLockerTable();
});