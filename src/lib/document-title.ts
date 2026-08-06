export const SITE_TITLE = "Everything About Development";

export function getTopicDocumentTitle(topicTitle?: string): string {
  return topicTitle ? `${topicTitle} · ${SITE_TITLE}` : SITE_TITLE;
}
