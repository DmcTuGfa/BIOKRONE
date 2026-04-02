"use client"

import { useCallback } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CoverageSection } from "@/components/coverage-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Bug, Leaf } from "lucide-react"
import { productsData } from "@/lib/products-data"

export default function Home() {
  const scrollToSection = useCallback((section: string) => {
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const categoryStats = {
    FUNGICIDAS: productsData.filter(p => p.category === "FUNGICIDAS").length,
    BIOINSECTICIDAS: productsData.filter(p => p.category === "BIOINSECTICIDAS").length,
    BIOFORTIFICANTES: productsData.filter(p => p.category === "BIOFORTIFICANTES").length,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onScrollTo={scrollToSection} />
      <main className="flex-1">
        <HeroSection onScrollTo={scrollToSection} />
        <CoverageSection />
        
        {/* Products Preview Section */}
        <section id="productos" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Nuestro Portafolio de Productos
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Explora nuestra linea completa de soluciones biologicas para la agricultura sostenible.
              </p>
            </div>

            {/* Category Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <Link href="/tienda?categoria=FUNGICIDAS">
                <Card className="group hover:shadow-lg transition-all hover:border-blue-500/50 cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Fungicidas</h3>
                    <p className="text-sm text-muted-foreground mb-3">Control de hongos, bacterias y nematodos</p>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{categoryStats.FUNGICIDAS}</span>
                    <span className="text-muted-foreground text-sm ml-1">productos</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tienda?categoria=BIOINSECTICIDAS">
                <Card className="group hover:shadow-lg transition-all hover:border-orange-500/50 cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-500/10 mb-4 group-hover:scale-110 transition-transform">
                      <Bug className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Bioinsecticidas</h3>
                    <p className="text-sm text-muted-foreground mb-3">Control de plagas e insectos</p>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{categoryStats.BIOINSECTICIDAS}</span>
                    <span className="text-muted-foreground text-sm ml-1">productos</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tienda?categoria=BIOFORTIFICANTES">
                <Card className="group hover:shadow-lg transition-all hover:border-green-500/50 cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-500/10 mb-4 group-hover:scale-110 transition-transform">
                      <Leaf className="h-7 w-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Biofortificantes</h3>
                    <p className="text-sm text-muted-foreground mb-3">Nutricion y bioestimulacion</p>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{categoryStats.BIOFORTIFICANTES}</span>
                    <span className="text-muted-foreground text-sm ml-1">productos</span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/tienda">
                  Ver todos los productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section id="contacto" className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Listo para mejorar tus cultivos?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Comunicate con nuestro equipo de expertos y recibe asesoria personalizada para tus necesidades agricolas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <a href="https://wa.me/524611021115?text=Hola%2C%20me%20interesa%20informacion%20sobre%20productos%20BIOKRONE" target="_blank" rel="noopener noreferrer">
                    Contactar por WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contacto">
                    Ver informacion de contacto
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
