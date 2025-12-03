import { cn } from '@/lib/utils'
import { useTranslation } from './TranslationProvider'

// Empty component
export default function Empty() {
  const { t } = useTranslation();
  return (
    <div className={cn('flex h-full items-center justify-center')}>{t('common.noData') as string}</div>
  )
}
