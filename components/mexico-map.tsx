"use client"

import { useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/angelnmara/geojson/master/mexicoHigh.json"

export interface StateData {
  name: string
  status: "activa" | "distribuidor" | "proximamente"
  observations: string
  zone?: string
  whatsapp?: string
}

const coverageData: Record<string, StateData> = {
  Guanajuato: { 
    name: "Guanajuato", 
    status: "activa", 
    observations: "Centro de distribución principal. Múltiples zonas de atención.",
    zone: "GTO CENTRO / GTO OESTE / GTO SUR",
    whatsapp: "4611698696"
  },
  Jalisco: { 
    name: "Jalisco", 
    status: "activa", 
    observations: "Cobertura completa en toda la región con múltiples zonas.",
    zone: "JALISCO SUR / JALISCO VALLES / JALISCO CIENEGA",
    whatsapp: "4611012083"
  },
  Michoacán: { 
    name: "Michoacán", 
    status: "activa", 
    observations: "Especialización en cultivos de aguacate. Múltiples zonas de atención.",
    zone: "MICHOACAN SUR / URUAPAN / YURECUARO / ZAMORA",
    whatsapp: "4612528254"
  },
  Querétaro: { 
    name: "Querétaro", 
    status: "activa", 
    observations: "Atención directa de fábrica",
    zone: "QUERETARO, QRO.",
    whatsapp: "4612284158"
  },
  Aguascalientes: { 
    name: "Aguascalientes", 
    status: "activa", 
    observations: "Servicio técnico disponible",
    zone: "ZACATECAS - AGS",
    whatsapp: "4611699459"
  },
  Zacatecas: { 
    name: "Zacatecas", 
    status: "activa", 
    observations: "Cobertura activa en la zona",
    zone: "ZACATECAS - AGS",
    whatsapp: "4611699459"
  },
  Nayarit: { 
    name: "Nayarit", 
    status: "activa", 
    observations: "Cobertura en zonas agrícolas principales",
    zone: "NAYARIT",
    whatsapp: "4611196484"
  },
  "Estado de México": { 
    name: "Estado de México", 
    status: "activa", 
    observations: "Múltiples distribuidores autorizados",
    zone: "EDO DE MEXICO",
    whatsapp: "4611040803"
  },
  Morelos: { 
    name: "Morelos", 
    status: "activa", 
    observations: "Centro de demostración activo",
    zone: "MORELOS, MOR.",
    whatsapp: "4611042079"
  },
  Puebla: { 
    name: "Puebla", 
    status: "activa", 
    observations: "Atención directa disponible",
    zone: "PUEBLA, PUEBLA",
    whatsapp: "4611042079"
  },
  Hidalgo: { 
    name: "Hidalgo", 
    status: "activa", 
    observations: "Cobertura activa",
    zone: "QRO - HIDALGO",
    whatsapp: "4611044772"
  },
  Guerrero: { 
    name: "Guerrero", 
    status: "activa", 
    observations: "Cobertura activa en la zona",
    zone: "GUERRERO",
    whatsapp: "7351777602"
  },
  // Zona Norte
  Chihuahua: { 
    name: "Chihuahua", 
    status: "distribuidor", 
    observations: "Distribuidor autorizado: Zona Norte",
    zone: "ZONA NORTE",
    whatsapp: "4611195234"
  },
  Coahuila: { 
    name: "Coahuila", 
    status: "distribuidor", 
    observations: "Distribuidor autorizado: Zona Norte",
    zone: "ZONA NORTE",
    whatsapp: "4611195234"
  },
  "Nuevo León": { 
    name: "Nuevo León", 
    status: "distribuidor", 
    observations: "Distribuidor autorizado: Zona Norte",
    zone: "ZONA NORTE",
    whatsapp: "4611195234"
  },
  Tamaulipas: { 
    name: "Tamaulipas", 
    status: "distribuidor", 
    observations: "Distribuidor autorizado: Zona Norte",
    zone: "ZONA NORTE",
    whatsapp: "4611195234"
  },
  Durango: { 
    name: "Durango", 
    status: "distribuidor", 
    observations: "Distribuidor autorizado: Zona Norte",
    zone: "ZONA NORTE",
    whatsapp: "4611195234"
  },
  "San Luis Potosí": { 
    name: "San Luis Potosí", 
    status: "distribuidor", 
    observations: "Red de distribuidores certificados",
    zone: "ZONA NORTE",
    whatsapp: "4611195234"
  },
  // Estados sin cobertura directa
  Sinaloa: { name: "Sinaloa", status: "proximamente", observations: "Expansión programada" },
  Sonora: { name: "Sonora", status: "proximamente", observations: "Expansión programada" },
  "Baja California": { name: "Baja California", status: "proximamente", observations: "Expansión programada" },
  "Baja California Sur": { name: "Baja California Sur", status: "proximamente", observations: "Expansión programada" },
  Veracruz: { name: "Veracruz", status: "proximamente", observations: "Expansión en planificación" },
  Oaxaca: { name: "Oaxaca", status: "proximamente", observations: "Expansión programada para 2026" },
  Chiapas: { name: "Chiapas", status: "proximamente", observations: "En proceso de certificación" },
  Colima: { name: "Colima", status: "activa", observations: "Atención personalizada disponible", zone: "JALISCO SUR", whatsapp: "4611012083" },
  Tlaxcala: { name: "Tlaxcala", status: "distribuidor", observations: "Distribuidor autorizado", zone: "PUEBLA, PUEBLA", whatsapp: "4611042079" },
  "Ciudad de México": { name: "Ciudad de México", status: "activa", observations: "Oficina comercial central", zone: "EDO DE MEXICO", whatsapp: "4611040803" },
  Tabasco: { name: "Tabasco", status: "proximamente", observations: "Evaluación de mercado" },
  Campeche: { name: "Campeche", status: "proximamente", observations: "Próxima apertura" },
  Yucatán: { name: "Yucatán", status: "proximamente", observations: "Expansión en planificación" },
  "Quintana Roo": { name: "Quintana Roo", status: "proximamente", observations: "En proceso" },
}

const getStateColor = (stateName: string, isHovered: boolean, isDark: boolean) => {
  const stateData = coverageData[stateName]
  if (!stateData) {
    return isHovered ? (isDark ? "#4b5563" : "#d1d5db") : (isDark ? "#374151" : "#e5e7eb")
  }
  
  switch (stateData.status) {
    case "activa":
      return isHovered ? "#15803d" : "#22c55e"
    case "distribuidor":
      return isHovered ? "#65a30d" : "#84cc16"
    case "proximamente":
      return isHovered ? (isDark ? "#4b5563" : "#9ca3af") : (isDark ? "#374151" : "#d1d5db")
    default:
      return isHovered ? (isDark ? "#4b5563" : "#d1d5db") : (isDark ? "#374151" : "#e5e7eb")
  }
}

interface MexicoMapProps {
  onStateClick: (state: StateData | null) => void
}

export function MexicoMap({ onStateClick }: MexicoMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)

  // Check for dark mode
  if (typeof window !== "undefined") {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    if (isDark !== document.documentElement.classList.contains("dark")) {
      checkDark()
    }
  }

  return (
    <div className="w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200,
          center: [-102, 23],
        }}
        className="w-full h-auto"
        style={{ maxHeight: "500px" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name
                const isHovered = hoveredState === stateName
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateColor(stateName, isHovered, isDark)}
                    stroke={isDark ? "#1f2937" : "#ffffff"}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => {
                      const stateData = coverageData[stateName]
                      if (stateData) {
                        onStateClick(stateData)
                      } else {
                        onStateClick({
                          name: stateName,
                          status: "proximamente",
                          observations: "Información no disponible",
                        })
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#22c55e]" />
          <span className="text-sm text-muted-foreground">Cobertura activa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#84cc16]" />
          <span className="text-sm text-muted-foreground">Distribuidor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted-foreground/30" />
          <span className="text-sm text-muted-foreground">Proximamente</span>
        </div>
      </div>
    </div>
  )
}

export { coverageData }
