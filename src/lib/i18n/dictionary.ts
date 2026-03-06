import type { Locale } from './locale'

export interface UiDictionary {
  siteTitle: string
  siteSubtitle: string
  landingTitle: string
  landingIntro: string
  landingMetricsTitle: string
  availableYears: string
  openReport: string
  published: string
  customDesign: string
  defaultDesign: string
  sectionsLabel: string
  yearsPublishedLabel: string
  customLayoutsLabel: string
  sectionCoverageLabel: string
  filterAllLabel: string
  filterCustomLabel: string
  filterDefaultLabel: string
  showingLabel: string
  availableInLabel: string
  yearlyNavigation: string
  sectionNavigation: string
  fallbackNotice: string
  switchLanguageLabel: string
  switchLanguageAction: string
  reportNotFoundTitle: string
  reportNotFoundBody: string
  backToOverview: string
  cooperationPartnersTitle: string
  statsTitle: string
  reportOverviewLabel: string
  articlesMetricLabel: string
  projectsMetricLabel: string
  partnersMetricLabel: string
  peakMetricLabel: string
  growthMetricLabel: string
  chartAverageLabel: string
  chartFocusLabel: string
  chartFromStartLabel: string
}

export const uiDictionary: Record<Locale, UiDictionary> = {
  de: {
    siteTitle: 'Jahresberichte',
    siteSubtitle: 'Forschungsinstitut',
    landingTitle: 'Forschung transparent dokumentiert',
    landingIntro:
      'Entdecken Sie unsere Jahresberichte mit einem einheitlichen Datenmodell, interaktiven Statistiken und jahrgangsspezifischen Designs.',
    landingMetricsTitle: 'Institutsmonitor',
    availableYears: 'Verfuegbare Berichtsjahre',
    openReport: 'Bericht oeffnen',
    published: 'Veroeffentlicht',
    customDesign: 'Individuelles Design',
    defaultDesign: 'Standardlayout',
    sectionsLabel: 'Pflichtsektionen',
    yearsPublishedLabel: 'Jahre im Archiv',
    customLayoutsLabel: 'Jahre mit Sonderdesign',
    sectionCoverageLabel: 'Pflichtsektionen pro Bericht',
    filterAllLabel: 'Alle',
    filterCustomLabel: 'Nur Sonderdesigns',
    filterDefaultLabel: 'Nur Standardlayout',
    showingLabel: 'Angezeigt',
    availableInLabel: 'Verfuegbar in',
    yearlyNavigation: 'Jahresnavigation',
    sectionNavigation: 'Sektionsnavigation',
    fallbackNotice:
      'Der angeforderte Bericht liegt nicht vollstaendig in dieser Sprache vor. Inhalt wird aus der Standardsprache dargestellt.',
    switchLanguageLabel: 'Sprache wechseln',
    switchLanguageAction: 'Switch to English',
    reportNotFoundTitle: 'Berichtsjahr nicht gefunden',
    reportNotFoundBody:
      'Fuer dieses Jahr existiert noch kein veroefentlichter Bericht. Bitte waehlen Sie ein anderes Jahr.',
    backToOverview: 'Zur Uebersicht',
    cooperationPartnersTitle: 'Kooperationspartner',
    statsTitle: 'Statistiken',
    reportOverviewLabel: 'Bericht im Ueberblick',
    articlesMetricLabel: 'Artikel',
    projectsMetricLabel: 'Projekte',
    partnersMetricLabel: 'Partner',
    peakMetricLabel: 'Staerkste Kennzahl',
    growthMetricLabel: 'Entwicklung seit Jahresbeginn',
    chartAverageLabel: 'Durchschnitt',
    chartFocusLabel: 'Fokus',
    chartFromStartLabel: 'seit Start',
  },
  en: {
    siteTitle: 'Annual Reports',
    siteSubtitle: 'Research Institute',
    landingTitle: 'Research impact documented with clarity',
    landingIntro:
      'Explore annual reports with a shared data contract, interactive statistics, and year-specific visual storytelling.',
    landingMetricsTitle: 'Institute monitor',
    availableYears: 'Available report years',
    openReport: 'Open report',
    published: 'Published',
    customDesign: 'Custom design',
    defaultDesign: 'Default layout',
    sectionsLabel: 'Required sections',
    yearsPublishedLabel: 'Years in archive',
    customLayoutsLabel: 'Years with custom design',
    sectionCoverageLabel: 'Required sections per report',
    filterAllLabel: 'All',
    filterCustomLabel: 'Custom only',
    filterDefaultLabel: 'Default only',
    showingLabel: 'Showing',
    availableInLabel: 'Available in',
    yearlyNavigation: 'Year navigation',
    sectionNavigation: 'Section navigation',
    fallbackNotice:
      'The requested report is not fully available in this language. Content is shown in the default locale.',
    switchLanguageLabel: 'Switch language',
    switchLanguageAction: 'Zu Deutsch wechseln',
    reportNotFoundTitle: 'Report year not found',
    reportNotFoundBody:
      'There is no published report for this year yet. Please choose another year.',
    backToOverview: 'Back to overview',
    cooperationPartnersTitle: 'Cooperation partners',
    statsTitle: 'Stats',
    reportOverviewLabel: 'Report overview',
    articlesMetricLabel: 'Articles',
    projectsMetricLabel: 'Projects',
    partnersMetricLabel: 'Partners',
    peakMetricLabel: 'Strongest KPI',
    growthMetricLabel: 'Growth since year start',
    chartAverageLabel: 'Average',
    chartFocusLabel: 'Focus',
    chartFromStartLabel: 'from start',
  },
}

export function getUiDictionary(locale: Locale): UiDictionary {
  return uiDictionary[locale]
}
