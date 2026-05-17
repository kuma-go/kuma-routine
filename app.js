const DAYS = [
  { key: "mon", ko: "월", en: "MON" },
  { key: "tue", ko: "화", en: "TUE" },
  { key: "wed", ko: "수", en: "WED" },
  { key: "thu", ko: "목", en: "THU" },
  { key: "fri", ko: "금", en: "FRI" },
  { key: "sat", ko: "토", en: "SAT" },
  { key: "sun", ko: "일", en: "SUN" },
];

const STORAGE_KEY = "kuma-routine.v5";
const LOOP_WEEKS = 5;
const CENTER_WEEK = Math.floor(LOOP_WEEKS / 2);
const SLIDES = Array.from({ length: LOOP_WEEKS }, () => DAYS).flat();
const HOUR_HEIGHT = () => Math.min(100, Math.max(70, window.innerWidth * 0.19));
const $ = (selector) => document.querySelector(selector);

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

const menuScreen = $("#menuScreen");
const dayScreen = $("#dayScreen");
const scroller = $("#dayScroller");
const dayTitleWindow = $(".day-title-window");
const dayTitleTrack = $("#dayTitleTrack");
const dialog = $("#routineDialog");
const form = $("#routineForm");
const contactDialog = $("#contactDialog");

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
  return Math.max(50, minutesToTop(minutes));
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
    slide.setAttribute("aria-label", `${day.ko}요일 루틴`);

    const timeline = document.createElement("div");
    const hasRoutines = sorted(day.key).length > 0;
    timeline.className = `timeline${hasRoutines ? "" : " is-empty"}`;
    timeline.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      selectedRoutineId = null;
      selectedGapId = null;
      applySelectionState();
    });
    timeline.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      const start = roundedTimeFromPoint(timeline, event.clientY);
      longPressTimer = window.setTimeout(() => {
        openEditor(day.key, null, {
          start: toTime(start),
          end: toTime(Math.min(start + 60, 1439)),
        });
      }, 520);
    });
    timeline.addEventListener("pointermove", clearLongPress);
    timeline.addEventListener("pointerup", clearLongPress);
    timeline.addEventListener("pointercancel", clearLongPress);

    const noon = document.createElement("div");
    noon.className = "noon-line";
    noon.style.top = `${minutesToTop(720)}px`;
    noon.innerHTML = '<span class="noon-label">오전(AM)<br>오후(PM)</span>';
    timeline.append(noon);

    if (day.key === DAYS[todayIndex()].key) {
      const nowLine = document.createElement("div");
      nowLine.className = "now-line";
      nowLine.style.top = `${minutesToTop(currentMinutes())}px`;
      nowLine.innerHTML = `<span class="now-label">${displayClock(true)}</span>`;
      timeline.append(nowLine);
    }

    for (const gap of getGaps(day.key)) {
      const block = document.createElement("button");
      const minutes = gap.end - gap.start;
      block.type = "button";
      block.dataset.selectId = gapId(day.key, gap);
      block.className = `block gap-block${minutes <= 30 ? " is-short" : ""}${isSelectedGap(day.key, gap) ? " is-selected" : ""}`;
      block.style.top = `${minutesToTop(gap.start)}px`;
      block.style.height = `${gapVisualHeight(minutes)}px`;
      block.setAttribute("aria-label", `${displayStart(toTime(gap.start))} 빈 시간에 루틴 추가`);
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

    for (const routine of sorted(day.key)) {
      timeline.append(createRoutineBlock(day.key, routine));
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
    title.textContent = isToday ? `${day.ko} ${day.en} 오늘` : `${day.ko} ${day.en}`;
    dayTitleTrack.append(title);
  });
  syncDayTitleTrack();
}

