const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// --- Mock data ---
const games = ["game_one", "game_two", "game_three"]; // mock folders

const assetsByGame = {
  game_one: [
    { name: "logo.png", path: "media/game_one/logo.png" },
    { name: "banner.jpg", path: "media/game_one/banner.jpg" },
    { name: "icon.webp", path: "media/game_one/icon.webp" },
    { name: "vector.svg", path: "media/game_one/vector.svg" }
  ],
  game_two: [
    { name: "splash.png", path: "media/game_two/splash.png" },
    { name: "background.jpg", path: "media/game_two/background.jpg" }
  ],
  game_three: [
    { name: "hero.webp", path: "media/game_three/hero.webp" },
    { name: "ui/icon.png", path: "media/game_three/ui/icon.png" }
  ],
};

const jsonByGame = {
  game_one: [
    { name: "config.json", path: "media/game_one/config.json" },
    { name: "levels.json", path: "media/game_one/levels.json" },
    { name: "ui.json", path: "media/game_one/ui.json" }
  ],
  game_two: [
    { name: "config.json", path: "media/game_two/config.json" }
  ],
  game_three: [
    { name: "settings.json", path: "media/game_three/settings.json" },
    { name: "layout.json", path: "media/game_three/layout.json" }
  ],
};

const configFilesByGame = {
  game_one: [
    { name: "theme.yaml", path: "media/game_one/theme.yaml" },
    { name: "components/Button.tsx", path: "media/game_one/components/Button.tsx" }
  ],
  game_two: [
    { name: "ui.yml", path: "media/game_two/ui.yml" },
    { name: "components/Header.tsx", path: "media/game_two/components/Header.tsx" }
  ],
  game_three: [
    { name: "gameplay.yaml", path: "media/game_three/gameplay.yaml" }
  ],
};

// --- API ---
app.get("/api/games", (_req, res) => {
  res.json(games);
});

app.get("/api/games/:game/assets", (req, res) => {
  const { game } = req.params;
  res.json(assetsByGame[game] ?? []);
});

app.get("/api/games/:game/json", (req, res) => {
  const { game } = req.params;
  res.json(jsonByGame[game] ?? []);
});

app.get("/api/games/:game/config", (req, res) => {
  const { game } = req.params;
  res.json(configFilesByGame[game] ?? []);
});

// Serve static files from media folder
app.use('/media', express.static('media'));


app.post("/api/generate", (req, res) => {
  // In later stage: validate payload + generate actual mod
  const config = req.body;

  res.json({
    status: "success",
    message: "Mod generated (mock)",
    received: config,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`);
});
