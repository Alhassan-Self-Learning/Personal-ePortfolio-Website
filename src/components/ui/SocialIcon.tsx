import { Globe, Link2, Mail } from 'lucide-react';
import {
  siDiscord,
  siGithub,
  siHackthebox,
  siInstagram,
  siLinkedin,
  siMedium,
  siTelegram,
  siTryhackme,
  siWhatsapp,
  siX,
  siYoutube,
  type SimpleIcon,
} from 'simple-icons';
import type { SocialPlatform } from '@/types/content';

const brands: Partial<Record<SocialPlatform, SimpleIcon>> = {
  linkedin: siLinkedin,
  github: siGithub,
  instagram: siInstagram,
  x: siX,
  whatsapp: siWhatsapp,
  youtube: siYoutube,
  telegram: siTelegram,
  discord: siDiscord,
  medium: siMedium,
  tryhackme: siTryhackme,
  hackthebox: siHackthebox,
};

export function SocialIcon({ platform, size = 18 }: { platform: SocialPlatform; size?: number }) {
  const brand = brands[platform];
  if (brand) {
    return (
      <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d={brand.path} />
      </svg>
    );
  }
  const Icon = platform === 'email' ? Mail : platform === 'website' ? Globe : Link2;
  return <Icon size={size} aria-hidden="true" />;
}
