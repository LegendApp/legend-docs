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
    private errors: ValidationError[] = [];

    /**
     * Find all MDX files in the project
     */
    findMdxFiles(): string[] {
        // Get the root directory (parent of current working directory if we're in docs/)
        const rootDir = process.cwd().endsWith('/docs') ? path.dirname(process.cwd()) : process.cwd();

        const patterns = ['docs/content/**/*.mdx'];

        const files: string[] = [];
        patterns.forEach((pattern) => {
            const matches = glob.sync(pattern, { cwd: rootDir });
            files.push(...matches.map((file: string) => path.resolve(rootDir, file)));
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
        const fromDir = path.dirname(fromFile);
        let targetPath = path.resolve(fromDir, linkUrl);

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

        for (const ext of extensions) {
            const fullPath = targetPath + ext;

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

        console.log(`Checking ${links.length} links in ${path.relative(process.cwd(), filePath)}`);

        links.forEach((link) => {
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
            } else {
                console.log(`  ✓ ${link.url} -> ${path.relative(process.cwd(), result.resolvedPath)}`);
            }
        });
    }

    /**
     * Validate all MDX files
     */
    validateAll(): boolean {
        const files = this.findMdxFiles();
        console.log(`Found ${files.length} MDX files to validate\n`);

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
        console.log('\n' + '='.repeat(60));
        console.log('LINK VALIDATION RESULTS');
        console.log('='.repeat(60));

        if (this.errors.length === 0) {
            console.log('✅ All links are valid!');
            return;
        }

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
    const validator = new LinkValidator();
    const isValid = validator.validateAll();
    process.exit(isValid ? 0 : 1);
}

export default LinkValidator;