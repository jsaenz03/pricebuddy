'use client'

import React, { useState, useEffect } from 'react'
import { 
  Building, 
  Package, 
  TrendingDown, 
  Clock, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Download, 
  Search, 
  Stethoscope,
  BarChart3,
  Loader
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Types
interface Product {
  id: number
  name: string
  sku: string
  category: string
}

interface Supplier {
  id: number
  name: string
  url: string
  status: 'active' | 'pending' | 'inactive'
}

interface PriceData {
  [productId: number]: {
    [supplierId: number]: number | null
  }
}

interface AppState {
  products: Product[]
  suppliers: Supplier[]
  priceData: PriceData
  selectedProducts: number[]
  selectedSuppliers: number[]
  lastUpdated: Date
  isLoading: boolean
}

// Initial state
const initialState: AppState = {
  products: [
    { id: 1, name: 'Surgical Gloves (Box of 100)', sku: 'SG-100', category: 'PPE' },
    { id: 2, name: 'N95 Respirator Masks (Pack of 20)', sku: 'N95-20', category: 'PPE' },
    { id: 3, name: 'Disposable Syringes 10ml (Pack of 50)', sku: 'SYR-10-50', category: 'Syringes' },
    { id: 4, name: 'Digital Thermometer', sku: 'THERM-001', category: 'Instruments' },
    { id: 5, name: 'Blood Pressure Cuff Adult', sku: 'BP-ADULT', category: 'Instruments' }
  ],
  suppliers: [
    { id: 1, name: 'MedSupply Pro', url: 'https://medsupply.com', status: 'active' },
    { id: 2, name: 'Clinical Direct', url: 'https://clinicaldirect.com', status: 'active' },
    { id: 3, name: 'Healthcare Plus', url: 'https://healthcareplus.com', status: 'active' },
    { id: 4, name: 'Medical Depot', url: 'https://medicaldepot.com', status: 'pending' }
  ],
  priceData: {
    1: { 1: 24.99, 2: 22.50, 3: 26.75, 4: null },
    2: { 1: 45.99, 2: 42.00, 3: 48.50, 4: null },
    3: { 1: 18.75, 2: 17.25, 3: 19.99, 4: null },
    4: { 1: 12.99, 2: 11.50, 3: 14.25, 4: null },
    5: { 1: 34.99, 2: 32.75, 3: 36.50, 4: null }
  },
  selectedProducts: [],
  selectedSuppliers: [],
  lastUpdated: new Date(),
  isLoading: false
}

// Statistics Card Component
const StatsCard = ({ icon: Icon, title, value, description, gradient }: {
  icon: any
  title: string
  value: string | number
  description: string
  gradient: string
}) => (
  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Product Form Component
const ProductForm = ({ onSubmit, onCancel }: {
  onSubmit: (product: Omit<Product, 'id'>) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'PPE'
  })

  const categories = ['PPE', 'Syringes', 'Instruments', 'Pharmaceuticals', 'Diagnostics']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', sku: '', category: 'PPE' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productSku">SKU/Item Number</Label>
        <Input
          id="productSku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          placeholder="Enter SKU or item number"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productCategory">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Product
        </Button>
      </div>
    </form>
  )
}

// Supplier Form Component
const SupplierForm = ({ onSubmit, onCancel }: {
  onSubmit: (supplier: Omit<Supplier, 'id' | 'status'>) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', url: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplierName">Supplier Name</Label>
        <Input
          id="supplierName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter supplier name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplierUrl">Website URL</Label>
        <Input
          id="supplierUrl"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Supplier
        </Button>
      </div>
    </form>
  )
}

// Price Cell Component
const PriceCell = ({ price, isLowest, isHighest }: {
  price: number | null
  isLowest: boolean
  isHighest: boolean
}) => {
  if (price === null || price === undefined) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-500">
        N/A
      </Badge>
    )
  }

  let badgeClass = "bg-yellow-100 text-yellow-800"
  if (isLowest) {
    badgeClass = "bg-green-100 text-green-800"
  } else if (isHighest) {
    badgeClass = "bg-red-100 text-red-800"
  }

  return (
    <Badge className={badgeClass}>
      ${price.toFixed(2)}
    </Badge>
  )
}