function createRoutineBlock(dayKey, routine) {
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
  block.style.top = `${minutesToTop(start)}px`;
  block.style.height = `${Math.max(50, minutesToTop(minutes))}px`;
  block.style.background = routine.color;
  block.setAttribute("aria-label", `${displayStart(routine.start)} ${routine.title} 수정`);

  if (dayKey === DAYS[todayIndex()].key && end < currentMinutes()) block.classList.add("is-past");

  block.innerHTML = `
    <span class="routine-meta">
      <span class="time-label">${displayStart(routine.start)}</span>
      <button class="routine-alarm-button${routine.alarm ? "" : " is-off"}" type="button" aria-label="${routine.title} 알람 ${routine.alarm ? "끄기" : "켜기"}">
        <img class="alarm-icon" src="./${routine.alarm ? "Icon_Bell_on.svg" : "BIcon_ell_off.svg"}" alt="" aria-hidden="true">
      </button>
    </span>
    <span class="routine-title">${escapeHtml(routine.title)}</span>
  `;

  const alarmButton = block.querySelector(".routine-alarm-button");
  alarmButton.addEventListener("click", (event) => {
    event.stopPropagation();
    clearLongPress();
    toggleRoutineAlarm(dayKey, routine.id);
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

function toggleRoutineAlarm(dayKey, routineId) {
  const routine = routines[dayKey].find((item) => item.id === routineId);
  if (!routine) return;
  routine.alarm = !routine.alarm;
  saveRoutines();
  scroller.querySelectorAll(".routine-block").forEach((block) => {
    if (block.dataset.id !== routineId || block.dataset.day !== dayKey) return;
    const button = block.querySelector(".routine-alarm-button");
    const icon = block.querySelector(".alarm-icon");
    if (!button || !icon) return;
    button.classList.toggle("is-off", !routine.alarm);
    button.setAttribute("aria-label", `${routine.title} 알람 ${routine.alarm ? "끄기" : "켜기"}`);
    icon.src = `./${routine.alarm ? "Icon_Bell_on.svg" : "BIcon_ell_off.svg"}`;
  });
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
  dayTitleWindow.setAttribute("aria-label", `${day.ko} ${day.en}`);
  $("#menuDayLabel").textContent = "손가락으로 좌우 스와이프";
  $("#menuNow").textContent = displayClock(true);
}

function updateLiveTime() {
  if (todayIndex() !== renderedTodayIndex) {
    render();
    return;
  }

  $("#menuNow").textContent = displayClock(true);
  scroller.querySelectorAll(".now-line").forEach((line) => {
    line.style.top = `${minutesToTop(currentMinutes())}px`;
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
  $("#modalDayLabel").textContent = `${day.ko} ${day.en}`;
  $("#dayInput").value = day.key;
}

function roundedTimeFromPoint(timeline, clientY) {
  const rect = timeline.getBoundingClientRect();
  const y = clientY - rect.top;
  const minutes = Math.round((y / HOUR_HEIGHT()) * 2) * 30;
  return Math.max(0, Math.min(1410, minutes));
}

function openEditor(dayKey = activeDay().key, routine = null, defaults = {}) {
  modalDayIndex = DAYS.findIndex((day) => day.key === dayKey);
  $("#routineId").value = routine?.id ?? "";
  $("#startInput").value = routine?.start ?? defaults.start ?? "08:00";
  $("#endInput").value = routine?.end ?? defaults.end ?? "09:00";
  $("#titleInput").value = routine?.title ?? "";
  $("#colorInput").value = routine?.color ?? "#4f8da3";
  $("#alarmInput").checked = Boolean(routine?.alarm);
  $("#deleteRoutine").hidden = !routine;
  $("#dialogTitle").textContent = routine ? "루틴 수정" : "루틴 등록";
  modalDayLabel();
  document.body.classList.add("modal-open");
  dialog.showModal();
  $("#titleInput").focus();
}

function shiftModalDay(amount) {
  modalDayIndex = (modalDayIndex + amount + DAYS.length) % DAYS.length;
  modalDayLabel();
}

function validateTime(start, end) {
  if (toMinutes(start) >= toMinutes(end)) {
    alert("종료시간은 시작시간보다 늦어야 합니다.");
    return false;
  }
  return true;
}

function upsertRoutine() {
  const id = $("#routineId").value || crypto.randomUUID();
  const dayKey = $("#dayInput").value;
  const start = $("#startInput").value;
  const end = $("#endInput").value;
  const title = $("#titleInput").value.trim();
  const color = $("#colorInput").value;
  const alarm = $("#alarmInput").checked;

  if (!validateTime(start, end)) return false;

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
      ? items.map((routine) => `- ${routine.start}~${routine.end} ${routine.title}${routine.alarm ? " (알람)" : ""}`).join("\n")
      : "- 비어있음";
    return `${day.ko} ${day.en}\n${body}`;
  }).join("\n\n");
}

function exportRoutineFile() {
  const data = {
    app: "KUMA routine",
    version: 1,
    exportedAt: new Date().toISOString(),
    routines,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kuma-routine-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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

async function importRoutineFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    routines = normalizeImportedRoutines(JSON.parse(text));
    saveRoutines();
    selectedGapId = null;
    selectedRoutineId = null;
    render();
    setScreen("day");
  } catch {
    alert("루틴 파일을 불러오지 못했습니다.");
  }
}

async function shareAll(trigger = $("#menuShare")) {
  const text = `KUMA routine\n\n${shareText()}`;
  if (navigator.share) {
    await navigator.share({ title: "KUMA routine", text });
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
$("#menuShare").addEventListener("click", (event) => shareAll(event.currentTarget).catch(() => alert("공유를 완료하지 못했습니다.")));
$("#exportRoutines").addEventListener("click", exportRoutineFile);
$("#importRoutines").addEventListener("click", () => $("#importFile").click());
$("#creatorContact").addEventListener("click", () => {
  document.body.classList.add("modal-open");
  contactDialog.showModal();
});
$("#importFile").addEventListener("change", (event) => {
  importRoutineFile(event.target.files?.[0]);
  event.target.value = "";
});
$("#resetAll").addEventListener("click", () => {
  if (!confirm("저장된 모든 루틴을 초기화할까요?")) return;
  routines = emptyRoutines();
  saveRoutines();
  selectedGapId = null;
  selectedRoutineId = null;
  activeDayIndex = todayIndex();
  render();
  setScreen("menu");
});
$("#resetDemo").addEventListener("click", () => {
  routines = structuredClone(demoRoutines);
  saveRoutines();
  activeDayIndex = 0;
  selectedGapId = null;
  selectedRoutineId = null;
  setScreen("day");
  render();
});
$("#modalPrevDay").addEventListener("click", () => shiftModalDay(-1));
$("#modalNextDay").addEventListener("click", () => shiftModalDay(1));
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
contactDialog.addEventListener("click", (event) => {
  if (event.target === contactDialog) contactDialog.close("cancel");
});
contactDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});
$("#contactMail").addEventListener("click", () => {
  contactDialog.close("mail");
});

form.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (upsertRoutine()) dialog.close();
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

installPressFeedback();
render();
setScreen("menu");
