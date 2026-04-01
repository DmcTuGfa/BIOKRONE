"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Lock, ArrowLeft, CreditCard, ShieldCheck, Truck, AlertCircle, Loader2,
} from "lucide-react"

interface CartItem { id: string; name: string; price: number; quantity: number; presentation: string }

// ─── Stripe payment form (loads only client-side) ─────────────────────────
function StripePaymentForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardReady, setCardReady] = useState(false)

  useEffect(() => {
    let stripe: unknown, elements: unknown, card: unknown
    ;(async () => {
      const { loadStripe } = await import("@stripe/stripe-js")
      stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) return

      const s = stripe as { elements: (opts: Record<string, unknown>) => unknown }
      elements = s.elements({ clientSecret })

      const el = elements as { create: (type: string, opts: Record<string, unknown>) => unknown }
      card = el.create("card", {
        style: {
          base: { fontSize: "16px", color: "#1f2937", "::placeholder": { color: "#9ca3af" } },
        },
        hidePostalCode: true,
      })
      ;(card as { mount: (s: string) => void }).mount("#card-element")
      ;(card as { on: (e: string, cb: (event: { error?: { message: string } }) => void) => void })
        .on("ready", () => setCardReady(true))
      ;(card as { on: (e: string, cb: (event: { error?: { message: string } }) => void) => void })
        .on("change", (event) => {
          setError(event.error ? event.error.message : null)
        })

      // Store refs for submit
      ;(window as Record<string, unknown>).__stripe = stripe
      ;(window as Record<string, unknown>).__card = card
    })()
  }, [clientSecret])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    const stripe = (window as Record<string, unknown>).__stripe as {
      confirmCardPayment: (secret: string, opts: Record<string, unknown>) => Promise<{ error?: { message: string }; paymentIntent?: { status: string } }>
    }
    const card = (window as Record<string, unknown>).__card

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess()
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <Label className="text-sm font-medium mb-2 block">Datos de tarjeta</Label>
        <div id="card-element" className="py-2" />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      <Button className="w-full h-12 text-base" onClick={handlePay} disabled={loading || !cardReady}>
        {loading ? (
          <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Procesando...</>
        ) : (
          <><Lock className="h-5 w-5 mr-2" /> Pagar ahora</>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" />
        Pago procesado de forma segura por Stripe. Nunca almacenamos tus datos bancarios.
      </p>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"info" | "payment">("info")

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("biokrone_cart")
      if (saved) setCart(JSON.parse(saved))
    } catch {}
  }, [])

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalDisplay = (total / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })

  const handleContinue = async () => {
    if (!email || !name) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, customerEmail: email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al crear pago")
      setClientSecret(data.clientSecret)
      setStep("payment")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    sessionStorage.removeItem("biokrone_cart")
    router.push("/tienda/success")
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Tu carrito está vacío</h2>
            <Button asChild><Link href="/tienda">Ir a la tienda</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tienda"><ArrowLeft className="h-4 w-4 mr-1" /> Volver</Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Finalizar compra</h1>
            <Badge variant="outline" className="ml-auto">
              <Lock className="h-3.5 w-3.5 mr-1" />
              Pago seguro
            </Badge>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">

              {step === "info" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Información de contacto y envío
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input id="name" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono (para confirmar envío)</Label>
                      <Input id="phone" type="tel" placeholder="+52 000 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />{error}
                      </div>
                    )}
                    <Button className="w-full h-12 text-base" onClick={handleContinue}
                      disabled={loading || !email || !name}>
                      {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Procesando...</> : (
                        <><CreditCard className="h-5 w-5 mr-2" />Continuar al pago</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && clientSecret && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Datos de pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                      Comprando como: <span className="font-medium text-foreground">{name}</span> ({email})
                      <button className="ml-2 text-primary hover:underline text-xs" onClick={() => setStep("info")}>
                        Cambiar
                      </button>
                    </div>
                    <StripePaymentForm clientSecret={clientSecret} onSuccess={handleSuccess} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.presentation}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">
                        ${((item.price * item.quantity) / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalDisplay} MXN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-600 dark:text-green-400">Cotización por zona</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalDisplay} MXN</span>
                  </div>

                  <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                    {[
                      { icon: ShieldCheck, text: "Pago procesado por Stripe" },
                      { icon: Truck, text: "Envío confirmado por WhatsApp" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
