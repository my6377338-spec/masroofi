"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Home,
  Wallet,
  Compass,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react"

interface SidebarProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export default function Sidebar({ user = { name: "مروان سيد", email: "user@masroofi.local" } }: SidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "الرئيسية", href: "/dashboard", icon: Home, exact: true },
    { name: "المال", href: "/money", icon: Wallet },
    { name: "حياتي", href: "/life", icon: Compass },
    { name: "التحليلات", href: "/analytics", icon: BarChart3 },
    { name: "الإعدادات", href: "/settings", icon: Settings },
  ]

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return pathname === path
    return pathname.startsWith(path)
  }

  const sidebarStyle: React.CSSProperties = {
    position: "fixed",
    right: 0,
    top: 0,
    height: "100%",
    width: 224,
    background: "#faf7f3",
    borderLeft: "1px solid #ede7de",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "28px 20px",
    direction: "rtl",
  }

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    marginBottom: 32,
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex" style={sidebarStyle}>
        <div>
          {/* Logo */}
          <a href="/dashboard" style={logoStyle}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "#c8a96e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(200,169,110,0.3)",
            }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>م</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#2d2318" }}>مصروفي</span>
          </a>

          {/* Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact)
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    background: active ? "#fff" : "transparent",
                    color: active ? "#2d2318" : "#9b8f82",
                    boxShadow: active ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
                    border: active ? "1px solid #ede7de" : "1px solid transparent",
                    transition: "all 0.18s",
                  }}
                >
                  <Icon
                    size={16}
                    color={active ? "#c8a96e" : "#b0a294"}
                  />
                  <span>{item.name}</span>
                </a>
              )
            })}
          </nav>
        </div>

        {/* User badge */}
        <div style={{
          paddingTop: 20,
          borderTop: "1px solid #ede7de",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#f0ebe4",
            border: "2px solid #ddd6cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#c8a96e",
            flexShrink: 0,
          }}>
            {user?.name ? user.name.slice(0, 1) : "م"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#2d2318", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 10, color: "#b0a294", margin: 0 }}>حساب شخصي</p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden" style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "#faf7f3",
        borderBottom: "1px solid #ede7de",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        direction: "rtl",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: "#c8a96e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>م</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#2d2318" }}>مصروفي</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9b8f82" }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{
          position: "fixed",
          inset: 0,
          top: 57,
          background: "#faf7f3",
          zIndex: 40,
          padding: "20px",
          direction: "rtl",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  background: active ? "#fff" : "transparent",
                  color: active ? "#2d2318" : "#9b8f82",
                  border: active ? "1px solid #ede7de" : "1px solid transparent",
                }}
              >
                <Icon size={18} color={active ? "#c8a96e" : "#b0a294"} />
                <span>{item.name}</span>
              </a>
            )
          })}
        </div>
      )}
    </>
  )
}
