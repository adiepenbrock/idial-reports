import { z } from 'zod'

export const localizedTextSchema = z.object({
  de: z.string().trim().min(1),
  en: z.string().trim().min(1),
})

export const yearMetaSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  publishedAt: z.string().min(1),
  localeMeta: z.object({
    de: z.object({
      title: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      forewordLead: z.string().trim().min(1),
    }),
    en: z.object({
      title: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      forewordLead: z.string().trim().min(1),
    }),
  }),
})

const kpiSchema = z.object({
  id: z.string().trim().min(1),
  label: localizedTextSchema,
  description: localizedTextSchema,
  value: z.number(),
  unit: z.string().trim().min(1).optional(),
  delta: z.string().trim().min(1),
})

const chartPointSchema = z.object({
  id: z.string().trim().min(1),
  label: localizedTextSchema,
  value: z.number(),
})

const chartSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  description: localizedTextSchema,
  unit: z.string().trim().min(1).optional(),
  points: z.array(chartPointSchema).min(2),
})

const articleSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  teaser: localizedTextSchema,
  author: z.string().trim().min(1),
})

const projectSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  status: localizedTextSchema,
})

const highlightSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  detail: localizedTextSchema,
})

const partnerSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  contribution: localizedTextSchema,
})

export const yearDataSchema = z.object({
  stats: z.object({
    kpis: z.array(kpiSchema).min(1),
    charts: z.array(chartSchema).min(1),
  }),
  articles: z.array(articleSchema).min(1),
  projects: z.array(projectSchema).min(1),
  highlights: z.array(highlightSchema).min(1),
  cooperationPartners: z.array(partnerSchema).min(1),
})
