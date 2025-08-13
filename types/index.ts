// Core types for the Price Comparison Application

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  keywords?: string[]
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Supplier {
  id: number
  name: string
  url: string
  status: 'active' | 'pending' | 'inactive' | 'error'
  apiKey?: string
  searchPatterns?: string[]
  lastScrapedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface PriceData {
  [productId: number]: {
    [supplierId: number]: number | null
  }
}

export interface PriceEntry {
  productId: number
  supplierId: number
  price: number | null
  currency: string
  availability: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown'
  lastUpdated: Date
  confidence: number // 0-1, how confident we are in this price
  url?: string // Direct link to the product page
}

export interface ScrapingJob {
  id: string
  productId: number
  supplierId: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt?: Date
  completedAt?: Date
  error?: string
  retryCount: number
  nextRetryAt?: Date
}

export interface ScrapingConfig {
  supplierId: number
  baseUrl: string
  searchPatterns: {
    productName?: string
    sku?: string
    price?: string
    availability?: string
  }
  selectors: {
    searchBox?: string
    priceElement?: string
    availabilityElement?: string
    productTitle?: string
  }
  requestConfig: {
    headers?: Record<string, string>
    userAgent?: string
    delay?: number // ms between requests
    retries?: number
  }
}

export interface AppState {
  products: Product[]
  suppliers: Supplier[]
  priceData: PriceData
  selectedProducts: number[]
  selectedSuppliers: number[]
  lastUpdated: Date
  isLoading: boolean
  scrapingJobs: ScrapingJob[]
}

export interface DashboardStats {
  totalProducts: number
  activeSuppliers: number
  averageSavings: string
  lastUpdated: string
  totalScrapingJobs: number
  successfulScrapingJobs: number
  errorRate: number
}

export interface PriceComparison {
  productId: number
  product: Product
  prices: Array<{
    supplier: Supplier
    price: number | null
    isLowest: boolean
    isHighest: boolean
    priceEntry?: PriceEntry
  }>
  bestPrice?: {
    supplier: Supplier
    price: number
  }
  worstPrice?: {
    supplier: Supplier
    price: number
  }
  savings: {
    amount: number
    percentage: number
  }
}

export interface ExportData {
  metadata: {
    exportedAt: string
    version: string
    totalProducts: number
    totalSuppliers: number
  }
  products: Product[]
  suppliers: Supplier[]
  priceData: PriceData
  priceEntries?: PriceEntry[]
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Form types
export interface ProductFormData {
  name: string
  sku: string
  category: string
  keywords?: string[]
  description?: string
}

export interface SupplierFormData {
  name: string
  url: string
  apiKey?: string
  searchPatterns?: string[]
}

export interface ScrapingConfigFormData {
  supplierId: number
  searchPatterns: {
    productName?: string
    sku?: string
    price?: string
    availability?: string
  }
  selectors: {
    searchBox?: string
    priceElement?: string
    availabilityElement?: string
    productTitle?: string
  }
}

// Event types
export interface ScrapingEvent {
  type: 'job_started' | 'job_completed' | 'job_failed' | 'price_updated'
  jobId: string
  productId: number
  supplierId: number
  timestamp: Date
  data?: any
}

// Hook types for external integration
export interface PriceScraperHooks {
  onPriceUpdated?: (productId: number, supplierId: number, price: number | null) => void
  onScrapingStarted?: (jobId: string, productId: number, supplierId: number) => void
  onScrapingCompleted?: (jobId: string, success: boolean, error?: string) => void
  onProductAdded?: (product: Product) => void
  onSupplierAdded?: (supplier: Supplier) => void
  beforeScraping?: (config: ScrapingConfig) => Promise<boolean>
  afterScraping?: (result: PriceEntry) => void
}

// Configuration types
export interface AppConfig {
  scraping: {
    defaultDelay: number
    maxRetries: number
    timeout: number
    userAgent: string
    parallelJobs: number
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    refreshInterval: number
    exportFormat: 'json' | 'csv' | 'xlsx'
  }
  notifications: {
    priceAlerts: boolean
    scrapingErrors: boolean
    dailySummary: boolean
  }
}

// Error types
export class ScrapingError extends Error {
  constructor(
    message: string,
    public productId: number,
    public supplierId: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'ScrapingError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Utility types
export type ProductCategory = 
  | 'PPE'
  | 'Syringes'
  | 'Instruments'
  | 'Pharmaceuticals'
  | 'Diagnostics'
  | 'Consumables'
  | 'Equipment'
  | 'Other'

export type SupplierStatus = 'active' | 'pending' | 'inactive' | 'error'

export type ScrapingJobStatus = 'pending' | 'running' | 'completed' | 'failed'

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'limited' | 'unknown'

export type SortDirection = 'asc' | 'desc'

export type SortField = 'name' | 'price' | 'category' | 'lastUpdated' | 'savings'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface FilterConfig {
  categories?: ProductCategory[]
  suppliers?: number[]
  priceRange?: {
    min: number
    max: number
  }
  availability?: AvailabilityStatus[]
  searchTerm?: string
}