// CONFIG
const CONFIG = {
    DEFAULT_LANGUAGE: "en",
    DEFAULT_THEME: "dark",
    THEME_KEY: "selectedTheme",
    TIMER_UPDATE_INTERVAL_MS: 100,
    MAX_HISTORY_ITEMS: 20,
    MAX_HISTORY_STORAGE_ITEMS: 100,
    TIMEFRAME_SECONDS: {
        "1S": 1,
        "5S": 5,
        "15S": 15,
        "30S": 30,
        "1M": 60,
        "3M": 180,
        "5M": 300,
        "15M": 900,
        "30M": 1800,
        "1H": 3600,
        "3H": 10800,
        "4H": 14400,
    },
    LOADING_INCREMENT_MIN: 5,
    LOADING_INCREMENT_MAX: 15,
    LOADING_INTERVAL_MS: 200,
    MIN_ACCURACY: 65,
    MAX_ACCURACY_VARIATION: 30,
    CURRENCY_TO_FLAG_MAP: {
        EUR: "eu",
        USD: "us",
        GBP: "gb",
        JPY: "jp",
        AUD: "au",
        CAD: "ca",
        CHF: "ch",
        NZD: "nz",
        CNY: "cn", // Chinese Yuan
        RUB: "ru", // Russian Ruble
        PKR: "pk", // Pakistani Rupee
        MXN: "mx", // Mexican Peso
        ZAR: "za", // South African Rand
        AED: "ae", // UAE Dirham
        JOD: "jo", // Jordanian Dinar
        SAR: "sa", // Saudi Riyal
        LBP: "lb", // Lebanese Pound
        YER: "ye", // Yemeni Rial
    },
    DATE_FORMAT_OPTIONS: {
        month: "2-digit",
        day: "2-digit",
    },
    TIME_FORMAT_OPTIONS: {
        hour: "2-digit",
        minute: "2-digit",
    },
};

// SELECTORS
const SELECTORS = {
    CURRENT_TIME: "#currentTime",
    LANGUAGE_OPTIONS: ".language-option",
    TYPE_BUTTONS: ".type-btn",
    LOADING_OVERLAY: "#loadingOverlay",
    LOADING_PROGRESS: "#loadingProgress",
    SELECTED_PAIR_FLAG: "#selectedPairFlag",
    SELECTED_PAIR_NAME: "#selectedPairName",
    SELECTED_TIMEFRAME: "#selectedTimeframe",
    SIGNAL_FLAGS: "#signalFlags",
    SIGNAL_PAIR_NAME: "#signalPairName",
    SIGNAL_PAIR_TYPE: "#signalPairType",
    ACCURACY_VALUE: "#accuracyValue",
    DIRECTION_ARROW: "#directionArrow",
    DIRECTION_TEXT: "#directionText",
    META_TIMEFRAME: "#metaTimeframe",
    PROGRESS_FILL: "#progressFill",
    PROGRESS_PERCENT: "#progressPercent",
    TIMER_DISPLAY: "#timerDisplay",
    GET_SIGNAL_BTN: "#getSignalBtn",
    RESET_SIGNAL_BTN: "#resetSignalBtn",
    SIGNAL_RESULT: "#signalResult",
    TOTAL_SIGNALS: "#totalSignals",
    SUCCESSFUL_SIGNALS: "#successfulSignals",
    FAILED_SIGNALS: "#failedSignals",
    SUCCESS_RATE: "#successRate",
    BEST_PAIR: "#bestPair",
    BEST_PAIR_BAR: "#bestPairBar",
    BEST_TIMEFRAME: "#bestTimeframe",
    BEST_TIMEFRAME_BAR: "#bestTimeframeBar",
    HISTORY_LIST: "#historyList",
    TABS: ".tab",
    CONTENT_SECTIONS: ".content-section",
    PAIR_TRIGGER: "#pairTrigger",
    PAIR_DROPDOWN: "#pairDropdown",
    TIMEFRAME_TRIGGER: "#timeframeTrigger",
    TIMEFRAME_DROPDOWN: "#timeframeDropdown",
    MENU_TRIGGER: "#menuTrigger",
    MENU_CLOSE: "#menuClose",
    SIDE_MENU: "#sideMenu",
    MENU_OVERLAY: "#menuOverlay",
    MENU_CHOOSE_LANGUAGE: "#menuChooseLanguage",
    MENU_CHOOSE_THEME: "#menuChooseTheme",
    LANGUAGE_MODAL_OVERLAY: "#languageModalOverlay",
    MODAL_CLOSE: "#modalClose",
    MODAL_LANG_BUTTONS: ".modal-lang-btn",
    MODAL_TITLE: "#modalTitle",
    TRADING_TYPE_SELECTOR: ".trading-type-selector",
    SELECTORS_WRAPPER: ".selectors-wrapper",
    PAIR_FLAGS_SELECT_CLASS: ".pair-flags-select",
    PAIR_OPTION_DROPDOWN_CLASS: ".pair-option-dropdown",
    TIMEFRAME_OPTION_CLASS: ".timeframe-option",
    HISTORY_ITEM_CLASS: ".history-item",
    PAIR_FLAG_CLASS: ".pair-flag",
    PAIR_FLAG_HISTORY_CLASS: ".pair-flag-history",
    PAIR_FLAG_SELECT_CLASS: ".pair-flag-select",
    HISTORY_PAIR_CLASS: ".history-pair",
    HISTORY_DETAILS_CLASS: ".history-details",
    HISTORY_PAIR_NAME_CLASS: ".history-pair-name",
    HISTORY_TIME_CLASS: ".history-time",
    HISTORY_RESULT_CLASS: ".history-result",
    STAT_LABEL_CLASS: ".stat-label",
    PROGRESS_LABEL_CLASS: ".progress-label",
    ACCURACY_LABEL_CLASS: ".accuracy-label",
    SIGNAL_TITLE_CLASS: ".signal-title",
    LOADING_TEXT_CLASS: ".loading-text",
    LOADING_SUBTEXT_CLASS: ".loading-subtext",
    DIRECTION_ARROW_LARGE_CLASS: ".direction-arrow-large",
    DIRECTION_TEXT_CLASS: ".direction-text",
    SIGNAL_RESULT_CLASS: ".signal-result",
    PANEL_CLASS: ".panel",
    CARD_CLASS: ".card",
    FA_BOLT_ICON: '<i class="fas fa-bolt"></i>',
    FA_REDO_ICON: '<i class="fas fa-redo"></i>',
    FA_SYNC_ALT_ICON: '<i class="fas fa-sync-alt"></i>',
    FA_CHART_LINE_ICON: '<i class="fas fa-chart-line"></i>',
    FA_USER_ICON: '<i class="fas fa-user"></i>',
    FA_HISTORY_ICON: '<i class="fas fa-history"></i>',
};

