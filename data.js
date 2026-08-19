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
        },
        {
            date: '2025-07-03',
            title: 'Atta Muhammad vs Ali khan',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Adil Saleem',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Ateeq UR Rehman vs Abdul Khaliq',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-02-17',
            title: 'Muhammad Taimour vs Rakheema Bibi',
            court: 'Najaam Ayub Shahab',
            stage: 'Decision Recorded',
            status: 'Closed',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Yasir',
            court: 'Najaam Ayub Shahab',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'State vs Ameer khan',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Ahmad khan vs Aytabaar khan',
            court: 'Yousuf Abdur Rehman',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-09-19',
            title: 'State vs Sajjad Ahmad',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2024-02-10',
            title: 'State vs Aamir Saeed',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-10-18',
            title: 'Samina Hussain vs Shoiab Anwar',
            court: 'Najaam Ayub Shahab',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-11-11',
            title: 'State vs Hazrat Mehmood',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Ayesha Ghaffar vs Arshad Saeed',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'State vs Ifraheem',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-11-21',
            title: 'Fareena vs Zilkaifal',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-10-09',
            title: 'Saleem Iqbalaa vs Mohsin Jamaal',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-09-21',
            title: 'Sania Kusar vs Sectary Union Council',
            court: 'Najaam Ayub Shahab',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Shakeela Naaz vs Public at Large',
            court: 'Yousuf Abdur Rehman',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Amjid Iqbal vs Khalida Bibi',
            court: 'Najaam Ayub Shahab',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Khalida Bibi vs Amjid Iqbal',
            court: 'Najaam Ayub Shahab',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'State vs Ghaffar Ahmed',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Gull Mer-jan vs Mesan khan',
            court: 'Yousuf Abdur Rehman',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Khatam Un Nissa vs Saddam Hussain',
            court: 'Yousuf Abdur Rehman',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-09-29',
            title: 'Robina Shaheen vs Nadeem ur Rehman',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-08-05',
            title: 'Naeem vs Mousam',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Mousam vs Naeem',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Naeem vs Ateeq ur Rehmaan',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Abdul Aziz vs Khursheed',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Khursheed vs Abdul Aziz',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Mehwish Ijaz vs Falak shair',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2024-02-20',
            title: 'Kamran Ashraaf vs Khalda bibi',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-02-24',
            title: 'Gull Ammer vs Hussain Gull',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2024-12-13',
            title: 'Shazia Sultan vs Sajid Nafees',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-02-20',
            title: 'Abdullah vs Amaan Ullah',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-08-02',
            title: 'State vs Asad Ullah',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'State vs Abdullah',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2024-10-18',
            title: 'Shaheen Akhtaar vs Waheed Ullah Other',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-06-13',
            title: 'Nasreen Akhtar vs Saif Ullah',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-03-11',
            title: 'Sania Khousar vs Manaan Javeed',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-06-13',
            title: 'Muhammad Qayyum vs M. Hussain other',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Shareen Khan vs Sayd Khan',
            court: 'AC',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Ammer khan vs POP(province of Punjab)',
            court: 'Unassigned Court',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-06-13',
            title: 'Niyaaz Manaah vs Saalbi bibi',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-01-16',
            title: 'Nasreen Akhtar vs Public at large',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-09-03',
            title: 'Farhat bibi vs Usman Mehmood',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-01-22',
            title: 'Tahir Farooq vs Taaj Muhammad other',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Amna Bibi vs Sahib Gull other',
            court: 'Yousuf Abdur Rehman',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2024-02-20',
            title: 'Kamran Ashraaf vs Khalda bibi',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-11-05',
            title: 'Najmaah Iqbal other vs Zahid Kareem',
            court: 'Najaam Ayub Shahab',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-02-20',
            title: 'Raees Khan vs Hakeem Khan',
            court: 'AC',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Mian khan other vs Islam other',
            court: 'Yousuf Abdur Rehman',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-01-16',
            title: 'Saddam Hussain vs Khatam Un Nissa',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2023-11-14',
            title: 'Mohsin Jamaala vs Saleem Iqbalaa',
            court: 'Yousuf Abdur Rehman',
            stage: 'Decision Recorded',
            status: 'Closed',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Hikmah Bibi',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Muhammad Saleem',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Samia lariab',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Muhammad Saeed',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Muhammad Taimour vs Muhammad Ameen',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-04-23',
            title: 'Sumaira Yasmeen vs Abid Hussain',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2026-01-22',
            title: 'State vs Muhammad Aqeel',
            court: 'Sayeda Hifza Bukhaari',
            stage: 'Diary Hearing',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Umer Bilal VS Sumaira Naseem',
            court: 'ASJ Mr. Jahan Zaib',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: 'N/A',
            title: 'Tasmiyeah BiBi vs Sami Ullah',
            court: 'Abdullah Khan Attock',
            stage: 'Pending',
            status: 'Pending',
            owner: 'advocate'
        },
        {
            date: '2025-10-18',
            title: 'Miyaan Khan vs Islam khan (etc)',
            court: 'Yousuf Abdur Rehman',
            stage: 'Diary Hearing',
            status: 'Pending',
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

    const defaultClients = [
        {
            name: 'Ahmad Ali',
            phone: '0300-1122334',
            matter: 'Land / Mutation',
            court: 'Civil Judge Attock',
            file: 'Mutation #88/2026',
            followup: '2026-08-28',
            status: 'Active'
        },
        {
            name: 'Sana Khan',
            phone: '0333-4455667',
            matter: 'Family Matter',
            court: 'Family Court Attock',
            file: 'Family Suit #14/2026',
            followup: '2026-08-25',
            status: 'Pending'
        }
    ];

    const defaultFilings = [
        {
            caseRef: 'Civil Suit #45/2026',
            court: 'Civil Judge Attock',
            date: '2026-08-18',
            status: 'Filed',
            note: 'Pleading filed and copy served'
        },
        {
            caseRef: 'Bail App #12/2026',
            court: 'District & Sessions Court',
            date: '2026-08-22',
            status: 'Urgent',
            note: 'Urgent hearing requested'
        }
    ];

    window.CMS_CORE = {
        safeParse,
        defaults: {
            users: defaultUsers,
            diary: defaultDiary,
            billing: defaultBilling,
            locker: defaultLocker,
            vacancies: defaultVacancies,
            clients: defaultClients,
            filings: defaultFilings
        }
    };
}());
