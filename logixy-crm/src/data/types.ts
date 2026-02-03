export type ClientStatus = 'New' | 'Potential' | 'Active' | 'Lost' | 'Declined' | 'Brings own' | 'Client left'
export type CompanyType = 'Forwarder' | 'Broker' | 'Manufacturer' | 'Trader'
export type Direction = 'Import' | 'Export' | 'Transit'
export type Service = 'Freight' | 'Auto' | 'FTL' | 'Rail' | 'LCL' | 'Air'
export type City = 'Kyiv' | 'Odesa' | 'Kharkiv' | 'Dnipro' | 'Lviv'
export type ContainerType = "20'" | "40'" | "40HC" | "Tent"

export interface Contact {
  id: string
  fullName: string
  position: string
  phone: string
  email: string
}

export interface Client {
  id: string
  code: string
  name: string
  edrpou: string
  vat: string
  city: City
  status: ClientStatus
  sales: string
  holding: string
  lastContact: string
  website: string
  address: string
  source: string
  companyType: CompanyType
  directions: Direction[]
  services: Service[]
  cargo: string
  whatShips: string
  workingSince: string
  notes: string
  contacts: Contact[]
}

export interface Quotation {
  id: string
  code: string
  date: string
  from: string
  to: string
  type: ContainerType
  freight: number
  dpp: number
  forwarding: number
  t1: number
  auto: number
  rail: number
  total: number
  shippingLine: string
  agent: string
  sales: string
  transit: number
  clientId?: string
  clientName?: string
}

export interface RateSearchResult {
  date: string
  from: string
  to: string
  type: ContainerType
  price: number
  shippingLine: string
}
