import { motion, useReducedMotion } from 'motion/react'
import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Publication } from '#/lib/content/parseBibtex'

interface PublicationsListProps {
  publications: Publication[]
  dictionary: UiDictionary
}

const TYPE_ORDER: Publication['type'][] = [
  'article',
  'inproceedings',
  'book',
  'techreport',
  'misc',
]

function typeLabel(type: Publication['type'], dictionary: UiDictionary): string {
  switch (type) {
    case 'article':       return dictionary.publicationTypeArticle
    case 'inproceedings': return dictionary.publicationTypeInproceedings
    case 'book':          return dictionary.publicationTypeBook
    case 'techreport':    return dictionary.publicationTypeReport
    case 'misc':          return dictionary.publicationTypeMisc
  }
}

function publisherLink(pub: Publication): string | null {
  if (pub.doi) return `https://doi.org/${pub.doi}`
  if (pub.url) return pub.url
  return null
}

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return ''
  if (authors.length === 1) return authors[0]
  if (authors.length === 2) return authors.join(' & ')
  return `${authors.slice(0, -1).join(', ')} & ${authors[authors.length - 1]}`
}

function venueInfo(pub: Publication): string {
  const parts: string[] = []
  if (pub.venue) parts.push(pub.venue)
  if (pub.volume) {
    let vol = `Vol. ${pub.volume}`
    if (pub.number) vol += `(${pub.number})`
    parts.push(vol)
  }
  if (pub.pages) parts.push(`pp. ${pub.pages}`)
  return parts.join(', ')
}

export default function PublicationsList({ publications, dictionary }: PublicationsListProps) {
  const shouldReduceMotion = useReducedMotion()

  // Group by type, preserving TYPE_ORDER
  const grouped = TYPE_ORDER.reduce<Map<Publication['type'], Publication[]>>((acc, type) => {
    const items = publications.filter((p) => p.type === type)
    if (items.length > 0) acc.set(type, items)
    return acc
  }, new Map())

  if (grouped.size === 0) return null

  let globalIndex = 0

  return (
    <section className="pub-list-section" aria-label={dictionary.publicationsLabel}>
      {[...grouped.entries()].map(([type, items]) => (
        <div key={type} className="pub-group">
          <h3 className="pub-group-label">{typeLabel(type, dictionary)}</h3>

          <ol className="pub-entries" aria-label={typeLabel(type, dictionary)}>
            {items.map((pub) => {
              const link = publisherLink(pub)
              const delay = shouldReduceMotion ? 0 : (globalIndex++ % 10) * 0.04

              return (
                <motion.li
                  key={pub.key}
                  className="pub-entry"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay, ease: 'easeOut' }}
                >
                  <div className="pub-entry-inner">
                    <p className="pub-authors">{formatAuthors(pub.authors)}</p>

                    <p className="pub-title-line">
                      {link ? (
                        <a
                          href={link}
                          className="pub-title-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pub.title}
                          <span className="pub-ext-icon" aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span className="pub-title-text">{pub.title}</span>
                      )}
                      <span className="pub-year">({pub.year})</span>
                    </p>

                    {venueInfo(pub) && (
                      <p className="pub-venue">{venueInfo(pub)}</p>
                    )}

                    {pub.doi && (
                      <p className="pub-doi">
                        <span className="pub-doi-label">DOI</span>
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          className="pub-doi-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pub.doi}
                        </a>
                      </p>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      ))}
    </section>
  )
}
