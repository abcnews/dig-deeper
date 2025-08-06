type ImageRendition = {
  url: string;
  width: number;
  ratio: string;
};

type CardImage = {
  alt: string;
  url: string;
  renditions: ImageRendition[];
  alignment: 'right' | 'left';
};

type CardConfig = {
  colour?: string;
  alignment?: string;
};

type TCard = {
  title: string;
  quote?: {
    content: HTMLElement[];
    attribution?: HTMLElement;
  };
  image?: CardImage;
  detail: HTMLElement[];
  config: CardConfig;
};

type CardsCollector = {
  next?: TCard;
  cards: TCard[];
};
