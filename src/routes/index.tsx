import { createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_LOCALE } from '#/lib/i18n/locale'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/$locale',
      params: {
        locale: DEFAULT_LOCALE,
      },
    })
  },
})
