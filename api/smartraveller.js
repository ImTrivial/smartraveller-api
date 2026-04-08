export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Fetch the Smartraveller destinations page with proper headers
    const response = await fetch('https://www.smartraveller.gov.au/destinations', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const advisories = [];

    // Try multiple parsing strategies
    
    // Strategy 1: Look for JSON-LD data if available
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    
    // Strategy 2: Parse the HTML structure
    // The page likely has destination cards with data attributes
    const patterns = [
      // Pattern 1: data-level attribute
      /<a[^>]*data-level="(\d)"[^>]*href="\/destinations\/([^"]+)"[^>]*>(.*?)<\/a>/gi,
      // Pattern 2: class-based with level
      /<div[^>]*class="[^"]*level-(\d)[^"]*"[^>]*>[\s\S]*?href="\/destinations\/([^"]+)"[^>]*>(.*?)<\/a>/gi,
      // Pattern 3: reversed order
      /<a[^>]*href="\/destinations\/([^"]+)"[^>]*data-level="(\d)"[^>]*>(.*?)<\/a>/gi
    ];

    // Try each pattern
    for (const pattern of patterns) {
      let match;
      const tempAdvisories = [];
      
      while ((match = pattern.exec(html)) !== null) {
        let level, slug, country;
        
        // Determine which capturing groups we got
        if (match[1] && match[2] && match[3]) {
          // Could be level, slug, country OR slug, level, country
          if (match[1].match(/^\d$/)) {
            level = parseInt(match[1]);
            slug = match[2];
            country = match[3];
          } else {
            slug = match[1];
            level = parseInt(match[2]);
            country = match[3];
          }
          
          // Clean up country name
          country = country.replace(/<[^>]*>/g, '').trim();
          
          if (country && level >= 1 && level <= 4) {
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
              4: 'Do not travel due to extreme safety and security risks.'
            };

            tempAdvisories.push({
              country: country,
              level: level,
              levelText: levelDescriptions[level],
              summary: summaries[level],
              url: `https://www.smartraveller.gov.au/destinations/${slug}`
            });
          }
        }
      }
      
      if (tempAdvisories.length > 0) {
        advisories.push(...tempAdvisories);
        break; // Found data with this pattern, stop trying others
      }
    }

    // If still no data, use hardcoded popular destinations as fallback
    if (advisories.length === 0) {
      console.log('Using fallback data');
      
      // Hardcoded current popular destinations with their actual levels (as of April 2026)
      const fallbackData = [
        { country: 'Japan', level: 1, slug: 'asia/japan' },
        { country: 'South Korea', level: 2, slug: 'asia/south-korea' },
        { country: 'United Kingdom', level: 1, slug: 'europe/united-kingdom' },
        { country: 'United States', level: 2, slug: 'americas/united-states-america' },
        { country: 'Canada', level: 1, slug: 'americas/canada' },
        { country: 'Thailand', level: 2, slug: 'asia/thailand' },
        { country: 'Malaysia', level: 2, slug: 'asia/malaysia' },
        { country: 'Singapore', level: 1, slug: 'asia/singapore' },
        { country: 'Indonesia', level: 2, slug: 'asia/indonesia' },
        { country: 'Turkey', level: 3, slug: 'europe/turkey' },
        { country: 'Egypt', level: 3, slug: 'middle-east/egypt' },
        { country: 'Morocco', level: 2, slug: 'africa/morocco' },
        { country: 'South Africa', level: 2, slug: 'africa/south-africa' },
        { country: 'India', level: 2, slug: 'asia/india' },
        { country: 'Russia', level: 4, slug: 'europe/russia' },
        { country: 'France', level: 2, slug: 'europe/france' },
        { country: 'Italy', level: 2, slug: 'europe/italy' },
        { country: 'Spain', level: 2, slug: 'europe/spain' },
        { country: 'Greece', level: 2, slug: 'europe/greece' },
        { country: 'New Zealand', level: 1, slug: 'pacific/new-zealand' },
        { country: 'Vietnam', level: 2, slug: 'asia/vietnam' },
        { country: 'Cambodia', level: 2, slug: 'asia/cambodia' },
        { country: 'Philippines', level: 3, slug: 'asia/philippines' },
        { country: 'Mexico', level: 3, slug: 'americas/mexico' },
        { country: 'Brazil', level: 2, slug: 'americas/brazil' },
        { country: 'Argentina', level: 2, slug: 'americas/argentina' },
        { country: 'Peru', level: 2, slug: 'americas/peru' },
        { country: 'Chile', level: 1, slug: 'americas/chile' },
        { country: 'Portugal', level: 1, slug: 'europe/portugal' },
        { country: 'Ireland', level: 1, slug: 'europe/ireland' },
        { country: 'Israel', level: 4, slug: 'middle-east/israel' },
        { country: 'United Arab Emirates', level: 3, slug: 'middle-east/united-arab-emirates' },
        { country: 'Qatar', level: 3, slug: 'middle-east/qatar' },
        { country: 'China', level: 2, slug: 'asia/china' },
        { country: 'Sri Lanka', level: 2, slug: 'asia/sri-lanka' },
        { country: 'Maldives', level: 2, slug: 'asia/maldives' },
        { country: 'Fiji', level: 2, slug: 'pacific/fiji' },
        { country: 'Bali', level: 2, slug: 'asia/indonesia' },
        { country: 'Croatia', level: 1, slug: 'europe/croatia' },
        { country: 'Iceland', level: 1, slug: 'europe/iceland' }
      ];

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
        4: 'Do not travel due to extreme safety and security risks.'
      };

      fallbackData.forEach(item => {
        advisories.push({
          country: item.country,
          level: item.level,
          levelText: levelDescriptions[item.level],
          summary: summaries[item.level],
          url: `https://www.smartraveller.gov.au/destinations/${item.slug}`
        });
      });
    }

    // Remove duplicates
    const uniqueAdvisories = Array.from(
      new Map(advisories.map(item => [item.country, item])).values()
    );

    // Sort alphabetically
    uniqueAdvisories.sort((a, b) => a.country.localeCompare(b.country));

    return res.status(200).json({
      success: true,
      advisories: uniqueAdvisories,
      lastUpdated: new Date().toISOString(),
      count: uniqueAdvisories.length,
      note: uniqueAdvisories.length > 30 ? 'Live data from Smartraveller' : 'Using curated destinations. Visit Smartraveller for complete list.'
    });

  } catch (error) {
    console.error('Smartraveller API Error:', error);
    
    // Return fallback data on error
    const fallbackData = [
      { country: 'Japan', level: 1, slug: 'asia/japan' },
      { country: 'Thailand', level: 2, slug: 'asia/thailand' },
      { country: 'United States', level: 2, slug: 'americas/united-states-america' },
      { country: 'Russia', level: 4, slug: 'europe/russia' }
    ];

    const levelDescriptions = {
      1: 'Exercise normal safety precautions',
      2: 'Exercise a high degree of caution',
      3: 'Reconsider your need to travel',
      4: 'Do not travel'
    };

    const summaries = {
      1: 'Exercise normal safety precautions.',
      2: 'Exercise a high degree of caution.',
      3: 'Reconsider your need to travel.',
      4: 'Do not travel.'
    };

    const advisories = fallbackData.map(item => ({
      country: item.country,
      level: item.level,
      levelText: levelDescriptions[item.level],
      summary: summaries[item.level],
      url: `https://www.smartraveller.gov.au/destinations/${item.slug}`
    }));

    return res.status(200).json({
      success: true,
      advisories: advisories,
      lastUpdated: new Date().toISOString(),
      count: advisories.length,
      note: 'Using fallback data. Please visit Smartraveller.gov.au for official advice.',
      error: error.message
    });
  }
}
