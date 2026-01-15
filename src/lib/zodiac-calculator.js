/**
 * Harmony Match - Chinese Zodiac Calculator
 * Calculates zodiac signs, elements, and compatibility
 */

// Chinese Zodiac Animals (in order)
const ZODIAC_ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

// Chinese Characters for Zodiac
const ZODIAC_CHINESE = {
  'Rat': '鼠', 'Ox': '牛', 'Tiger': '虎', 'Rabbit': '兔',
  'Dragon': '龙', 'Snake': '蛇', 'Horse': '马', 'Goat': '羊',
  'Monkey': '猴', 'Rooster': '鸡', 'Dog': '狗', 'Pig': '猪'
};

// Emoji representations
const ZODIAC_EMOJI = {
  'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇',
  'Dragon': '🐲', 'Snake': '🐍', 'Horse': '🐴', 'Goat': '🐐',
  'Monkey': '🐵', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐷'
};

// Five Elements (Wu Xing)
const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Element Chinese Characters
const ELEMENT_CHINESE = {
  'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水'
};

// Yin/Yang polarity
const YIN_YANG = ['Yang', 'Yin'];

// Element colors for UI
const ELEMENT_COLORS = {
  'Wood': '#228B22',
  'Fire': '#DC143C',
  'Earth': '#DAA520',
  'Metal': '#C0C0C0',
  'Water': '#1E90FF'
};

// Compatibility groups
const COMPATIBILITY_GROUPS = {
  trines: [
    ['Rat', 'Dragon', 'Monkey'],     // First Trine - Doers
    ['Ox', 'Snake', 'Rooster'],      // Second Trine - Thinkers
    ['Tiger', 'Horse', 'Dog'],       // Third Trine - Protectors
    ['Rabbit', 'Goat', 'Pig']        // Fourth Trine - Diplomats
  ],
  allies: {
    'Rat': ['Dragon', 'Monkey'],
    'Ox': ['Snake', 'Rooster'],
    'Tiger': ['Horse', 'Dog'],
    'Rabbit': ['Goat', 'Pig'],
    'Dragon': ['Rat', 'Monkey'],
    'Snake': ['Ox', 'Rooster'],
    'Horse': ['Tiger', 'Dog'],
    'Goat': ['Rabbit', 'Pig'],
    'Monkey': ['Rat', 'Dragon'],
    'Rooster': ['Ox', 'Snake'],
    'Dog': ['Tiger', 'Horse'],
    'Pig': ['Rabbit', 'Goat']
  },
  clashes: {
    'Rat': 'Horse',
    'Ox': 'Goat',
    'Tiger': 'Monkey',
    'Rabbit': 'Rooster',
    'Dragon': 'Dog',
    'Snake': 'Pig',
    'Horse': 'Rat',
    'Goat': 'Ox',
    'Monkey': 'Tiger',
    'Rooster': 'Rabbit',
    'Dog': 'Dragon',
    'Pig': 'Snake'
  },
  secretFriends: {
    'Rat': 'Ox',
    'Ox': 'Rat',
    'Tiger': 'Pig',
    'Pig': 'Tiger',
    'Rabbit': 'Dog',
    'Dog': 'Rabbit',
    'Dragon': 'Rooster',
    'Rooster': 'Dragon',
    'Snake': 'Monkey',
    'Monkey': 'Snake',
    'Horse': 'Goat',
    'Goat': 'Horse'
  }
};

// Element interaction cycles
const ELEMENT_CYCLES = {
  // Generating cycle (Sheng)
  generating: {
    'Wood': 'Fire',
    'Fire': 'Earth',
    'Earth': 'Metal',
    'Metal': 'Water',
    'Water': 'Wood'
  },
  // Overcoming cycle (Ke)
  overcoming: {
    'Wood': 'Earth',
    'Earth': 'Water',
    'Water': 'Fire',
    'Fire': 'Metal',
    'Metal': 'Wood'
  }
};

/**
 * Calculate the Chinese zodiac animal for a given year
 * @param {number} year - Birth year
 * @returns {string} Zodiac animal name
 */
function getZodiacAnimal(year) {
  // Chinese New Year varies, but for simplicity we use the standard calculation
  // The cycle starts from 1900 which was a Rat year
  const index = (year - 1900) % 12;
  return ZODIAC_ANIMALS[index >= 0 ? index : index + 12];
}

/**
 * Calculate the Chinese element for a given year
 * @param {number} year - Birth year
 * @returns {string} Element name
 */
function getElement(year) {
  // Each element governs 2 consecutive years
  const index = Math.floor((year - 1900) / 2) % 5;
  return ELEMENTS[index >= 0 ? index : index + 5];
}

/**
 * Determine Yin or Yang polarity
 * @param {number} year - Birth year
 * @returns {string} 'Yin' or 'Yang'
 */
