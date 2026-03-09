// Simulated tool execution engine — returns realistic mock data
// In production, these would call real APIs (Google Flights, Booking.com, etc.)

import { delay } from './utils';

type ToolInput = Record<string, unknown>;

const executors: Record<string, (input: ToolInput) => Promise<string>> = {
  search_flights: async (input) => {
    await delay(800 + Math.random() * 600);
    const origin = input.origin as string;
    const dest = input.destination as string;
    const date = input.date as string;
    const maxPrice = (input.max_price as number) || 500;

    const airlines = ['Delta', 'United', 'JetBlue', 'American', 'Southwest', 'Spirit'];
    const flights = Array.from({ length: 4 }, (_, i) => {
      const price = Math.round(80 + Math.random() * (maxPrice - 80));
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const depHour = 6 + Math.floor(Math.random() * 14);
      const duration = 2 + Math.floor(Math.random() * 4);
      return {
        airline,
        flight: `${airline.substring(0, 2).toUpperCase()}${100 + i * 37}`,
        departure: `${depHour}:${Math.random() > 0.5 ? '00' : '30'}`,
        arrival: `${depHour + duration}:${Math.random() > 0.5 ? '15' : '45'}`,
        duration: `${duration}h ${Math.floor(Math.random() * 50)}m`,
        price,
        stops: Math.random() > 0.6 ? 1 : 0,
      };
    }).sort((a, b) => a.price - b.price);

    return JSON.stringify({
      route: `${origin} → ${dest}`,
      date,
      results: flights,
      cheapest: flights[0],
      note: `Found ${flights.length} flights. Cheapest: $${flights[0].price} on ${flights[0].airline}`,
    }, null, 2);
  },

  search_hotels: async (input) => {
    await delay(900 + Math.random() * 500);
    const city = input.city as string;
    const maxPrice = (input.max_price as number) || 300;

    const hotelNames = [
      `The ${city} Grand`, `${city} Boutique Inn`, `Skyline Hotel ${city}`,
      `${city} Comfort Suites`, `The Metropolitan ${city}`, `Harbor View Hotel`,
    ];

    const hotels = Array.from({ length: 4 }, (_, i) => {
      const price = Math.round(80 + Math.random() * (maxPrice - 80));
      const rating = +(3.5 + Math.random() * 1.5).toFixed(1);
      return {
        name: hotelNames[i],
        price_per_night: price,
        rating,
        reviews: Math.round(200 + Math.random() * 2000),
        amenities: ['WiFi', 'AC', i % 2 === 0 ? 'Pool' : 'Gym', i % 3 === 0 ? 'Breakfast' : 'Bar'],
        distance_to_center: `${(0.5 + Math.random() * 3).toFixed(1)} mi`,
      };
    }).sort((a, b) => a.price_per_night - b.price_per_night);

    return JSON.stringify({
      city,
      check_in: input.check_in,
      check_out: input.check_out,
      results: hotels,
      best_value: hotels[0],
      note: `Found ${hotels.length} hotels. Best value: ${hotels[0].name} at $${hotels[0].price_per_night}/night (${hotels[0].rating}★)`,
    }, null, 2);
  },

  search_restaurants: async (input) => {
    await delay(600 + Math.random() * 400);
    const city = input.city as string;
    const types = ['Italian', 'Japanese', 'Mexican', 'French', 'American', 'Thai', 'Indian'];
    const names = [
      'Osteria Roma', 'Sakura Garden', 'Casa del Sol', 'Le Petit Bistro',
      'The Grill House', 'Spice Market', 'Naan & Curry',
    ];

    const restaurants = Array.from({ length: 5 }, (_, i) => ({
      name: names[i],
      cuisine: types[i],
      rating: +(4.0 + Math.random() * 0.9).toFixed(1),
      price_range: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
      avg_cost: Math.round(15 + Math.random() * 50),
      neighborhood: ['Downtown', 'Midtown', 'SoHo', 'Upper West Side', 'Chelsea'][i],
    }));

    return JSON.stringify({ city, restaurants, note: `Top ${restaurants.length} restaurants in ${city}` }, null, 2);
  },

  search_activities: async (input) => {
    await delay(700 + Math.random() * 400);
    const city = input.city as string;
    const activities = [
      { name: `${city} Museum of Art`, type: 'museum', cost: 25, duration: '3h', rating: 4.7 },
      { name: `${city} Walking Tour`, type: 'outdoor', cost: 0, duration: '2h', rating: 4.5 },
      { name: 'Rooftop Bar Crawl', type: 'nightlife', cost: 50, duration: '4h', rating: 4.3 },
      { name: `${city} Food Market`, type: 'food', cost: 15, duration: '2h', rating: 4.8 },
      { name: 'Broadway Show', type: 'entertainment', cost: 120, duration: '2.5h', rating: 4.9 },
      { name: `${city} River Cruise`, type: 'outdoor', cost: 35, duration: '1.5h', rating: 4.4 },
      { name: 'Observation Deck Visit', type: 'attraction', cost: 40, duration: '1h', rating: 4.6 },
    ];
    return JSON.stringify({ city, activities, note: `Found ${activities.length} popular activities in ${city}` }, null, 2);
  },

  calculate_budget: async (input) => {
    await delay(300);
    let items: Array<{ name: string; cost: number }>;
    try {
      items = typeof input.items === 'string' ? JSON.parse(input.items) : (input.items as Array<{ name: string; cost: number }>);
    } catch {
      items = [{ name: 'Estimated total', cost: 0 }];
    }
    const total = items.reduce((sum, item) => sum + item.cost, 0);
    const limit = input.budget_limit as number | undefined;
    const withinBudget = limit ? total <= limit : true;

    return JSON.stringify({
      breakdown: items,
      total,
      budget_limit: limit || 'none',
      within_budget: withinBudget,
      remaining: limit ? limit - total : null,
      note: withinBudget
        ? `Total: $${total}${limit ? ` — $${limit - total} under budget` : ''}`
        : `Total: $${total} — $${total - (limit || 0)} OVER budget. Consider cheaper options.`,
    }, null, 2);
  },

  get_weather: async (input) => {
    await delay(400);
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const high = Math.round(55 + Math.random() * 30);
    const low = high - Math.round(8 + Math.random() * 12);

    return JSON.stringify({
      city: input.city,
      date: input.date,
      condition,
      high_f: high,
      low_f: low,
      humidity: Math.round(30 + Math.random() * 40) + '%',
      precipitation_chance: Math.round(Math.random() * 40) + '%',
      note: `${condition}, ${high}°F / ${low}°F`,
    }, null, 2);
  },

  create_itinerary: async (input) => {
    await delay(600);
    const dest = input.destination as string;
    const days = (input.days as number) || 2;

    const itinerary = Array.from({ length: days }, (_, d) => ({
      day: d + 1,
      title: d === 0 ? `Arrival & Explore ${dest}` : d === days - 1 ? 'Final Day & Departure' : `Full Day in ${dest}`,
      morning: d === 0 ? 'Check into hotel, freshen up' : 'Breakfast at local café',
      afternoon: ['Visit museums and galleries', 'Walking tour of downtown', 'Food market exploration'][d % 3],
      evening: ['Dinner at top-rated restaurant', 'Rooftop bar with city views', 'Broadway show or live music'][d % 3],
    }));

    return JSON.stringify({
      destination: dest,
      days,
      itinerary,
      note: `${days}-day itinerary for ${dest} created successfully`,
    }, null, 2);
  },

  create_calendar_event: async (input) => {
    await delay(300);
    return JSON.stringify({
      status: 'created',
      event: {
        title: input.title,
        start: input.start_date,
        end: input.end_date,
        description: input.description || 'Trip created by Chief-of-Staff AI',
      },
      calendar_link: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(input.title as string)}`,
      note: `Calendar event "${input.title}" created for ${input.start_date} — ${input.end_date}`,
    }, null, 2);
  },

  web_search: async (input) => {
    await delay(700 + Math.random() * 300);
    const query = input.query as string;
    const results = [
      { title: `Top Guide: ${query}`, url: 'https://example.com/guide', snippet: `Comprehensive guide about ${query}. Everything you need to know for planning and research.` },
      { title: `${query} — Tips & Reviews`, url: 'https://example.com/reviews', snippet: `Expert reviews and insider tips related to ${query}. Updated for 2025.` },
      { title: `Budget ${query} Guide`, url: 'https://example.com/budget', snippet: `How to save money on ${query}. Budget-friendly recommendations and deals.` },
    ];
    return JSON.stringify({ query, results, note: `Found ${results.length} results for "${query}"` }, null, 2);
  },

  summarize_data: async (input) => {
    await delay(500);
    return JSON.stringify({
      summary: `Summary generated from provided data. Key highlights extracted and organized for quick review.`,
      format: input.format || 'brief',
      note: 'Data summarized successfully',
    }, null, 2);
  },
};

export async function executeTool(name: string, input: ToolInput): Promise<string> {
  const executor = executors[name];
  if (!executor) {
    return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
  return executor(input);
}
