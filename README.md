# Nurture Her
A simple, beautiful web app that recommends recipes based on the four phases of the menstrual cycle.

## Setup

1. Get a free API key at [spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Open `script.js` and replace `YOUR_SPOONACULAR_API_KEY` with your key
3. Open `index.html` in a browser — no build step needed

## Files

```
index.html   Markup
style.css    Styles (imports Google Fonts)
script.js    Logic and API calls
```

## How it works

Select your current cycle phase. The app maps each phase to specific nutrient targets and queries the Spoonacular `complexSearch` endpoint with relevant ingredients and keywords.

| Phase | Days | Nutrient Focus |
|-------|------|----------------|
| Menstrual | 1 – 5 | Iron & Vitamin C |
| Follicular | 6 – 13 | Probiotics & Healthy Fats |
| Ovulatory | 14 – 17 | Fibre & Anti-Inflammatory |
| Luteal | 18 – 28 | Magnesium & Complex Carbs |

Optionally filter results by dietary preference: Vegan, Vegetarian, Paleo, or Gluten-Free.

## API

Uses the [Spoonacular](https://spoonacular.com/food-api) `complexSearch` endpoint. The free tier allows 150 points/day (roughly 50–75 searches).