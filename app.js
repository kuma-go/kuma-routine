const DAYS = [
  { key: "mon", ko: "월", en: "MON", ja: "月" },
  { key: "tue", ko: "화", en: "TUE", ja: "火" },
  { key: "wed", ko: "수", en: "WED", ja: "水" },
  { key: "thu", ko: "목", en: "THU", ja: "木" },
  { key: "fri", ko: "금", en: "FRI", ja: "金" },
  { key: "sat", ko: "토", en: "SAT", ja: "土" },
  { key: "sun", ko: "일", en: "SUN", ja: "日" },
];

const STORAGE_KEY = "kuma-routine.v5";
const LANGUAGE_STORAGE_KEY = "kuma-routine.language";
const THEME_STORAGE_KEY = "kuma-routine.theme";
const APP_URL = "https://kuma-go.github.io/kuma-routine/";
const LOOP_WEEKS = 5;
const CENTER_WEEK = Math.floor(LOOP_WEEKS / 2);
const SLIDES = Array.from({ length: LOOP_WEEKS }, () => DAYS).flat();
const ALARM_CHECK_INTERVAL_MS = 15000;
const HOUR_HEIGHT = () => Math.min(100, Math.max(70, window.innerWidth * 0.19));
const MIN_ROUTINE_HEIGHT = () => Math.min(118, Math.max(88, window.innerWidth * 0.22));
const MIN_GAP_HEIGHT = () => Math.min(86, Math.max(58, window.innerWidth * 0.15));
const $ = (selector) => document.querySelector(selector);

const I18N = {
  ko: {
    addRoutine: "루틴 추가",
    alarmChangeFail: "알람 설정을 변경하지 못했습니다.",
    alarmDenied: "브라우저 알림 권한이 꺼져 있어요. 기기/브라우저 설정에서 알림을 허용한 뒤 다시 켜주세요.",
    alarmPermissionNeeded: "알람을 사용하려면 브라우저 알림 권한이 필요해요.",
    alarmUnsupported: "이 브라우저는 시스템 알림을 지원하지 않아서, 앱이 열려 있을 때 화면 알림으로 알려드릴게요.",
    alarmUse: "알람 사용",
    cancel: "취소",
    close: "닫기",
    color: "색상",
    content: "내용",
    creator: "제작자",
    creatorContact: "제작자/문의",
    currentTime: "현재 시간",
    dayChange: "DAY 변경",
    dayScreenAria: "요일별 루틴 화면",
    delete: "삭제",
    dialogCreate: "루틴 등록",
    dialogEdit: "루틴 수정",
    endAfterStart: "종료시간은 시작시간보다 늦어야 합니다.",
    endTime: "종료시간",
    goCurrent: "현재로",
    installAlready: "이미 앱으로 설치되어 있거나, 이 브라우저에서는 설치 버튼이 바로 제공되지 않아요.",
    installApp: "앱아이콘 추가",
    installHelp: "iPhone은 공유 버튼을 누른 뒤 '홈 화면에 추가'를 선택하면 앱아이콘으로 추가할 수 있어요.",
    language: "언어",
    loadFail: "루틴 파일을 불러오지 못했습니다.",
    loadFile: "불러오기",
    makeSample: "샘플 만들기",
    menuAria: "메뉴",
    nextDay: "다음 요일",
    noonDisplay: "정오 표시",
    overlap: "이미 등록된 일정과 시간이 겹칩니다.",
    prevDay: "이전 요일",
    reset: "초기화",
    resetConfirm: "저장된 모든 루틴을 초기화할까요?",
    save: "저장",
    saveFile: "저장하기",
    sendMail: "메일 보내기",
    settings: "설정",
    share: "공유하기",
    shareFail: "공유를 완료하지 못했습니다.",
    start: "시작하기",
    startTime: "시작시간",
    swipeHint: "손가락으로 좌우 스와이프",
    titlePlaceholder: "예: 학교",
    today: "오늘",
    tutorialAria: "사용 안내를 보고 시작하기",
    empty: "비어있음",
    exportCalendar: "캘린더 내보내기",
    noAlarmCalendar: "알람이 켜진 루틴이 없어요.",
    theme: "화면 모드",
    darkTheme: "어두운 화면",
    lightTheme: "밝은 화면",
    randomColor: "랜덤",
  },
  en: {
    addRoutine: "Add routine",
    alarmChangeFail: "Could not change the alarm setting.",
    alarmDenied: "Browser notifications are blocked. Allow notifications in your device or browser settings.",
    alarmPermissionNeeded: "Notification permission is required to use alarms.",
    alarmUnsupported: "This browser does not support system notifications, so alerts will appear inside the app while it is open.",
    alarmUse: "Use alarm",
    cancel: "Cancel",
    close: "Close",
    color: "Color",
    content: "Content",
    creator: "Creator",
    creatorContact: "Creator / Contact",
    currentTime: "Current time",
    dayChange: "Change Day",
    dayScreenAria: "Daily routine screen",
    delete: "Delete",
    dialogCreate: "Add Routine",
    dialogEdit: "Edit Routine",
    endAfterStart: "End time must be later than start time.",
    endTime: "End time",
    goCurrent: "Current",
    installAlready: "This app may already be installed, or this browser does not provide a direct install prompt.",
    installApp: "Add app icon",
    installHelp: "On iPhone, tap Share, then choose 'Add to Home Screen' to add the app icon.",
    language: "Language",
    loadFail: "Could not load the routine file.",
    loadFile: "Load",
    makeSample: "Create sample",
    menuAria: "Menu",
    nextDay: "Next day",
    noonDisplay: "Noon marker",
    overlap: "This overlaps an existing routine.",
    prevDay: "Previous day",
    reset: "Reset",
    resetConfirm: "Reset all saved routines?",
    save: "Save",
    saveFile: "Save file",
    sendMail: "Send mail",
    settings: "Settings",
    share: "Share",
    shareFail: "Could not complete sharing.",
    start: "Start",
    startTime: "Start time",
    swipeHint: "Swipe left or right",
    titlePlaceholder: "e.g. School",
    today: "Today",
    tutorialAria: "Open the app after reading the guide",
    empty: "Empty",
    exportCalendar: "Export calendar",
    noAlarmCalendar: "There are no routines with alarms enabled.",
    theme: "Theme",
    darkTheme: "Dark",
    lightTheme: "Light",
    randomColor: "Random",
  },
  ja: {
    addRoutine: "ルーティン追加",
    alarmChangeFail: "アラーム設定を変更できませんでした。",
    alarmDenied: "ブラウザ通知がオフです。端末またはブラウザ設定で通知を許可してください。",
    alarmPermissionNeeded: "アラームを使うには通知の許可が必要です。",
    alarmUnsupported: "このブラウザはシステム通知に対応していないため、アプリを開いている間は画面内通知でお知らせします。",
    alarmUse: "アラーム使用",
    cancel: "キャンセル",
    close: "閉じる",
    color: "カラー",
    content: "内容",
    creator: "制作者",
    creatorContact: "制作者/問い合わせ",
    currentTime: "現在時刻",
    dayChange: "DAY変更",
    dayScreenAria: "曜日別ルーティン画面",
    delete: "削除",
    dialogCreate: "ルーティン登録",
    dialogEdit: "ルーティン編集",
    endAfterStart: "終了時間は開始時間より後にしてください。",
    endTime: "終了時間",
    goCurrent: "現在へ",
    installAlready: "すでにインストール済み、またはこのブラウザでは直接追加できません。",
    installApp: "アプリアイコン追加",
    installHelp: "iPhoneでは共有ボタンから「ホーム画面に追加」を選ぶとアプリアイコンを追加できます。",
    language: "言語",
    loadFail: "ルーティンファイルを読み込めませんでした。",
    loadFile: "読み込み",
    makeSample: "サンプル作成",
    menuAria: "メニュー",
    nextDay: "次の曜日",
    noonDisplay: "正午表示",
    overlap: "登録済みの予定と時間が重なっています。",
    prevDay: "前の曜日",
    reset: "初期化",
    resetConfirm: "保存されたすべてのルーティンを初期化しますか？",
    save: "保存",
    saveFile: "保存",
    sendMail: "メール送信",
    settings: "設定",
    share: "共有",
    shareFail: "共有できませんでした。",
    start: "開始",
    startTime: "開始時間",
    swipeHint: "左右にスワイプ",
    titlePlaceholder: "例: 学校",
    today: "今日",
    tutorialAria: "ガイドを見て開始",
    empty: "空き",
    exportCalendar: "カレンダー出力",
    noAlarmCalendar: "アラームがオンのルーティンがありません。",
    theme: "画面モード",
    darkTheme: "ダーク",
    lightTheme: "ライト",
    randomColor: "ランダム",
  },
};

