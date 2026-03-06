import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import SiteFooter from '#/components/layout/SiteFooter'
import SiteHeader from '#/components/layout/SiteHeader'
import { getUiDictionary } from '#/lib/i18n/dictionary'
import {
  DEFAULT_LOCALE,
  resolveLocaleParam,
  withLocaleInPath,
} from '#/lib/i18n/locale'

export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params, location }) => {
    const locale = resolveLocaleParam(params.locale)

    if (!locale) {
      throw redirect({
        href: withLocaleInPath(location.pathname, DEFAULT_LOCALE),
      })
    }
  },
  loader: ({ params }) => {
    const locale = resolveLocaleParam(params.locale) ?? DEFAULT_LOCALE

    return {
      locale,
      dictionary: getUiDictionary(locale),
    }
  },
  component: LocaleLayout,
})

function LocaleLayout() {
  const { locale, dictionary } = Route.useLoaderData()

  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <Outlet />
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  )
}