// App State
const state = {
    currentLang: CONFIG.DEFAULT_LANGUAGE,
    currentTheme: CONFIG.DEFAULT_THEME,
    tradingType: "regular",
    selectedPair: "EURUSD",
    selectedTimeframe: "1M",
    isSignalActive: false,
    timer: null,
    timerDuration: 0,
    timerRemaining: 0,
    signalHistory: [],
    stats: {
        totalSignals: 0,
        successfulSignals: 0,
        failedSignals: 0,
        pairPerformance: {},
        timeframePerformance: {},
    },
    currentSignal: null,
    startTime: null,
    currentPercent: 0,
};

// --- HELPER FUNCTIONS ---

/**
 * Вспомогательная функция для безопасного получения DOM-элемента
 * @param {string} selector - CSS селектор
 * @returns {HTMLElement|null} - Найденный элемент или null
 */
function getElement(selector) {
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.error("Ошибка при поиске элемента:", selector, e);
        return null;
    }
}

/**
 * Вспомогательная функция для безопасного получения коллекции DOM-элементов
 * @param {string} selector - CSS селектор
 * @returns {NodeList} - Найденная коллекция элементов
 */
function getElements(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (e) {
        console.error("Ошибка при поиске элементов:", selector, e);
        return [];
    }
}

/**
 * Вспомогательная функция для создания элемента флага
 * @param {string} flagCode - Код флага (например, 'eu', 'us')
 * @param {string} gradientColor - CSS градиент для фона
 * @returns {HTMLDivElement} - Готовый элемент флага
 */
function createFlagElement(flagCode, gradientColor) {
    const flagDiv = document.createElement("div");
    flagDiv.className = "pair-flag";
    flagDiv.style.backgroundImage = `linear-gradient(135deg, ${gradientColor})`;
    flagDiv.style.display = "flex";
    flagDiv.style.alignItems = "center";
    flagDiv.style.justifyContent = "center";
    flagDiv.style.overflow = "hidden";
    const flagIcon = document.createElement("span");
    flagIcon.className = `fi fi-${flagCode}`;
    flagIcon.style.fontSize = "28px";
    flagIcon.style.color = "white";
    flagDiv.appendChild(flagIcon);
    return flagDiv;
}

/**
 * Вспомогательная функция для получения текущего объекта пары
 * @returns {Object} - Объект пары
 */
function getCurrentPairObject() {
    const pairs =
        state.tradingType === "otc"
            ? translations.otcPairs
            : translations.regularPairs;
    return pairs.find((p) => p.code === state.selectedPair) || pairs[0];
}

// --- UPDATE DISPLAY FUNCTIONS ---

function updateDisplay() {
    const pairs =
        state.tradingType === "otc"
            ? translations.otcPairs
            : translations.regularPairs;
    const pair = pairs.find((p) => p.code === state.selectedPair) || pairs[0];
    const selectedPairNameEl = getElement(SELECTORS.SELECTED_PAIR_NAME);
    const signalPairNameEl = getElement(SELECTORS.SIGNAL_PAIR_NAME);
    const signalPairTypeEl = getElement(SELECTORS.SIGNAL_PAIR_TYPE);
    if (selectedPairNameEl) selectedPairNameEl.textContent = pair.name;
    if (signalPairNameEl) signalPairNameEl.textContent = pair.name;
    if (signalPairTypeEl)
        signalPairTypeEl.textContent =
            state.tradingType === "otc" ? "OTC" : "Regular";
    updateSignalFlags(pair);
    const timeframes =
        state.tradingType === "otc"
            ? translations.otcTimeframes
            : translations.regularTimeframes;
    const timeframe =
        timeframes.find((t) => t.code === state.selectedTimeframe) ||
        timeframes[0];
    const selectedTimeframeEl = getElement(SELECTORS.SELECTED_TIMEFRAME);
    const metaTimeframeEl = getElement(SELECTORS.META_TIMEFRAME);
    if (selectedTimeframeEl) selectedTimeframeEl.textContent = timeframe.name;
    if (metaTimeframeEl) metaTimeframeEl.textContent = timeframe.name;
    highlightSelectedPair();
    highlightSelectedTimeframe();
}

function updateProgress() {
    const percent = state.currentPercent || 0;
    const elapsed = Math.round((percent / 100) * state.timerDuration);
    const remaining = state.timerDuration - elapsed;
    const progressFillEl = getElement(SELECTORS.PROGRESS_FILL);
    const progressPercentEl = getElement(SELECTORS.PROGRESS_PERCENT);
    const timerDisplayEl = getElement(SELECTORS.TIMER_DISPLAY);
    if (progressFillEl) progressFillEl.style.width = `${percent}%`;
    if (progressPercentEl)
        progressPercentEl.textContent = `${(state.currentPercent || 0).toFixed(
            2,
        )}%`;
    if (timerDisplayEl)
        timerDisplayEl.textContent = `${formatTime(elapsed)} / ${formatTime(
            state.timerDuration,
        )}`;
}