const emptyRoutines = () => DAYS.reduce((acc, day) => {
  acc[day.key] = [];
  return acc;
}, {});

const demoRoutines = {
  mon: [
    { id: crypto.randomUUID(), start: "07:00", end: "08:00", title: "기상", color: "#5c3620", alarm: false },
    { id: crypto.randomUUID(), start: "08:00", end: "13:00", title: "학교", color: "#3c362e", alarm: false },
    { id: crypto.randomUUID(), start: "14:00", end: "15:00", title: "피아노", color: "#8a9848", alarm: true },
    { id: crypto.randomUUID(), start: "15:30", end: "16:30", title: "태권도", color: "#3d60a0", alarm: false },
    { id: crypto.randomUUID(), start: "16:30", end: "17:30", title: "댄스", color: "#4f8da3", alarm: false },
    { id: crypto.randomUUID(), start: "21:30", end: "22:30", title: "취침", color: "#984d94", alarm: false },
  ],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: [],
};

const ROUTINE_COLORS = [
  "#5c3620",
  "#8a9848",
  "#3d60a0",
  "#4f8da3",
  "#984d94",
  "#ff6b00",
  "#f9c80e",
  "#4f9d69",
  "#6a4c93",
  "#d1495b",
];

let routines = loadRoutines();
let activeDayIndex = todayIndex();
let selectedGapId = null;
let selectedRoutineId = null;
let longPressTimer = null;
let scrollSettleTimer = null;
let modalDayIndex = activeDayIndex;
let suppressNextClick = false;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerMoved = false;
let mouseDrag = null;
let lastViewportWidth = window.innerWidth;
let renderedTodayIndex = todayIndex();
let warnedNotificationFallback = false;
let serviceWorkerRegistration = null;
let deferredInstallPrompt = null;
let currentLanguage = loadLanguage();
let currentTheme = loadTheme();
const firedAlarmKeys = loadFiredAlarmKeys();

const menuScreen = $("#menuScreen");
const dayScreen = $("#dayScreen");
const scroller = $("#dayScroller");
const dayTitleWindow = $(".day-title-window");
const dayTitleTrack = $("#dayTitleTrack");
const dialog = $("#routineDialog");
const form = $("#routineForm");
const contactDialog = $("#contactDialog");
const settingsDialog = $("#settingsDialog");

function loadLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && I18N[saved]) return saved;
  const browserLanguage = navigator.language?.toLowerCase() ?? "";
  if (browserLanguage.startsWith("ja")) return "ja";
  if (browserLanguage.startsWith("en")) return "en";
  return "ko";
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "light" ? "light" : "dark";
}

function applyTheme() {
  document.body.dataset.theme = currentTheme;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.content = currentTheme === "light" ? "#f8f2f7" : "#131319";
  }

  document.querySelectorAll('input[name="theme"]').forEach((input) => {
    input.checked = input.value === currentTheme;
  });
}

function setTheme(theme) {
  if (!["dark", "light"].includes(theme)) return;

  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme();
}

function t(key) {
  return I18N[currentLanguage]?.[key] ?? I18N.ko[key] ?? key;
}

function dayLabel(day, includeToday = false) {
  const base = currentLanguage === "ko"
    ? `${day.ko} ${day.en}`
    : currentLanguage === "ja"
      ? `${day.ja} ${day.en}`
      : day.en;
  return includeToday ? `${base} ${t("today")}` : base;
}

function dayLongLabel(day) {
  return currentLanguage === "ko"
    ? `${day.ko}요일`
    : currentLanguage === "ja"
      ? `${day.ja}曜日`
      : day.en;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "ja" ? "ja" : currentLanguage === "en" ? "en" : "ko";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    for (const pair of element.dataset.i18nAttr.split(",")) {
      const [attribute, key] = pair.split(":").map((value) => value.trim());
      if (attribute && key) element.setAttribute(attribute, t(key));
    }
  });
  document.querySelectorAll("input[name='language']").forEach((input) => {
    input.checked = input.value === currentLanguage;
  });
  updateLabels();
  renderDayTitleTrack();
  modalDayLabel();
}

function loadRoutines() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return emptyRoutines();

  try {
    const parsed = JSON.parse(saved);
    return DAYS.reduce((acc, day) => {
      acc[day.key] = Array.isArray(parsed[day.key]) ? parsed[day.key].map(normalizeRoutine) : [];
      return acc;
    }, {});
  } catch {
    return emptyRoutines();
  }
}

