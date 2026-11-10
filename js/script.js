/* ==========================================================================
   F1 PORTAL — script.js
   Assignment 4 (JS basics)  ·  Assignment 5 (Advanced JS & DOM)  ·  Assignment 6 (jQuery)
   ========================================================================== */
$(document).ready(function ($) {
    "use strict";
    console.log("jQuery is ready!");

    /* ======================================================================
       0. HELPERS: safe localStorage + translations (Assignment 5: switch / objects)
       ====================================================================== */
    const store = {
        get(key, fallback) {
            try {
                const value = localStorage.getItem(key);
                return value === null ? fallback : value;
            } catch (e) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
        }
    };

    const tr = (en, ru, kk) => ({ en: en, ru: ru, kk: kk });

    const I18N = {
        "nav.home": tr("Home", "Главная", "Басты бет"),
        "nav.teams": tr("Teams", "Команды", "Командалар"),
        "nav.drivers": tr("Drivers", "Пилоты", "Жүргізушілер"),
        "nav.contact": tr("Contact", "Контакты", "Байланыс"),
        "btn.subscribe": tr("Quick Subscribe", "Быстрая подписка", "Жылдам жазылу"),
        "theme.day": tr("☀️ Day Mode", "☀️ Дневной режим", "☀️ Күндізгі режим"),
        "theme.night": tr("🌙 Night Mode", "🌙 Ночной режим", "🌙 Түнгі режим"),

        "home.title": tr("Welcome to the World of Formula 1", "Добро пожаловать в мир Формулы 1", "Формула 1 әлеміне қош келдіңіз"),
        "teams.title": tr("Constructors & Cars", "Конструкторы и болиды", "Конструкторлар мен болидтер"),
        "drivers.title": tr("Top Championship Drivers", "Лучшие пилоты чемпионата", "Чемпионаттың үздік жүргізушілері"),
        "contact.title": tr("Get in Touch", "Свяжитесь с нами", "Бізбен байланысыңыз"),

        "search.home": tr("🔍 Search races, drivers, teams...", "🔍 Поиск гонок, пилотов, команд...", "🔍 Жарыстар, жүргізушілер, командаларды іздеу..."),
        "search.teams": tr("🔍 Search constructors, power units...", "🔍 Поиск конструкторов, силовых установок...", "🔍 Конструкторлар, қозғалтқыштарды іздеу..."),
        "search.drivers": tr("🔍 Search driver names, titles...", "🔍 Поиск пилотов, титулов...", "🔍 Жүргізушілер, титулдарды іздеу..."),
        "search.none": tr("No results found for", "Ничего не найдено по запросу", "Нәтиже табылмады:"),

        "home.races": tr("Races This Season", "Гонок в сезоне", "Маусымдағы жарыстар"),
        "home.teamsLabel": tr("F1 Teams", "Команд F1", "F1 командалары"),
        "home.fans": tr("Million Fans Worldwide", "Миллионов фанатов по миру", "Әлемдегі миллион жанкүйер"),
        "promo.label": tr("OFFICIAL FAN PROMO CODE", "ОФИЦИАЛЬНЫЙ ПРОМОКОД ФАНАТА", "ЖАНКҮЙЕРЛЕРГЕ АРНАЛҒАН РЕСМИ ПРОМОКОД"),
        "support.label": tr("OFFICIAL SUPPORT EMAIL", "ОФИЦИАЛЬНЫЙ EMAIL ПОДДЕРЖКИ", "РЕСМИ ҚОЛДАУ EMAIL-Ы"),
        "copy.code": tr("Copy Code", "Копировать код", "Кодты көшіру"),
        "copy.email": tr("Copy Email", "Копировать email", "Email көшіру"),
        "copy.done": tr("Copied!", "Скопировано!", "Көшірілді!"),
        "copy.tooltip": tr("Copied to clipboard!", "Скопировано в буфер обмена!", "Алмасу буферіне көшірілді!"),

        "tools.title": tr("F1 Fact Machine", "Факты о Формуле 1", "Формула 1 фактілері"),
        "fact.btn": tr("🎲 New Fact", "🎲 Новый факт", "🎲 Жаңа факт"),
        "time.btn": tr("🕒 Show Current Time", "🕒 Показать время", "🕒 Уақытты көрсету"),

        "races.title": tr("F1 Season Highlights", "Яркие моменты сезона", "Маусымның басты сәттері"),
        "filter.all": tr("All Races", "Все гонки", "Барлық жарыстар"),
        "filter.classic": tr("Classic", "Классика", "Классикалық"),
        "filter.speed": tr("High Speed", "Скоростные", "Жоғары жылдамдық"),
        "filter.street": tr("Street Track", "Городские", "Қалалық трасса"),
        "news.title": tr("Latest F1 News", "Последние новости F1", "F1 соңғы жаңалықтары"),
        "rate.title": tr("Rate This F1 Portal", "Оцените портал F1", "F1 порталын бағалаңыз"),
        "rate.hint": tr("Click a star to rate", "Нажмите на звезду, чтобы оценить", "Бағалау үшін жұлдызшаны басыңыз"),
        "rate.thanks": tr("Thank you for rating us {n} out of 5 stars!", "Спасибо! Ваша оценка: {n} из 5 звёзд!", "Рахмет! Сіздің бағаңыз: 5 жұлдыздан {n}!"),
        "gallery.title": tr("F1 Gallery & Highlights", "Галерея F1", "F1 галереясы"),
        "gallery.grid": tr("F1 Grand Prix Photo Gallery", "Фотогалерея Гран-при", "Гран-при фотогалереясы"),
        "grid.title": tr("The Grid", "Стартовая решётка", "Бастапқы тор"),
        "spot.title": tr("Team Spotlight", "Команды в фокусе", "Командалар назарда"),

        "cap.start": tr("Lights out: the Grand Prix start", "Погасли огни: старт Гран-при", "Шамдар сөнді: Гран-при старты"),
        "cap.pit": tr("Pit lane: every tenth counts", "Пит-лейн: важна каждая десятая", "Пит-лейн: әр оныншы секунд маңызды"),
        "cap.monaco": tr("Monaco Street Circuit", "Городская трасса Монако", "Монако қалалық трассасы"),
        "cap.flag": tr("Taking the chequered flag", "Финиш под клетчатым флагом", "Шахматты жалау астындағы финиш"),
        "cap.podium": tr("Podium celebration", "Празднование на подиуме", "Подиумдағы мереке"),
        "cap.fans": tr("The grandstands: where 500 million fans come alive", "Трибуны: здесь оживают 500 миллионов фанатов", "Трибуналар: 500 миллион жанкүйер осында жанданады"),
        "cap.grid": tr("Season finale grid photo, Abu Dhabi Grand Prix 2023", "Общее фото пилотов, Гран-при Абу-Даби 2023", "Пилоттардың бірлескен суреті, Абу-Даби Гран-приі 2023"),
        "cap.trophy": tr("The World Championship trophy", "Кубок чемпионата мира", "Әлем чемпионатының кубогы"),
        "cap.night": tr("Sparks fly under the floodlights of a street circuit.", "Искры летят под прожекторами городской трассы.", "Қалалық трассаның прожекторлары астында ұшқындар шашырайды."),
        "cap.night2": tr("Sparks after dark", "Искры в ночи", "Түндегі ұшқындар"),
        "cap.rb": tr("Studio launch livery of the Milton Keynes team.", "Студийная презентация раскраски команды из Милтон-Кинса.", "Милтон-Кинс командасының студиялық таныстырылымы."),
        "cap.mclaren": tr("Woking-based McLaren in action during a pit stop.", "McLaren из Уокинга во время пит-стопа.", "Уокингтегі McLaren пит-стоп кезінде."),
        "lb.close": tr("Close", "Закрыть", "Жабу"),
        "lb.prev": tr("Previous photo", "Предыдущее фото", "Алдыңғы сурет"),
        "lb.next": tr("Next photo", "Следующее фото", "Келесі сурет"),

        "standings.title": tr("Constructor Standings", "Кубок конструкторов", "Конструкторлар рейтингі"),
        "th.team": tr("Team", "Команда", "Команда"),
        "th.pu": tr("Power Unit", "Силовая установка", "Қозғалтқыш"),
        "th.base": tr("Base", "База", "Базасы"),
        "th.points": tr("Points", "Очки", "Ұпай"),
        "faq.title": tr("Frequently Asked Questions", "Частые вопросы", "Жиі қойылатын сұрақтар"),

        "legends.title": tr("Championship Legends", "Легенды чемпионата", "Чемпионат аңыздары"),
        "filter.multi": tr("Filter Multi-Champions", "Только многократные чемпионы", "Көп дүркін чемпиондар"),
        "filter.allDrivers": tr("Show All Drivers", "Показать всех пилотов", "Барлық жүргізушілер"),
        "profiles.title": tr("Featured Profiles", "Избранные профили", "Таңдаулы профильдер"),
        "readmore.more": tr("Read More", "Читать далее", "Толығырақ"),
        "readmore.less": tr("Read Less", "Свернуть", "Жасыру"),

        "contact.formTitle": tr("Contact Form", "Форма обратной связи", "Кері байланыс формасы"),
        "reg.title": tr("Create F1 Fan Account", "Создать аккаунт фаната F1", "F1 жанкүйер аккаунтын құру"),
        "form.name": tr("Your Name", "Ваше имя", "Атыңыз"),
        "form.email": tr("Email Address", "Адрес эл. почты", "Электрондық пошта"),
        "form.message": tr("Message", "Сообщение", "Хабарлама"),
        "form.send": tr("Send Message", "Отправить сообщение", "Хабарлама жіберу"),
        "form.password": tr("Password", "Пароль", "Құпия сөз"),
        "form.confirm": tr("Confirm Password", "Подтвердите пароль", "Құпия сөзді растаңыз"),
        "reg.btn": tr("Create Account", "Создать аккаунт", "Аккаунт құру"),
        "reg.success": tr("Account created! Welcome to the paddock,", "Аккаунт создан! Добро пожаловать в паддок,", "Аккаунт жасалды! Паддокқа қош келдіңіз,"),

        "popup.title": tr("Join F1 Newsletter", "Подпишитесь на рассылку F1", "F1 жаңалықтарына жазылыңыз"),
        "popup.text": tr("Get the latest racing updates directly to your inbox.", "Получайте последние новости гонок прямо на почту.", "Жарыс жаңалықтарын тікелей поштаңызға алыңыз."),
        "popup.placeholder": tr("Enter your email address", "Введите ваш email", "Email мекенжайыңызды енгізіңіз"),
        "popup.btn": tr("Subscribe Now", "Подписаться", "Жазылу"),
        "popup.success": tr("You are subscribed to the F1 newsletter!", "Вы подписались на рассылку F1!", "Сіз F1 жаңалықтарына жазылдыңыз!"),

        "greet.placeholder": tr("Your name", "Ваше имя", "Атыңыз"),
        "greet.btn": tr("Greet me", "Поприветствуй", "Сәлем бер"),
        "greet.morning": tr("Good morning", "Доброе утро", "Қайырлы таң"),
        "greet.afternoon": tr("Good afternoon", "Добрый день", "Қайырлы күн"),
        "greet.evening": tr("Good evening", "Добрый вечер", "Қайырлы кеш"),
        "greet.night": tr("Good night", "Доброй ночи", "Қайырлы түн"),
        "greet.default": tr("racing fan", "поклонник гонок", "жарыс жанкүйері"),

        "err.name": tr("Please enter your name (at least 2 characters).", "Введите имя (минимум 2 символа).", "Атыңызды енгізіңіз (кемінде 2 таңба)."),
        "err.email": tr("Enter a valid email, e.g. name@example.com.", "Введите корректный email, например name@example.com.", "Дұрыс email енгізіңіз, мысалы name@example.com."),
        "err.message": tr("Message must be at least 10 characters.", "Сообщение должно содержать минимум 10 символов.", "Хабарлама кемінде 10 таңба болуы керек."),
        "err.password": tr("Password needs 8+ characters with a letter and a digit.", "Пароль: от 8 символов, с буквой и цифрой.", "Құпия сөз: кемінде 8 таңба, әріп және сан болуы керек."),
        "err.confirm": tr("Passwords do not match.", "Пароли не совпадают.", "Құпия сөздер сәйкес келмейді."),
        "toast.fix": tr("Please fill out all required fields correctly.", "Заполните все обязательные поля правильно.", "Барлық міндетті өрістерді дұрыс толтырыңыз."),
        "status.success": tr("Your message has been sent successfully!", "Ваше сообщение успешно отправлено!", "Хабарламаңыз сәтті жіберілді!"),
        "status.error": tr("Could not send the message. Check your connection and try again.", "Не удалось отправить сообщение. Проверьте соединение и повторите попытку.", "Хабарлама жіберілмеді. Байланысты тексеріп, қайталап көріңіз."),
        "wait": tr("Please wait...", "Пожалуйста, подождите...", "Күте тұрыңыз...")
    };

    const SUPPORTED_LANGS = ["en", "ru", "kk"];
    const LOCALES = { en: "en-US", ru: "ru-RU", kk: "kk-KZ" };
    let currentLang = store.get("f1-lang", "en");
    if (SUPPORTED_LANGS.indexOf(currentLang) === -1) { currentLang = "en"; }

    function t(key) {
        const entry = I18N[key];
        return entry ? (entry[currentLang] || entry.en) : key;
    }

    /* ======================================================================
       1. SOUND EFFECT (one shared AudioContext, so sounds never pile up)
       ====================================================================== */
    let audioCtx = null;

    function playSoundEffect(frequency) {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) { return; }
            if (!audioCtx) { audioCtx = new AC(); }
            if (audioCtx.state === "suspended") { audioCtx.resume(); }

            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const now = audioCtx.currentTime;

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency || 600, now);
            gainNode.gain.setValueAtTime(0.04, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } catch (e) { /* audio blocked until first interaction */ }
    }

    /* ======================================================================
       2. TOAST NOTIFICATIONS (Assignment 6, Task 7)
       ====================================================================== */
    function showToast(title, message) {
        const $toast = $(
            '<div class="toast align-items-center text-bg-danger border-0 show custom-toast" role="alert">' +
            '<div class="d-flex"><div class="toast-body"><strong></strong> <span class="toast-msg"></span></div>' +
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
            "</div></div>"
        );
        $toast.find("strong").text(title + ":");
        $toast.find(".toast-msg").text(message);
        $("#toast-container").append($toast);
        setTimeout(function () {
            $toast.fadeOut(400, function () { $(this).remove(); });
        }, 3500);
    }

    /* ======================================================================
       3. DAY / NIGHT THEME + BACKGROUND COLOUR CHANGER (Assignment 4 Task 4, Assignment 5)
       ====================================================================== */
    const BG_PALETTES = {
        dark: [null, "#12081f", "#04121f", "#1a0b0b", "#0a1a12"],
        light: [null, "#fde8e8", "#e0f2fe", "#ecfccb", "#fef3c7"]
    };
    let bgIndex = parseInt(store.get("f1-bg", "0"), 10) || 0;

    function isLightMode() { return $("body").hasClass("light-mode"); }

    function applyBackground() {
        const palette = BG_PALETTES[isLightMode() ? "light" : "dark"];
        const color = palette[bgIndex % palette.length];
        if (color) {
            document.body.style.setProperty("background-color", color, "important");
        } else {
            document.body.style.removeProperty("background-color");
        }
    }

    function applyTheme(theme) {
        if (theme === "light") {
            $("body").addClass("light-mode");
            $("#theme-toggle-btn").text(t("theme.night"));
        } else {
            $("body").removeClass("light-mode");
            $("#theme-toggle-btn").text(t("theme.day"));
        }
        applyBackground();
    }

    $(document).on("click", "#theme-toggle-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        const next = isLightMode() ? "dark" : "light";
        store.set("f1-theme", next);
        applyTheme(next);
        showToast("Theme Changed", next === "light" ? "Switched to Day Mode" : "Switched to Night Mode");
    });

    $(document).on("click", "#bg-color-btn", function (e) {
        e.preventDefault();
        playSoundEffect(520);
        bgIndex = (bgIndex + 1) % BG_PALETTES.dark.length;
        store.set("f1-bg", String(bgIndex));
        applyBackground();
        showToast("Background", "Colour " + (bgIndex + 1) + " of " + BG_PALETTES.dark.length);
    });

    /* ======================================================================
       4. LANGUAGE SELECTOR (Assignment 5: switch statement, EN / RU / KZ)
       ====================================================================== */
    function applyLanguage(lang) {
        switch (lang) {
            case "ru":
            case "kk":
            case "en":
                currentLang = lang;
                break;
            default:
                currentLang = "en";
        }
        store.set("f1-lang", currentLang);
        $("html").attr("lang", currentLang);
        $("#lang-select").val(currentLang);

        $("[data-i18n]").each(function () {
            $(this).text(t($(this).attr("data-i18n")));
        });
        $("[data-i18n-placeholder]").each(function () {
            $(this).attr("placeholder", t($(this).attr("data-i18n-placeholder")));
        });

        // Text changed, so cached "original HTML" used by search highlighting is stale.
        $(".highlightable").removeData("originalHtml");

        applyTheme(isLightMode() ? "light" : "dark");
        renderGreeting();
        renderRatingFeedback();
        updateClock();
        highlightText($("#global-search-input").val() ? $("#global-search-input").val().toLowerCase().trim() : "");
    }

    $(document).on("change", "#lang-select", function () {
        playSoundEffect();
        applyLanguage($(this).val());
    });

    /* ======================================================================
       5. DYNAMIC LISTS (objects, arrays, higher-order functions, switch)
       ====================================================================== */
    const races = [
        { name: "Monaco Grand Prix", circuit: "Circuit de Monaco", category: "Classic" },
        { name: "Silverstone Grand Prix", circuit: "Silverstone Circuit", category: "Classic" },
        { name: "Monza Grand Prix", circuit: "Autodromo Nazionale Monza", category: "High Speed" },
        { name: "Las Vegas Grand Prix", circuit: "Las Vegas Street Track", category: "Street Track" }
    ];

    function getRacesByCategory(category) {
        switch (category) {
            case "Classic":
            case "High Speed":
            case "Street Track":
                return races.filter(function (race) { return race.category === category; });
            default:
                return races.slice();
        }
    }

    function renderRaces(data) {
        const $container = $("#dynamic-races-list");
        if (!$container.length) { return; }
        $container.empty();
        data.forEach(function (r) {
            const $li = $('<li class="list-group-item mb-2 rounded d-flex justify-content-between align-items-center searchable-item highlightable"></li>');
            const $left = $("<span></span>");
            $left.append($("<strong></strong>").text(r.name), " - ", $("<em></em>").text(r.circuit));
            $li.append($left, $('<span class="badge bg-danger"></span>').text(r.category));
            $container.append($li);
        });
    }

    $(document).on("click", ".race-filter", function (e) {
        e.preventDefault();
        playSoundEffect();
        $(".race-filter").removeClass("active");
        $(this).addClass("active");
        renderRaces(getRacesByCategory($(this).attr("data-category")));
    });

    const driverLegends = [
        { name: "Lewis Hamilton", text: "7 World Titles", status: "Multi-Champion" },
        { name: "Michael Schumacher", text: "7 World Titles", status: "Multi-Champion" },
        { name: "Max Verstappen", text: "3 World Titles", status: "Multi-Champion" },
        { name: "Charles Leclerc", text: "Contender", status: "Active Driver" }
    ];

    function renderLegends(data) {
        const $container = $("#dynamic-drivers-list");
        if (!$container.length) { return; }
        $container.empty();
        data.forEach(function (l) {
            const $li = $('<li class="list-group-item mb-2 rounded d-flex justify-content-between align-items-center searchable-item highlightable"></li>');
            const $left = $("<span></span>");
            $left.append($("<strong></strong>").text(l.name), " - ", $("<em></em>").text(l.text));
            $li.append($left, $('<span class="badge bg-danger"></span>').text(l.status));
            $container.append($li);
        });
    }

    $(document).on("click", "#filter-multi", function (e) {
        e.preventDefault();
        playSoundEffect();
        renderLegends(driverLegends.filter(function (l) { return l.status === "Multi-Champion"; }));
    });

    $(document).on("click", "#reset-drivers-filter", function (e) {
        e.preventDefault();
        playSoundEffect();
        renderLegends(driverLegends);
    });

    /* ======================================================================
       6. SEARCH: live filter + autocomplete + highlighting (Assignment 6, Part 1)
       ====================================================================== */
    const searchData = [
        "Monaco Grand Prix", "Silverstone Grand Prix", "Monza Grand Prix", "Las Vegas Grand Prix",
        "Lewis Hamilton", "Michael Schumacher", "Max Verstappen", "Charles Leclerc",
        "Red Bull Racing", "Ferrari", "McLaren", "Mercedes AMG", "Aston Martin", "Honda RBPT"
    ];
    let activeSuggestion = -1;

    function escapeRegExp(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // Wrap matches inside TEXT nodes only, so HTML tags are never broken.
    function wrapMatches(element, regex) {
        $(element).contents().each(function () {
            if (this.nodeType === 3) {
                const parts = this.nodeValue.split(regex);
                if (parts.length < 2) { return; }
                const fragment = document.createDocumentFragment();
                parts.forEach(function (part, i) {
                    if (part === "") { return; }
                    if (i % 2 === 1) {
                        const mark = document.createElement("mark");
                        mark.className = "highlight-search";
                        mark.textContent = part;
                        fragment.appendChild(mark);
                    } else {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });
                this.parentNode.replaceChild(fragment, this);
            } else if (this.nodeType === 1 && this.tagName !== "MARK") {
                wrapMatches(this, regex);
            }
        });
    }

    function highlightText(keyword) {
        const regex = keyword ? new RegExp("(" + escapeRegExp(keyword) + ")", "gi") : null;
        $(".highlightable").each(function () {
            const $el = $(this);
            if ($el.data("originalHtml") === undefined) {
                $el.data("originalHtml", $el.html());
            }
            $el.html($el.data("originalHtml"));
            if (regex) { wrapMatches(this, regex); }
        });
    }

    function updateNoResults(query, visibleCount) {
        let $msg = $("#no-results");
        if (!$msg.length) {
            $msg = $('<p id="no-results" class="text-center fw-bold"></p>').hide();
            $("#global-search-input").closest("section").after($msg);
        }
        if (query && visibleCount === 0) {
            $msg.text(t("search.none") + ' "' + query + '"').show();
        } else {
            $msg.hide();
        }
    }

    function markActiveSuggestion($items) {
        $items.removeClass("active-suggest");
        if (activeSuggestion >= 0) { $items.eq(activeSuggestion).addClass("active-suggest"); }
    }

    $(document).on("input", "#global-search-input", function () {
        const query = $(this).val().toLowerCase().trim();
        const $suggestions = $("#autocomplete-list");
        let visibleCount = 0;
        activeSuggestion = -1;
        $suggestions.empty();

        // Task 1: live filter
        $(".searchable-item").each(function () {
            const matches = query === "" || $(this).text().toLowerCase().indexOf(query) !== -1;
            if (matches) { visibleCount++; }
            $(this).stop(true, true)[matches ? "fadeIn" : "fadeOut"](200);
        });
        updateNoResults(query, visibleCount);

        // Task 2: autocomplete suggestions
        if (query.length > 0) {
            const matches = searchData.filter(function (item) {
                return item.toLowerCase().indexOf(query) !== -1;
            }).slice(0, 6);
            if (matches.length > 0) {
                matches.forEach(function (match) {
                    $suggestions.append($('<li class="dropdown-item search-suggest-item"></li>').text(match));
                });
                $suggestions.show();
            } else {
                $suggestions.hide();
            }
        } else {
            $suggestions.hide();
        }

        // Task 3: highlighting
        highlightText(query);
    });

    $(document).on("keydown", "#global-search-input", function (e) {
        const $items = $("#autocomplete-list .search-suggest-item");
        switch (e.key) {
            case "ArrowDown":
                if ($items.length) {
                    e.preventDefault();
                    activeSuggestion = (activeSuggestion + 1) % $items.length;
                    markActiveSuggestion($items);
                }
                break;
            case "ArrowUp":
                if ($items.length) {
                    e.preventDefault();
                    activeSuggestion = (activeSuggestion - 1 + $items.length) % $items.length;
                    markActiveSuggestion($items);
                }
                break;
            case "Enter":
                if (activeSuggestion >= 0) {
                    e.preventDefault();
                    $items.eq(activeSuggestion).trigger("click");
                }
                break;
            case "Escape":
                $("#autocomplete-list").hide();
                break;
            default:
                break;
        }
    });

    $(document).on("click", ".search-suggest-item", function () {
        $("#global-search-input").val($(this).text()).trigger("input");
        $("#autocomplete-list").hide();
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest("#global-search-input, #autocomplete-list").length) {
            $("#autocomplete-list").hide();
        }
    });

    // Press "/" anywhere to jump to the search box
    $(document).on("keydown", function (e) {
        const tag = (e.target.tagName || "").toLowerCase();
        if (e.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") {
            const $search = $("#global-search-input");
            if ($search.length) {
                e.preventDefault();
                $search.trigger("focus");
            }
        }
    });

    /* ======================================================================
       7. ACCORDION (Assignment 4, Task 2)
       ====================================================================== */
    $(document).on("click", ".accordion-header-custom", function () {
        playSoundEffect();
        $(this).toggleClass("active");
        $(this).next(".accordion-content-custom").slideToggle(300);
    });

    /* ======================================================================
       8. RATING STARS (Assignment 5)
       ====================================================================== */
    let currentRating = parseInt(store.get("f1-rating", "0"), 10) || 0;

    function paintStars(rating) {
        $("#rating-stars .star").each(function (index) {
            $(this).toggleClass("active", index < rating);
        });
    }

    function renderRatingFeedback() {
        const $feedback = $("#rating-feedback");
        if (!$feedback.length) { return; }
        $feedback.text(currentRating ? t("rate.thanks").replace("{n}", currentRating) : t("rate.hint"));
    }

    $(document).on("mouseenter", "#rating-stars .star", function () {
        const hoverIndex = $(this).index();
        $("#rating-stars .star").each(function (index) {
            $(this).toggleClass("hovered", index <= hoverIndex);
        });
    });

    $(document).on("mouseleave", "#rating-stars", function () {
        $("#rating-stars .star").removeClass("hovered");
    });

    $(document).on("click", "#rating-stars .star", function () {
        playSoundEffect();
        currentRating = $(this).index() + 1;
        store.set("f1-rating", String(currentRating));
        paintStars(currentRating);
        renderRatingFeedback();
        showToast("Rating Received", "You rated us " + currentRating + "/5 stars!");
    });

    /* ======================================================================
       9. READ MORE (Assignment 5: toggle style.display)
       ====================================================================== */
    $(document).on("click", ".read-more-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        const content = this.parentNode.querySelector(".read-more-content");
        if (!content) { return; }
        const isHidden = content.style.display === "" || content.style.display === "none";
        content.style.display = isHidden ? "block" : "none";
        const key = isHidden ? "readmore.less" : "readmore.more";
        $(this).attr("data-i18n", key).text(t(key));
    });

    /* ======================================================================
       10. POPUP SUBSCRIBE FORM (Assignment 4, Task 3)
       ====================================================================== */
    function openPopup() {
        $("#popup-modal").css("display", "flex").attr("aria-hidden", "false");
        setTimeout(function () { $("#subscribe-email").trigger("focus"); }, 50);
    }

    function closePopup() {
        $("#popup-modal").css("display", "none").attr("aria-hidden", "true");
    }

    $(document).on("click", "#open-popup-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        openPopup();
    });

    $(document).on("click", "#close-popup-btn", closePopup);

    $(document).on("keydown", "#close-popup-btn", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); closePopup(); }
    });

    $(document).on("keydown", function (e) {
        if (e.key === "Escape") { closePopup(); }
    });

    $(window).on("click", function (e) {
        if (e.target === $("#popup-modal")[0]) { closePopup(); }
    });

    /* ======================================================================
       11. FORM VALIDATION + SPINNER (Assignment 4 Task 1, Assignment 6 Task 6)
       ====================================================================== */
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validators = {
        name: function (v) { return v.trim().length >= 2 ? "" : t("err.name"); },
        email: function (v) { return EMAIL_RE.test(v.trim()) ? "" : t("err.email"); },
        message: function (v) { return v.trim().length >= 10 ? "" : t("err.message"); },
        password: function (v) {
            return (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) ? "" : t("err.password");
        },
        confirm: function (v, $form) {
            return (v !== "" && v === $form.find('[data-validate="password"]').val()) ? "" : t("err.confirm");
        }
    };

    function setFieldState($input, message) {
        $input.toggleClass("is-invalid", !!message).toggleClass("is-valid", !message);
        $input.siblings(".field-error").text(message).toggle(!!message);
    }

    function validateField($input) {
        const rule = $input.attr("data-validate");
        const validator = validators[rule];
        if (!validator) { return true; }
        const message = validator($input.val(), $input.closest("form"));
        setFieldState($input, message);
        return message === "";
    }

    function validateForm($form) {
        let valid = true;
        $form.find("[data-validate]").each(function () {
            $(this).addClass("touched");
            if (!validateField($(this))) { valid = false; }
        });
        return valid;
    }

    function clearValidation($form) {
        $form.find("[data-validate]").removeClass("is-valid is-invalid touched");
        $form.find(".field-error").hide().text("");
        $form.find(".password-strength").attr("class", "password-strength");
    }

    $(document).on("blur", "[data-validate]", function () {
        $(this).addClass("touched");
        validateField($(this));
    });

    $(document).on("input", "[data-validate]", function () {
        const $input = $(this);
        if ($input.hasClass("touched")) { validateField($input); }
        if ($input.attr("data-validate") === "password") {
            updateStrength($input);
            const $confirm = $input.closest("form").find('[data-validate="confirm"]');
            if ($confirm.hasClass("touched")) { validateField($confirm); }
        }
    });

    function updateStrength($input) {
        const v = $input.val();
        let score = 0;
        if (v.length >= 8) { score++; }
        if (/[a-z]/.test(v) && /[A-Z]/.test(v)) { score++; }
        if (/\d/.test(v)) { score++; }
        if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) { score++; }
        $input.closest("form").find(".password-strength")
            .attr("class", "password-strength strength-" + (v ? score : 0));
    }

    function startSpinner($btn) {
        $btn.data("originalHtml", $btn.html());
        $btn.prop("disabled", true).html(
            '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + t("wait")
        );
    }

    function stopSpinner($btn) {
        $btn.prop("disabled", false).html($btn.data("originalHtml"));
    }

    function setStatus($el, type, message) {
        $el.removeClass("success error").addClass(type).text(message).show();
    }

    // Async POST with a callback (Assignment 5: "Responding to Events with Callbacks").
    // Uses the free JSONPlaceholder test API; it simulates a server and stores nothing.
    function sendFormData(url, payload, callback) {
        const minimumDelay = new Promise(function (resolve) { setTimeout(resolve, 900); });
        const request = fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify(payload)
        }).then(function (response) {
            if (!response.ok) { throw new Error("HTTP " + response.status); }
            return response.json();
        });
        Promise.all([request, minimumDelay])
            .then(function (results) { callback(null, results[0]); })
            .catch(function (error) { callback(error); });
    }

    // Contact form
    $("#contact-form").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        const $status = $("#form-status");
        $status.hide();

        if (!validateForm($form)) {
            showToast("Error", t("toast.fix"));
            return;
        }

        const $btn = $form.find('button[type="submit"]');
        startSpinner($btn);
        sendFormData("https://jsonplaceholder.typicode.com/posts", {
            name: $("#name").val().trim(),
            email: $("#email").val().trim(),
            message: $("#message").val().trim()
        }, function (error) {
            stopSpinner($btn);
            if (error) {
                setStatus($status, "error", t("status.error"));
                showToast("Error", t("status.error"));
                return;
            }
            playSoundEffect(800);
            $form[0].reset();
            clearValidation($form);
            setStatus($status, "success", t("status.success"));
            showToast("Success", t("status.success"));
        });
    });

    // Registration form (email, password length, confirmation). Passwords are never stored or sent anywhere.
    $("#register-form").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        if (!validateForm($form)) {
            showToast("Error", t("toast.fix"));
            return;
        }
        const $btn = $form.find('button[type="submit"]');
        const fanName = $("#reg-name").val().trim();
        startSpinner($btn);
        setTimeout(function () {
            stopSpinner($btn);
            playSoundEffect(800);
            store.set("f1-user-name", fanName);
            $form[0].reset();
            clearValidation($form);
            renderGreeting();
            showToast("Success", t("reg.success") + " " + fanName + "!");
        }, 1500);
    });

    // Newsletter popup form
    $("#subscribe-form").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        if (!validateForm($form)) { return; }
        const $btn = $form.find('button[type="submit"]');
        startSpinner($btn);
        setTimeout(function () {
            stopSpinner($btn);
            playSoundEffect(800);
            $form[0].reset();
            clearValidation($form);
            closePopup();
            showToast("Subscribed", t("popup.success"));
        }, 1200);
    });

    /* ======================================================================
       12. GREETING, CURRENT TIME BUTTON, RANDOM FACT (Assignment 5)
       ====================================================================== */
    function getGreetingKey(hour) {
        switch (true) {
            case hour >= 5 && hour < 12: return "greet.morning";
            case hour >= 12 && hour < 18: return "greet.afternoon";
            case hour >= 18 && hour < 23: return "greet.evening";
            default: return "greet.night";
        }
    }

    function renderGreeting() {
        const $greeting = document.getElementById("greeting");
        if (!$greeting) { return; }
        const name = store.get("f1-user-name", "");
        $greeting.textContent = t(getGreetingKey(new Date().getHours())) + ", " + (name || t("greet.default")) + "! 🏁";
    }

    $("#greeting-form").on("submit", function (e) {
        e.preventDefault();
        playSoundEffect();
        const name = $("#greeting-name").val().trim().slice(0, 30);
        store.set("f1-user-name", name);
        renderGreeting();
    });

    $(document).on("click", "#time-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        document.getElementById("current-time-output").textContent =
            new Date().toLocaleTimeString(LOCALES[currentLang]);
    });

    let facts = [
        "The first Formula 1 World Championship race took place at Silverstone in 1950.",
        "A modern F1 pit stop can be completed in under 2.5 seconds.",
        "Monza is nicknamed the 'Temple of Speed'."
    ];
    let lastFactIndex = -1;

    function loadFacts(callback) {
        fetch("data/facts.json")
            .then(function (response) {
                if (!response.ok) { throw new Error("HTTP " + response.status); }
                return response.json();
            })
            .then(function (data) { if (Array.isArray(data) && data.length) { facts = data; } })
            .catch(function () { /* keep the built-in facts (e.g. when opened via file://) */ })
            .finally(callback);
    }

    function showRandomFact() {
        const $fact = $("#fact-text");
        if (!$fact.length) { return; }
        let index;
        do { index = Math.floor(Math.random() * facts.length); }
        while (facts.length > 1 && index === lastFactIndex);
        lastFactIndex = index;
        $fact.stop(true, true).fadeOut(150, function () {
            $(this).text(facts[index]).fadeIn(250);
        });
    }

    $(document).on("click", "#fact-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        showRandomFact();
    });

    /* ======================================================================
       13. KEYBOARD NAVIGATION for the menu (Assignment 5)
       ====================================================================== */
    $(document).on("keydown", ".nav-menu a, .nav-menu button", function (e) {
        const $items = $(".nav-menu").find("a, button").filter(":visible");
        const index = $items.index(this);
        const last = $items.length - 1;
        let next;

        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                next = index >= last ? 0 : index + 1;
                break;
            case "ArrowLeft":
            case "ArrowUp":
                next = index <= 0 ? last : index - 1;
                break;
            case "Home":
                next = 0;
                break;
            case "End":
                next = last;
                break;
            default:
                return;
        }
        e.preventDefault();
        $items.eq(next).trigger("focus");
    });

    /* ======================================================================
       13b. IMAGE LIGHTBOX (jQuery): click a photo to enlarge, browse its gallery
       ====================================================================== */
    const lb = { group: [], index: 0, lastFocus: null, touchX: null };

    function lightboxIsOpen() { return $("#lightbox").hasClass("open"); }

    function captionFor($img) {
        const key = $img.attr("data-caption-key");
        return key ? t(key) : ($img.attr("alt") || "");
    }

    function showLightboxImage() {
        const img = lb.group[lb.index];
        if (!img) { return; }
        const $img = $(img);
        const full = $img.attr("data-full") || img.currentSrc || img.src;
        $("#lb-img").removeClass("lb-ready").attr({ src: full, alt: $img.attr("alt") || "" });
        $("#lb-caption").text(captionFor($img) + (lb.group.length > 1 ? "  ·  " + (lb.index + 1) + " / " + lb.group.length : ""));
        $("#lightbox .lb-prev, #lightbox .lb-next").toggle(lb.group.length > 1);

        // preload the neighbours so browsing feels instant
        [1, -1].forEach(function (step) {
            const n = lb.group[(lb.index + step + lb.group.length) % lb.group.length];
            if (n) { new Image().src = $(n).attr("data-full") || n.src; }
        });
    }

    function stepLightbox(step) {
        if (lb.group.length < 2) { return; }
        lb.index = (lb.index + step + lb.group.length) % lb.group.length;
        playSoundEffect(500);
        showLightboxImage();
    }

    function setCarouselPaused(paused) {
        const el = document.getElementById("f1Carousel");
        if (el && window.bootstrap && window.bootstrap.Carousel) {
            const carousel = window.bootstrap.Carousel.getOrCreateInstance(el);
            if (paused) { carousel.pause(); } else { carousel.cycle(); }
        }
    }

    function openLightbox($img) {
        lb.group = $('img.zoomable[data-gallery="' + $img.attr("data-gallery") + '"]').toArray();
        lb.index = Math.max(0, lb.group.indexOf($img[0]));
        lb.lastFocus = document.activeElement;
        $("#lightbox .lb-close").attr("aria-label", t("lb.close"));
        $("#lightbox .lb-prev").attr("aria-label", t("lb.prev"));
        $("#lightbox .lb-next").attr("aria-label", t("lb.next"));
        showLightboxImage();
        $("#lightbox").addClass("open").attr("aria-hidden", "false");
        $("body").addClass("lb-open");
        setCarouselPaused(true);
        $("#lightbox .lb-close").trigger("focus");
    }

    function closeLightbox() {
        if (!lightboxIsOpen()) { return; }
        $("#lightbox").removeClass("open").attr("aria-hidden", "true");
        $("body").removeClass("lb-open");
        $("#lb-img").removeAttr("src");
        setCarouselPaused(false);
        if (lb.lastFocus && lb.lastFocus.focus) { lb.lastFocus.focus(); }
    }

    $(document).on("click", "img.zoomable", function (e) {
        e.preventDefault();
        playSoundEffect(520);
        openLightbox($(this));
    });

    $(document).on("keydown", "img.zoomable", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox($(this)); }
    });

    $(document).on("click", "#lightbox .lb-close", closeLightbox);
    $(document).on("click", "#lightbox .lb-prev", function () { stepLightbox(-1); });
    $(document).on("click", "#lightbox .lb-next", function () { stepLightbox(1); });
    $(document).on("click", "#lightbox", function (e) {
        if (e.target === this || $(e.target).hasClass("lb-figure")) { closeLightbox(); }
    });

    $(document).on("keydown", function (e) {
        if (!lightboxIsOpen()) { return; }
        switch (e.key) {
            case "Escape": closeLightbox(); break;
            case "ArrowLeft": e.preventDefault(); stepLightbox(-1); break;
            case "ArrowRight": e.preventDefault(); stepLightbox(1); break;
            case "Tab": {
                // keep keyboard focus inside the open lightbox
                const $focusable = $("#lightbox .lb-btn:visible");
                const first = $focusable.get(0);
                const last = $focusable.get($focusable.length - 1);
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                break;
            }
            default: break;
        }
    });

    // Touch swipe on phones
    $(document).on("touchstart", "#lightbox", function (e) {
        lb.touchX = e.originalEvent.touches[0].clientX;
    });
    $(document).on("touchend", "#lightbox", function (e) {
        if (lb.touchX === null) { return; }
        const dx = e.originalEvent.changedTouches[0].clientX - lb.touchX;
        lb.touchX = null;
        if (Math.abs(dx) > 50) { stepLightbox(dx < 0 ? 1 : -1); }
    });

    $("#lb-img").on("load", function () { $(this).addClass("lb-ready"); });

    /* ======================================================================
       14. COPY TO CLIPBOARD (Assignment 6, Task 8)
       ====================================================================== */
    let programmaticCopy = false;

    function fallbackCopy(text) {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.className = "offscreen-copy";
        document.body.appendChild(area);
        area.select();
        let ok = false;
        programmaticCopy = true;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        programmaticCopy = false;
        document.body.removeChild(area);
        return ok;
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text)
                .then(function () { return true; })
                .catch(function () { return fallbackCopy(text); });
        }
        return Promise.resolve(fallbackCopy(text));
    }

    function markCopied($btn, text) {
        const $icon = $btn.find(".copy-icon");
        const $label = $btn.find(".copy-label");
        const originalKey = $label.attr("data-i18n");

        clearTimeout($btn.data("copyTimer"));
        $btn.find(".copy-tooltip").remove();
        $btn.addClass("copied");
        $icon.text("✓");
        $label.text(t("copy.done"));
        $btn.append($('<i class="copy-tooltip" role="status"></i>').text(t("copy.tooltip")));
        showToast("Clipboard", 'Copied "' + text + '" to clipboard!');

        $btn.data("copyTimer", setTimeout(function () {
            $btn.removeClass("copied");
            $icon.text("📋");
            $label.text(t(originalKey));
            $btn.find(".copy-tooltip").remove();
        }, 2300));
    }

    $(document).on("click", ".btn-copy", function (e) {
        e.preventDefault();
        playSoundEffect();
        const $btn = $(this);
        const text = $($btn.data("clipboard-target")).text().trim();
        copyToClipboard(text).then(function (ok) {
            if (ok) { markCopied($btn, text); }
            else { showToast("Error", "Copy failed. Please select the text and press Ctrl+C."); }
        });
    });

    // Hint from the task: react to a manual copy of the text itself
    $(document).on("copy", ".copyable", function () {
        if (!programmaticCopy) { showToast("Clipboard", "Text copied!"); }
    });

    /* ======================================================================
       15. SCROLL EFFECTS: progress bar, reveal, lazy loading, counters, clock
       ====================================================================== */
    function updateProgress() {
        const winScroll = $(window).scrollTop();
        const height = $(document).height() - $(window).height();
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        $("#scroll-progress").css("width", scrolled + "%");
    }

    function revealOnScroll() {
        const viewBottom = $(window).scrollTop() + $(window).height() - 40;
        $(".reveal:not(.visible)").each(function () {
            if ($(this).offset().top < viewBottom) { $(this).addClass("visible"); }
        });
    }

    // Task 9: real lazy loading. Images keep a tiny placeholder src and get their
    // real src (data-src) only when they are about to enter the viewport.
    function lazyLoadImages() {
        const viewBottom = $(window).scrollTop() + $(window).height() + 150;
        $("img.lazy-load[data-src]").each(function () {
            const $img = $(this);
            // Images inside hidden carousel slides have no position of their own,
            // so measure the carousel instead (otherwise they would all load at once).
            const $ref = $img.closest(".carousel").length ? $img.closest(".carousel") : $img;
            if ($ref.offset().top < viewBottom) {
                const realSrc = $img.attr("data-src");
                $img.removeAttr("data-src")
                    .one("load", function () { $(this).addClass("lazy-loaded"); })
                    .one("error", function () { $(this).addClass("lazy-loaded lazy-error"); })
                    .attr("src", realSrc);
            }
        });
    }

    let scrollTicking = false;
    $(window).on("scroll resize", function () {
        if (scrollTicking) { return; }
        scrollTicking = true;
        window.requestAnimationFrame(function () {
            updateProgress();
            lazyLoadImages();
            revealOnScroll();
            scrollTicking = false;
        });
    });

    // Task 5: animated counters
    $(".counter-value").each(function () {
        const $counter = $(this);
        const target = parseInt($counter.attr("data-count"), 10) || 0;
        const suffix = $counter.attr("data-suffix") || "";
        $({ countNum: 0 }).animate({ countNum: target }, {
            duration: 2000,
            easing: "swing",
            step: function (now) { $counter.text(Math.floor(now) + suffix); },
            complete: function () { $counter.text(target + suffix); }
        });
    });

    // Assignment 4, Task 5: live date and time
    function updateClock() {
        const clockElement = document.getElementById("live-clock");
        if (!clockElement) { return; }
        const options = {
            month: "long", day: "numeric", year: "numeric",
            hour: "numeric", minute: "2-digit", second: "2-digit"
        };
        if (currentLang === "en") { options.hour12 = true; }
        clockElement.textContent = new Date().toLocaleString(LOCALES[currentLang], options);
    }
    setInterval(updateClock, 1000);

    /* ======================================================================
       16. INITIALISE
       ====================================================================== */
    renderRaces(races);
    renderLegends(driverLegends);
    paintStars(currentRating);
    $("#greeting-name").val(store.get("f1-user-name", ""));
    $(".card, .gallery-item, .theme-card").addClass("reveal");

    applyTheme(store.get("f1-theme", "dark"));
    applyLanguage(currentLang);
    loadFacts(showRandomFact);

    updateProgress();
    lazyLoadImages();
    revealOnScroll();
});
