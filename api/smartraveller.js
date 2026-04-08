export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Fetch the Smartraveller destinations page
    const response = await fetch('https://www.smartraveller.gov.au/destinations');
    const html = await response.text();

    // Extract country data from the HTML
    const advisories = [];
    
    // Updated regex patterns to match current Smartraveller format
    // Looking for data-level and country name patterns
    const countryPattern = /<a[^>]*href="\/destinations\/([^"]+)"[^>]*data-level="(\d)"[^>]*>(.*?)<\/a>/gi;
    
    let match;
    while ((match = countryPattern.exec(html)) !== null) {
      const slug = match[1];
      const level = parseInt(match[2]);
      const country = match[3].trim();
      
      // Map levels to descriptions
      const levelDescriptions = {
        1: 'Exercise normal safety precautions',
        2: 'Exercise a high degree of caution',
        3: 'Reconsider your need to travel',
        4: 'Do not travel'
      };

      // Generate appropriate summary based on level
      const summaries = {
        1: 'Exercise normal safety precautions and be aware of your surroundings.',
        2: 'Exercise a high degree of caution due to varying safety and security risks.',
        3: 'Reconsider your need to travel due to significant safety and security concerns.',
        4: 'Do not travel due to extreme safety and security risks. Evacuation may be difficult.'
      };

      advisories.push({
        country: country,
        level: level,
        levelText: levelDescriptions[level] || 'Unknown',
        summary: summaries[level] || 'Check Smartraveller for current advice.',
        url: `https://www.smartraveller.gov.au/destinations/${slug}`
      });
    }

    // If the pattern didn't work, try alternative scraping method
    if (advisories.length === 0) {
      // Fallback: try to find country cards/tiles
      const cardPattern = /<div[^>]*class="[^"]*country-card[^"]*"[^>]*>[\s\S]*?data-level="(\d)"[\s\S]*?<a[^>]*href="\/destinations\/([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<\/div>/gi;
      
      while ((match = cardPattern.exec(html)) !== null) {
        const level = parseInt(match[1]);
        const slug = match[2];
        const country = match[3].replace(/<[^>]*>/g, '').trim();
        
        const levelDescriptions = {
          1: 'Exercise normal safety precautions',
          2: 'Exercise a high degree of caution',
          3: 'Reconsider your need to travel',
          4: 'Do not travel'
        };

        const summaries = {
          1: 'Exercise normal safety precautions and be aware of your surroundings.',
          2: 'Exercise a high degree of caution due to varying safety and security risks.',
          3: 'Reconsider your need to travel due to significant safety and security concerns.',
          4: 'Do not travel due to extreme safety and security risks. Evacuation may be difficult.'
        };

        advisories.push({
          country: country,
          level: level,
          levelText: levelDescriptions[level] || 'Unknown',
          summary: summaries[level] || 'Check Smartraveller for current advice.',
          url: `https://www.smartraveller.gov.au/destinations/${slug}`
        });
      }
    }

    // Sort alphabetically
    advisories.sort((a, b) => a.country.localeCompare(b.country));

    return res.status(200).json({
      success: true,
      advisories: advisories,
      lastUpdated: new Date().toISOString(),
      count: advisories.length
    });

  } catch (error) {
    console.error('Smartraveller API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch travel advisories',
      message: error.message
    });
  }
}
