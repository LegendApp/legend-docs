import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import ts from "../docs/node_modules/typescript/lib/typescript.js";

const repo = path.resolve(".");
const docsDir = path.join(repo, "docs");

function collectMdxFiles() {
  try {
    return execSync("rg --files -g '*.mdx'", { cwd: docsDir, encoding: "utf8" })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((relative) => path.join("docs", relative));
  } catch {
    return execSync("find . -type f -name '*.mdx'", { cwd: docsDir, encoding: "utf8" })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((relative) => path.join("docs", relative.replace(/^\.\//, "")));
  }
}

const files = collectMdxFiles();

const knownGlobals = new Set([
  "console","window","document","localStorage","sessionStorage","navigator","fetch","setTimeout","clearTimeout","setInterval","clearInterval","Promise","Array","Map","Set","WeakMap","WeakSet","Symbol","Math","Date","JSON","Error","Number","String","Boolean","Object","Intl","BigInt","URL","URLSearchParams","Request","Response","Headers","AbortController","performance","process","require","module","exports","global","globalThis","__dirname","__filename","queueMicrotask","structuredClone","Reflect","Proxy","WeakRef","Atomics","DataView","Uint8Array","Uint16Array","Uint32Array","Int8Array","Int16Array","Int32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","PromiseLike","Event","CustomEvent","TextEncoder","TextDecoder","crypto","setImmediate","clearImmediate","describe","it","expect","beforeEach","afterEach","test","React","Fragment","Error","TypeError","SyntaxError","RegExp","MapLike","SetLike","ReadonlyArray","ReadonlyMap","ReadonlySet","Record","Partial","Required","Pick","Omit","Exclude","Extract","NonNullable","Parameters","ConstructorParameters","ReturnType","InstanceType","ThisType","TemplateStringsArray","undefined","null","string","number","boolean","any","never","unknown","void","bigint","symbol"
]);

const issues = [];

function languageToScriptKind(lang) {
  switch (lang) {
    case "ts":
      return ts.ScriptKind.TS;
    case "tsx":
      return ts.ScriptKind.TSX;
    case "js":
      return ts.ScriptKind.JS;
    case "jsx":
      return ts.ScriptKind.JSX;
    default:
      return ts.ScriptKind.TSX;
  }
}

function isPropertyName(node) {
  const parent = node.parent;
  if (!parent) return false;
  switch (parent.kind) {
    case ts.SyntaxKind.PropertyAssignment:
    case ts.SyntaxKind.PropertySignature:
    case ts.SyntaxKind.PropertyDeclaration:
    case ts.SyntaxKind.MethodDeclaration:
    case ts.SyntaxKind.GetAccessor:
    case ts.SyntaxKind.SetAccessor:
    case ts.SyntaxKind.EnumMember:
    case ts.SyntaxKind.MethodSignature:
      return parent.name === node;
    case ts.SyntaxKind.PropertyAccessExpression:
      return parent.name === node;
    case ts.SyntaxKind.BindingElement:
      return parent.propertyName === node;
    case ts.SyntaxKind.JsxAttribute:
      return true;
    default:
      return false;
  }
}

function isCriticalUsage(node) {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isCallExpression(parent) && parent.expression === node) return true;
  if (ts.isNewExpression(parent) && parent.expression === node) return true;
  if (ts.isAwaitExpression(parent) && parent.expression === node) return true;
  if (ts.isTaggedTemplateExpression(parent) && parent.tag === node) return true;
  if (ts.isPropertyAccessExpression(parent) && parent.expression === node) return true;
  if (ts.isElementAccessExpression(parent) && parent.expression === node) return true;
  return false;
}

for (const file of files) {
  const fullPath = path.join(repo, file);
  const content = fs.readFileSync(fullPath, "utf8");
  const regex = /```([a-zA-Z0-9_-]+)([^\n]*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let lang = match[1].trim().toLowerCase();
    if (lang.includes(" ")) {
      lang = lang.split(/\s+/)[0];
    }
    if (!["ts", "tsx", "js", "jsx"].includes(lang)) continue;

    const snippet = match[3];
    if (!snippet.includes("import")) continue;

    const priorText = content.slice(0, match.index);
    const lineStart = priorText.split(/\n/).length;

    const scriptKind = languageToScriptKind(lang);
    const sourceFile = ts.createSourceFile(`snippet.${lang}`, snippet, ts.ScriptTarget.Latest, true, scriptKind);

    const importedEntries = [];
    const usedMap = new Map();
    const declared = new Set();
    const criticalUsage = new Map();

    function recordUsage(identifier) {
      const name = identifier.text;
      if (!usedMap.has(name)) usedMap.set(name, identifier);
    }

    function recordCritical(identifier) {
      const name = identifier.text;
      if (!criticalUsage.has(name)) criticalUsage.set(name, identifier);
    }

    function recordDeclaration(name) {
      declared.add(name);
    }

    function recordImport(name, node, moduleName) {
      importedEntries.push({ name, node, moduleName });
      recordDeclaration(name);
    }

    function visit(node) {
      if (ts.isImportDeclaration(node)) {
        const clause = node.importClause;
        const moduleName = ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : node.moduleSpecifier.getText(sourceFile);
        if (clause) {
          if (clause.name) {
            recordImport(clause.name.text, clause.name, moduleName);
          }
          if (clause.namedBindings) {
            if (ts.isNamespaceImport(clause.namedBindings)) {
              recordImport(clause.namedBindings.name.text, clause.namedBindings.name, moduleName);
            } else if (ts.isNamedImports(clause.namedBindings)) {
              for (const element of clause.namedBindings.elements) {
                const local = element.name.text;
                recordImport(local, element.name, moduleName);
              }
            }
          }
        }
        return;
      }

      if (ts.isTypeParameterDeclaration(node)) {
        recordDeclaration(node.name.text);
      }

      if (ts.isIdentifier(node)) {
        if (ts.isDeclarationName(node)) {
          recordDeclaration(node.text);
          return;
        }
        if (isPropertyName(node)) {
          return;
        }
        const parent = node.parent;
        if (parent) {
          if (ts.isImportClause(parent) || ts.isImportSpecifier(parent) || ts.isNamespaceImport(parent) || ts.isExportSpecifier(parent) || ts.isImportEqualsDeclaration(parent)) {
            return;
          }
          if (ts.isBindingElement(parent) && parent.propertyName === node) {
            return;
          }
        }
        recordUsage(node);
        if (isCriticalUsage(node)) {
          recordCritical(node);
        }
        return;
      }

      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName;
        if (ts.isIdentifier(tag)) {
          recordUsage(tag);
          if (!/^[a-z]/.test(tag.text)) {
            recordCritical(tag);
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    for (const entry of importedEntries) {
      if (!usedMap.has(entry.name)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(entry.node.getStart(sourceFile));
        issues.push({
          type: "unused-import",
          file,
          line: lineStart + line,
          name: entry.name,
          moduleName: entry.moduleName,
        });
      }
    }

    for (const [name, node] of criticalUsage.entries()) {
      if (declared.has(name)) continue;
      if (knownGlobals.has(name)) continue;
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      issues.push({
        type: "missing-import",
        file,
        line: lineStart + line,
        name,
      });
    }
  }
}

const output = JSON.stringify(issues, null, 2);
fs.writeFileSync("/tmp/mdx-import-issues.json", output);
console.log(`Tracked ${issues.length} issues -> /tmp/mdx-import-issues.json`);
