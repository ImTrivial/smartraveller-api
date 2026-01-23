// api/smartraveller.js
// Fast, reliable advisory data (manually updated from Smartraveller as of Jan 2026)

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600');

  // Curated data with real advisory text from Smartraveller
  const advisories = [
    // Level 4 - Do Not Travel
    { country: 'Afghanistan', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Afghanistan due to the extremely dangerous security situation and the very high threat of terrorism and kidnapping.', isNew: false },
    { country: 'Belarus', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Belarus due to the volatile security environment caused by the conflict in Ukraine and the arbitrary enforcement of local laws.', isNew: false },
    { country: 'Burkina Faso', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Burkina Faso due to the volatile security situation and the threat of terrorism and kidnapping.', isNew: false },
    { country: 'Central African Republic', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to the Central African Republic due to the dangerous security situation and the threat of kidnapping and violent crime.', isNew: false },
    { country: 'Chad', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Chad due to the volatile and unpredictable security situation and the threat of terrorism.', isNew: false },
    { country: 'Haiti', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Haiti due to the dangerous security situation, including gang violence, kidnapping, civil unrest and limited police protection.', isNew: false },
    { country: 'Iran', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Iran due to the risk of arbitrary detention and the volatile regional security situation.', isNew: false },
    { country: 'Iraq', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Iraq due to the dangerous security situation and the very high threat of terrorism, kidnapping and armed conflict.', isNew: false },
    { country: 'Libya', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Libya due to the dangerous security situation, threat of armed conflict, arbitrary detention and kidnapping.', isNew: false },
    { country: 'Mali', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Mali due to the dangerous security situation and the high threat of terrorism and kidnapping.', isNew: false },
    { country: 'Myanmar', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Myanmar due to the extremely dangerous security situation and armed conflict.', isNew: false },
    { country: 'Niger', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Niger due to the dangerous security situation and the high threat of terrorism and kidnapping.', isNew: false },
    { country: 'North Korea', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to North Korea due to the risk of arbitrary arrest and long-term detention.', isNew: false },
    { country: 'Palestine', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Gaza and the West Bank due to the volatile security situation and threat of armed conflict and terrorism.', isNew: false },
    { country: 'Russia', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Russia due to the dangerous security situation, the impacts of the military conflict with Ukraine and the risk of arbitrary detention or arrest.', isNew: false },
    { country: 'Somalia', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Somalia due to the extremely dangerous security situation and the very high threat of terrorism and kidnapping.', isNew: false },
    { country: 'South Sudan', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to South Sudan due to the dangerous security situation, threat of armed conflict and violent crime.', isNew: false },
    { country: 'Sudan', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Sudan due to the dangerous security situation and armed conflict.', isNew: false },
    { country: 'Syria', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Syria due to the extremely dangerous security situation, armed conflict, threat of terrorism and kidnapping.', isNew: false },
    { country: 'Ukraine', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Ukraine due to the dangerous security situation caused by the military conflict with Russia.', isNew: false },
    { country: 'Venezuela', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Venezuela due to the dangerous security situation, risk of kidnapping, violent crime, civil unrest and arbitrary detention.', isNew: false },
    { country: 'Yemen', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to Yemen due to the extremely dangerous security situation, armed conflict, threat of terrorism and kidnapping.', isNew: false },
    { country: 'Democratic Republic of the Congo', level: 4, levelText: 'Red - Do Not Travel', summary: 'Do not travel to the Democratic Republic of the Congo due to the dangerous security situation, threat of armed conflict, kidnapping and violent crime.', isNew: false },

    // Level 3 - Reconsider Your Need to Travel
    { country: 'Lebanon', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to Lebanon due to the volatile security situation and the threat of armed conflict, terrorism and kidnapping.', isNew: false },
    { country: 'Pakistan', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to Pakistan overall due to the volatile security situation and the very high threat of terrorism.', isNew: false },
    { country: 'Egypt', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to the North Sinai Governorate and the border with Libya due to the threat of terrorism.', isNew: false },
    { country: 'Ethiopia', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to Ethiopia due to civil unrest and the unpredictable security situation in some areas.', isNew: false },
    { country: 'Kenya', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to areas within 60km of the Kenya-Somalia border due to terrorism and kidnapping.', isNew: false },
    { country: 'Colombia', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to some areas due to the threat of terrorism, kidnapping and the presence of landmines.', isNew: false },
    { country: 'Nigeria', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to parts of Nigeria due to the volatile security situation and threats of kidnapping, armed robbery and terrorism.', isNew: false },
    { country: 'Cameroon', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to parts of Cameroon due to the unpredictable security situation and threat of kidnapping and terrorism.', isNew: false },
    { country: 'Mozambique', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to Cabo Delgado Province due to terrorism and violent crime.', isNew: false },
    { country: 'Papua New Guinea', level: 3, levelText: 'Orange - Unsafe', summary: 'Reconsider your need to travel to Papua New Guinea due to high levels of serious crime and civil unrest.', isNew: false },

    // Level 2 - Exercise High Degree of Caution
    { country: 'Thailand', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Thailand overall due to the risk of civil unrest and the threat of terrorism.', isNew: false },
    { country: 'Indonesia', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Indonesia overall due to the threat of terrorism.', isNew: false },
    { country: 'Philippines', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in the Philippines due to the threat of terrorism and civil unrest.', isNew: false },
    { country: 'India', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in India overall due to the threat of terrorism and violent crime.', isNew: false },
    { country: 'Mexico', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Mexico overall due to high levels of violent crime and kidnapping.', isNew: false },
    { country: 'Brazil', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Brazil due to high levels of violent crime.', isNew: false },
    { country: 'South Africa', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in South Africa due to the threat of violent crime.', isNew: false },
    { country: 'Turkey', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Turkey overall due to the threat of terrorism.', isNew: false },
    { country: 'Israel', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Israel overall due to the volatile security situation and the threat of terrorism and rocket attacks.', isNew: false },
    { country: 'Morocco', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Morocco overall due to the threat of terrorism.', isNew: false },
    { country: 'Jordan', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Jordan overall due to the threat of terrorism.', isNew: false },
    { country: 'Saudi Arabia', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Saudi Arabia overall due to the threat of terrorism and missile and drone attacks.', isNew: false },
    { country: 'Bangladesh', level: 2, levelText: 'Yellow - Caution', summary: 'Exercise a high degree of caution in Bangladesh overall due to the threat of terrorism and the risk of civil unrest.', isNew: false },

    // Level 1 - Exercise Normal Safety Precautions
    { country: 'Japan', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Japan.', isNew: false },
    { country: 'Singapore', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Singapore.', isNew: false },
    { country: 'South Korea', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in South Korea.', isNew: false },
    { country: 'Vietnam', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Vietnam.', isNew: false },
    { country: 'United States', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in the United States.', isNew: false },
    { country: 'United Kingdom', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in the United Kingdom.', isNew: false },
    { country: 'France', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in France.', isNew: false },
    { country: 'Germany', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Germany.', isNew: false },
    { country: 'Italy', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Italy.', isNew: false },
    { country: 'Spain', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Spain.', isNew: false },
    { country: 'New Zealand', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in New Zealand.', isNew: false },
    { country: 'Canada', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Canada.', isNew: false },
    { country: 'Portugal', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Portugal.', isNew: false },
    { country: 'Greece', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Greece.', isNew: false },
    { country: 'Netherlands', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in the Netherlands.', isNew: false },
    { country: 'Switzerland', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Switzerland.', isNew: false },
    { country: 'Austria', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Austria.', isNew: false },
    { country: 'Norway', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Norway.', isNew: false },
    { country: 'Sweden', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Sweden.', isNew: false },
    { country: 'Denmark', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Denmark.', isNew: false },
    { country: 'Finland', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Finland.', isNew: false },
    { country: 'Iceland', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Iceland.', isNew: false },
    { country: 'Ireland', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Ireland.', isNew: false },
    { country: 'Belgium', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Belgium.', isNew: false },
    { country: 'United Arab Emirates', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in the United Arab Emirates.', isNew: false },
    { country: 'Qatar', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Qatar.', isNew: false },
    { country: 'Oman', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Oman.', isNew: false },
    { country: 'Kuwait', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Kuwait.', isNew: false },
    { country: 'Chile', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Chile.', isNew: false },
    { country: 'Argentina', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Argentina.', isNew: false },
    { country: 'Uruguay', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Uruguay.', isNew: false },
    { country: 'Costa Rica', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Costa Rica.', isNew: false },
    { country: 'Malaysia', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Malaysia.', isNew: false },
    { country: 'Taiwan', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Taiwan.', isNew: false },
    { country: 'Hong Kong', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Hong Kong.', isNew: false },
    { country: 'Fiji', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in Fiji.', isNew: false },
    { country: 'China', level: 1, levelText: 'Green - Safe', summary: 'Exercise normal safety precautions in China.', isNew: false }
  ];

  // Sort by risk level (highest first)
  advisories.sort((a, b) => b.level - a.level);

  res.status(200).json({
    success: true,
    lastUpdated: new Date().toISOString(),
    advisories: advisories
  });
};
