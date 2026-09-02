/*
  PostToolUse hook — runs the Astro build after an edit to a source file.

  Wired up in .claude/settings.json. Reads the hook payload on stdin and
  decides whether this edit can affect the built site; a change to backlog.md
  or a plan document cannot, and rebuilding for it wastes several seconds on
  every edit.

  Why a script and not the usual jq one-liner: jq is not installed on this
  machine, so the documented `jq -r '.tool_input.file_path' | ...` pattern
  fails silently — the hook runs, finds no jq, and exits without ever
  building. Node is already required to build this project.

  Exit codes: 0 = fine (built, or nothing to build), 2 = build broken, which
  Claude Code feeds back so it must be fixed before the work continues.
*/
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Only these can change what the build emits.
const BUILD_AFFECTING = /(\/|\\)(src|public)(\/|\\)|astro\.config|package\.json|tailwind/i;

function readStdin() {
  return new Promise((res) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (raw += chunk));
    process.stdin.on('end', () => res(raw));
  });
}

const raw = await readStdin();

let filePath = '';
try {
  const payload = JSON.parse(raw || '{}');
  filePath = payload?.tool_input?.file_path ?? payload?.tool_response?.filePath ?? '';
} catch {
  // A payload we cannot parse is not a reason to block the edit.
  process.exit(0);
}

if (!filePath || !BUILD_AFFECTING.test(filePath)) process.exit(0);

try {
  execFileSync('npm', ['run', 'build'], {
    cwd: projectRoot,
    stdio: 'pipe',
    shell: true,
  });
  process.exit(0);
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  // stderr on exit 2 is what Claude Code shows back to the model.
  process.stderr.write(
    `Build failed after editing ${filePath}\n\n${output.slice(-2000)}\n`
  );
  process.exit(2);
}
