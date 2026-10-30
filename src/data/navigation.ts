/** Main navigation, in display order. Contact is the header's one action. */
export const navigation = [
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Journey', to: '/journey' },
];

/** Every page, for the phone menu and the footer. */
export const allPages = [{ label: 'Home', to: '/' }, ...navigation, { label: 'Contact', to: '/contact' }];
