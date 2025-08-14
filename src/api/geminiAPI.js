import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEYS = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEYS}`;

export const getAIRecommendations = async (userQuery, productCatalog) => {
  try {
    const prompt = createPrompt(userQuery, productCatalog);
    
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if ( response.data && response.data.candidates && response.data.candidates[0]) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        return parseAIResponse(aiResponse, productCatalog);
    } else {
        throw new Error("Invalid API response structure.");
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    return getMockRecommendations(userQuery, productCatalog);
  }
};

const createPrompt = (userQuery, productCatalog) => {
  return `
You are an AI Product Advisor. A user has described their needs: "${userQuery}"

Here is the available product catalog:
${JSON.stringify(productCatalog, null, 2)}

Analyze the user's requirements and recommend the TOP 3 BEST MATCHING products from the catalog.

For each recommendation, provide:
1. Product ID
2. Match score (0.0 to 1.0) - how well it matches user needs
3. Detailed reasoning (2-3 sentences explaining WHY this product fits)

Format your response as JSON:
{
  "recommendations": [
    {
      "productId": 1,
      "matchScore": 0.95,
      "reasoning": "This product perfectly matches because..."
    }
  ]
}

Important:
- Only recommend products that actually exist in the catalog
- Consider price, features, specifications, and user requirements
- Provide honest match scores
- Give specific reasons for each recommendation
- Rank by relevance to user query
`;
};

const parseAIResponse = (aiResponse, productCatalog) => {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    const recommendations = parsed.recommendations.map(rec => {
      const product = productCatalog.find(p => p.id === rec.productId);
      return {
        product,
        matchScore: rec.matchScore || 0.8,
        reasoning: rec.reasoning || 'Good match for your requirements.'
      };
    }).filter(rec => rec.product); 

    return { recommendations };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return getMockRecommendations('', productCatalog);
  }
};

const getMockRecommendations = (userQuery, productCatalog) => {
  const query = userQuery.toLowerCase();
  let filteredProducts = [...productCatalog];

  if (query.includes('laptop') || query.includes('computer')) {
    filteredProducts = productCatalog.filter(p => p.category === 'laptop');
  } else if (query.includes('phone') || query.includes('smartphone')) {
    filteredProducts = productCatalog.filter(p => p.category === 'smartphone');
  } else if (query.includes('headphone') || query.includes('audio')) {
    filteredProducts = productCatalog.filter(p => p.category === 'headphones');
  } else if (query.includes('watch')) {
    filteredProducts = productCatalog.filter(p => p.category === 'smartwatch');
  }

  if (query.includes('budget') || query.includes('cheap') || query.includes('affordable')) {
    filteredProducts = filteredProducts.filter(p => p.price < 50000);
  } else if (query.includes('premium') || query.includes('high-end')) {
    filteredProducts = filteredProducts.filter(p => p.price > 80000);
  }

  if (query.includes('gaming') || query.includes('game')) {
    filteredProducts = filteredProducts.filter(p => 
      p.features.some(f => f.toLowerCase().includes('gaming')) ||
      p.name.toLowerCase().includes('gaming')
    );
  }

  if (query.includes('travel') || query.includes('portable') || query.includes('lightweight')) {
    filteredProducts = filteredProducts.filter(p => 
      p.features.some(f => f.toLowerCase().includes('lightweight')) ||
      p.features.some(f => f.toLowerCase().includes('portable'))
    );
  }

  const recommendations = filteredProducts.slice(0, 3).map((product, index) => ({
    product,
    matchScore: 0.9 - (index * 0.1),
    reasoning: generateMockReasoning(product, query)
  }));

  return { recommendations };
};

const generateMockReasoning = (product, query) => {
  const reasons = [];
  
  if (query.includes('budget') && product.price < 50000) {
    reasons.push('fits your budget requirements');
  }
  if (query.includes('gaming') && product.features.some(f => f.includes('gaming'))) {
    reasons.push('excellent for gaming performance');
  }
  if (query.includes('travel') && product.features.some(f => f.includes('lightweight'))) {
    reasons.push('lightweight and perfect for travel');
  }
  if (query.includes('battery') && product.specifications.batteryLife) {
    reasons.push(`offers ${product.specifications.batteryLife} battery life`);
  }

  if (reasons.length === 0) {
    reasons.push('matches your requirements well');
  }

  return `This ${product.category} ${reasons.join(' and ')}. ${product.description}`;
};