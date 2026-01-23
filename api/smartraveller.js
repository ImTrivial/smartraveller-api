// api/smartraveller.js
// Simple serverless function for Vercel

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  // List of countries with their Smartraveller slugs
  const countries = [
    // Level 4 - Do Not Travel
    { name: 'Afghanistan', slug: 'afghanistan', level: 4 },
    { name: 'Belarus', slug: 'belarus', level: 4 },
    { name: 'Burkina Faso', slug: 'burkina-faso', level: 4 },
    { name: 'Central African Republic', slug: 'central-african-republic', level: 4 },
    { name: 'Chad', slug: 'chad', level: 4 },
    { name: 'Democratic Republic of the Congo', slug: 'democratic-republic-congo', level: 4 },
    { name: 'Haiti', slug: 'haiti', level: 4 },
    { name: 'Iran', slug: 'iran', level: 4 },
    { name: 'Iraq', slug: 'iraq', level: 4 },
    { name: 'Libya', slug: 'libya', level: 4 },
    { name: 'Mali', slug: 'mali', level: 4 },
    { name: 'Myanmar', slug: 'myanmar', level: 4 },
    { name: 'Niger', slug: 'niger', level: 4 },
    { name: 'North Korea', slug: 'north-korea', level: 4 },
    { name: 'Palestine', slug: 'palestine', level: 4 },
    { name: 'Russia', slug: 'russia', level: 4 },
    { name: 'Somalia', slug: 'somalia', level: 4 },
    { name: 'South Sudan', slug: 'south-sudan', level: 4 },
    { name: 'Sudan', slug: 'sudan', level: 4 },
    { name: 'Syria', slug: 'syria', level: 4 },
    { name: 'Ukraine', slug: 'ukraine', level: 4 },
    { name: 'Venezuela', slug: 'venezuela', level: 4 },
    { name: 'Yemen', slug: 'yemen', level: 4 },
    
    // Level 3 - Reconsider
    { name: 'Lebanon', slug: 'lebanon', level: 3 },
    { name: 'Pakistan', slug: 'pakistan', level: 3 },
    { name: 'Egypt', slug: 'egypt', level: 3 },
    { name: 'Ethiopia', slug: 'ethiopia', level: 3 },
    { name: 'Kenya', slug: 'kenya', level: 3 },
    { name: 'Colombia', slug: 'colombia', level: 3 },
    { name: 'Nigeria', slug: 'nigeria', level: 3 },
    
    // Level 2 - High Caution
    { name: 'Thailand', slug: 'thailand', level: 2 },
    { name: 'Indonesia', slug: 'indonesia', level: 2 },
    { name: 'Philippines', slug: 'philippines', level: 2 },
    { name: 'India', slug: 'india', level: 2 },
    { name: 'Mexico', slug: 'mexico', level: 2 },
    { name: 'Brazil', slug: 'brazil', level: 2 },
    { name: 'South Africa', slug: 'south-africa', level: 2 },
    { name: 'Turkey', slug: 'turkey', level: 2 },
    { name: 'Israel', slug: 'israel', level: 2 },
    
    // Level 1 - Normal Precautions
    { name: 'Japan', slug: 'japan', level: 1 },
    { name: 'Singapore', slug: 'singapore', level: 1 },
    { name: 'South Korea', slug: 'south-korea', level: 1 },
    { name: 'Vietnam', slug: 'vietnam', level: 1 },
    { name: 'United States', slug: 'united-states-america', level: 1 },
    { name: 'United Kingdom', slug: 'united-kingdom', level: 1 },
    { name: 'France', slug: 'france', level: 1 },
    { name: 'Germany', slug: 'germany', level: 1 },
    { name: 'Italy', slug: 'italy', level: 1 },
    { name: 'Spain', slug: 'spain', level: 1 },
    { name: 'New Zealand', slug: 'new-zealand', level: 1 }
  ];

  const levelTexts = {
    1: 'Green - Safe',
    2: 'Yellow - Caution',
    3: 'Orange - Unsafe',
    4: 'Red - Do Not Travel'
  };

  const summaries = {
    1: 'Exercise normal safety precautions.',
    2: 'Exercise a high degree of caution.',
    3: 'Reconsider your need to travel.',
    4: 'Do not travel.'
  };

  // Create advisories array
  const advisories = countries.map(country => ({
    country: country.name,
    level: country.level,
    levelText: levelTexts[country.level],
    summary: summaries[country.level],
    isNew: false
  }));

  // Sort by risk level (highest first)
  advisories.sort((a, b) => b.level - a.level);

  res.status(200).json({
    success: true,
    lastUpdated: new Date().toISOString(),
    advisories
  });
};
