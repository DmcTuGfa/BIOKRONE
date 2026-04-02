"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { Lock, ArrowLeft, CreditCard, ShieldCheck, Truck, AlertCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react"

function StripePaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardReady, setCardReady] = useState(false)
  const stripeRef = useRef<any>(null)
  const cardRef = useRef<any>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    const init = async () => {
      try {
        const { loadStripe } = await import("@stripe/stripe-js")
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (!stripe) { setError("No se pudo cargar Stripe. Verifica tu conexión."); return }

        stripeRef.current = stripe
        const elements = stripe.elements({ clientSecret })
        const card = elements.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#ffffff",
              fontFamily: "inherit",
              "::placeholder": { color: "#6b7280" },
            },
            invalid: { color: "#ef4444" },
          },
          hidePostalCode: true,
        })
        cardRef.current = card
        card.mount("#card-element")
        card.on("ready", () => setCardReady(true))
        card.on("change", (e: any) => setError(e.error?.message ?? null))
      } catch (e) {
        setError("Error al inicializar el formulario de pago.")
      }
    }

    init()

    return () => {
      if (cardRef.current) {
        try { cardRef.current.unmount() } catch {}
      }
    }
  }, [clientSecret])

  const handlePay = async () => {
    if (!stripeRef.current || !cardRef.current) return
    setLoading(true)
    setError(null)
    try {
      const { error: stripeError, paymentIntent } = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: { card: cardRef.current },
      })
      if (stripeError) { setError(stripeError.message ?? "Error al procesar el pago."); setLoading(false) }
      else if (paymentIntent?.status === "succeeded") onSuccess()
    } catch {
      setError("Error inesperado. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-border bg-muted/30 min-h-[60px]">
        <Label className="text-sm font-medium mb-3 block text-foreground">Número de tarjeta</Label>
        <div id="card-element" className="py-1" />
        {!cardReady && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Loader2 className="h-3 w-3 animate-spin" />Cargando formulario seguro...
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
        </div>
      )}
      <Button className="w-full h-12 text-base" onClick={handlePay} disabled={loading || !cardReady}>
        {loading
          ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Procesando pago...</>
          : <><Lock className="h-5 w-5 mr-2" />Pagar ahora</>}
      </Button>
      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" />Pago cifrado y procesado por Stripe. No almacenamos tus datos.
      </p>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"info" | "payment">("info")

  const totalDisplay = (totalPrice / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })

  const handleContinue = async () => {
    if (!email || !name) return
    setLoading(true); setError(null)
    try {
      const cartItems = items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, presentation: i.presentation }))
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, customerEmail: email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al crear el pago")
      setClientSecret(data.clientSecret)
      setStep("payment")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally { setLoading(false) }
  }

  const handleSuccess = () => { clearCart(); router.push("/tienda/success") }

  if (items.length === 0) return (
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tienda"><ArrowLeft className="h-4 w-4 mr-1" />Volver</Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Finalizar compra</h1>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              {step === "info" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />Información de contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input id="name" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+52 000 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />{error}
                      </div>
                    )}
                    <Button className="w-full h-12 text-base" onClick={handleContinue} disabled={loading || !email || !name}>
                      {loading
                        ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Procesando...</>
                        : <><CreditCard className="h-5 w-5 mr-2" />Continuar al pago</>}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && clientSecret && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />Datos de pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                      Comprando como: <span className="font-medium text-foreground">{name}</span> ({email})
                      <button className="ml-2 text-primary hover:underline text-xs" onClick={() => { setStep("info"); setClientSecret(null) }}>Cambiar</button>
                    </div>
                    <StripePaymentForm clientSecret={clientSecret} onSuccess={handleSuccess} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader><CardTitle className="text-lg">Tu pedido</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{item.presentation}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-muted transition-colors">
                              <Minus className="h-3 w-3 text-foreground" />
                            </button>
                            <span className="px-3 py-1 text-sm font-semibold text-foreground min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-muted transition-colors">
                              <Plus className="h-3 w-3 text-foreground" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap text-foreground">
                        ${((item.price * item.quantity) / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}

                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${totalDisplay} MXN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-600 dark:text-green-400">Se cotiza por zona</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${totalDisplay} MXN</span>
                  </div>

                  <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />Pago procesado por Stripe
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-primary flex-shrink-0" />Envío confirmado por correo
                    </div>
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