function normalizeRoutine(routine) {
  return {
    id: routine.id,
    start: routine.start,
    end: routine.end,
    title: routine.title,
    color: routine.color,
    alarm: Boolean(routine.alarm),
  };
}

function saveRoutines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

function loadFiredAlarmKeys() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem("kuma-routine.firedAlarms") || "[]"));
  } catch {
    return new Set();
  }
}

function rememberFiredAlarm(key) {
  firedAlarmKeys.add(key);
  try {
    sessionStorage.setItem("kuma-routine.firedAlarms", JSON.stringify([...firedAlarmKeys].slice(-100)));
  } catch {
    // Session storage is best-effort only; duplicate protection still works in memory.
  }
}

function todayIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function activeDay() {
  return DAYS[activeDayIndex];
}

function toMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function toTime(minutes) {
  const normalized = Math.max(0, Math.min(1439, minutes));
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function defaultEndForStart(start) {
  return toTime(toMinutes(start) + 60);
}

function randomRoutineColor() {
  return ROUTINE_COLORS[Math.floor(Math.random() * ROUTINE_COLORS.length)];
}

function displayStart(value) {
  const minutes = toMinutes(value);
  const hour24 = Math.floor(minutes / 60);
  const hour = hour24 === 0 ? 0 : hour24 % 12 || 12;
  const minute = minutes % 60;
  return minute ? `${hour}:${String(minute).padStart(2, "0")}~` : `${hour}:00~`;
}

function displayClock(includeSeconds = false) {
  const now = new Date();
  const hour = now.getHours() % 12 || 12;
  const minute = String(now.getMinutes()).padStart(2, "0");
  if (!includeSeconds) return `${hour}:${minute}`;
  return `${hour}:${minute}:${String(now.getSeconds()).padStart(2, "0")}`;
}

function currentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() + (now.getSeconds() / 60);
}

function localDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function notificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js?v=20260517-25", { scope: "./" })
    .then((registration) => {
      serviceWorkerRegistration = registration;
      registration.update?.();
    })
    .catch(() => {
      serviceWorkerRegistration = null;
    });
}

function requestNotificationPermission() {
  if (!("Notification" in window)) return Promise.resolve("unsupported");
  try {
    return new Promise((resolve) => {
      const request = Notification.requestPermission(resolve);
      if (request?.then) request.then(resolve).catch(() => resolve(Notification.permission));
    });
  } catch {
    return Promise.resolve(Notification.permission);
  }
}

async function ensureAlarmPermission() {
  const permission = notificationPermission();
  if (permission === "granted") return true;
  if (permission === "unsupported") {
    if (!warnedNotificationFallback) {
      warnedNotificationFallback = true;
      alert(t("alarmUnsupported"));
    }
    return true;
  }
  if (permission === "denied") {
    alert(t("alarmDenied"));
    return false;
  }

  const nextPermission = await requestNotificationPermission();
  if (nextPermission === "granted") return true;
  alert(t("alarmPermissionNeeded"));
  return false;
}

function showAlarmToast(title, body) {
  const toast = document.createElement("div");
  toast.className = "alarm-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 5200);
}

function showSystemNotification(title, options) {
  if (notificationPermission() !== "granted") return false;

  if (serviceWorkerRegistration?.showNotification) {
    serviceWorkerRegistration.showNotification(title, options).catch(() => {
      showAlarmToast(title, options.body ?? "");
    });
    return true;
  }

  try {
    new Notification(title, options);
    return true;
  } catch {
    return false;
  }
}

function notifyRoutine(dayKey, routine) {
  const day = DAYS.find((item) => item.key === dayKey);
  const title = "KUMA routine";
  const body = `${day ? dayLabel(day) : ""} ${displayStart(routine.start)} ${routine.title}`;
  const options = {
    body,
    tag: `kuma-routine-${localDateKey()}-${dayKey}-${routine.id}`,
    renotify: true,
    silent: false,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: { dayKey, routineId: routine.id },
  };

  if (showSystemNotification(title, options)) return;
  showAlarmToast(title, body);
}

function checkDueAlarms() {
  const day = DAYS[todayIndex()];
  const nowMinute = Math.floor(currentMinutes());
  for (const routine of routines[day.key]) {
    if (!routine.alarm || toMinutes(routine.start) !== nowMinute) continue;
    const alarmKey = `${localDateKey()}-${day.key}-${routine.id}-${routine.start}`;
    if (firedAlarmKeys.has(alarmKey)) continue;
    rememberFiredAlarm(alarmKey);
    notifyRoutine(day.key, routine);
  }
}

function minutesToTop(minutes) {
  return (minutes / 60) * HOUR_HEIGHT();
}

function slideGap() {
  return parseFloat(getComputedStyle(scroller).columnGap) || 0;
}

function slideStride() {
  return scroller.clientWidth + slideGap();
}

function gapVisualHeight(minutes) {
  return Math.max(MIN_GAP_HEIGHT(), minutesToTop(minutes));
}

function gapId(dayKey, gap) {
  return `${dayKey}-gap-${gap.start}-${gap.end}`;
}

function isSelectedGap(dayKey, gap) {
  return selectedGapId === gapId(dayKey, gap);
}

function sorted(dayKey) {
  return [...routines[dayKey]].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
}

function getGaps(dayKey) {
  const dayRoutines = sorted(dayKey);
  if (!dayRoutines.length) return [{ start: 0, end: 1440 }];

  const gaps = [];
  let cursor = 0;
  for (const routine of dayRoutines) {
    const start = toMinutes(routine.start);
    const end = toMinutes(routine.end);
    if (start > cursor) gaps.push({ start: cursor, end: start });
    cursor = Math.max(cursor, end);
  }
  if (cursor < 1440) gaps.push({ start: cursor, end: 1440 });
  return gaps.filter((gap) => gap.end - gap.start >= 15);
}

function routineVisualHeight(routine, minutesOverride = null) {
  const minutes = minutesOverride ?? (toMinutes(routine.end) - toMinutes(routine.start));
  const titleLength = Math.max(1, Array.from(routine.title ?? "").length);
  const estimatedLines = Math.ceil(titleLength / 7);
  const textHeight = 58 + (estimatedLines * 34);
  return Math.max(MIN_ROUTINE_HEIGHT(), textHeight, minutesToTop(minutes));
}

