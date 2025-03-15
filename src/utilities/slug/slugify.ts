import slugify from 'slugify';

export default function slugifyString(string: string): string {
  return slugify(string, {
    lower: true,
    strict: true,
  });
}
