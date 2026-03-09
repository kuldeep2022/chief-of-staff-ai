import { Tool } from './types';

export const AVAILABLE_TOOLS: Tool[] = [
  {
    name: 'search_flights',
    description: 'Search for available flights between two cities on a given date',
    icon: '✈️',
    category: 'search',
    parameters: [
      { name: 'origin', type: 'string', description: 'Departure city or airport code', required: true },
      { name: 'destination', type: 'string', description: 'Arrival city or airport code', required: true },
      { name: 'date', type: 'string', description: 'Travel date (YYYY-MM-DD)', required: true },
      { name: 'max_price', type: 'number', description: 'Maximum price in USD', required: false },
    ],
  },
  {
    name: 'search_hotels',
    description: 'Search for hotel accommodations in a city',
    icon: '🏨',
    category: 'search',
    parameters: [
      { name: 'city', type: 'string', description: 'City name', required: true },
      { name: 'check_in', type: 'string', description: 'Check-in date', required: true },
      { name: 'check_out', type: 'string', description: 'Check-out date', required: true },
      { name: 'max_price', type: 'number', description: 'Max nightly rate', required: false },
    ],
  },
  {
    name: 'search_restaurants',
    description: 'Find restaurants in a specific area',
    icon: '🍽️',
    category: 'search',
    parameters: [
      { name: 'city', type: 'string', description: 'City name', required: true },
      { name: 'cuisine', type: 'string', description: 'Type of cuisine', required: false },
      { name: 'price_range', type: 'string', description: 'Budget tier: $, $$, $$$', required: false },
    ],
  },
  {
    name: 'search_activities',
    description: 'Find activities, attractions, and things to do',
    icon: '🎭',
    category: 'search',
    parameters: [
      { name: 'city', type: 'string', description: 'City name', required: true },
      { name: 'category', type: 'string', description: 'Activity type: museum, outdoor, food, nightlife', required: false },
    ],
  },
  {
    name: 'calculate_budget',
    description: 'Calculate total trip budget from cost items',
    icon: '💰',
    category: 'compute',
    parameters: [
      { name: 'items', type: 'string', description: 'JSON array of {name, cost} items', required: true },
      { name: 'budget_limit', type: 'number', description: 'Maximum budget', required: false },
    ],
  },
  {
    name: 'get_weather',
    description: 'Get weather forecast for a city on given dates',
    icon: '🌤️',
    category: 'data',
    parameters: [
      { name: 'city', type: 'string', description: 'City name', required: true },
      { name: 'date', type: 'string', description: 'Date for forecast', required: true },
    ],
  },
  {
    name: 'create_itinerary',
    description: 'Generate a structured day-by-day travel itinerary',
    icon: '📋',
    category: 'compute',
    parameters: [
      { name: 'destination', type: 'string', description: 'Destination city', required: true },
      { name: 'days', type: 'number', description: 'Number of days', required: true },
      { name: 'activities', type: 'string', description: 'Selected activities JSON', required: true },
      { name: 'restaurants', type: 'string', description: 'Selected restaurants JSON', required: false },
    ],
  },
  {
    name: 'create_calendar_event',
    description: 'Create a calendar event for the trip',
    icon: '📅',
    category: 'calendar',
    parameters: [
      { name: 'title', type: 'string', description: 'Event title', required: true },
      { name: 'start_date', type: 'string', description: 'Start date', required: true },
      { name: 'end_date', type: 'string', description: 'End date', required: true },
      { name: 'description', type: 'string', description: 'Event details', required: false },
    ],
  },
  {
    name: 'web_search',
    description: 'Search the web for any information',
    icon: '🔍',
    category: 'search',
    parameters: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      { name: 'num_results', type: 'number', description: 'Number of results', required: false },
    ],
  },
  {
    name: 'summarize_data',
    description: 'Summarize collected data into a concise report',
    icon: '📊',
    category: 'compute',
    parameters: [
      { name: 'data', type: 'string', description: 'Data to summarize', required: true },
      { name: 'format', type: 'string', description: 'Output format: brief, detailed, table', required: false },
    ],
  },
];

export function getToolByName(name: string): Tool | undefined {
  return AVAILABLE_TOOLS.find(t => t.name === name);
}
