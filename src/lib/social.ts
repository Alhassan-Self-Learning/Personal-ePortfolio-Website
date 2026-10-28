import { site } from '@/data/site';
import { socialProfiles } from '@/data/social';
import type { SocialPlatform, SocialProfile } from '@/types/content';

export const platformLabels: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  x: 'X',
  whatsapp: 'WhatsApp',
  youtube: 'YouTube',
  telegram: 'Telegram',
  discord: 'Discord',
  medium: 'Medium',
  email: 'Email',
  website: 'Website',
  tryhackme: 'TryHackMe',
  hackthebox: 'Hack The Box',
  custom: 'Link',
};

export interface ResolvedSocial {
  id: string;
  platform: SocialPlatform;
  label: string;
  href: string;
  /** What to show as text next to the icon (username, address, or label). */
  display: string;
  featured: boolean;
  external: boolean;
}

const isHttpUrl = (u?: string) => !!u && /^https?:\/\/[^\s]+\.[^\s]+/.test(u.trim());

/** Turns a configured profile into a link, or null if it isn't usable. */
export function resolveSocial(p: SocialProfile): ResolvedSocial | null {
  if (!p.visible) return null;
  const label = p.label ?? platformLabels[p.platform];
  if (p.platform === 'email') {
    const address = (p.username || site.profile.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return null;
    return { id: p.id, platform: p.platform, label, href: `mailto:${address}`, display: address, featured: !!p.featured, external: false };
  }
  if (p.platform === 'whatsapp') {
    const digits = (p.phone ?? '').replace(/\D/g, '');
    if (digits.length < 8) return null;
    return {
      id: p.id,
      platform: p.platform,
      label,
      href: `https://wa.me/${digits}`,
      display: p.showPhone ? `+${digits}` : 'Message on WhatsApp',
      featured: !!p.featured,
      external: true,
    };
  }
  if (!isHttpUrl(p.url)) return null;
  const url = p.url!.trim();
  const display = p.username ? p.username : url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return { id: p.id, platform: p.platform, label, href: url, display, featured: !!p.featured, external: true };
}

export function getSocialLinks(opts: { featuredOnly?: boolean } = {}): ResolvedSocial[] {
  return [...socialProfiles]
    .sort((a, b) => a.order - b.order)
    .map(resolveSocial)
    .filter((s): s is ResolvedSocial => !!s && (!opts.featuredOnly || s.featured));
}
