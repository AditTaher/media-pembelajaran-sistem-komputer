/**
 * Media Pembelajaran Interaktif Informatika SMP Kelas 8 - Bab 4: Sistem Komputer
 * Kurikulum Merdeka
 */

// ================= AUDIO ENGINE (Web Audio API) =================
let audioContext = null;
let soundEnabled = true;

function initAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
}

function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioContext) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gain.gain.setValueAtTime(gainVal, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

function playClickSound() {
  playTone(600, 'triangle', 0.05, 0.08);
}

function playCorrectSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.2, 0.12), 200); // G5
  } catch (e) {}
}

function playWrongSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    playTone(300, 'sawtooth', 0.15, 0.08);
    setTimeout(() => playTone(220, 'sawtooth', 0.25, 0.08), 120);
  } catch (e) {}
}

function playFanfareSound() {
  if (!soundEnabled) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 'triangle', 0.25, 0.15), idx * 120);
  });
}

function toggleAudio() {
  soundEnabled = !soundEnabled;
  const soundIcon = document.getElementById('soundIcon');
  if (soundEnabled) {
    soundIcon.className = 'fa-solid fa-volume-high text-sm text-indigo-600 dark:text-indigo-400';
    playClickSound();
  } else {
    soundIcon.className = 'fa-solid fa-volume-xmark text-sm text-slate-400';
  }
  localStorage.setItem('sk8_sound', soundEnabled ? '1' : '0');
}

