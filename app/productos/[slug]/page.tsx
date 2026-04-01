"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { getProductBySlug, productsData } from "@/lib/products-data"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Check, 
  Plus, 
  Minus, 
  Package, 
  Droplets, 
  FlaskConical,
  Leaf,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react"

const getProductIcon = (type: string) => {
  if (type.toLowerCase().includes("liquido") || type.toLowerCase().includes("solucion")) {
    return <Droplets className="h-12 w-12 text-primary" />
  }
  if (type.toLowerCase().includes("polvo") || type.toLowerCase().includes("granulos")) {
    return <FlaskConical className="h-12 w-12 text-primary" />
  }
  return <Package className="h-12 w-12 text-primary" />
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "FUNGICIDAS":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    case "BIOINSECTICIDAS":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    case "BIOFORTIFICANTES":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "FUNGICIDAS":
      return <Shield className="h-4 w-4" />
    case "BIOINSECTICIDAS":
      return <Sparkles className="h-4 w-4" />
    case "BIOFORTIFICANTES":
      return <Leaf className="h-4 w-4" />
    default:
      return null
  }
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, isInCart } = useCart()
  
  if (!product) {
    notFound()
  }
  
  const inCart = isInCart(product.id)
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setQuantity(1)
  }

  // Productos relacionados (misma categoria, excluyendo el actual)
  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/productos" className="hover:text-foreground transition-colors">
                Productos
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link 
                href={`/productos?categoria=${product.category}`} 
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="aspect-square bg-muted/30 rounded-2xl border border-border overflow-hidden relative flex items-center justify-center">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 p-8">
                    <div className="p-6 rounded-2xl bg-primary/10">
                      {getProductIcon(product.type)}
                    </div>
                    <span className="text-muted-foreground text-sm">Imagen del producto</span>
                  </div>
                )}
              </div>
              
              {/* Back Button Mobile */}
              <Button variant="outline" asChild className="w-full lg:hidden">
                <Link href="/productos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a productos
                </Link>
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={getCategoryColor(product.category)}>
                    {getCategoryIcon(product.category)}
                    <span className="ml-1">{product.category}</span>
                  </Badge>
                  <Badge variant="secondary">{product.type}</Badge>
                </div>
                
                <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
                <p className="text-lg text-muted-foreground">{product.presentation}</p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Descripcion</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Beneficios</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application */}
              {product.application && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Modo de aplicacion</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.application}
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Cantidad:</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-full h-12 text-base"
                    variant={inCart ? "secondary" : "default"}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Agregar mas al carrito
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Agregar al carrito
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Agrega productos y solicita tu cotizacion por WhatsApp
                  </p>
                </CardContent>
              </Card>

              {/* Back Button Desktop */}
              <Button variant="ghost" asChild className="hidden lg:flex w-fit">
                <Link href="/productos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a productos
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-muted/30 border-t border-border py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Productos relacionados
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link 
                    key={relProduct.id}
                    href={`/productos/${relProduct.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="p-3 rounded-xl bg-primary/10">
                            {getProductIcon(relProduct.type)}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {relProduct.type}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                            {relProduct.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{relProduct.presentation}</p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relProduct.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
