import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repository = 'https://github.com/LegendApp/legend-docs.git';
const cwd = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
if (args.some((arg) => arg !== '--dry-run') || args.length > 1) {
    console.error('Usage: bun run deploy:production [--dry-run]');
    process.exit(1);
}
const run = (command, args) => execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const git = (...args) => run('git', args);

try {
    // Convenience check only. GitHub's rules enforce authorization for every push.
    if (run('gh', ['api', 'user', '--jq', '.login']) !== 'jmeistrich') {
        throw new Error('Authenticate gh as jmeistrich before deploying.');
    }
    git('fetch', '--no-tags', repository, 'refs/heads/main');
    const commit = git('rev-parse', 'FETCH_HEAD');
    const production = git('ls-remote', '--heads', repository, 'refs/heads/production');
    if (production) {
        git('fetch', '--no-tags', repository, 'refs/heads/production');
        const previous = git('rev-parse', 'FETCH_HEAD');
        if (previous === commit) {
            console.log(`Production already points to ${commit}.`);
            process.exit(0);
        }
        git('merge-base', '--is-ancestor', previous, commit);
    }
    console.log(`Deploy remote main ${commit} to LegendApp/legend-docs production.`);
    if (args.includes('--dry-run')) {
        console.log('Dry run: no branch was created or updated.');
    } else {
        // A normal push also rejects a concurrent update that would lose history.
        git('push', repository, `${commit}:refs/heads/production`);
        console.log('Production updated. Cloudflare Pages will build this commit.');
    }
} catch (error) {
    console.error(`Deployment stopped: ${error.message}`);
    process.exit(1);
}
