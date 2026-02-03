import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Edit,
  Save,
  X,
  Ship,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User,
  Building,
} from 'lucide-react'
import type { Quotation, ContainerType } from '@/data/types'
import { containerTypes, shippingLines, agents, employees, mockClients } from '@/data/mockData'

interface QuotationCardProps {
  quotation: Quotation
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  onEditToggle: () => void
  onSave: (quotation: Quotation) => void
}

export function QuotationCard({
  quotation,
  isOpen,
  onClose,
  isEditing,
  onEditToggle,
  onSave,
}: QuotationCardProps) {
  const [editedQuotation, setEditedQuotation] = useState<Quotation>(quotation)

  useEffect(() => {
    setEditedQuotation(quotation)
  }, [quotation])

  // Auto-calculate total
  const calculatedTotal = useMemo(() => {
    return (
      editedQuotation.freight +
      editedQuotation.dpp +
      editedQuotation.forwarding +
      editedQuotation.t1 +
      editedQuotation.auto +
      editedQuotation.rail
    )
  }, [
    editedQuotation.freight,
    editedQuotation.dpp,
    editedQuotation.forwarding,
    editedQuotation.t1,
    editedQuotation.auto,
    editedQuotation.rail,
  ])

  useEffect(() => {
    if (editedQuotation.total !== calculatedTotal) {
      setEditedQuotation(prev => ({ ...prev, total: calculatedTotal }))
    }
  }, [calculatedTotal, editedQuotation.total])

  const handleSave = () => {
    onSave({ ...editedQuotation, total: calculatedTotal })
  }

  const handleFieldChange = (field: keyof Quotation, value: unknown) => {
    setEditedQuotation(prev => ({ ...prev, [field]: value }))
  }

  const handleNumberChange = (field: keyof Quotation, value: string) => {
    const numValue = parseFloat(value) || 0
    handleFieldChange(field, numValue)
  }

  const handleClientChange = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId)
    if (client) {
      handleFieldChange('clientId', clientId)
      handleFieldChange('clientName', client.name)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] w-[95vw] sm:w-full p-0">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <DialogTitle className="text-lg sm:text-xl">
                {isEditing && !editedQuotation.from ? 'New Quotation' : 'Quotation Details'}
              </DialogTitle>
              <Badge variant="outline">{editedQuotation.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={onEditToggle}>
                    <X className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={onEditToggle}>
                  <Edit className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-2 flex-wrap">
            <span className="font-mono">{editedQuotation.code}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {editedQuotation.date}
            </span>
            {editedQuotation.clientName && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {editedQuotation.clientName}
                </span>
              </>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] sm:max-h-[calc(90vh-120px)]">
          <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-4 sm:space-y-6">
            {/* Route Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4" />
                Route Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  {isEditing ? (
                    <Input
                      id="from"
                      value={editedQuotation.from}
                      onChange={(e) => handleFieldChange('from', e.target.value)}
                      placeholder="e.g., Shanghai, China"
                    />
                  ) : (
                    <p className="text-sm py-2">{editedQuotation.from || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  {isEditing ? (
                    <Input
                      id="to"
                      value={editedQuotation.to}
                      onChange={(e) => handleFieldChange('to', e.target.value)}
                      placeholder="e.g., Odesa, Ukraine"
                    />
                  ) : (
                    <p className="text-sm py-2">{editedQuotation.to || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Container Type</Label>
                  {isEditing ? (
                    <Select
                      value={editedQuotation.type}
                      onValueChange={(value) => handleFieldChange('type', value as ContainerType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {containerTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="py-2">
                      <Badge variant="outline">{editedQuotation.type}</Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transit">Transit Time (days)</Label>
                  {isEditing ? (
                    <Input
                      id="transit"
                      type="number"
                      value={editedQuotation.transit}
                      onChange={(e) => handleNumberChange('transit', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {editedQuotation.transit} days
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <DollarSign className="h-4 w-4" />
                Pricing (USD)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freight">Freight</Label>
                  {isEditing ? (
                    <Input
                      id="freight"
                      type="number"
                      value={editedQuotation.freight}
                      onChange={(e) => handleNumberChange('freight', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">${editedQuotation.freight.toLocaleString()}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpp">DPP</Label>
                  {isEditing ? (
                    <Input
                      id="dpp"
                      type="number"
                      value={editedQuotation.dpp}
                      onChange={(e) => handleNumberChange('dpp', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">${editedQuotation.dpp.toLocaleString()}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forwarding">Forwarding</Label>
                  {isEditing ? (
                    <Input
                      id="forwarding"
                      type="number"
                      value={editedQuotation.forwarding}
                      onChange={(e) => handleNumberChange('forwarding', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">${editedQuotation.forwarding.toLocaleString()}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="t1">T1</Label>
                  {isEditing ? (
                    <Input
                      id="t1"
                      type="number"
                      value={editedQuotation.t1}
                      onChange={(e) => handleNumberChange('t1', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">${editedQuotation.t1.toLocaleString()}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto">Auto</Label>
                  {isEditing ? (
                    <Input
                      id="auto"
                      type="number"
                      value={editedQuotation.auto}
                      onChange={(e) => handleNumberChange('auto', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">${editedQuotation.auto.toLocaleString()}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rail">Rail</Label>
                  {isEditing ? (
                    <Input
                      id="rail"
                      type="number"
                      value={editedQuotation.rail}
                      onChange={(e) => handleNumberChange('rail', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">${editedQuotation.rail.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-3 bg-primary/10 rounded-lg p-3 sm:p-4 mt-2 sm:mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    ${calculatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Providers Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <Ship className="h-4 w-4" />
                Providers & Assignment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingLine">Shipping Line</Label>
                  {isEditing ? (
                    <Select
                      value={editedQuotation.shippingLine || 'none'}
                      onValueChange={(value) => handleFieldChange('shippingLine', value === 'none' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping line" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {shippingLines.map(line => (
                          <SelectItem key={line} value={line}>{line}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2">
                      {editedQuotation.shippingLine ? (
                        <Badge variant="secondary">
                          <Ship className="mr-1 h-3 w-3" />
                          {editedQuotation.shippingLine}
                        </Badge>
                      ) : '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Agent</Label>
                  {isEditing ? (
                    <Select
                      value={editedQuotation.agent || 'none'}
                      onValueChange={(value) => handleFieldChange('agent', value === 'none' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {agents.map(agent => (
                          <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2">{editedQuotation.agent || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sales">Sales Representative</Label>
                  {isEditing ? (
                    <Select
                      value={editedQuotation.sales || 'none'}
                      onValueChange={(value) => handleFieldChange('sales', value === 'none' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales rep" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {employees.map(emp => (
                          <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {editedQuotation.sales || '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  {isEditing ? (
                    <Select
                      value={editedQuotation.clientId || 'none'}
                      onValueChange={(value) => value !== 'none' && handleClientChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {mockClients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} ({client.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {editedQuotation.clientName || '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  {isEditing ? (
                    <Input
                      id="date"
                      type="date"
                      value={editedQuotation.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {editedQuotation.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
