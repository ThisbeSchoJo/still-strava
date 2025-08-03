export const getActivityIcon = (activityType) => {
  const emojiMap = {
    Hammocking: "🪢",
    "Mycology Walk": "🍄",
    "Catching amphibians and reptiles": "🐸",
    "Seashell Collecting": "🐚",
    "Catching fireflies": "✨",
    "Building a sandcastle": "🏖️",
    "Building a snowman": "⛄",
    "Skipping stones": "💧",
    Gardening: "🪴",
    "Sunset Watching": "🌇",
    "Sunrise Watching": "🌅",
    Stargazing: "🌌",
    "Bird Watching": "🐦",
    Foraging: "🌿",
    Bioblitzing: "🔬",
    "Outdoor Reading": "📖",
    Campfire: "🔥",
    Tidepooling: "🌊",
    "Wood carving": "🪚",
    Rockhounding: "🪨",
    "Fossil Hunting": "🦴",
    Camping: "🏕️",
    Fishing: "🎣",
    Picnicking: "🥪",
    Meditating: "🧘",
  };

  return emojiMap[activityType] || "📍";
};
