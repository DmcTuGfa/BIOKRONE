"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Package, ArrowRight, Leaf, Shield, Sprout } from "lucide-react"

interface HeroSectionProps {
  onScrollTo: (section: string) => void
}

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Leaf className="h-4 w-4" />
            Soluciones biológicas para la agricultura mexicana
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            Cobertura y Portafolio de Productos
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Consulta las zonas de atención en México y explora nuestras líneas de productos biológicos para una agricultura sustentable y de alto rendimiento.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => onScrollTo("cobertura")}
              className="gap-2 text-base"
            >
              <MapPin className="h-5 w-5" />
              Ver cobertura
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onScrollTo("productos")}
              className="gap-2 text-base"
            >
              <Package className="h-5 w-5" />
              Explorar productos
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Biológicos</h3>
              <p className="text-sm text-muted-foreground">
                Productos de origen natural seguros para el medio ambiente
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Certificados</h3>
              <p className="text-sm text-muted-foreground">
                Registros COFEPRIS y certificaciones de calidad
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Alto Rendimiento</h3>
              <p className="text-sm text-muted-foreground">
                Tecnología que maximiza la productividad de tus cultivos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
