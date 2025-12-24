
import { FLOWERS, REQUESTS } from './data.js';

class GameState {
    constructor() {
        this.day = 1;
        this.money = 100; // Initial capital
        this.inventory = []; // Array of { flowerId, freshness, instanceId }
        this.phase = 'DAY'; // DAY, SPOILAGE, SHOP
        this.currentCustomer = null;
        this.customersServedToday = 0;
        this.maxCustomersToday = 0;
        this.currentBouquet = []; // Array of inventory instanceIds
        this.instanceCounter = 0;

        // Initial Stock
        this.addFlowersToInventory('rose_red', 5);
        this.addFlowersToInventory('carnation_white', 5);
        this.addFlowersToInventory('tulip_red', 5);
    }

    addFlowersToInventory(flowerId, count) {
        const flowerProto = FLOWERS.find(f => f.id === flowerId);
        if (!flowerProto) return;
        for (let i = 0; i < count; i++) {
            this.inventory.push({
                instanceId: this.instanceCounter++,
                flowerId: flowerId,
                currentFreshness: flowerProto.stats.freshness,
                maxFreshness: flowerProto.stats.freshness
            });
        }
    }

    startDay() {
        this.phase = 'DAY';
        this.customersServedToday = 0;
        this.maxCustomersToday = Math.floor(Math.random() * (8 - 5 + 1)) + 5;
        this.nextCustomer();
    }

    nextCustomer() {
        if (this.customersServedToday >= this.maxCustomersToday) {
            this.startEveningSpoilage();
            return;
        }
        const requestTemplate = REQUESTS[Math.floor(Math.random() * REQUESTS.length)];
        this.currentCustomer = {
            ...requestTemplate,
            id: Date.now()
        };
        this.customersServedToday++;
        window.dispatchEvent(new CustomEvent('new-customer', { detail: this.currentCustomer }));
    }

    calculateItemPrice(instanceId) {
        const item = this.inventory.find(i => i.instanceId === instanceId);
        if (!item) return 0;
        const f = FLOWERS.find(x => x.id === item.flowerId);

        let coef = 0;
        if (item.maxFreshness > 1) {
            coef = (item.currentFreshness - 1) / (item.maxFreshness - 1);
        }
        coef = Math.max(0, Math.min(1, coef));

        return Math.floor(f.basePrice + f.basePrice * coef);
    }

    addToBouquet(instanceId) {
        const item = this.inventory.find(i => i.instanceId === instanceId);
        if (!item || this.currentBouquet.includes(instanceId)) return;
        this.currentBouquet.push(instanceId);
        window.dispatchEvent(new CustomEvent('bouquet-updated'));
    }

    removeFromBouquet(instanceId) {
        this.currentBouquet = this.currentBouquet.filter(id => id !== instanceId);
        window.dispatchEvent(new CustomEvent('bouquet-updated'));
    }

    calculateBouquetStats() {
        const flowers = this.currentBouquet.map(id => {
            const item = this.inventory.find(i => i.instanceId === id);
            return FLOWERS.find(f => f.id === item.flowerId);
        });

        const currentFreshnessValues = this.currentBouquet.map(id => {
            const item = this.inventory.find(i => i.instanceId === id);
            return item.currentFreshness;
        });
        const freshness = currentFreshnessValues.length > 0 ? Math.min(...currentFreshnessValues) : 0;

        let composition = 0;
        if (flowers.length > 0) {
            const totalComp = flowers.reduce((sum, f) => sum + f.stats.compatibility, 0);
            composition = totalComp / flowers.length;
        }

        let effect = 0;
        if (flowers.length > 0) {
            const effectiveCount = flowers.filter(f => f.stats.effect > 0.6).length;
            effect = effectiveCount / flowers.length;
        }

        let avgRefinement = 0;
        if (flowers.length > 0) {
            avgRefinement = flowers.reduce((sum, f) => sum + f.stats.refinement, 0) / flowers.length;
        }

        const volume = flowers.reduce((sum, f) => sum + f.stats.volume, 0);

        const cost = this.currentBouquet.reduce((sum, id) => sum + this.calculateItemPrice(id), 0);

        return {
            freshness,
            composition,
            effect,
            refinement: avgRefinement,
            volume,
            cost
        };
    }

