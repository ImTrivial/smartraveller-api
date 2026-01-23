// api/smartraveller.js
// Fetch real data from Smartraveller's official API

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  try {
    // Fetch from Smartraveller's official public API
    const response = await fetch('https://www.smartraveller.gov.au/destinations-export', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Smartraveller API');
    }

    const data = await response.json();

    const levelMapping = {
      1: 'Green - Safe',
      2: 'Yellow - Caution',
      3: 'Orange - Unsafe',
      4: 'Red - Do Not Travel'
    };

    // Process the data
    const advisories = data.data.map(country => {
      // Extract the advisory summary (remove "We continue to advise" prefix)
      let summary = country.advisory || country.advice_text || 'No advisory available';
      
      // Clean up the summary
      summary = summary.replace(/^We continue to advise:?\s*/i, '');
      summary = summary.replace(/^We advise:?\s*/i, '');
      summary = summary.trim();

      // Get the level
      const level = parseInt(country.alert_level) || 1;

      return {
        country: country.name,
        level: level,
        levelText: levelMapping[level],
        summary: summary,
        isNew: false
      };
    });

    // Sort by risk level (highest first)
    advisories.sort((a, b) => b.level - a.level);

    res.status(200).json({
      success: true,
      lastUpdated: new Date().toISOString(),
      advisories: advisories
    });

  } catch (error) {
    console.error('Error fetching from Smartraveller:', error);
    
    // Fallback data if API fails
    const fallbackAdvisories = [
      { country: 'Iran', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Iran due to the risk of arbitrary detention and the volatile regional security situation.', isNew: false },
      { country: 'Russia', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Russia due to the dangerous security situation, the impacts of the military conflict with Ukraine and the risk of arbitrary detention or arrest.', isNew: false },
      { country: 'Afghanistan', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Afghanistan due to the extremely dangerous security situation and the very high threat of terrorism.', isNew: false }
    ];

    res.status(200).json({
      success: true,
      lastUpdated: new Date().toISOString(),
      advisories: fallbackAdvisories,
      note: 'Using fallback data - API temporarily unavailable'
    });
  }
};
