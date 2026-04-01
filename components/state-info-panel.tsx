"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, MapPin, CheckCircle2, Building2, Clock, MessageCircle } from "lucide-react"
import type { StateData } from "./mexico-map"

interface StateInfoPanelProps {
  stateData: StateData | null
  onClose: () => void
}

const getStatusInfo = (status: StateData["status"]) => {
  switch (status) {
    case "activa":
      return {
        label: "Cobertura activa",
        variant: "default" as const,
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: "bg-green-500",
      }
    case "distribuidor":
      return {
        label: "Distribuidor",
        variant: "secondary" as const,
        icon: <Building2 className="h-4 w-4" />,
        color: "bg-lime-500",
      }
    case "proximamente":
      return {
        label: "Proximamente",
        variant: "outline" as const,
        icon: <Clock className="h-4 w-4" />,
        color: "bg-gray-400",
      }
  }
}

export function StateInfoPanel({ stateData, onClose }: StateInfoPanelProps) {
  if (!stateData) return null

  const statusInfo = getStatusInfo(stateData.status)

  const handleWhatsAppClick = () => {
    if (stateData.whatsapp) {
      const message = encodeURIComponent(`Hola, me interesa información sobre productos BIOKRONE para la zona ${stateData.zone || stateData.name}`)
      window.open(`https://wa.me/52${stateData.whatsapp}?text=${message}`, "_blank")
    }
  }

  return (
    <Card className="animate-in slide-in-from-right-5 duration-300 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{stateData.name}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
          <Badge variant={statusInfo.variant} className="gap-1">
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
        
        {stateData.zone && (
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Zona</p>
            <p className="text-sm font-medium text-foreground">{stateData.zone}</p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">{stateData.observations}</p>
        
        {stateData.whatsapp && (
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contactar por WhatsApp
          </Button>
        )}
        
        {!stateData.whatsapp && stateData.status !== "proximamente" && (
          <Button 
            onClick={() => {
              const message = encodeURIComponent(`Hola, me interesa información sobre productos BIOKRONE para ${stateData.name}`)
              window.open(`https://wa.me/524611021115?text=${message}`, "_blank")
            }}
            variant="outline"
            className="w-full"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacto general
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
