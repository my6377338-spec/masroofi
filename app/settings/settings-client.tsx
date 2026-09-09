"use client"

import Sidebar from "@/components/layout/sidebar"
import { Settings, User, Globe, Palette } from "lucide-react"

interface SettingsClientProps {
  user: any
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ede7de",
  borderRadius: 20,
  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
  padding: "24px 28px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ede7de",
  fontSize: 13,
  color: "#2d2318",
  background: "#f5f0ea",
  fontFamily: "'Cairo', sans-serif",
  boxSizing: "border-box" as any,
  outline: "none",
}

export default function SettingsClient({ user }: SettingsClientProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0ea", color: "#2d2318", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
      <Sidebar user={user} />

      <main style={{ marginRight: 224, minHeight: "100vh", paddingBottom: 60 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 32px" }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, color: "#b0a294", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              التفضيلات
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2d2318", margin: 0 }}>الإعدادات</h1>
          </div>

          {/* User Info */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f8f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e" }}>
                <User size={16} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2318", margin: 0 }}>بيانات المستخدم</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>الاسم</label>
                <input type="text" disabled value={user.name || "مروان سيد"} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>البريد الإلكتروني</label>
                <input type="email" disabled value={user.email || "user@masroofi.local"} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f8f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e" }}>
                <Globe size={16} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2318", margin: 0 }}>التفضيلات العامة</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>العملة</label>
                <select disabled style={{ ...inputStyle, background: "#f5f0ea" }}>
                  <option>الجنيه المصري (EGP)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>اللغة</label>
                <select disabled style={{ ...inputStyle, background: "#f5f0ea" }}>
                  <option>العربية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f8f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e" }}>
                <Palette size={16} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2318", margin: 0 }}>المظهر</h3>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "الوضع الفاتح", active: true, bg: "#f5f0ea", color: "#2d2318" },
                { label: "الوضع الداكن", active: false, bg: "#1e1810", color: "#fff" },
              ].map(m => (
                <div key={m.label} style={{
                  flex: 1, padding: "14px", borderRadius: 12, border: `2px solid ${m.active ? "#c8a96e" : "#ede7de"}`,
                  background: m.active ? "#fff8ef" : "#fafafa", textAlign: "center", cursor: "pointer",
                }}>
                  <div style={{ width: 28, height: 18, borderRadius: 5, background: m.bg, border: "1px solid #ddd", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: m.active ? "#c8a96e" : "#9b8f82", margin: 0 }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "#c8bbb0", marginTop: 32 }}>
            مصروفي — إدارة مالية ذكية ومريحة
          </p>

        </div>
      </main>
    </div>
  )
}
