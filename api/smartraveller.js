export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // CRITICAL: Always have fallback data ready with all 40 destinations
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
    { country: 'Croatia', level: 1, slug: 'europe/croatia' },
    { country: 'Iceland', level: 1, slug: 'europe/iceland' },
    { country: 'Norway', level: 1, slug: 'europe/norway' },
    { country: 'Sweden', level: 1, slug: 'europe/sweden' },
    { country: 'Denmark', level: 1, slug: 'europe/denmark' },
    { country: 'Switzerland', level: 1, slug: 'europe/switzerland' },
    { country: 'Austria', level: 1, slug: 'europe/austria' },
    { country: 'Germany', level: 2, slug: 'europe/germany' },
    { country: 'Netherlands', level: 1, slug: 'europe/netherlands' },
    { country: 'Belgium', level: 2, slug: 'europe/belgium' },
    { country: 'Czech Republic', level: 1, slug: 'europe/czech-republic' },
    { country: 'Poland', level: 2, slug: 'europe/poland' },
    { country: 'Hungary', level: 1, slug: 'europe/hungary' }
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

  const buildAdvisories = (data) => {
    return data.map(item => ({
      country: item.country,
      level: item.level,
      levelText: levelDescriptions[item.level],
      summary: summaries[item.level],
      url: `https://www.smartraveller.gov.au/destinations/${item.slug}`
    }));
  };

  // Sort by priority: Level 4 (Red) first, then 3 (Orange), then 2 (Yellow), then 1 (Green)
  // Within each level, sort alphabetically
  const sortByPriority = (advisories) => {
    return advisories.sort((a, b) => {
      // First sort by level (highest to lowest)
      if (a.level !== b.level) {
        return b.level - a.level;
      }
      // Then alphabetically within same level
      return a.country.localeCompare(b.country);
    });
  };

  try {
    // Create abort controller with 5 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://www.smartraveller.gov.au/destinations', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    let advisories = [];

    // Try to parse - but don't spend too long on it
    const patterns = [
      /<a[^>]*data-level="(\d)"[^>]*href="\/destinations\/([^"]+)"[^>]*>([^<]+)<\/a>/gi,
      /<a[^>]*href="\/destinations\/([^"]+)"[^>]*data-level="(\d)"[^>]*>([^<]+)<\/a>/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(html)) !== null && advisories.length < 200) {
        let level, slug, country;
        
        if (match[1] && match[1].match(/^\d$/)) {
          level = parseInt(match[1]);
          slug = match[2];
          country = match[3];
        } else {
          slug = match[1];
          level = parseInt(match[2]);
          country = match[3];
        }
        
        country = country.replace(/<[^>]*>/g, '').trim();
        
        if (country && level >= 1 && level <= 4) {
          advisories.push({
            country: country,
            level: level,
            levelText: levelDescriptions[level],
            summary: summaries[level],
            url: `https://www.smartraveller.gov.au/destinations/${slug}`
          });
        }
      }
      
      if (advisories.length > 0) break;
    }

    // If we got data, use it
    if (advisories.length > 10) {
      const unique = Array.from(new Map(advisories.map(a => [a.country, a])).values());
      const sorted = sortByPriority(unique);
      
      return res.status(200).json({
        success: true,
        advisories: sorted,
        lastUpdated: new Date().toISOString(),
        count: sorted.length,
        source: 'scraped'
      });
    }

    // Otherwise use fallback
    throw new Error('No data parsed');

  } catch (error) {
    // ANY error -> immediately return fallback data
    console.log('Using fallback:', error.message);
    
    const advisories = buildAdvisories(fallbackData);
    const sorted = sortByPriority(advisories);
    
    return res.status(200).json({
      success: true,
      advisories: sorted,
      lastUpdated: new Date().toISOString(),
      count: sorted.length,
      source: 'fallback',
      note: 'Visit Smartraveller.gov.au for official travel advice'
    });
  }
}
