import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductosContent } from "./productos-content"

export default function ProductosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onScrollTo={() => {}} />
      <Suspense fallback={
        <div className="flex-1 flex items-center
          justify-center text-muted-foreground">
          Cargando...
        </div>
      }>
        <ProductosContent />
      </Suspense>
      <Footer />
    </div>
  )
}
