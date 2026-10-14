/**
 * Nusantara Coding Academy - Client Script
 * Pemrograman Web - Pertemuan 10
 * Fitur: 
 * - Navigasi 2 Tampilan (Galeri & Pendaftaran)
 * - Filter & Lightbox Galeri Pelatihan
 * - Validasi Form Interaktif
 * - Konfirmasi Penyimpanan (confirm dialog)
 * - Tampilan Hasil Pendaftaran
 */

document.addEventListener('DOMContentLoaded', () => {
  initNikInput();
  initPhoneInput();
  initKeyboardShortcuts();

  // Dukungan direct link #pendaftaran atau #galeri
  if (window.location.hash === '#pendaftaran' || window.location.hash === '#registration') {
    switchView('registration');
  } else if (window.location.hash === '#galeri' || window.location.hash === '#gallery') {
    switchView('gallery');
  }
});

/* ===================================================================
   1. VIEW SWITCHER (GALERI & PENDAFTARAN)
   =================================================================== */
function switchView(viewName) {
  const viewGallery = document.getElementById('viewGallery');
  const viewRegistration = document.getElementById('viewRegistration');
  const tabGalleryBtn = document.getElementById('tabGalleryBtn');
  const tabRegistrationBtn = document.getElementById('tabRegistrationBtn');

  if (viewName === 'gallery') {
    viewGallery.classList.add('active');
    viewRegistration.classList.remove('active');

    tabGalleryBtn.classList.add('active');
    tabRegistrationBtn.classList.remove('active');

    // Smooth scroll to view
    viewGallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (viewName === 'registration') {
    viewRegistration.classList.add('active');
    viewGallery.classList.remove('active');

    tabRegistrationBtn.classList.add('active');
    tabGalleryBtn.classList.remove('active');

    // Smooth scroll to view
    viewRegistration.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ===================================================================
   2. GALLERY FILTER & LIGHTBOX
   =================================================================== */
function filterGallery(category, buttonEl) {
  // Update active pill button
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => pill.classList.remove('active'));
  if (buttonEl) {
    buttonEl.classList.add('active');
  }

  // Filter gallery items
  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.animation = 'none';
      void card.offsetWidth; // Trigger reflow untuk re-trigger animasi
      card.style.animation = 'fadeInCard 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// Lightbox Modal Functions
function openLightbox(imageUrl, caption) {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  lightboxImg.src = imageUrl;
  lightboxCaption.textContent = caption || 'Dokumentasi Kegiatan Pelatihan';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  const lightbox = document.getElementById('imageLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/* ===================================================================
   3. INPUT HELPERS & LIVE FORMATTING
   =================================================================== */
function initNikInput() {
  const nikInput = document.getElementById('nik');
  const nikCounter = document.getElementById('nikCounter');

  if (!nikInput || !nikCounter) return;

  const sanitizeAndFormat = (target) => {
    // Hanya perbolehkan karakter angka
    let val = target.value.replace(/\D/g, '');
    if (val.length > 16) {
      val = val.slice(0, 16);
    }
    target.value = val;
    nikCounter.textContent = `${val.length}/16`;

    // Clear error if valid
    if (val.length === 16) {
      document.getElementById('groupNik').classList.remove('has-error');
    }
  };

  nikInput.addEventListener('input', (e) => sanitizeAndFormat(e.target));
  nikInput.addEventListener('paste', () => {
    setTimeout(() => sanitizeAndFormat(nikInput), 0);
  });
}

function initPhoneInput() {
  const phoneInput = document.getElementById('noHp');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    // Izinkan angka, spasi, dan tanda hubung
    let val = e.target.value.replace(/[^\d\s-]/g, '');
    // Hapus awalan 0 atau 62 jika pengguna sengaja mengetik karena sudah ada prefix +62
    if (val.startsWith('0')) {
      val = val.substring(1);
    } else if (val.startsWith('62')) {
      val = val.substring(2);
    }
    e.target.value = val;

    if (val.length >= 9) {
      document.getElementById('groupHp').classList.remove('has-error');
    }
  });
}

/* ===================================================================
   4. FORM VALIDATION
   =================================================================== */
function validateRegistrationForm() {
  let isValid = true;

  // 1. Validasi NIK (harus 16 digit angka)
  const nikInput = document.getElementById('nik');
  const nikVal = nikInput.value.replace(/\D/g, '').trim();
  nikInput.value = nikVal;
  const nikCounter = document.getElementById('nikCounter');
  if (nikCounter) {
    nikCounter.textContent = `${nikVal.length}/16`;
  }

  const groupNik = document.getElementById('groupNik');
  if (!/^\d{16}$/.test(nikVal)) {
    groupNik.classList.add('has-error');
    isValid = false;
  } else {
    groupNik.classList.remove('has-error');
  }

  // 2. Validasi Nama Lengkap
  const namaVal = document.getElementById('namaLengkap').value.trim();
  const groupNama = document.getElementById('groupNama');
  if (namaVal.length < 2) {
    groupNama.classList.add('has-error');
    isValid = false;
  } else {
    groupNama.classList.remove('has-error');
  }

  // 3. Validasi Jenis Kelamin
  const genderChecked = document.querySelector('input[name="jenisKelamin"]:checked');
  const groupGender = document.getElementById('groupGender');
  if (!genderChecked) {
    groupGender.classList.add('has-error');
    isValid = false;
  } else {
    groupGender.classList.remove('has-error');
  }

  // 4. Validasi No HP (minimal 9 digit angka)
  const hpVal = document.getElementById('noHp').value.trim().replace(/\D/g, '');
  const groupHp = document.getElementById('groupHp');
  if (hpVal.length < 9) {
    groupHp.classList.add('has-error');
    isValid = false;
  } else {
    groupHp.classList.remove('has-error');
  }

  // 5. Validasi Alamat
  const alamatVal = document.getElementById('alamat').value.trim();
  const groupAlamat = document.getElementById('groupAlamat');
  if (alamatVal.length < 5) {
    groupAlamat.classList.add('has-error');
    isValid = false;
  } else {
    groupAlamat.classList.remove('has-error');
  }

  // 6. Validasi Bahasa Pemrograman (minimal 1 dipilih)
  const selectedLangs = document.querySelectorAll('input[name="bahasaPemrograman"]:checked');
  const groupLanguages = document.getElementById('groupLanguages');
  if (selectedLangs.length === 0) {
    groupLanguages.classList.add('has-error');
    isValid = false;
  } else {
    groupLanguages.classList.remove('has-error');
  }

  return isValid;
}

/* ===================================================================
   5. HANDLE FORM SUBMISSION & CONFIRM DIALOG
   =================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();

  // Langkah 1: Validasi form terlebih dahulu
  if (!validateRegistrationForm()) {
    showToast('Mohon lengkapi seluruh isian form dengan benar!', 'warning');
    // Scroll ke error pertama
    const firstError = document.querySelector('.form-group.has-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Langkah 2: Dialog konfirmasi sesuai spesifikasi soal:
  // "Ketika proses menyimpan tampilkan dialog confirm 'Apakah Anda sudah yakin untuk menyimpan?'. Jika pilih 'Ya' tampilkan hasilnya sesuai isian pada form."
  const isConfirmed = window.confirm("Apakah Anda sudah yakin untuk menyimpan?");

  if (isConfirmed) {
    // Pengguna memilih "Ya" (OK) -> Tampilkan hasilnya sesuai isian
    saveAndDisplayResult();
  } else {
    // Pengguna memilih "Batal" (Cancel)
    showToast('Penyimpanan pendaftaran dibatalkan.', 'info');
  }
}

/* ===================================================================
   6. RENDER HASIL PENDAFTARAN
   =================================================================== */
function saveAndDisplayResult() {
  // Ambil semua data dari input form
  const nik = document.getElementById('nik').value.trim();
  const nama = document.getElementById('namaLengkap').value.trim();
  const gender = document.querySelector('input[name="jenisKelamin"]:checked').value;
  const hp = document.getElementById('noHp').value.trim();
  const alamat = document.getElementById('alamat').value.trim();

  // Ambil daftar bahasa pemrograman yang dicentang
  const selectedLangElements = document.querySelectorAll('input[name="bahasaPemrograman"]:checked');
  const languages = Array.from(selectedLangElements).map(el => el.value);

  // Buat kode registrasi unik dan timestamp
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const regNumber = `REG-2026-${randomNum}`;
  const now = new Date();
  const formattedDate = formatIndonesianDate(now);

  // Isi data ke elemen Kartu Hasil Pendaftaran
  document.getElementById('resRegNumber').textContent = regNumber;
  document.getElementById('resNik').textContent = nik;
  document.getElementById('resNama').textContent = nama;
  document.getElementById('resGender').textContent = gender;
  document.getElementById('resHp').textContent = `+62 ${hp}`;
  document.getElementById('resAlamat').textContent = alamat;
  document.getElementById('resTimestamp').textContent = formattedDate;

  // Render badge bahasa pemrograman
  const langContainer = document.getElementById('resLanguages');
  langContainer.innerHTML = '';
  languages.forEach(lang => {
    const badge = document.createElement('span');
    badge.className = 'result-lang-badge';
    badge.innerHTML = `<i class="fa-solid fa-code"></i> ${lang}`;
    langContainer.appendChild(badge);
  });

  // Sembunyikan form dan layout pendaftaran
  const formLayout = document.querySelector('.registration-layout');
  if (formLayout) {
    formLayout.classList.add('hidden');
  }
  const formCard = document.getElementById('formContainer');
  if (formCard) {
    formCard.classList.add('hidden');
  }

  // Tampilkan container hasil pendaftaran
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.classList.remove('hidden');

  // Berikan feedback toast
  showToast('Selamat! Data pendaftaran Anda berhasil disimpan.', 'success');

  // Scroll halus ke kartu hasil pendaftaran
  setTimeout(() => {
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

/* Helper Format Tanggal Indonesia */
function formatIndonesianDate(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  return date.toLocaleString('id-ID', options);
}

/* ===================================================================
   7. RESET & AKSI KARTU HASIL
   =================================================================== */
function handleResetForm() {
  // Hapus semua penanda error
  const errorGroups = document.querySelectorAll('.form-group.has-error');
  errorGroups.forEach(group => group.classList.remove('has-error'));

  // Reset counter NIK
  const nikCounter = document.getElementById('nikCounter');
  if (nikCounter) {
    nikCounter.textContent = '0/16';
  }

  showToast('Formulir telah di-reset.', 'info');
}

function editRegistration() {
  // Tampilkan kembali form dan sembunyikan hasil
  const formLayout = document.querySelector('.registration-layout');
  if (formLayout) {
    formLayout.classList.remove('hidden');
  }
  const formCard = document.getElementById('formContainer');
  if (formCard) {
    formCard.classList.remove('hidden');
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const resultContainer = document.getElementById('resultContainer');
  if (resultContainer) {
    resultContainer.classList.add('hidden');
  }
  showToast('Silakan perbarui isian formulir di atas.', 'info');
}

function resetToNewRegistration() {
  // Bersihkan form
  document.getElementById('registrationForm').reset();
  handleResetForm();

  // Sembunyikan hasil pendaftaran sebelumnya
  const resultContainer = document.getElementById('resultContainer');
  if (resultContainer) {
    resultContainer.classList.add('hidden');
  }

  // Tampilkan kembali form
  const formLayout = document.querySelector('.registration-layout');
  if (formLayout) {
    formLayout.classList.remove('hidden');
  }
  const formCard = document.getElementById('formContainer');
  if (formCard) {
    formCard.classList.remove('hidden');
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Arahkan kursor ke NIK
  const nikInput = document.getElementById('nik');
  if (nikInput) {
    nikInput.focus();
  }

  showToast('Formulir siap untuk pendaftaran peserta baru.', 'success');
}

function printResultCard() {
  window.print();
}

/* ===================================================================
   8. TOAST NOTIFICATION SYSTEM
   =================================================================== */
let toastTimeout;

function showToast(message, type = 'success') {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  // Atur kelas tipe
  toast.className = `toast ${type} show`;

  // Atur ikon sesuai tipe
  if (type === 'success') {
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  } else if (type === 'warning') {
    toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
  } else if (type === 'error') {
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
  } else {
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
  }

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
