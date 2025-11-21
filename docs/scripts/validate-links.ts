#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface Link {
    text: string;
    url: string;
    fullMatch: string;
    line: number;
    filePath: string;
}

interface ValidationError {
    type: 'file-not-found' | 'broken-link';
    message: string;
    file: string;
    line?: number;
    link?: string;
    resolvedPath?: string;
}

interface FileCheckResult {
    exists: boolean;
    resolvedPath: string;
    type: 'file' | 'directory' | 'unknown';
}

class LinkValidator {
    private readonly rootDir: string;
    private readonly publicDir: string;
    private readonly basePath: string;
    private readonly verbose: boolean;
    private errors: ValidationError[] = [];

    constructor(options: { verbose?: boolean } = {}) {
        this.verbose = options.verbose ?? false;
        const cwd = process.cwd();
        const docsSuffix = `${path.sep}docs`;
        this.rootDir = cwd.endsWith(docsSuffix) ? path.dirname(cwd) : cwd;
        this.publicDir = path.join(this.rootDir, 'docs/public');
        this.basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/open-source').replace(/\/+$/, '') || '/';
    }

    /**
     * Find all MDX files in the project
     */
    findMdxFiles(): string[] {
        const patterns = ['docs/content/**/*.mdx'];

        const files: string[] = [];
        patterns.forEach((pattern) => {
            const matches = glob.sync(pattern, { cwd: this.rootDir });
            files.push(...matches.map((file: string) => path.resolve(this.rootDir, file)));
        });

        return files;
    }

    /**
     * Extract relative links from MDX content
     */
    extractRelativeLinks(content: string, filePath: string): Link[] {
        const links: Link[] = [];

        // Match markdown links [text](url)
        const markdownLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
        let match: RegExpExecArray | null;

        while ((match = markdownLinkRegex.exec(content)) !== null) {
            const [fullMatch, text, url] = match;

            // Skip absolute URLs, anchors, and mailto links
            if (
                url.startsWith('http://') ||
                url.startsWith('https://') ||
                url.startsWith('#') ||
                url.startsWith('mailto:')
            ) {
                continue;
            }

            links.push({
                text,
                url,
                fullMatch,
                line: this.getLineNumber(content, match.index),
                filePath,
            });
        }

        return links;
    }

    /**
     * Get line number for a given character index
     */
    private getLineNumber(content: string, index: number): number {
        return content.substring(0, index).split('\n').length;
    }

    /**
     * Resolve a relative link to an absolute file path
     */
    private resolveLinkPath(linkUrl: string, fromFile: string): string {
        // URLs starting with "/" should be treated as site-root paths, not filesystem-absolute
        if (linkUrl.startsWith('/')) {
            const withoutFragment = linkUrl.split('#')[0];
            return withoutFragment;
        }

        const parsedPath = path.parse(fromFile);
        const isIndexFile = parsedPath.name === 'index';

        // Non-index files become directories in the generated site, so links resolve from that virtual directory.
        const routeBaseDir = isIndexFile ? parsedPath.dir : path.join(parsedPath.dir, parsedPath.name);

        let targetPath = path.resolve(routeBaseDir, linkUrl);

        // Handle anchor links (remove fragment)
        if (targetPath.includes('#')) {
            targetPath = targetPath.split('#')[0];
        }

        return targetPath;
    }

    /**
     * Check if a file or directory exists, trying multiple extensions
     */
    private checkFileExists(targetPath: string): FileCheckResult {
        const extensions = ['', '.mdx', '.md'];
        const candidates: string[] = [];

        const addCandidates = (basePath: string) => {
            extensions.forEach((ext) => {
                const candidate = basePath + ext;
                if (!candidates.includes(candidate)) {
                    candidates.push(candidate);
                }
            });
        };

        // Original resolved path
        addCandidates(targetPath);

        // If the path is under the Next.js basePath, check the public directory
        addCandidates(targetPath.replace('/content/', '/public/'));

        for (const fullPath of candidates) {
            // Check if it's a file
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
                return { exists: true, resolvedPath: fullPath, type: 'file' };
            }

            // Check if it's a directory with an index file
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                const indexFiles = ['index.mdx', 'index.md'];
                for (const indexFile of indexFiles) {
                    const indexPath = path.join(fullPath, indexFile);
                    if (fs.existsSync(indexPath)) {
                        return { exists: true, resolvedPath: indexPath, type: 'directory' };
                    }
                }
            }
        }

        return { exists: false, resolvedPath: targetPath, type: 'unknown' };
    }

    /**
     * Validate a single MDX file
     */
    validateFile(filePath: string): void {
        if (!fs.existsSync(filePath)) {
            this.errors.push({
                type: 'file-not-found',
                message: `File not found: ${filePath}`,
                file: filePath,
            });
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const links = this.extractRelativeLinks(content, filePath);

        if (this.verbose) {
            console.log(`Checking ${links.length} links in ${path.relative(process.cwd(), filePath)}`);
        }

        links.forEach((link) => {
            if (link.url.includes('.html')) {
                return;
            }

            const targetPath = this.resolveLinkPath(link.url, filePath);
            const result = this.checkFileExists(targetPath);

            if (!result.exists) {
                this.errors.push({
                    type: 'broken-link',
                    message: `Broken link: "${link.text}" -> "${link.url}"`,
                    file: filePath,
                    line: link.line,
                    link: link.url,
                    resolvedPath: result.resolvedPath,
                });
            } else if (this.verbose) {
                console.log(`  ✓ ${link.url} -> ${path.relative(process.cwd(), result.resolvedPath)}`);
            }
        });
    }

    /**
     * Validate all MDX files
     */
    validateAll(): boolean {
        const files = this.findMdxFiles();
        if (this.verbose) {
            console.log(`Found ${files.length} MDX files to validate\n`);
        }

        files.forEach((file) => {
            this.validateFile(file);
        });

        this.printResults();
        return this.errors.length === 0;
    }

    /**
     * Print validation results
     */
    private printResults(): void {
        if (this.errors.length === 0) {
            console.log('✅ All links are valid!');
            return;
        }

        console.log('\n' + '='.repeat(60));
        console.log('LINK VALIDATION RESULTS');
        console.log('='.repeat(60));

        console.log(`❌ Found ${this.errors.length} broken links:\n`);

        this.errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error.message}`);
            console.log(`   File: ${path.relative(process.cwd(), error.file)}`);
            if (error.line) {
                console.log(`   Line: ${error.line}`);
            }
            if (error.resolvedPath) {
                console.log(`   Target: ${path.relative(process.cwd(), error.resolvedPath)}`);
            }
            console.log('');
        });

        console.log(`Please fix these ${this.errors.length} broken links before building.`);
    }
}

// Run the validator if this script is executed directly
if (require.main === module) {
    const verbose = process.argv.includes('--verbose');
    const validator = new LinkValidator({ verbose });
    const isValid = validator.validateAll();
    process.exit(isValid ? 0 : 1);
}

export default LinkValidator;
