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

const projectPartnerSchema = z.object({
  name: z.string().trim().min(1),
  role: localizedTextSchema.optional(),
  logoUrl: z.string().trim().min(1).optional(),
  url: z.string().trim().min(1).optional(),
})

const projectFundingSchema = z.object({
  source: z.string().trim().min(1),
  programme: z.string().trim().min(1).optional(),
  amount: z.string().trim().min(1).optional(),
  period: z.string().trim().min(1).optional(),
  grantId: z.string().trim().min(1).optional(),
  projectNumber: z.string().trim().min(1).optional(),
})

const projectLinkSchema = z.object({
  label: localizedTextSchema,
  url: z.string().trim().min(1),
})

const projectSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  body: localizedTextSchema.optional(),
  status: localizedTextSchema,
  funding: projectFundingSchema.optional(),
  partners: z.array(projectPartnerSchema).optional(),
  links: z.array(projectLinkSchema).optional(),
})

const highlightSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  detail: localizedTextSchema,
  body: localizedTextSchema.optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
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
  timeline: z.array(z.object({
    month: z.number().int().min(1).max(12),
    events: z.array(z.object({
      id: z.string().trim().min(1),
      title: localizedTextSchema,
      description: localizedTextSchema,
      type: z.enum(['launch', 'publication', 'award', 'milestone', 'partnership', 'conference']).optional(),
    })).min(1),
  })).optional(),
})
