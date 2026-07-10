/* ============================================================
   1000 GREAT QUESTIONS — site behavior
   Vanilla JS by rule. Data source: questions.json
   ({id, level, text} × 1000). No frameworks, no build step.

   Interaction model (mirrors the iOS app's Pull screen):
   - Click a level / Surprise Me → home slides off left, the Pull
     stage takes over above the fold, questions flick past too fast
     to read, click to stop → decelerating ticks → lock-in.
   - Typing a number serves that exact question on the stage,
     instantly (a direct request is not a gamble — no fake spin).
   - Logo / "All levels" returns to the home hero.
   ============================================================ */
(function () {
  'use strict';

  var LEVELS = {
    1: { name: 'Level 1 · Warm Up',   cls: 'l1' },
    2: { name: 'Level 2 · Go Deeper', cls: 'l2' },
    3: { name: 'Level 3 · All In',    cls: 'l3' }
  };

  var SWAP_MS = 70;                       // constant-phase swap rate
  var DECEL_MS = [110, 170, 260, 390, 560]; // slowing ticks before lock-in
  var MIN_SPIN_MS = 500;                  // never feels rigged
  var AUTO_STOP_MS = 4000;                // stop by itself if they just watch

  var questions = null;
  var byLevel = { 1: [], 2: [], 3: [] };

  var state = 'home';                     // home | spinning | stopping | landed
  var currentPool = 0;                    // 0 = all, 1/2/3 = level
  var lastId = null;
  var spinTimer = null;
  var autoStopTimer = null;
  var spinStartedAt = 0;

  var el = {
    home:    document.getElementById('homeView'),
    stage:   document.getElementById('pullStage'),
    chip:    document.getElementById('stageChip'),
    num:     document.getElementById('stageNum'),
    q:       document.getElementById('stageQ'),
    bar:     document.getElementById('stageBar'),
    actions: document.getElementById('stageActions'),
    input:   document.getElementById('questionNumber'),
    err:     document.getElementById('pickerr')
  };

  var ready = fetch('questions.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      questions = data;
      data.forEach(function (q) { byLevel[q.level].push(q); });
    });

  // ---------- rendering ----------

  function isBlank(q) { return /_{2,}/.test(q.text); }

  function renderText(q) {
    if (isBlank(q)) {
      el.q.textContent = '';
      var parts = q.text.split(/_{2,}/);
      parts.forEach(function (part, i) {
        el.q.appendChild(document.createTextNode(part));
        if (i < parts.length - 1) {
          var line = document.createElement('span');
          line.className = 'blankline';
          el.q.appendChild(line);
        }
      });
    } else {
      el.q.textContent = q.text;
    }
  }

  function renderMeta(q) {
    var lv = LEVELS[q.level];
    el.chip.textContent = isBlank(q) ? 'Fill in the blank' : lv.name;
    el.chip.className = 'stagechip label ' + (isBlank(q) ? '' : lv.cls);
    el.num.textContent = '#' + q.id;
  }

  function poolQuestions() {
    return currentPool ? byLevel[currentPool] : questions;
  }

  function randomFromPool() {
    var pool = poolQuestions();
    var q;
    do {
      q = pool[Math.floor(Math.random() * pool.length)];
    } while (pool.length > 1 && q.id === lastId);
    return q;
  }

  // ---------- view switching ----------

  function showStage() {
    el.home.classList.add('exiting');
    window.setTimeout(function () { el.home.hidden = true; }, 430);
    el.stage.hidden = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function showHome() {
    stopTimers();
    state = 'home';
    el.stage.hidden = true;
    el.stage.classList.remove('spinning', 'landed');
    el.home.hidden = false;
    el.home.classList.remove('exiting');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function stopTimers() {
    if (spinTimer) { clearInterval(spinTimer); spinTimer = null; }
    if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
  }

  // ---------- the pull ----------

  function startSpin(level) {
    ready.then(function () {
      currentPool = level;
      state = 'spinning';
      spinStartedAt = Date.now();
      var lv = level ? LEVELS[level] : null;
      el.chip.textContent = lv ? lv.name : 'Surprise Me';
      el.chip.className = 'stagechip label ' + (lv ? lv.cls : '');
      el.num.textContent = ' ';
      el.stage.classList.add('spinning');
      el.stage.classList.remove('landed');
      el.actions.hidden = true;
      el.bar.hidden = false;
      showStage();

      stopTimers();
      spinTimer = setInterval(function () {
        renderText(randomFromPool());
      }, SWAP_MS);
      autoStopTimer = setTimeout(function () {
        if (state === 'spinning') beginDecel();
      }, AUTO_STOP_MS);
    });
  }

  function beginDecel() {
    if (state !== 'spinning') return;
    state = 'stopping';
    stopTimers();
    var i = 0;
    function tick() {
      renderText(randomFromPool());
      i++;
      if (i < DECEL_MS.length) {
        window.setTimeout(tick, DECEL_MS[i]);
      } else {
        land(randomFromPool());
      }
    }
    window.setTimeout(tick, DECEL_MS[0]);
  }

  function land(q, seenNote) {
    state = 'landed';
    lastId = q.id;
    el.stage.classList.remove('spinning');
    el.stage.classList.add('landed');
    renderText(q);
    renderMeta(q);
    el.bar.hidden = true;
    el.actions.hidden = false;
  }

  // ---------- direct number pull (always serves, no spin) ----------

  function pullNumber() {
    ready.then(function () {
      var n = parseInt(el.input.value, 10);
      if (!n || n < 1 || n > 1000) {
        el.err.textContent = 'Pick a number from 1 to 1000';
        return;
      }
      el.err.textContent = '';
      el.input.value = '';
      el.input.blur();
      currentPool = 0;
      el.stage.classList.remove('spinning');
      el.bar.hidden = true;
      el.actions.hidden = false;
      showStage();
      land(questions[n - 1]);
    });
  }

  // ---------- wiring ----------

  document.getElementById('level1Button').addEventListener('click', function () { startSpin(1); });
  document.getElementById('level2Button').addEventListener('click', function () { startSpin(2); });
  document.getElementById('level3Button').addEventListener('click', function () { startSpin(3); });
  document.getElementById('randomButton').addEventListener('click', function () { startSpin(0); });
  document.getElementById('submit').addEventListener('click', pullNumber);
  el.input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') pullNumber();
  });

  // stage click = stop (honoring minimum spin)
  el.stage.addEventListener('click', function (e) {
    if (e.target.closest('#stageBack') || e.target.closest('#stageActions')) return;
    if (state === 'spinning' && Date.now() - spinStartedAt >= MIN_SPIN_MS) {
      beginDecel();
    }
  });

  document.getElementById('stageAgain').addEventListener('click', function (e) {
    e.stopPropagation();
    startSpin(currentPool);
  });

  document.getElementById('stageBack').addEventListener('click', function (e) {
    e.preventDefault();
    showHome();
  });

  // logo always brings back the home hero
  document.getElementById('logoHome').addEventListener('click', function (e) {
    e.preventDefault();
    showHome();
  });
})();
