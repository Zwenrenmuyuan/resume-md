import { StateEffect, StateField, type Extension } from '@codemirror/state';
import {
  Decoration,
  EditorView,
  WidgetType,
  type DecorationSet,
} from '@codemirror/view';
import { getMarkdownAvatarRange } from '../utils/avatar';

const setAvatarExpanded = StateEffect.define<boolean>();

const avatarExpandedField = StateField.define<boolean>({
  create: () => false,
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setAvatarExpanded)) return effect.value;
    }
    return value;
  },
});

const avatarDecorations = StateField.define<DecorationSet>({
  create(state) {
    return buildAvatarDecorations(state.doc.toString(), state.field(avatarExpandedField));
  },
  update(value, tr) {
    if (!tr.docChanged && !tr.effects.some((effect) => effect.is(setAvatarExpanded))) {
      return value;
    }

    return buildAvatarDecorations(
      tr.state.doc.toString(),
      tr.state.field(avatarExpandedField)
    );
  },
  provide: (field) => EditorView.decorations.from(field),
});

export function markdownAvatarWidget(): Extension {
  return [avatarExpandedField, avatarDecorations];
}

function buildAvatarDecorations(markdown: string, expanded: boolean): DecorationSet {
  const avatar = getMarkdownAvatarRange(markdown);
  if (!avatar) return Decoration.none;

  if (expanded) {
    return Decoration.set([
      Decoration.widget({
        widget: new CollapseAvatarWidget(),
        side: 1,
      }).range(avatar.lineEnd),
    ]);
  }

  return Decoration.set([
    Decoration.replace({
      widget: new AvatarWidget(avatar.avatarSrc),
    }).range(avatar.from, avatar.to),
  ]);
}

class AvatarWidget extends WidgetType {
  constructor(private readonly avatarSrc: string) {
    super();
  }

  eq(other: AvatarWidget) {
    return other.avatarSrc === this.avatarSrc;
  }

  toDOM(view: EditorView) {
    const container = document.createElement('div');
    container.className = 'cm-avatar-widget';

    const thumb = document.createElement('img');
    thumb.className = 'cm-avatar-widget-thumb';
    thumb.src = this.avatarSrc;
    thumb.alt = '';

    const body = document.createElement('div');
    body.className = 'cm-avatar-widget-body';

    const title = document.createElement('strong');
    title.textContent = '头像';

    const detail = document.createElement('span');
    detail.textContent = '已上传，Markdown 内容已收起';

    body.append(title, detail);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cm-avatar-widget-button';
    button.textContent = '展开源码';
    button.onclick = () => {
      view.dispatch({ effects: setAvatarExpanded.of(true) });
      view.focus();
    };

    container.append(thumb, body, button);
    return container;
  }

  ignoreEvent() {
    return false;
  }
}

class CollapseAvatarWidget extends WidgetType {
  toDOM(view: EditorView) {
    const container = document.createElement('div');
    container.className = 'cm-avatar-collapse';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cm-avatar-collapse-button';
    button.textContent = '收起头像';
    button.onclick = () => {
      view.dispatch({ effects: setAvatarExpanded.of(false) });
      view.focus();
    };

    container.append(button);
    return container;
  }

  ignoreEvent() {
    return false;
  }
}
