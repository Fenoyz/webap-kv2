// App State
const state = {
    currentLang: "en",
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
};

// DOM Elements
const currentTimeEl = document.getElementById("currentTime");
const languageTrigger = document.getElementById("languageTrigger");
const languageDropdown = document.getElementById("languageDropdown");
const languageOptions = document.querySelectorAll(".language-option");
const typeButtons = document.querySelectorAll(".type-btn");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingProgress = document.getElementById("loadingProgress");

// Signal Display Elements
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
const metaUntil = document.getElementById("metaUntil");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const timerDisplay = document.getElementById("timerDisplay");
const getSignalBtn = document.getElementById("getSignalBtn");
const resetSignalBtn = document.getElementById("resetSignalBtn");
const signalResult = document.getElementById("signalResult");

// Profile Elements
const totalSignalsEl = document.getElementById("totalSignals");
const successfulSignalsEl = document.getElementById("successfulSignals");
const failedSignalsEl = document.getElementById("failedSignals");
const successRateEl = document.getElementById("successRate");
const bestPairEl = document.getElementById("bestPair");
const bestPairBar = document.getElementById("bestPairBar");
const bestTimeframeEl = document.getElementById("bestTimeframe");
const bestTimeframeBar = document.getElementById("bestTimeframeBar");

// History Elements
const historyList = document.getElementById("historyList");

// Tab Elements
const tabs = document.querySelectorAll(".tab");
const contentSections = document.querySelectorAll(".content-section");

// New selector elements
const pairTrigger = document.getElementById("pairTrigger");
const pairDropdown = document.getElementById("pairDropdown");
const timeframeTrigger = document.getElementById("timeframeTrigger");
const timeframeDropdown = document.getElementById("timeframeDropdown");
const timeframeOptions = []; // will be populated
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
// Initialize App
function init() {
    updateTime();
    setInterval(updateTime, 60000);
    setupLanguageSelector();
    setupTradingTypeSelector();
    setupPairSelector(); // ← add this
    setupTimeframeSelector(); // ← add this
    setupTabs();
    setupButtons();
    updateDisplay();
    updateProfileStats();
    // Fix времени
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currentTimeEl.textContent = `${hours}:${minutes}`;
}

// Update current time
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currentTimeEl.textContent = `${hours}:${minutes}`;
}

// Setup language selector
function setupLanguageSelector() {
    languageTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        languageDropdown.classList.toggle("active");
        closeOtherDropdowns("language");
    });

    languageOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = option.dataset.lang;
            changeLanguage(lang);
            languageDropdown.classList.remove("active");
        });
    });

    // Close language dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (
            !languageTrigger.contains(e.target) &&
            !languageDropdown.contains(e.target)
        ) {
            languageDropdown.classList.remove("active");
        }
    });
}

// Change language
function changeLanguage(lang) {
    state.currentLang = lang;
    const langData = translations.languages[lang];

    // Update trigger
    const flagSpan = document.createElement("span");
    flagSpan.className = `fi fi-${langData.flag}`;

    languageTrigger.innerHTML = "";
    languageTrigger.appendChild(document.createElement("div")).className =
        "language-flag";
    languageTrigger.querySelector(".language-flag").appendChild(flagSpan);

    const textSpan = document.createElement("span");
    textSpan.textContent = langData.triggerText;
    languageTrigger.appendChild(textSpan);

    const icon = document.createElement("i");
    icon.className = "fas fa-chevron-down";
    icon.style.fontSize = "12px";
    languageTrigger.appendChild(icon);

    // Update active option
    languageOptions.forEach((option) => {
        option.classList.remove("active");
        if (option.dataset.lang === lang) {
            option.classList.add("active");
        }
    });

    // Update UI text based on language
    updateUIText();
}

