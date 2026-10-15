import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../components/common/TranslationProvider';
import type { PrivateRouteSEOProps } from '../types';

export const PrivateRouteSEO: React.FC<PrivateRouteSEOProps> = ({ description }) => {
  const { t } = useTranslation();
  const title = `${t('common.adminAuth.title') as string} | ${t('seo.site.title') as string}`;
  const canonical = `${window.location.origin}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};
