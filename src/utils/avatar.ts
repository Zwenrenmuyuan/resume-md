const AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_AVATAR_WIDTH = 300;
const MAX_AVATAR_HEIGHT = 400;
const AVATAR_JPEG_QUALITY = 0.85;
const MARKDOWN_AVATAR_RE = /^!\[头像\]\(([^)\r\n]+)\)[ \t]*(?:\r?\n|$)/;

export async function processAvatarFile(file: File): Promise<string> {
  if (!AVATAR_TYPES.has(file.type)) {
    throw new Error('请选择 JPG、PNG 或 WebP 图片。');
  }

  const image = await loadImage(file);
  const { width, height } = fitWithinBounds(
    image.naturalWidth,
    image.naturalHeight,
    MAX_AVATAR_WIDTH,
    MAX_AVATAR_HEIGHT
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('浏览器无法处理这张图片。');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', AVATAR_JPEG_QUALITY);
}

export function getMarkdownAvatar(markdown: string): string {
  return markdown.match(MARKDOWN_AVATAR_RE)?.[1] ?? '';
}

export function getMarkdownAvatarRange(markdown: string): {
  avatarSrc: string;
  from: number;
  to: number;
  lineEnd: number;
} | null {
  const match = markdown.match(MARKDOWN_AVATAR_RE);
  if (!match) return null;

  const newlineIndex = match[0].search(/\r?\n/);

  return {
    avatarSrc: match[1],
    from: 0,
    to: newlineIndex >= 0 ? newlineIndex : match[0].length,
    lineEnd: match[0].length,
  };
}

export function splitMarkdownAvatar(markdown: string): {
  avatarSrc: string;
  body: string;
} {
  const match = markdown.match(MARKDOWN_AVATAR_RE);
  if (!match) return { avatarSrc: '', body: markdown };

  const afterAvatar = markdown.slice(match[0].length).replace(/^\r?\n/, '');
  return {
    avatarSrc: match[1],
    body: afterAvatar,
  };
}

export function setMarkdownAvatar(markdown: string, avatarSrc: string): string {
  const { body } = splitMarkdownAvatar(markdown);
  return `![头像](${avatarSrc})\n\n${body}`;
}

export function removeMarkdownAvatar(markdown: string): string {
  return splitMarkdownAvatar(markdown).body;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('无法读取图片，请换一张重试。'));
        return;
      }
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法读取图片，请换一张重试。'));
    };
    image.src = url;
  });
}

function fitWithinBounds(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
