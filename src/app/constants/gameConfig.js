import games from "./games.json";

export const gamesList = games;

const gamesBySlug = gamesList.reduce((acc, game) => {
  acc[game.slug] = game;
  return acc;
}, {});

export function getGameConfig(slug) {
  const game = gamesBySlug[slug];
  if (!game) {
    throw new Error(`Game configuration not found for slug: ${slug}`);
  }
  return game;
}