// Main Application Component
export default function PriceComparisonApp() {
  const [state, setState] = useState<AppState>(initialState)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showSupplierDialog, setShowSupplierDialog] = useState(false)

  const activeSuppliers = state.suppliers.filter(s => s.status === 'active')

  const handleRefresh = () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API call
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date()
      }))
    }, 2000)
  }

  const handleScrape = () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate scraping with random price variations
    setTimeout(() => {
      const newPriceData = { ...state.priceData }
      Object.keys(newPriceData).forEach(productId => {
        Object.keys(newPriceData[+productId]).forEach(supplierId => {
          if (newPriceData[+productId][+supplierId] !== null) {
            const basePrice = newPriceData[+productId][+supplierId]!
            const variation = (Math.random() - 0.5) * 4 // ±$2 variation
            newPriceData[+productId][+supplierId] = Math.max(0.99, basePrice + variation)
          }
        })
      })
      
      setState(prev => ({
        ...prev,
        priceData: newPriceData,
        isLoading: false,
        lastUpdated: new Date()
      }))
    }, 3000)
  }

  const handleExport = () => {
    const data = {
      products: state.products,
      suppliers: state.suppliers,
      prices: state.priceData,
      exported: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `price-comparison-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...state.products.map(p => p.id)) + 1
    setState(prev => ({
      ...prev,
      products: [...prev.products, { ...product, id: newId }],
      priceData: { ...prev.priceData, [newId]: {} }
    }))
    setShowProductDialog(false)
  }

  const removeProduct = (productId: number) => {
    setState(prev => {
      const newPriceData = { ...prev.priceData }
      delete newPriceData[productId]
      return {
        ...prev,
        products: prev.products.filter(p => p.id !== productId),
        priceData: newPriceData
      }
    })
  }

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'status'>) => {
    const newId = Math.max(...state.suppliers.map(s => s.id)) + 1
    setState(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, { ...supplier, id: newId, status: 'pending' as const }]
    }))
    setShowSupplierDialog(false)
  }

  const removeSupplier = (supplierId: number) => {
    setState(prev => {
      const newPriceData = { ...prev.priceData }
      Object.keys(newPriceData).forEach(productId => {
        delete newPriceData[+productId][supplierId]
      })
      return {
        ...prev,
        suppliers: prev.suppliers.filter(s => s.id !== supplierId),
        priceData: newPriceData
      }
    })
  }

  const calculateStats = () => {
    const totalProducts = state.products.length
    const activeSupplierCount = activeSuppliers.length
    
    // Calculate average savings
    let totalSavings = 0
    let productCount = 0
    
    state.products.forEach(product => {
      const productPrices = state.priceData[product.id] || {}
      const availablePrices = activeSuppliers
        .map(supplier => productPrices[supplier.id])
        .filter(price => price !== null && price !== undefined) as number[]
      
      if (availablePrices.length > 1) {
        const minPrice = Math.min(...availablePrices)
        const maxPrice = Math.max(...availablePrices)
        totalSavings += ((maxPrice - minPrice) / maxPrice) * 100
        productCount++
      }
    })
    
    const avgSavings = productCount > 0 ? (totalSavings / productCount).toFixed(1) + '%' : '0%'
    
    return { totalProducts, activeSupplierCount, avgSavings }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Clinical Supply Price Tracker</h1>
                <p className="text-sm text-gray-500">Compare prices across multiple suppliers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={state.isLoading}
                className="transition-all hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                className="transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Package}
            title="Tracked Products"
            value={stats.totalProducts}
            description="Active monitoring"
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            icon={Building}
            title="Active Suppliers"
            value={stats.activeSupplierCount}
            description="Data sources"
            gradient="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatsCard
            icon={TrendingDown}
            title="Avg. Savings"
            value={stats.avgSavings}
            description="Cost optimization"
            gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatsCard
            icon={Clock}
            title="Last Updated"
            value={state.lastUpdated.toLocaleDateString()}
            description={state.lastUpdated.toLocaleTimeString()}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        {/* Product & Supplier Management */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <span>Product & Supplier Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Tracked Products</h3>
                  <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        onSubmit={addProduct}
                        onCancel={() => setShowProductDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {state.products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku} • {product.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suppliers Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Supplier Sources</h3>
                  <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Supplier
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Supplier</DialogTitle>
                      </DialogHeader>
                      <SupplierForm
                        onSubmit={addSupplier}
                        onCancel={() => setShowSupplierDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {state.suppliers.map(supplier => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 text-sm">{supplier.name}</p>
                          <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                            {supplier.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{supplier.url}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSupplier(supplier.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Comparison Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <span>Price Comparison</span>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Last updated: {state.lastUpdated.toLocaleTimeString()}
                </span>
                <Button
                  onClick={handleScrape}
                  disabled={state.isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {state.isLoading ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {state.isLoading ? 'Scraping...' : 'Scrape Now'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {state.isLoading ? (
              <div className="space-y-4">
                <Alert>
                  <Loader className="w-4 h-4 animate-spin" />
                  <AlertDescription>
                    Scraping supplier data, please wait...
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Product</TableHead>
                      {activeSuppliers.map(supplier => (
                        <TableHead key={supplier.id} className="text-center font-semibold">
                          {supplier.name}
                        </TableHead>
                      ))}
                      <TableHead className="text-center font-semibold">Best Price</TableHead>
                      <TableHead className="text-center font-semibold">Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.products.map(product => {
                      const productPrices = state.priceData[product.id] || {}
                      const availablePrices = activeSuppliers
                        .map(supplier => ({ supplier, price: productPrices[supplier.id] }))
                        .filter(item => item.price !== null && item.price !== undefined)
                      
                      const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices.map(item => item.price!)) : null
                      const maxPrice = availablePrices.length > 0 ? Math.max(...availablePrices.map(item => item.price!)) : null
                      const bestSupplier = availablePrices.find(item => item.price === minPrice)
                      const savings = minPrice && maxPrice ? ((maxPrice - minPrice) / maxPrice * 100).toFixed(1) : '0'

                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">SKU: {product.sku} • {product.category}</p>
                            </div>
                          </TableCell>
                          {activeSuppliers.map(supplier => {
                            const price = productPrices[supplier.id]
                            return (
                              <TableCell key={supplier.id} className="text-center">
                                <PriceCell
                                  price={price}
                                  isLowest={price === minPrice && minPrice !== null}
                                  isHighest={price === maxPrice && maxPrice !== null && maxPrice !== minPrice}
                                />
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-center">
                            {bestSupplier ? (
                              <div>
                                <div className="font-semibold text-green-600">
                                  ${bestSupplier.price!.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {bestSupplier.supplier.name}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={+savings > 0 ? 'default' : 'secondary'}>
                              {savings}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}