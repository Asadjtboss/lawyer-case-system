(function () {
    function safeParse(rawValue, fallbackValue) {
        if (rawValue === null || rawValue === undefined || rawValue === '') {
            return fallbackValue;
        }

        try {
            const parsed = JSON.parse(rawValue);
            return parsed === null || parsed === undefined ? fallbackValue : parsed;
        } catch (error) {
            return fallbackValue;
        }
    }

    const defaultUsers = [
        {
            username: 'advocate',
            password: 'admin123',
            fullName: 'Advocate Ifthekhar Ahmad Khan',
            role: 'Advocate'
        }
    ];

    const defaultDiary = [
        {
            date: '2026-08-25',
            title: 'Civil Suit #45/2026',
            court: 'Civil Judge Hifsa Bukhari (INJRA Division)',
            stage: 'Arguments Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-08-28',
            title: 'Bail App #12/2026',
            court: 'District & Session Judge Attock',
            stage: 'Prosecution Response',
            status: 'Hearing Listed',
            owner: 'advocate'
        },
        {
            date: '2026-08-20',
            title: 'Civil Appeal #101/2026',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Appeal Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-08-22',
            title: 'Criminal Revision #38/2026',
            court: 'District & Session Judge Attock',
            stage: 'Notice Stage',
            status: 'In Progress',
            owner: 'advocate'
        },
        {
            date: '2026-08-18',
            title: 'Land Mutation #77/2026',
            court: 'Civil Judge Yousuf Abdur Rehman (Jand Division)',
            stage: 'Mutation Evidence',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-08-17',
            title: 'Family Suit #14/2026',
            court: 'Civil Judge Najaam Ayub (Basaal)',
            stage: 'Evidence Recording',
            status: 'Hearing Listed',
            owner: 'advocate'
        },
        {
            date: '2026-08-15',
            title: 'Recovery Suit #84/2026',
            court: 'Sub-Division Pindi Gheb',
            stage: 'Written Statement',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-08-10',
            title: 'Execution Petition #19/2026',
            court: 'Civil Judge Hifsa Bukhari (INJRA Division)',
            stage: 'Execution Proceedings',
            status: 'Closed',
            owner: 'advocate'
        },
        {
            date: '2026-08-11',
            title: 'Guardianship Petition #22/2026',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'SJ Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-08-13',
            title: 'Rent Appeal #55/2026',
            court: 'Civil Judge Yousuf Abdur Rehman (Jand Division)',
            stage: 'Arguments',
            status: 'In Progress',
            owner: 'advocate'
        }
    ];

    const defaultBilling = [
        {
            client: 'Ahmad Ali',
            caseRef: 'Land Claim Ref #88',
            total: 150000,
            paid: 100000,
            owner: 'advocate'
        },
        {
            client: 'Tariq Mahmood',
            caseRef: 'Bail Matter #104',
            total: 60000,
            paid: 60000,
            owner: 'advocate'
        }
    ];

    const defaultLocker = [
        {
            client: 'Ahmad Ali (#88)',
            type: 'Fard Malkiyat & Registry Copies',
            link: 'Physical Cabinet B - File #14',
            owner: 'advocate'
        }
    ];

    const defaultVacancies = [
        {
            id: 1,
            title: 'Junior Litigation Associate',
            location: 'Attock',
            type: 'Full-Time',
            status: 'Open',
            deadline: '2026-09-15',
            summary: 'Handle civil, family, and drafting work under senior advocacy supervision.',
            requirements: ['LLB / law graduate', 'Knowledge of civil procedure', 'Strong drafting skills']
        },
        {
            id: 2,
            title: 'Legal Research Intern',
            location: 'Remote / Office',
            type: 'Internship',
            status: 'Open',
            deadline: '2026-09-25',
            summary: 'Assist with legal research, case summaries, and cause list management.',
            requirements: ['Research orientation', 'Good writing ability', 'Case law review']
        }
    ];

    window.CMS_CORE = {
        safeParse,
        defaults: {
            users: defaultUsers,
            diary: defaultDiary,
            billing: defaultBilling,
            locker: defaultLocker,
            vacancies: defaultVacancies
        }
    };
}());