// ================= THEME (DARK / LIGHT) =================
function initTheme() {
  const savedTheme = localStorage.getItem('sk8_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }

  const savedSound = localStorage.getItem('sk8_sound');
  if (savedSound === '0') {
    soundEnabled = false;
    const soundIcon = document.getElementById('soundIcon');
    if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark text-sm text-slate-400';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('sk8_theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
  playClickSound();
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (isDark) {
    icon.className = 'fa-solid fa-sun text-sm text-amber-400';
  } else {
    icon.className = 'fa-solid fa-moon text-sm text-slate-600';
  }
}

// ================= NAVIGATION / TABS =================
function switchTab(tabId) {
  playClickSound();
  // Hide all tab panes
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));

  // Show selected tab pane
  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) {
    targetPane.classList.remove('hidden');
    targetPane.classList.add('active');
  }

  // Update nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');

  // If opening quiz, initialize quiz view
  if (tabId === 'kuis') {
    initQuizView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// ================= SUB-MATERI TABS =================
function openSubMateri(subId) {
  playClickSound();
  // Ensure we are on materi tab
  switchTab('materi');

  // Hide all submateri contents
  document.querySelectorAll('.submateri-content').forEach(el => el.classList.add('hidden'));

  // Show target content
  const target = document.getElementById(`content-${subId}`);
  if (target) {
    target.classList.remove('hidden');
  }

  // Update button active state
  document.querySelectorAll('.submateri-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-${subId}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// ================= LAB TABS =================
function selectLabTab(labId) {
  playClickSound();
  document.querySelectorAll('.lab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.lab-pane').forEach(el => el.classList.remove('active'));

  const target = document.getElementById(labId.replace('tab-', 'lab-'));
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  document.querySelectorAll('.lab-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-${labId}`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ================= LAB 1: HARDWARE SORTING GAME (WITH PHOTOS & FALLBACKS) =================
const SORT_ITEMS = [
  { id: 'item1', name: 'Keyboard', category: 'input', icon: 'fa-keyboard', img: 'assets/img/input_keyboard.jpg', fallback: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80' },
  { id: 'item2', name: 'Mouse Optik', category: 'input', icon: 'fa-computer-mouse', img: 'assets/img/input_mouse.jpg', fallback: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80' },
  { id: 'item3', name: 'Mikrofon', category: 'input', icon: 'fa-microphone', img: 'assets/img/input_microphone.jpg', fallback: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80' },
  { id: 'item4', name: 'CPU (Processor)', category: 'process', icon: 'fa-microchip', img: 'assets/img/process_cpu.jpg', fallback: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=80' },
  { id: 'item5', name: 'RAM (DDR4/5)', category: 'process', icon: 'fa-memory', img: 'assets/img/process_ram.jpg', fallback: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=80' },
  { id: 'item6', name: 'GPU (VGA Card)', category: 'process', icon: 'fa-gamepad', img: 'assets/img/process_gpu.jpg', fallback: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80' },
  { id: 'item7', name: 'Monitor LCD', category: 'output', icon: 'fa-desktop', img: 'assets/img/output_monitor.jpg', fallback: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80' },
  { id: 'item8', name: 'Printer Inkjet', category: 'output', icon: 'fa-print', img: 'assets/img/output_printer.jpg', fallback: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80' },
  { id: 'item9', name: 'Speaker Aktif', category: 'output', icon: 'fa-volume-high', img: 'assets/img/output_speaker.jpg', fallback: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80' },
  { id: 'item10', name: 'SSD NVMe', category: 'storage', icon: 'fa-bolt', img: 'assets/img/storage_ssd.jpg', fallback: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80' },
  { id: 'item11', name: 'Harddisk (HDD)', category: 'storage', icon: 'fa-compact-disc', img: 'assets/img/storage_hdd.jpg', fallback: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&auto=format&fit=crop&q=80' },
  { id: 'item12', name: 'Flashdisk USB', category: 'storage', icon: 'fa-brands fa-usb', img: 'assets/img/storage_flashdisk.jpg', fallback: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&auto=format&fit=crop&q=80' },
];

let selectedSortItem = null;
let currentSortItems = [];
let sortScore = 0;

function initSortGame() {
  currentSortItems = [...SORT_ITEMS];
  // Shuffle array
  currentSortItems.sort(() => Math.random() - 0.5);
  selectedSortItem = null;
  sortScore = 0;
  updateSortScoreDisplay();

  // Clear drop zones
  ['input', 'process', 'output', 'storage'].forEach(cat => {
    const zone = document.getElementById(`zone-${cat}`);
    if (zone) zone.innerHTML = '';
    const countEl = document.getElementById(`count-${cat}`);
    if (countEl) countEl.textContent = '0';
  });

  renderSortPool();
  updateSelectionBar();
  hideSortFeedback();
}

function renderSortPool() {
  const pool = document.getElementById('sortItemsPool');
  if (!pool) return;
  pool.innerHTML = '';

  if (currentSortItems.length === 0) {
    pool.innerHTML = `
      <div class="w-full text-center py-4 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
        <i class="fa-solid fa-circle-check text-base"></i>
        <span>Luar Biasa! Semua 12 perangkat telah berhasil diklasifikasikan dengan tepat!</span>
      </div>
    `;
    if (sortScore === SORT_ITEMS.length) {
      triggerConfetti();
      playFanfareSound();
    }
    return;
  }

  currentSortItems.forEach(item => {
    const chip = document.createElement('div');
    const isSel = selectedSortItem && selectedSortItem.id === item.id;
    chip.className = `sort-item cursor-pointer px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all ${
      isSel
        ? 'selected bg-indigo-600 text-white border-indigo-600 scale-105'
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-750'
    }`;
    chip.innerHTML = `
      <img src="${item.img}" onerror="this.onerror=null; this.src='${item.fallback}'" alt="${item.name}" class="w-5 h-5 rounded-md object-cover">
      <span>${item.name}</span>
    `;
    chip.onclick = (e) => {
      e.stopPropagation();
      selectSortItem(item);
    };
    pool.appendChild(chip);
  });
}

function selectSortItem(item) {
  playClickSound();
  if (selectedSortItem && selectedSortItem.id === item.id) {
    selectedSortItem = null;
  } else {
    selectedSortItem = item;
  }
  renderSortPool();
  updateSelectionBar();
}

function updateSelectionBar() {
  const nameEl = document.getElementById('selectedComponentName');
  const imgEl = document.getElementById('selectedComponentImg');
  if (!nameEl) return;
  if (selectedSortItem) {
    nameEl.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 underline font-black">${selectedSortItem.name}</span> (Siap ditempatkan)`;
    if (imgEl && selectedSortItem.img) {
      imgEl.src = selectedSortItem.img;
      imgEl.onerror = () => { imgEl.src = selectedSortItem.fallback; };
      imgEl.classList.remove('hidden');
    }
  } else {
    nameEl.textContent = 'Pilih salah satu item di daftar';
    if (imgEl) {
      imgEl.src = 'assets/img/pilar_hardware.jpg';
      imgEl.onerror = () => { imgEl.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80'; };
    }
  }
}

function handleCategoryDrop(targetCategory) {
  if (!selectedSortItem) {
    showSortFeedback('Silakan klik salah satu perangkat di atas terlebih dahulu!', 'warn');
    playTone(250, 'sawtooth', 0.1, 0.05);
    return;
  }

  if (selectedSortItem.category === targetCategory) {
    // CORRECT!
    playCorrectSound();
    sortScore++;
    updateSortScoreDisplay();
    showSortFeedback(`Tepat sekali! "${selectedSortItem.name}" adalah ${getCategoryIndoName(targetCategory)}.`, 'success');

    // Add into target zone
    const zone = document.getElementById(`zone-${targetCategory}`);
    if (zone) {
      const card = document.createElement('div');
      card.className = 'p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-between shadow-xs';
      card.innerHTML = `
        <span class="flex items-center gap-2">
          <img src="${selectedSortItem.img}" onerror="this.onerror=null; this.src='${selectedSortItem.fallback}'" class="w-6 h-6 object-cover rounded">
          <span>${selectedSortItem.name}</span>
        </span>
        <i class="fa-solid fa-check text-emerald-500 text-xs"></i>
      `;
      zone.appendChild(card);

      const countEl = document.getElementById(`count-${targetCategory}`);
      if (countEl) {
        countEl.textContent = zone.children.length;
      }
    }

    // Remove from pool
    currentSortItems = currentSortItems.filter(i => i.id !== selectedSortItem.id);
    selectedSortItem = null;
    renderSortPool();
    updateSelectionBar();
  } else {
    // WRONG!
    playWrongSound();
    showSortFeedback(`Kurang tepat! "${selectedSortItem.name}" bukan termasuk kategori ${getCategoryIndoName(targetCategory)}. Ayo coba lagi!`, 'error');
  }
}

function getCategoryIndoName(cat) {
  switch (cat) {
    case 'input': return 'Perangkat Masukan (Input)';
    case 'process': return 'Perangkat Pemrosesan (Process)';
    case 'output': return 'Perangkat Keluaran (Output)';
    case 'storage': return 'Perangkat Penyimpanan (Storage)';
    default: return cat;
  }
}

function updateSortScoreDisplay() {
  const el = document.getElementById('sortScore');
  if (el) el.textContent = sortScore;
}

function showSortFeedback(msg, type) {
  const el = document.getElementById('sortFeedback');
  if (!el) return;
  el.classList.remove('hidden', 'bg-emerald-100', 'text-emerald-800', 'bg-rose-100', 'text-rose-800', 'bg-amber-100', 'text-amber-800', 'dark:bg-emerald-950', 'dark:text-emerald-300', 'dark:bg-rose-950', 'dark:text-rose-300');

  if (type === 'success') {
    el.classList.add('bg-emerald-100', 'text-emerald-800', 'dark:bg-emerald-950', 'dark:text-emerald-300');
  } else if (type === 'error') {
    el.classList.add('bg-rose-100', 'text-rose-800', 'dark:bg-rose-950', 'dark:text-rose-300');
  } else {
    el.classList.add('bg-amber-100', 'text-amber-800', 'dark:bg-amber-950', 'dark:text-amber-300');
  }
  el.textContent = msg;
}

function hideSortFeedback() {
  const el = document.getElementById('sortFeedback');
  if (el) el.classList.add('hidden');
}

function resetSortGame() {
  playClickSound();
  initSortGame();
}

// ================= LAB 2: SAKLAR BINER 8-BIT =================
const bitWeights = [1, 2, 4, 8, 16, 32, 64, 128]; // index 0 to 7
let bitStates = [0, 0, 0, 0, 0, 0, 0, 0]; // bit 0 to bit 7
let binaryTargetNumber = 42;

function toggleBit(index) {
  playClickSound();
  bitStates[index] = bitStates[index] === 0 ? 1 : 0;
  updateBinaryUI();
  checkBinaryQuest();
}

function setAllBits(val) {
  playClickSound();
  bitStates = bitStates.map(() => val);
  updateBinaryUI();
  checkBinaryQuest();
}

function updateBinaryUI() {
  let decimalVal = 0;
  let activeTerms = [];

  for (let i = 0; i < 8; i++) {
    const isOne = bitStates[i] === 1;
    const cardEl = document.querySelector(`.bit-card:nth-child(${8 - i})`);
    const valEl = document.getElementById(`bit-val-${i}`);
    const lblEl = document.getElementById(`bit-lbl-${i}`);

    if (valEl) valEl.textContent = isOne ? '1' : '0';
    if (lblEl) lblEl.textContent = isOne ? 'ON' : 'OFF';

    if (cardEl) {
      if (isOne) {
        cardEl.classList.add('active');
      } else {
        cardEl.classList.remove('active');
      }
    }

    if (isOne) {
      decimalVal += bitWeights[i];
      activeTerms.push(bitWeights[i]);
    }
  }

  // Update decimal display
  const decEl = document.getElementById('displayDecimal');
  if (decEl) decEl.textContent = decimalVal;

  // Update binary string
  const binStr = [...bitStates].reverse().join('');
  const binEl = document.getElementById('displayBinaryStr');
  if (binEl) binEl.textContent = binStr;

  // Update ASCII display
  const asciiEl = document.getElementById('displayAscii');
  if (asciiEl) {
    if (decimalVal >= 32 && decimalVal <= 126) {
      asciiEl.textContent = `'${String.fromCharCode(decimalVal)}'`;
    } else if (decimalVal === 0) {
      asciiEl.textContent = '- (Null)';
    } else {
      asciiEl.textContent = `[Kode #${decimalVal}]`;
    }
  }

  // Update formula string
  const formulaEl = document.getElementById('binaryFormulaText');
  if (formulaEl) {
    if (activeTerms.length === 0) {
      formulaEl.textContent = '0 = 0';
    } else {
      formulaEl.textContent = activeTerms.reverse().join(' + ') + ` = ${decimalVal}`;
    }
  }
}

function newBinaryChallenge() {
  playClickSound();
  const pool = [13, 25, 42, 65, 77, 100, 128, 150, 192, 255];
  const nextTarget = pool[Math.floor(Math.random() * pool.length)];
  binaryTargetNumber = nextTarget;
  const targetEl = document.getElementById('binaryChallengeTarget');
  if (targetEl) targetEl.textContent = binaryTargetNumber;

  const resEl = document.getElementById('binaryQuestResult');
  if (resEl) resEl.classList.add('hidden');
}

function checkBinaryQuest() {
  let decimalVal = 0;
  for (let i = 0; i < 8; i++) {
    if (bitStates[i] === 1) decimalVal += bitWeights[i];
  }

  const resEl = document.getElementById('binaryQuestResult');
  if (!resEl) return;

  if (decimalVal === binaryTargetNumber) {
    resEl.className = 'text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500 text-white block animate-bounce';
    resEl.innerHTML = `<i class="fa-solid fa-check-circle mr-1"></i> HEBAT! Target ${binaryTargetNumber} tercapai!`;
    playFanfareSound();
    triggerConfetti();
  } else {
    resEl.classList.add('hidden');
  }
}

// ================= LAB 3: SIMULATOR SIKLUS IPOS =================
let isIPOSRunning = false;

function startIPOSSimulation() {
  if (isIPOSRunning) return;
  isIPOSRunning = true;
  playClickSound();

  const scenario = document.getElementById('iposScenario').value;
  const btn = document.getElementById('startIposBtn');
  const log = document.getElementById('iposLogStatus');

  btn.disabled = true;
  btn.classList.add('opacity-50');

  // Customize Scenario Text
  const inText = document.getElementById('iposInputText');
  const prText = document.getElementById('iposProcessText');
  const outText = document.getElementById('iposOutputText');
  const stText = document.getElementById('iposStorageText');

  if (scenario === 'math') {
    inText.textContent = 'Keyboard: Mengetik "7 + 5"';
    prText.textContent = 'CU mengarahkan, ALU hitung: 7 + 5 = 12';
    outText.textContent = 'Monitor: Menampilkan angka 12';
    stText.textContent = 'Storage: Hasil 12 disimpan di RAM/File';
  } else if (scenario === 'text') {
    inText.textContent = 'Keyboard: Mengetik "Halo Informatika"';
    prText.textContent = 'CPU mengodekan huruf ke deretan biner ASCII';
    outText.textContent = 'Monitor: Huruf muncul di dokumen Word';
    stText.textContent = 'SSD: Disimpan jadi file dokumen.docx';
  } else {
    inText.textContent = 'Mouse: Klik ganda file foto';
    prText.textContent = 'CPU membaca piksel RGB dari memori';
    outText.textContent = 'Monitor: Foto tampil jelas di layar';
    stText.textContent = 'SSD: Cache foto di-load dengan cepat';
  }

  // Reset highlight
  document.querySelectorAll('.ipos-node').forEach(el => el.classList.remove('active-stage'));

  // Animation Steps
  // Step 1: Input (t = 0)
  highlightStage(1);
  log.textContent = '[Tahap 1: INPUT] Sinyal data dimasukkan melalui perangkat masukan.';
  playTone(400, 'sine', 0.15);

  setTimeout(() => {
    // Step 2: Process (t = 1200ms)
    highlightStage(2);
    log.textContent = '[Tahap 2: PROCESS] CPU (CU & ALU) mengambil data (Fetch) dan menghitung instruksi (Execute).';
    playTone(600, 'triangle', 0.15);
  }, 1200);

  setTimeout(() => {
    // Step 3: Output (t = 2400ms)
    highlightStage(3);
    log.textContent = '[Tahap 3: OUTPUT] Hasil olahan dikirim ke monitor untuk dilihat oleh manusia.';
    playTone(800, 'sine', 0.15);
  }, 2400);

  setTimeout(() => {
    // Step 4: Storage (t = 3600ms)
    highlightStage(4);
    log.textContent = '[Tahap 4: STORAGE] Data disimpan ke penyimpanan sekunder (SSD/HDD) secara permanen.';
    playTone(523.25, 'sine', 0.2);
  }, 3600);

  setTimeout(() => {
    // Finish (t = 4800ms)
    document.querySelectorAll('.ipos-node').forEach(el => el.classList.remove('active-stage'));
    log.textContent = 'Siklus IPOS selesai secara sempurna dalam hitungan milidetik di komputer nyata!';
    btn.disabled = false;
    btn.classList.remove('opacity-50');
    isIPOSRunning = false;
    playCorrectSound();
  }, 4800);
}

function highlightStage(stageNum) {
  document.querySelectorAll('.ipos-node').forEach(el => el.classList.remove('active-stage'));
  const stage = document.getElementById(`ipos-stage-${stageNum}`);
  if (stage) stage.classList.add('active-stage');
}

// ================= KUIS EVALUASI 1 LEMBAR (10 SOAL ESSENTIAL KELAS 8 BAB 4) =================
// Kunci jawaban tetap (tidak diacak) sesuai formula guru:
// 1:A, 2:C, 3:A, 4:B, 5:C, 6:D, 7:B, 8:B, 9:A, 10:D
//
// Struktur tiap soal: options[0]=A, options[1]=B, options[2]=C, options[3]=D
// Indeks correctLetter merujuk pada huruf kunci jawaban yang sudah ditetapkan.
const RAW_QUIZ_QUESTIONS = [
  {
    // Soal 1 — Kunci: A
    id: 1,
    category: 'Tiga Pilar Komputer',
    question: 'Sistem komputer terdiri atas tiga komponen utama yang saling berinteraksi, yaitu...',
    options: [
      'Hardware, Software, dan Brainware',  // A ← KUNCI
      'Monitor, Keyboard, dan Mouse',       // B
      'Windows, Linux, dan Microsoft Word', // C
      'CPU, RAM, dan Harddisk'              // D
    ],
    correctLetter: 'A',
    correctAnswer: 'Hardware, Software, dan Brainware',
    explanation: 'Tiga pilar dasar sistem komputer adalah Hardware (perangkat keras fisik), Software (perangkat lunak/aplikasi), dan Brainware (manusia/pengguna).'
  },
  {
    // Soal 2 — Kunci: C
    id: 2,
    category: 'Hardware - Input Device',
    question: 'Perangkat keras yang digunakan untuk memasukkan huruf, angka, dan teks perintah ke dalam komputer adalah...',
    options: [
      'Monitor',   // A
      'Speaker',   // B
      'Keyboard',  // C ← KUNCI
      'Printer'    // D
    ],
    correctLetter: 'C',
    correctAnswer: 'Keyboard',
    explanation: 'Keyboard adalah perangkat masukan (input) utama untuk mengetik karakter huruf, angka, dan simbol perintah.'
  },
  {
    // Soal 3 — Kunci: A
    id: 3,
    category: 'Hardware - Processing Device',
    question: 'Komponen yang sering disebut sebagai "otak komputer" karena bertugas memproses dan mengendalikan semua instruksi adalah...',
    options: [
      'CPU (Processor)', // A ← KUNCI
      'Power Supply',    // B
      'Casing Komputer', // C
      'Kabel VGA'        // D
    ],
    correctLetter: 'A',
    correctAnswer: 'CPU (Processor)',
    explanation: 'CPU (Central Processing Unit) atau processor adalah otak komputer yang memproses seluruh data dan kalkulasi komputasi.'
  },
  {
    // Soal 4 — Kunci: B
    id: 4,
    category: 'Hardware - Memori',
    question: 'Memori komputer yang bersifat sementara (data di dalamnya akan hilang saat komputer dimatikan) adalah...',
    options: [
      'Harddisk Drive (HDD)',       // A
      'RAM (Random Access Memory)', // B ← KUNCI
      'Flashdisk USB',              // C
      'Solid State Drive (SSD)'     // D
    ],
    correctLetter: 'B',
    correctAnswer: 'RAM (Random Access Memory)',
    explanation: 'RAM bersifat volatile, artinya data yang sedang berjalan hanya tersimpan sementara selama ada aliran daya listrik.'
  },
  {
    // Soal 5 — Kunci: C
    id: 5,
    category: 'Hardware - Storage Device',
    question: 'Perangkat keras yang digunakan untuk menyimpan dokumen, foto, dan program secara permanen adalah...',
    options: [
      'Monitor Layar',  // A
      'Speaker Audio',  // B
      'Harddisk / SSD', // C ← KUNCI
      'Kamera Webcam'   // D
    ],
    correctLetter: 'C',
    correctAnswer: 'Harddisk / SSD',
    explanation: 'Harddisk (HDD) dan Solid State Drive (SSD) merupakan media penyimpanan sekunder permanen (non-volatile) pada komputer.'
  },
  {
    // Soal 6 — Kunci: D
    id: 6,
    category: 'Hardware - Output Device',
    question: 'Perangkat keluaran (output) yang berfungsi menampilkan gambar, teks, dan video secara visual kepada pengguna adalah...',
    options: [
      'Mouse',    // A
      'Mikrofon', // B
      'Scanner',  // C
      'Monitor'   // D ← KUNCI
    ],
    correctLetter: 'D',
    correctAnswer: 'Monitor',
    explanation: 'Monitor menampilkan antarmuka visual grafik dan hasil olahan sistem komputer secara langsung ke layar pandang pengguna.'
  },
  {
    // Soal 7 — Kunci: B
    id: 7,
    category: 'Software - Sistem Operasi',
    question: 'Contoh perangkat lunak sistem operasi yang mengelola kerja komputer atau smartphone adalah...',
    options: [
      'Microsoft Word dan Excel',    // A
      'Windows, Linux, dan Android', // B ← KUNCI
      'Google Chrome dan Safari',    // C
      'CapCut dan Photoshop'         // D
    ],
    correctLetter: 'B',
    correctAnswer: 'Windows, Linux, dan Android',
    explanation: 'Windows, Linux, MacOS, dan Android merupakan contoh Sistem Operasi (Operating System) yang menjembatani hardware dan aplikasi.'
  },
  {
    // Soal 8 — Kunci: B
    id: 8,
    category: 'Brainware (Pengguna)',
    question: 'Seseorang yang memiliki keahlian menulis kode perintah program komputer dengan bahasa pemrograman disebut...',
    options: [
      'Teknisi Listrik',  // A
      'Programmer',       // B ← KUNCI
      'Operator Fotokopi',// C
      'Kurir Paket'       // D
    ],
    correctLetter: 'B',
    correctAnswer: 'Programmer',
    explanation: 'Programmer adalah unsur brainware yang merancang, menulis kode, dan mengembangkan perangkat lunak (software).'
  },
  {
    // Soal 9 — Kunci: A
    id: 9,
    category: 'Sistem Bilangan Biner',
    question: 'Sistem bilangan biner merupakan bahasa mesin komputer yang hanya terdiri atas dua angka, yaitu...',
    options: [
      '0 dan 1',    // A ← KUNCI
      '1 dan 2',    // B
      '0 sampai 9', // C
      'A dan B'     // D
    ],
    correctLetter: 'A',
    correctAnswer: '0 dan 1',
    explanation: 'Sistem bilangan biner (basis 2) hanya mengenal angka 0 (sinyal off/mati) dan 1 (sinyal on/hidup).'
  },
  {
    // Soal 10 — Kunci: D
    id: 10,
    category: 'Siklus Kerja Komputer',
    question: 'Tahapan dasar pemrosesan data komputer yang disingkat IPOS adalah urutan dari...',
    options: [
      'Internet ➔ Program ➔ Online ➔ Server',  // A
      'Install ➔ Play ➔ Open ➔ Save',          // B
      'Internal ➔ Public ➔ Offline ➔ Setup',   // C
      'Input ➔ Process ➔ Output ➔ Storage'     // D ← KUNCI
    ],
    correctLetter: 'D',
    correctAnswer: 'Input ➔ Process ➔ Output ➔ Storage',
    explanation: 'Siklus IPOS merupakan alur pengolahan data: Input (masukan) ➔ Process (pemrosesan) ➔ Output (keluaran) ➔ Storage (penyimpanan).'
  }
];

// State Kuis 1 Lembar
let activeSheetQuestions = []; // Berisi 10 soal dengan opsi yang sudah teracak A, B, C, D
let studentSelectedAnswers = {}; // Map nomor soal (1-10) => huruf pilihan ('A'/'B'/'C'/'D')
const TEACHER_RESET_PIN = '8888';

// Helper Acak Array (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Inisialisasi Tampilan Kuis (Cek Device Lock)
function initQuizView() {
  const isSubmitted = localStorage.getItem('sk8_quiz_submitted') === 'true';

  const lockedView = document.getElementById('quizLockedView');
  const sheetView = document.getElementById('quizSheetView');
  const resultView = document.getElementById('quizResultView');

  if (isSubmitted) {
    // Tampilkan layar terkunci (1 device 1x submit)
    if (sheetView) sheetView.classList.add('hidden');
    if (resultView) resultView.classList.add('hidden');
    if (lockedView) {
      lockedView.classList.remove('hidden');
      populateLockedViewData();
    }
  } else {
    // Tampilkan lembar form kuis
    if (lockedView) lockedView.classList.add('hidden');
    if (resultView) resultView.classList.add('hidden');
    if (sheetView) {
      sheetView.classList.remove('hidden');
      if (activeSheetQuestions.length === 0) {
        renderQuizSheet();
      }
    }
  }
}

// Mengisi data ringkasan submission pada tampilan layar terkunci
function populateLockedViewData() {
  try {
    const rawData = localStorage.getItem('sk8_quiz_data');
    if (!rawData) return;
    const data = JSON.parse(rawData);

    const nameEl = document.getElementById('lockedStudentName');
    const classEl = document.getElementById('lockedStudentClass');
    const timeEl = document.getElementById('lockedSubmitTime');
    const scoreEl = document.getElementById('lockedScoreDisplay');

    if (nameEl) nameEl.textContent = data.nama || 'Siswa';
    if (classEl) classEl.textContent = `${data.kelas || '-'} • No. Absen ${data.no_absen || '-'}`;
    if (timeEl) timeEl.textContent = data.timestamp || '-';
    if (scoreEl) scoreEl.textContent = `${data.nilai || 0} / 100`;
  } catch (err) {
    console.error('Gagal membaca data kuis tersimpan:', err);
  }
}

// Render 10 Soal dalam 1 Lembar Penuh dengan Pilihan Teracak (A, B, C, D)
function renderQuizSheet() {
  const container = document.getElementById('quizQuestionsContainer');
  if (!container) return;
  container.innerHTML = '';
  studentSelectedAnswers = {};

  const letters = ['A', 'B', 'C', 'D'];

  // Gunakan urutan pilihan yang sudah ditetapkan guru (tidak diacak)
  // Kunci jawaban sudah tertanam di field correctLetter & options tiap soal
  activeSheetQuestions = RAW_QUIZ_QUESTIONS.map((q, idx) => {
    return {
      index: idx + 1,
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,              // Urutan A/B/C/D sudah tetap sesuai formula
      correctLetter: q.correctLetter,  // Huruf kunci sesuai penetapan guru
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    };
  });

  // Render kartu soal berurutan ke bawah dalam 1 lembar
  activeSheetQuestions.forEach(q => {
    const card = document.createElement('div');
    card.id = `quizCard-${q.index}`;
    card.className = 'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 transition-all';

    let optionsHtml = '';
    letters.forEach((letter, optIdx) => {
      const optText = q.options[optIdx];
      optionsHtml += `
        <div 
          onclick="selectSheetOption(${q.index}, '${letter}')" 
          id="qOpt-${q.index}-${letter}"
          class="quiz-sheet-option p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-start gap-3 select-none">
          <div class="option-badge w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center flex-shrink-0 text-xs transition-colors">
            ${letter}
          </div>
          <div class="pt-0.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex-grow leading-relaxed">
            ${optText}
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
            ${q.index}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            ${q.category}
          </span>
        </div>
        <span id="badgeStatus-${q.index}" class="text-[11px] font-semibold text-slate-400">
          Belum dijawab
        </span>
      </div>

      <div class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
        ${q.question}
      </div>

      <div class="grid grid-cols-1 gap-2.5 pt-1">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });

  updateQuizProgressText();
}

// Memilih Pilihan Jawaban pada Satu Lembar Kuis
function selectSheetOption(questionIndex, selectedLetter) {
  playClickSound();
  studentSelectedAnswers[questionIndex] = selectedLetter;

  // Hapus seleksi aktif sebelumnya untuk nomor soal ini
  const letters = ['A', 'B', 'C', 'D'];
  letters.forEach(l => {
    const optEl = document.getElementById(`qOpt-${questionIndex}-${l}`);
    if (optEl) {
      optEl.classList.remove('selected');
    }
  });

  // Berikan kelas selected pada opsi yang baru diklik
  const activeOpt = document.getElementById(`qOpt-${questionIndex}-${selectedLetter}`);
  if (activeOpt) {
    activeOpt.classList.add('selected');
  }

  // Update status badge soal
  const badge = document.getElementById(`badgeStatus-${questionIndex}`);
  if (badge) {
    badge.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-bold"><i class="fa-solid fa-check mr-1"></i>Pilihan (${selectedLetter})</span>`;
  }

  // Hilangkan pesan error jika ada
  hideQuizValidationWarning();

  // Update indikator progres
  updateQuizProgressText();
}

// Update teks jumlah soal yang sudah terjawab
function updateQuizProgressText() {
  const answeredCount = Object.keys(studentSelectedAnswers).length;
  const total = activeSheetQuestions.length || 10;
  const progressEl = document.getElementById('quizProgressText');
  if (progressEl) {
    progressEl.textContent = `${answeredCount} dari ${total} Soal Terjawab`;
    if (answeredCount === total) {
      progressEl.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>Seluruh ${total} Soal Sudah Terjawab!</span>`;
    }
  }
}

// Scroll halus ke tombol kumpulkan
function scrollToSubmitBtn() {
  const anchor = document.getElementById('submitAnchor');
  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Menampilkan pesan validasi
function showQuizValidationWarning(msg) {
  const warn = document.getElementById('quizValidationWarning');
  const text = document.getElementById('quizWarningMessage');
  if (warn && text) {
    text.textContent = msg;
    warn.classList.remove('hidden');
    warn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  playWrongSound();
}

function hideQuizValidationWarning() {
  const warn = document.getElementById('quizValidationWarning');
  if (warn) warn.classList.add('hidden');
}

// ================= SUBMIT KUIS 1 LEMBAR =================
function submitQuizSheet() {
  playClickSound();

  // 1. Validasi Identitas Siswa
  const nameInput = document.getElementById('quizStudentName');
  const classInput = document.getElementById('quizStudentClass');
  const numberInput = document.getElementById('quizStudentNumber');

  const studentName = nameInput ? nameInput.value.trim() : '';
  const studentClass = classInput ? classInput.value.trim() : '';
  const studentNumber = numberInput ? numberInput.value.trim() : '';

  if (!studentName) {
    showQuizValidationWarning('Silakan isi Nama Lengkap terlebih dahulu!');
    nameInput?.focus();
    return;
  }

  if (!studentClass) {
    showQuizValidationWarning('Silakan pilih Kelas kamu!');
    classInput?.focus();
    return;
  }

  if (!studentNumber || isNaN(studentNumber) || Number(studentNumber) < 1) {
    showQuizValidationWarning('Silakan masukkan Nomor Absen yang valid (contoh: 1 - 40)!');
    numberInput?.focus();
    return;
  }

  // 2. Validasi Seluruh 10 Soal Harus Terjawab
  const totalQuestions = activeSheetQuestions.length;
  const unanswered = [];
  for (let i = 1; i <= totalQuestions; i++) {
    if (!studentSelectedAnswers[i]) {
      unanswered.push(i);
    }
  }

  if (unanswered.length > 0) {
    showQuizValidationWarning(`Kamu belum menjawab soal nomor: ${unanswered.join(', ')}. Harap lengkapi semua soal sebelum mengumpulkan!`);
    const firstUnansweredCard = document.getElementById(`quizCard-${unanswered[0]}`);
    if (firstUnansweredCard) {
      firstUnansweredCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstUnansweredCard.classList.add('ring-2', 'ring-rose-500');
      setTimeout(() => firstUnansweredCard.classList.remove('ring-2', 'ring-rose-500'), 2500);
    }
    return;
  }

  // Konfirmasi sebelum submit permanen
  if (!confirm(`Konfirmasi Pengumpulan Kuis:\nNama: ${studentName}\nKelas: ${studentClass} (No. ${studentNumber})\n\nApakah kamu sudah yakin dengan semua jawabanmu? Perangkat ini hanya dapat mengirim 1 kali!`)) {
    return;
  }

  // 3. Hitung Skor & Siapkan Data
  let correctCount = 0;
  const answerBreakdown = [];
  const keySummaryList = [];

  activeSheetQuestions.forEach(q => {
    const studentChoice = studentSelectedAnswers[q.index];
    const isCorrect = studentChoice === q.correctLetter;
    if (isCorrect) correctCount++;

    keySummaryList.push(`${q.index}:${q.correctLetter}`);
    answerBreakdown.push({
      nomor: q.index,
      soal: q.question,
      kategori: q.category,
      pilihanSiswa: studentChoice,
      kunciJawaban: q.correctLetter,
      teksKunci: q.correctAnswer,
      benar: isCorrect,
      pembahasan: q.explanation
    });
  });

  const finalScore = Math.round((correctCount / totalQuestions) * 100);
  const timestampStr = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Detail String untuk dikirim ke Google Sheet
  const answerKeySummary = keySummaryList.join(', '); // Contoh: 1:A, 2:C, 3:B, ...
  const detailBreakdownString = answerBreakdown
    .map(b => `[No ${b.nomor}: ${b.benar ? 'BENAR' : 'SALAH'} (Siswa: ${b.pilihanSiswa}, Kunci: ${b.kunciJawaban})]`)
    .join(' ');

  // 4. Kunci Device di LocalStorage (1 Device = 1 Kali Submit)
  const submissionRecord = {
    nama: studentName,
    kelas: studentClass,
    no_absen: studentNumber,
    nilai: finalScore,
    benar: correctCount,
    total: totalQuestions,
    timestamp: timestampStr,
    kunci_jawaban: answerKeySummary,
    detail: detailBreakdownString,
    active_questions: activeSheetQuestions,
    student_answers: studentSelectedAnswers
  };

  localStorage.setItem('sk8_quiz_submitted', 'true');
  localStorage.setItem('sk8_quiz_data', JSON.stringify(submissionRecord));
  localStorage.setItem('sk8_student_name', studentName);
  localStorage.setItem('sk8_student_class', studentClass);
  localStorage.setItem('sk8_student_no', studentNumber);

  // 5. Kirimkan Payload ke Google Sheet (Google Apps Script Web App)
  postToGoogleSheet(submissionRecord);

  // 6. Tampilkan Layar Hasil Akhir
  displayQuizResult(submissionRecord);
}

// Mengirimkan Data ke Google Apps Script Web App
function postToGoogleSheet(record) {
  const sheetStatusEl = document.getElementById('resultSheetStatus');
  if (sheetStatusEl) {
    sheetStatusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Menyimpan ke Sheet...';
    sheetStatusEl.className = 'text-xs font-bold text-amber-500 mt-3 flex items-center justify-center gap-1';
  }

  // URL Google Apps Script yang tersimpan atau default
  const savedUrl = localStorage.getItem('sk8_gas_url');

  if (!savedUrl) {
    // Belum disetel oleh guru, data tetap aman tersimpan di localStorage
    if (sheetStatusEl) {
      sheetStatusEl.innerHTML = '<i class="fa-solid fa-circle-info mr-1"></i> Tersimpan Lokal';
      sheetStatusEl.className = 'text-xs font-bold text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-center gap-1';
    }
    return;
  }

  const payload = {
    action: 'submitQuiz',
    nama: record.nama,
    kelas: record.kelas,
    no_absen: record.no_absen,
    nilai: record.nilai,
    benar: record.benar,
    total: record.total,
    timestamp: record.timestamp
  };

  fetch(savedUrl, {
    method: 'POST',
    mode: 'no-cors', // Penting agar CORS Google Script tidak diblokir browser
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    if (sheetStatusEl) {
      sheetStatusEl.innerHTML = '<i class="fa-solid fa-circle-check mr-1 text-emerald-500"></i> Terkirim ke Sheet';
      sheetStatusEl.className = 'text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3 flex items-center justify-center gap-1';
    }
  })
  .catch(err => {
    console.warn('Gagal POST ke Google Apps Script:', err);
    if (sheetStatusEl) {
      sheetStatusEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1 text-amber-500"></i> Tersimpan di Device';
      sheetStatusEl.className = 'text-xs font-bold text-amber-500 mt-3 flex items-center justify-center gap-1';
    }
  });
}

// Menampilkan View Hasil Akhir (View 3)
function displayQuizResult(record) {
  const sheetView = document.getElementById('quizSheetView');
  const lockedView = document.getElementById('quizLockedView');
  const resultView = document.getElementById('quizResultView');

  if (sheetView) sheetView.classList.add('hidden');
  if (lockedView) lockedView.classList.add('hidden');
  if (resultView) resultView.classList.remove('hidden');

  const scoreEl = document.getElementById('resultFinalScore');
  const correctEl = document.getElementById('resultCorrectCount');
  const headingEl = document.getElementById('resultStatusHeading');
  const subtextEl = document.getElementById('resultStatusSubtext');
  const badgeIcon = document.getElementById('resultBadgeIcon');
  const certBtn = document.getElementById('btnOpenCert');

  if (scoreEl) scoreEl.textContent = record.nilai;
  if (correctEl) correctEl.textContent = record.benar;

  if (record.nilai >= 75) {
    if (headingEl) headingEl.textContent = 'Luar Biasa, Kamu Lulus Kompeten!';
    if (subtextEl) subtextEl.textContent = `Selamat kepada ${record.nama} (${record.kelas}), pemahamanmu mengenai Sistem Komputer telah tuntas memenuhi KKM.`;
    if (badgeIcon) {
      badgeIcon.className = 'w-20 h-20 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30';
      badgeIcon.innerHTML = '<i class="fa-solid fa-award"></i>';
    }
    if (certBtn) certBtn.classList.remove('hidden');
    playFanfareSound();
    triggerConfetti();
  } else {
    if (headingEl) headingEl.textContent = 'Tetap Semangat, Nilai Belum Mencapai KKM';
    if (subtextEl) subtextEl.textContent = `Nilai KKM adalah 75. Pelajari kembali materi sistem komputer melalui lembar modul dan pembahasan di bawah ini.`;
    if (badgeIcon) {
      badgeIcon.className = 'w-20 h-20 mx-auto rounded-3xl bg-amber-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30';
      badgeIcon.innerHTML = '<i class="fa-solid fa-book-open-reader"></i>';
    }
    if (certBtn) certBtn.classList.add('hidden');
    playWrongSound();
  }

  // Bangun Lembar Pembahasan 10 Soal
  buildQuizSheetReview(record);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Membuka Tampilan Hasil Sebelumnya dari Layar Terkunci
function showPreviousResultView() {
  try {
    const rawData = localStorage.getItem('sk8_quiz_data');
    if (rawData) {
      const data = JSON.parse(rawData);
      displayQuizResult(data);
    }
  } catch (err) {
    console.error('Gagal menampilkan hasil:', err);
  }
}

// Bangun Lembar Pembahasan 10 Soal Secara Rinci
function buildQuizSheetReview(record) {
  const container = document.getElementById('quizReviewList');
  if (!container) return;
  container.innerHTML = '';

  const questions = record.active_questions || activeSheetQuestions;
  const answers = record.student_answers || studentSelectedAnswers;

  questions.forEach(q => {
    const studentChoice = answers[q.index];
    const isCorrect = studentChoice === q.correctLetter;

    const row = document.createElement('div');
    row.className = `p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-2 ${
      isCorrect
        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
        : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
    }`;

    // Cari teks jawaban siswa
    const letters = ['A', 'B', 'C', 'D'];
    const studentIdx = letters.indexOf(studentChoice);
    const studentChoiceText = studentIdx >= 0 ? q.options[studentIdx] : '-';

    row.innerHTML = `
      <div class="flex items-center justify-between font-bold">
        <span class="text-slate-800 dark:text-slate-200">Soal ${q.index} • ${q.category}</span>
        <span class="${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} font-extrabold flex items-center gap-1">
          ${isCorrect ? '<i class="fa-solid fa-circle-check"></i> Jawabanmu Benar' : '<i class="fa-solid fa-circle-xmark"></i> Kurang Tepat'}
        </span>
      </div>
      
      <p class="font-bold text-slate-800 dark:text-slate-100">${q.question}</p>
      
      <div class="space-y-1 text-xs pt-1">
        <div class="text-slate-600 dark:text-slate-300">
          Pilihan Kamu: <strong class="${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">(${studentChoice}) ${studentChoiceText}</strong>
        </div>
        ${!isCorrect ? `
          <div class="text-emerald-600 dark:text-emerald-400 font-bold">
            Kunci Jawaban yang Benar: (${q.correctLetter}) ${q.correctAnswer}
          </div>
        ` : ''}
      </div>

      <div class="text-slate-600 dark:text-slate-400 text-xs pt-2 border-t border-slate-200 dark:border-slate-700/80 leading-relaxed">
        <strong>Pembahasan:</strong> ${q.explanation}
      </div>
    `;

    container.appendChild(row);
  });
}

function toggleReviewSection() {
  playClickSound();
  const el = document.getElementById('quizReviewSection');
  if (el) el.classList.toggle('hidden');
}

// ================= RESET PERANGKAT (KHUSUS GURU) =================
function promptTeacherReset() {
  playClickSound();
  const inputPin = prompt('PENGATURAN GURU / PENGAWAS:\nMasukkan PIN Guru untuk mereset batasan 1 perangkat:', '');
  if (inputPin === null) return;

  if (inputPin.trim() === TEACHER_RESET_PIN) {
    localStorage.removeItem('sk8_quiz_submitted');
    localStorage.removeItem('sk8_quiz_data');
    alert('Akses perangkat berhasil di-reset! Siswa baru sekarang dapat mengerjakan kuis di perangkat ini.');
    activeSheetQuestions = [];
    studentSelectedAnswers = {};
    initQuizView();
  } else {
    alert('PIN Guru yang dimasukkan salah! Akses ditolak.');
    playWrongSound();
  }
}

// ================= PENGATURAN GOOGLE SHEET (MODAL GURU) =================
function openTeacherConfigModal() {
  playClickSound();
  const modal = document.getElementById('teacherConfigModal');
  const urlInput = document.getElementById('teacherGasUrlInput');
  const savedUrl = localStorage.getItem('sk8_gas_url') || '';
  if (urlInput) urlInput.value = savedUrl;
  if (modal) modal.classList.remove('hidden');
}

function closeTeacherConfigModal() {
  playClickSound();
  const modal = document.getElementById('teacherConfigModal');
  if (modal) modal.classList.add('hidden');
}

function saveTeacherGasUrl() {
  playClickSound();
  const urlInput = document.getElementById('teacherGasUrlInput');
  if (!urlInput) return;

  const url = urlInput.value.trim();
  if (url && !url.startsWith('https://script.google.com/')) {
    alert('Peringatan: URL harus berawalan "https://script.google.com/.../exec" dari Google Apps Script Web App!');
    return;
  }

  localStorage.setItem('sk8_gas_url', url);
  alert(url ? 'URL Google Apps Script berhasil disimpan! Kuis kini terhubung ke spreadsheet Anda.' : 'URL dikosongkan.');
  closeTeacherConfigModal();
}

function copyGasCodeToClipboard() {
  playClickSound();
  const sampleCode = `// KODE GOOGLE APPS SCRIPT UNTUK REKAP KUIS KELAS 8 BAB 4
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Waktu Pengiriman", "Nama Siswa", "Kelas", "No Absen", "Nilai", "Jumlah Benar"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff").setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp || new Date(),
      data.nama || "",
      data.kelas || "",
      data.no_absen || "",
      data.nilai || 0,
      (data.benar || 0) + "/" + (data.total || 10)
    ]);
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 3, 1, 4).setHorizontalAlignment("center");
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  navigator.clipboard.writeText(sampleCode)
    .then(() => {
      const btn = document.getElementById('btnCopyGasCode');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Tersalin ke Clipboard!';
      setTimeout(() => {
        if (btn) btn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i> Salin Kode Google Apps Script';
      }, 2500);
    })
    .catch(() => {
      alert('Gagal menyalin kode otomatis. Anda dapat membukanya langsung di file google_apps_script.js.');
    });
}

// ================= SERTIFIKAT KELULUSAN =================
function showCertificateModal() {
  playClickSound();
  let studentName = 'Siswa Berprestasi';
  let studentClass = '8-A';
  let studentNo = '01';
  let score = '100';

  try {
    const rawData = localStorage.getItem('sk8_quiz_data');
    if (rawData) {
      const data = JSON.parse(rawData);
      studentName = data.nama || studentName;
      studentClass = data.kelas || studentClass;
      studentNo = data.no_absen || studentNo;
      score = data.nilai !== undefined ? data.nilai : score;
    } else {
      studentName = localStorage.getItem('sk8_student_name') || studentName;
      studentClass = localStorage.getItem('sk8_student_class') || studentClass;
      studentNo = localStorage.getItem('sk8_student_no') || studentNo;
    }
  } catch (e) {
    console.error(e);
  }

  const nameEl = document.getElementById('certStudentName');
  if (nameEl) nameEl.textContent = studentName;

  const classNoEl = document.getElementById('certStudentClassNo');
  if (classNoEl) classNoEl.textContent = `Kelas ${studentClass} • No. Absen ${studentNo}`;

  const scoreEl = document.getElementById('certScoreDisplay');
  if (scoreEl) scoreEl.textContent = `${score} / 100`;

  const dateEl = document.getElementById('certDateDisplay');
  if (dateEl) {
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const modal = document.getElementById('certificateModal');
  if (modal) modal.classList.remove('hidden');
  triggerConfetti();
}

function closeCertificateModal() {
  playClickSound();
  const modal = document.getElementById('certificateModal');
  if (modal) modal.classList.add('hidden');
}

function printCertificate() {
  window.print();
}

function printSummary() {
  playClickSound();
  window.print();
}

// ================= GLOSARIUM ISTILAH =================
const GLOSSARY_ITEMS = [
  { term: 'ALU (Arithmetic Logic Unit)', cat: 'Hardware', desc: 'Bagian pemroses di dalam CPU yang bertugas melakukan operasi matematika (penjumlahan, pengurangan) dan logika komputer.' },
  { term: 'BIOS (Basic Input Output System)', cat: 'Firmware', desc: 'Perangkat lunak dasar yang tertanam pada chip ROM motherboard untuk menginisialisasi hardware saat proses booting.' },
  { term: 'Bit (Binary Digit)', cat: 'Representasi', desc: 'Unit terkecil dari data digital dalam komputasi yang hanya bernilai 0 (mati) atau 1 (nyala).' },
  { term: 'Byte (Bita)', cat: 'Representasi', desc: 'Kumpulan 8 bit berturutan yang digunakan untuk mewakili satu karakter huruf, angka, atau simbol teks.' },
  { term: 'Cache Memory', cat: 'Hardware', desc: 'Memori berkecepatan super tinggi yang berada dekat inti prosesor untuk mempercepat akses data yang sering digunakan.' },
  { term: 'CLI (Command Line Interface)', cat: 'Software', desc: 'Antarmuka pengguna berbasis teks perintah tanpa tampilan grafis jendela atau ikon.' },
  { term: 'Control Unit (CU)', cat: 'Hardware', desc: 'Bagian CPU yang mengatur, mengendalikan, dan mengarahkan lalu lintas data serta eksekusi instruksi di seluruh komputer.' },
  { term: 'Fetch-Decode-Execute', cat: 'Proses', desc: 'Siklus instruksi mesin CPU dari mengambil instruksi dari RAM, menerjemahkan, mengeksekusi operasi, hingga menyimpan hasil.' },
  { term: 'Flashdisk USB', cat: 'Storage', desc: 'Media penyimpanan portabel berbasis teknologi flash memory yang dihubungkan melalui port Universal Serial Bus (USB).' },
  { term: 'GUI (Graphical User Interface)', cat: 'Software', desc: 'Antarmuka pengguna grafis berbasis ikon tombol, jendela visual, dan kursor mouse yang mudah digunakan.' },
  { term: 'Harddisk Drive (HDD)', cat: 'Storage', desc: 'Media penyimpanan sekunder non-volatile berbasis piringan magnetik yang berputar dengan motor mekanik.' },
  { term: 'Motherboard', cat: 'Hardware', desc: 'Papan sirkuit cetak utama tempat terhubungnya processor, memori RAM, kartu grafis, dan seluruh perangkat komputer.' },
  { term: 'Operating System (OS)', cat: 'Software', desc: 'Perangkat lunak pengendali utama yang menjembatani hubungan antara hardware, software aplikasi, dan pengguna.' },
  { term: 'RAM (Random Access Memory)', cat: 'Memory', desc: 'Memori penyimpanan aktif berkecepatan tinggi yang bersifat volatile (hilang saat listrik mati).' },
  { term: 'Register', cat: 'Hardware', desc: 'Lokasi penyimpanan data terkecil dan tercepat di dalam prosesor untuk menampung data kalkulasi instan.' },
  { term: 'ROM (Read Only Memory)', cat: 'Memory', desc: 'Memori penyimpanan tetap (non-volatile) yang hanya bisa dibaca dan berisi kode booting awal.' },
  { term: 'Siklus IPOS', cat: 'Konsep', desc: 'Model kerja pemrosesan data komputer: Input ➔ Process ➔ Output ➔ Storage.' },
  { term: 'SSD (Solid State Drive)', cat: 'Storage', desc: 'Penyimpanan generasi baru tanpa komponen bergerak, menggunakan chip memori silikon berkecepatan tinggi.' }
];

function initGlossary() {
  renderGlossary(GLOSSARY_ITEMS);
}

function renderGlossary(items) {
  const grid = document.getElementById('glossaryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-8 text-slate-400 text-xs">
        <i class="fa-solid fa-circle-exclamation text-xl mb-2"></i>
        <div>Istilah tidak ditemukan. Coba ketik kata kunci lain.</div>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all space-y-2';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
          ${item.cat}
        </span>
      </div>
      <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100">${item.term}</h4>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${item.desc}</p>
    `;
    grid.appendChild(card);
  });
}

function filterGlossary() {
  const query = (document.getElementById('glossarySearch').value || '').toLowerCase().trim();
  const filtered = GLOSSARY_ITEMS.filter(item => {
    return item.term.toLowerCase().includes(query) ||
           item.desc.toLowerCase().includes(query) ||
           item.cat.toLowerCase().includes(query);
  });
  renderGlossary(filtered);
}

// ================= POPUP DETAIL MATERI =================
function openMateriPopup(title, category, type, description, localImg, fallbackImg, examples) {
  playClickSound();
  const modal = document.getElementById('materiPopupModal');
  const img = document.getElementById('popupImg');
  const titleEl = document.getElementById('popupTitle');
  const catEl = document.getElementById('popupCategory');
  const descEl = document.getElementById('popupDesc');
  const exEl = document.getElementById('popupExamples');

  if (img) {
    img.src = localImg || fallbackImg;
    img.onerror = () => {
      img.src = fallbackImg;
      img.onerror = null;
    };
    img.alt = title;
  }
  if (titleEl) titleEl.textContent = title;
  if (catEl) {
    catEl.textContent = category;
    const colorMap = {
      input: 'bg-indigo-600',
      process: 'bg-cyan-600',
      output: 'bg-emerald-600',
      storage: 'bg-amber-600',
      software: 'bg-purple-600'
    };
    catEl.className = `px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${colorMap[type] || 'bg-indigo-600'}`;
  }
  if (descEl) descEl.textContent = description;
  if (exEl) exEl.textContent = examples;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeMateriPopup(event) {
  if (event && event.target !== document.getElementById('materiPopupModal')) return;
  playClickSound();
  const modal = document.getElementById('materiPopupModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Close popup with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('materiPopupModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeMateriPopup();
    }
  }
});

// ================= CONFETTI HELPER =================
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ================= INITIALIZATION ON LOAD =================
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSortGame();
  updateBinaryUI();
  initGlossary();
  initQuizView();

  // Load saved student identity if any
  const savedName = localStorage.getItem('sk8_student_name');
  if (savedName) {
    const nameInput = document.getElementById('quizStudentName');
    if (nameInput) nameInput.value = savedName;
  }
  const savedClass = localStorage.getItem('sk8_student_class');
  if (savedClass) {
    const classInput = document.getElementById('quizStudentClass');
    if (classInput) classInput.value = savedClass;
  }
  const savedNo = localStorage.getItem('sk8_student_no');
  if (savedNo) {
    const noInput = document.getElementById('quizStudentNumber');
    if (noInput) noInput.value = savedNo;
  }
});
