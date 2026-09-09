"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import { formatCurrency } from "@/lib/utils"
import {
  Wallet,
  Plus,
  Eye,
  EyeOff,
  Landmark,
  CreditCard,
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
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  PieChart,
  AlertTriangle,
  Cpu,
  Zap,
  Target,
  Calendar,
  Sparkles,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"

const ICON_MAP: Record<string, any> = {
  Landmark,
  CreditCard,
  Smartphone,
  Wallet,
  Briefcase,
  Laptop,
  TrendingUp,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  FileText,
  ShieldCheck,
  Palmtree,
  PieChart,
  AlertTriangle,
  Cpu,
  Zap,
  Target,
}

function RenderIcon({ name, className = "w-4 h-4" }: { name?: string; className?: string }) {
  const IconComponent = (name && ICON_MAP[name]) ? ICON_MAP[name] : Wallet
  return <IconComponent className={className} />
}

interface DashboardClientProps {
  user: any
  stats: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    monthlySavings: number
    savingsRate: number
  }
  previousMonthStats: {
    income: number
    expenses: number
    savings: number
  }
  dailyChartData: Array<{
    dayLabel: string
    dateStr: string
    income: number
    expense: number
  }>
  categoryBreakdown: Array<{
    name: string
    color: string
    icon: string
    amount: number
    count: number
    percentage: number
  }>
  budgetsWithSpent: Array<any>
  subscriptions: Array<any>
  commitments: Array<any>
  goals: Array<any>
  lifeGoals: Array<any>
  monthlyPlan: any
  monthlyReview: any
  insights: Array<{
    id: string
    title: string
    description: string
    type: "info" | "success" | "warning" | "error"
    icon: string
  }>
}

