import { TooltipProvider } from "@/components/ui/tooltip"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Contributors } from "@/components/landing/contributors"
import { Testimonials } from "@/components/landing/testimonials"

export default function Home() {
  return (
    <TooltipProvider>
      <Hero />
      <Features />
      <Contributors />
      <Testimonials />
    </TooltipProvider>
  )
}
