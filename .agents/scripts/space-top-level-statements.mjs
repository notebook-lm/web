import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import ts from "typescript";

const sourceRoot = join(process.cwd(), "src");

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectSourceFiles(path);
      return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
    }),
  );

  return files.flat();
}

function isImport(statement) {
  return (
    ts.isImportDeclaration(statement) || ts.isImportEqualsDeclaration(statement)
  );
}

async function normalizeTopLevelSpacing(path) {
  const source = await readFile(path, "utf8");
  const kind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const file = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const statements = file.statements;
  const replacements = [];

  for (let index = 1; index < statements.length; index += 1) {
    const previous = statements[index - 1];
    const current = statements[index];
    const start = previous.getEnd();
    const end = current.getStart(file);
    const separator = isImport(previous) && isImport(current) ? "\n" : "\n\n";

    if (source.slice(start, end) !== separator)
      replacements.push({ start, end, separator });
  }

  const formatted = replacements
    .sort((left, right) => right.start - left.start)
    .reduce(
      (result, replacement) =>
        `${result.slice(0, replacement.start)}${replacement.separator}${result.slice(replacement.end)}`,
      source,
    );

  if (formatted !== source) await writeFile(path, formatted);
}

const files = await collectSourceFiles(sourceRoot);
await Promise.all(files.map(normalizeTopLevelSpacing));
