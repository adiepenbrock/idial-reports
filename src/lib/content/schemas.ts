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

// ── Per-item meta schemas ──────────────────────────────────────────────────

export const articleMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  author: z.string().trim().min(1),
  title: localizedTextSchema,
  teaser: localizedTextSchema,
})

export const projectPartnerSchema = z.object({
  name: z.string().trim().min(1),
  role: localizedTextSchema.optional(),
  logoUrl: z.string().trim().min(1).optional(),
  url: z.string().trim().min(1).optional(),
})

export const projectFundingSchema = z.object({
  source: z.string().trim().min(1),
  programme: z.string().trim().min(1).optional(),
  amount: z.string().trim().min(1).optional(),
  period: z.string().trim().min(1).optional(),
  grantId: z.string().trim().min(1).optional(),
  projectNumber: z.string().trim().min(1).optional(),
})

export const projectLinkSchema = z.object({
  label: localizedTextSchema,
  url: z.string().trim().min(1),
})

export const projectTeamMemberSchema = z.object({
  name: z.string().trim().min(1),
  role: localizedTextSchema,
  avatarUrl: z.string().trim().min(1).optional(),
})

export const projectMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  status: localizedTextSchema,
  funding: projectFundingSchema.optional(),
  partners: z.array(projectPartnerSchema).optional(),
  links: z.array(projectLinkSchema).optional(),
  team: z.array(projectTeamMemberSchema).optional(),
})

export const highlightMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  title: localizedTextSchema,
  detail: localizedTextSchema,
  tags: z.array(z.string().trim().min(1)).optional(),
})

export const cooperationPartnerMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  name: z.string().trim().min(1),
  contribution: localizedTextSchema,
})

export const kpiMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  value: z.number(),
  unit: z.string().trim().min(1).optional(),
  delta: z.string().trim().min(1),
  label: localizedTextSchema,
  description: localizedTextSchema,
})

const chartPointSchema = z.object({
  id: z.string().trim().min(1),
  label: localizedTextSchema,
  value: z.number(),
})

export const chartMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  type: z.enum(['bar', 'line', 'column', 'pie']).optional(),
  title: localizedTextSchema,
  description: localizedTextSchema,
  unit: z.string().trim().min(1).optional(),
  points: z.array(chartPointSchema).min(2),
})

export const timelineEventMetaSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().min(1),
  title: localizedTextSchema,
  description: localizedTextSchema,
  type: z.enum(['launch', 'publication', 'award', 'milestone', 'partnership', 'conference']).optional(),
})

// ── Assembled year data schema (produced by the loader, not read from disk) ─

export const resolvedYearDataSchema = z.object({
  stats: z.object({
    kpis: z.array(kpiMetaSchema.omit({ order: true })).min(1),
    charts: z.array(chartMetaSchema.omit({ order: true })).min(1),
  }),
  articles: z.array(articleMetaSchema.omit({ order: true })).min(1),
  projects: z.array(projectMetaSchema.omit({ order: true })).min(1),
  highlights: z.array(highlightMetaSchema.omit({ order: true })).min(1),
  cooperationPartners: z.array(cooperationPartnerMetaSchema.omit({ order: true })).min(1),
  timeline: z.array(z.object({
    month: z.number().int().min(1).max(12),
    events: z.array(timelineEventMetaSchema.omit({ order: true })).min(1),
  })).optional(),
})
