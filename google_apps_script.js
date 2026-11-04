function doPost(e) {
  var lock = LockService.getScriptLock();
  // Kunci script selama maksimal 10 detik agar data tidak tumpang tindih saat siswa submit serentak
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Otomatis buat baris header tabel jika sheet masih kosong
    // (Hanya mencatat data identitas & nilai siswa, TANPA kunci jawaban)
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Waktu Pengiriman", 
        "Nama Siswa", 
        "Kelas", 
        "No Absen", 
        "Nilai (0-100)", 
        "Jumlah Benar"
      ];
      sheet.appendRow(headers);
      
      // Styling baris judul tabel (warna ungu indigo, teks putih tebal)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4f46e5");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Ambil payload JSON yang dikirim dari web
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    
    var nama = data.nama || "-";
    var kelas = data.kelas || "-";
    var no_absen = data.no_absen || "-";
    var nilai = data.nilai !== undefined ? data.nilai : 0;
    var benar = data.benar ? (data.benar + "/" + (data.total || 10)) : "-";
    
    // Tambahkan baris data siswa (tanpa kolom kunci jawaban)
    sheet.appendRow([
      formattedDate, 
      nama, 
      kelas, 
      no_absen, 
      nilai, 
      benar
    ]);
    
    // Format rata tengah untuk kolom Kelas, No Absen, Nilai, dan Jumlah Benar
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 3, 1, 4).setHorizontalAlignment("center");
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data kuis berhasil dicatat!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ready", message: "Webhook Kuis Informatika Kelas 8 Aktif & Siap Menerima Data!" }))
    .setMimeType(ContentService.MimeType.JSON);
}