import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, ArrowUpDown, Search, TrendingUp, TrendingDown, Minus, Ship } from 'lucide-react'
import type { Quotation, ContainerType, RateSearchResult } from '@/data/types'
import { mockQuotations, containerTypes, generateRateSearchResults } from '@/data/mockData'
import { QuotationCard } from '@/components/QuotationCard'

export function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [monthFilter, setMonthFilter] = useState<string>('all')

  // Rate Search State
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [searchType, setSearchType] = useState<ContainerType>("40'")
  const [rateResults, setRateResults] = useState<RateSearchResult[]>([])
  const [showRateResults, setShowRateResults] = useState(false)

  // Filter by month
  const filteredQuotations = useMemo(() => {
    if (monthFilter === 'all') return quotations
    return quotations.filter(q => q.date.startsWith(monthFilter))
  }, [quotations, monthFilter])

  // Get unique months for filter
  const availableMonths = useMemo(() => {
    const months = new Set(quotations.map(q => q.date.substring(0, 7)))
    return Array.from(months).sort().reverse()
  }, [quotations])

  const columns: ColumnDef<Quotation>[] = [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue('code')}</span>,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => <span className="font-medium">{row.getValue('clientName')}</span>,
    },
    {
      accessorKey: 'from',
      header: 'From',
    },
    {
      accessorKey: 'to',
      header: 'To',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total (USD)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">${(row.getValue('total') as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'shippingLine',
      header: 'Line',
      cell: ({ row }) => {
        const line = row.getValue('shippingLine') as string
        return line ? (
          <Badge variant="secondary" className="text-xs">
            <Ship className="mr-1 h-3 w-3" />
            {line}
          </Badge>
        ) : '—'
      },
    },
    {
      accessorKey: 'sales',
      header: 'Sales',
    },
    {
      accessorKey: 'transit',
      header: 'Transit',
      cell: ({ row }) => <span>{row.getValue('transit')} days</span>,
    },
  ]

  const handleRowClick = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setIsEditing(false)
    setIsCardOpen(true)
  }

  const handleCreateQuotation = () => {
    const newQuotation: Quotation = {
      id: Math.random().toString(36).substr(2, 9),
      code: `QT${String(quotations.length + 1).padStart(6, '0')}`,
      date: new Date().toISOString().split('T')[0],
      from: '',
      to: '',
      type: "40'",
      freight: 0,
      dpp: 0,
      forwarding: 0,
      t1: 0,
      auto: 0,
      rail: 0,
      total: 0,
      shippingLine: '',
      agent: '',
      sales: '',
      transit: 0,
    }
    setSelectedQuotation(newQuotation)
    setIsEditing(true)
    setIsCardOpen(true)
  }

  const handleSaveQuotation = (updatedQuotation: Quotation) => {
    const existingIndex = quotations.findIndex(q => q.id === updatedQuotation.id)
    if (existingIndex >= 0) {
      const newQuotations = [...quotations]
      newQuotations[existingIndex] = updatedQuotation
      setQuotations(newQuotations)
    } else {
      setQuotations([...quotations, updatedQuotation])
    }
    setIsCardOpen(false)
    setSelectedQuotation(null)
  }

  const handleRateSearch = () => {
    if (searchFrom && searchTo) {
      const results = generateRateSearchResults(searchFrom, searchTo, searchType)
      setRateResults(results)
      setShowRateResults(true)
    }
  }

  // Calculate recommended price based on results
  const recommendedPrice = useMemo(() => {
    if (rateResults.length === 0) return null
    const prices = rateResults.map(r => r.price)
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    const recent = prices.slice(-5)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const trend = recentAvg > avg ? 'up' : recentAvg < avg ? 'down' : 'stable'
    return {
      average: Math.round(avg),
      recent: Math.round(recentAvg),
      trend,
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [rateResults])

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Quotations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage quotations and search historical rates. {filteredQuotations.length} quotations shown.
          </p>
        </div>
        <Button onClick={handleCreateQuotation} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {/* Rate Search Widget */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Rate Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="searchFrom">From</Label>
              <Input
                id="searchFrom"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                placeholder="e.g., Shanghai, China"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchTo">To</Label>
              <Input
                id="searchTo"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                placeholder="e.g., Odesa, Ukraine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchType">Type</Label>
              <Select value={searchType} onValueChange={(v) => setSearchType(v as ContainerType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {containerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="hidden lg:block">&nbsp;</Label>
              <Button onClick={handleRateSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search Rates
              </Button>
            </div>
          </div>

          {showRateResults && recommendedPrice && (
            <div className="mt-4 sm:mt-6 border-t pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                <div className="col-span-2 sm:col-span-1 text-center p-3 sm:p-4 bg-primary/10 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    ${recommendedPrice.recent.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                    Recommended
                    {recommendedPrice.trend === 'up' && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
                    {recommendedPrice.trend === 'down' && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />}
                    {recommendedPrice.trend === 'stable' && <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="text-lg sm:text-xl font-semibold">${recommendedPrice.average.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">30-Day Avg</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="text-lg sm:text-xl font-semibold">${recommendedPrice.min.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Lowest</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="text-lg sm:text-xl font-semibold">${recommendedPrice.max.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Highest</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="text-lg sm:text-xl font-semibold">{rateResults.length}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Data Points</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs sm:text-sm font-medium mb-2">Historical Prices (Last Month)</div>
                <div className="flex gap-0.5 sm:gap-1 items-end h-16 sm:h-20">
                  {rateResults.map((result, index) => {
                    const height = ((result.price - recommendedPrice.min) / (recommendedPrice.max - recommendedPrice.min)) * 100 || 10
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-primary/60 hover:bg-primary transition-colors rounded-t cursor-pointer"
                        style={{ height: `${Math.max(height, 10)}%` }}
                        title={`${result.date}: $${result.price} (${result.shippingLine})`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <Label className="text-sm">Filter by Month:</Label>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {availableMonths.map(month => (
              <SelectItem key={month} value={month}>
                {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredQuotations}
        searchPlaceholder="Search quotations..."
        onRowClick={handleRowClick}
      />

      {selectedQuotation && (
        <QuotationCard
          quotation={selectedQuotation}
          isOpen={isCardOpen}
          onClose={() => {
            setIsCardOpen(false)
            setSelectedQuotation(null)
          }}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSave={handleSaveQuotation}
        />
      )}
    </div>
  )
}
