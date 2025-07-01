import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Languages } from '@/components/Languages'
import { Stats } from '@/components/Stats'
import { CTA } from '@/components/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Languages />
      <Stats />
      <CTA />
    </>
  )
}
