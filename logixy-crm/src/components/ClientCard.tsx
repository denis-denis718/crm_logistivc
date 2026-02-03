import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  User,
} from 'lucide-react'
import type { Client, Contact } from '@/data/types'
import { cities, statuses, companyTypes, directions, services, employees, holdings } from '@/data/mockData'

interface ClientCardProps {
  client: Client
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  onEditToggle: () => void
  onSave: (client: Client) => void
}

export function ClientCard({
  client,
  isOpen,
  onClose,
  isEditing,
  onEditToggle,
  onSave,
}: ClientCardProps) {
  const [editedClient, setEditedClient] = useState<Client>(client)

  useEffect(() => {
    setEditedClient(client)
  }, [client])

  const handleSave = () => {
    onSave(editedClient)
  }

  const handleFieldChange = (field: keyof Client, value: unknown) => {
    setEditedClient(prev => ({ ...prev, [field]: value }))
  }

  const handleDirectionToggle = (direction: string) => {
    const current = editedClient.directions
    const updated = current.includes(direction as any)
      ? current.filter(d => d !== direction)
      : [...current, direction as any]
    handleFieldChange('directions', updated)
  }

  const handleServiceToggle = (service: string) => {
    const current = editedClient.services
    const updated = current.includes(service as any)
      ? current.filter(s => s !== service)
      : [...current, service as any]
    handleFieldChange('services', updated)
  }

  const handleAddContact = () => {
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: '',
      position: '',
      phone: '',
      email: '',
    }
    handleFieldChange('contacts', [...editedClient.contacts, newContact])
  }

  const handleContactChange = (contactId: string, field: keyof Contact, value: string) => {
    const updated = editedClient.contacts.map(c =>
      c.id === contactId ? { ...c, [field]: value } : c
    )
    handleFieldChange('contacts', updated)
  }

  const handleRemoveContact = (contactId: string) => {
    handleFieldChange('contacts', editedClient.contacts.filter(c => c.id !== contactId))
  }

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
    'New': 'default',
    'Potential': 'warning',
    'Active': 'success',
    'Lost': 'destructive',
    'Declined': 'outline',
    'Brings own': 'secondary',
    'Client left': 'destructive',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-xl">
                {isEditing && !editedClient.name ? 'New Client' : editedClient.name || 'Client Details'}
              </DialogTitle>
              <Badge variant={statusColors[editedClient.status]}>{editedClient.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={onEditToggle}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={onEditToggle}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="font-mono">{editedClient.code}</span>
            <span>•</span>
            <span>{editedClient.companyType}</span>
            {editedClient.holding && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {editedClient.holding}
                </span>
              </>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="general" className="px-6 py-4">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contacts">Contacts ({editedClient.contacts.length})</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedClient.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2">{editedClient.name || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <p className="text-sm py-2 font-mono">{editedClient.code}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edrpou">EDRPOU</Label>
                  {isEditing ? (
                    <Input
                      id="edrpou"
                      value={editedClient.edrpou}
                      onChange={(e) => handleFieldChange('edrpou', e.target.value)}
                      maxLength={8}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">{editedClient.edrpou || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat">VAT</Label>
                  {isEditing ? (
                    <Input
                      id="vat"
                      value={editedClient.vat}
                      onChange={(e) => handleFieldChange('vat', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 font-mono">{editedClient.vat || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.city}
                      onValueChange={(value) => handleFieldChange('city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {editedClient.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.status}
                      onValueChange={(value) => handleFieldChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="py-2">
                      <Badge variant={statusColors[editedClient.status]}>{editedClient.status}</Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sales">Sales Representative</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.sales}
                      onValueChange={(value) => handleFieldChange('sales', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales rep" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {editedClient.sales || '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holding">Holding</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.holding || 'No Holding'}
                      onValueChange={(value) => handleFieldChange('holding', value === 'No Holding' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select holding" />
                      </SelectTrigger>
                      <SelectContent>
                        {holdings.map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {editedClient.holding || '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType">Company Type</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.companyType}
                      onValueChange={(value) => handleFieldChange('companyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {companyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2">{editedClient.companyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  {isEditing ? (
                    <Input
                      id="source"
                      value={editedClient.source}
                      onChange={(e) => handleFieldChange('source', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2">{editedClient.source || '—'}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={editedClient.website}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {editedClient.website ? (
                        <a href={editedClient.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {editedClient.website}
                        </a>
                      ) : '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedClient.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2">{editedClient.address || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastContact">Last Contact</Label>
                  {isEditing ? (
                    <Input
                      id="lastContact"
                      type="date"
                      value={editedClient.lastContact}
                      onChange={(e) => handleFieldChange('lastContact', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {editedClient.lastContact || '—'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingSince">Working Since</Label>
                  {isEditing ? (
                    <Input
                      id="workingSince"
                      type="date"
                      value={editedClient.workingSince}
                      onChange={(e) => handleFieldChange('workingSince', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {editedClient.workingSince || 'Not yet'}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              {isEditing && (
                <Button variant="outline" onClick={handleAddContact}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              )}

              {editedClient.contacts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No contacts added yet.</p>
              ) : (
                <div className="space-y-4">
                  {editedClient.contacts.map((contact, index) => (
                    <div key={contact.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Contact #{index + 1}</span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          {isEditing ? (
                            <Input
                              value={contact.fullName}
                              onChange={(e) => handleContactChange(contact.id, 'fullName', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm py-2 font-medium">{contact.fullName || '—'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          {isEditing ? (
                            <Input
                              value={contact.position}
                              onChange={(e) => handleContactChange(contact.id, 'position', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm py-2">{contact.position || '—'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          {isEditing ? (
                            <Input
                              value={contact.phone}
                              onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm py-2 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {contact.phone || '—'}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          {isEditing ? (
                            <Input
                              value={contact.email}
                              onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm py-2 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {contact.email ? (
                                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                                  {contact.email}
                                </a>
                              ) : '—'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Directions</Label>
                  <div className="flex gap-4">
                    {directions.map(direction => (
                      <div key={direction} className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Checkbox
                              id={`direction-${direction}`}
                              checked={editedClient.directions.includes(direction)}
                              onCheckedChange={() => handleDirectionToggle(direction)}
                            />
                            <Label htmlFor={`direction-${direction}`} className="font-normal">
                              {direction}
                            </Label>
                          </>
                        ) : (
                          <Badge
                            variant={editedClient.directions.includes(direction) ? 'default' : 'outline'}
                            className={!editedClient.directions.includes(direction) ? 'opacity-30' : ''}
                          >
                            {direction}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Services</Label>
                  <div className="flex gap-4 flex-wrap">
                    {services.map(service => (
                      <div key={service} className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Checkbox
                              id={`service-${service}`}
                              checked={editedClient.services.includes(service)}
                              onCheckedChange={() => handleServiceToggle(service)}
                            />
                            <Label htmlFor={`service-${service}`} className="font-normal">
                              {service}
                            </Label>
                          </>
                        ) : (
                          <Badge
                            variant={editedClient.services.includes(service) ? 'secondary' : 'outline'}
                            className={!editedClient.services.includes(service) ? 'opacity-30' : ''}
                          >
                            {service}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo Types</Label>
                  {isEditing ? (
                    <Input
                      id="cargo"
                      value={editedClient.cargo}
                      onChange={(e) => handleFieldChange('cargo', e.target.value)}
                      placeholder="e.g., Electronics, machinery, food products"
                    />
                  ) : (
                    <p className="text-sm py-2">{editedClient.cargo || '—'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatShips">What Ships (if not with us)</Label>
                  {isEditing ? (
                    <Input
                      id="whatShips"
                      value={editedClient.whatShips}
                      onChange={(e) => handleFieldChange('whatShips', e.target.value)}
                      placeholder="Description of their current shipping arrangements"
                    />
                  ) : (
                    <p className="text-sm py-2">{editedClient.whatShips || '—'}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                {isEditing ? (
                  <Textarea
                    id="notes"
                    value={editedClient.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    rows={6}
                    placeholder="Add notes about this client..."
                  />
                ) : (
                  <div className="text-sm py-2 whitespace-pre-wrap border rounded-md p-3 min-h-[100px] bg-muted/30">
                    {editedClient.notes || 'No notes yet.'}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
