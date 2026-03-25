import type {
  Bean,
  Cafe,
  Roaster,
  SavedState,
  ActivityEntry,
} from "../types/app";

export const mockBeans: Record<string, Bean> = {
  "guji-natural": {
    id: "guji-natural",
    name: "Guji Perfect",
    roaster: "Dark Arts Coffee",
    roasterSlug: "dark-arts-coffee",
    origin: "Ethiopia",
    process: "Natural",
    roast: "Light Roast",
    matchText: "Matches your berry + floral taste",
    notes: ["Blueberry", "Violet", "Silky Body", "Bergamot"],
    availability: ["Espresso", "Filter", "Retail bag"],
    cafes: [
      {
        name: "Rosslyn Coffee",
        slug: "rosslyn-coffee",
        distance: "0.3 mi",
        freshness: "Updated today",
        types: ["Filter", "Retail bag"],
      },
      {
        name: "Prufrock Coffee",
        slug: "prufrock-coffee",
        distance: "0.8 mi",
        freshness: "Updated 4h ago",
        types: ["Espresso"],
      },
    ],
  },
  "washed-yirgacheffe": {
    id: "washed-yirgacheffe",
    name: "Washed Yirgacheffe",
    roaster: "Square Mile",
    roasterSlug: "square-mile",
    origin: "Ethiopia",
    process: "Washed",
    roast: "Light Roast",
    matchText: "Fits your floral + citrus profile",
    notes: ["Jasmine", "Bergamot", "Clean Cup", "Tea-like"],
    availability: ["Espresso", "Filter"],
    cafes: [
      {
        name: "Rosslyn Coffee",
        slug: "rosslyn-coffee",
        distance: "0.4 mi",
        freshness: "Updated 2h ago",
        types: ["Espresso", "Filter"],
      },
    ],
  },
};

export const mockCafes: Record<string, Cafe> = {
  "rosslyn-coffee": {
    id: "rosslyn-coffee",
    name: "Rosslyn Coffee",
    area: "City Center",
    description:
      "A calm specialty spot with a polished bar, rotating coffees, and a pace that makes both quick stops and long mornings feel right.",
    vibeTags: ["Work-friendly", "Brunch", "Outdoor seating"],
    updated: "Updated today",
    hours: "Mon–Sun • 07:30–18:00",
    address: "12 Queen Street",
    brunchNote: "Pastries and light brunch plates available until 14:00.",
    beans: [
      {
        id: "guji-natural",
        name: "Guji Natural",
        roaster: "Dark Arts Coffee",
        roasterSlug: "dark-arts-coffee",
        notes: ["Blueberry", "Violet"],
        types: ["Filter", "Retail bag"],
        match: "Strong match",
      },
      {
        id: "washed-yirgacheffe",
        name: "Washed Yirgacheffe",
        roaster: "Square Mile",
        roasterSlug: "square-mile",
        notes: ["Jasmine", "Bergamot"],
        types: ["Espresso"],
      },
    ],
  },
  "prufrock-coffee": {
    id: "prufrock-coffee",
    name: "Prufrock Coffee",
    area: "Bloomsbury",
    description:
      "An iconic city café with a serious coffee program, warm interior textures, and a menu that makes lingering easy.",
    vibeTags: ["Brunch", "Work-friendly"],
    updated: "Updated 4h ago",
    hours: "Mon–Sat • 08:00–17:30",
    address: "23 Leather Lane",
    brunchNote: "Kitchen menu and all-day coffee service.",
    beans: [
      {
        id: "washed-yirgacheffe",
        name: "Washed Yirgacheffe",
        roaster: "Square Mile",
        roasterSlug: "square-mile",
        notes: ["Jasmine", "Tea-like"],
        types: ["Espresso", "Filter"],
        match: "Great for your profile",
      },
    ],
  },
};

