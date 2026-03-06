import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

interface CountUpProps {
  value: number
  duration?: number
  localeTag?: string
}

export default function CountUp({ value, duration = 1400, localeTag }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? value : 0)

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(value * eased))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, value, duration, prefersReducedMotion])

  const formatted = localeTag
    ? displayed.toLocaleString(localeTag)
    : displayed.toString()

  return <span ref={ref}>{formatted}</span>
}
