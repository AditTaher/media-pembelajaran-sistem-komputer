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

// ================= KUIS EVALUASI (15 SOAL INFORMATIKA KELAS 8 BAB 4) =================
const QUIZ_QUESTIONS = [
  {
    category: 'Tiga Pilar Komputer',
    question: 'Sistem komputer tersusun atas tiga komponen utama yang saling berinteraksi. Ketiga komponen tersebut adalah...',
    options: [
      'Hardware, Software, dan Brainware',
      'CPU, Monitor, dan Keyboard',
      'Windows, Linux, dan MacOS',
      'RAM, Harddisk, dan Processor'
    ],
    correct: 0,
    explanation: 'Sistem komputer terdiri atas 3 pilar: Hardware (perangkat keras), Software (perangkat lunak), dan Brainware (manusia/pengguna). Ketiganya wajib ada agar sistem bekerja.'
  },
  {
    category: 'Hardware - Input',
    question: 'Manakah di bawah ini yang seluruhnya merupakan perangkat masukan (Input Device)?',
    options: [
      'Keyboard, Mouse, dan Barcode Scanner',
      'Monitor, Printer, dan Speaker',
      'CPU, RAM, dan Motherboard',
      'SSD, Flashdisk, dan Harddisk'
    ],
    correct: 0,
    explanation: 'Keyboard, Mouse, dan Barcode Scanner bertugas memasukkan data dari luar ke dalam sistem komputer.'
  },
  {
    category: 'Hardware - Processing',
    question: 'Komponen CPU yang bertanggung jawab langsung untuk melakukan perhitungan matematika dan perbandingan logika adalah...',
    options: [
      'ALU (Arithmetic Logic Unit)',
      'CU (Control Unit)',
      'Register',
      'Motherboard'
    ],
    correct: 0,
    explanation: 'ALU (Arithmetic Logic Unit) adalah bagian inti CPU yang mengeksekusi operasi aritmetika (+, -, *, /) dan logika (AND, OR, NOT).'
  },
  {
    category: 'Hardware - Memory',
    question: 'Memori komputer yang bersifat volatile (data di dalamnya akan hilang seketika saat arus listrik padam) adalah...',
    options: [
      'RAM (Random Access Memory)',
      'ROM (Read Only Memory)',
      'SSD (Solid State Drive)',
      'Harddisk Drive (HDD)'
    ],
    correct: 0,
    explanation: 'RAM bersifat volatile karena hanya menyimpan data sementara dari aplikasi yang sedang berjalan saat ada daya listrik.'
  },
  {
    category: 'Hardware - Storage',
    question: 'Kelebihan utama SSD (Solid State Drive) dibandingkan dengan Harddisk konvensional (HDD) adalah...',
    options: [
      'Kecepatan baca-tulis jauh lebih tinggi dan tahan guncangan karena menggunakan chip memori flash tanpa piringan berputar',
      'Kapasitasnya selalu lebih besar dengan harga yang jauh lebih murah',
      'Bisa bekerja meskipun tidak dihubungkan ke motherboard',
      'Dapat menyimpan data tanpa memerlukan ruang memori'
    ],
    correct: 0,
    explanation: 'SSD menggunakan chip flash tanpa piringan mekanik berputar, menjadikannya jauh lebih cepat, hening, dan tahan guncangan dibandingkan HDD.'
  },
  {
    category: 'Software - Sistem Operasi',
    question: 'Perangkat lunak dasar yang pertama kali dijalankan saat komputer menyala dan bertindak sebagai pengelola sumber daya komputer adalah...',
    options: [
      'Sistem Operasi (Operating System)',
      'Program Aplikasi Pengolah Kata',
      'Antivirus',
      'Web Browser'
    ],
    correct: 0,
    explanation: 'Sistem Operasi (seperti Windows, Linux, Android) adalah platform fundamental yang mengelola hardware dan memfasilitasi jalannya aplikasi.'
  },
  {
    category: 'Software - Interface',
    question: 'Antarmuka komputer yang memungkinkan pengguna berinteraksi melalui ikon visual, menu grafis, tombol, dan kursor mouse disebut...',
    options: [
      'GUI (Graphical User Interface)',
      'CLI (Command Line Interface)',
      'BIOS (Basic Input Output System)',
      'API (Application Programming Interface)'
    ],
    correct: 0,
    explanation: 'GUI (Graphical User Interface) menyajikan elemen grafis ramah pengguna seperti jendela, ikon, dan kursor mouse.'
  },
  {
    category: 'Brainware',
    question: 'Seseorang yang bertugas merancang, menulis kode, dan mengembangkan program aplikasi baru pada komputer disebut...',
    options: [
      'Programmer',
      'Administrator Jaringan',
      'Operator',
      'Teknisi Hardware'
    ],
    correct: 0,
    explanation: 'Programmer adalah profesi brainware yang menciptakan software dengan menulis instruksi kode dalam bahasa pemrograman.'
  },
  {
    category: 'Siklus Mesin CPU',
    question: 'Urutan siklus kerja mesin CPU yang benar ketika menjalankan instruksi instruksi adalah...',
    options: [
      'Fetch ➔ Decode ➔ Execute ➔ Store',
      'Input ➔ Output ➔ Process ➔ Save',
      'Execute ➔ Fetch ➔ Store ➔ Decode',
      'Compile ➔ Run ➔ Debug ➔ Close'
    ],
    correct: 0,
    explanation: 'Siklus mesin CPU (Machine Cycle) terdiri dari 4 tahap: Fetch (mengambil data dari RAM), Decode (menerjemahkan), Execute (eksekusi perhitungan), dan Store (menyimpan hasil).'
  },
  {
    category: 'Siklus IPOS',
    question: 'Dalam siklus pengolahan data IPOS, huruf "O" merupakan singkatan dari...',
    options: [
      'Output (Keluaran)',
      'Operation (Operasi)',
      'Optimization (Optimalisasi)',
      'Overclock (Peningkatan Frekuensi)'
    ],
    correct: 0,
    explanation: 'IPOS adalah singkatan dari Input ➔ Process ➔ Output ➔ Storage.'
  },
  {
    category: 'Bilangan Biner',
    question: 'Sistem bilangan biner merupakan bahasa mesin komputer yang hanya terdiri atas dua angka, yaitu...',
    options: [
      '0 dan 1',
      '1 dan 2',
      '0 sampai 9',
      '0 sampai 7'
    ],
    correct: 0,
    explanation: 'Sistem bilangan biner (basis 2) hanya mengenal angka 0 (keadaan listrik mati/OFF) dan 1 (keadaan listrik nyala/ON).'
  },
  {
    category: 'Satuan Memori',
    question: 'Satu Byte (Bita) terdiri atas sekumpulan bit sebanyak...',
    options: [
      '8 Bit',
      '4 Bit',
      '16 Bit',
      '1.024 Bit'
    ],
    correct: 0,
    explanation: '1 Byte terdiri atas 8 Bit, yang merupakan standar minimum untuk menyimpan satu karakter karakter teks (ASCII).'
  },
  {
    category: 'Konversi Biner',
    question: 'Berapakah nilai desimal dari bilangan biner 8-bit berikut: 00001101?',
    options: [
      '13',
      '11',
      '15',
      '9'
    ],
    correct: 0,
    explanation: 'Perhitungan: (1 × 8) + (1 × 4) + (0 × 2) + (1 × 1) = 8 + 4 + 1 = 13.'
  },
  {
    category: 'Hardware - Output',
    question: 'Perangkat berikut yang menghasilkan salinan fisik di atas kertas (hardcopy) dari hasil olahan data komputer adalah...',
    options: [
      'Printer',
      'Monitor',
      'Proyektor',
      'Speaker'
    ],
    correct: 0,
    explanation: 'Printer mencetak dokumen ke kertas dalam bentuk wujud nyata (hardcopy), sedangkan monitor dan proyektor menampilkan softcopy.'
  },
  {
    category: 'Software - Utilitas',
    question: 'Perangkat lunak yang berfungsi untuk melindungi sistem komputer dari serangan virus, malware, dan ancaman berbahaya lainnya adalah program...',
    options: [
      'Antivirus (Utilitas Keamanan)',
      'Sistem Operasi',
      'Spreadsheet Excel',
      'Compiler Bahasa C'
    ],
    correct: 0,
    explanation: 'Antivirus adalah contoh perangkat lunak utilitas yang memelihara keamanan data dan stabilitas sistem operasi dari serangan malware.'
  }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let quizScore = 0;
let isAnswerSubmitted = false;

function startQuiz() {
  playClickSound();
  const nameInput = document.getElementById('studentNameInput');
  const studentName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Siswa Berprestasi';
  localStorage.setItem('sk8_student_name', studentName);

  currentQuestionIndex = 0;
  userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  quizScore = 0;
  isAnswerSubmitted = false;

  document.getElementById('quizStartScreen').classList.add('hidden');
  document.getElementById('quizResultScreen').classList.add('hidden');
  document.getElementById('quizPlayScreen').classList.remove('hidden');

  renderQuestion();
}

function renderQuestion() {
  isAnswerSubmitted = false;
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  if (!q) return;

  // Counter & Progress
  document.getElementById('quizQuestionNumber').textContent = `Soal ${currentQuestionIndex + 1} dari ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quizScorePreview').textContent = `Skor Sementara: ${quizScore}`;
  const pct = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
  document.getElementById('quizProgressBar').style.width = `${pct}%`;

  // Question Info
  document.getElementById('quizCategoryBadge').textContent = `Kategori: ${q.category}`;
  document.getElementById('quizQuestionText').textContent = q.question;

  // Render Options
  const optContainer = document.getElementById('quizOptionsContainer');
  optContainer.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-left font-semibold text-xs sm:text-sm flex items-start gap-3 transition-all';
    btn.innerHTML = `
      <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
        ${letters[optIdx]}
      </span>
      <span class="flex-grow pt-0.5 text-slate-800 dark:text-slate-200">${optText}</span>
    `;
    btn.onclick = () => selectQuizOption(optIdx);
    optContainer.appendChild(btn);
  });

  // Hide feedback & next button
  const fb = document.getElementById('quizFeedbackBox');
  fb.classList.add('hidden');
  fb.innerHTML = '';
  document.getElementById('quizNextBtn').classList.add('hidden');
}

function selectQuizOption(selectedIdx) {
  if (isAnswerSubmitted) return;
  isAnswerSubmitted = true;

  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  const isCorrect = selectedIdx === q.correct;
  userAnswers[currentQuestionIndex] = {
    selected: selectedIdx,
    isCorrect: isCorrect
  };

  const optionButtons = document.querySelectorAll('.quiz-opt-btn');
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIdx && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  if (isCorrect) {
    quizScore += Math.round(100 / QUIZ_QUESTIONS.length);
    playCorrectSound();
  } else {
    playWrongSound();
  }

  // Show explanation feedback
  const fb = document.getElementById('quizFeedbackBox');
  fb.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-900', 'bg-rose-50', 'border-rose-200', 'text-rose-900', 'dark:bg-emerald-950/40', 'dark:border-emerald-800', 'dark:text-emerald-200', 'dark:bg-rose-950/40', 'dark:border-rose-800', 'dark:text-rose-200');

  if (isCorrect) {
    fb.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-900', 'dark:bg-emerald-950/40', 'dark:border-emerald-800', 'dark:text-emerald-200');
    fb.innerHTML = `
      <div class="font-bold flex items-center gap-1.5 mb-1"><i class="fa-solid fa-circle-check text-emerald-500"></i> Jawabanmu Benar!</div>
      <p class="text-xs opacity-90">${q.explanation}</p>
    `;
  } else {
    fb.classList.add('bg-rose-50', 'border-rose-200', 'text-rose-900', 'dark:bg-rose-950/40', 'dark:border-rose-800', 'dark:text-rose-200');
    fb.innerHTML = `
      <div class="font-bold flex items-center gap-1.5 mb-1"><i class="fa-solid fa-circle-xmark text-rose-500"></i> Jawaban Kurang Tepat!</div>
      <p class="text-xs opacity-90"><strong>Pembahasan:</strong> ${q.explanation}</p>
    `;
  }

  // Show next button
  const nextBtn = document.getElementById('quizNextBtn');
  nextBtn.classList.remove('hidden');
  if (currentQuestionIndex === QUIZ_QUESTIONS.length - 1) {
    nextBtn.innerHTML = 'Lihat Hasil Akhir <i class="fa-solid fa-flag-checkered ml-1"></i>';
  } else {
    nextBtn.innerHTML = 'Pertanyaan Berikutnya ➔';
  }
}

function nextQuizQuestion() {
  playClickSound();
  if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  // Ensure score capped at 100 if all correct
  const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
  const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  document.getElementById('quizPlayScreen').classList.add('hidden');
  document.getElementById('quizResultScreen').classList.remove('hidden');

  document.getElementById('quizFinalScore').textContent = finalScore;
  document.getElementById('quizCorrectCount').textContent = `${correctCount} dari ${QUIZ_QUESTIONS.length} Pertanyaan Benar (${finalScore}%)`;

  const msg = document.getElementById('quizResultMessage');
  const sub = document.getElementById('quizResultSubtext');
  const iconBox = document.getElementById('quizResultBadgeIcon');
  const certBtn = document.getElementById('btnOpenCert');

  if (finalScore >= 75) {
    msg.textContent = 'Selamat, Kamu Lulus Kompeten!';
    sub.textContent = 'Kamu telah menguasai konsep dasar materi Sistem Komputer Kelas 8 dengan sangat baik.';
    iconBox.className = 'w-20 h-20 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30';
    iconBox.innerHTML = '<i class="fa-solid fa-trophy"></i>';
    if (certBtn) certBtn.classList.remove('hidden');
    playFanfareSound();
    triggerConfetti();
  } else {
    msg.textContent = 'Tetap Semangat, Belum Mencapai KKM';
    sub.textContent = 'Jangan menyerah! Nilai KKM adalah 75. Pelajari kembali materi modul dan coba lagi ya!';
    iconBox.className = 'w-20 h-20 mx-auto rounded-3xl bg-amber-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30';
    iconBox.innerHTML = '<i class="fa-solid fa-book-open-reader"></i>';
    if (certBtn) certBtn.classList.add('hidden');
    playWrongSound();
  }

  // Populate Review List
  buildQuizReviewList();
}

function buildQuizReviewList() {
  const container = document.getElementById('quizReviewList');
  if (!container) return;
  container.innerHTML = '';

  QUIZ_QUESTIONS.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    const isCorrect = userAns && userAns.isCorrect;
    const selectedIdx = userAns ? userAns.selected : -1;

    const row = document.createElement('div');
    row.className = `p-4 rounded-xl border text-xs space-y-1.5 ${
      isCorrect
        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
        : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
    }`;

    row.innerHTML = `
      <div class="flex items-center justify-between font-bold">
        <span>Soal ${idx + 1}: ${q.category}</span>
        <span class="${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">
          ${isCorrect ? '<i class="fa-solid fa-check mr-1"></i> Benar' : '<i class="fa-solid fa-xmark mr-1"></i> Salah'}
        </span>
      </div>
      <p class="text-slate-700 dark:text-slate-300 font-semibold">${q.question}</p>
      <div class="text-slate-500 text-[11px]">
        Jawabanmu: <span class="font-bold">${selectedIdx >= 0 ? q.options[selectedIdx] : '-'}</span>
      </div>
      ${!isCorrect ? `<div class="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">Kunci Jawaban: ${q.options[q.correct]}</div>` : ''}
      <div class="text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700">
        <em>Pembahasan:</em> ${q.explanation}
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

function quitQuiz() {
  playClickSound();
  if (confirm('Yakin ingin membatalkan kuis dan kembali ke menu awal?')) {
    document.getElementById('quizPlayScreen').classList.add('hidden');
    document.getElementById('quizResultScreen').classList.add('hidden');
    document.getElementById('quizStartScreen').classList.remove('hidden');
  }
}

// ================= SERTIFIKAT KELULUSAN =================
function showCertificateModal() {
  playClickSound();
  const studentName = localStorage.getItem('sk8_student_name') || 'Siswa Berprestasi';
  const finalScoreEl = document.getElementById('quizFinalScore');
  const score = finalScoreEl ? finalScoreEl.textContent : '100';

  const nameEl = document.getElementById('certStudentName');
  if (nameEl) nameEl.textContent = studentName;

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

  // Load saved student name if any
  const savedName = localStorage.getItem('sk8_student_name');
  if (savedName) {
    const input = document.getElementById('studentNameInput');
    if (input) input.value = savedName;
  }
});