function createTimelineLayout(dayKey) {
  const items = [];
  let cursor = 0;
  let y = 0;

  for (const routine of sorted(dayKey)) {
    const start = toMinutes(routine.start);
    const end = toMinutes(routine.end);
    if (start > cursor) {
      const gap = { start: cursor, end: start };
      const height = gapVisualHeight(gap.end - gap.start);
      items.push({ type: "gap", gap, start: gap.start, end: gap.end, top: y, height });
      y += height;
    }

    const routineStart = start;
    const routineEnd = end;
    const duration = routineEnd - routineStart;
    const height = routineVisualHeight(routine, duration);
    items.push({ type: "routine", routine, start: routineStart, end: routineEnd, top: y, height });
    y += height;
    cursor = Math.max(cursor, end);
  }

  if (cursor < 1440) {
    const gap = { start: cursor, end: 1440 };
    const height = gapVisualHeight(gap.end - gap.start);
    items.push({ type: "gap", gap, start: gap.start, end: gap.end, top: y, height });
    y += height;
  }

  return { items: items.filter((item) => item.end - item.start >= 1), height: y };
}

function timelineYForMinute(layout, minute) {
  const safeMinute = Math.max(0, Math.min(1440, minute));
  for (const item of layout.items) {
    if (safeMinute < item.start) return item.top;
    if (safeMinute <= item.end) {
      const duration = Math.max(1, item.end - item.start);
      return item.top + (((safeMinute - item.start) / duration) * item.height);
    }
  }
  return layout.height;
}

function minuteForTimelineY(layout, y) {
  const safeY = Math.max(0, Math.min(layout.height, y));
  for (const item of layout.items) {
    const bottom = item.top + item.height;
    if (safeY <= bottom) {
      const ratio = item.height ? (safeY - item.top) / item.height : 0;
      return item.start + (ratio * (item.end - item.start));
    }
  }
  return 1440;
}

function render() {
  const targetDayIndex = activeDayIndex;
  window.clearTimeout(scrollSettleTimer);
  scroller.innerHTML = "";
  renderDayTitleTrack();
  renderedTodayIndex = todayIndex();

  SLIDES.forEach((day, slideIndex) => {
    const slide = document.createElement("article");
    slide.className = "day-slide";
    slide.dataset.day = day.key;
    slide.dataset.slideIndex = String(slideIndex);
    slide.setAttribute("aria-label", `${dayLongLabel(day)} routine`);

    const timeline = document.createElement("div");
    const hasRoutines = sorted(day.key).length > 0;
    const layout = createTimelineLayout(day.key);
    timeline._timeLayout = layout;
    timeline.className = `timeline${hasRoutines ? "" : " is-empty"}`;
    timeline.style.minHeight = `${layout.height + 28}px`;
    timeline.addEventListener("click", (event) => {
      if (event.target.closest(".block")) return;
      selectedRoutineId = null;
      selectedGapId = null;
      applySelectionState();
    });
    timeline.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".block")) return;
      const start = roundedTimeFromPoint(timeline, event.clientY);
      longPressTimer = window.setTimeout(() => {
        openEditor(day.key, null, {
          start: toTime(start),
          end: defaultEndForStart(toTime(start)),
        });
      }, 520);
    });
    timeline.addEventListener("pointermove", clearLongPress);
    timeline.addEventListener("pointerup", clearLongPress);
    timeline.addEventListener("pointercancel", clearLongPress);

    const noon = document.createElement("div");
    noon.className = "noon-line";
    noon.style.top = `${timelineYForMinute(layout, 720)}px`;
    noon.innerHTML = '<span class="noon-label">오전(AM)<br>오후(PM)</span>';
    timeline.append(noon);

    if (day.key === DAYS[todayIndex()].key) {
      const nowLine = document.createElement("div");
      nowLine.className = "now-line";
      nowLine.style.top = `${timelineYForMinute(layout, currentMinutes())}px`;
      nowLine.innerHTML = `<span class="now-label">${displayClock(true)}</span>`;
      timeline.append(nowLine);
    }

    for (const entry of layout.items.filter((item) => item.type === "gap")) {
      const gap = entry.gap;
      const block = document.createElement("button");
      const minutes = gap.end - gap.start;
      block.type = "button";
      block.dataset.selectId = gapId(day.key, gap);
      block.className = `block gap-block${minutes <= 30 ? " is-short" : ""}${isSelectedGap(day.key, gap) ? " is-selected" : ""}`;
      block.style.top = `${entry.top}px`;
      block.style.height = `${entry.height}px`;
      block.setAttribute("aria-label", `${displayStart(toTime(gap.start))} ${t("empty")} ${t("addRoutine")}`);
      block.innerHTML = `<span class="time-label">${displayStart(toTime(gap.start))}</span>`;
      let pressWasSelected = false;
      block.addEventListener("click", () => {
        if (pointerMoved || suppressNextClick) {
          suppressNextClick = false;
          return;
        }
        if (pressWasSelected) {
          openEditor(day.key, null, {
            start: toTime(gap.start),
            end: toTime(Math.min(gap.end, gap.start + 60)),
          });
        }
      });
      block.addEventListener("pointerdown", (event) => {
        pressWasSelected = isSelectedGap(day.key, gap);
        selectedRoutineId = null;
        selectedGapId = gapId(day.key, gap);
        applySelectionState();
        longPressTimer = window.setTimeout(() => {
          suppressNextClick = true;
          openEditor(day.key, null, {
            start: toTime(gap.start),
            end: toTime(Math.min(gap.end, gap.start + 60)),
          });
        }, 520);
      });
      block.addEventListener("pointerup", clearLongPress);
      block.addEventListener("pointerleave", clearLongPress);
      block.addEventListener("pointercancel", clearLongPress);
      timeline.append(block);
    }

    for (const entry of layout.items.filter((item) => item.type === "routine")) {
      timeline.append(createRoutineBlock(day.key, entry.routine, entry));
    }

    slide.append(timeline);
    scroller.append(slide);
  });

  updateLabels();
  requestAnimationFrame(() => goToDay(targetDayIndex, false));
}

function renderDayTitleTrack() {
  dayTitleTrack.innerHTML = "";
  const today = DAYS[todayIndex()].key;
  SLIDES.forEach((day) => {
    const title = document.createElement("span");
    const isToday = day.key === today;
    title.className = `day-title-item${isToday ? " is-today" : ""}`;
    title.textContent = dayLabel(day, isToday);
    dayTitleTrack.append(title);
  });
  syncDayTitleTrack();
}

