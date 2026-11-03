import type { ResumeSchema } from '../types/schema';

export function parseResumeSchema(raw: string): ResumeSchema {
  const value: unknown = JSON.parse(raw);
  if (!isResumeSchema(value)) throw new Error('Invalid resume schema');
  return value;
}

function isResumeSchema(value: unknown): value is ResumeSchema {
  if (!hasStrings(value, [])) return false;
  const { profile, sections } = value;

  return (
    hasStrings(profile, ['name', 'avatarSrc', 'summary']) &&
    Array.isArray(profile.headerItems) &&
    profile.headerItems.every(
      (item) =>
        hasStrings(item, ['id', 'label', 'value']) &&
        (item.kind === 'text' || item.kind === 'link') &&
        typeof item.showLabel === 'boolean' &&
        (item.href === undefined || typeof item.href === 'string')
    ) &&
    Array.isArray(profile.headerRows) &&
    profile.headerRows.every(
      (row) => Array.isArray(row) && row.every((id) => typeof id === 'string')
    ) &&
    Array.isArray(sections) &&
    sections.every(
      (section) =>
        hasStrings(section, ['id', 'title']) &&
        (section.type === 'freeform'
          ? typeof section.body === 'string'
          : section.type === 'timeline' &&
            Array.isArray(section.items) &&
            section.items.every((item) =>
              hasStrings(item, ['id', 'title', 'subtitle', 'start', 'end', 'description'])
            ))
    )
  );
}

function hasStrings(value: unknown, keys: string[]): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    keys.every((key) => typeof (value as Record<string, unknown>)[key] === 'string')
  );
}
