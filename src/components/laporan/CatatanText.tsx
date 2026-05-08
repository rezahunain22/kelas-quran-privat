// Renderer catatan: mendukung newline, bullet (-, *, •) dan numbering (1. 2)).
// Indentasi otomatis berdasarkan spasi/tab di awal baris.
type Block =
  | { type: "ul"; depth: number; items: string[] }
  | { type: "ol"; depth: number; items: string[] }
  | { type: "p"; depth: number; text: string }
  | { type: "blank" };

const BULLET_RE = /^([-*•])\s+(.*)$/;
const NUMBER_RE = /^(\d+)[.)]\s+(.*)$/;

const parseLine = (raw: string) => {
  const match = raw.match(/^(\s*)(.*)$/);
  const indent = match?.[1] ?? "";
  const rest = match?.[2] ?? raw;
  const depth = Math.floor(indent.replace(/\t/g, "  ").length / 2);
  return { depth, rest };
};

const buildBlocks = (text: string): Block[] => {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      blocks.push({ type: "blank" });
      continue;
    }
    const { depth, rest } = parseLine(line);
    const bullet = rest.match(BULLET_RE);
    const number = rest.match(NUMBER_RE);

    if (bullet) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ul" && last.depth === depth) {
        last.items.push(bullet[2]);
      } else {
        blocks.push({ type: "ul", depth, items: [bullet[2]] });
      }
    } else if (number) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ol" && last.depth === depth) {
        last.items.push(number[2]);
      } else {
        blocks.push({ type: "ol", depth, items: [number[2]] });
      }
    } else {
      blocks.push({ type: "p", depth, text: rest });
    }
  }
  return blocks;
};

const indentStyle = (depth: number) => ({ paddingInlineStart: `${depth * 1.25}rem` });

export const CatatanText = ({ text, className }: { text: string; className?: string }) => {
  if (!text?.trim()) return null;
  const blocks = buildBlocks(text);

  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.type === "blank") return <div key={i} className="h-2" />;
        if (b.type === "p")
          return (
            <p key={i} className="leading-relaxed" style={indentStyle(b.depth)}>
              {b.text}
            </p>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="list-disc list-outside space-y-1 ps-5 marker:text-muted-foreground" style={indentStyle(b.depth)}>
              {b.items.map((it, j) => <li key={j} className="leading-relaxed">{it}</li>)}
            </ul>
          );
        return (
          <ol key={i} className="list-decimal list-outside space-y-1 ps-5 marker:text-muted-foreground" style={indentStyle(b.depth)}>
            {b.items.map((it, j) => <li key={j} className="leading-relaxed">{it}</li>)}
          </ol>
        );
      })}
    </div>
  );
};