function updateHistoryDisplay() {
    const historyListEl = getElement(SELECTORS.HISTORY_LIST);
    if (!historyListEl) return;
    historyListEl.innerHTML = "";
    if (state.signalHistory.length === 0) {
        const emptyItem = document.createElement("div");
        emptyItem.className = "history-item";
        emptyItem.style.opacity = "0.7";
        emptyItem.style.fontStyle = "italic";
        emptyItem.style.justifyContent = "center";
        emptyItem.textContent = "No signals yet";
        historyListEl.appendChild(emptyItem);
        return;
    }
    state.signalHistory.slice(0, CONFIG.MAX_HISTORY_ITEMS).forEach((signal) => {
        const item = document.createElement("div");
        item.className = "history-item";
        const timeStr = signal.startTime.toLocaleTimeString(
            [],
            CONFIG.TIME_FORMAT_OPTIONS,
        );
        const dateStr = signal.startTime.toLocaleDateString(
            [],
            CONFIG.DATE_FORMAT_OPTIONS,
        );
        const pairName = signal.pairName.replace(" OTC", "");
        const currencies = pairName.split("/");
        const baseCurrency = currencies[0]?.trim();
        const quoteCurrency = currencies[1]?.trim();
        const baseFlagCode = CONFIG.CURRENCY_TO_FLAG_MAP[baseCurrency] || "xx";
        const quoteFlagCode =
            CONFIG.CURRENCY_TO_FLAG_MAP[quoteCurrency] || "xx";
        const pairContainer = document.createElement("div");
        pairContainer.className = "history-pair";
        const flagsContainer = document.createElement("div");
        flagsContainer.style.display = "flex";
        flagsContainer.style.marginRight = "8px";
        const baseFlag = createFlagElement(
            baseFlagCode,
            "var(--accent), var(--accent2)",
        );
        baseFlag.className = "pair-flag-history";
        baseFlag.style.marginRight = "4px";
        const quoteFlag = createFlagElement(
            quoteFlagCode,
            "var(--danger), #ff9900",
        );
        quoteFlag.className = "pair-flag-history";
        flagsContainer.appendChild(baseFlag);
        flagsContainer.appendChild(quoteFlag);
        const detailsContainer = document.createElement("div");
        detailsContainer.className = "history-details";
        detailsContainer.innerHTML = `
            <div class="history-pair-name">${signal.pairName}</div>
            <div class="history-time">${dateStr} • ${timeStr} • ${signal.timeframe}</div>
        `;
        pairContainer.appendChild(flagsContainer);
        pairContainer.appendChild(detailsContainer);
        const resultContainer = document.createElement("div");
        resultContainer.className = `history-result ${
            signal.result === "win" ? "history-win" : "history-loss"
        }`;
        resultContainer.textContent = signal.resultSimple;
        item.appendChild(pairContainer);
        item.appendChild(resultContainer);
        historyListEl.appendChild(item);
    });
}

// --- SETUP FUNCTIONS ---

function setupTradingTypeSelector() {
    const typeButtons = getElements(SELECTORS.TYPE_BUTTONS);
    typeButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            typeButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.tradingType = btn.dataset.type;
            const allowedTimeframes =
                state.tradingType === "otc"
                    ? translations.otcTimeframes
                    : translations.regularTimeframes;
            const isValid = allowedTimeframes.some(
                (tf) => tf.code === state.selectedTimeframe,
            );
            if (!isValid) {
                state.selectedTimeframe = allowedTimeframes[0].code;
            }
            updateDisplay();
            populatePairDropdown();
            populateTimeframeDropdown();
        });
    });
}

function setupPairSelector() {
    const pairTrigger = getElement(SELECTORS.PAIR_TRIGGER);
    const pairDropdown = getElement(SELECTORS.PAIR_DROPDOWN);
    if (!pairTrigger || !pairDropdown) return;
    pairTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        pairDropdown.classList.toggle("active");
        closeOtherDropdowns("pair");
    });
    populatePairDropdown();
    document.addEventListener("click", (e) => {
        if (
            !pairTrigger.contains(e.target) &&
            !pairDropdown.contains(e.target)
        ) {
            pairDropdown.classList.remove("active");
        }
    });
}

function setupTimeframeSelector() {
    const timeframeTrigger = getElement(SELECTORS.TIMEFRAME_TRIGGER);
    const timeframeDropdown = getElement(SELECTORS.TIMEFRAME_DROPDOWN);
    if (!timeframeTrigger || !timeframeDropdown) return;
    timeframeTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        timeframeDropdown.classList.toggle("active");
        closeOtherDropdowns("timeframe");
    });
    populateTimeframeDropdown();
    document.addEventListener("click", (e) => {
        if (
            !timeframeTrigger.contains(e.target) &&
            !timeframeDropdown.contains(e.target)
        ) {
            timeframeDropdown.classList.remove("active");
        }
    });
}

function setupTabs() {
    const tabs = getElements(SELECTORS.TABS);
    const contentSections = getElements(SELECTORS.CONTENT_SECTIONS);
    const tradingTypeSelector = getElement(SELECTORS.TRADING_TYPE_SELECTOR);
    const selectorsWrapper = getElement(SELECTORS.SELECTORS_WRAPPER);
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.stopPropagation();
            const tabName = tab.dataset.tab;
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            contentSections.forEach((section) => {
                section.classList.remove("active");
                if (section.id === `${tabName}Section`) {
                    section.classList.add("active");
                }
            });
            if (tabName === "signals") {
                if (tradingTypeSelector) tradingTypeSelector.style.display = "";
                if (selectorsWrapper) selectorsWrapper.style.display = "";
            } else {
                if (tradingTypeSelector)
                    tradingTypeSelector.style.display = "none";
                if (selectorsWrapper) selectorsWrapper.style.display = "none";
            }
        });
    });
}

function setupButtons() {
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    const resetSignalBtn = getElement(SELECTORS.RESET_SIGNAL_BTN);
    if (getSignalBtn) {
        getSignalBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            generateSignal();
        });
    }
    if (resetSignalBtn) {
        resetSignalBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            resetSignal();
        });
    }
}

// --- MENU & MODAL SETUP FUNCTIONS ---

function setupMenu() {
    const menuTrigger = getElement(SELECTORS.MENU_TRIGGER);
    const menuClose = getElement(SELECTORS.MENU_CLOSE);
    const sideMenu = getElement(SELECTORS.SIDE_MENU);
    const menuOverlay = getElement(SELECTORS.MENU_OVERLAY);
    const menuChooseLanguage = getElement(SELECTORS.MENU_CHOOSE_LANGUAGE);
    const menuChooseTheme = getElement(SELECTORS.MENU_CHOOSE_THEME);
    if (!menuTrigger || !menuClose || !sideMenu || !menuOverlay) return;

    function toggleMenu() {
        sideMenu.classList.toggle("active");
        menuOverlay.classList.toggle("active");
    }
    menuTrigger.addEventListener("click", toggleMenu);
    menuClose.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", toggleMenu);
    if (menuChooseLanguage) {
        menuChooseLanguage.addEventListener("click", (e) => {
            toggleMenu();
            if (
                setupLanguageModal &&
                typeof setupLanguageModal.show === "function"
            ) {
                setupLanguageModal.show();
            }
        });
    }
    if (menuChooseTheme) {
        menuChooseTheme.addEventListener("click", (e) => {
            toggleMenu();
            toggleTheme();
        });
    }
}

