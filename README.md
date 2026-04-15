# HW4_Wentao_Mou
## Design Option
Scrollytelling Narrative Visualization

## Goal / Narrative
This project argues that presidential elections are not explained very well by a single national number. The story starts with the national two-party vote from 1976 to 2020, then narrows to the closest battleground states in 2020, then compares each state's 2008 and 2020 margins to show which places realigned, and finishes with a treemap of the regional coalitions that made up the 2020 winning map. The text and chart transitions are meant to move the viewer from a broad national overview to the smaller set of geographic shifts that actually decided the result.

## Key Features
- Scroll-driven narrative using `scrollama`
- Sticky visualization panel that updates as the reader moves down or back up the page
- Fade/transition changes between all four visualization states
- Hover tooltips on chart marks
- Four chart views:
  - national vote share line chart
  - closest-state 2020 lollipop chart
  - 2008 vs 2020 state realignment scatterplot
  - 2020 coalition treemap

## Libraries / Frameworks Used
- D3 v7
- Scrollama
- Plain HTML, CSS, and JavaScript

## Data
- `data/1976-2020-president.csv`

## How To Run
### Option 1
https://wentao-mu.github.io/HW4_Wentao_Mou/
### Option 2
```bash
cd HW4_Wentao_Mou
python3 -m http.server 8000
```
Then open `http://localhost:8000`.