// Update UI text based on language
function updateUIText() {
    const langTexts =
        translations.texts[state.currentLang] || translations.texts.en;

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

    // Update meta labels
    const metaLabels = document.querySelectorAll(".meta-label");
    if (metaLabels[0]) metaLabels[0].textContent = langTexts.timeframe;
    if (metaLabels[1]) metaLabels[1].textContent = langTexts.until;

    // Update progress label
    const progressLabels = document.querySelectorAll(".progress-label");
    if (progressLabels[0]) progressLabels[0].textContent = "Signal Progress";

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
        directionText.textContent === "Waiting for signal..." ||
        directionText.textContent === "Ожидание сигнала..." ||
        directionText.textContent === "Esperando señal..."
    ) {
        directionText.textContent = langTexts.waiting;
    } else if (
        directionText.textContent === "BUY" ||
        directionText.textContent === "SELL" ||
        directionText.textContent === "ПОКУПКА" ||
        directionText.textContent === "ПРОДАЖА" ||
        directionText.textContent === "COMPRAR" ||
        directionText.textContent === "VENDER"
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

// Setup trading type selector
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

// Setup Pair Selector
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

// Setup Timeframe Selector
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

// Close other dropdowns
function closeOtherDropdowns(current) {
    if (current !== "language") {
        languageDropdown.classList.remove("active");
    }
    if (current !== "pair") {
        pairDropdown.classList.remove("active");
    }
    if (current !== "timeframe") {
        timeframeDropdown.classList.remove("active");
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    languageDropdown.classList.remove("active");
    pairDropdown.classList.remove("active");
    timeframeDropdown.classList.remove("active");
    dropdownOverlay.classList.remove("active");
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

// Populate pair dropdown
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

        // Extract base currency from pair name (e.g., "EUR/USD" -> "EUR")
        const pairName = pair.name.replace(" OTC", ""); // Remove OTC suffix if present
        const baseCurrency = pairName.split("/")[0]?.trim(); // Get the first part before '/'

        // Get the corresponding flag code
        const flagCode = currencyToFlagMap[baseCurrency] || "xx"; // Use 'xx' as fallback for unknown currencies

        // Create HTML with the flag icon using flag-icons classes
        // The container now uses flexbox to center the flag properly
        option.innerHTML = `
      <div class="pair-flag-select" style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
          <span class="fi fi-${flagCode}" style="font-size: 24px;"></span>
      </div>
      <div style="font-weight: 700; font-size: 14px;">${pair.name}</div>
    `;

        option.addEventListener("click", (e) => {
            console.log("Clicked on pair option:", pair.code);
            e.stopPropagation();
            selectPair(pair.code);
            pairDropdown.classList.remove("active");
            dropdownOverlay.classList.remove("active");
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

// Update signal flags
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

    // --- Создаём флаг для базовой валюты ---
    const baseFlagDiv = document.createElement("div");
    baseFlagDiv.className = "pair-flag";
    // Применяем градиентный фон для первого флага (как в истории)
    baseFlagDiv.style.background =
        "linear-gradient(135deg, var(--accent), var(--accent2))";
    baseFlagDiv.style.display = "flex";
    baseFlagDiv.style.alignItems = "center";
    baseFlagDiv.style.justifyContent = "center";
    baseFlagDiv.style.overflow = "hidden"; // Для обрезки SVG по границе

    const baseFlagIcon = document.createElement("span");
    baseFlagIcon.className = `fi fi-${baseFlagCode}`;
    baseFlagIcon.style.fontSize = "28px"; // Размер флага
    baseFlagIcon.style.color = "white"; // Цвет флага

    baseFlagDiv.appendChild(baseFlagIcon);
    signalFlags.appendChild(baseFlagDiv);

    // --- Создаём флаг для котируемой валюты ---
    const quoteFlagDiv = document.createElement("div");
    quoteFlagDiv.className = "pair-flag";
    // Применяем другой градиентный фон для второго флага (как в истории)
    quoteFlagDiv.style.background =
        "linear-gradient(135deg, var(--danger), #ff9900)";
    quoteFlagDiv.style.display = "flex";
    quoteFlagDiv.style.alignItems = "center";
    quoteFlagDiv.style.justifyContent = "center";
    quoteFlagDiv.style.overflow = "hidden"; // Для обрезки SVG по границе

    const quoteFlagIcon = document.createElement("span");
    quoteFlagIcon.className = `fi fi-${quoteFlagCode}`;
    quoteFlagIcon.style.fontSize = "28px"; // Размер флага
    quoteFlagIcon.style.color = "white"; // Цвет флага

    quoteFlagDiv.appendChild(quoteFlagIcon);
    signalFlags.appendChild(quoteFlagDiv);
}

// Setup tabs
function setupTabs() {
    // Элементы, которые нужно скрывать вне Signals
    const tradingTypeSelector = document.querySelector(".trading-type-selector");
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

// Setup buttons
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

function updateProgress() {
    const percent = state.currentPercent || 0;
    const elapsed = Math.round((percent / 100) * state.timerDuration);
    const remaining = state.timerDuration - elapsed;

    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${(state.currentPercent || 0).toFixed(2)}%`;
    timerDisplay.textContent = `${formatTime(elapsed)} / ${formatTime(state.timerDuration)}`;

    // Обновляем "Until"
    const untilTime = new Date(Date.now() + remaining * 1000);
    const hours = untilTime.getHours().toString().padStart(2, "0");
    const minutes = untilTime.getMinutes().toString().padStart(2, "0");
    metaUntil.textContent = `${hours}:${minutes}`;
}

// Show loading animation
function showLoading() {
    getSignalBtn.classList.add("btn-disabled"); // ← Добавлено

    loadingOverlay.classList.add("active");
    loadingProgress.style.width = "0%";

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
// Generate signal after loading
function generateSignalAfterLoading() {
    if (state.isSignalActive) {
        clearInterval(state.timer);
        state.isSignalActive = false;
    }
    // Clear previous result
    signalResult.className = "signal-result";
    signalResult.style.display = "none";

    const pairs =
        state.tradingType === "otc"
            ? translations.otcPairs
            : translations.regularPairs;
    const pair = pairs.find((p) => p.code === state.selectedPair) || pairs[0];

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

    const untilTime = new Date(Date.now() + duration * 1000);
    const hours = untilTime.getHours().toString().padStart(2, "0");
    const minutes = untilTime.getMinutes().toString().padStart(2, "0");
    metaUntil.textContent = `${hours}:${minutes}`;

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
            state.isSignalActive = false;
            completeSignal();
        }

        updateProgress();
    }, 100); // Обновление каждые 100 мс
}

// Complete signal and determine result
function completeSignal() {
    // ... (вся существующая логика)

    // В конце — разблокировать кнопку
    getSignalBtn.classList.remove("btn-disabled"); // ← Добавлено

    // Обновление текста кнопки
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

// Reset the signal display
function resetSignal() {
    if (state.timer) {
        clearInterval(state.timer);
    }

    state.isSignalActive = false;
    // ... (остальная логика сброса)

    // Разблокировать кнопку
    getSignalBtn.classList.remove("btn-disabled"); // ← Добавлено

    const getSignalBtnTexts =
        translations.getSignalBtnTexts[state.currentLang] ||
        translations.getSignalBtnTexts.en;
    getSignalBtn.innerHTML = `<i class="fas fa-bolt"></i> ${getSignalBtnTexts}`;
}

// Update history display
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

        item.innerHTML = `
      <div class="history-pair">
        <div class="pair-flag-select" style="width: 40px; height: 40px;">${signal.pair.substring(
            0,
            2,
        )}</div>
        <div class="history-details">
          <div class="history-pair-name">${signal.pairName}</div>
          <div class="history-time">${dateStr} • ${timeStr} • ${
            signal.timeframe
        }</div>
        </div>
      </div>
      <div class="history-result ${
          signal.result === "win" ? "history-win" : "history-loss"
      }">
        ${signal.resultSimple}
      </div>
    `;

        historyList.appendChild(item);
    });
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
document.addEventListener("DOMContentLoaded", init);