function setupLanguageModal() {
    const languageModalOverlay = getElement(SELECTORS.LANGUAGE_MODAL_OVERLAY);
    const modalClose = getElement(SELECTORS.MODAL_CLOSE);
    const modalLangButtons = getElements(SELECTORS.MODAL_LANG_BUTTONS);
    const modalTitle = getElement(SELECTORS.MODAL_TITLE);
    if (
        !languageModalOverlay ||
        !modalClose ||
        !modalLangButtons ||
        !modalTitle
    ) {
        console.warn("Не все элементы модального окна языка найдены.");
        return;
    }

    setupLanguageModal.show = function () {
        languageModalOverlay.classList.add("active");
        updateModalText();
    };

    setupLanguageModal.hide = function () {
        languageModalOverlay.classList.remove("active");
    };

    modalClose.addEventListener("click", setupLanguageModal.hide);
    languageModalOverlay.addEventListener("click", (e) => {
        if (e.target === languageModalOverlay) {
            setupLanguageModal.hide();
        }
    });

    modalLangButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
            setupLanguageModal.hide();
        });
    });

    function updateModalText() {
        const texts =
            translations.texts[state.currentLang] || translations.texts.en;
        modalTitle.textContent = texts.chooseLanguage || "Choose Language";
    }
}

function setupThemeToggle() {
    const savedTheme =
        localStorage.getItem(CONFIG.THEME_KEY) || CONFIG.DEFAULT_THEME;
    state.currentTheme = savedTheme;
    applyTheme(state.currentTheme);
    console.log("Theme toggle initialized.");
}

function setupThemeToggleInMenu() {
    updateMenuTexts();
}

// --- CORE LOGIC FUNCTIONS ---

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTimeEl = getElement(SELECTORS.CURRENT_TIME);
    if (currentTimeEl) currentTimeEl.textContent = `${hours}:${minutes}`;
}

function updateUIText() {
    const langTexts =
        translations.texts[state.currentLang] || translations.texts.en;
    const signalTypeLabelEl = getElement("#signalTypeLabel");
    if (signalTypeLabelEl)
        signalTypeLabelEl.textContent = langTexts.signalType || "Signal Type";
    const regularBtn = document.querySelector(
        `${SELECTORS.TYPE_BUTTONS}[data-type="regular"]`,
    );
    const otcBtn = document.querySelector(
        `${SELECTORS.TYPE_BUTTONS}[data-type="otc"]`,
    );
    if (regularBtn) regularBtn.textContent = langTexts.regular;
    if (otcBtn) otcBtn.textContent = langTexts.otc;
    const selectorLabels = getElements(SELECTORS.STAT_LABEL_CLASS);
    if (selectorLabels[0])
        selectorLabels[0].textContent = langTexts.currencyPair;
    if (selectorLabels[1]) selectorLabels[1].textContent = langTexts.timeframe;
    const accuracyLabel = getElement(SELECTORS.ACCURACY_LABEL_CLASS);
    if (accuracyLabel) accuracyLabel.textContent = langTexts.accuracy;
    const signalTitle = getElement(SELECTORS.SIGNAL_TITLE_CLASS);
    if (signalTitle) signalTitle.textContent = langTexts.currentSignal;
    const progressLabels = getElements(SELECTORS.PROGRESS_LABEL_CLASS);
    if (progressLabels[0]) {
        progressLabels[0].textContent =
            langTexts.signalProgress || "Signal Progress";
    }
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    const resetSignalBtn = getElement(SELECTORS.RESET_SIGNAL_BTN);
    if (getSignalBtn) {
        getSignalBtn.innerHTML = `${SELECTORS.FA_BOLT_ICON} ${langTexts.getSignal}`;
    }
    if (resetSignalBtn) {
        resetSignalBtn.innerHTML = `${SELECTORS.FA_REDO_ICON} ${langTexts.resetSignal}`;
    }
    const signalsTab = document.querySelector(
        `${SELECTORS.TABS}[data-tab="signals"]`,
    );
    const profileTab = document.querySelector(
        `${SELECTORS.TABS}[data-tab="profile"]`,
    );
    const historyTab = document.querySelector(
        `${SELECTORS.TABS}[data-tab="history"]`,
    );
    if (signalsTab)
        signalsTab.innerHTML = `${SELECTORS.FA_CHART_LINE_ICON} ${langTexts.signals}`;
    if (profileTab)
        profileTab.innerHTML = `${SELECTORS.FA_USER_ICON} ${langTexts.profile}`;
    if (historyTab)
        historyTab.innerHTML = `${SELECTORS.FA_HISTORY_ICON} ${langTexts.history}`;
    const profileTitle = getElement("#profileSection h3");
    if (profileTitle) profileTitle.textContent = langTexts.profileStats;
    const statLabels = getElements(SELECTORS.STAT_LABEL_CLASS);
    if (statLabels[0]) statLabels[0].textContent = langTexts.totalSignals;
    if (statLabels[1]) statLabels[1].textContent = langTexts.successful;
    if (statLabels[2]) statLabels[2].textContent = langTexts.failed;
    if (statLabels[3]) statLabels[3].textContent = langTexts.successRate;
    const performanceLabel = getElement(".meta-label");
    if (performanceLabel)
        performanceLabel.textContent = langTexts.performanceMetrics;
    const directionTextEl = getElement(SELECTORS.DIRECTION_TEXT);
    if (directionTextEl) {
        // Получаем все возможные переводы "Waiting for signal..."
        const waitingTranslations = Object.values(translations.texts).map(
            (t) => t.waiting,
        );
        // Проверяем, строго ли текущий текст совпадает с одним из них
        if (waitingTranslations.includes(directionTextEl.textContent.trim())) {
            // Если да, принудительно обновляем его значением для текущего языка
            directionTextEl.textContent =
                langTexts.waiting || "Waiting for signal...";
        } else if (
            // Старая проверка для BUY/SELL
            directionTextEl.textContent === "BUY" ||
            directionTextEl.textContent === "SELL" ||
            directionTextEl.textContent === "ПОКУПКА" ||
            directionTextEl.textContent === "ПРОДАЖА" ||
            directionTextEl.textContent === "COMPRAR" ||
            directionTextEl.textContent === "VENDER" ||
            directionTextEl.textContent === "खरीदें" ||
            directionTextEl.textContent === "बेचें"
        ) {
            const isBuy = directionTextEl.classList.contains("direction-buy");
            const btnTexts =
                translations.btnTexts[state.currentLang] ||
                translations.btnTexts.en;
            directionTextEl.textContent = isBuy ? btnTexts.buy : btnTexts.sell;
        }
    }
    updateHistoryDisplay();
}

