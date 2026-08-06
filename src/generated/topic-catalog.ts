import type { TopicCatalogEntry } from "@/types/content";

export const topicCatalog: TopicCatalogEntry[] = [
  {
    "slug": "apis-and-data-exchange",
    "title": "APIs and Data Exchange",
    "eyebrow": "System boundaries · Contracts and communication",
    "summary": "See how software exposes capabilities, validates messages, reports outcomes, and evolves contracts without surprising its consumers.",
    "category": "Architecture",
    "level": "Intermediate",
    "estimatedMinutes": 30,
    "icon": "⇄",
    "accent": "oklch(0.67 0.19 310)",
    "aliases": [
      "api basics",
      "rest api",
      "graphql",
      "webhooks",
      "json api",
      "service communication"
    ],
    "keywords": [
      "api",
      "contract",
      "http",
      "rest",
      "graphql",
      "json",
      "schema",
      "authentication",
      "pagination",
      "idempotency",
      "webhook",
      "versioning"
    ]
  },
  {
    "slug": "git-and-github",
    "title": "Git and GitHub",
    "eyebrow": "Delivery workflow · History and collaboration",
    "summary": "Build a precise mental model of snapshots, branches, merges, remotes, pull requests, and automated checks without treating Git as a list of magic commands.",
    "category": "Tooling",
    "level": "Foundational",
    "estimatedMinutes": 28,
    "icon": "⑂",
    "accent": "oklch(0.68 0.18 25)",
    "aliases": [
      "version control",
      "git basics",
      "github workflow",
      "branches commits pull requests",
      "source control"
    ],
    "keywords": [
      "repository",
      "working tree",
      "staging area",
      "commit",
      "branch",
      "merge",
      "rebase",
      "remote",
      "push",
      "pull request",
      "github actions",
      "conflict"
    ]
  },
  {
    "slug": "how-the-web-works",
    "title": "How the Web Works",
    "eyebrow": "Foundation · Request to response",
    "summary": "Follow one web address from your browser through DNS, the network, a server, and back into a rendered page.",
    "category": "Web foundations",
    "level": "Foundational",
    "estimatedMinutes": 22,
    "icon": "◎",
    "accent": "oklch(0.67 0.18 250)",
    "aliases": [
      "internet request lifecycle",
      "browser to server",
      "website loading",
      "http lifecycle",
      "dns and http"
    ],
    "keywords": [
      "browser",
      "url",
      "dns",
      "ip address",
      "tcp",
      "tls",
      "http",
      "server",
      "response",
      "rendering"
    ]
  },
  {
    "slug": "html-css-and-javascript",
    "title": "HTML, CSS, and JavaScript",
    "eyebrow": "Foundation · Structure, presentation, behavior",
    "summary": "Understand the three core browser languages, the boundary each owns, and how they cooperate without becoming tangled.",
    "category": "Frontend",
    "level": "Foundational",
    "estimatedMinutes": 24,
    "icon": "◇",
    "accent": "oklch(0.71 0.17 155)",
    "aliases": [
      "html css js",
      "frontend basics",
      "web page languages",
      "markup styling scripting"
    ],
    "keywords": [
      "semantic html",
      "css cascade",
      "javascript",
      "dom",
      "accessibility",
      "progressive enhancement",
      "responsive design"
    ]
  },
  {
    "slug": "the-seven-types-of-databases",
    "title": "The 7 Types of Databases",
    "eyebrow": "Data systems · Practical selection model",
    "summary": "Compare seven useful database families by the shape of their data, the questions they answer well, and the trade-offs they introduce.",
    "category": "Data",
    "level": "Foundational",
    "estimatedMinutes": 36,
    "icon": "▦",
    "accent": "oklch(0.72 0.17 70)",
    "aliases": [
      "database types",
      "db types",
      "sql vs nosql",
      "which database",
      "data storage models"
    ],
    "keywords": [
      "relational",
      "document",
      "key value",
      "graph",
      "time series",
      "search engine",
      "vector database",
      "sql",
      "nosql",
      "transactions",
      "indexes"
    ]
  }
];
