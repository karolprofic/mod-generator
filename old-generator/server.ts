import * as path from "path";
import { collectFiles } from "./helpers/collect-files";
import { addModToGameList, assignFilesToSwapsMap, capitalizeWordsWithUnderscore, copySwappedFiles, findBaseGamePrefix, generateClass } from "./helpers/generete-mod";
const express = require("express");
const fse = require("fs-extra");
const colors = require("colors");

const app = express();
const PORT = 3000;
const GAMES_DIR = path.join(__dirname, "..", "..", "media", "games");
const PUBLIC_DIR = path.join(__dirname, "public");
const FOLDERS_TO_IGNORE = ["localization", "localization_machine"];

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

/**
 * GET /games
 * 
 * Returns a list of available game directories
 */
app.get("/games", async (req: any, res: any) => {
	try {
		const entries = await fse.readdir(GAMES_DIR, { withFileTypes: true });
		const games = entries
			.filter((entry: any) => entry.isDirectory())
			.map((entry: any) => entry.name);
		res.json({ games });
	} catch (error) {
		console.error(colors.red("Error reading games directory:", error));
		res.status(500).json({ error: "Unable to retrieve games list." });
	}
});

/**
 * POST /imports
 * 
 * Scans a given game directory (specified by the `gameName` field in the request body)
 * and returns a list of YAML and TSX files with a list of imported files (.png, .jpg, .json)
 */
app.post("/imports", async (req: any, res: any) => {
	const gameName = req.body.gameName;
	const gameFolderPath = path.join(GAMES_DIR, gameName);

	try {
		if (!(await fse.pathExists(gameFolderPath))) {
			return res.status(404).json({ error: "Game folder not found." });
		}
		const allFiles = await collectFiles(gameFolderPath, FOLDERS_TO_IGNORE);
		const importPattern = /media\/games\/[^\s"']+\.(png|jpg|json)/g;
		const importMap: Record<string, string[]> = {};

		for (const absoluteFilePath of allFiles) {
			const fileContent = await fse.readFile(absoluteFilePath, "utf-8");
			const matches = fileContent.match(importPattern) || [];
			if (matches.length > 0) {
				const relativeFilePath = path.relative(gameFolderPath, absoluteFilePath);
				importMap[relativeFilePath] = Array.from(new Set(matches)); // Remove duplicates
			}
		}

		res.json({ files: importMap });
	} catch (error) {
		console.error(colors.red("Failed to extract imports:", error));
		res.status(500).json({ error: "Failed to process imports." });
	}
});

/**
 * POST /generate
 *
 * Generates a mod file for a selected game based on provided files and options
 * Optionally copies selected files with a new prefix or add game to the game list for the chosen environment
 */
app.post("/generate", async (req: any, res: any) => {
	const {
		gameFolder,
		modGameName,
		modFolder,
		modGameId,
		modPrefix,
		modEnv,
		checkedFiles,
		copyFiles,
		addToEnv
	} = req.body;

	// Create mod id and paths
	const modFileName = modGameName.replace(/ /g, "") + "Mod" + capitalizeWordsWithUnderscore(modEnv);
	const modFilePath = path.join(GAMES_DIR, gameFolder, "mods", modFolder, `${modFileName}.ts`);
	const gameFolderPath = path.join(GAMES_DIR, gameFolder);

	// Find base game file prefix
	const gamePrefix = await findBaseGamePrefix(gameFolderPath, modEnv);
	if (gamePrefix === "") {
		console.error(colors.red("Failed to find base game prefix:"));
		res.status(500).json({ error: "Failed to find base game prefix." });
		return;
	}

	// Prepare paths and mappings
	const gameFilePath = `../../${gamePrefix}_${modEnv}.yaml`;
	const spineDatabasePath = `media/games/${gameFolder}/mods/${modFolder}/common/spine/images/`;
	const { assetSwaps, spineSwaps, assetSwapsLoader } = await assignFilesToSwapsMap(
		checkedFiles,
		gameFolder,
		modFolder,
		gamePrefix,
		modPrefix,
	);

	// Generate and save mod file
	await generateClass(
		modFileName,
		modEnv,
		modFilePath,
		gameFilePath,
		modGameName,
		modGameId,
		spineDatabasePath,
		assetSwaps,
		spineSwaps,
		assetSwapsLoader
	);

	// Optionally copy files
	if (copyFiles) {
		copySwappedFiles(assetSwaps);
		copySwappedFiles(spineSwaps);
		copySwappedFiles(assetSwapsLoader);
	}

	// Optionally add mod to env file
	if (addToEnv) {
		addModToGameList(gameFolder, gamePrefix, modEnv, modFileName, modFolder);
	}

	res.json({ status: "ok", message: `Mod "${modFileName}" generated successfully.` });
});

app.listen(PORT, () => {
	console.log(colors.green(`Server is running at http://localhost:${PORT}`));
});