    calculateFinalPrice() {
        const stats = this.calculateBouquetStats();
        const baseTotal = stats.cost;
        const volumeBonus = stats.volume * 0.5;
        const refinementBonus = (stats.refinement > 0.5) ? (stats.refinement * 20) : 0;
        return Math.floor(baseTotal + volumeBonus + refinementBonus);
    }

    evaluateOffer() {
        if (this.currentBouquet.length === 0) return { success: false, reason: "Букет пуст" };

        const stats = this.calculateBouquetStats();
        const finalPrice = this.calculateFinalPrice();
        const expectations = this.currentCustomer.expectations;
        const budget = this.currentCustomer.budget;

        const assessment = {
            success: true,
            stats: {
                ...stats,
                price: finalPrice
            },
            expectations: {
                ...expectations,
                price: budget
            },
            checks: {}
        };

        if (stats.freshness < expectations.freshness) { assessment.success = false; assessment.checks.freshness = false; } else { assessment.checks.freshness = true; }
        if (stats.composition < expectations.composition) { assessment.success = false; assessment.checks.composition = false; } else { assessment.checks.composition = true; }
        if (stats.effect < expectations.effect) { assessment.success = false; assessment.checks.effect = false; } else { assessment.checks.effect = true; }
        if (stats.refinement < expectations.refinement) { assessment.success = false; assessment.checks.refinement = false; } else { assessment.checks.refinement = true; }
        if (stats.volume < expectations.volume) { assessment.success = false; assessment.checks.volume = false; } else { assessment.checks.volume = true; }

        if (finalPrice > budget) {
            assessment.success = false;
            assessment.checks.price = false;
        } else {
            assessment.checks.price = true;
        }

        return assessment;
    }

    confirmSale(finalPrice) {
        this.money += finalPrice;
        this.inventory = this.inventory.filter(item => !this.currentBouquet.includes(item.instanceId));
        this.currentBouquet = [];
        window.dispatchEvent(new CustomEvent('money-updated'));
        window.dispatchEvent(new CustomEvent('inventory-updated'));
        window.dispatchEvent(new CustomEvent('bouquet-updated'));
        this.nextCustomer();
    }

    rejectSale() {
        this.currentBouquet = [];
        window.dispatchEvent(new CustomEvent('bouquet-updated'));
        this.nextCustomer();
    }

    startEveningSpoilage() {
        this.phase = 'SPOILAGE';
        this.inventory.forEach(item => {
            item.currentFreshness -= 1;
        });
        window.dispatchEvent(new CustomEvent('phase-changed', { detail: 'SPOILAGE' }));
        window.dispatchEvent(new CustomEvent('inventory-updated'));
    }

    trashFlower(instanceId) {
        const item = this.inventory.find(i => i.instanceId === instanceId);
        if (!item) return;
        this.inventory = this.inventory.filter(i => i.instanceId !== instanceId);
        window.dispatchEvent(new CustomEvent('inventory-updated'));
    }

    finishSpoilage() {
        this.phase = 'SHOP';
        window.dispatchEvent(new CustomEvent('phase-changed', { detail: 'SHOP' }));
    }

    buyFlower(flowerId) {
        const f = FLOWERS.find(x => x.id === flowerId);
        if (this.money >= f.basePrice) {
            this.money -= f.basePrice;
            this.addFlowersToInventory(flowerId, 1);
            window.dispatchEvent(new CustomEvent('money-updated'));
            window.dispatchEvent(new CustomEvent('inventory-updated'));
        }
    }

    finishShopping() {
        this.day++;
        this.startDay();
        window.dispatchEvent(new CustomEvent('phase-changed', { detail: 'DAY' }));
        window.dispatchEvent(new CustomEvent('day-updated'));
    }
}

export const game = new GameState();
