<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Installed command-line tools

`@legendapp/spark/ai` owns execution helpers for installed Claude and Codex CLIs. It uses Spark processes and requires a desktop process host. Installation, login, prompts, provider policy, and data validation remain application/user responsibilities. Importing helpers does not run a prompt.

```ts
import { getAICommandAvailability, runAITool, parseAIJson } from '@legendapp/spark/ai';

const availability = await getAICommandAvailability({ preferredTool: 'codex' });
if (availability.preferredTool) {
  const result = await runAITool({
    tool: availability.preferredTool,
    prompt: 'Return a JSON object containing a greeting.',
    timeoutMs: 30_000,
  });
  if (result.exit.type === 'exited' && result.exit.code === 0) {
    const value = parseAIJson(result.output);
    console.log(value);
  }
}
```

Availability is an advisory installed-command probe, not authenticated access. `runAITool` retains the process result, including raw stdout/stderr bytes, discriminated exit, timeout/abort, and truncation. `output` is trimmed UTF-8 stdout, falling back to stderr if stdout is empty. Nonzero exit and termination are results; operational failures reject.

`signal`, `cwd`, and `timeoutMs` follow the process contract. Codex model/reasoning settings go in `invocationOptions.codex`. The Codex exec recipe uses ephemeral execution and ignores user config/exec-policy rule files while retaining the CLI's sandbox/approval mechanism. Protocol/flags depend on the installed tool version.

`buildAIInvocation` returns the argument recipe without execution. JSON helpers extract raw/fenced/prose-wrapped content and return unknown/null; validate application schemas before using it. `formatAIErrorOutput(output, { maxLength })` bounds error previews. No React mount is required.

## Native Codex app-server

`@legendapp/spark/ai/codex` supplies an optional **macOS** native supervisor, with exec fallback when its app-server protocol is unavailable. `getCodexAvailability()` safely reports unsupported hosts/missing modules and installed-command information. A consuming app needs the matching native capability and rebuilt host.

```ts
import { runCodexPrompt, shutdownCodex } from '@legendapp/spark/ai/codex';

const result = await runCodexPrompt('Return a greeting as JSON.', {
  outputSchema: {
    type: 'object',
    properties: { greeting: { type: 'string' } },
    required: ['greeting'],
    additionalProperties: false,
  },
  reasoningEffort: 'low',
  timeoutMs: 120_000,
});
console.log(result.output);
await shutdownCodex();
```

The final line represents application-owned shutdown. The supervisor is process-wide. `cancelActiveCodexRuns()` cancels all accepted runs, including startup, and returns a count. `shutdownCodex()` cancels active runs and stops the server; later execution restarts it. These are not per-component or per-request cleanup operations. This backend does not promise a per-request AbortSignal.

`timeoutMs` is a whole number from 1,000 to 86,400,000 milliseconds. The isolated Codex home reuses existing authentication; the library does not acquire credentials. Pre-ack notification buffering is bounded at 16 MiB and excessive buffering fails explicitly.

Source/transport/native fixture checks do not establish authenticated inference or full React Native/Nitro acceptance. See [the AI guide](https://github.com/LegendApp/legend-spark/blob/main/docs/ai.md).
