"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, X, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

const WHATSAPP_NUMBER = "5214611021115"

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  const generateWhatsAppMessage = () => {
    let message = `*SOLICITUD DE COTIZACION - BIOKRONE*\n\n`
    
    if (customerName) {
      message += `*Cliente:* ${customerName}\n`
    }
    if (customerPhone) {
      message += `*Telefono:* ${customerPhone}\n`
    }
    
    message += `\n*Productos solicitados:*\n`
    message += `─────────────────\n`
    
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.product.name}*\n`
      message += `   Presentacion: ${item.product.presentation}\n`
      message += `   Tipo: ${item.product.type}\n`
      message += `   Categoria: ${item.product.category}\n`
      message += `   Cantidad: ${item.quantity} unidad${item.quantity > 1 ? "es" : ""}\n`
    })
    
    message += `\n─────────────────\n`
    message += `*Total de productos:* ${getCartTotal()} unidades\n`
    message += `*Tipos diferentes:* ${getItemCount()} productos\n\n`
    message += `Por favor, envienme una cotizacion para estos productos. Gracias!`
    
    return encodeURIComponent(message)
  }

  const handleSendQuote = () => {
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const itemCount = getItemCount()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
            >
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Carrito de cotizacion</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Cotizacion
          </SheetTitle>
          <SheetDescription>
            Agrega productos para solicitar una cotizacion por WhatsApp
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Tu carrito esta vacio</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Agrega productos desde nuestro catalogo para solicitar una cotizacion.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.product.id} 
                  className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.product.presentation}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {item.product.category}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de productos:</span>
                <span className="font-semibold">{getCartTotal()} unidades</span>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Tu nombre (opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Tu telefono (opcional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSendQuote}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Cotizacion por WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar Carrito
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
