(function () {
    const CMS = window.CMS_CORE || { defaults: { vacancies: [] }, safeParse: () => [] };
    const FALLBACK = Array.isArray(CMS.defaults.vacancies) ? CMS.defaults.vacancies : [];

    function getVacancies() {
        const stored = localStorage.getItem('cms_vacancies_data');
        const parsed = CMS.safeParse(stored, FALLBACK);
        return Array.isArray(parsed) && parsed.length ? parsed : FALLBACK;
    }

    function saveVacancies(list) {
        localStorage.setItem('cms_vacancies_data', JSON.stringify(list));
    }

    function renderVacancies() {
        const list = getVacancies();
        const container = document.getElementById('vacancy-list');
        if (!container) return;

        if (!list.length) {
            container.innerHTML = '<div class="vacancy-empty">No vacancies available right now.</div>';
            return;
        }

        container.innerHTML = list.map((item) => {
            const statusClass = item.status === 'Filled' ? 'filled' : 'open';
            const requirementMarkup = Array.isArray(item.requirements)
                ? item.requirements.map((req) => `<li>${req}</li>`).join('')
                : '';

            return `
                <article class="vacancy-card ${statusClass}">
                    <div class="vacancy-header-row">
                        <span class="vacancy-badge">${item.type || 'Role'}</span>
                        <span class="vacancy-status ${statusClass}">${item.status || 'Open'}</span>
                    </div>
                    <h3>${item.title}</h3>
                    <p class="vacancy-summary">${item.summary || 'Professional opportunity for a legal applicant.'}</p>
                    <div class="vacancy-meta">
                        <span>📍 ${item.location || 'Office'}</span>
                        <span>⏳ Deadline: ${item.deadline || 'TBA'}</span>
                    </div>
                    <ul class="vacancy-requirements">
                        ${requirementMarkup}
                    </ul>
                    <div class="vacancy-actions">
                        <button type="button" class="cms-btn btn-green" onclick="markVacancyFilled(${item.id})">Mark Filled</button>
                        <button type="button" class="cms-btn btn-print" onclick="deleteVacancy(${item.id})">Delete</button>
                    </div>
                </article>
            `;
        }).join('');
    }

    function saveVacancyForm(event) {
        event.preventDefault();
        const title = document.getElementById('vacancy-title')?.value.trim();
        const location = document.getElementById('vacancy-location')?.value.trim();
        const type = document.getElementById('vacancy-type')?.value.trim();
        const deadline = document.getElementById('vacancy-deadline')?.value;
        const summary = document.getElementById('vacancy-summary')?.value.trim();
        const requirements = document.getElementById('vacancy-requirements')?.value
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);

        if (!title || !location || !type || !deadline || !summary) {
            if (window.showToast) {
                window.showToast('Please complete all vacancy fields.');
            }
            return;
        }

        const list = getVacancies();
        const nextId = list.reduce((highest, item) => Math.max(highest, Number(item.id) || 0), 0) + 1;

        list.unshift({
            id: nextId,
            title,
            location,
            type,
            deadline,
            summary,
            status: 'Open',
            requirements: requirements.length ? requirements : ['Strong legal aptitude', 'Good communication', 'Professional ethics']
        });

        saveVacancies(list);
        renderVacancies();
        const form = document.getElementById('vacancy-form');
        if (form) form.reset();
        if (window.showToast) window.showToast('Vacancy added successfully.');
    }

    function markVacancyFilled(id) {
        const list = getVacancies();
        const index = list.findIndex((item) => Number(item.id) === Number(id));
        if (index === -1) return;

        list[index].status = 'Filled';
        saveVacancies(list);
        renderVacancies();
        if (window.showToast) window.showToast('Vacancy marked as filled.');
    }

    function deleteVacancy(id) {
        const confirmed = window.confirm('Delete this vacancy posting?');
        if (!confirmed) return;

        const list = getVacancies().filter((item) => Number(item.id) !== Number(id));
        saveVacancies(list);
        renderVacancies();
        if (window.showToast) window.showToast('Vacancy deleted.');
    }

    window.renderVacancies = renderVacancies;
    window.saveVacancyForm = saveVacancyForm;
    window.markVacancyFilled = markVacancyFilled;
    window.deleteVacancy = deleteVacancy;

    document.addEventListener('DOMContentLoaded', renderVacancies);
    window.addEventListener('storage', (event) => {
        if (event.key === 'cms_vacancies_data') {
            renderVacancies();
        }
    });
}());
