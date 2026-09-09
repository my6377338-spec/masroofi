"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import { formatCurrency } from "@/lib/utils"
import {
  Wallet,
  Receipt,
  CreditCard,
  Plus,
  Search,
  Zap,
  X,
  Landmark,
  Smartphone,
  Briefcase,
  Laptop,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  FileText,
  ShieldCheck,
  Palmtree,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const ICON_MAP: Record<string, any> = {
  Landmark, CreditCard, Smartphone, Wallet, Briefcase, Laptop,
  TrendingUp, Utensils, Home, Car, ShoppingBag, HeartPulse,
  GraduationCap, FileText, ShieldCheck, Palmtree, Zap, Cpu,
}

function RenderIcon({ name, className = "w-4 h-4" }: { name?: string; className?: string }) {
  const IconComponent = (name && ICON_MAP[name]) ? ICON_MAP[name] : Wallet
  return <IconComponent className={className} />
}

interface MoneyClientProps {
  initialTab?: string
  user: any
  budgets: any[]
}

// Shared card style
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ede7de",
  borderRadius: 20,
  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
}

export default function MoneyClient({ initialTab = "transactions", user, budgets }: MoneyClientProps) {
  const [activeTab, setActiveTab] = useState<"transactions" | "accounts" | "budgets" | "subscriptions">(
    initialTab === "accounts" || initialTab === "budgets" || initialTab === "subscriptions"
      ? initialTab
      : "transactions"
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [showAddTxModal, setShowAddTxModal] = useState(false)
  const [txForm, setTxForm] = useState({
    amount: "",
    type: "expense",
    description: "",
    accountId: user.accounts[0]?.id || "",
    categoryId: user.categories[0]?.id || "",
  })
  const [loading, setLoading] = useState(false)

  const filteredTransactions = user.transactions.filter((tx: any) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.account?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || tx.type === typeFilter
    const matchesCat = categoryFilter === "all" || tx.categoryId === categoryFilter
    return matchesSearch && matchesType && matchesCat
  })

  // Real stats calculated from actual transactions (current month)
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthTx = user.transactions.filter((tx: any) => new Date(tx.date) >= currentMonthStart)
  const REAL_INCOME = currentMonthTx.filter((tx: any) => tx.type === "income").reduce((s: number, tx: any) => s + tx.amount, 0)
  const REAL_EXPENSES = currentMonthTx.filter((tx: any) => tx.type === "expense").reduce((s: number, tx: any) => s + tx.amount, 0)
  const REAL_SAVINGS = REAL_INCOME - REAL_EXPENSES

  // Arabic account type labels
  const accountTypeAr: Record<string, string> = {
    bank: "بنك",
    cash: "كاش",
    wallet: "محفظة",
    savings: "ادخار",
    credit_card: "بطاقة ائتمان",
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!txForm.amount || !txForm.accountId) return
    setLoading(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...txForm, date: new Date().toISOString() }),
      })
      if (res.ok) { setShowAddTxModal(false); window.location.reload() }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const tabs = [
    { key: "transactions", label: `المعاملات (${user.transactions.length})` },
    { key: "accounts", label: `الحسابات (${user.accounts.length})` },
    { key: "budgets", label: `الميزانيات (${budgets.length})` },
    { key: "subscriptions", label: `الالتزامات (${user.subscriptions.length + user.commitments.length})` },
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
                المنظومة المالية
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2d2318", margin: 0 }}>المال والحسابات</h1>
            </div>
            <button
              id="add-transaction-btn"
              onClick={() => setShowAddTxModal(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#c8a96e", color: "#fff", borderRadius: 10,
                padding: "9px 18px", fontSize: 12, fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(200,169,110,0.3)",
              }}
            >
              <Plus size={14} />
              تسجيل معاملة
            </button>
          </div>

          {/* ── QUICK STATS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "الدخل هذا الشهر", value: formatCurrency(REAL_INCOME), color: "#5d9e7c", icon: <ArrowUpRight size={14} /> },
              { label: "المصروفات", value: formatCurrency(REAL_EXPENSES), color: "#c97b6b", icon: <ArrowDownRight size={14} /> },
              { label: "صافي الادخار", value: formatCurrency(REAL_SAVINGS), color: REAL_SAVINGS >= 0 ? "#5d9e7c" : "#c97b6b", icon: null },
            ].map((s, i) => (
              <div key={i} style={{ ...card, padding: "18px 20px" }}>
                <p style={{ fontSize: 11, color: "#b0a294", marginBottom: 8 }}>{s.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {s.icon && <span style={{ color: s.color }}>{s.icon}</span>}
                  <span style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#ede7de", borderRadius: 14, padding: 5 }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                style={{
                  flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
                  background: activeTab === t.key ? "#fff" : "transparent",
                  color: activeTab === t.key ? "#2d2318" : "#9b8f82",
                  boxShadow: activeTab === t.key ? "0 1px 6px rgba(0,0,0,0.07)" : "none",
                  transition: "all 0.18s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1: TRANSACTIONS ── */}
          {activeTab === "transactions" && (
            <div style={{ ...card, padding: 24 }}>
              {/* Filters */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search size={14} color="#b0a294" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث..."
                    style={{
                      width: "100%", paddingRight: 36, paddingLeft: 12, paddingTop: 9, paddingBottom: 9,
                      borderRadius: 10, border: "1px solid #ede7de", fontSize: 12, color: "#2d2318",
                      background: "#f5f0ea", outline: "none", fontFamily: "'Cairo', sans-serif", boxSizing: "border-box",
                    }}
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 12, color: "#4a3d2e", background: "#f5f0ea", fontFamily: "'Cairo', sans-serif" }}
                >
                  <option value="all">الكل</option>
                  <option value="income">دخل</option>
                  <option value="expense">مصروف</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 12, color: "#4a3d2e", background: "#f5f0ea", fontFamily: "'Cairo', sans-serif" }}
                >
                  <option value="all">كل الفئات</option>
                  {user.categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* List */}
              <div>
                {filteredTransactions.map((tx: any, idx: number) => (
                  <div key={tx.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 0", borderBottom: idx < filteredTransactions.length - 1 ? "1px solid #f0ebe4" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 11,
                        background: tx.type === "income" ? "#edf5f0" : "#f8f0e8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: tx.type === "income" ? "#5d9e7c" : "#c8a96e",
                      }}>
                        <RenderIcon name={tx.category?.icon} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#2d2318", margin: 0 }}>
                          {tx.description || tx.category?.name || "معاملة"}
                        </p>
                        <p style={{ fontSize: 11, color: "#b0a294", margin: 0 }}>
                          {tx.account?.name} · {new Date(tx.date).toLocaleDateString("ar-EG", { day: "numeric", month: "short", numberingSystem: "latn" } as any)}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: tx.type === "income" ? "#5d9e7c" : "#c97b6b" }}>
                      {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                  <p style={{ textAlign: "center", color: "#b0a294", fontSize: 13, padding: "32px 0" }}>لا توجد معاملات</p>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: ACCOUNTS ── */}
          {activeTab === "accounts" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {user.accounts.map((acc: any) => (
                <div key={acc.id} style={{ ...card, padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, background: "#f5f0ea",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e",
                    }}>
                      <RenderIcon name={acc.icon} className="w-5 h-5" />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#9b8f82", background: "#f0ebe4", borderRadius: 6, padding: "3px 9px" }}>
                      {accountTypeAr[acc.type] || acc.type}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#9b8f82", margin: "0 0 6px 0" }}>{acc.name}</p>
                  <p style={{ fontSize: 26, fontWeight: 800, color: acc.balance < 0 ? "#c97b6b" : "#2d2318", fontFamily: "monospace", margin: 0 }}>
                    {formatCurrency(acc.balance)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB 3: BUDGETS ── */}
          {activeTab === "budgets" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {budgets.map((b: any) => {
                const realSpent = b.spent || 0
                const realProgress = b.amount > 0 ? (realSpent / b.amount) * 100 : 0
                const isOver = realProgress >= 90
                return (
                  <div key={b.id} style={{ ...card, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#2d2318" }}>{b.category?.name}</span>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: isOver ? "#c97b6b" : "#9b8f82" }}>
                        {formatCurrency(realSpent)} / {formatCurrency(b.amount)}
                      </span>
                    </div>
                    <div style={{ background: "#f0ebe4", borderRadius: 999, height: 7, overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(100, realProgress)}%`, height: "100%",
                        background: isOver ? "#c97b6b" : realProgress >= 70 ? "#c8a96e" : "#5d9e7c",
                        borderRadius: 999, transition: "width 0.5s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: 11, color: "#b0a294" }}>
                      <span>{realProgress.toFixed(0)}% مستهلك</span>
                      <span>متبقي: {formatCurrency(Math.max(0, b.amount - realSpent))}</span>
                    </div>
                  </div>
                )
              })}
              {budgets.length === 0 && (
                <div style={{ ...card, padding: 40, textAlign: "center", color: "#b0a294", fontSize: 13 }}>
                  لا توجد ميزانيات مضافة بعد
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: SUBSCRIPTIONS & COMMITMENTS ── */}
          {activeTab === "subscriptions" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {/* Subscriptions */}
              <div style={{ ...card, padding: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Cpu size={14} color="#c8a96e" /> الاشتراكات النشطة
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {user.subscriptions.map((sub: any) => (
                    <div key={sub.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0ebe4" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#f8f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8a96e" }}>
                          <RenderIcon name={sub.icon} />
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#2d2318", margin: 0 }}>{sub.name}</p>
                          <p style={{ fontSize: 10, color: "#b0a294", margin: 0 }}>{sub.category}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "#c8a96e" }}>
                        {formatCurrency(sub.amount)}
                      </span>
                    </div>
                  ))}
                  {user.subscriptions.length === 0 && <p style={{ fontSize: 12, color: "#b0a294" }}>لا توجد اشتراكات</p>}
                </div>
              </div>

              {/* Commitments */}
              <div style={{ ...card, padding: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={14} color="#c97b6b" /> الالتزامات
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {user.commitments.map((com: any) => (
                    <div key={com.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0ebe4" }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#2d2318", margin: 0 }}>{com.name}</p>
                        <p style={{ fontSize: 10, color: "#b0a294", margin: 0 }}>مستحق في {new Date(com.dueDate).getDate()} من كل شهر</p>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "#c97b6b" }}>
                        {formatCurrency(com.amount)}
                      </span>
                    </div>
                  ))}
                  {user.commitments.length === 0 && <p style={{ fontSize: 12, color: "#b0a294" }}>لا توجد التزامات</p>}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── ADD TRANSACTION MODAL ── */}
      {showAddTxModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, padding: 28, border: "1px solid #ede7de", boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2d2318", margin: 0 }}>معاملة جديدة</h3>
              <button onClick={() => setShowAddTxModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9b8f82" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>المبلغ (ج.م)</label>
                <input
                  type="number" step="0.01" required
                  value={txForm.amount}
                  onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                  placeholder="0.00"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 14, color: "#2d2318", outline: "none", fontFamily: "'Cairo', sans-serif", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>النوع</label>
                <select
                  value={txForm.type}
                  onChange={e => setTxForm({ ...txForm, type: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 13, color: "#2d2318", outline: "none", fontFamily: "'Cairo', sans-serif", boxSizing: "border-box", background: "#fff" }}
                >
                  <option value="expense">مصروف</option>
                  <option value="income">دخل</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>الوصف (اختياري)</label>
                <input
                  type="text"
                  value={txForm.description}
                  onChange={e => setTxForm({ ...txForm, description: e.target.value })}
                  placeholder="وصف المعاملة..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 13, color: "#2d2318", outline: "none", fontFamily: "'Cairo', sans-serif", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9b8f82", display: "block", marginBottom: 6 }}>الحساب</label>
                <select
                  value={txForm.accountId}
                  onChange={e => setTxForm({ ...txForm, accountId: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ede7de", fontSize: 13, color: "#2d2318", outline: "none", fontFamily: "'Cairo', sans-serif", boxSizing: "border-box", background: "#fff" }}
                >
                  {user.accounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "#c8a96e", color: "#fff", fontSize: 13, fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif", marginTop: 8,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "جاري الحفظ..." : "حفظ المعاملة"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