function getPolarity(year) {
  return year % 2 === 0 ? 'Yang' : 'Yin';
}

/**
 * Get complete zodiac profile for a year
 * @param {number} year - Birth year
 * @returns {Object} Complete zodiac profile
 */
function getZodiacProfile(year) {
  const animal = getZodiacAnimal(year);
  const element = getElement(year);
  const polarity = getPolarity(year);

  return {
    year,
    animal,
    animalChinese: ZODIAC_CHINESE[animal],
    emoji: ZODIAC_EMOJI[animal],
    element,
    elementChinese: ELEMENT_CHINESE[element],
    elementColor: ELEMENT_COLORS[element],
    polarity,
    allies: COMPATIBILITY_GROUPS.allies[animal],
    clash: COMPATIBILITY_GROUPS.clashes[animal],
    secretFriend: COMPATIBILITY_GROUPS.secretFriends[animal],
    fullSign: `${element} ${animal}`
  };
}

/**
 * Calculate compatibility score between two zodiac animals
 * @param {string} animal1 - First zodiac animal
 * @param {string} animal2 - Second zodiac animal
 * @returns {number} Compatibility score (0-100)
 */
function calculateAnimalCompatibility(animal1, animal2) {
  let score = 50; // Base score

  // Same sign
  if (animal1 === animal2) {
    score = 70;
  }

  // Trine compatibility (best matches)
  const trines = COMPATIBILITY_GROUPS.trines;
  for (const trine of trines) {
    if (trine.includes(animal1) && trine.includes(animal2)) {
      score = 90;
      break;
    }
  }

  // Secret friends
  if (COMPATIBILITY_GROUPS.secretFriends[animal1] === animal2) {
    score = 85;
  }

  // Allies
  if (COMPATIBILITY_GROUPS.allies[animal1].includes(animal2)) {
    score = 88;
  }

  // Clash (opposite signs)
  if (COMPATIBILITY_GROUPS.clashes[animal1] === animal2) {
    score = 35;
  }

  return score;
}

/**
 * Calculate element compatibility
 * @param {string} element1 - First element
 * @param {string} element2 - Second element
 * @returns {Object} Element compatibility details
 */
function calculateElementCompatibility(element1, element2) {
  if (element1 === element2) {
    return {
      score: 75,
      relationship: 'same',
      description: 'Shared elemental nature creates understanding but may amplify weaknesses'
    };
  }

  // Check generating cycle
  if (ELEMENT_CYCLES.generating[element1] === element2) {
    return {
      score: 90,
      relationship: 'generating',
      description: `${element1} generates ${element2}, creating a nurturing flow of energy`
    };
  }
  if (ELEMENT_CYCLES.generating[element2] === element1) {
    return {
      score: 85,
      relationship: 'receiving',
      description: `${element2} nurtures ${element1}, providing supportive energy`
    };
  }

  // Check overcoming cycle
  if (ELEMENT_CYCLES.overcoming[element1] === element2) {
    return {
      score: 45,
      relationship: 'overcoming',
      description: `${element1} controls ${element2}, which requires mindful balance`
    };
  }
  if (ELEMENT_CYCLES.overcoming[element2] === element1) {
    return {
      score: 50,
      relationship: 'controlled',
      description: `${element2} has controlling influence over ${element1}, needing awareness`
    };
  }

  // Neutral relationship
  return {
    score: 65,
    relationship: 'neutral',
    description: 'Elements coexist independently with potential for growth'
  };
}

/**
 * Calculate polarity compatibility
 * @param {string} polarity1 - First polarity (Yin/Yang)
 * @param {string} polarity2 - Second polarity (Yin/Yang)
 * @returns {Object} Polarity compatibility details
 */
function calculatePolarityCompatibility(polarity1, polarity2) {
  if (polarity1 !== polarity2) {
    return {
      score: 85,
      balanced: true,
      description: 'Complementary energies create balance - Yin and Yang in harmony'
    };
  }
  return {
    score: 70,
    balanced: false,
    description: `Both partners share ${polarity1} energy - similar drive but may need conscious balance`
  };
}

/**
 * Calculate overall compatibility between two birth years
 * @param {number} year1 - First partner's birth year
 * @param {number} year2 - Second partner's birth year
 * @returns {Object} Complete compatibility analysis
 */
