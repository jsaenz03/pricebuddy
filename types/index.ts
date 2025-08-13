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

// Authentication & User Management Types
export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  created_at: string
  updated_at: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata: {
    provider?: string
    providers?: string[]
  }
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'

export interface SubscriptionLimits {
  maxProducts: number
  maxSuppliers: number
  maxScrapingJobs: number
  exportFormats: string[]
  features: string[]
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: any | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  checkFeatureAccess: (feature: string) => boolean
  getRemainingLimits: () => SubscriptionLimits
}

// Auth Form Types
export interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  fullName?: string
  subscriptionTier: SubscriptionTier
  acceptTerms: boolean
}

export interface PasswordResetFormData {
  email: string
}

export interface ProfileUpdateFormData {
  fullName?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

// Subscription Configuration
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    maxProducts: 5,
    maxSuppliers: 3,
    maxScrapingJobs: 10,
    exportFormats: ['json'],
    features: ['basic_comparison', 'manual_pricing']
  },
  pro: {
    maxProducts: 50,
    maxSuppliers: 15,
    maxScrapingJobs: 100,
    exportFormats: ['json', 'csv', 'xlsx'],
    features: ['basic_comparison', 'manual_pricing', 'automated_scraping', 'price_alerts', 'advanced_analytics']
  },
  enterprise: {
    maxProducts: -1, // unlimited
    maxSuppliers: -1, // unlimited
    maxScrapingJobs: -1, // unlimited
    exportFormats: ['json', 'csv', 'xlsx', 'pdf'],
    features: ['basic_comparison', 'manual_pricing', 'automated_scraping', 'price_alerts', 'advanced_analytics', 'api_access', 'white_label', 'priority_support']
  }
}

// Supabase Configuration Types
export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// Feature Access Types
export interface FeatureGate {
  feature: string
  requiredTier: SubscriptionTier
  enabled: boolean
  description: string
  upgradePrompt?: string
}