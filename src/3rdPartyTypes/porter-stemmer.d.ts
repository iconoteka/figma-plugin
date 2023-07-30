declare module "porter-stemmer" {
  export function stemmer(w: string): string;
  export const memoizingStemmer: (w: string) => string;
}
