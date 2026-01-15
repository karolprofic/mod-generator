import * as path from "path";
const fse = require("fs-extra");
const colors = require("colors");

/**
 * Assigns game files to the correct swap maps based on their type and folder.
 * @param checkedFiles - List of files selected by the user
 * @param gameFolderName - Name of the base game folder
 * @param modFolderName - Name of the mod game folder
 * @param gamePrefix - Prefix in original file names to be replaced
 * @param modPrefix - New prefix to use for modded files
 * @returns A object containing:
 * - `assetSwaps`: Map of image files for assetSwaps function
 * - `spineSwaps`: Map of JSON files for spineSwaps function
 * - `assetSwapsLoader`: Map of files from `/loader/` folder for assetSwaps function in LoaderMod
 */
export function assignFilesToSwapsMap(
	checkedFiles: string[],
	gameFolderName: string,
	modFolderName: string,
	gamePrefix: string,
	modPrefix: string
) {
	const assetSwaps: Record<string, string> = {};
	const spineSwaps: Record<string, string> = {};
	const assetSwapsLoader: Record<string, string> = {};

	for (const file of checkedFiles) {
		let modFile: string = file.replace(gameFolderName, `${gameFolderName}/mods/${modFolderName}`);
		modFile = modFile.replace(`${gamePrefix}_`, `${modPrefix}_`);
		if (file.includes("/loader/")) {
			assetSwapsLoader[file] = modFile;
		} else if (file.endsWith(".jpg") || file.endsWith(".png")) {
			assetSwaps[file] = modFile;
		} else if (file.endsWith(".json")) {
			spineSwaps[file] = modFile;
		}
	}

	return { assetSwaps, spineSwaps, assetSwapsLoader };
}

/**
 * Copies files from source to destination based on the provided mapping.
 * @param swaps - An object where each key is a source file path and each value is the destination path
 */
export async function copySwappedFiles(swaps: Record<string, string>) {
	for (const [src, dest] of Object.entries(swaps)) {
		try {
			const targetDir: string = path.dirname(dest);
			await fse.ensureDir(targetDir);
			await fse.copy(src, dest);
		} catch (err: any) {
			console.error(colors.red(`Unable to copy ${src}: ${err.message}`));
		}
	}
}

/**
 * Gets the file prefix from a YAML file matching the mod environment and folder path.
 * @param gameFolderPath - Path to the game folder
 * @param modEnv - Mod environment name
 * @returns Game prefix or empty string if not found
 */
export async function findBaseGamePrefix(gameFolderPath: string, modEnv: string) {
	try {
		const entries = await fse.readdir(gameFolderPath, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isFile() && entry.name.endsWith(`${modEnv}.yaml`)) {
				const prefixEndIndex = entry.name.indexOf("_");
				if (prefixEndIndex !== -1) {
					return entry.name.substring(0, prefixEndIndex);
				} else {
					return "";
				}
			}
		}
	} catch (error) {
		console.error(colors.red("Error while reading the directory:", error));
	}
	return "";
}

/**
 * Capitalizes each word and replaces spaces with underscores.
 * @param input - Input string
 * @returns String with the first letter in uppercase
 */
export function capitalizeWordsWithUnderscore(input: string) {
	return input
		.trim()
		.replace(/\s+/g, "_")
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join("_");
}

/**
 * Formats a record object as a string of key-value pairs, each on a new line and indented.
 * @param obj - Object with string keys and values
 * @param tabCount - Number of tab characters to indent each line (default: 3)
 * @returns Formatted string for use in code templates
 */
function formatSwapEntry(obj: Record<string, string>, tabCount: number = 3) {
	const indent = "\t".repeat(tabCount);
	return Object.entries(obj)
		.map(([key, value]) => `${indent}// "${key}": "${value}",`)
		.join("\n");
}

/**
 * Generates and saves a mod file with given data.
 * @param modId - Mod id
 * @param modEnv - Targeted environment
 * @param modFilePath - Path where the mod file should be saved
 * @param gameFilePath - Path to the original game file that will be modded
 * @param modGameName - Mod game name
 * @param modGameId - Mod game id
 * @param spineDatabasePath - Path to the spine database
 * @param assetSwaps - Mapping of image files for the game mod
 * @param spineSwaps - Mapping of spine files for the game mod
 * @param assetSwapsLoader - Mapping of image files for the loader mod
 */
