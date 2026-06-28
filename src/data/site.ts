import homeContent from '../../content/casino/home.json';

export interface HomeContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    backgroundImage: string;
    backgroundAlt: string;
    badge: string;
    headlineTop: string;
    headlineMain: string;
    headlineKicker: string;
    subheading: string;
    primaryCta: string;
    secondaryCta: string;
    searchTitle: string;
    searchSubtitle: string;
    liveActivityTitle: string;
    liveActivitySubtitle: string;
  };
  trustBadges: Array<{
    label: string;
    icon: 'shield' | 'lock' | 'cash' | 'check';
  }>;
  stats: Array<{
    value: string;
    label: string;
  }>;
  featuredGames: {
    eyebrow: string;
    titleAccent: string;
    title: string;
    description: string;
    buttonLabel: string;
  };
}

export const home = homeContent as HomeContent;
