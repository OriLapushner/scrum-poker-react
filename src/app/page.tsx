"use client"
import { Header } from "@/components/home/Header"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { AppPreviewSection } from "@/components/home/AppPreviewSection"
import { CTASection } from "@/components/home/CTASection"
import { Footer } from "@/components/home/Footer"
import { ScrumPokerExplanationSection } from "@/components/home/ScrumPokerExplanationSection"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ScrumPokerExplanationSection />
        <AppPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

