// PreToolUse hook for read-only reviewer agents.
// Settings permissions apply to the whole session, so the per-agent Bash
// limit has to live in a hook. Exit code 2 blocks the call.

const ALLOWED = [/^git diff\b/, /^gh pr diff\b/, /^gh issue view\b/];
const CHAINING = /[;&|><`]|\$\(/;

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let command = '';
  try {
    command = (JSON.parse(raw).tool_input?.command ?? '').trim();
  } catch {
    block('could not read the command');
  }

  if (CHAINING.test(command)) {
    block('chaining, pipes, and redirects are not allowed');
  }
  if (!ALLOWED.some((pattern) => pattern.test(command))) {
    block('only `git diff`, `gh pr diff`, and `gh issue view` are allowed');
  }
  process.exit(0);
});

function block(reason) {
  process.stderr.write(`Blocked for reviewer agents: ${reason}.\n`);
  process.exit(2);
}
