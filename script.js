// Main Application Controller
class PokerApp {
    constructor() {
        this.pokerLogic = new PokerLogic();
        this.selectedCards = {
            player: [null, null],
            community: [null, null, null, null, null] // flop, flop, flop, turn, river
        };
        this.opponents = [];
        this.currentCardSlot = null;
        this.usedCards = new Set();
        
        this.behaviorOptions = [
            { value: 'tight-aggressive', label: 'Tight-Aggressive (TAG)' },
            { value: 'loose-aggressive', label: 'Loose-Aggressive (LAG)' },
            { value: 'tight-passive', label: 'Tight-Passive (Nit)' },
            { value: 'loose-passive', label: 'Loose-Passive (Fish)' },
            { value: 'maniac', label: 'Maniac (Super Aggressive)' },
            { value: 'nit', label: 'Nit (Ultra Tight)' },
            { value: 'calling-station', label: 'Calling Station' },
            { value: 'rock', label: 'Rock (Extremely Tight)' },
            { value: 'slow-roller', label: 'Slow Roller' },
            { value: 'chatty-distracted', label: 'Chatty/Distracted Player' }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateCardSelector();
        this.updateUI();
    }

    setupEventListeners() {
        // Card slot clicks
        document.querySelectorAll('.card-slot').forEach(slot => {
            slot.addEventListener('click', (e) => this.handleCardSlotClick(e));
        });

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('card-selector-modal').addEventListener('click', (e) => {
            if (e.target.id === 'card-selector-modal') this.closeModal();
        });

        // Opponent management
        document.getElementById('add-opponent').addEventListener('click', () => this.addOpponent());

        // Calculate button
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculateOdds());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    generateCardSelector() {
        const modal = document.getElementById('card-selector-modal');
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        const suitSymbols = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
        const suitColors = { spades: 'black', hearts: 'red', diamonds: 'red', clubs: 'black' };

        suits.forEach(suit => {
            const grid = modal.querySelector(`[data-suit="${suit}"]`);
            grid.innerHTML = '';

            this.pokerLogic.ranks.forEach(rank => {
                const cardSlot = document.createElement('div');
                cardSlot.className = 'card-slot';
                cardSlot.dataset.rank = rank;
                cardSlot.dataset.suit = suit;
                
                const cardDisplay = document.createElement('div');
                cardDisplay.className = 'card-display';
                
                const rankSpan = document.createElement('div');
                rankSpan.className = 'card-rank';
                rankSpan.textContent = rank;
                
                const suitSpan = document.createElement('div');
                suitSpan.className = `card-suit ${suitColors[suit]}`;
                suitSpan.textContent = suitSymbols[suit];
                
                cardDisplay.appendChild(rankSpan);
                cardDisplay.appendChild(suitSpan);
                cardSlot.appendChild(cardDisplay);
                
                cardSlot.addEventListener('click', () => this.selectCard(rank, suit));
                grid.appendChild(cardSlot);
            });
        });
    }

    handleCardSlotClick(e) {
        const slot = e.currentTarget;
        if (slot.classList.contains('selected')) {
            this.clearCardSlot(slot);
        } else {
            this.currentCardSlot = slot;
            this.openModal();
        }
    }

    openModal() {
        const modal = document.getElementById('card-selector-modal');
        modal.classList.add('show');
        this.updateCardAvailability();
    }

    closeModal() {
        const modal = document.getElementById('card-selector-modal');
        modal.classList.remove('show');
        this.currentCardSlot = null;
    }

    updateCardAvailability() {
        const modal = document.getElementById('card-selector-modal');
        const cardSlots = modal.querySelectorAll('.card-slot');
        
        cardSlots.forEach(slot => {
            const rank = slot.dataset.rank;
            const suit = slot.dataset.suit;
            const cardKey = `${rank}-${suit}`;
            
            if (this.usedCards.has(cardKey)) {
                slot.classList.add('disabled');
            } else {
                slot.classList.remove('disabled');
            }
        });
    }

    selectCard(rank, suit) {
        const cardKey = `${rank}-${suit}`;
        if (this.usedCards.has(cardKey) || !this.currentCardSlot) return;

        const card = this.pokerLogic.createCard(rank, suit);
        this.setCardToSlot(this.currentCardSlot, card);
        this.closeModal();
        this.updateUI();
    }

    setCardToSlot(slot, card) {
        const cardKey = `${card.rank}-${card.suit}`;
        
        // Remove old card if exists
        const oldCardKey = slot.dataset.cardKey;
        if (oldCardKey) {
            this.usedCards.delete(oldCardKey);
        }

        // Add new card
        this.usedCards.add(cardKey);
        slot.dataset.cardKey = cardKey;
        slot.classList.add('selected');

        // Update visual display
        const suitSymbols = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
        const suitColors = { spades: 'black', hearts: 'red', diamonds: 'red', clubs: 'black' };
        
        slot.innerHTML = `
            <div class="card-display">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit ${suitColors[card.suit]}">${suitSymbols[card.suit]}</div>
            </div>
        `;

        // Update selected cards array
        this.updateSelectedCardsArray(slot, card);
    }

    updateSelectedCardsArray(slot, card) {
        const slotId = slot.id;
        
        if (slotId === 'player-card-1') {
            this.selectedCards.player[0] = card;
        } else if (slotId === 'player-card-2') {
            this.selectedCards.player[1] = card;
        } else if (slotId === 'flop-1') {
            this.selectedCards.community[0] = card;
        } else if (slotId === 'flop-2') {
            this.selectedCards.community[1] = card;
        } else if (slotId === 'flop-3') {
            this.selectedCards.community[2] = card;
        } else if (slotId === 'turn') {
            this.selectedCards.community[3] = card;
        } else if (slotId === 'river') {
            this.selectedCards.community[4] = card;
        }
    }

    clearCardSlot(slot) {
        const oldCardKey = slot.dataset.cardKey;
        if (oldCardKey) {
            this.usedCards.delete(oldCardKey);
        }

        slot.classList.remove('selected');
        slot.dataset.cardKey = '';
        
        const slotId = slot.id;
        if (slotId.includes('player-card')) {
            slot.innerHTML = '<span class="card-placeholder">Click to select</span>';
            const index = slotId === 'player-card-1' ? 0 : 1;
            this.selectedCards.player[index] = null;
        } else {
            slot.innerHTML = '<span class="card-placeholder">?</span>';
            
            if (slotId === 'flop-1') this.selectedCards.community[0] = null;
            else if (slotId === 'flop-2') this.selectedCards.community[1] = null;
            else if (slotId === 'flop-3') this.selectedCards.community[2] = null;
            else if (slotId === 'turn') this.selectedCards.community[3] = null;
            else if (slotId === 'river') this.selectedCards.community[4] = null;
        }

        this.updateUI();
    }

    addOpponent() {
        const opponentId = Date.now().toString();
        const opponent = {
            id: opponentId,
            name: `Opponent ${this.opponents.length + 1}`,
            behavior: 'tight-aggressive'
        };

        this.opponents.push(opponent);
        this.renderOpponents();
        this.updateUI();
    }

    removeOpponent(opponentId) {
        this.opponents = this.opponents.filter(opp => opp.id !== opponentId);
        this.renderOpponents();
        this.updateUI();
    }

    updateOpponentBehavior(opponentId, behavior) {
        const opponent = this.opponents.find(opp => opp.id === opponentId);
        if (opponent) {
            opponent.behavior = behavior;
            this.updateUI();
        }
    }

    renderOpponents() {
        const container = document.getElementById('opponents-list');
        container.innerHTML = '';

        this.opponents.forEach(opponent => {
            const opponentDiv = document.createElement('div');
            opponentDiv.className = 'opponent-item';
            
            opponentDiv.innerHTML = `
                <div class="opponent-info">
                    <div class="opponent-name">${opponent.name}</div>
                    <div class="opponent-behavior">${this.getBehaviorLabel(opponent.behavior)}</div>
                </div>
                <select class="behavior-select" data-opponent-id="${opponent.id}">
                    ${this.behaviorOptions.map(option => 
                        `<option value="${option.value}" ${option.value === opponent.behavior ? 'selected' : ''}>
                            ${option.label}
                        </option>`
                    ).join('')}
                </select>
                <button class="remove-opponent" data-opponent-id="${opponent.id}">Remove</button>
            `;

            // Add event listeners
            const select = opponentDiv.querySelector('.behavior-select');
            select.addEventListener('change', (e) => {
                this.updateOpponentBehavior(opponent.id, e.target.value);
            });

            const removeBtn = opponentDiv.querySelector('.remove-opponent');
            removeBtn.addEventListener('click', () => {
                this.removeOpponent(opponent.id);
            });

            container.appendChild(opponentDiv);
        });

        document.getElementById('opponent-count').textContent = this.opponents.length;
    }

    getBehaviorLabel(behavior) {
        const option = this.behaviorOptions.find(opt => opt.value === behavior);
        return option ? option.label : behavior;
    }

    updateUI() {
        this.updateCalculateButton();
        this.updateHandDescription();
    }

    updateCalculateButton() {
        const btn = document.getElementById('calculate-btn');
        const hasPlayerCards = this.selectedCards.player[0] && this.selectedCards.player[1];
        
        btn.disabled = !hasPlayerCards;
        btn.textContent = hasPlayerCards ? 'Calculate Odds' : 'Select Your Cards First';
    }

    updateHandDescription() {
        const description = document.getElementById('hand-description');
        const player = this.selectedCards.player;
        
        if (player[0] && player[1]) {
            const strength = this.pokerLogic.getPreflopStrength(player[0], player[1]);
            description.textContent = strength;
        } else {
            description.textContent = 'Select your cards to begin';
        }
    }

    async calculateOdds() {
        const btn = document.getElementById('calculate-btn');
        const percentageEl = document.getElementById('win-percentage');
        const handStrengthEl = document.getElementById('hand-description');

        // Validate input
        if (!this.selectedCards.player[0] || !this.selectedCards.player[1]) {
            return;
        }

        // Show loading state with premium effects
        btn.disabled = true;
        btn.textContent = 'Calculating...';
        btn.classList.add('calculating');
        percentageEl.textContent = '--';
        handStrengthEl.textContent = 'Running advanced simulation...';
        
        // Add calculating effect to results section
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) resultsSection.classList.add('calculating');

        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const playerHand = this.selectedCards.player.filter(card => card !== null);
            const communityCards = this.selectedCards.community.filter(card => card !== null);
            
            // Determine game stage
            let gameStage = 'preflop';
            if (communityCards.length >= 3) gameStage = 'flop';
            if (communityCards.length >= 4) gameStage = 'turn';
            if (communityCards.length === 5) gameStage = 'river';

            // Use advanced calculation with enhanced options
            const analysisOptions = {
                iterations: this.opponents.length > 0 ? 10000 : 7500,
                includeDraws: true,
                calculateVariance: true,
                confidenceInterval: true,
                position: 'middle', // Could be made configurable
                stackDepth: 100     // Could be made configurable
            };

            let results;
            
            // Add validation before advanced calculation
            if (!playerHand || playerHand.length !== 2) {
                throw new Error('Invalid player hand for calculation');
            }
            
            // Try advanced calculation with fallback
            try {
                if (this.opponents.length === 0) {
                    // No opponents specified, assume 1 random tight-aggressive opponent
                    results = this.pokerLogic.calculateAdvancedWinPercentage(
                        playerHand, 
                        communityCards, 
                        [{ behavior: 'tight-aggressive' }],
                        analysisOptions
                    );
                } else {
                    results = this.pokerLogic.calculateAdvancedWinPercentage(
                        playerHand, 
                        communityCards, 
                        this.opponents,
                        analysisOptions
                    );
                }
                
                // Validate results
                if (!results || typeof results.winPercentage === 'undefined') {
                    throw new Error('Advanced calculation returned invalid results');
                }
                
            } catch (advancedError) {
                console.warn('Advanced calculation failed, using basic method:', advancedError);
                
                // Fallback to basic calculation immediately
                const basicWinPercentage = this.pokerLogic.calculateWinPercentage(
                    playerHand, 
                    communityCards, 
                    this.opponents.length > 0 ? this.opponents : [{ behavior: 'tight-aggressive' }],
                    5000
                );
                
                results = {
                    winPercentage: basicWinPercentage,
                    adjustedWinPercentage: basicWinPercentage,
                    confidence: 0.75,
                    iterations: 5000,
                    isBasicCalculation: true
                };
            }

            // Display the main win percentage with safety checks
            const finalPercentage = results.adjustedWinPercentage || results.winPercentage || 0;
            if (isNaN(finalPercentage) || finalPercentage < 0 || finalPercentage > 100) {
                throw new Error(`Invalid win percentage: ${finalPercentage}`);
            }
            percentageEl.textContent = finalPercentage.toFixed(1);

            // Enhanced hand strength description with confidence
            const handStrength = this.pokerLogic.getHandStrength(finalPercentage);
            const recommendation = this.getActionRecommendation(finalPercentage, this.opponents.length);
            let currentHand = 'Unknown Hand';
            
            if (communityCards.length >= 3) {
                const allCards = [...playerHand, ...communityCards];
                const bestHand = this.pokerLogic.getBestHand(allCards);
                currentHand = bestHand.description;
            } else {
                currentHand = this.pokerLogic.getPreflopStrength(playerHand[0], playerHand[1]);
            }
            
            // Add statistical information
            let confidenceText = '';
            if (results.confidence) {
                const confidencePercent = Math.round(results.confidence * 100);
                confidenceText = ` (${confidencePercent}% confidence)`;
            }

            // Add variance information for high-stakes decisions
            let varianceText = '';
            if (results.standardDeviation && results.standardDeviation > 0) {
                varianceText = ` | Volatility: ${results.standardDeviation.toFixed(1)}%`;
            }

            // Add confidence interval if available
            let intervalText = '';
            if (results.confidenceInterval) {
                const lower = (results.confidenceInterval.lower * 100).toFixed(1);
                const upper = (results.confidenceInterval.upper * 100).toFixed(1);
                intervalText = ` | 95% CI: ${lower}%-${upper}%`;
            }

            handStrengthEl.textContent = `${currentHand} (${handStrength})${confidenceText}${varianceText}${intervalText}`;

            // Display recommendation in dedicated box
            this.displayRecommendation(recommendation, finalPercentage, this.opponents.length);

            // Enhanced color coding using recommendation colors
            const confidence = results.confidence || 0.8;
            let color = recommendation.color;
            
            // Adjust color based on confidence
            if (confidence < 0.8) {
                // Make colors slightly darker when less confident
                const colorMap = {
                    '#10b981': '#059669', '#22c55e': '#16a34a', 
                    '#f59e0b': '#d97706', '#f97316': '#ea580c', 
                    '#ef4444': '#dc2626'
                };
                color = colorMap[color] || color;
            }
            
            percentageEl.style.color = color;

            // Show detailed analysis in console for advanced users
            if (window.location.hash === '#debug') {
                console.log('🃏 Advanced Poker Analysis Results:', {
                    baseWinPercentage: results.winPercentage?.toFixed(2) + '%',
                    adjustedWinPercentage: finalPercentage.toFixed(2) + '%',
                    confidence: `${Math.round((results.confidence || 0) * 100)}%`,
                    iterations: results.iterations,
                    variance: results.variance?.toFixed(2),
                    standardDeviation: results.standardDeviation?.toFixed(2) + '%',
                    confidenceInterval: results.confidenceInterval ? 
                        `${(results.confidenceInterval.lower * 100).toFixed(1)}% - ${(results.confidenceInterval.upper * 100).toFixed(1)}%` : 
                        'N/A',
                    adjustmentBreakdown: results.adjustments,
                    gameStage: gameStage,
                    opponentCount: this.opponents.length
                });

                if (results.drawAnalysis) {
                    console.log('🎯 Draw Analysis:', results.drawAnalysis);
                }
            }

            // Add tooltip with advanced statistics (if supported)
            if (results.confidenceInterval && results.adjustments) {
                const tooltip = `Advanced Analysis:
• Base Win Rate: ${results.winPercentage?.toFixed(1)}%
• Behavioral Adj: ${results.adjustments.behavioralAdjustment?.toFixed(1)}%
• Positional Adj: ${results.adjustments.positionalAdjustment?.toFixed(1)}%
• Confidence: ${Math.round((results.confidence || 0) * 100)}%
• Sample Size: ${results.iterations.toLocaleString()}
• Std Deviation: ${results.standardDeviation?.toFixed(1)}%`;
                
                percentageEl.title = tooltip;
            }

        } catch (error) {
            console.error('Error in advanced poker calculation:', error);
            percentageEl.textContent = 'Error';
            handStrengthEl.textContent = 'Advanced calculation failed - using fallback';
            
            // Fallback to basic calculation
            try {
                const playerHand = this.selectedCards.player.filter(card => card !== null);
                const communityCards = this.selectedCards.community.filter(card => card !== null);
                
                const basicWinPercentage = this.pokerLogic.calculateWinPercentage(
                    playerHand, 
                    communityCards, 
                    this.opponents.length > 0 ? this.opponents : [{ behavior: 'tight-aggressive' }],
                    3000
                );
                
                if (isNaN(basicWinPercentage) || basicWinPercentage < 0 || basicWinPercentage > 100) {
                    throw new Error(`Invalid basic win percentage: ${basicWinPercentage}`);
                }
                
                percentageEl.textContent = basicWinPercentage.toFixed(1);
                percentageEl.style.color = basicWinPercentage >= 50 ? '#10b981' : '#ef4444';
                
                const basicRecommendation = this.getActionRecommendation(basicWinPercentage, this.opponents.length);
                handStrengthEl.textContent = `${this.pokerLogic.getHandStrength(basicWinPercentage)} (Basic calculation)`;
                this.displayRecommendation(basicRecommendation, basicWinPercentage, this.opponents.length);
                
            } catch (fallbackError) {
                console.error('Fallback calculation also failed:', fallbackError);
                percentageEl.textContent = 'Error';
                handStrengthEl.textContent = 'Calculation system error - Please refresh';
                
                // Hide recommendation box on error
                const recommendationBox = document.getElementById('recommendation-box');
                if (recommendationBox) {
                    recommendationBox.style.display = 'none';
                }
            }
        } finally {
            btn.disabled = false;
            btn.textContent = 'Calculate Odds';
            btn.classList.remove('calculating');
            
            // Remove calculating effect from results section
            const resultsSection = document.querySelector('.results-section');
            if (resultsSection) resultsSection.classList.remove('calculating');
        }
    }

    // Smart action recommendation system
    getActionRecommendation(winPercentage, numOpponents) {
        // Adjust thresholds based on number of opponents
        const baseThresholds = {
            strongCall: 75,    // Almost always call/raise
            call: 55,          // Call or small raise  
            cautious: 35,      // Call in position, fold out of position
            fold: 25,          // Generally fold
            strongFold: 15     // Almost always fold
        };

        // Adjust for opponent count (more opponents = need stronger hands)
        const opponentMultiplier = Math.max(0.7, 1 - (numOpponents * 0.05));
        const adjustedThresholds = {
            strongCall: baseThresholds.strongCall * opponentMultiplier,
            call: baseThresholds.call * opponentMultiplier, 
            cautious: baseThresholds.cautious * opponentMultiplier,
            fold: baseThresholds.fold * opponentMultiplier,
            strongFold: baseThresholds.strongFold * opponentMultiplier
        };

        // Determine recommendation
        if (winPercentage >= adjustedThresholds.strongCall) {
            return {
                action: "🚀 RAISE/CALL",
                color: "#10b981",
                description: "Strong hand - be aggressive",
                confidence: "high"
            };
        } else if (winPercentage >= adjustedThresholds.call) {
            return {
                action: "✅ CALL",
                color: "#22c55e", 
                description: "Good hand - call or small raise",
                confidence: "medium-high"
            };
        } else if (winPercentage >= adjustedThresholds.cautious) {
            return {
                action: "⚠️ CAUTIOUS",
                color: "#f59e0b",
                description: "Marginal - position dependent",
                confidence: "medium"
            };
        } else if (winPercentage >= adjustedThresholds.fold) {
            return {
                action: "🤔 CONSIDER FOLD",
                color: "#f97316",
                description: "Weak hand - likely fold",
                confidence: "medium-low"
            };
        } else {
            return {
                action: "❌ FOLD",
                color: "#ef4444",
                description: "Very weak - almost always fold",
                confidence: "high"
            };
        }
    }

    // Display recommendation in the UI
    displayRecommendation(recommendation, winPercentage, numOpponents) {
        const recommendationBox = document.getElementById('recommendation-box');
        const actionEl = document.getElementById('recommendation-action');
        const descriptionEl = document.getElementById('recommendation-description');

        if (!recommendationBox || !actionEl || !descriptionEl) return;

        // Show the recommendation box
        recommendationBox.style.display = 'block';
        
        // Set the action and description
        actionEl.textContent = recommendation.action;
        actionEl.style.color = recommendation.color;
        
        // Enhanced description with context
        let contextualDescription = recommendation.description;
        if (numOpponents > 3) {
            contextualDescription += ` (vs ${numOpponents} opponents)`;
        }
        if (winPercentage > 80) {
            contextualDescription += " - Consider value betting";
        } else if (winPercentage < 20) {
            contextualDescription += " - Save your chips";
        }
        
        descriptionEl.textContent = contextualDescription;
        
        // Update box border color
        recommendationBox.style.borderColor = recommendation.color + '60'; // Add transparency
    }

    // Utility method to get current game state for debugging
    getGameState() {
        return {
            playerHand: this.selectedCards.player.filter(card => card !== null),
            communityCards: this.selectedCards.community.filter(card => card !== null),
            opponents: this.opponents,
            usedCards: Array.from(this.usedCards)
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pokerApp = new PokerApp();
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PokerApp;
} 