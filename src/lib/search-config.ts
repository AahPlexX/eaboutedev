export const SEARCH_OPTIONS = {
  fields: ["title", "summary", "category", "aliases", "keywords", "sectionTitles", "glossaryText"],
  storeFields: ["slug", "title", "summary", "category", "level", "estimatedMinutes"],
  idField: "slug",
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: {
      title: 5,
      aliases: 4,
      keywords: 3,
      sectionTitles: 2,
      category: 1.5,
    },
  },
};
