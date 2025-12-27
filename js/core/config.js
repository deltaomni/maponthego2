export const MAIN_DOMAINS = [
  'maponthego.com',
  'www.maponthego.com',
  'localhost'
];

export function isMainDomain() {
  return MAIN_DOMAINS.includes(location.hostname);
}
