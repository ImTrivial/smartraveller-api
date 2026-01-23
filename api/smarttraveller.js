// api/smartraveler.js
// This file goes in your Vercel project under /api folder

export default async function handler(req, res) {
  // Enable CORS so your Wix site can access this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400'); // Cache for 24 hours

  try {
    // List of countries to fetch from Smartraveller
    const countries = [
      // Level 4 - Do Not Travel
      { name: 'Afghanistan', slug: 'afghanistan' },
      { name: 'Belarus', slug: 'belarus' },
      { name: 'Burkina Faso', slug: 'burkina-faso' },
      { name: 'Central African Republic', slug: 'central-african-republic' },
      { name: 'Chad', slug: 'chad' },
      { name: 'Democratic Republic of the Congo', slug: 'democratic-republic-congo' },
      { name: 'Haiti', slug: 'haiti' },
      { name: 'Iran', slug: 'iran' },
      { name: 'Iraq', slug: 'iraq' },
      { name: 'Libya', slug: 'libya' },
      { name: 'Mali', slug: 'mali' },
      { name: 'Myanmar', slug: 'myanmar' },
      { name: 'Niger', slug: 'niger' },
      { name: 'North Korea', slug: 'north-korea' },
      { name: 'Palestine', slug: 'palestine' },
      { name: 'Russia', slug: 'russia' },
      { name: 'Somalia', slug: 'somalia' },
      { name: 'South Sudan', slug: 'south-sudan' },
      { name: 'Sudan', slug: 'sudan' },
      { name: 'Syria', slug: 'syria' },
      { name: 'Ukraine', slug: 'ukraine' },
      { name: 'Venezuela', slug: 'venezuela' },
      { name: 'Yemen', slug: 'yemen' },
      
      // Level 3 - Reconsider
      { name: 'Lebanon', slug: 'lebanon' },
      { name: 'Pakistan', slug: 'pakistan' },
      { name: 'Egypt', slug: 'egypt' },
      { name: 'Ethiopia', slug: 'ethiopia' },
      { name: 'Kenya', slug: 'kenya' },
      { name: 'Colombia', slug: 'colombia' },
      { name: 'Nigeria', slug: 'nigeria' },
      { name: 'Cameroon', slug: 'cameroon' },
      { name: 'Mozambique', slug: 'mozambique' },
      { name: 'Papua New Guinea', slug: 'papua-new-guinea' },
      
      // Level 2 - High Degree of Caution
      { name: 'Thailand', slug: 'thailand' },
      { name: 'Indonesia', slug: 'indonesia' },
      { name: 'Philippines', slug: 'philippines' },
      { name: 'India', slug: 'india' },
      { name: 'Mexico', slug: 'mexico' },
      { name: 'Brazil', slug: 'brazil' },
      { name: 'South Africa', slug: 'south-africa' },
      { name: 'Turkey', slug: 'turkey' },
      { name: 'Israel', slug: 'israel' },
      { name: 'Morocco', slug: 'morocco' },
      { name: 'Jordan', slug: 'jordan' },
      { name: 'Saudi Arabia', slug: 'saudi-arabia' },
      { name: 'Bangladesh', slug: 'bangladesh' },
      
      // Level 1 - Normal Precautions (popular destinations)
      { name: 'Japan', slug: 'japan' },
      { name: 'Singapore', slug: 'singapore' },
      { name: 'South Korea', slug: 'south-korea' },
      { name: 'Vietnam', slug: 'vietnam' },
      { name: 'United States', slug: 'united-states-america' },
      { name: 'United Kingdom', slug: 'united-kingdom' },
      { name: 'France', slug: 'france' },
      { name: 'Germany', slug: 'germany' },
      { name: 'Italy', slug: 'italy' },
      { name: 'Spain', slug: 'spain' },
      { name: 'New Zealand', slug: 'new-zealand' },
      { name: 'Canada', slug: 'canada' }
    ];

    // Fetch data from Smartraveller for each country
    const advisories = await Promise.all(
      countries.map(async (country) => {
        try {
          const url = `https://www.smartraveller.gov.au/destinations/${country.slug}`;
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (!response.ok) {
            // If fetch fails, return default data
            return {
              country: country.name,
              level: 1,
              levelText: 'Green - Safe',
              summary: 'Exercise normal safety precautions.',
              isNew: false
            };
          }

          const html = await response.text();
          
          // Parse the advisory level from the HTML
          let level = 1;
          let levelText = 'Green - Safe';
          let summary = 'Exercise normal safety precautions.';

          // Look for advisory level indicators in the HTML
          if (html.includes('do-not-travel') || html.includes('Do not travel')) {
            level = 4;
            levelText = 'Red - Do Not Travel';
          } else if (html.includes('reconsider-your-need-to-travel') || html.includes('Reconsider your need to travel')) {
            level = 3;
            levelText = 'Orange - Unsafe';
          } else if (html.includes('high-degree-of-caution') || html.includes('Exercise a high degree of caution')) {
            level = 2;
            levelText = 'Yellow - Caution';
          }

          // Extract summary text (this is a simplified extraction)
          const summaryMatch = html.match(/<p[^>]*class="[^"]*advice-summary[^"]*"[^>]*>(.*?)<\/p>/i);
          if (summaryMatch && summaryMatch[1]) {
            summary = summaryMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 200);
          }

          return {
            country: country.name,
            level,
            levelText,
            summary,
            isNew: false
          };
        } catch (error) {
          console.error(`Error fetching ${country.name}:`, error);
          // Return default data on error
          return {
            country: country.name,
            level: 1,
            levelText: 'Green - Safe',
            summary: 'Exercise normal safety precautions.',
            isNew: false
          };
        }
      })
    );

    // Sort by level (highest risk first)
    advisories.sort((a, b) => b.level - a.level);

    res.status(200).json({
      success: true,
      lastUpdated: new Date().toISOString(),
      advisories
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch advisories'
    });
  }
}
