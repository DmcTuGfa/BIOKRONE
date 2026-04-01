"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, Leaf, Bug, Shield, ChevronRight } from "lucide-react"
import { productsData, productCategories, type ProductCategory } from "@/lib/products-data"

export default function ProductosPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cat = params.get("categoria") as ProductCategory | null
    if (cat && ["FUNGICIDAS", "BIOINSECTICIDAS", "BIOFORTIFICANTES"].includes(cat)) {
      setSelectedCategory(cat)
    }
  }, [])