function createRoutineBlock(dayKey, routine, layoutEntry) {
  const start = toMinutes(routine.start);
  const end = toMinutes(routine.end);
  const minutes = end - start;
  let pressX = 0;
  let pressY = 0;
  let pressMoved = false;
  const block = document.createElement("div");
  block.className = `block routine-block${minutes <= 30 ? " is-short" : ""}${selectedRoutineId === routine.id ? " is-selected" : ""}`;
  block.setAttribute("role", "button");
  block.tabIndex = 0;
  block.dataset.id = routine.id;
  block.dataset.day = dayKey;
  block.style.top = `${layoutEntry.top}px`;
  block.style.height = `${layoutEntry.height}px`;
  block.style.background = routine.color;
  block.setAttribute("aria-label", `${displayStart(routine.start)} ${routine.title} ${t("dialogEdit")}`);

  if (dayKey === DAYS[todayIndex()].key && end < currentMinutes()) block.classList.add("is-past");

  block.innerHTML = `
    <span class="routine-meta">
      <span class="time-label">${displayStart(routine.start)}</span>
      <button class="routine-alarm-button${routine.alarm ? "" : " is-off"}" type="button" aria-label="${routine.title} ${t("alarmUse")}">
        <img class="alarm-icon" src="./${routine.alarm ? "Icon_Bell_on.svg" : "BIcon_ell_off.svg"}" alt="" aria-hidden="true">
      </button>
    </span>
    <span class="routine-title">${escapeHtml(routine.title)}</span>
  `;

  const alarmButton = block.querySelector(".routine-alarm-button");
  alarmButton.addEventListener("click", (event) => {
    event.stopPropagation();
    clearLongPress();
    toggleRoutineAlarm(dayKey, routine.id).catch(() => {
      alert(t("alarmChangeFail"));
    });
  });

  let pressWasSelected = false;
  block.addEventListener("click", (event) => {
    if (event.target.closest(".routine-alarm-button")) return;
    if (pointerMoved || pressMoved || suppressNextClick) {
      suppressNextClick = false;
      pressMoved = false;
      return;
    }
    if (pressWasSelected) openEditor(dayKey, routine);
  });
  block.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".routine-alarm-button")) return;
    pressX = event.clientX;
    pressY = event.clientY;
    pressMoved = false;
    pressWasSelected = selectedRoutineId === routine.id;
    selectedGapId = null;
    selectedRoutineId = routine.id;
    applySelectionState();
    longPressTimer = window.setTimeout(() => {
      suppressNextClick = true;
      openEditor(dayKey, routine);
    }, 520);
  });
  block.addEventListener("pointermove", (event) => {
    if (Math.abs(event.clientX - pressX) > 6 || Math.abs(event.clientY - pressY) > 6) {
      pressMoved = true;
      suppressNextClick = true;
      clearLongPress();
    }
  });
  block.addEventListener("pointerup", () => {
    clearLongPress();
    if (pressMoved) window.setTimeout(() => {
      pressMoved = false;
      suppressNextClick = false;
    }, 180);
  });
  block.addEventListener("pointerleave", clearLongPress);
  block.addEventListener("pointercancel", () => {
    pressMoved = false;
    clearLongPress();
  });
  block.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (selectedRoutineId === routine.id) {
      openEditor(dayKey, routine);
      return;
    }
    selectedGapId = null;
    selectedRoutineId = routine.id;
    applySelectionState();
  });

  return block;
}

async function toggleRoutineAlarm(dayKey, routineId) {
  const routine = routines[dayKey].find((item) => item.id === routineId);
  if (!routine) return;
  const nextAlarm = !routine.alarm;
  if (nextAlarm && !(await ensureAlarmPermission())) return;

  routine.alarm = nextAlarm;
  saveRoutines();
  scroller.querySelectorAll(".routine-block").forEach((block) => {
    if (block.dataset.id !== routineId || block.dataset.day !== dayKey) return;
    const button = block.querySelector(".routine-alarm-button");
    const icon = block.querySelector(".alarm-icon");
    if (!button || !icon) return;
    button.classList.toggle("is-off", !routine.alarm);
    button.setAttribute("aria-label", `${routine.title} ${t("alarmUse")}`);
    icon.src = `./${routine.alarm ? "Icon_Bell_on.svg" : "BIcon_ell_off.svg"}`;
  });
  checkDueAlarms();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function clearLongPress() {
  window.clearTimeout(longPressTimer);
}

function applySelectionState() {
  scroller.querySelectorAll(".routine-block").forEach((block) => {
    block.classList.toggle("is-selected", block.dataset.id === selectedRoutineId);
  });
  scroller.querySelectorAll(".gap-block").forEach((block) => {
    block.classList.toggle("is-selected", block.dataset.selectId === selectedGapId);
  });
}

function updateLabels() {
  const day = activeDay();
  dayTitleWindow.setAttribute("aria-label", dayLabel(day));
  $("#menuDayLabel").textContent = t("swipeHint");
  $("#menuNow").textContent = displayClock(true);
}

function updateLiveTime() {
  if (todayIndex() !== renderedTodayIndex) {
    render();
    return;
  }

  $("#menuNow").textContent = displayClock(true);
  scroller.querySelectorAll(".now-line").forEach((line) => {
    const timeline = line.closest(".timeline");
    line.style.top = `${timelineYForMinute(timeline?._timeLayout ?? createTimelineLayout(activeDay().key), currentMinutes())}px`;
    line.querySelector(".now-label").textContent = displayClock(true);
  });
}

function setScreen(name) {
  const isMenu = name === "menu";
  const targetDayIndex = activeDayIndex;
  menuScreen.hidden = !isMenu;
  dayScreen.hidden = isMenu;
  if (!isMenu) requestAnimationFrame(() => goToDay(targetDayIndex, false));
}

function goToDay(index, smooth = true) {
  activeDayIndex = (index + DAYS.length) % DAYS.length;
  const stride = slideStride();
  if (!stride) return;

  const currentSlide = Math.round(scroller.scrollLeft / stride);
  const currentWeek = Number.isFinite(currentSlide) ? Math.floor(currentSlide / DAYS.length) : CENTER_WEEK;
  const safeWeek = currentWeek <= 0 || currentWeek >= LOOP_WEEKS - 1 ? CENTER_WEEK : currentWeek;
  const targetLeft = stride * ((safeWeek * DAYS.length) + activeDayIndex);
  if (smooth) {
    scroller.scrollTo({ left: targetLeft, behavior: "smooth" });
  } else {
    scroller.scrollLeft = targetLeft;
  }
  updateLabels();
  syncDayTitleTrack();
  if (!smooth) requestAnimationFrame(syncDayTitleTrack);
}

function settleInfiniteScroll() {
  const stride = slideStride();
  if (!stride) return;

  let slideIndex = Math.round(scroller.scrollLeft / stride);
  activeDayIndex = ((slideIndex % DAYS.length) + DAYS.length) % DAYS.length;

  if (slideIndex < DAYS.length) {
    slideIndex += DAYS.length * (CENTER_WEEK - Math.floor(slideIndex / DAYS.length));
    scroller.scrollTo({ left: stride * slideIndex, behavior: "auto" });
  } else if (slideIndex >= DAYS.length * (LOOP_WEEKS - 1)) {
    slideIndex -= DAYS.length * (Math.floor(slideIndex / DAYS.length) - CENTER_WEEK);
    scroller.scrollTo({ left: stride * slideIndex, behavior: "auto" });
  }
  updateLabels();
  requestAnimationFrame(syncDayTitleTrack);
}

function handleDayScroll() {
  syncDayTitleTrack();
  window.clearTimeout(scrollSettleTimer);
  scrollSettleTimer = window.setTimeout(settleInfiniteScroll, 90);
}

function syncDayTitleTrack() {
  const titleWidth = dayTitleWindow.clientWidth;
  const stride = slideStride();
  if (!titleWidth || !stride) return;
  const slideFloat = scroller.scrollLeft / stride;
  const titleStride = titleWidth + slideGap();
  dayTitleTrack.style.setProperty("--title-width", `${titleWidth}px`);
  dayTitleTrack.style.transform = `translate3d(${-slideFloat * titleStride}px, 0, 0)`;
}

function rememberPointerStart(event) {
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  pointerMoved = false;

  if (event.pointerType === "mouse" && event.button === 0) {
    mouseDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
      dragging: false,
    };
  }
}

