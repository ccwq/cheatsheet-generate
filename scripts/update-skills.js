const { spawnSync } = require("node:child_process");
const path = require("node:path");

const sources = [
  "./cheatsheet-html-maker/cheatsheet-maker-skill",
  "./cheatsheet-html-maker/icon-complete-skill",
  "./cheatsheet-html-maker/tag-ci-skills",
  "./cheatsheet-html-maker/cheatsheet-review-skill",
];

const agents = [
  "claude-code",
  "codex",
  // "gemini-cli",
  // "iflow-cli",
  // "trae",
  // "qwen-code",
  // "windsurf",
];

const extraArgs = process.argv.slice(2);

// 项目级安装默认不传 -g；统一显式指定 Agent，并跳过交互确认。
const baseArgs = [
  "-y",
  "skills",
  "add",
  ...agents.flatMap((agent) => ["-a", agent]),
  "-y",
  ...extraArgs,
];

function runInstall(source) {
  const args = [...baseArgs, source];
  const isWindows = process.platform === "win32";
  const command = isWindows ? process.env.ComSpec || "cmd.exe" : "npx";
  const spawnArgs = isWindows
    ? ["/d", "/s", "/c", ["npx", ...args].map(quoteWindowsArg).join(" ")]
    : args;

  console.log(`\n[update-skills] installing: ${path.normalize(source)}`);
  console.log(
    `[update-skills] command: ${isWindows ? "npx" : command} ${args.join(" ")}`,
  );

  const result = spawnSync(command, spawnArgs, {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    throw result.error;
  }
}

function quoteWindowsArg(value) {
  if (!/[\s"]/u.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
}

for (const source of sources) {
  runInstall(source);
}
