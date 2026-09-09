"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import { formatCurrency } from "@/lib/utils"
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  X,
  Flame,
  Compass,
  BookOpen,
  CalendarDays,
} from "lucide-react"

interface LifeClientProps {
  initialTab?: string
  user: any
  monthlyPlan: any
  monthlyReview: any
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ede7de",
  borderRadius: 20,
  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
}

export default function LifeClient({ initialTab = "goals", user, monthlyPlan, monthlyReview }: LifeClientProps) {
  const [activeTab, setActiveTab] = useState<"goals" | "vision" | "planning">(
    initialTab === "vision" || initialTab === "planning" ? initialTab : "goals"
  )

  const [showAddGoalModal, setShowAddGoalModal] = useState(false)
  const [goalForm, setGoalForm] = useState({
    name: "", description: "", targetAmount: "",
    currentAmount: "", deadline: "", monthlyContribution: "",
  })
  const [loading, setLoading] = useState(false)

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalForm.name || !goalForm.targetAmount) return
    setLoading(true)
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalForm),
      })
      if (res.ok) { setShowAddGoalModal(false); window.location.reload() }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const tabs = [
    { key: "goals", label: `الأهداف (${user.goals.length})`, icon: <Target size={13} /> },
    { key: "vision", label: `رؤيتي (${user.lifeGoals.length})`, icon: <Compass size={13} /> },
    { key: "planning", label: "الخطة الشهرية", icon: <CalendarDays size={13} /> },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0ea", color: "#2d2318", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
      <Sidebar user={user} />

      <main style={{ marginRight: 224, minHeight: "100vh", paddingBottom: 60 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 32px" }}>

          {/* ── HEADER ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 11, color: "#b0a294", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                الحياة والطموح
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2d2318", margin: 0 }}>حياتي وأهدافي</h1>
            </div>
            <button
              id="add-goal-btn"
              onClick={() => setShowAddGoalModal(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#c8a96e", color: "#fff", borderRadius: 10,
                padding: "9px 18px", fontSize: 12, fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(200,169,110,0.3)",
              }}
            >
              <Plus size={14} />
              هدف جديد
            </button>
          </div>

          {/* ── TABS ── */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "#ede7de", borderRadius: 14, padding: 5 }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                style={{
                  flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  background: activeTab === t.key ? "#fff" : "transparent",
                  color: activeTab === t.key ? "#2d2318" : "#9b8f82",
                  boxShadow: activeTab === t.key ? "0 1px 6px rgba(0,0,0,0.07)" : "none",
                  transition: "all 0.18s",
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1: FINANCIAL GOALS ── */}
          {activeTab === "goals" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {user.goals.map((g: any) => {
                const pct = Math.min(100, Math.round(g.progress || 0))
                return (
                  <div key={g.id} style={{ ...card, padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: "#f8f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e" }}>
                        <Target size={18} />
                      </div>
                      <span style={{ fontSize: 10, background: "#edf5f0", color: "#5d9e7c", borderRadius: 6, padding: "3px 8px", fontWeight: 700 }}>
                        {pct}%
                      </span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2318", marginBottom: 4 }}>{g.name}</h3>
                    {g.description && <p style={{ fontSize: 11, color: "#9b8f82", marginBottom: 14, lineHeight: 1.6 }}>{g.description}</p>}

                    <div style={{ background: "#f0ebe4", borderRadius: 999, height: 6, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: pct >= 80 ? "#5d9e7c" : "#c8a96e",
                        borderRadius: 999,
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#b0a294" }}>
                      <span style={{ fontFamily: "monospace" }}>{formatCurrency(g.currentAmount)}</span>
                      <span style={{ fontFamily: "monospace" }}>{formatCurrency(g.targetAmount)}</span>
                    </div>
                    {g.requiredMonthlySaving > 0 && (
                      <p style={{ fontSize: 10, color: "#9b8f82", marginTop: 10, background: "#f5f0ea", borderRadius: 8, padding: "5px 10px" }}>
                        مطلوب: {formatCurrency(g.requiredMonthlySaving)} / شهر
                      </p>
                    )}
                  </div>
                )
              })}
              {user.goals.length === 0 && (
                <div style={{ ...card, padding: 40, textAlign: "center", color: "#b0a294", fontSize: 13, gridColumn: "1/-1" }}>
                  لم تُضف أي أهداف بعد — ابدأ بإضافة هدفك الأول
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: VISION & LIFE GOALS ── */}
          {activeTab === "vision" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {user.lifeGoals.map((lg: any) => (
                <div key={lg.id} style={{ ...card, padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f0ebe4" }}>
                    <div>
                      <span style={{ fontSize: 10, color: "#c8a96e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {lg.category}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2d2318", marginTop: 4, marginBottom: 0 }}>{lg.title}</h3>
                    </div>
                    <span style={{ fontSize: 11, background: "#f5f0ea", color: "#9b8f82", borderRadius: 8, padding: "4px 10px", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {lg.status}
                    </span>
                  </div>

                  {lg.description && (
                    <p style={{ fontSize: 13, color: "#6b5d4f", lineHeight: 1.8, marginBottom: 14 }}>{lg.description}</p>
                  )}

                  {lg.milestones && lg.milestones.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#c8a96e", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <Flame size={12} /> المراحل التنفيذية
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {lg.milestones.map((m: any) => (
                          <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#f5f0ea", borderRadius: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {m.completed
                                ? <CheckCircle2 size={14} color="#5d9e7c" />
                                : <Circle size={14} color="#c8a96e" />}
                              <span style={{ fontSize: 12, color: m.completed ? "#9b8f82" : "#2d2318", textDecoration: m.completed ? "line-through" : "none" }}>
                                {m.title}
                              </span>
                            </div>
                            {m.cost > 0 && <span style={{ fontSize: 11, color: "#c8a96e", fontFamily: "monospace", fontWeight: 700 }}>{formatCurrency(m.cost)}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {user.lifeGoals.length === 0 && (
                <div style={{ ...card, padding: 40, textAlign: "center", color: "#b0a294", fontSize: 13 }}>
                  لم تُضف أي أحلام أو رؤية بعد
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: MONTHLY PLANNING ── */}
          {activeTab === "planning" && (
            <div style={{ ...card, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "#f8f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e" }}>
                  <CalendarDays size={18} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2d2318", margin: 0 }}>الخطة الشهرية والمراجعة</h3>
              </div>

              {monthlyPlan ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: "#f5f0ea", borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 11, color: "#b0a294", marginBottom: 8 }}>المستهدف المالي</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: "#5d9e7c", fontFamily: "monospace", margin: 0 }}>
                        {formatCurrency(monthlyPlan.financialTarget)}
                      </p>
                    </div>
                    <div style={{ background: "#f5f0ea", borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 11, color: "#b0a294", marginBottom: 8 }}>مستهدف الادخار</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: "#c8a96e", fontFamily: "monospace", margin: 0 }}>
                        {formatCurrency(monthlyPlan.savingsTarget)}
                      </p>
                    </div>
                  </div>

                  {monthlyPlan.focusNotes && (
                    <div style={{ background: "#f5f0ea", borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#c8a96e", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <BookOpen size={13} /> ملاحظات التركيز
                      </p>
                      <p style={{ fontSize: 13, color: "#6b5d4f", lineHeight: 1.8, margin: 0 }}>{monthlyPlan.focusNotes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#b0a294", padding: "40px 0" }}>
                  <CalendarDays size={32} color="#ddd6cc" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: 13, margin: 0 }}>لم تقم بضبط خطتك لهذا الشهر بعد</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── ADD GOAL MODAL ── */}
      {showAddGoalModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, padding: 28, border: "1px solid #ede7de", boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2d2318", margin: 0 }}>هدف مالي جديد</h3>
              <button onClick={() => setShowAddGoalModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9b8f82" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "اسم الهدف", field: "name", type: "text", placeholder: "مثال: شراء سيارة..." },
                { label: "المبلغ المستهدف (ج.م)", field: "targetAmount", type: "number", placeholder: "0.00" },
                { label: "المبلغ الحالي (ج.م)", field: "currentAmount", type: "number", placeholder: "0.00" },
                { label: "تاريخ الانتهاء", field: "deadline", type: "date", placeholder: "" },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    required={f.field === "name" || f.field === "targetAmount"}
                    value={(goalForm as any)[f.field]}
                    onChange={e => setGoalForm({ ...goalForm, [f.field]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 13, color: "#2d2318", outline: "none", fontFamily: "'Cairo', sans-serif", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "#c8a96e", color: "#fff", fontSize: 13, fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif", marginTop: 4,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "جاري الحفظ..." : "حفظ الهدف"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