function updateMenuTexts() {
    const texts =
        translations.texts[state.currentLang] || translations.texts.en;
    const menuChooseLanguage = getElement(SELECTORS.MENU_CHOOSE_LANGUAGE);
    const menuChooseTheme = getElement(SELECTORS.MENU_CHOOSE_THEME);
    if (menuChooseLanguage) {
        menuChooseLanguage.textContent = texts.chooseLanguage;
    }
    if (menuChooseTheme) {
        const themeButtonText =
            state.currentTheme === "dark"
                ? texts.switchToLightTheme
                : texts.switchToDarkTheme;
        menuChooseTheme.textContent =
            themeButtonText ||
            (state.currentTheme === "dark"
                ? "Switch to Light Theme"
                : "Switch to Dark Theme");
    }
}

function changeLanguage(lang) {
    state.currentLang = lang;
    updateUIText();
    updateMenuTexts();
}

function toggleTheme() {
    state.currentTheme = state.currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem(CONFIG.THEME_KEY, state.currentTheme);
    applyTheme(state.currentTheme);
    updateUITheme();
    updateMenuTexts();
}

function applyTheme(themeName) {
    const root = document.documentElement;
    if (themeName === "light") {
        root.style.setProperty("--bg", "#f0f4ff");
        root.style.setProperty("--panel", "#ffffff");
        root.style.setProperty("--card", "#ffffff");
        root.style.setProperty("--muted", "#666666");
        root.style.setProperty("--accent", "#2d8cff");
        root.style.setProperty("--accent2", "#6a5bff");
        root.style.setProperty("--success", "#00aa55");
        root.style.setProperty("--danger", "#cc3333");
        root.style.setProperty("--warning", "#ff9900");
        root.style.setProperty("--glass", "rgba(255, 255, 255, 0.8)");
        root.style.setProperty("--text-primary", "#1a1a1a");
        root.style.setProperty("--text-secondary", "#4d4d4d");
        root.style.setProperty("--regular-bg", "rgba(0, 170, 85, 0.15)");
        root.style.setProperty("--regular-color", "#00aa55");
        root.style.setProperty("--otc-bg", "rgba(45, 140, 255, 0.15)");
        root.style.setProperty("--otc-color", "#2d8cff");
        root.style.setProperty(
            "--shadow-dark",
            "0 8px 30px rgba(0, 0, 0, 0.1)",
        );
        root.style.setProperty(
            "--shadow-inset-dark",
            "inset 0 1px 0 rgba(0, 0, 0, 0.02)",
        );
        root.style.setProperty(
            "--shadow-light",
            "0 8px 30px rgba(0, 0, 0, 0.1)",
        );
    } else {
        root.style.setProperty("--bg", "#050814");
        root.style.setProperty("--panel", "#0b1630");
        root.style.setProperty("--card", "#0d1b36");
        root.style.setProperty("--muted", "#8a94b3");
        root.style.setProperty("--accent", "#2d8cff");
        root.style.setProperty("--accent2", "#6a5bff");
        root.style.setProperty("--success", "#00ff88");
        root.style.setProperty("--danger", "#ff5555");
        root.style.setProperty("--warning", "#ffcc00");
        root.style.setProperty("--glass", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "#b8c1e0");
        root.style.setProperty("--regular-bg", "rgba(0, 255, 136, 0.15)");
        root.style.setProperty("--regular-color", "#00ff88");
        root.style.setProperty("--otc-bg", "rgba(45, 140, 255, 0.15)");
        root.style.setProperty("--otc-color", "#2d8cff");
        root.style.setProperty(
            "--shadow-dark",
            "0 8px 30px rgba(2, 6, 23, 0.7)",
        );
        root.style.setProperty(
            "--shadow-inset-dark",
            "inset 0 1px 0 rgba(255, 255, 255, 0.02)",
        );
        root.style.setProperty(
            "--shadow-light",
            "0 8px 30px rgba(255, 255, 255, 0.05)",
        );
    }
    updateSignalFlags(getCurrentPairObject());
    updateHistoryDisplay();
}

function updateUITheme() {
    console.log(`Theme updated to: ${state.currentTheme}`);
}

function updateSignalFlags(pair) {
    const signalFlagsEl = getElement(SELECTORS.SIGNAL_FLAGS);
    if (!signalFlagsEl) return;
    signalFlagsEl.innerHTML = "";
    const pairName = pair.name.replace(" OTC", "");
    const currencies = pairName.split("/");
    const baseCurrency = currencies[0]?.trim();
    const quoteCurrency = currencies[1]?.trim();
    const baseFlagCode = CONFIG.CURRENCY_TO_FLAG_MAP[baseCurrency] || "xx";
    const quoteFlagCode = CONFIG.CURRENCY_TO_FLAG_MAP[quoteCurrency] || "xx";
    const baseFlagDiv = createFlagElement(
        baseFlagCode,
        "var(--accent), var(--accent2)",
    );
    const quoteFlagDiv = createFlagElement(
        quoteFlagCode,
        "var(--danger), #ff9900",
    );
    signalFlagsEl.appendChild(baseFlagDiv);
    signalFlagsEl.appendChild(quoteFlagDiv);
}

