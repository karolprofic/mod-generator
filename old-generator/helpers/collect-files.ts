import * as path from "path";
const fse = require("fs-extra");

/**
 * Recursively collects paths to yaml and tsx files from a given source folder, skipping any directories listed in `foldersToIgnore`.
 * @param src - The root folder to start scanning from.
 * @param foldersToIgnore - Array of folders names to skip during the scan.
 * @returns A array of absolute file paths for matching files.
 */
export async function collectFiles(src: string, foldersToIgnore: string[]): Promise<string[]> {
	const entries = await fse.readdir(src, { withFileTypes: true });

	const filePromises = entries.map(async (entry: any) => {
		const fullPath = path.join(src, entry.name);

		// Skip directories that should be ignored
		if (entry.isDirectory()) {
			if (foldersToIgnore.includes(entry.name)) {
				return [];
			}
			return await collectFiles(fullPath, foldersToIgnore);
		}

		// Include files with supported extensions
		if (entry.isFile() && (entry.name.endsWith(".yaml") || entry.name.endsWith(".tsx"))) {
			return [fullPath];
		}

		return [];
	});

	const nestedFiles = await Promise.all(filePromises);
	return nestedFiles.flat();
}
