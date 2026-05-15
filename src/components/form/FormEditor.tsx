import type {
  FreeformSection,
  Profile,
  ResumeSchema,
  Section,
  TimelineSection,
} from '../../types/schema';
import { newId } from '../../utils/id';
import { FreeformSectionCard } from './FreeformSectionCard';
import { ProfileForm } from './ProfileForm';
import { SectionAdder } from './SectionAdder';
import { TimelineSectionCard } from './TimelineSectionCard';

interface FormEditorProps {
  schema: ResumeSchema;
  onChange: (next: ResumeSchema) => void;
}

export function FormEditor({ schema, onChange }: FormEditorProps) {
  function setProfile(profile: Profile) {
    onChange({ ...schema, profile });
  }

  function setSections(sections: Section[]) {
    onChange({ ...schema, sections });
  }

  function updateSection(id: string, next: Section) {
    setSections(schema.sections.map((s) => (s.id === id ? next : s)));
  }

  function moveSection(id: string, dir: -1 | 1) {
    const i = schema.sections.findIndex((s) => s.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= schema.sections.length) return;
    const next = [...schema.sections];
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next);
  }

  function removeSection(id: string) {
    setSections(schema.sections.filter((s) => s.id !== id));
  }

  function addSection(type: 'timeline' | 'freeform') {
    if (type === 'timeline') {
      const next: TimelineSection = {
        id: newId('s_'),
        type: 'timeline',
        title: '',
        items: [],
      };
      setSections([...schema.sections, next]);
    } else {
      const next: FreeformSection = {
        id: newId('s_'),
        type: 'freeform',
        title: '',
        body: '',
      };
      setSections([...schema.sections, next]);
    }
  }

  return (
    <div className="form-editor">
      <ProfileForm profile={schema.profile} onChange={setProfile} />
      {schema.sections.map((section, i) =>
        section.type === 'timeline' ? (
          <TimelineSectionCard
            key={section.id}
            section={section}
            index={i}
            total={schema.sections.length}
            onChange={(next) => updateSection(section.id, next)}
            onMoveUp={() => moveSection(section.id, -1)}
            onMoveDown={() => moveSection(section.id, 1)}
            onRemove={() => removeSection(section.id)}
          />
        ) : (
          <FreeformSectionCard
            key={section.id}
            section={section}
            index={i}
            total={schema.sections.length}
            onChange={(next) => updateSection(section.id, next)}
            onMoveUp={() => moveSection(section.id, -1)}
            onMoveDown={() => moveSection(section.id, 1)}
            onRemove={() => removeSection(section.id)}
          />
        )
      )}
      <SectionAdder onAdd={addSection} />
    </div>
  );
}
