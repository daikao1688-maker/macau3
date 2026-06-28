import promotionsContent from '../../content/casino/promotions.json';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  color: string;
  icon: string;
  code: string;
  image: string;
}

export interface PromotionsContent {
  section: {
    eyebrow: string;
    titleAccent: string;
    title: string;
    description: string;
    terms: string;
    disclaimer: string;
    buttonLabel: string;
  };
  promotions: Promotion[];
}

export const promotionsContentData = promotionsContent as PromotionsContent;
export const promotions = promotionsContentData.promotions;
