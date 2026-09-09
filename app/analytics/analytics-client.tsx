"use client"

import Sidebar from "@/components/layout/sidebar"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface AnalyticsClientProps {
  user: any
  metrics: {
    monthlyIncome: number
    monthlyExpenses: number
    monthlySavings: number
  }
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ede7de",
  borderRadius: 20,
  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
}

export default function AnalyticsClient({ user, metrics }: AnalyticsClientProps) {
  const { monthlyIncome, monthlyExpenses, monthlySavings } = metrics
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0

  const chartData = [
    { name: "الدخل", value: monthlyIncome, color: "#5d9e7c" },
    { name: "المصروفات", value: monthlyExpenses, color: "#c97b6b" },
    { name: "الادخار", value: Math.max(0, monthlySavings), color: "#c8a96e" },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#fff", border: "1px solid #ede7de", borderRadius: 10, padding: "8px 14px", fontSize: 12 }}>
          <p style={{ color: "#2d2318", fontWeight: 600, fontFamily: "monospace" }}>{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0ea", color: "#2d2318", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
      <Sidebar user={user} />

      <main style={{ marginRight: 224, minHeight: "100vh", paddingBottom: 60 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 32px" }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, color: "#b0a294", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>رؤى مالية</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2d2318", margin: 0 }}>التحليلات</h1>
          </div>

          {/* ── KPI CARDS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
            <div style={{ ...card, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "#b0a294", margin: 0 }}>الدخل هذا الشهر</p>
                <ArrowUpRight size={16} color="#5d9e7c" />
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#5d9e7c", fontFamily: "monospace", margin: 0 }}>
                {formatCurrency(monthlyIncome)}
              </p>
            </div>

            <div style={{ ...card, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "#b0a294", margin: 0 }}>المصروفات</p>
                <ArrowDownRight size={16} color="#c97b6b" />
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#c97b6b", fontFamily: "monospace", margin: 0 }}>
                {formatCurrency(monthlyExpenses)}
              </p>
              <p style={{ fontSize: 10, color: "#b0a294", marginTop: 6 }}>
                {monthlyExpenses > 0 ? `${((monthlyExpenses / Math.max(monthlyIncome, 1)) * 100).toFixed(0)}% من الدخل` : "لا يوجد إنفاق"}
              </p>
            </div>

            <div style={{ ...card, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "#b0a294", margin: 0 }}>معدل الادخار</p>
                <PiggyBank size={16} color="#c8a96e" />
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#c8a96e", fontFamily: "monospace", margin: 0 }}>
                {savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* ── BAR CHART ── */}
          <div style={{ ...card, padding: "28px 24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2318", marginBottom: 24 }}>ملخص الشهر الحالي</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={40}>
                  <XAxis dataKey="name" stroke="#ccc0b0" fontSize={12} tickLine={false} axisLine={false} fontFamily="Cairo" />
                  <YAxis stroke="#ccc0b0" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── SAVINGS RATE METER ── */}
          <div style={{ ...card, padding: "28px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2318", margin: 0 }}>معدل الادخار الفعلي</h3>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#c8a96e", fontFamily: "monospace" }}>{savingsRate.toFixed(1)}%</span>
            </div>
            <div style={{ background: "#f0ebe4", borderRadius: 999, height: 10, overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(100, savingsRate)}%`, height: "100%",
                background: savingsRate >= 20 ? "#5d9e7c" : "#c8a96e",
                borderRadius: 999, transition: "width 0.8s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#b0a294" }}>
              <span>0%</span>
              <span style={{ color: "#5d9e7c" }}>المستهدف: 20%</span>
              <span>100%</span>
            </div>
            <p style={{ fontSize: 12, color: "#9b8f82", marginTop: 16, lineHeight: 1.8 }}>
              {savingsRate >= 20
                ? `ممتاز! معدل ادخارك ${savingsRate.toFixed(1)}% يتجاوز الهدف الموصى به. استمر في هذا الأداء الرائع.`
                : `معدل ادخارك ${savingsRate.toFixed(1)}%. راجع نفقاتك لتحسين هذا المعدل نحو 20%.`
              }
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}