function trackPointerMove(event) {
  const dx = Math.abs(event.clientX - pointerStartX);
  const dy = Math.abs(event.clientY - pointerStartY);
  if (dx > 10 || dy > 10) {
    pointerMoved = true;
    clearLongPress();
  }

  if (!mouseDrag || event.pointerId !== mouseDrag.pointerId) return;
  if ((event.buttons & 1) !== 1) {
    finishMouseDrag();
    return;
  }

  const dragX = event.clientX - mouseDrag.startX;
  if (!mouseDrag.dragging && Math.abs(dragX) > 8) {
    mouseDrag.dragging = true;
    pointerMoved = true;
    scroller.classList.add("is-dragging");
    scroller.setPointerCapture?.(event.pointerId);
  }
  if (!mouseDrag.dragging) return;

  event.preventDefault();
  scroller.scrollLeft = mouseDrag.startScrollLeft - dragX;
}

function clearPointerMoveSoon() {
  finishMouseDrag();
  window.setTimeout(() => {
    pointerMoved = false;
  }, 180);
}

function finishMouseDrag() {
  if (!mouseDrag) return;
  const shouldSnap = mouseDrag.dragging;
  const pointerId = mouseDrag.pointerId;
  mouseDrag = null;
  scroller.classList.remove("is-dragging");
  scroller.releasePointerCapture?.(pointerId);

  if (!shouldSnap) return;
  const stride = slideStride();
  const targetSlide = Math.round(scroller.scrollLeft / stride);
  scroller.scrollTo({ left: targetSlide * stride, behavior: "smooth" });
  window.setTimeout(settleInfiniteScroll, 180);
}

function showToday() {
  const today = todayIndex();
  activeDayIndex = today;
  menuScreen.hidden = true;
  dayScreen.hidden = false;
  requestAnimationFrame(() => {
    goToDay(today, false);
    syncDayTitleTrack();
    requestAnimationFrame(scrollToCurrentTime);
  });
}

function scrollToCurrentTime() {
  const slide = currentSlideElement();
  const line = slide?.querySelector(".now-line");
  if (!line) return;

  const topbarHeight = $(".day-topbar").getBoundingClientRect().height;
  const rect = line.getBoundingClientRect();
  const target = window.scrollY + rect.top - topbarHeight - 36;
  window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}

function currentSlideElement() {
  const stride = slideStride();
  if (!stride) return null;
  const slideIndex = Math.round(scroller.scrollLeft / stride);
  return scroller.children[slideIndex] ?? null;
}

function modalDayLabel() {
  const day = DAYS[modalDayIndex];
  $("#modalDayLabel").textContent = dayLabel(day);
  $("#dayInput").value = day.key;
}

function roundedTimeFromPoint(timeline, clientY) {
  const rect = timeline.getBoundingClientRect();
  const y = clientY - rect.top;
  const minutes = Math.round((minuteForTimelineY(timeline._timeLayout, y) / 30)) * 30;
  return Math.max(0, Math.min(1410, minutes));
}

function openEditor(dayKey = activeDay().key, routine = null, defaults = {}) {
  const start = routine?.start ?? defaults.start ?? "08:00";
  modalDayIndex = DAYS.findIndex((day) => day.key === dayKey);
  $("#routineId").value = routine?.id ?? "";
  $("#startInput").value = start;
  $("#endInput").value = routine?.end ?? defaults.end ?? defaultEndForStart(start);
  $("#titleInput").value = routine?.title ?? "";
  $("#colorInput").value = routine?.color ?? defaults.color ?? randomRoutineColor();
  $("#alarmInput").checked = Boolean(routine?.alarm);
  $("#deleteRoutine").hidden = !routine;
  $("#dialogTitle").textContent = routine ? t("dialogEdit") : t("dialogCreate");
  modalDayLabel();
  document.body.classList.add("modal-open");
  dialog.showModal();
  $("#titleInput").focus();
}

function shiftModalDay(amount) {
  modalDayIndex = (modalDayIndex + amount + DAYS.length) % DAYS.length;
  modalDayLabel();
}

function setEndThirtyMinutesAfterStart() {
  const start = $("#startInput").value;
  if (!start) return;
  $("#endInput").value = defaultEndForStart(start);
}

function validateTime(start, end) {
  if (toMinutes(start) >= toMinutes(end)) {
    alert(t("endAfterStart"));
    return false;
  }
  return true;
}

function hasOverlappingRoutine(dayKey, id, start, end) {
  const nextStart = toMinutes(start);
  const nextEnd = toMinutes(end);
  return routines[dayKey].some((routine) => {
    if (routine.id === id) return false;
    const routineStart = toMinutes(routine.start);
    const routineEnd = toMinutes(routine.end);
    return nextStart < routineEnd && nextEnd > routineStart;
  });
}

