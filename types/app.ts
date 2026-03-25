export type AvailabilityType = "Espresso" | "Filter" | "Retail bag";

export type ReactionKind = "Loved it" | "Liked it" | "Not for me";

export type BeanCafeAvailability = {
  name: string;
  slug: string;
  distance: string;
  freshness: string;
  types: AvailabilityType[];
};

export type Bean = {
  id: string;
  name: string;
  roaster: string;
  roasterSlug: string;
  origin: string;
  process: string;
  roast: string;
  matchText: string;
  notes: string[];
  availability: AvailabilityType[];
  cafes: BeanCafeAvailability[];
};

export type CafeBean = {
  id: string;
  name: string;
  roaster: string;
  roasterSlug: string;
  notes: string[];
  types: AvailabilityType[];
  match?: string;
};

export type Cafe = {
  id: string;
  name: string;
  area: string;
  description: string;
  vibeTags: string[];
  updated: string;
  hours: string;
  address: string;
  brunchNote?: string;
  beans: CafeBean[];
};

export type RoasterFeaturedBean = {
  id: string;
  name: string;
  notes: string[];
  roast: string;
  availability: AvailabilityType[];
};

export type RoasterNearbyCafe = {
  id: string;
  name: string;
  distance: string;
  freshness: string;
};

export type Roaster = {
  id: string;
  name: string;
  description: string;
  flavorDirection: string;
  featuredBeans: RoasterFeaturedBean[];
  nearbyCafes: RoasterNearbyCafe[];
};

export type SavedBean = {
  id: string;
  name: string;
  roaster: string;
  notes: string[];
  nearby: string;
  freshness: string;
};

export type SavedCafe = {
  id: string;
  name: string;
  area: string;
  tags: string[];
  cue: string;
};

export type SavedRoaster = {
  id: string;
  name: string;
  direction: string;
  update: string;
};

export type SavedState = {
  beans: SavedBean[];
  cafes: SavedCafe[];
  roasters: SavedRoaster[];
};

export type ActivityEntry = {
  id: string;
  beanId: string;
  bean: string;
  venue: string;
  reaction: ReactionKind;
  note: string;
  tags: string[];
  date: string;
};