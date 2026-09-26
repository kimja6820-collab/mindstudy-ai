// บันทึกข้อมูลลง LocalStorage เบราว์เซอร์
function saveToStorage(data) {
  const payload = {
    ...data,
    savedAt: new Date().toLocaleDateString('th-TH')
  };
  localStorage.setItem('mindstudy_data', JSON.stringify(payload));
}

// โหลดข้อมูลเก่าขึ้นมาแสดงเมื่อเข้าเว็บครั้งหน้า
function loadFromStorage() {
  const saved = localStorage.getItem('mindstudy_data');
  if (!saved) return null;
  
  const data = JSON.parse(saved);
  
  // แสดง Banner ต้อนรับกลับ
  const banner = document.getElementById('historyBanner');
  const historyText = document.getElementById('historyText');
  
  if (banner && historyText) {
    historyText.innerText = `ต้อนรับกลับมา! ล่าสุดเมื่อ ${data.savedAt} คุณวางแผนอ่านวิชา "${data.subject}" ไว้`;
    banner.classList.remove('hidden');
  }

  // เติมข้อมูลเดิมลงช่องกรอกอัตโนมัติ
  if (data.subject) document.getElementById('subjectInput').value = data.subject;
  if (data.hours) document.getElementById('hoursInput').value = data.hours;
  if (data.content) document.getElementById('contentInput').value = data.content;

  return data;
}

// ล้างข้อมูลเพื่อเริ่มใหม่
function resetData() {
  localStorage.removeItem('mindstudy_data');
  location.reload();
}

// เรียกทำงานทันทีเมื่อเปิดหน้าเว็บ
window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
});
