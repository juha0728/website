# Vitality

A personal health and wellness web app prototype. People enter their habits and goals, get educational suggestions on diet, exercise and medication basics, and save what is useful to their profile.

> **Educational only.** Vitality provides general health and wellness information. It is not a substitute for professional medical advice, diagnosis, or treatment. It never diagnoses a condition and never tells anyone to start, stop, or change a medication.

## Features

- Landing page, login and sign-up, and a guest mode that opens with sample data
- Dashboard with a daily check-in card, profile completion ring, 7-day water chart, recent activity, saved resources and search
- Daily check-in for mood, sleep, water and activity
- Health profile form with nine inputs (six required, three optional: allergies, conditions, medications)
- Three recommendation categories: Diet and Nutrition, Exercise and Activity, Medication Information
- 24 written recommendations (8 per category), matched to the saved profile by tags, with Learn more, Save to Profile, and Refine / Try again
- Medication concern flow that shows general safety information and points to a pharmacist or prescriber
- Saved Resources, History, My Profile and Settings pages
- Loading, empty, error and success states throughout

## How recommendations are chosen

Each recommendation carries tags (goals, activity level, sleep and eating habits). The saved profile produces a set of tags, and items that match more tags rank higher. "Refine search" changes the goal tags and runs the match again. There is no AI model involved at run time.

## Tech

- React 18
- Tailwind CSS utility classes
- lucide-react icons
- Manrope and Inter from Google Fonts
- Browser storage through `window.storage`

The whole app is one file, `app.jsx`, with a default export `App`.

## Running it

`app.jsx` was built to run as a Claude artifact, where `window.storage` already exists. To run it in your own React project with Tailwind and `lucide-react` installed, add this before rendering `App`:

```js
window.storage = {
  get: async (key) => ({ key, value: localStorage.getItem(key) }),
  set: async (key, value) => { localStorage.setItem(key, value); return { key, value }; },
};
```

## Known limits

- Sign-in is a prototype. Passwords are stored in plain text in the browser, so a real backend with hashed passwords is needed before real use.
- The recommendation text is written for demonstration and should be reviewed by a qualified health professional before anyone relies on it.
- It has not been tested with real users.

## Roadmap

- Guided flows for the three main buttons: ingredient-based diet menus with photos and recipes, location-based exercise routines with sets and rest times, and a medication information flow by body area with side effects highlighted
- Statistics page with trend charts and filters

## Credits

Designed by Nicole Lee, Jericho Senior High School, Class of 2027, June to October 2026. The code was written and revised in conversation with Claude, an AI assistant from Anthropic.
