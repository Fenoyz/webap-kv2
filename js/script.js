// App State (в начале скрипта)
const state = {
    currentLang: "en",
    currentTheme: "dark", // <-- Добавляем состояние темы
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
    currentSignal: null, // <-- Добавлено для хранения текущего сигнала
    startTime: null, // <-- Добавлено для хранения времени начала таймера
    currentPercent: 0, // <-- Добавлено для хранения текущего процента
};

// --- DOM ELEMENTS ---
// Основные элементы
const currentTimeEl = document.getElementById("currentTime");
const languageOptions = document.querySelectorAll(".language-option");
const typeButtons = document.querySelectorAll(".type-btn");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingProgress = document.getElementById("loadingProgress");

// Элементы отображения сигнала
const selectedPairFlag = document.getElementById("selectedPairFlag");
const selectedPairName = document.getElementById("selectedPairName");
const selectedTimeframe = document.getElementById("selectedTimeframe");
const signalFlags = document.getElementById("signalFlags");
const signalPairName = document.getElementById("signalPairName");
const signalPairType = document.getElementById("signalPairType");
const accuracyValue = document.getElementById("accuracyValue");
const directionArrow = document.getElementById("directionArrow");
const directionText = document.getElementById("directionText");
const metaTimeframe = document.getElementById("metaTimeframe");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const timerDisplay = document.getElementById("timerDisplay");
const getSignalBtn = document.getElementById("getSignalBtn");
const resetSignalBtn = document.getElementById("resetSignalBtn");
const signalResult = document.getElementById("signalResult");

// Элементы профиля
const totalSignalsEl = document.getElementById("totalSignals");
const successfulSignalsEl = document.getElementById("successfulSignals");
const failedSignalsEl = document.getElementById("failedSignals");
const successRateEl = document.getElementById("successRate");
const bestPairEl = document.getElementById("bestPair");
const bestPairBar = document.getElementById("bestPairBar");
const bestTimeframeEl = document.getElementById("bestTimeframe");
const bestTimeframeBar = document.getElementById("bestTimeframeBar");

// Элементы истории
const historyList = document.getElementById("historyList");

// Элементы вкладок
const tabs = document.querySelectorAll(".tab");
const contentSections = document.querySelectorAll(".content-section");

// Элементы селекторов
const pairTrigger = document.getElementById("pairTrigger");
const pairDropdown = document.getElementById("pairDropdown");
const timeframeTrigger = document.getElementById("timeframeTrigger");
const timeframeDropdown = document.getElementById("timeframeDropdown");
const timeframeOptions = []; // будет заполнен

// --- HELPER FUNCTIONS ---

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
    // Update pair display
    const pairs =
        state.tradingType === "otc"
            ? translations.otcPairs
            : translations.regularPairs;
    const pair = pairs.find((p) => p.code === state.selectedPair) || pairs[0];
    selectedPairName.textContent = pair.name;
    signalPairName.textContent = pair.name;
    signalPairType.textContent =
        state.tradingType === "otc" ? "OTC" : "Regular";
    // Update flags
    updateSignalFlags(pair);
    // Update timeframe display
    const timeframes =
        state.tradingType === "otc"
            ? translations.otcTimeframes
            : translations.regularTimeframes;
    const timeframe =
        timeframes.find((t) => t.code === state.selectedTimeframe) ||
        timeframes[0]; // fallback to first
    selectedTimeframe.textContent = timeframe.name;
    metaTimeframe.textContent = timeframe.name;
    // Highlight selections
    highlightSelectedPair();
    highlightSelectedTimeframe();
}

