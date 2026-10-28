import type { SocialProfile } from '@/types/content';

/**
 * Social profiles. A profile only appears when `visible` is true AND it has a
 * usable destination (url / username for email / phone for WhatsApp).
 * `featured` profiles also appear on the homepage; every visible one appears
 * in the footer and on the Contact page.
 *
 * Fill in the ones you use and set `visible: true`.
 */
export const socialProfiles: SocialProfile[] = [
  { id: 'linkedin', platform: 'linkedin', url: '', order: 1, visible: false, featured: true },
  { id: 'github', platform: 'github', url: '', order: 2, visible: false, featured: true },
  { id: 'tryhackme', platform: 'tryhackme', url: '', order: 3, visible: false, featured: true },
  { id: 'hackthebox', platform: 'hackthebox', url: '', order: 4, visible: false },
  { id: 'medium', platform: 'medium', url: '', order: 5, visible: false },
  { id: 'x', platform: 'x', url: '', order: 6, visible: false },
  { id: 'instagram', platform: 'instagram', url: '', order: 7, visible: false },
  { id: 'youtube', platform: 'youtube', url: '', order: 8, visible: false },
  { id: 'telegram', platform: 'telegram', url: '', order: 9, visible: false },
  { id: 'discord', platform: 'discord', url: '', order: 10, visible: false },
  /** International format, digits only — e.g. '968XXXXXXXX'. The number stays hidden unless showPhone is true. */
  { id: 'whatsapp', platform: 'whatsapp', phone: '', showPhone: false, order: 11, visible: false },
  /** Uses site.profile.email when username is empty. */
  { id: 'email', platform: 'email', username: '', order: 12, visible: true, featured: true },
  { id: 'website', platform: 'website', url: '', order: 13, visible: false },
  // { id: 'my-blog', platform: 'custom', label: 'Blog', url: 'https://…', order: 14, visible: true },
];