async function upsertRoutine() {
  const id = $("#routineId").value || crypto.randomUUID();
  const dayKey = $("#dayInput").value;
  const start = $("#startInput").value;
  const end = $("#endInput").value;
  const title = $("#titleInput").value.trim();
  const color = $("#colorInput").value;
  const alarm = $("#alarmInput").checked;

  if (!validateTime(start, end)) return false;
  if (hasOverlappingRoutine(dayKey, id, start, end)) {
    alert(t("overlap"));
    return false;
  }
  if (alarm && !(await ensureAlarmPermission())) return false;

  for (const day of DAYS) {
    routines[day.key] = routines[day.key].filter((routine) => routine.id !== id);
  }
  routines[dayKey].push({ id, start, end, title, color, alarm });
  saveRoutines();
  activeDayIndex = DAYS.findIndex((day) => day.key === dayKey);
  selectedGapId = null;
  selectedRoutineId = null;
  setScreen("day");
  render();
  checkDueAlarms();
  return true;
}

function deleteRoutine() {
  const id = $("#routineId").value;
  if (!id) return;
  for (const day of DAYS) {
    routines[day.key] = routines[day.key].filter((routine) => routine.id !== id);
  }
  selectedGapId = null;
  selectedRoutineId = null;
  saveRoutines();
  dialog.close();
  render();
}

function shareText() {
  return DAYS.map((day) => {
    const items = sorted(day.key);
    const body = items.length
      ? items.map((routine) => `- ${routine.start}~${routine.end} ${routine.title}${routine.alarm ? ` (${t("alarmUse")})` : ""}`).join("\n")
      : `- ${t("empty")}`;
    return `${dayLabel(day)}\n${body}`;
  }).join("\n\n");
}