function updateProgress() {
    const percent = state.currentPercent || 0;
    const elapsed = Math.round((percent / 100) * state.timerDuration);
    const remaining = state.timerDuration - elapsed;
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${(state.currentPercent || 0).toFixed(2)}%`;
    timerDisplay.textContent = `${formatTime(elapsed)} / ${formatTime(
        state.timerDuration,
    )}`;
}

function updateHistoryDisplay() {
    historyList.innerHTML = "";
    if (state.signalHistory.length === 0) {
        const emptyItem = document.createElement("div");
        emptyItem.className = "history-item";
        emptyItem.style.opacity = "0.7";
        emptyItem.style.fontStyle = "italic";
        emptyItem.style.justifyContent = "center";
        emptyItem.textContent = "No signals yet";
        historyList.appendChild(emptyItem);
        return;
    }

    state.signalHistory.slice(0, 20).forEach((signal) => {
        const item = document.createElement("div");
        item.className = "history-item";
        const timeStr = signal.startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const dateStr = signal.startTime.toLocaleDateString([], {
            month: "short",
            day: "numeric",
        });

        const pairName = signal.pairName.replace(" OTC", "");
        const currencies = pairName.split("/");
        const baseCurrency = currencies[0]?.trim();
        const quoteCurrency = currencies[1]?.trim();
        const baseFlagCode = currencyToFlagMap[baseCurrency] || "xx";
        const quoteFlagCode = currencyToFlagMap[quoteCurrency] || "xx";

        const pairContainer = document.createElement("div");
        pairContainer.className = "history-pair";

        const flagsContainer = document.createElement("div");
        flagsContainer.style.display = "flex";
        flagsContainer.style.marginRight = "8px"; // Отступ между флагами и деталями

        const baseFlag = createFlagElement(
            baseFlagCode,
            "var(--accent), var(--accent2)",
        );
        baseFlag.className = "pair-flag-history"; // Установка класса для истории
        baseFlag.style.marginRight = "4px"; // Отступ между флагами

        const quoteFlag = createFlagElement(
            quoteFlagCode,
            "var(--danger), #ff9900",
        );
        quoteFlag.className = "pair-flag-history"; // Установка класса для истории

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

        historyList.appendChild(item);
    });
}

// --- SETUP FUNCTIONS ---

function setupTradingTypeSelector() {
    typeButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            typeButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.tradingType = btn.dataset.type;
            // Сброс таймфрейма на первый в новом списке, если текущий недоступен
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
            populateTimeframeDropdown(); // обновить список в выпадающем
        });
    });
}

function setupPairSelector() {
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
    // Элементы, которые нужно скрывать вне Signals
    const tradingTypeSelector = document.querySelector(
        ".trading-type-selector",
    );
    const selectorsWrapper = document.querySelector(".selectors-wrapper");
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.stopPropagation();
            const tabName = tab.dataset.tab;
            // Обновляем активную вкладку
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            // Показываем нужную секцию
            contentSections.forEach((section) => {
                section.classList.remove("active");
                if (section.id === `${tabName}Section`) {
                    section.classList.add("active");
                }
            });
            // Скрываем/показываем верхние селекторы
            if (tabName === "signals") {
                tradingTypeSelector.style.display = "";
                selectorsWrapper.style.display = "";
            } else {
                tradingTypeSelector.style.display = "none";
                selectorsWrapper.style.display = "none";
            }
        });
    });
}

function setupButtons() {
    // Get Signal button
    getSignalBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        generateSignal();
    });
    // Reset button
    resetSignalBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        resetSignal();
    });
}

// --- MENU & MODAL SETUP FUNCTIONS ---

function setupMenu() {
    const menuTrigger = document.getElementById("menuTrigger");
    const menuClose = document.getElementById("menuClose");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuChooseLanguage = document.getElementById("menuChooseLanguage");
    const menuChooseTheme = document.getElementById("menuChooseTheme");

    function toggleMenu() {
        sideMenu.classList.toggle("active");
        menuOverlay.classList.toggle("active");
    }

    menuTrigger.addEventListener("click", toggleMenu);
    menuClose.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", toggleMenu);

    // Настройка переключения языка через меню
    menuChooseLanguage.addEventListener("click", (e) => {
        toggleMenu(); // закрываем боковое меню
        setupLanguageModal.show(); // Показываем модальное окно языка
    });

    // Настройка переключения темы через меню
    menuChooseTheme.addEventListener("click", (e) => {
        toggleMenu(); // закрываем боковое меню после выбора
        toggleTheme(); // переключаем тему
    });
}

function setupLanguageModal() {
    const languageModalOverlay = document.getElementById(
        "languageModalOverlay",
    );
    const modalClose = document.getElementById("modalClose");
    const modalLangButtons = document.querySelectorAll(".modal-lang-btn");
    const modalTitle = document.getElementById("modalTitle");

    // Прячем модальное окно по умолчанию (если это не сделано в CSS)
    // languageModalOverlay.classList.remove("active");

    // Функция показа модального окна
    setupLanguageModal.show = function () {
        languageModalOverlay.classList.add("active");
        updateModalText();
    };

    // Функция скрытия модального окна
    setupLanguageModal.hide = function () {
        languageModalOverlay.classList.remove("active");
    };

    // Закрытие по крестику
    modalClose.addEventListener("click", setupLanguageModal.hide);

    // Закрытие по клику вне окна
    languageModalOverlay.addEventListener("click", (e) => {
        if (e.target === languageModalOverlay) {
            setupLanguageModal.hide();
        }
    });

    // Обработка выбора языка
    modalLangButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
            setupLanguageModal.hide(); // Скрыть модальное окно после выбора
        });
    });

    // Функция обновления текста в модалке
    function updateModalText() {
        const texts =
            translations.texts[state.currentLang] || translations.texts.en;
        modalTitle.textContent = texts.chooseLanguage || "Choose Language";
    }
}

function setupThemeToggle() {
    // Загружаем сохранённую тему из localStorage или используем 'dark' по умолчанию
    const savedTheme = localStorage.getItem("selectedTheme") || "dark";
    state.currentTheme = savedTheme;
    applyTheme(state.currentTheme);
    console.log("Theme toggle initialized.");
}

function setupThemeToggleInMenu() {
    // Эта функция теперь просто обновляет текст кнопки темы в меню
    // Переключение происходит в обработчике события кнопки темы в setupMenu
    updateMenuTexts();
}

// --- CORE LOGIC FUNCTIONS ---

// Update current time
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currentTimeEl.textContent = `${hours}:${minutes}`;
}

// Update UI text based on language
function updateUIText() {
    const langTexts =
        translations.texts[state.currentLang] || translations.texts.en;
    document.getElementById("signalTypeLabel").textContent =
        langTexts.signalType || "Signal Type";
    // Update trading type buttons
    document.querySelector('[data-type="regular"]').textContent =
        langTexts.regular;
    document.querySelector('[data-type="otc"]').textContent = langTexts.otc;
    // Update selector labels
    document.querySelectorAll(".selector-label")[0].textContent =
        langTexts.currencyPair;
    document.querySelectorAll(".selector-label")[1].textContent =
        langTexts.timeframe;
    // Update accuracy label
    document.querySelector(".accuracy-label").textContent = langTexts.accuracy;
    // Update current signal title
    document.querySelector(".signal-title").textContent =
        langTexts.currentSignal;
    // Update progress label
    const progressLabels = document.querySelectorAll(".progress-label");
    if (progressLabels[0]) {
        progressLabels[0].textContent =
            langTexts.signalProgress || "Signal Progress";
    }
    // Update buttons
    getSignalBtn.innerHTML = `<i class="fas fa-bolt"></i> ${langTexts.getSignal}`;
    resetSignalBtn.innerHTML = `<i class="fas fa-redo"></i> ${langTexts.resetSignal}`;
    // Update tabs
    document.querySelector(
        '[data-tab="signals"]',
    ).innerHTML = `<i class="fas fa-chart-line"></i> ${langTexts.signals}`;
    document.querySelector(
        '[data-tab="profile"]',
    ).innerHTML = `<i class="fas fa-user"></i> ${langTexts.profile}`;
    document.querySelector(
        '[data-tab="history"]',
    ).innerHTML = `<i class="fas fa-history"></i> ${langTexts.history}`;
    // Update profile section
    const profileTitle = document.querySelector("#profileSection h3");
    if (profileTitle) profileTitle.textContent = langTexts.profileStats;
    const statLabels = document.querySelectorAll(".stat-label");
    if (statLabels[0]) statLabels[0].textContent = langTexts.totalSignals;
    if (statLabels[1]) statLabels[1].textContent = langTexts.successful;
    if (statLabels[2]) statLabels[2].textContent = langTexts.failed;
    if (statLabels[3]) statLabels[3].textContent = langTexts.successRate;
    const performanceLabel = document.querySelector(".meta-label");
    if (performanceLabel)
        performanceLabel.textContent = langTexts.performanceMetrics;
    // Update direction text if waiting
    if (
        ["waiting", "ожидание", "esperando", "प्रतीक्षा"].some((phrase) =>
            directionText.textContent.toLowerCase().includes(phrase),
        )
    ) {
        directionText.textContent = langTexts.waiting;
    } else if (
        directionText.textContent === "BUY" ||
        directionText.textContent === "SELL" ||
        directionText.textContent === "ПОКУПКА" ||
        directionText.textContent === "ПРОДАЖА" ||
        directionText.textContent === "COMPRAR" ||
        directionText.textContent === "VENDER" ||
        directionText.textContent === "खरीदें" ||
        directionText.textContent === "बेचें"
    ) {
        // Update existing signal text if needed
        const isBuy = directionText.classList.contains("direction-buy");
        const btnTexts =
            translations.btnTexts[state.currentLang] ||
            translations.btnTexts.en;
        directionText.textContent = isBuy ? btnTexts.buy : btnTexts.sell;
    }
    // Update history if needed
    updateHistoryDisplay();
}

// Update menu item texts on language change
function updateMenuTexts() {
    const texts =
        translations.texts[state.currentLang] || translations.texts.en;
    const menuChooseLanguage = document.getElementById("menuChooseLanguage");
    const menuChooseTheme = document.getElementById("menuChooseTheme");

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

// Change language
function changeLanguage(lang) {
    // Сохраняем выбранный язык
    state.currentLang = lang;
    // Обновляем весь UI
    updateUIText();
    updateMenuTexts(); // Обновляем и текст в меню
    // Закрываем модалку (если нужно — делается в вызывающем коде)
}

// Toggle Theme Function
function toggleTheme() {
    // Переключаем тему в состоянии
    state.currentTheme = state.currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("selectedTheme", state.currentTheme); // Сохраняем выбор
    applyTheme(state.currentTheme); // Применяем тему
    updateUITheme(); // Обновляем элементы UI, связанные с темой
    updateMenuTexts(); // Обновляем текст кнопки выбора темы в меню
}

// Apply Theme to CSS variables
function applyTheme(themeName) {
    const root = document.documentElement;
    if (themeName === "light") {
        root.style.setProperty("--bg", "#f0f4ff");
        root.style.setProperty("--panel", "#ffffff");
        root.style.setProperty("--card", "#ffffff");
        root.style.setProperty("--muted", "#666666");
        root.style.setProperty("--accent", "#2d8cff");
        root.style.setProperty("--accent2", "#6a5bff");
        root.style.setProperty("--success", "#00aa55"); // Более тусклый зелёный для светлой темы
        root.style.setProperty("--danger", "#cc3333"); // Более тусклый красный для светлой темы
        root.style.setProperty("--warning", "#ff9900");
        root.style.setProperty("--glass", "rgba(255, 255, 255, 0.8)");
        root.style.setProperty("--text-primary", "#1a1a1a");
        root.style.setProperty("--text-secondary", "#4d4d4d");
        root.style.setProperty("--regular-bg", "rgba(0, 170, 85, 0.15)"); // Соответствует success
        root.style.setProperty("--regular-color", "#00aa55");
        root.style.setProperty("--otc-bg", "rgba(45, 140, 255, 0.15)");
        root.style.setProperty("--otc-color", "#2d8cff");
        root.style.setProperty(
            "--shadow-dark",
            "0 8px 30px rgba(0, 0, 0, 0.1)",
        ); // Светлая тень
        root.style.setProperty(
            "--shadow-inset-dark",
            "inset 0 1px 0 rgba(0, 0, 0, 0.02)",
        ); // Внутренняя тень для светлой темы
        // Для светлой тени в светлой теме можно оставить так же или сделать ещё светлее
        root.style.setProperty(
            "--shadow-light",
            "0 8px 30px rgba(0, 0, 0, 0.1)",
        );
    } else {
        // dark
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
        ); // Тёмная тень
        root.style.setProperty(
            "--shadow-inset-dark",
            "inset 0 1px 0 rgba(255, 255, 255, 0.02)",
        ); // Внутренняя тень для тёмной темы
        // Для светлой тени в тёмной теме
        root.style.setProperty(
            "--shadow-light",
            "0 8px 30px rgba(255, 255, 255, 0.05)",
        ); // Пример очень светлой тени
    }
    // Обновляем градиенты флагов на основе новой темы
    updateSignalFlags(getCurrentPairObject());
    // Если история сигнала отображается, обновим её тоже
    updateHistoryDisplay();
}

// Update UI elements related to theme (like buttons, backgrounds if needed dynamically)
function updateUITheme() {
    // Нет необходимости обновлять конкретные элементы, так как всё основано на CSS переменных
    // Но если потребуется, можно добавить сюда логику
    console.log(`Theme updated to: ${state.currentTheme}`);
}

// Update signal flags
function updateSignalFlags(pair) {
    signalFlags.innerHTML = "";
    // Извлекаем базовую и котируемую валюты из названия пары (например, "EUR/USD" -> ["EUR", "USD"])
    const pairName = pair.name.replace(" OTC", "");
    const currencies = pairName.split("/");
    const baseCurrency = currencies[0]?.trim();
    const quoteCurrency = currencies[1]?.trim();
    // Получаем соответствующие коды флагов
    const baseFlagCode = currencyToFlagMap[baseCurrency] || "xx";
    const quoteFlagCode = currencyToFlagMap[quoteCurrency] || "xx";

    // Используем вспомогательную функцию для создания флагов
    const baseFlagDiv = createFlagElement(
        baseFlagCode,
        "var(--accent), var(--accent2)",
    );
    const quoteFlagDiv = createFlagElement(
        quoteFlagCode,
        "var(--danger), #ff9900",
    );

    signalFlags.appendChild(baseFlagDiv);
    signalFlags.appendChild(quoteFlagDiv);
}

// Populate pair dropdown
// Map currency codes to flag codes used by flag-icons library
const currencyToFlagMap = {
    EUR: "eu", // Используем eu для Евросоюза
    USD: "us",
    GBP: "gb",
    JPY: "jp",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    NZD: "nz",
    // Добавь другие валюты по мере необходимости
};

function populatePairDropdown() {
    pairDropdown.innerHTML = "";
    const pairs =
        state.tradingType === "otc"
            ? translations.otcPairs
            : translations.regularPairs;
    pairs.forEach((pair) => {
        const option = document.createElement("div");
        option.className = "pair-option-dropdown";
        option.dataset.code = pair.code;
        // Извлекаем валюты
        const pairName = pair.name.replace(" OTC", "");
        const currencies = pairName.split("/");
        const baseCurrency = currencies[0]?.trim();
        const quoteCurrency = currencies[1]?.trim();
        const baseFlagCode = currencyToFlagMap[baseCurrency] || "xx";
        const quoteFlagCode = currencyToFlagMap[quoteCurrency] || "xx";
        // Контейнер флагов
        const flagsContainer = document.createElement("div");
        flagsContainer.className = "pair-flags-select";
        flagsContainer.style.position = "relative";
        flagsContainer.style.width = "40px";
        flagsContainer.style.height = "24px";
        // Левый флаг — поверх
        const baseFlag = document.createElement("div");
        baseFlag.className = "pair-flag-select";
        Object.assign(baseFlag.style, {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            position: "absolute",
            left: "0",
            zIndex: "2",
            background: "transparent", // ← УБРАН градиент
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
        // Правый флаг — под ним
        const quoteFlag = document.createElement("div");
        quoteFlag.className = "pair-flag-select";
        Object.assign(quoteFlag.style, {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            position: "absolute",
            left: "16px",
            zIndex: "1",
            background: "transparent", // ← УБРАН градиент
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
        // Текст пары
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
            pairDropdown.classList.remove("active");
            dropdownOverlay?.classList.remove("active");
        });
        pairDropdown.appendChild(option);
    });
}

// Highlight selected pair in dropdown
function highlightSelectedPair() {
    document
        .querySelectorAll("#pairDropdown .pair-option-dropdown")
        .forEach((option) => {
            if (option.dataset.code === state.selectedPair) {
                option.classList.add("active");
            } else {
                option.classList.remove("active");
            }
        });
}

// Populate Timeframe Dropdown
function populateTimeframeDropdown() {
    timeframeDropdown.innerHTML = "";
    timeframeOptions.length = 0;
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
    highlightSelectedTimeframe();
}

// Highlight selected timeframe in dropdown
function highlightSelectedTimeframe() {
    timeframeOptions.forEach((option) => {
        if (option.dataset.value === state.selectedTimeframe) {
            option.classList.add("active");
        } else {
            option.classList.remove("active");
        }
    });
}

// Select pair
function selectPair(pairCode) {
    state.selectedPair = pairCode;
    updateDisplay();
}

// Select timeframe
function selectTimeframe(timeframeCode) {
    state.selectedTimeframe = timeframeCode;
    updateDisplay();
    highlightSelectedTimeframe();
}

// Close other dropdowns
function closeOtherDropdowns(current) {
    if (current !== "pair") {
        pairDropdown.classList.remove("active");
    }
    if (current !== "timeframe") {
        timeframeDropdown.classList.remove("active");
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    languageDropdown?.classList.remove("active"); // Optional chaining на случай, если languageDropdown не определён
    pairDropdown.classList.remove("active");
    timeframeDropdown.classList.remove("active");
    dropdownOverlay?.classList.remove("active");
}

// Format time as MM:SS
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
    getSignalBtn.classList.add("btn-disabled");
    loadingOverlay.classList.add("active");
    loadingProgress.style.width = "0%";

    // Получаем тексты для текущего языка
    const texts = translations.texts[state.currentLang] || translations.texts.en;

    // Обновляем текст в интерфейсе
    document.querySelector(".loading-text").textContent = texts.loadingTitle;
    document.querySelector(".loading-subtext").textContent = texts.loadingSubtitle;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingOverlay.classList.remove("active");
                generateSignalAfterLoading();
            }, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 200);
}

// Generate signal after loading
function generateSignalAfterLoading() {
    if (state.isSignalActive) {
        clearInterval(state.timer);
        state.timer = null; // Убедимся, что таймер сброшен
        state.isSignalActive = false;
    }
    // Clear previous result
    signalResult.className = "signal-result";
    signalResult.style.display = "none";
    const pair = getCurrentPairObject();

    // Исправлено: используем правильный массив таймфреймов
    const timeframes =
        state.tradingType === "otc"
            ? translations.otcTimeframes
            : translations.regularTimeframes;
    const timeframe =
        timeframes.find((t) => t.code === state.selectedTimeframe) ||
        timeframes[0];

    // Generate random accuracy (65-95%)
    const accuracy = 65 + Math.floor(Math.random() * 31);
    accuracyValue.textContent = `${accuracy}%`;

    // Random direction
    const isBuy = Math.random() > 0.5;
    const btnTexts =
        translations.btnTexts[state.currentLang] || translations.btnTexts.en;

    // Update arrow and text
    directionArrow.textContent = isBuy ? "↗" : "↘";
    directionArrow.className =
        "direction-arrow-large " + (isBuy ? "arrow-buy" : "arrow-sell");
    directionText.textContent = isBuy ? btnTexts.buy : btnTexts.sell;
    directionText.className =
        "direction-text " + (isBuy ? "direction-buy" : "direction-sell");

    // Duration mapping
    const timeframeSeconds = {
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
    };
    const duration = timeframeSeconds[state.selectedTimeframe] || 5;

    // Store signal
    state.currentSignal = {
        pair: state.selectedPair,
        pairName: pair.name,
        timeframe: state.selectedTimeframe,
        direction: isBuy ? "buy" : "sell",
        accuracy: accuracy,
        startTime: new Date(),
        duration: duration,
    };

    // Start timer and update UI
    startTimer(state.currentSignal.duration);
    const newSignalBtnTexts =
        translations.newSignalBtnTexts[state.currentLang] ||
        translations.newSignalBtnTexts.en;
    getSignalBtn.innerHTML = `<i class="fas fa-sync-alt"></i> ${newSignalBtnTexts}`;
}

function startTimer(duration) {
    if (state.timer) clearInterval(state.timer);
    state.timerDuration = duration;
    state.timerRemaining = duration;
    state.isSignalActive = true;
    state.startTime = Date.now();

    // Обновляем каждые 100 мс для плавности
    state.timer = setInterval(() => {
        const elapsed = (Date.now() - state.startTime) / 1000; // секунды
        const percent = Math.min(100, (elapsed / duration) * 100);
        state.currentPercent = percent;
        if (percent >= 100) {
            clearInterval(state.timer);
            state.timer = null; // Сбросим ID таймера
            state.isSignalActive = false;
            completeSignal();
        }
        updateProgress();
    }, 100); // Обновление каждые 100 мс
}

// Complete signal and determine result
function completeSignal() {
    if (!state.currentSignal) return;

    // Определяем результат случайным образом (или по вашей логике)
    const isWin = Math.random() > 0.5; // ← Замените на реальную логику, если она есть
    const result = isWin ? "win" : "loss";
    const resultSimple = isWin
        ? translations.btnTexts[state.currentLang]?.win || "Win"
        : translations.btnTexts[state.currentLang]?.loss || "Loss";

    // Обновляем статистику
    state.stats.totalSignals += 1;
    if (isWin) {
        state.stats.successfulSignals += 1;
    } else {
        state.stats.failedSignals += 1;
    }

    // Обновляем статистику по паре
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

    // Обновляем статистику по таймфрейму
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

    // Добавляем сигнал в историю
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

    // Ограничиваем историю 100 записями (опционально)
    if (state.signalHistory.length > 100) {
        state.signalHistory.pop();
    }

    // Обновляем отображение результата
    signalResult.textContent = resultSimple;
    signalResult.className = "signal-result " + (isWin ? "win" : "loss");
    signalResult.style.display = "block";

    // Сбрасываем текущий сигнал
    state.currentSignal = null;

    // Обновляем интерфейс
    updateProfileStats();
    updateHistoryDisplay();

    // Разблокировать кнопку
    getSignalBtn.classList.remove("btn-disabled");
    const getSignalBtnTexts =
        translations.getSignalBtnTexts[state.currentLang] ||
        translations.getSignalBtnTexts.en;
    getSignalBtn.innerHTML = `<i class="fas fa-bolt"></i> ${getSignalBtnTexts}`;
}

// Generate a new signal with loading
function generateSignal() {
    if (state.isSignalActive) {
        if (!confirm("A signal is already active. Generate a new one?")) {
            return;
        }
    }
    showLoading();
}

function resetSignal() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null; // Сбросим ID таймера
    }
    state.isSignalActive = false;
    state.currentSignal = null;
    state.currentPercent = 0;

    // --- Сброс визуальных элементов сигнала ---
    // Сбрасываем прогресс
    progressFill.style.width = "0%";
    progressPercent.textContent = "0.00%";
    timerDisplay.textContent = "00:00 / 00:00";

    // Сбрасываем направление и стрелку
    const langTexts =
        translations.texts[state.currentLang] || translations.texts.en;
    directionText.textContent = langTexts.waiting || "Waiting...";
    directionText.className = "direction-text";
    directionArrow.textContent = "?";
    directionArrow.className = "direction-arrow-large";

    // Сбрасываем accuracy
    accuracyValue.textContent = "--%";

    // Скрываем результат
    signalResult.style.display = "none";
    signalResult.className = "signal-result";

    // Обновляем флаги пары (чтобы использовались актуальные градиенты темы)
    const pair = getCurrentPairObject();
    updateSignalFlags(pair);

    // Обновляем текст кнопки Get Signal
    const getSignalBtnTexts =
        translations.getSignalBtnTexts[state.currentLang] ||
        translations.getSignalBtnTexts.en;
    getSignalBtn.innerHTML = `<i class="fas fa-bolt"></i> ${getSignalBtnTexts}`;
    getSignalBtn.classList.remove("btn-disabled");
}

// Update profile statistics
function updateProfileStats() {
    totalSignalsEl.textContent = state.stats.totalSignals;
    successfulSignalsEl.textContent = state.stats.successfulSignals;
    failedSignalsEl.textContent = state.stats.failedSignals;
    const successRate =
        state.stats.totalSignals > 0
            ? Math.round(
                  (state.stats.successfulSignals / state.stats.totalSignals) *
                      100,
              )
            : 0;
    successRateEl.textContent = `${successRate}%`;

    // Find best pair
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
    bestPairEl.textContent = bestPair;
    bestPairBar.style.width = `${bestPairRate * 100}%`;

    // Find best timeframe
    let bestTimeframe = "--";
    let bestTimeframeRate = 0;
    // Выбираем правильный список таймфреймов в зависимости от типа рынка
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
    bestTimeframeEl.textContent = bestTimeframe;
    bestTimeframeBar.style.width = `${bestTimeframeRate * 100}%`;
}

// Initialize the app
function init() {
    setupThemeToggle(); // <-- Загрузка и применение темы до остальной инициализации
    updateTime();
    setInterval(updateTime, 60000);
    setupTradingTypeSelector();
    setupPairSelector();
    setupTimeframeSelector();
    setupTabs();
    setupButtons();
    setupMenu(); // <-- Инициализация бокового меню
    setupLanguageModal(); // <-- Инициализация модального окна языка
    setupThemeToggleInMenu(); // <-- Инициализация обновления текста темы в меню
    updateDisplay();
    updateProfileStats();

    // Fix времени
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currentTimeEl.textContent = `${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", init);