function populatePairDropdown() {
    const pairDropdown = getElement(SELECTORS.PAIR_DROPDOWN);
    if (!pairDropdown) return;
    pairDropdown.innerHTML = "";
    const pairs =
        state.tradingType === "otc"
            ? translations.otcPairs
            : translations.regularPairs;
    pairs.forEach((pair) => {
        const option = document.createElement("div");
        option.className = "pair-option-dropdown";
        option.dataset.code = pair.code;
        const pairName = pair.name.replace(" OTC", "");
        const currencies = pairName.split("/");
        const baseCurrency = currencies[0]?.trim();
        const quoteCurrency = currencies[1]?.trim();
        const baseFlagCode = CONFIG.CURRENCY_TO_FLAG_MAP[baseCurrency] || "xx";
        const quoteFlagCode =
            CONFIG.CURRENCY_TO_FLAG_MAP[quoteCurrency] || "xx";
        const flagsContainer = document.createElement("div");
        flagsContainer.className = "pair-flags-select";
        flagsContainer.style.position = "relative";
        flagsContainer.style.width = "40px";
        flagsContainer.style.height = "24px";
        const baseFlag = document.createElement("div");
        baseFlag.className = "pair-flag-select";
        Object.assign(baseFlag.style, {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            position: "absolute",
            left: "0",
            zIndex: "2",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow:
                "0 0 0 1px rgba(255, 255, 255, 0.8), 1px 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--panel)",
        });
        const baseIcon = document.createElement("span");
        baseIcon.className = `fi fi-${baseFlagCode}`;
        baseIcon.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: transparent;
        `;
        baseFlag.appendChild(baseIcon);
        const quoteFlag = document.createElement("div");
        quoteFlag.className = "pair-flag-select";
        Object.assign(quoteFlag.style, {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            position: "absolute",
            left: "16px",
            zIndex: "1",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow:
                "0 0 0 1px rgba(255, 255, 255, 0.8), 1px 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--panel)",
        });
        const quoteIcon = document.createElement("span");
        quoteIcon.className = `fi fi-${quoteFlagCode}`;
        quoteIcon.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: transparent;
        `;
        quoteFlag.appendChild(quoteIcon);
        flagsContainer.appendChild(baseFlag);
        flagsContainer.appendChild(quoteFlag);
        const textDiv = document.createElement("div");
        textDiv.textContent = pair.name;
        textDiv.style.cssText =
            "font-weight: 700; font-size: 14px; margin-left: 12px;";
        option.style.display = "flex";
        option.style.alignItems = "center";
        option.style.gap = "8px";
        option.appendChild(flagsContainer);
        option.appendChild(textDiv);
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            selectPair(pair.code);
            const dropdownOverlay = document.querySelector("#dropdownOverlay");
            pairDropdown.classList.remove("active");
            dropdownOverlay?.classList.remove("active");
        });
        pairDropdown.appendChild(option);
    });
}

function highlightSelectedPair() {
    const options = getElements(SELECTORS.PAIR_OPTION_DROPDOWN_CLASS);
    options.forEach((option) => {
        if (option.dataset.code === state.selectedPair) {
            option.classList.add("active");
        } else {
            option.classList.remove("active");
        }
    });
}

function populateTimeframeDropdown() {
    const timeframeDropdown = getElement(SELECTORS.TIMEFRAME_DROPDOWN);
    if (!timeframeDropdown) return;
    timeframeDropdown.innerHTML = "";
    const timeframeOptions = [];
    const timeframes =
        state.tradingType === "otc"
            ? translations.otcTimeframes
            : translations.regularTimeframes;
    timeframes.forEach((tf) => {
        const option = document.createElement("div");
        option.className = "timeframe-option";
        option.dataset.value = tf.code;
        option.textContent = tf.name;
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            selectTimeframe(tf.code);
            timeframeDropdown.classList.remove("active");
        });
        timeframeDropdown.appendChild(option);
        timeframeOptions.push(option);
    });
    highlightSelectedTimeframe(timeframeOptions);
}

function highlightSelectedTimeframe(timeframeOptionsArray) {
    const options =
        timeframeOptionsArray || getElements(SELECTORS.TIMEFRAME_OPTION_CLASS);
    options.forEach((option) => {
        if (option.dataset.value === state.selectedTimeframe) {
            option.classList.add("active");
        } else {
            option.classList.remove("active");
        }
    });
}

function selectPair(pairCode) {
    state.selectedPair = pairCode;
    updateDisplay();
}

function selectTimeframe(timeframeCode) {
    state.selectedTimeframe = timeframeCode;
    updateDisplay();
    const timeframeOptions = getElements(SELECTORS.TIMEFRAME_OPTION_CLASS);
    highlightSelectedTimeframe(timeframeOptions);
}

function closeOtherDropdowns(current) {
    const pairDropdown = getElement(SELECTORS.PAIR_DROPDOWN);
    const timeframeDropdown = getElement(SELECTORS.TIMEFRAME_DROPDOWN);
    const dropdownOverlay = document.querySelector("#dropdownOverlay");
    if (current !== "pair" && pairDropdown) {
        pairDropdown.classList.remove("active");
    }
    if (current !== "timeframe" && timeframeDropdown) {
        timeframeDropdown.classList.remove("active");
    }
    if (dropdownOverlay) {
        dropdownOverlay.classList.remove("active");
    }
}

function closeAllDropdowns() {
    const languageDropdown = document.querySelector("#languageDropdown");
    const pairDropdown = getElement(SELECTORS.PAIR_DROPDOWN);
    const timeframeDropdown = getElement(SELECTORS.TIMEFRAME_DROPDOWN);
    const dropdownOverlay = document.querySelector("#dropdownOverlay");
    languageDropdown?.classList.remove("active");
    pairDropdown?.classList.remove("active");
    timeframeDropdown?.classList.remove("active");
    dropdownOverlay?.classList.remove("active");
}

function formatTime(seconds) {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    } else {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
}

