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
  chartTrendLabel: string
  backToReport: string
  openArticle: string
  openProject: string
  authorLabel: string
  statusLabel: string
  relatedArticlesLabel: string
  relatedProjectsLabel: string
  articleNotFoundTitle: string
  articleNotFoundBody: string
  projectNotFoundTitle: string
  projectNotFoundBody: string
  kpiComparisonLabel: string
  fundingLabel: string
  fundingProgrammeLabel: string
  fundingAmountLabel: string
  fundingPeriodLabel: string
  fundingGrantIdLabel: string
  projectNumberLabel: string
  projectPartnersLabel: string
  projectLinksLabel: string
  projectTeamLabel: string
  partnerRoleLabel: string
  highlightNotFoundTitle: string
  highlightNotFoundBody: string
  openHighlight: string
  relatedHighlightsLabel: string
  tagsLabel: string
  timelineLabel: string
  timelineNoEvents: string
  publicationsLabel: string
  publicationTypeArticle: string
  publicationTypeInproceedings: string
  publicationTypeBook: string
  publicationTypeReport: string
  publicationTypeMisc: string
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
    chartTrendLabel: 'Verlauf',
    backToReport: 'Zurück zum Bericht',
    openArticle: 'Artikel lesen',
    openProject: 'Projekt ansehen',
    authorLabel: 'Autor',
    statusLabel: 'Status',
    relatedArticlesLabel: 'Weitere Artikel aus diesem Bericht',
    relatedProjectsLabel: 'Weitere Projekte aus diesem Bericht',
    articleNotFoundTitle: 'Artikel nicht gefunden',
    articleNotFoundBody: 'Dieser Artikel existiert nicht oder wurde entfernt.',
    projectNotFoundTitle: 'Projekt nicht gefunden',
    projectNotFoundBody: 'Dieses Projekt existiert nicht oder wurde entfernt.',
    kpiComparisonLabel: 'Kennzahlen im Vergleich',
    fundingLabel: 'Foerderung',
    fundingProgrammeLabel: 'Programm',
    fundingAmountLabel: 'Foerdersumme',
    fundingPeriodLabel: 'Laufzeit',
    fundingGrantIdLabel: 'Kennung',
    projectNumberLabel: 'Projektnummer',
    projectPartnersLabel: 'Projektpartner',
    projectLinksLabel: 'Weiterführende Links',
    projectTeamLabel: 'Projektteam',
    partnerRoleLabel: 'Rolle',
    highlightNotFoundTitle: 'Highlight nicht gefunden',
    highlightNotFoundBody: 'Dieses Highlight existiert nicht oder wurde entfernt.',
    openHighlight: 'Highlight lesen',
    relatedHighlightsLabel: 'Weitere Highlights aus diesem Bericht',
    tagsLabel: 'Themen',
    timelineLabel: 'Jahresrückblick',
    timelineNoEvents: 'Keine Ereignisse fuer diesen Monat verfuegbar.',
    publicationsLabel: 'Publikationen',
    publicationTypeArticle: 'Zeitschriftenartikel',
    publicationTypeInproceedings: 'Konferenzbeiträge',
    publicationTypeBook: 'Bücher & Buchkapitel',
    publicationTypeReport: 'Berichte',
    publicationTypeMisc: 'Sonstige',
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
    chartTrendLabel: 'Trend',
    backToReport: 'Back to Report',
    openArticle: 'Read article',
    openProject: 'View project',
    authorLabel: 'Author',
    statusLabel: 'Status',
    relatedArticlesLabel: 'More articles from this report',
    relatedProjectsLabel: 'More projects from this report',
    articleNotFoundTitle: 'Article not found',
    articleNotFoundBody: 'This article does not exist or has been removed.',
    projectNotFoundTitle: 'Project not found',
    projectNotFoundBody: 'This project does not exist or has been removed.',
    kpiComparisonLabel: 'KPI comparison',
    fundingLabel: 'Funding',
    fundingProgrammeLabel: 'Programme',
    fundingAmountLabel: 'Grant amount',
    fundingPeriodLabel: 'Duration',
    fundingGrantIdLabel: 'Grant ID',
    projectNumberLabel: 'Project number',
    projectPartnersLabel: 'Project partners',
    projectLinksLabel: 'External links',
    projectTeamLabel: 'Project team',
    partnerRoleLabel: 'Role',
    highlightNotFoundTitle: 'Highlight not found',
    highlightNotFoundBody: 'This highlight does not exist or has been removed.',
    openHighlight: 'Read highlight',
    relatedHighlightsLabel: 'More highlights from this report',
    tagsLabel: 'Topics',
    timelineLabel: 'Year in review',
    timelineNoEvents: 'No events available for this month.',
    publicationsLabel: 'Publications',
    publicationTypeArticle: 'Journal articles',
    publicationTypeInproceedings: 'Conference papers',
    publicationTypeBook: 'Books & book chapters',
    publicationTypeReport: 'Reports',
    publicationTypeMisc: 'Other',
  },
}

export function getUiDictionary(locale: Locale): UiDictionary {
  return uiDictionary[locale]
}
