import { useRouter, useRouterState } from '@tanstack/react-router'
import { getOtherLocale, withLocaleInPath, type Locale } from '#/lib/i18n/locale'
import type { UiDictionary } from '#/lib/i18n/dictionary'

interface LanguageSwitcherProps {
  locale: Locale
  dictionary: UiDictionary
}

export default function LanguageSwitcher({
  locale,
  dictionary,
}: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const targetLocale = getOtherLocale(locale)
  const suffix =
    typeof window === 'undefined'
      ? ''
      : `${window.location.search}${window.location.hash}`
  const targetHref = `${withLocaleInPath(pathname, targetLocale)}${suffix}`

  return (
    <button
      type="button"
      className="language-switch"
      onClick={() => {
        void router.navigate({ href: targetHref })
      }}
      aria-label={dictionary.switchLanguageLabel}
    >
      {dictionary.switchLanguageAction}
    </button>
  )
}
