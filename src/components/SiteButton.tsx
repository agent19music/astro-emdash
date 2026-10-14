import { LinkButton } from '@cloudflare/kumo/components/button';
import { resolveSiteLink } from '../lib/site-links';

interface Props {
  href: string;
  label: string;
  primary?: boolean;
  className?: string;
}

/** Native navigation, rendered by Kumo on the server; no client island needed. */
export default function SiteButton({ href, label, primary = false, className = '' }: Props) {
  return (
    <LinkButton
      href={resolveSiteLink(href)}
      variant={primary ? 'primary' : 'outline'}
      size="lg"
      className={`kumo-site-action btn ${primary ? 'btn-primary' : 'btn-secondary'} ${className}`}
      data-site-control="true"
    >
      {label}
    </LinkButton>
  );
}