export async function generateClass(
	modId: string,
	modEnv: string,
	modFilePath: string,
	gameFilePath: string,
	modGameName: string,
	modGameId: string,
	spineDatabasePath: string,
	assetSwaps: Record<string, string>,
	spineSwaps: Record<string, string>,
	assetSwapsLoader: Record<string, string>,
) {
	const includeLoaderMod: boolean = (modEnv === "web" || modEnv === "mobile") ? true : false;
	const classTemplate: string = `
import type { GameConfig } from "@app/gameModules/common/GameConfig";
import type { GameMod, LoaderGameMod, PropMods } from "../../../../../build/mods/GameMod";

export const mod = {
	id: "${modId}",
	propModifications: [
		{
			filePath: "${gameFilePath}",
			props: {
				// "name": "${modGameName}",
				// "gameID": "${modGameId}"
			}
		} satisfies PropMods<GameConfig>
	],
	importSwaps: {

	},
	assetSwaps: {
${formatSwapEntry(assetSwaps, 2)}
	},
	spineSwaps: {
		spineDatabasePath: "${spineDatabasePath}",
		files: {
${formatSwapEntry(spineSwaps, 3)}
		}
	}
} as const satisfies GameMod;
${includeLoaderMod ? `
export const loaderMod = {
	assetSwaps: {
${formatSwapEntry(assetSwapsLoader, 2)}
	}
} as const satisfies LoaderGameMod;
` : ""}
`;

	try {
		await fse.ensureDir(path.dirname(modFilePath));
		await fse.writeFile(modFilePath, classTemplate.trim(), "utf-8");
		console.log(colors.green(`Mod file saved to ${modFilePath}`));
	} catch (err: any) {
		console.error(colors.red(`Failed to save mod file: ${err.message}`));
	}

}

/**
 * Appends a mod entry to the game's environment YAML file.
 * @param gameFolder - Name of the base game folder
 * @param gamePrefix - Prefix of base game files
 * @param modEnv - Targeted environment
 * @param modFileName - Mod file name
 * @param modFolderName - Mod game folder
 */
export async function addModToGameList(
	gameFolder: string,
	gamePrefix: string,
	modEnv: string,
	modFileName: string,
	modFolderName: string
) {
	const gameEnvFile: string = (modEnv === "web" || modEnv === "mobile") ? "web" : modEnv;
	const gameEnvPath: string = path.join(__dirname, "..", "..", "..", "media", "game_lists", `${gameEnvFile}_environment.yaml`);

	const texturePackerConfig: Record<string, string> = {
		web: "media/tp_configs/scale1.json",
		mobile: "media/tp_configs/mobile.json",
		es_premium: "media/tp_configs/scale05_machine.json",
		empire: "media/tp_configs/scale05_machine.json",
		prince: "media/tp_configs/scale05_machine.json",
		vip: "media/tp_configs/scale1_machine.json",
		es3: "media/tp_configs/scale05_machine.json",
	};

	let importsThemplate: string = `\n${capitalizeWordsWithUnderscore(modFolderName)}_${modEnv}:\n`;

	importsThemplate += `  file: "media/games/${gameFolder}/${gamePrefix}_${modEnv}.yaml"\n`;

	if (modEnv !== "web") { // skip texture packer for web
		importsThemplate += `  texturePackerConfig: "${texturePackerConfig[modEnv]}"\n`;
	}

	if (modEnv === "web" || modEnv === "mobile") {
		importsThemplate += `  customLoader: "media/games/${gameFolder}/loader/loader_${modEnv}.yaml"\n`;
	}

	importsThemplate += `  mod: "media/games/${gameFolder}/mods/${modFolderName}/${modFileName}.ts"`;

	try {
		await fse.ensureFile(gameEnvPath);
		await fse.appendFile(gameEnvPath, importsThemplate, "utf8");
		console.log(colors.green(`Mod added succesfully to ${gameEnvFile} enviroment game list`));

	} catch (err: any) {
		console.error(colors.red(`Failed to add mod to file: ${err.message}`));
	}

}