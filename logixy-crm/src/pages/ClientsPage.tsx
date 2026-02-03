import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowUpDown, Building2 } from 'lucide-react'
import type { Client } from '@/data/types'
import { mockClients } from '@/data/mockData'
import { ClientCard } from '@/components/ClientCard'

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  'New': 'default',
  'Potential': 'warning',
  'Active': 'success',
  'Lost': 'destructive',
  'Declined': 'outline',
  'Brings own': 'secondary',
  'Client left': 'destructive',
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Sort clients by holding for better organization
  const tableData = useMemo(() => {
    return [...clients].sort((a, b) => (a.holding || 'zzz').localeCompare(b.holding || 'zzz'))
  }, [clients])

  // Count holdings for display
  const holdingsCount = useMemo(() => {
    return new Set(clients.map(c => c.holding).filter(Boolean)).size
  }, [clients])

  const columns: ColumnDef<Client>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'edrpou',
      header: 'EDRPOU',
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue('edrpou')}</span>,
    },
    {
      accessorKey: 'vat',
      header: 'VAT',
      cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('vat')}</span>,
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant={statusColors[status] || 'default'}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sales',
      header: 'Sales',
    },
    {
      accessorKey: 'holding',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Building2 className="mr-2 h-4 w-4" />
          Holding
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const holding = row.getValue('holding') as string
        return holding ? (
          <span className="text-sm text-muted-foreground">{holding}</span>
        ) : (
          <span className="text-sm text-muted-foreground/50">—</span>
        )
      },
    },
    {
      accessorKey: 'companyType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('companyType')}</Badge>,
    },
    {
      accessorKey: 'directions',
      header: 'Directions',
      cell: ({ row }) => {
        const directions = row.getValue('directions') as string[]
        return (
          <div className="flex gap-1 flex-wrap">
            {directions.map(d => (
              <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'services',
      header: 'Services',
      cell: ({ row }) => {
        const services = row.getValue('services') as string[]
        return (
          <div className="flex gap-1 flex-wrap">
            {services.slice(0, 3).map(s => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
            {services.length > 3 && (
              <Badge variant="outline" className="text-xs">+{services.length - 3}</Badge>
            )}
          </div>
        )
      },
    },
  ]

  const handleRowClick = (client: Client) => {
    setSelectedClient(client)
    setIsEditing(false)
    setIsCardOpen(true)
  }

  const handleAddClient = () => {
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      code: `SM${String(clients.length + 1).padStart(6, '0')}`,
      name: '',
      edrpou: '',
      vat: '',
      city: 'Kyiv',
      status: 'New',
      sales: '',
      holding: '',
      lastContact: new Date().toISOString().split('T')[0],
      website: '',
      address: '',
      source: '',
      companyType: 'Trader',
      directions: [],
      services: [],
      cargo: '',
      whatShips: '',
      workingSince: '',
      notes: '',
      contacts: [],
    }
    setSelectedClient(newClient)
    setIsEditing(true)
    setIsCardOpen(true)
  }

  const handleSaveClient = (updatedClient: Client) => {
    const existingIndex = clients.findIndex(c => c.id === updatedClient.id)
    if (existingIndex >= 0) {
      const newClients = [...clients]
      newClients[existingIndex] = updatedClient
      setClients(newClients)
    } else {
      setClients([...clients, updatedClient])
    }
    setIsCardOpen(false)
    setSelectedClient(null)
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Clients</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your client database. {clients.length} clients total across {holdingsCount} holdings.
          </p>
        </div>
        <Button onClick={handleAddClient} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        searchKey="name"
        searchPlaceholder="Search clients..."
        onRowClick={handleRowClick}
      />

      {selectedClient && (
        <ClientCard
          client={selectedClient}
          isOpen={isCardOpen}
          onClose={() => {
            setIsCardOpen(false)
            setSelectedClient(null)
          }}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSave={handleSaveClient}
        />
      )}
    </div>
  )
}