export const mockRoasters: Record<string, Roaster> = {
  "dark-arts-coffee": {
    id: "dark-arts-coffee",
    name: "Dark Arts Coffee",
    description:
      "A roaster with a bold visual identity and expressive coffees that lean toward fruit, sweetness, and memorable texture.",
    flavorDirection: "Berry-forward, vibrant, and layered.",
    featuredBeans: [
      {
        id: "guji-natural",
        name: "Guji Natural",
        notes: ["Blueberry", "Violet"],
        roast: "Light Roast",
        availability: ["Filter", "Retail bag"],
      },
      {
        id: "washed-yirgacheffe",
        name: "Washed Yirgacheffe",
        notes: ["Jasmine", "Citrus"],
        roast: "Light Roast",
        availability: ["Espresso"],
      },
    ],
    nearbyCafes: [
      {
        id: "rosslyn-coffee",
        name: "Rosslyn Coffee",
        distance: "0.3 mi",
        freshness: "Updated today",
      },
      {
        id: "prufrock-coffee",
        name: "Prufrock Coffee",
        distance: "0.9 mi",
        freshness: "Updated 5h ago",
      },
    ],
  },
  "square-mile": {
    id: "square-mile",
    name: "Square Mile",
    description:
      "A clean, precise specialty roaster focused on clarity, structure, and dependable seasonal coffees.",
    flavorDirection: "Clean cups, citrus brightness, and balanced sweetness.",
    featuredBeans: [
      {
        id: "washed-yirgacheffe",
        name: "Washed Yirgacheffe",
        notes: ["Jasmine", "Bergamot"],
        roast: "Light Roast",
        availability: ["Espresso", "Filter"],
      },
    ],
    nearbyCafes: [
      {
        id: "prufrock-coffee",
        name: "Prufrock Coffee",
        distance: "0.8 mi",
        freshness: "Updated 4h ago",
      },
    ],
  },
};

export const mockSaved: SavedState = {
  beans: [
    {
      id: "guji-natural",
      name: "Guji Natural",
      roaster: "Dark Arts Coffee",
      notes: ["Blueberry", "Violet"],
      nearby: "Rosslyn Coffee",
      freshness: "Updated today",
    },
    {
      id: "washed-yirgacheffe",
      name: "Washed Yirgacheffe",
      roaster: "Square Mile",
      notes: ["Jasmine", "Bergamot"],
      nearby: "Prufrock Coffee",
      freshness: "Updated 4h ago",
    },
  ],
  cafes: [
    {
      id: "rosslyn-coffee",
      name: "Rosslyn Coffee",
      area: "City Center",
      tags: ["Work-friendly", "Brunch"],
      cue: "2 beans matching your profile",
    },
    {
      id: "prufrock-coffee",
      name: "Prufrock Coffee",
      area: "Bloomsbury",
      tags: ["Brunch", "Outdoor seating"],
      cue: "Fresh espresso option nearby",
    },
  ],
  roasters: [
    {
      id: "dark-arts-coffee",
      name: "Dark Arts Coffee",
      direction: "Berry-forward and vibrant",
      update: "New drop nearby",
    },
    {
      id: "square-mile",
      name: "Square Mile",
      direction: "Clean, citrus, balanced",
      update: "Updated 4h ago",
    },
  ],
};

export const mockActivity: ActivityEntry[] = [
  {
    id: "guji-natural-1",
    beanId: "guji-natural",
    bean: "Guji Natural",
    venue: "Rosslyn Coffee",
    reaction: "Loved it",
    note: "Sweet and vivid, especially as filter.",
    tags: ["Blueberry", "Silky"],
    date: "Today",
  },
  {
    id: "washed-yirgacheffe-1",
    beanId: "washed-yirgacheffe",
    bean: "Washed Yirgacheffe",
    venue: "Prufrock Coffee",
    reaction: "Liked it",
    note: "Clean and bright, better than expected on espresso.",
    tags: ["Jasmine", "Citrus"],
    date: "Yesterday",
  },
];