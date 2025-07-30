# 🃏 Poker Analyst - Win Percentage Calculator

A sophisticated poker win percentage calculator with opponent behavior analysis. Calculate your chances of winning based on your hand, community cards, and opponent playing styles.

## Features

### 🎯 Core Functionality
- **Hand Input**: Select your hole cards from an intuitive card selector
- **Community Cards**: Input flop, turn, and river cards as they're revealed
- **Win Percentage**: Monte Carlo simulation with 5,000+ iterations for accurate odds
- **Real-time Calculation**: Instant updates as you modify cards or opponents

### 🎭 Opponent Behavior Analysis
Choose from 10 different poker player archetypes:

1. **Tight-Aggressive (TAG)** - Plays few hands but plays them aggressively
2. **Loose-Aggressive (LAG)** - Plays many hands with high aggression
3. **Tight-Passive (Nit)** - Very selective, rarely aggressive
4. **Loose-Passive (Fish)** - Plays too many hands, calls frequently
5. **Maniac** - Extremely aggressive, plays almost any hand
6. **Nit** - Ultra-tight player, only plays premium hands
7. **Calling Station** - Calls frequently, rarely folds or raises
8. **Rock** - Extremely tight and predictable
9. **Slow Roller** - Takes time with decisions, moderate aggression
10. **Chatty/Distracted** - Unfocused player with suboptimal play

### 📊 Smart Analysis
- **Hand Strength Evaluation**: Comprehensive poker hand ranking system
- **Behavioral Adjustments**: Win percentages adjusted based on opponent tendencies
- **Game Stage Awareness**: Different calculations for preflop, flop, turn, and river
- **Visual Feedback**: Color-coded percentages and hand strength indicators

## How to Use

### 1. Setup Your Hand
- Click on your hole card slots to open the card selector
- Choose your two cards from the complete deck
- Cards are color-coded (red for hearts/diamonds, black for spades/clubs)

### 2. Add Community Cards (Optional)
- Add flop cards (first 3 community cards)
- Add turn card (4th community card)
- Add river card (5th community card)
- You can calculate odds at any stage (preflop through river)

### 3. Configure Opponents
- Click "Add Opponent" to add players to the analysis
- Select each opponent's playing style from the dropdown
- Remove opponents by clicking the "Remove" button
- The calculator works with 0-9 opponents

### 4. Calculate Odds
- Click "Calculate Odds" to run the simulation
- Results show win percentage and hand strength
- Percentage is color-coded:
  - 🟢 Green (70%+): Very strong
  - 🟡 Yellow (50-69%): Good
  - 🟠 Orange (30-49%): Marginal  
  - 🔴 Red (<30%): Weak

## Technical Details

### Poker Logic
- **Hand Evaluation**: Supports all poker hands from high card to royal flush
- **Monte Carlo Simulation**: Runs thousands of random scenarios
- **Combinatorial Analysis**: Considers all possible opponent hole cards
- **Tie Handling**: Properly accounts for split pots

### Behavioral Modeling
Each opponent type has statistical profiles including:
- **VPIP** (Voluntarily Put In Pot): Percentage of hands played
- **PFR** (Pre-Flop Raise): Aggression frequency
- **Aggression Factor**: Overall aggression level
- **Bluff Frequency**: How often they bluff

### Calculations
- Base win percentage calculated through Monte Carlo simulation
- Behavioral adjustments applied based on opponent profiles
- Game stage modifiers (preflop adjustments are strongest)
- Results rounded to one decimal place for clarity

## Browser Compatibility

Works in all modern browsers:
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Installation

Simply open `index.html` in your web browser. No server or installation required!

## Usage Tips

### For Accurate Results:
1. **Add Real Opponents**: The more opponents you add with accurate behavior types, the more precise your odds
2. **Update as Game Progresses**: Recalculate after each community card for updated odds
3. **Consider Position**: While not directly modeled, factor in your table position when interpreting results
4. **Use Behavioral Profiles**: Take time to accurately assess opponent types for better predictions

### Strategic Applications:
- **Preflop Decisions**: Determine if your hand is strong enough to play
- **Betting Sizing**: Use win percentage to guide bet sizes
- **Fold Equity**: Consider opponent types when bluffing
- **Tournament Play**: Adjust strategy based on calculated odds

## Advanced Features

### Keyboard Shortcuts
- **Escape**: Close card selector modal
- **Click & Drag**: Future feature for easier card selection

### Mobile Responsive
- Fully responsive design works on phones and tablets
- Touch-friendly interface for mobile poker analysis

## Contributing

This is an open-source poker calculator. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the behavioral modeling
- Add new opponent archetypes

## Disclaimer

This tool is for educational and entertainment purposes. Poker involves skill and luck, and no calculator can guarantee results. Always gamble responsibly.

---

**Made with ❤️ for poker enthusiasts**

*Calculate smart. Play smarter.* 