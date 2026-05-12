'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/data/content';

const OPTS: { id: Locale; label: string; cls: string }[] = [
  { id: 'en',  label: 'EN',      cls: '' },
  { id: 'ur',  label: 'اردو',    cls: 'urdu' },
  { id: 'mew', label: 'میواتی', cls: 'urdu' },
];

export default function LangSwitcher({ compact }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(target: Locale) {
    const segments = pathname.split('/');
    segments[1] = target;
    router.push(segments.join('/') || '/');
  }

  return (
    <div className="mp-lang" style={compact ? { padding: 2 } : undefined}>
      {OPTS.map(o => (
        <button
          key={o.id}
          className={`${o.cls} ${locale === o.id ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); switchLocale(o.id); }}
          lang={o.id === 'en' ? 'en' : o.id === 'ur' ? 'ur' : 'mew'}
          dir={o.id === 'en' ? 'ltr' : 'rtl'}
          aria-label={`Switch to ${o.label}`}
          aria-current={locale === o.id ? 'true' : undefined}
          style={compact ? { padding: o.cls ? '1px 8px' : '3px 8px', fontSize: o.cls ? 12 : 11 } : undefined}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
