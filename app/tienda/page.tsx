"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { storeProducts, storeCategoryLabels } from "@/lib/store-products"
import {
  ShoppingCart, Search, Leaf, Bug, Shield, CheckCircle2,
  Star, Truck, Lock, RefreshCw, Package,
} from "lucide-react"

type Category = "all" | "FUNGICIDAS" | "BIOINSECTICIDAS" | "BIOFORTIFICANTES"

const categoryIcons: Record<string, React.ElementType> = {
  FUNGICIDAS: Shield,
  BIOINSECTICIDAS: Bug,
  BIOFORTIFICANTES: Leaf,
}

const categoryColors: Record<string, string> = {
  FUNGICIDAS: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
  BIOINSECTICIDAS: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30",
  BIOFORTIFICANTES: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30",
}

interface CartItem { id: string; name: string; price: number; quantity: number; presentation: string }

export default function TiendaPage() {
  const [category, setCategory] = useState<Category>("all")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [addedId, setAddedId] = useState<string | null>(null)

  const filtered = useMemo(() =>
    storeProducts.filter(p => {
      const matchCat = category === "all" || p.category === category
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }),
    [category, search]
  )

  const addToCart = (product: typeof storeProducts[0]) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, presentation: product.presentation }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const goToCheckout = () => {
    sessionStorage.setItem("biokrone_cart", JSON.stringify(cart))
    window.location.href = "/tienda/checkout"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-primary/5 border-b border-border py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Pagos seguros con Stripe
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Tienda BIOKRONE
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Compra en línea con envío a toda la República Mexicana. Pago seguro con tarjeta de crédito o débito.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {[
                  { icon: Truck, label: "Envío a todo México" },
                  { icon: Lock, label: "Pago 100% seguro" },
                  { icon: RefreshCw, label: "Devoluciones en 7 días" },
                  { icon: Star, label: "Productos certificados" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cart bar */}
        {cartCount > 0 && (
          <div className="sticky top-16 z-40 bg-primary text-primary-foreground py-3 border-b border-primary/50 shadow-md">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShoppingCart className="h-4 w-4" />
                {cartCount} {cartCount === 1 ? "producto" : "productos"} —{" "}
                <span className="font-bold">
                  ${(cartTotal / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
              <Button size="sm" variant="secondary" onClick={goToCheckout}>
                Ir al pago →
              </Button>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-10">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar productos..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "FUNGICIDAS", "BIOINSECTICIDAS", "BIOFORTIFICANTES"] as Category[]).map(cat => {
                const isActive = category === cat
                const colorClass = cat !== "all" ? categoryColors[cat] : ""
                return (
                  <Button key={cat} variant={isActive ? "default" : "outline"}
                    size="sm" onClick={() => setCategory(cat)}
                    className={!isActive && cat !== "all" ? `border ${colorClass}` : ""}>
                    {cat !== "all" && (() => {
                      const Icon = categoryIcons[cat]
                      return <Icon className="h-4 w-4 mr-1.5" />
                    })()}
                    {storeCategoryLabels[cat]}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => {
              const Icon = categoryIcons[product.category]
              const colorClass = categoryColors[product.category]
              const isAdded = addedId === product.id
              const inCart = cart.find(i => i.id === product.id)

              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all flex flex-col overflow-hidden">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className={`text-xs border ${colorClass}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {storeCategoryLabels[product.category]}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-semibold text-foreground mb-0.5">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.presentation}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-foreground">{product.priceDisplay}</span>
                      <span className="text-xs text-muted-foreground ml-1">MXN</span>
                    </div>
                    <Button size="sm" onClick={() => addToCart(product)}
                      className={isAdded ? "bg-green-600 hover:bg-green-700" : ""}
                      disabled={isAdded}>
                      {isAdded ? (
                        <><CheckCircle2 className="h-4 w-4 mr-1" /> Agregado</>
                      ) : inCart ? (
                        <><ShoppingCart className="h-4 w-4 mr-1" /> ({inCart.quantity})</>
                      ) : (
                        <><ShoppingCart className="h-4 w-4 mr-1" /> Agregar</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Sin resultados</h3>
              <p className="text-muted-foreground">Intenta con otro filtro o término de búsqueda.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
