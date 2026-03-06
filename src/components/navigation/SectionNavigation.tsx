import { useEffect, useState } from 'react'
import type { UiDictionary } from '#/lib/i18n/dictionary'

interface SectionNavigationEntry {
  slug: string
  label: string
}

interface SectionNavigationProps {
  sections: SectionNavigationEntry[]
  dictionary: UiDictionary
}

export default function SectionNavigation({
  sections,
  dictionary,
}: SectionNavigationProps) {
  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug ?? '')

  useEffect(() => {
    setActiveSlug(sections[0]?.slug ?? '')
  }, [sections])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const sectionElements = sections
      .map((section) => document.getElementById(section.slug))
      .filter((value): value is HTMLElement => value instanceof HTMLElement)

    if (sectionElements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveSlug(visible[0].target.id)
        }
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    )

    for (const element of sectionElements) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [sections])

  return (
    <aside className="section-nav" aria-label={dictionary.sectionNavigation}>
      <p className="meta-label">{dictionary.sectionNavigation}</p>
      <ul>
        {sections.map((section, index) => (
          <li key={section.slug}>
            <a
              href={`#${section.slug}`}
              className={activeSlug === section.slug ? 'is-active' : undefined}
              aria-current={activeSlug === section.slug ? 'location' : undefined}
              onClick={() => {
                setActiveSlug(section.slug)
              }}
            >
              <span className="section-nav-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
