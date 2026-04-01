"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, Leaf, Bug, Shield, ChevronRight } from "lucide-react"
import { productsData, productCategories, type ProductCategory } from "@/lib/products-data"

export default function ProductosPage() {
  const searchParams = useSearchParams()
  const categoriaParam = searchParams.get("categoria") as ProductCategory | null
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all")
  
  useEffect(() => {
    if (categoriaParam && ["FUNGICIDAS", "BIOINSECTICIDAS", "BIOFORTIFICANTES"].includes(categoriaParam)) {
      setSelectedCategory(categoriaParam)
    }
  }, [categoriaParam])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FUNGICIDAS":
        return <Shield className="h-5 w-5" />
      case "BIOINSECTICIDAS":
        return <Bug className="h-5 w-5" />
      case "BIOFORTIFICANTES":
        return <Leaf className="h-5 w-5" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string, isSelected: boolean) => {
    if (!isSelected) return "bg-card hover:bg-muted border-border"
    switch (category) {
      case "FUNGICIDAS":
        return "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
      case "BIOINSECTICIDAS":
        return "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400"
      case "BIOFORTIFICANTES":
        return "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400"
      default:
        return "bg-primary/10 border-primary text-primary"
    }
  }

  const categoryStats = useMemo(() => ({
    FUNGICIDAS: productsData.filter(p => p.category === "FUNGICIDAS").length,
    BIOINSECTICIDAS: productsData.filter(p => p.category === "BIOINSECTICIDAS").length,
    BIOFORTIFICANTES: productsData.filter(p => p.category === "BIOFORTIFICANTES").length,
    all: productsData.length,
  }), [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onScrollTo={() => {}} />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Productos</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Nuestro Portafolio de Productos
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Soluciones biologicas de alta calidad para una agricultura sostenible y productiva.
              </p>
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* All Products */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${getCategoryColor("all", selectedCategory === "all")}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">{categoryStats.all}</span>
                </div>
                <h3 className="font-semibold text-foreground">Todos los Productos</h3>
                <p className="text-sm text-muted-foreground mt-1">Ver catalogo completo</p>
              </button>

              {/* Fungicidas */}
              <button
                onClick={() => setSelectedCategory("FUNGICIDAS")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${getCategoryColor("FUNGICIDAS", selectedCategory === "FUNGICIDAS")}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold">{categoryStats.FUNGICIDAS}</span>
                </div>
                <h3 className="font-semibold text-foreground">Fungicidas</h3>
                <p className="text-sm text-muted-foreground mt-1">Control de hongos y bacterias</p>
              </button>

              {/* Bioinsecticidas */}
              <button
                onClick={() => setSelectedCategory("BIOINSECTICIDAS")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${getCategoryColor("BIOINSECTICIDAS", selectedCategory === "BIOINSECTICIDAS")}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Bug className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-2xl font-bold">{categoryStats.BIOINSECTICIDAS}</span>
                </div>
                <h3 className="font-semibold text-foreground">Bioinsecticidas</h3>
                <p className="text-sm text-muted-foreground mt-1">Control de plagas e insectos</p>
              </button>

              {/* Biofortificantes */}
              <button
                onClick={() => setSelectedCategory("BIOFORTIFICANTES")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${getCategoryColor("BIOFORTIFICANTES", selectedCategory === "BIOFORTIFICANTES")}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-2xl font-bold">{categoryStats.BIOFORTIFICANTES}</span>
                </div>
                <h3 className="font-semibold text-foreground">Biofortificantes</h3>
                <p className="text-sm text-muted-foreground mt-1">Nutricion y estimulacion</p>
              </button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Search & Current Category */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === "all" 
                    ? "Todos los Productos" 
                    : productCategories.find(c => c.value === selectedCategory)?.label}
                </h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron productos</h3>
                <p className="text-muted-foreground mb-4">Intenta con otros terminos de busqueda o selecciona otra categoria.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                  Ver todos los productos
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Necesitas asesoria personalizada?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Nuestro equipo de expertos esta listo para ayudarte a elegir los productos ideales para tu cultivo.
            </p>
            <Button asChild size="lg">
              <Link href="/contacto">Contactar un asesor</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