function calculateCompatibility(year1, year2) {
  const profile1 = getZodiacProfile(year1);
  const profile2 = getZodiacProfile(year2);

  const animalScore = calculateAnimalCompatibility(profile1.animal, profile2.animal);
  const elementCompat = calculateElementCompatibility(profile1.element, profile2.element);
  const polarityCompat = calculatePolarityCompatibility(profile1.polarity, profile2.polarity);

  // Weighted average: Animal 50%, Element 35%, Polarity 15%
  const overallScore = Math.round(
    animalScore * 0.50 +
    elementCompat.score * 0.35 +
    polarityCompat.score * 0.15
  );

  // Determine compatibility level
  let level, levelDescription;
  if (overallScore >= 85) {
    level = 'Excellent';
    levelDescription = 'A truly harmonious match with natural understanding';
  } else if (overallScore >= 75) {
    level = 'Very Good';
    levelDescription = 'Strong compatibility with great potential';
  } else if (overallScore >= 65) {
    level = 'Good';
    levelDescription = 'Solid foundation with room for growth';
  } else if (overallScore >= 50) {
    level = 'Moderate';
    levelDescription = 'Requires effort but can flourish with understanding';
  } else if (overallScore >= 40) {
    level = 'Challenging';
    levelDescription = 'Significant differences to navigate mindfully';
  } else {
    level = 'Difficult';
    levelDescription = 'Major challenges requiring dedicated work';
  }

  // Determine relationship dynamics
  const isTrineMatch = COMPATIBILITY_GROUPS.trines.some(
    trine => trine.includes(profile1.animal) && trine.includes(profile2.animal)
  );
  const isSecretFriend = COMPATIBILITY_GROUPS.secretFriends[profile1.animal] === profile2.animal;
  const isClash = COMPATIBILITY_GROUPS.clashes[profile1.animal] === profile2.animal;

  return {
    partner1: profile1,
    partner2: profile2,
    scores: {
      overall: overallScore,
      animal: animalScore,
      element: elementCompat.score,
      polarity: polarityCompat.score
    },
    level,
    levelDescription,
    elementRelationship: elementCompat,
    polarityRelationship: polarityCompat,
    dynamics: {
      isTrineMatch,
      isSecretFriend,
      isClash,
      isSameAnimal: profile1.animal === profile2.animal,
      isSameElement: profile1.element === profile2.element
    },
    pairingKey: [profile1.animal, profile2.animal].sort().join('-')
  };
}

/**
 * Get years for a specific zodiac animal within a range
 * @param {string} animal - Zodiac animal name
 * @param {number} startYear - Start of range
 * @param {number} endYear - End of range
 * @returns {Array} Array of years
 */
function getYearsForAnimal(animal, startYear = 1940, endYear = 2030) {
  const years = [];
  const animalIndex = ZODIAC_ANIMALS.indexOf(animal);

  for (let year = startYear; year <= endYear; year++) {
    if (getZodiacAnimal(year) === animal) {
      years.push(year);
    }
  }

  return years;
}

/**
 * Get all zodiac information
 * @returns {Object} Complete zodiac data
 */
function getZodiacData() {
  return {
    animals: ZODIAC_ANIMALS,
    chinese: ZODIAC_CHINESE,
    emojis: ZODIAC_EMOJI,
    elements: ELEMENTS,
    elementChinese: ELEMENT_CHINESE,
    elementColors: ELEMENT_COLORS,
    compatibilityGroups: COMPATIBILITY_GROUPS
  };
}

/**
 * Validate birth year
 * @param {number} year - Year to validate
 * @returns {Object} Validation result
 */
function validateBirthYear(year) {
  const currentYear = new Date().getFullYear();
  const minYear = 1920;
  const maxYear = currentYear;

  if (!year || isNaN(year)) {
    return { valid: false, error: 'Please enter a valid year' };
  }

  if (year < minYear) {
    return { valid: false, error: `Year must be ${minYear} or later` };
  }

  if (year > maxYear) {
    return { valid: false, error: `Year cannot be in the future` };
  }

  return { valid: true };
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getZodiacAnimal,
    getElement,
    getPolarity,
    getZodiacProfile,
    calculateCompatibility,
    calculateAnimalCompatibility,
    calculateElementCompatibility,
    calculatePolarityCompatibility,
    getYearsForAnimal,
    getZodiacData,
    validateBirthYear,
    ZODIAC_ANIMALS,
    ZODIAC_CHINESE,
    ZODIAC_EMOJI,
    ELEMENTS,
    ELEMENT_CHINESE,
    ELEMENT_COLORS,
    COMPATIBILITY_GROUPS
  };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.ZodiacCalculator = {
    getZodiacAnimal,
    getElement,
    getPolarity,
    getZodiacProfile,
    calculateCompatibility,
    calculateAnimalCompatibility,
    calculateElementCompatibility,
    calculatePolarityCompatibility,
    getYearsForAnimal,
    getZodiacData,
    validateBirthYear,
    ZODIAC_ANIMALS,
    ZODIAC_CHINESE,
    ZODIAC_EMOJI,
    ELEMENTS,
    ELEMENT_CHINESE,
    ELEMENT_COLORS,
    COMPATIBILITY_GROUPS
  };
}