function showLoading() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    state.isSignalActive = false;
    state.currentPercent = 0;
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    const loadingOverlay = getElement(SELECTORS.LOADING_OVERLAY);
    const loadingProgress = getElement(SELECTORS.LOADING_PROGRESS);
    const loadingTextEl = getElement(SELECTORS.LOADING_TEXT_CLASS);
    const loadingSubtextEl = getElement(SELECTORS.LOADING_SUBTEXT_CLASS);
    if (getSignalBtn) getSignalBtn.classList.add("btn-disabled");
    if (loadingOverlay) loadingOverlay.classList.add("active");
    if (loadingProgress) loadingProgress.style.width = "0%";
    const texts =
        translations.texts[state.currentLang] || translations.texts.en;
    if (loadingTextEl) loadingTextEl.textContent = texts.loadingTitle;
    if (loadingSubtextEl) loadingSubtextEl.textContent = texts.loadingSubtitle;
    let progress = 0;
    const interval = setInterval(() => {
        const increment =
            Math.random() *
                (CONFIG.LOADING_INCREMENT_MAX - CONFIG.LOADING_INCREMENT_MIN) +
            CONFIG.LOADING_INCREMENT_MIN;
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                if (loadingOverlay) loadingOverlay.classList.remove("active");
                generateSignalAfterLoading();
            }, 500);
        }
        if (loadingProgress) loadingProgress.style.width = `${progress}%`;
    }, CONFIG.LOADING_INTERVAL_MS);
}

function generateSignalAfterLoading() {
    if (state.isSignalActive) {
        clearInterval(state.timer);
        state.timer = null;
        state.isSignalActive = false;
    }
    const signalResult = getElement(SELECTORS.SIGNAL_RESULT);
    if (signalResult) {
        signalResult.className = "signal-result";
        signalResult.style.display = "none";
    }
    const pair = getCurrentPairObject();
    const timeframes =
        state.tradingType === "otc"
            ? translations.otcTimeframes
            : translations.regularTimeframes;
    const timeframe =
        timeframes.find((t) => t.code === state.selectedTimeframe) ||
        timeframes[0];
    const accuracy =
        CONFIG.MIN_ACCURACY +
        Math.floor(Math.random() * (CONFIG.MAX_ACCURACY_VARIATION + 1));
    const accuracyValue = getElement(SELECTORS.ACCURACY_VALUE);
    if (accuracyValue) accuracyValue.textContent = `${accuracy}%`;
    const isBuy = Math.random() > 0.5;
    const btnTexts =
        translations.btnTexts[state.currentLang] || translations.btnTexts.en;
    const directionArrow = getElement(SELECTORS.DIRECTION_ARROW);
    const directionText = getElement(SELECTORS.DIRECTION_TEXT);
    if (directionArrow) {
        directionArrow.textContent = isBuy ? "↗" : "↘";
        directionArrow.className =
            "direction-arrow-large " + (isBuy ? "arrow-buy" : "arrow-sell");
    }
    if (directionText) {
        directionText.textContent = isBuy ? btnTexts.buy : btnTexts.sell;
        directionText.className =
            "direction-text " + (isBuy ? "direction-buy" : "direction-sell");
    }
    const duration = CONFIG.TIMEFRAME_SECONDS[state.selectedTimeframe] || 5;
    state.currentSignal = {
        pair: state.selectedPair,
        pairName: pair.name,
        timeframe: state.selectedTimeframe,
        direction: isBuy ? "buy" : "sell",
        accuracy: accuracy,
        startTime: new Date(),
        duration: duration,
    };
    startTimer(state.currentSignal.duration);
    const newSignalBtnTexts =
        translations.newSignalBtnTexts[state.currentLang] ||
        translations.newSignalBtnTexts.en;
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    if (getSignalBtn) {
        getSignalBtn.innerHTML = `${SELECTORS.FA_SYNC_ALT_ICON} ${newSignalBtnTexts}`;
    }
}

function startTimer(duration) {
    if (state.timer) clearInterval(state.timer);
    state.timerDuration = duration;
    state.timerRemaining = duration;
    state.isSignalActive = true;
    state.startTime = Date.now();
    state.timer = setInterval(() => {
        const elapsed = (Date.now() - state.startTime) / 1000;
        const percent = Math.min(100, (elapsed / duration) * 100);
        state.currentPercent = percent;
        if (percent >= 100) {
            clearInterval(state.timer);
            state.timer = null;
            state.isSignalActive = false;
            completeSignal();
        }
        updateProgress();
    }, CONFIG.TIMER_UPDATE_INTERVAL_MS);
}

function completeSignal() {
    if (!state.currentSignal) return;
    const isWin = Math.random() > 0.5;
    const result = isWin ? "win" : "loss";
    const resultSimple = isWin
        ? translations.btnTexts[state.currentLang]?.win || "Win"
        : translations.btnTexts[state.currentLang]?.loss || "Loss";
    state.stats.totalSignals += 1;
    if (isWin) {
        state.stats.successfulSignals += 1;
    } else {
        state.stats.failedSignals += 1;
    }
    if (!state.stats.pairPerformance[state.selectedPair]) {
        state.stats.pairPerformance[state.selectedPair] = {
            total: 0,
            successful: 0,
        };
    }
    state.stats.pairPerformance[state.selectedPair].total += 1;
    if (isWin) {
        state.stats.pairPerformance[state.selectedPair].successful += 1;
    }
    if (!state.stats.timeframePerformance[state.selectedTimeframe]) {
        state.stats.timeframePerformance[state.selectedTimeframe] = {
            total: 0,
            successful: 0,
        };
    }
    state.stats.timeframePerformance[state.selectedTimeframe].total += 1;
    if (isWin) {
        state.stats.timeframePerformance[
            state.selectedTimeframe
        ].successful += 1;
    }
    state.signalHistory.unshift({
        pair: state.selectedPair,
        pairName: state.currentSignal.pairName,
        timeframe: state.selectedTimeframe,
        direction: state.currentSignal.direction,
        accuracy: state.currentSignal.accuracy,
        startTime: state.currentSignal.startTime,
        duration: state.currentSignal.duration,
        result: result,
        resultSimple: resultSimple,
    });
    if (state.signalHistory.length > CONFIG.MAX_HISTORY_STORAGE_ITEMS) {
        state.signalHistory.pop();
    }
    const signalResult = getElement(SELECTORS.SIGNAL_RESULT);
    if (signalResult) {
        signalResult.textContent = resultSimple;
        signalResult.className = "signal-result " + (isWin ? "win" : "loss");
        signalResult.style.display = "block";
    }
    state.currentSignal = null;
    updateProfileStats();
    updateHistoryDisplay();
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    if (getSignalBtn) {
        getSignalBtn.classList.remove("btn-disabled");
        const getSignalBtnTexts =
            translations.getSignalBtnTexts[state.currentLang] ||
            translations.getSignalBtnTexts.en;
        getSignalBtn.innerHTML = `${SELECTORS.FA_BOLT_ICON} ${getSignalBtnTexts}`;
    }
}

