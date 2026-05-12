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
    { id: crypto.randomUUID(), start: "07:00", end: "08:00", title: "기상", color: "#5c3620" },
    { id: crypto.randomUUID(), start: "08:00", end: "13:00", title: "학교", color: "#3c362e" },
    { id: crypto.randomUUID(), start: "14:00", end: "15:00", title: "피아노", color: "#8a9848" },
    { id: crypto.randomUUID(), start: "15:30", end: "16:30", title: "태권도", color: "#3d60a0" },
    { id: crypto.randomUUID(), start: "16:30", end: "17:30", title: "댄스", color: "#4f8da3" },
    { id: crypto.randomUUID(), start: "21:30", end: "22:30", title: "취침", color: "#984d94" },
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

function loadRoutines() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return emptyRoutines();

  try {
    const parsed = JSON.parse(saved);
    return DAYS.reduce((acc, day) => {
      acc[day.key] = Array.isArray(parsed[day.key]) ? parsed[day.key] : [];
      return acc;
    }, {});
  } catch {
    return emptyRoutines();
  }
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
  const hour = hour24 % 12 || 12;
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
  if (!dayRoutines.length) return [{ start: 120, end: 1320 }];

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
  requestAnimationFrame(() => goToDay(activeDayIndex, false));
}

function renderDayTitleTrack() {
  dayTitleTrack.innerHTML = "";
  SLIDES.forEach((day) => {
    const title = document.createElement("span");
    const isToday = day.key === DAYS[todayIndex()].key;
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
  const block = document.createElement("button");
  block.className = `block routine-block${minutes <= 30 ? " is-short" : ""}${selectedRoutineId === routine.id ? " is-selected" : ""}`;
  block.type = "button";
  block.dataset.id = routine.id;
  block.dataset.day = dayKey;
  block.style.top = `${minutesToTop(start)}px`;
  block.style.height = `${Math.max(50, minutesToTop(minutes))}px`;
  block.style.background = routine.color;
  block.setAttribute("aria-label", `${displayStart(routine.start)} ${routine.title} 수정`);

  if (dayKey === DAYS[todayIndex()].key && end < currentMinutes()) block.classList.add("is-past");

  block.innerHTML = `
    <span class="time-label">${displayStart(routine.start)}</span>
    <span class="routine-title">${escapeHtml(routine.title)}</span>
  `;

  let pressWasSelected = false;
  block.addEventListener("click", () => {
    if (pointerMoved || suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    if (pressWasSelected) openEditor(dayKey, routine);
  });
  block.addEventListener("pointerdown", (event) => {
    pressX = event.clientX;
    pressY = event.clientY;
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
    if (Math.abs(event.clientX - pressX) > 8 || Math.abs(event.clientY - pressY) > 8) {
      clearLongPress();
    }
  });
  block.addEventListener("pointerup", clearLongPress);
  block.addEventListener("pointerleave", clearLongPress);
  block.addEventListener("pointercancel", clearLongPress);

  return block;
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
  menuScreen.hidden = !isMenu;
  dayScreen.hidden = isMenu;
  if (!isMenu) requestAnimationFrame(() => goToDay(activeDayIndex, false));
}

function goToDay(index, smooth = true) {
  activeDayIndex = (index + DAYS.length) % DAYS.length;
  const width = scroller.clientWidth;
  const currentSlide = Math.round(scroller.scrollLeft / width);
  const currentWeek = Number.isFinite(currentSlide) ? Math.floor(currentSlide / DAYS.length) : CENTER_WEEK;
  const safeWeek = currentWeek <= 0 || currentWeek >= LOOP_WEEKS - 1 ? CENTER_WEEK : currentWeek;
  scroller.scrollTo({ left: width * ((safeWeek * DAYS.length) + activeDayIndex), behavior: smooth ? "smooth" : "auto" });
  updateLabels();
  if (!smooth) requestAnimationFrame(syncDayTitleTrack);
}

function settleInfiniteScroll() {
  const width = scroller.clientWidth;
  if (!width) return;

  let slideIndex = Math.round(scroller.scrollLeft / width);
  activeDayIndex = ((slideIndex % DAYS.length) + DAYS.length) % DAYS.length;

  if (slideIndex < DAYS.length) {
    slideIndex += DAYS.length * (CENTER_WEEK - Math.floor(slideIndex / DAYS.length));
    scroller.scrollTo({ left: width * slideIndex, behavior: "auto" });
  } else if (slideIndex >= DAYS.length * (LOOP_WEEKS - 1)) {
    slideIndex -= DAYS.length * (Math.floor(slideIndex / DAYS.length) - CENTER_WEEK);
    scroller.scrollTo({ left: width * slideIndex, behavior: "auto" });
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
  const slideWidth = scroller.clientWidth;
  const titleWidth = dayTitleWindow.clientWidth;
  if (!slideWidth || !titleWidth) return;
  const progress = scroller.scrollLeft / slideWidth;
  dayTitleTrack.style.transform = `translate3d(${-progress * titleWidth}px, 0, 0)`;
  dayTitleTrack.style.setProperty("--title-width", `${titleWidth}px`);
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
  }, 0);
}

function finishMouseDrag() {
  if (!mouseDrag) return;
  const shouldSnap = mouseDrag.dragging;
  const pointerId = mouseDrag.pointerId;
  mouseDrag = null;
  scroller.classList.remove("is-dragging");
  scroller.releasePointerCapture?.(pointerId);

  if (!shouldSnap) return;
  const width = scroller.clientWidth;
  const targetSlide = Math.round(scroller.scrollLeft / width);
  scroller.scrollTo({ left: targetSlide * width, behavior: "smooth" });
  window.setTimeout(settleInfiniteScroll, 180);
}

function showToday() {
  setScreen("day");
  goToDay(todayIndex(), true);
  window.setTimeout(scrollToCurrentTime, 260);
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
  const width = scroller.clientWidth;
  if (!width) return null;
  const slideIndex = Math.round(scroller.scrollLeft / width);
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

  if (!validateTime(start, end)) return false;

  for (const day of DAYS) {
    routines[day.key] = routines[day.key].filter((routine) => routine.id !== id);
  }
  routines[dayKey].push({ id, start, end, title, color });
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
      ? items.map((routine) => `- ${routine.start}~${routine.end} ${routine.title}`).join("\n")
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
      ))
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
  const original = trigger.textContent;
  trigger.textContent = "복사 완료";
  window.setTimeout(() => {
    trigger.textContent = original;
  }, 1400);
}

$("#openDay").addEventListener("click", () => setScreen("day"));
$("#backToMenu").addEventListener("click", () => setScreen("menu"));
$("#menuAdd").addEventListener("click", () => openEditor());
$("#addRoutine").addEventListener("click", () => openEditor());
$("#goToday").addEventListener("click", showToday);
$("#menuShare").addEventListener("click", (event) => shareAll(event.currentTarget).catch(() => alert("공유를 완료하지 못했습니다.")));
$("#exportRoutines").addEventListener("click", exportRoutineFile);
$("#importRoutines").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", (event) => {
  importRoutineFile(event.target.files?.[0]);
  event.target.value = "";
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

render();
setScreen("menu");
