import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  TrendingUp,
  Building2,
  DollarSign,
  ArrowRight,
  Ship,
  MapPin,
  Activity,
} from 'lucide-react'
import { mockClients, mockQuotations } from '@/data/mockData'

export function DashboardPage() {
  // Calculate statistics
  const stats = useMemo(() => {
    const activeClients = mockClients.filter(c => c.status === 'Active').length
    const potentialClients = mockClients.filter(c => c.status === 'Potential' || c.status === 'New').length
    const totalRevenue = mockQuotations.reduce((sum, q) => sum + q.total, 0)
    const avgQuotation = totalRevenue / mockQuotations.length
    const holdings = new Set(mockClients.map(c => c.holding).filter(Boolean)).size

    // Recent quotations
    const recentQuotations = [...mockQuotations]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)

    // Status distribution
    const statusCounts = mockClients.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top routes
    const routeCounts = mockQuotations.reduce((acc, q) => {
      const route = `${q.from} → ${q.to}`
      acc[route] = (acc[route] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topRoutes = Object.entries(routeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      totalClients: mockClients.length,
      activeClients,
      potentialClients,
      totalQuotations: mockQuotations.length,
      totalRevenue,
      avgQuotation,
      holdings,
      recentQuotations,
      statusCounts,
      topRoutes,
    }
  }, [])

  const statusColors: Record<string, string> = {
    'New': 'bg-blue-500',
    'Potential': 'bg-yellow-500',
    'Active': 'bg-green-500',
    'Lost': 'bg-red-500',
    'Declined': 'bg-gray-500',
    'Brings own': 'bg-purple-500',
    'Client left': 'bg-red-400',
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to Logixy CRM. Overview of your logistics operations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeClients} active, {stats.potentialClients} potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.holdings}</div>
            <p className="text-xs text-muted-foreground">Client groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotations}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg ${Math.round(stats.avgQuotation).toLocaleString()} per quote
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Client Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                    <span className="text-sm">{status}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/clients">
                View All Clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Quotations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Quotations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentQuotations.map(q => (
                <div key={q.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{q.clientName || 'No Client'}</div>
                    <div className="text-xs text-muted-foreground">
                      {q.from} → {q.to}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">${q.total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{q.date}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/quotations">
                View All Quotations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topRoutes.map(([route, count], index) => (
                <div key={route} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">#{index + 1}</span>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[120px] sm:max-w-[180px]">{route}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/clients">
                <Users className="mr-2 h-4 w-4" />
                Add New Client
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full sm:w-auto">
              <Link to="/quotations">
                <FileText className="mr-2 h-4 w-4" />
                Create Quotation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
