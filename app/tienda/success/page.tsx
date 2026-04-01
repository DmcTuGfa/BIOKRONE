import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, MessageCircle, ArrowRight, Package } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-xl">
          <Card className="text-center border-green-500/30 shadow-lg">
            <CardContent className="p-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">¡Pago exitoso!</h1>
              <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
                Tu pedido ha sido confirmado. Recibirás un correo con los detalles y
                nuestro equipo se pondrá en contacto para coordinar el envío.
              </p>

              <div className="flex flex-col gap-3">
                <Button asChild className="bg-green-600 hover:bg-green-700 gap-2">
                  <a
                    href="https://wa.me/524611021115?text=Hola%2C%20acabo%20de%20realizar%20un%20pedido%20en%20la%20tienda%20BIOKRONE"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Confirmar por WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/tienda">
                    <Package className="h-4 w-4" />
                    Seguir comprando
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">Volver al inicio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