function exportRoutineFile() {
  const data = {
    app: "KUMA routine",
    version: 1,
    exportedAt: new Date().toISOString(),
    routines,
  };
  downloadBlob(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    `kuma-routine-${new Date().toISOString().slice(0, 10)}.json`
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function calendarDateForRoutine(dayIndex, start) {
  const date = new Date();
  let offset = (dayIndex - todayIndex() + 7) % 7;
  if (offset === 0 && toMinutes(start) < currentMinutes()) offset = 7;
  date.setDate(date.getDate() + offset);
  return date;
}

function formatCalendarDate(date, time) {
  const [hour, minute] = time.split(":").map(Number);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    "T",
    String(hour).padStart(2, "0"),
    String(minute).padStart(2, "0"),
    "00",
  ].join("");
}

function escapeCalendarText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function exportCalendarFile() {
  const events = [];
  DAYS.forEach((day, dayIndex) => {
    sorted(day.key).filter((routine) => routine.alarm).forEach((routine) => {
      const startDate = calendarDateForRoutine(dayIndex, routine.start);
      events.push([
        "BEGIN:VEVENT",
        `UID:${routine.id}@kuma-routine`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
        `DTSTART:${formatCalendarDate(startDate, routine.start)}`,
        `DTEND:${formatCalendarDate(startDate, routine.end)}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${["MO", "TU", "WE", "TH", "FR", "SA", "SU"][dayIndex]}`,
        `SUMMARY:${escapeCalendarText(routine.title)}`,
        `DESCRIPTION:${escapeCalendarText(`KUMA routine ${dayLabel(day)} ${routine.start}~${routine.end}`)}`,
        "BEGIN:VALARM",
        "TRIGGER:-PT0M",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeCalendarText(routine.title)}`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n"));
    });
  });

  if (!events.length) {
    alert(t("noAlarmCalendar"));
    return;
  }

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KUMA routine//Routine Calendar//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  downloadBlob(
    new Blob([calendar], { type: "text/calendar;charset=utf-8" }),
    `kuma-routine-calendar-${new Date().toISOString().slice(0, 10)}.ics`
  );
}

function normalizeImportedRoutines(payload) {
  const source = payload?.routines ?? payload;
  return DAYS.reduce((acc, day) => {
    acc[day.key] = Array.isArray(source?.[day.key])
      ? source[day.key].filter((routine) => (
        routine?.id &&
        routine?.start &&
        routine?.end &&
        routine?.title &&
        routine?.color
      )).map(normalizeRoutine)
      : [];
    return acc;
  }, {});
}

function unfoldCalendarLines(text) {
  return text.split(/\r?\n/).reduce((lines, line) => {
    if (/^[ \t]/.test(line) && lines.length) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line.trimEnd());
    }
    return lines;
  }, []);
}

function calendarValue(line) {
  return line.slice(line.indexOf(":") + 1);
}

function calendarProp(lines, name) {
  return lines.find((line) => line.toUpperCase().startsWith(`${name}:`) || line.toUpperCase().startsWith(`${name};`));
}

function unescapeCalendarText(value) {
  return String(value)
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseCalendarDateTime(line) {
  if (!line) return null;
  const value = calendarValue(line);
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
  if (!match) return null;

  const [, year, month, day, hour = "00", minute = "00", second = "00", utc] = match;
  const date = utc
    ? new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)))
    : new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  const jsDay = date.getDay();
  return {
    dayIndex: jsDay === 0 ? 6 : jsDay - 1,
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
  };
}

function calendarDayIndex(eventLines, fallbackDayIndex) {
  const rrule = calendarProp(eventLines, "RRULE");
  const byday = rrule?.match(/BYDAY=([^;]+)/i)?.[1]?.split(",")?.[0];
  const map = { MO: 0, TU: 1, WE: 2, TH: 3, FR: 4, SA: 5, SU: 6 };
  return byday && map[byday] !== undefined ? map[byday] : fallbackDayIndex;
}

function parseCalendarRoutines(text) {
  const next = emptyRoutines();
  const lines = unfoldCalendarLines(text);
  let eventLines = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      eventLines = [];
      continue;
    }
    if (line === "END:VEVENT" && eventLines) {
      const start = parseCalendarDateTime(calendarProp(eventLines, "DTSTART"));
      const end = parseCalendarDateTime(calendarProp(eventLines, "DTEND"));
      const summary = calendarProp(eventLines, "SUMMARY");
      if (start) {
        const dayIndex = calendarDayIndex(eventLines, start.dayIndex);
        const day = DAYS[dayIndex];
        const startMinutes = toMinutes(start.time);
        const endTime = end?.time ?? toTime(Math.min(startMinutes + 60, 1439));
        const safeEnd = toMinutes(endTime) > startMinutes ? endTime : toTime(Math.min(startMinutes + 60, 1439));
        next[day.key].push({
          id: crypto.randomUUID(),
          start: start.time,
          end: safeEnd,
          title: unescapeCalendarText(summary ? calendarValue(summary) : "Routine"),
          color: "#4f8da3",
          alarm: eventLines.some((item) => item === "BEGIN:VALARM"),
        });
      }
      eventLines = null;
      continue;
    }
    if (eventLines) eventLines.push(line);
  }

  return next;
}

async function importRoutineFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const isCalendar = file.name.toLowerCase().endsWith(".ics") || text.trim().startsWith("BEGIN:VCALENDAR");
    routines = isCalendar ? parseCalendarRoutines(text) : normalizeImportedRoutines(JSON.parse(text));
    saveRoutines();
    selectedGapId = null;
    selectedRoutineId = null;
    render();
    setScreen("day");
    checkDueAlarms();
  } catch {
    alert(t("loadFail"));
  }
}

async function shareAll(trigger = $("#menuShare")) {
  const text = `KUMA routine\n${APP_URL}\n\n${shareText()}`;
  if (navigator.share) {
    await navigator.share({ title: "KUMA routine", text: shareText(), url: APP_URL });
    return;
  }
  await navigator.clipboard.writeText(text);
  const label = trigger.querySelector("span") ?? trigger;
  const original = label.textContent;
  label.textContent = "복사 완료";
  window.setTimeout(() => {
    label.textContent = original;
  }, 1400);
}

function initAdSense() {
  const adSlot = document.querySelector(".ad-slot");
  const client = adSlot?.dataset.adClient?.trim();
  const slot = adSlot?.dataset.adSlot?.trim();
  if (!adSlot || !client || !slot) return;

  adSlot.classList.add("is-adsense-ready");
  const ad = document.createElement("ins");
  ad.className = "adsbygoogle";
  ad.style.display = "block";
  ad.dataset.adClient = client;
  ad.dataset.adSlot = slot;
  ad.dataset.adFormat = "auto";
  ad.dataset.fullWidthResponsive = "true";
  adSlot.append(ad);

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  script.onload = () => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      adSlot.classList.remove("is-adsense-ready");
    }
  };
  document.head.append(script);
}

async function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    return;
  }

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  alert(isStandalone ? t("installAlready") : t("installHelp"));
}

function openSettingsDialog() {
  document.body.classList.add("modal-open");
  settingsDialog.showModal();
}

function openContactDialog() {
  settingsDialog.close("contact");
  document.body.classList.add("modal-open");
  contactDialog.showModal();
}

function setLanguage(language) {
  if (!I18N[language]) return;
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage();
  render();
}

function installPressFeedback() {
  document.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("button, a, [role='button']");
    if (!button) return;
    button.classList.add("is-pressed");
  });
  for (const eventName of ["pointerup", "pointercancel", "blur"]) {
    document.addEventListener(eventName, () => {
      document.querySelectorAll(".is-pressed").forEach((button) => button.classList.remove("is-pressed"));
    }, true);
  }
}

$("#openDay").addEventListener("click", () => setScreen("day"));
$("#tutorialStart").addEventListener("click", () => setScreen("day"));
$("#tutorialStart").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  setScreen("day");
});
$("#backToMenu").addEventListener("click", () => setScreen("menu"));
$("#addRoutine").addEventListener("click", () => openEditor());
$("#goToday").addEventListener("click", showToday);
$("#menuShare").addEventListener("click", (event) => shareAll(event.currentTarget).catch(() => alert(t("shareFail"))));
$("#exportRoutines").addEventListener("click", exportRoutineFile);
$("#exportCalendar").addEventListener("click", exportCalendarFile);
$("#importRoutines").addEventListener("click", () => $("#importFile").click());
$("#installApp").addEventListener("click", () => installApp().catch(() => alert(t("installHelp"))));
$("#openSettings").addEventListener("click", openSettingsDialog);
$("#creatorContact").addEventListener("click", openContactDialog);
document.querySelectorAll("input[name='language']").forEach((input) => {
  input.addEventListener("change", () => setLanguage(input.value));
});
document.querySelectorAll('input[name="theme"]').forEach((input) => {
  input.addEventListener("change", () => setTheme(input.value));
});
$("#importFile").addEventListener("change", (event) => {
  importRoutineFile(event.target.files?.[0]);
  event.target.value = "";
});
$("#resetAll").addEventListener("click", () => {
  if (!confirm(t("resetConfirm"))) return;
  routines = emptyRoutines();
  saveRoutines();
  selectedGapId = null;
  selectedRoutineId = null;
  activeDayIndex = todayIndex();
  render();
  setScreen("menu");
  settingsDialog.close("reset");
});
$("#resetDemo").addEventListener("click", () => {
  routines = structuredClone(demoRoutines);
  saveRoutines();
  activeDayIndex = 0;
  selectedGapId = null;
  selectedRoutineId = null;
  setScreen("day");
  render();
  settingsDialog.close("sample");
});
$("#modalPrevDay").addEventListener("click", () => shiftModalDay(-1));
$("#modalNextDay").addEventListener("click", () => shiftModalDay(1));
$("#startInput").addEventListener("change", setEndThirtyMinutesAfterStart);
$("#startInput").addEventListener("input", setEndThirtyMinutesAfterStart);
$("#randomColor").addEventListener("click", () => {
  $("#colorInput").value = randomRoutineColor();
});
$("#deleteRoutine").addEventListener("click", deleteRoutine);
scroller.addEventListener("scroll", handleDayScroll);
scroller.addEventListener("pointerdown", rememberPointerStart, { capture: true });
scroller.addEventListener("pointermove", trackPointerMove, { capture: true });
scroller.addEventListener("pointerup", clearPointerMoveSoon, { capture: true });
scroller.addEventListener("pointercancel", clearPointerMoveSoon, { capture: true });
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close("cancel");
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});
settingsDialog.addEventListener("click", (event) => {
  if (event.target === settingsDialog) settingsDialog.close("cancel");
});
settingsDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});
contactDialog.addEventListener("click", (event) => {
  if (event.target === contactDialog) contactDialog.close("cancel");
});
contactDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});
$("#contactMail").addEventListener("click", () => {
  contactDialog.close("mail");
});

form.addEventListener("submit", async (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (await upsertRoutine()) dialog.close();
});

window.addEventListener("resize", () => {
  const nextWidth = window.innerWidth;
  if (Math.abs(nextWidth - lastViewportWidth) < 2) {
    syncDayTitleTrack();
    return;
  }

  const scrollY = window.scrollY;
  lastViewportWidth = nextWidth;
  render();
  requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
});
window.setInterval(updateLiveTime, 1000);
window.setInterval(checkDueAlarms, ALARM_CHECK_INTERVAL_MS);
window.addEventListener("focus", checkDueAlarms);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) checkDueAlarms();
});
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

registerServiceWorker();
initAdSense();
installPressFeedback();
render();
applyLanguage();
applyTheme();
checkDueAlarms();
setScreen("menu");
