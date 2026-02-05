
export interface Game {
    id: string;
    name: string;
    icon: string; // URL or local path
    isPopular: boolean;
    href: string;
}

export interface CategoryData {
    popular: Game[];
    all: Game[];
}

// Helper to generate game data
const createGame = (id: string, name: string, isPopular = false, categorySlug: string): Game => ({
    id,
    name,
    icon: `/games/${id}.png`, // We'll need to handle these images later, maybe use a placeholder service or existing assets
    isPopular,
    href: `/${categorySlug}?game=${id}`,
});

export const GAMES_DATA: Record<string, CategoryData> = {
    "Currency": {
        popular: [
            createGame("osrs-gold", "Old School RuneScape Gold", true, "currency"),
            createGame("fc25-coins", "EA Sports FC 25 Coins", true, "currency"),
            createGame("roblox-robux", "Roblox Robux", true, "currency"),
            createGame("wow-classic-gold", "WoW Classic Era Gold", true, "currency"),
            createGame("donutsmp-money", "DonutSMP Money", true, "currency"),
            createGame("growtopia-locks", "Growtopia Locks", true, "currency"),
            createGame("blade-ball-tokens", "Blade Ball Tokens", true, "currency"),
            createGame("wow-gold", "World of Warcraft Gold", true, "currency"),
            createGame("poe2-currency", "Path of Exile 2 Currency", true, "currency"),
            createGame("rs3-gold", "RuneScape 3 Gold", true, "currency"),
            createGame("grow-garden-tokens", "Grow a Garden Tokens", true, "currency"),
            createGame("arc-raiders-coins", "Arc Raiders Coins", true, "currency"),
        ],
        all: [
            createGame("8-ball-pool", "8 Ball Pool Coins", false, "currency"),
            createGame("aion-2", "Aion 2 Kinah", false, "currency"),
            createGame("albion-online", "Albion Online Silver", false, "currency"),
            createGame("arc-raiders", "Arc Raiders Coins", false, "currency"),
            createGame("ashes-creation", "Ashes of Creation Gold", false, "currency"),
            createGame("bdo", "Black Desert Online Silver", false, "currency"),
            // ... add more as needed
        ]
    },
    "Accounts": {
        popular: [
            createGame("gta-5", "Grand Theft Auto 5", true, "accounts"),
            createGame("fortnite", "Fortnite", true, "accounts"),
            createGame("valorant", "Valorant", true, "accounts"),
            createGame("r6-siege", "Rainbow Six Siege", true, "accounts"),
            createGame("roblox", "Roblox", true, "accounts"),
            createGame("osrs", "Old School RuneScape", true, "accounts"),
            createGame("lol", "League of Legends", true, "accounts"),
            createGame("rocket-league", "Rocket League", true, "accounts"),
            createGame("cod", "Call of Duty", true, "accounts"),
            createGame("cs2", "Counter-Strike 2", true, "accounts"),
            createGame("minecraft", "Minecraft", true, "accounts"),
            createGame("arc-raiders", "Arc Raiders", true, "accounts"),
        ],
        all: [
            createGame("8-ball-pool", "8 Ball Pool", false, "accounts"),
            createGame("99-nights", "99 Nights in the Forest", false, "accounts"),
            createGame("adopt-me", "Adopt Me", false, "accounts"),
            createGame("aion-2", "Aion 2", false, "accounts"),
            createGame("albion", "Albion Online", false, "accounts"),
            createGame("all-star-tower", "All Star Tower Defense", false, "accounts"),
        ]
    },
    "Boosting": {
        popular: [
            createGame("valorant", "Valorant", true, "boosting"),
            createGame("rocket-league", "Rocket League", true, "boosting"),
            createGame("lol", "League of Legends", true, "boosting"),
            createGame("r6-siege", "Rainbow Six Siege", true, "boosting"),
            createGame("arc-raiders", "Arc Raiders", true, "boosting"),
            createGame("fc25", "EA Sports FC 25", true, "boosting"),
            createGame("marvel-rivals", "Marvel Rivals", true, "boosting"),
            createGame("brawl-stars", "Brawl Stars", true, "boosting"),
            createGame("osrs", "Old School RuneScape", true, "boosting"),
            createGame("apex", "Apex Legends", true, "boosting"),
            createGame("clash-royale", "Clash Royale", true, "boosting"),
            createGame("overwatch-2", "Overwatch 2", true, "boosting"),
        ],
        all: [
            createGame("anime-vanguards", "Anime Vanguards", false, "boosting"),
            createGame("apex", "Apex Legends", false, "boosting"),
            createGame("arc-raiders", "Arc Raiders", false, "boosting"),
            createGame("arena-breakout", "Arena Breakout", false, "boosting"),
            createGame("arena-breakout-inf", "Arena Breakout: Infinite", false, "boosting"),
            createGame("battlefield", "Battlefield", false, "boosting"),
        ]
    },
    "Gift Cards": {
        popular: [
            createGame("roblox-gc", "Roblox Gift Cards", true, "gift-cards"),
            createGame("steam-gc", "Steam Gift Cards", true, "gift-cards"),
            createGame("valorant-gc", "Valorant Gift Cards", true, "gift-cards"),
            createGame("razer-gold", "Razer Gold", true, "gift-cards"),
            createGame("psn-gc", "PlayStation Gift Card", true, "gift-cards"),
            createGame("discord-nitro", "Discord Nitro", true, "gift-cards"),
            createGame("apple-gc", "Apple Gift Cards", true, "gift-cards"),
            createGame("amazon-gc", "Amazon Gift Cards", true, "gift-cards"),
            createGame("steam-accounts", "Steam Game Accounts", true, "gift-cards"),
            createGame("xbox-gc", "Xbox Gift Cards", true, "gift-cards"),
            createGame("cd-keys", "CD Keys", true, "gift-cards"),
            createGame("pubg-mobile", "PUBG Mobile Gift Cards", true, "gift-cards"),
        ],
        all: [
            createGame("amazon-gc", "Amazon Gift Cards", false, "gift-cards"),
            createGame("apple-gc", "Apple Gift Cards", false, "gift-cards"),
            createGame("blizzard-gc", "Blizzard Gift Cards", false, "gift-cards"),
            createGame("cd-keys", "CD Keys", false, "gift-cards"),
            createGame("discord-nitro", "Discord Nitro", false, "gift-cards"),
            createGame("fortnite", "Fortnite Gift Cards", false, "gift-cards"),
        ]
    },
    "Top Ups": {
        popular: [
            createGame("fortnite-topup", "Fortnite Top Up", true, "top-ups"),
            createGame("roblox-topup", "Roblox Top Up", true, "top-ups"),
        ],
        all: []
    },
    "Items": {
        popular: [
            createGame("roblox-items", "Roblox Items", true, "items"),
            createGame("rocket-league-items", "Rocket League Items", true, "items"),
        ],
        all: []
    }
}