function generateSignal() {
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    if (!getSignalBtn) return;
    if (state.isSignalActive) {
        if (!confirm("A signal is already active. Generate a new one?")) {
            return;
        }
        resetSignal();
    }
    const progressFill = getElement(SELECTORS.PROGRESS_FILL);
    const progressPercent = getElement(SELECTORS.PROGRESS_PERCENT);
    const timerDisplay = getElement(SELECTORS.TIMER_DISPLAY);
    if (progressFill) progressFill.style.width = "0%";
    if (progressPercent) progressPercent.textContent = "0.00%";
    if (timerDisplay) timerDisplay.textContent = "00:00 / 00:00";
    showLoading();
}

function resetSignal() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    state.isSignalActive = false;
    state.currentSignal = null;
    state.currentPercent = 0;
    const progressFill = getElement(SELECTORS.PROGRESS_FILL);
    const progressPercent = getElement(SELECTORS.PROGRESS_PERCENT);
    const timerDisplay = getElement(SELECTORS.TIMER_DISPLAY);
    const directionText = getElement(SELECTORS.DIRECTION_TEXT);
    const directionArrow = getElement(SELECTORS.DIRECTION_ARROW);
    const accuracyValue = getElement(SELECTORS.ACCURACY_VALUE);
    const signalResult = getElement(SELECTORS.SIGNAL_RESULT);
    const getSignalBtn = getElement(SELECTORS.GET_SIGNAL_BTN);
    if (progressFill) progressFill.style.width = "0%";
    if (progressPercent) progressPercent.textContent = "0.00%";
    if (timerDisplay) timerDisplay.textContent = "00:00 / 00:00";
    const langTexts =
        translations.texts[state.currentLang] || translations.texts.en;
    if (directionText) {
        directionText.textContent = langTexts.waiting || "Waiting...";
        directionText.className = "direction-text";
    }
    if (directionArrow) {
        directionArrow.textContent = "?";
        directionArrow.className = "direction-arrow-large";
    }
    if (accuracyValue) accuracyValue.textContent = "--%";
    if (signalResult) {
        signalResult.style.display = "none";
        signalResult.className = "signal-result";
    }
    const pair = getCurrentPairObject();
    updateSignalFlags(pair);
    const getSignalBtnTexts =
        translations.getSignalBtnTexts[state.currentLang] ||
        translations.getSignalBtnTexts.en;
    if (getSignalBtn) {
        getSignalBtn.innerHTML = `${SELECTORS.FA_BOLT_ICON} ${getSignalBtnTexts}`;
        getSignalBtn.classList.remove("btn-disabled");
    }
}

function updateProfileStats() {
    const totalSignalsEl = getElement(SELECTORS.TOTAL_SIGNALS);
    const successfulSignalsEl = getElement(SELECTORS.SUCCESSFUL_SIGNALS);
    const failedSignalsEl = getElement(SELECTORS.FAILED_SIGNALS);
    const successRateEl = getElement(SELECTORS.SUCCESS_RATE);
    const bestPairEl = getElement(SELECTORS.BEST_PAIR);
    const bestPairBar = getElement(SELECTORS.BEST_PAIR_BAR);
    const bestTimeframeEl = getElement(SELECTORS.BEST_TIMEFRAME);
    const bestTimeframeBar = getElement(SELECTORS.BEST_TIMEFRAME_BAR);
    if (totalSignalsEl) totalSignalsEl.textContent = state.stats.totalSignals;
    if (successfulSignalsEl)
        successfulSignalsEl.textContent = state.stats.successfulSignals;
    if (failedSignalsEl)
        failedSignalsEl.textContent = state.stats.failedSignals;
    const successRate =
        state.stats.totalSignals > 0
            ? Math.round(
                  (state.stats.successfulSignals / state.stats.totalSignals) *
                      100,
              )
            : 0;
    if (successRateEl) successRateEl.textContent = `${successRate}%`;
    let bestPair = "--";
    let bestPairRate = 0;
    for (const [pairCode, data] of Object.entries(
        state.stats.pairPerformance,
    )) {
        if (data.total > 0) {
            const rate = data.successful / data.total;
            if (rate > bestPairRate) {
                bestPairRate = rate;
                const pairs =
                    state.tradingType === "otc"
                        ? translations.otcPairs
                        : translations.regularPairs;
                bestPair =
                    pairs.find((p) => p.code === pairCode)?.name || pairCode;
            }
        }
    }
    if (bestPairEl) bestPairEl.textContent = bestPair;
    if (bestPairBar) bestPairBar.style.width = `${bestPairRate * 100}%`;
    let bestTimeframe = "--";
    let bestTimeframeRate = 0;
    const allTimeframes =
        state.tradingType === "otc"
            ? translations.otcTimeframes
            : translations.regularTimeframes;
    for (const [tfCode, data] of Object.entries(
        state.stats.timeframePerformance,
    )) {
        if (data.total > 0) {
            const rate = data.successful / data.total;
            if (rate > bestTimeframeRate) {
                bestTimeframeRate = rate;
                bestTimeframe =
                    allTimeframes.find((t) => t.code === tfCode)?.name ||
                    tfCode;
            }
        }
    }
    if (bestTimeframeEl) bestTimeframeEl.textContent = bestTimeframe;
    if (bestTimeframeBar)
        bestTimeframeBar.style.width = `${bestTimeframeRate * 100}%`;
}

// Initialize the app
function init() {
    setupThemeToggle();
    updateTime();
    setInterval(updateTime, 60000);
    setupTradingTypeSelector();
    setupPairSelector();
    setupTimeframeSelector();
    setupTabs();
    setupButtons();
    setupMenu();
    setupLanguageModal();
    setupThemeToggleInMenu();
    updateDisplay();
    updateProfileStats();
}

document.addEventListener("DOMContentLoaded", init);
