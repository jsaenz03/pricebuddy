'use client'

import { useEffect, useState } from 'react'
import { Stethoscope, RefreshCw, Download, Package, Building, TrendingDown, Clock, Plus, Search, Trash2 } from 'lucide-react'

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
  status: 'active' | 'pending'
}

interface PriceData {
  [productId: number]: {
    [supplierId: number]: number | null
  }
}

export default function PriceComparison() {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Surgical Gloves (Box of 100)', sku: 'SG-100', category: 'PPE' },
    { id: 2, name: 'N95 Respirator Masks (Pack of 20)', sku: 'N95-20', category: 'PPE' },
    { id: 3, name: 'Disposable Syringes 10ml (Pack of 50)', sku: 'SYR-10-50', category: 'Syringes' },
    { id: 4, name: 'Digital Thermometer', sku: 'THERM-001', category: 'Instruments' },
    { id: 5, name: 'Blood Pressure Cuff Adult', sku: 'BP-ADULT', category: 'Instruments' }
  ])

  const [suppliers] = useState<Supplier[]>([
    { id: 1, name: 'MedSupply Pro', url: 'https://medsupply.com', status: 'active' },
    { id: 2, name: 'Clinical Direct', url: 'https://clinicaldirect.com', status: 'active' },
    { id: 3, name: 'Healthcare Plus', url: 'https://healthcareplus.com', status: 'active' },
    { id: 4, name: 'Medical Depot', url: 'https://medicaldepot.com', status: 'pending' }
  ])

  const [priceData, setPriceData] = useState<PriceData>({
    1: { 1: 24.99, 2: 22.50, 3: 26.75, 4: null },
    2: { 1: 45.99, 2: 42.00, 3: 48.50, 4: null },
    3: { 1: 18.75, 2: 17.25, 3: 19.99, 4: null },
    4: { 1: 12.99, 2: 11.50, 3: 14.25, 4: null },
    5: { 1: 34.99, 2: 32.75, 3: 36.50, 4: null }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const activeSuppliers = suppliers.filter(s => s.status === 'active')

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 2000)
  }

  const handleScrape = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newPriceData = { ...priceData }
      Object.keys(newPriceData).forEach(productId => {
        Object.keys(newPriceData[parseInt(productId)]).forEach(supplierId => {
          const currentPrice = newPriceData[parseInt(productId)][parseInt(supplierId)]
          if (currentPrice !== null) {
            const variation = (Math.random() - 0.5) * 4
            newPriceData[parseInt(productId)][parseInt(supplierId)] = Math.max(0.99, currentPrice + variation)
          }
        })
      })
      setPriceData(newPriceData)
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 3000)
  }

  const handleExport = () => {
    const data = {
      products,
      suppliers,
      prices: priceData,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Clinical Supply Price Tracker</h1>
                <p className="text-sm text-gray-500">Compare prices across multiple suppliers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover-lift shadow-soft transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-3 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 hover-lift shadow-soft transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover-lift animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tracked Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover-lift animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{activeSuppliers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover-lift animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Savings</p>
                <p className="text-2xl font-bold text-gray-900">23%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover-lift animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm font-bold text-gray-900">{lastUpdated.toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison Table */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 animate-fade-in">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Price Comparison</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <button
                  onClick={handleScrape}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 hover-lift shadow-soft transition-all disabled:opacity-50"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? 'Scraping...' : 'Scrape Now'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  {activeSuppliers.map(supplier => (
                    <th key={supplier.id} className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {supplier.name}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Best Price
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Savings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => {
                  const productPrices = priceData[product.id] || {}
                  const availablePrices = activeSuppliers
                    .map(supplier => ({ supplier, price: productPrices[supplier.id] }))
                    .filter(item => item.price !== null && item.price !== undefined)
                  
                  const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices.map(item => item.price)) : null
                  const maxPrice = availablePrices.length > 0 ? Math.max(...availablePrices.map(item => item.price)) : null
                  const bestSupplier = availablePrices.find(item => item.price === minPrice)
                  const savings = minPrice && maxPrice ? ((maxPrice - minPrice) / maxPrice * 100).toFixed(1) : '0'

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">SKU: {product.sku} • {product.category}</p>
                        </div>
                      </td>
                      {activeSuppliers.map(supplier => {
                        const price = productPrices[supplier.id]
                        let priceClass = 'bg-gray-100 text-gray-600'
                        if (price === minPrice && minPrice !== null) priceClass = 'price-lowest text-white'
                        else if (price === maxPrice && maxPrice !== null && maxPrice !== minPrice) priceClass = 'price-highest text-white'
                        else if (price !== null) priceClass = 'price-middle text-white'
                        
                        return (
                          <td key={supplier.id} className="px-6 py-4 text-center">
                            {price !== null && price !== undefined ? (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${priceClass}`}>
                                ${price.toFixed(2)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500">
                                N/A
                              </span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-6 py-4 text-center">
                        {bestSupplier ? (
                          <div>
                            <div className="font-semibold text-green-600">${bestSupplier.price.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{bestSupplier.supplier.name}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                          parseFloat(savings) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {savings}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {isLoading && (
            <div className="px-6 py-8 text-center">
              <div className="loading-pulse inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg">
                <RefreshCw className="w-5 h-5 mr-2 text-blue-600 animate-spin" />
                <span className="text-blue-600 font-medium">Scraping supplier data...</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}