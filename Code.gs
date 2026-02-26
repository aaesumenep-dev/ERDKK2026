
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Sistem Manajemen Arsip Petani')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


function processAutoSave(data) {
  try {
    const folderId = '1OVmkx1PNdwbkyZp6z4Ajgjz7qznL5pJr'; 
    let folder;

    // Coba akses folder tujuan
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (e) {
      folder = DriveApp.getRootFolder();
    }

    // Logika Penamaan File berdasarkan Alamat
    // Data.alamat diambil dari kolom Alamat di frontend jika tersedia
    const tanggal = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd_HH-mm");
    let baseName = data.alamat || data.fileName || "Rekap_Arsip";
    
    // Membersihkan karakter yang tidak valid untuk nama file
    baseName = baseName.replace(/[/\\?%*:|"<>]/g, '-');

    const finalFileName = baseName + "_" + tanggal + ".csv";

    // Buat file baru di Drive
    const file = folder.createFile(finalFileName, data.csv, MimeType.CSV);

    return JSON.stringify({
      status: "success",
      message: "Berhasil disimpan sebagai: " + finalFileName,
      fileUrl: file.getUrl()
    });

  } catch (error) {
    return JSON.stringify({
      status: "error",
      message: "Gagal menyimpan: " + error.toString()
    });
  }
}