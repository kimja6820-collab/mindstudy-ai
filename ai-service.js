// ใส่ API Key ของ Gemini ที่ได้จาก Google AI Studio
const GEMINI_API_KEY = "https://rjkggyyofhksivhbdwhw.supabase.co"; 
let currentStressScore = 50;

function setStress(score) {
  currentStressScore = score;
  alert(`บันทึกระดับความเครียดเรียบร้อย (${score}%)`);
}

async function generatePlan() {
  const subject = document.getElementById('subjectInput').value;
  const hours = document.getElementById('hoursInput').value;
  const content = document.getElementById('contentInput').value;

  if (!subject || !content) {
    alert('กรุณากรอกชื่อวิชาและเนื้อหาบทเรียนให้ครบถ้วนครับ');
    return;
  }

  // แสดง Loading
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('resultSection').classList.add('hidden');

  const prompt = `
    คุณคือ AI โค้ชการเรียนและสุขภาพจิต
    - ระดับความเครียดผู้ใช้: ${currentStressScore}%
    - วิชา: ${subject}
    - เวลาที่มี: ${hours} ชั่วโมง
    - เนื้อหา: ${content}

    ตอบกลับเป็น JSON รูปแบบนี้เท่านั้น:
    {
      "advice": "คำแนะนำสั้นๆ ฮีลใจและปรับอารมณ์ตามระดับความเครียด",
      "flashcards": [
        {"q": "คำถามสรุปจุดสำคัญ 1", "a": "คำตอบ"},
        {"q": "คำถามสรุปจุดสำคัญ 2", "a": "คำตอบ"}
      ],
      "schedule": [
        {"time": "ช่วงที่ 1", "action": "อ่านหัวข้อสำคัญ A (20 นาที) + พักสายตา (5 นาที)"},
        {"time": "ช่วงที่ 2", "action": "อ่านหัวข้อสำคัญ B (20 นาที) + พักดื่มน้ำ (5 นาที)"}
      ]
    }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const result = await response.json();
    const data = JSON.parse(result.candidates[0].content.parts[0].text);

    // แสดงผลบนหน้าเว็บ
    renderResults(data);

    // บันทึกข้อมูลลงในความจำเบราว์เซอร์
    saveToStorage({ subject, hours, content, stressScore: currentStressScore, aiResult: data });

  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อ AI กรุณาเช็ก API Key');
  } finally {
    document.getElementById('loading').classList.add('hidden');
  }
}

function renderResults(data) {
  document.getElementById('aiAdvice').innerText = data.advice;

  // Render Flashcards
  const fcContainer = document.getElementById('flashcardsContainer');
  fcContainer.innerHTML = data.flashcards.map(fc => `
    <div class="p-3 bg-slate-100 rounded-xl border">
      <div class="font-bold text-indigo-700 text-sm">Q: ${fc.q}</div>
      <div class="text-slate-600 text-sm mt-1">A: ${fc.a}</div>
    </div>
  `).join('');

  // Render Schedule
  const scContainer = document.getElementById('scheduleContainer');
  scContainer.innerHTML = data.schedule.map(sc => `
    <div class="flex gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-indigo-500 text-sm">
      <span class="font-bold text-slate-700">${sc.time}:</span>
      <span class="text-slate-600">${sc.action}</span>
    </div>
  `).join('');

  document.getElementById('resultSection').classList.remove('hidden');
}
