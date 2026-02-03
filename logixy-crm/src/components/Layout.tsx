import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Users, FileText, LayoutDashboard } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Quotations', href: '/quotations', icon: FileText },
]

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-[#0a0e27] text-white">
        <div className="flex h-14 items-center px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00d4ff] text-[#0a0e27]">
              <span className="text-sm font-bold">L</span>
            </div>
            <span className="text-lg">Logixy CRM</span>
          </Link>
          <nav className="ml-8 flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-[#00d4ff]/20 text-[#00d4ff]"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-400">Prototype v1.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
