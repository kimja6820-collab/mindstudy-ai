import { supabase } from './js/supabase-config.js'

// สมัครสมาชิก / ล็อกอิน
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) alert('เข้าสู่ระบบไม่สำเร็จ: ' + error.message)
  else window.location.href = 'dashboard.html'
}

// เช็ก Session หน้าเว็บ ถ้าน้องยังไม่ล็อกอินให้เด้งกลับหน้าแรก
export async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) window.location.href = 'index.html'
  return user
}
