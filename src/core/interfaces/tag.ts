export interface Tag {
  id: number;
  name: string;
}

export function compareTags(a: Tag, b: Tag): number {
  return a.name.localeCompare(b.name);
}