export default function DashboardClient({
  user,
  stats,
  previousMonthStats,
  dailyChartData,
  categoryBreakdown,
  budgetsWithSpent,
  subscriptions,
  commitments,
  goals,
  lifeGoals,
  monthlyPlan,
  monthlyReview,
  insights,
}: DashboardClientProps) {
  const [showBalance, setShowBalance] = useState(true)

  const currentDateStr = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: "latn",
  } as any)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#fff",
          border: "1px solid #e8e2d9",
          borderRadius: 12,
          padding: "8px 14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          direction: "rtl",
          fontSize: 12,
        }}>
          <p style={{ color: "#9b8f82", fontSize: 10, marginBottom: 2 }}>{payload[0]?.payload?.dateStr}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color || "#2d2318", fontWeight: 600, fontFamily: "monospace", margin: "1px 0" }}>
              {p.name === "expense" ? "مصروف: " : "دخل: "}{formatCurrency(p.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const savingsPct = stats.monthlyIncome > 0
    ? Math.round((stats.monthlySavings / stats.monthlyIncome) * 100)
    : 0

  const accountTypeAr: Record<string, string> = {
    bank: "بنك",
    cash: "كاش",
    wallet: "محفظة",
    savings: "ادخار",
    credit_card: "بطاقة ائتمان",
  }

  // Income change vs previous month
  const incomeChange = previousMonthStats.income > 0
    ? ((stats.monthlyIncome - previousMonthStats.income) / previousMonthStats.income) * 100
    : 0
  const expenseChange = previousMonthStats.expenses > 0
    ? ((stats.monthlyExpenses - previousMonthStats.expenses) / previousMonthStats.expenses) * 100
    : 0

  const hasTransactions = user.transactions.length > 0
  const hasAccounts = user.accounts.length > 0

  // Insight icon colors
  const insightColors: Record<string, string> = {
    info: "#4a90d9",
    success: "#5d9e7c",
    warning: "#c8a96e",
    error: "#c97b6b",
  }
  const insightBg: Record<string, string> = {
    info: "#edf3fb",
    success: "#edf5f0",
    warning: "#fdf8f0",
    error: "#fdf0ee",
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ea",
      color: "#2d2318",
      fontFamily: "'Cairo', sans-serif",
      direction: "rtl",
    }}>
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main layout */}
      <main style={{ marginRight: 224, minHeight: "100vh", padding: "0 0 60px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>

          {/* ── HEADER ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}>
            <div>
              <p style={{ fontSize: 12, color: "#9b8f82", marginBottom: 4 }}>{currentDateStr}</p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2d2318", margin: 0 }}>
                أهلاً، {user.name} 👋
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                id="toggle-balance-btn"
                onClick={() => setShowBalance(!showBalance)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "1px solid #ddd6cc",
                  borderRadius: 10,
                  padding: "7px 12px",
                  fontSize: 12,
                  color: "#9b8f82",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                title={showBalance ? "إخفاء الأرقام" : "إظهار الأرقام"}
              >
                {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showBalance ? "إخفاء" : "إظهار"}</span>
              </button>

              <a
                href="/money?tab=transactions"
                id="add-transaction-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#c8a96e",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(200,169,110,0.35)",
                  transition: "all 0.2s",
                }}
              >
                <Plus size={14} />
                <span>إضافة معاملة</span>
              </a>
            </div>
          </div>

          {/* ── HERO BALANCE CARD ── */}
          <div style={{
            background: "linear-gradient(135deg, #2d2318 0%, #4a3d2e 100%)",
            borderRadius: 24,
            padding: "32px 36px",
            marginBottom: 20,
            boxShadow: "0 8px 40px rgba(45,35,24,0.2)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative blur */}
            <div style={{
              position: "absolute",
              top: -40,
              left: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(200,169,110,0.12)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />

            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              إجمالي رصيدك
            </p>
            <h2 style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "monospace",
              margin: "0 0 28px 0",
              letterSpacing: -1,
            }}>
              {showBalance ? formatCurrency(stats.totalBalance) : "••••••• ج.م"}
            </h2>

            {/* 3 inline stats */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>الدخل هذا الشهر</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <ArrowUpRight size={14} color="#7ecfa6" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#7ecfa6", fontFamily: "monospace" }}>
                    {showBalance ? formatCurrency(stats.monthlyIncome) : "••••••"}
                  </span>
                  {incomeChange !== 0 && (
                    <span style={{
                      fontSize: 10,
                      background: incomeChange > 0 ? "rgba(126,207,166,0.2)" : "rgba(201,123,107,0.2)",
                      color: incomeChange > 0 ? "#7ecfa6" : "#f0a090",
                      borderRadius: 6,
                      padding: "2px 6px",
                      fontWeight: 600,
                    }}>
                      {incomeChange > 0 ? "+" : ""}{incomeChange.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>المصروفات</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <ArrowDownRight size={14} color="#f0a090" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#f0a090", fontFamily: "monospace" }}>
                    {showBalance ? formatCurrency(stats.monthlyExpenses) : "••••••"}
                  </span>
                  {expenseChange !== 0 && (
                    <span style={{
                      fontSize: 10,
                      background: expenseChange < 0 ? "rgba(126,207,166,0.2)" : "rgba(201,123,107,0.2)",
                      color: expenseChange < 0 ? "#7ecfa6" : "#f0a090",
                      borderRadius: 6,
                      padding: "2px 6px",
                      fontWeight: 600,
                    }}>
                      {expenseChange > 0 ? "+" : ""}{expenseChange.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>صافي الادخار</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: stats.monthlySavings >= 0 ? "#c8a96e" : "#f0a090", fontFamily: "monospace" }}>
                    {showBalance ? formatCurrency(stats.monthlySavings) : "••••••"}
                  </span>
                  <span style={{
                    fontSize: 10,
                    background: "rgba(200,169,110,0.2)",
                    color: "#c8a96e",
                    borderRadius: 6,
                    padding: "2px 7px",
                    fontWeight: 600,
                  }}>
                    {savingsPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── TWO-COLUMN GRID: Chart + Accounts ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 20 }}>

            {/* Chart card */}
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px 24px 16px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>الإنفاق اليومي</h3>
                <span style={{ fontSize: 11, color: "#b0a294" }}>هذا الشهر</span>
              </div>
              {dailyChartData.length > 0 ? (
                <div style={{ width: "100%", height: 150 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyChartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c8a96e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#c8a96e" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5d9e7c" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#5d9e7c" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="dayLabel" stroke="#ccc0b0" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ccc0b0" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="income"
                        name="income"
                        stroke="#5d9e7c"
                        strokeWidth={1.5}
                        fill="url(#incGrad)"
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        name="expense"
                        stroke="#c8a96e"
                        strokeWidth={2}
                        fill="url(#expGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  <TrendingUp size={28} color="#ddd6cc" />
                  <p style={{ fontSize: 12, color: "#b0a294", margin: 0 }}>لا توجد بيانات هذا الشهر</p>
                  <a href="/money?tab=transactions" style={{ fontSize: 11, color: "#c8a96e", textDecoration: "none" }}>أضف أول معاملة →</a>
                </div>
              )}
            </div>

            {/* Accounts card */}
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>الحسابات والمحافظ</h3>
                <a href="/money?tab=accounts" style={{ fontSize: 11, color: "#c8a96e", textDecoration: "none", fontWeight: 600 }}>
                  عرض الكل
                </a>
              </div>
              {hasAccounts ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {user.accounts.slice(0, 4).map((acc: any) => (
                    <div key={acc.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: "#f5f0ea",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: acc.color || "#c8a96e",
                        }}>
                          <RenderIcon name={acc.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#4a3d2e", display: "block" }}>{acc.name}</span>
                          <span style={{ fontSize: 10, color: "#b0a294" }}>{accountTypeAr[acc.type] || acc.type}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: acc.balance < 0 ? "#c97b6b" : "#2d2318", fontFamily: "monospace" }}>
                        {showBalance ? formatCurrency(acc.balance) : "••••"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 0" }}>
                  <Wallet size={28} color="#ddd6cc" />
                  <p style={{ fontSize: 12, color: "#b0a294", margin: 0, textAlign: "center" }}>لا توجد حسابات بعد</p>
                  <a href="/money?tab=accounts" style={{
                    fontSize: 11,
                    background: "#c8a96e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "6px 14px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}>
                    + أضف حسابًا
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── SMART INSIGHTS (if any) ── */}
          {insights.length > 0 && (
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px",
              marginBottom: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Sparkles size={15} color="#c8a96e" />
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>تحليلات ذكية</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {insights.map((ins) => (
                  <div key={ins.id} style={{
                    background: insightBg[ins.type] || "#f8f5f0",
                    border: `1px solid ${insightColors[ins.type]}22`,
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `${insightColors[ins.type]}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: insightColors[ins.type],
                      }}>
                        <RenderIcon name={ins.icon} className="w-4 h-4" />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#2d2318", margin: 0 }}>{ins.title}</p>
                    </div>
                    <p style={{ fontSize: 11, color: "#7a6e64", margin: 0, lineHeight: 1.5 }}>{ins.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CATEGORY BREAKDOWN ── */}
          {categoryBreakdown.length > 0 && (
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px",
              marginBottom: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>توزيع المصروفات</h3>
                <span style={{ fontSize: 11, color: "#b0a294" }}>{categoryBreakdown.length} فئة</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categoryBreakdown.slice(0, 5).map((cat, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: `${cat.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: cat.color,
                          fontSize: 12,
                        }}>
                          <RenderIcon name={cat.icon} className="w-3 h-3" />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#4a3d2e" }}>{cat.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#b0a294" }}>{cat.percentage.toFixed(1)}%</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#2d2318", fontFamily: "monospace" }}>
                          {showBalance ? formatCurrency(cat.amount) : "••••"}
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "#f0ebe4", borderRadius: 999, height: 5, overflow: "hidden" }}>
                      <div style={{
                        width: `${cat.percentage}%`,
                        height: "100%",
                        background: cat.color || "#c8a96e",
                        borderRadius: 999,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BUDGETS ── */}
          {budgetsWithSpent.length > 0 && (
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px",
              marginBottom: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>ميزانيات الشهر</h3>
                <a href="/money?tab=budgets" style={{ fontSize: 11, color: "#c8a96e", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                  إدارة الميزانيات
                  <ChevronLeft size={12} />
                </a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {budgetsWithSpent.slice(0, 4).map((b: any) => {
                  const pct = Math.min(100, b.progress || 0)
                  const isOver = pct >= 90
                  return (
                    <div key={b.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#4a3d2e" }}>{b.category?.name || "عام"}</span>
                        <span style={{ fontSize: 11, color: isOver ? "#c97b6b" : "#b0a294", fontFamily: "monospace" }}>
                          {showBalance ? `${formatCurrency(b.spent)} / ${formatCurrency(b.amount)}` : "•••• / ••••"}
                        </span>
                      </div>
                      <div style={{ background: "#f0ebe4", borderRadius: 999, height: 6, overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: isOver ? "#c97b6b" : pct >= 70 ? "#c8a96e" : "#5d9e7c",
                          borderRadius: 999,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                      <p style={{ fontSize: 10, color: isOver ? "#c97b6b" : "#c8a96e", marginTop: 3, textAlign: "left" }}>
                        {Math.round(pct)}%
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── GOALS ── */}
          {goals.length > 0 && (
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px",
              marginBottom: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>الأهداف المالية</h3>
                <a href="/life?tab=goals" style={{
                  fontSize: 11,
                  color: "#c8a96e",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontWeight: 600,
                }}>
                  عرض الكل
                  <ChevronLeft size={12} />
                </a>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {goals.slice(0, 3).map((g: any) => {
                  const pct = Math.min(100, Math.round(g.progress || 0))
                  return (
                    <div key={g.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: `${g.color || "#c8a96e"}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: g.color || "#c8a96e",
                          }}>
                            <RenderIcon name={g.icon} className="w-4 h-4" />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#4a3d2e" }}>{g.name}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#b0a294", fontFamily: "monospace" }}>
                          {showBalance ? `${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)}` : "•••• / ••••"}
                        </span>
                      </div>
                      <div style={{ background: "#f0ebe4", borderRadius: 999, height: 6, overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: pct >= 80 ? "#5d9e7c" : "#c8a96e",
                          borderRadius: 999,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <p style={{ fontSize: 10, color: "#c8a96e", margin: 0 }}>{pct}%</p>
                        {g.monthsRemaining && (
                          <p style={{ fontSize: 10, color: "#b0a294", margin: 0 }}>
                            {g.monthsRemaining} شهر متبقي
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── RECENT TRANSACTIONS ── */}
          <div style={{
            background: "#fff",
            border: "1px solid #ede7de",
            borderRadius: 20,
            padding: "24px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>أحدث المعاملات</h3>
              <a href="/money?tab=transactions" style={{
                fontSize: 11,
                color: "#c8a96e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontWeight: 600,
              }}>
                السجل الكامل
                <ChevronLeft size={12} />
              </a>
            </div>

            {hasTransactions ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {user.transactions.slice(0, 8).map((tx: any, idx: number) => (
                  <div key={tx.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: idx < 7 ? "1px solid #f0ebe4" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: tx.type === "income" ? "#edf5f0" : tx.type === "transfer" ? "#edf3fb" : "#fdf8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: tx.type === "income" ? "#5d9e7c" : tx.type === "transfer" ? "#4a90d9" : "#c8a96e",
                      }}>
                        <RenderIcon name={tx.category?.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#2d2318", marginBottom: 2 }}>
                          {tx.description || tx.category?.name || "معاملة"}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <p style={{ fontSize: 10, color: "#b0a294", margin: 0 }}>{tx.account?.name}</p>
                          <span style={{ color: "#ddd6cc", fontSize: 10 }}>·</span>
                          <p style={{ fontSize: 10, color: "#b0a294", margin: 0 }}>
                            {new Date(tx.date).toLocaleDateString("ar-EG", { day: "numeric", month: "short", numberingSystem: "latn" } as any)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: tx.type === "income" ? "#5d9e7c" : tx.type === "transfer" ? "#4a90d9" : "#c97b6b",
                    }}>
                      {tx.type === "income" ? "+" : tx.type === "transfer" ? "⇄" : "−"}{showBalance ? formatCurrency(tx.amount) : "••••"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "32px 0" }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "#f5f0ea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <FileText size={24} color="#c8a96e" />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#4a3d2e", margin: 0 }}>لا توجد معاملات بعد</p>
                <p style={{ fontSize: 12, color: "#b0a294", margin: 0, textAlign: "center" }}>
                  ابدأ بتسجيل دخلك ومصروفاتك لتتبع وضعك المالي
                </p>
                <a href="/money?tab=transactions" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#c8a96e",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(200,169,110,0.3)",
                }}>
                  <Plus size={14} />
                  إضافة أول معاملة
                </a>
              </div>
            )}
          </div>

          {/* ── SUBSCRIPTIONS SUMMARY ── */}
          {subscriptions.filter((s: any) => s.active).length > 0 && (
            <div style={{
              background: "#fff",
              border: "1px solid #ede7de",
              borderRadius: 20,
              padding: "24px",
              marginTop: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2d2318", margin: 0 }}>الاشتراكات النشطة</h3>
                <a href="/money?tab=subscriptions" style={{ fontSize: 11, color: "#c8a96e", textDecoration: "none", fontWeight: 600 }}>
                  إدارة الاشتراكات
                </a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {subscriptions.filter((s: any) => s.active).slice(0, 6).map((sub: any) => (
                  <div key={sub.id} style={{
                    background: "#f8f5f0",
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${sub.color || "#c8a96e"}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: sub.color || "#c8a96e",
                      flexShrink: 0,
                    }}>
                      <Cpu size={14} />
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#2d2318", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {sub.name}
                      </p>
                      <p style={{ fontSize: 10, color: "#c8a96e", margin: 0, fontFamily: "monospace" }}>
                        {showBalance ? formatCurrency(sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount) : "••••"}/شهر
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
