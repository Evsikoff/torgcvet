
import { game } from './script.js';
import { FLOWERS } from './data.js';

const ui = {
    dayDisplay: document.getElementById('day-display'),
    moneyDisplay: document.getElementById('money-display'),
    inventoryGrid: document.getElementById('inventory-grid'),
    customerArea: document.getElementById('customer-area'),
    customerReq: document.getElementById('customer-req'),
    reqTags: document.getElementById('req-tags'),
    bouquetZone: document.getElementById('bouquet-zone'),
    bouquetStats: document.getElementById('bouquet-stats'),
    btnSell: document.getElementById('btn-sell'),
    btnClear: document.getElementById('btn-clear'),
    btnRemove: document.getElementById('btn-remove'),

    // State
    selectedInstanceId: null,

    // Drag state
    flowerPositions: {}, // { instanceId: { x, y } }
    flowerZIndexes: {}, // { instanceId: zIndex }
    isDragging: false,
    wasDragging: false, // Track if drag actually happened
    draggedInstanceId: null,
    draggedElement: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragStartX: 0,
    dragStartY: 0,

    // Layer control elements
    layerControls: document.getElementById('layer-controls'),
    btnLayerUp: document.getElementById('btn-layer-up'),
    btnLayerDown: document.getElementById('btn-layer-down'),
    btnLayerTop: document.getElementById('btn-layer-top'),
    btnLayerBottom: document.getElementById('btn-layer-bottom'),

    // Result Modal Selectors
    resultModal: document.getElementById('result-modal'),
    resultTitle: document.getElementById('result-title'),
    expectList: document.getElementById('expect-list'),
    actualList: document.getElementById('actual-list'),
    btnCloseResult: document.getElementById('btn-close-result'),
    bouquetVisual: document.querySelector('.bouquet-visual-placeholder'), // We will clear and use this

    // Day view
    dayView: document.getElementById('day-view'),

    // Modals
    spoilageModal: document.getElementById('spoilage-modal'),
    spoilageGrid: document.getElementById('spoilage-grid'),
    btnFinishSpoilage: document.getElementById('btn-finish-spoilage'),

    shopModal: document.getElementById('shop-modal'),
    wholesaleGrid: document.getElementById('wholesale-grid'),
    btnFinishShopping: document.getElementById('btn-finish-shopping'),

    init() {
        this.updateHeader();
        this.renderInventory();
        this.setupListeners();
        this.setupDragListeners();
        game.startDay();
    },

    setupDragListeners() {
        // Global mouse move and mouse up for dragging
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', (e) => this.handleDragEnd(e));
    },

    handleDragStart(e, instanceId, imgElement) {
        e.preventDefault();
        this.isDragging = true;
        this.wasDragging = false;
        this.draggedInstanceId = instanceId;
        this.draggedElement = imgElement;

        const imgRect = imgElement.getBoundingClientRect();

        // Calculate offset from cursor to element's top-left corner
        this.dragOffsetX = e.clientX - imgRect.left;
        this.dragOffsetY = e.clientY - imgRect.top;

        // Remember start position to detect actual drag
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        // Add dragging style
        imgElement.style.zIndex = '100';
        imgElement.style.cursor = 'grabbing';
    },

    handleDragMove(e) {
        if (!this.isDragging || !this.draggedElement) return;

        // Check if mouse moved enough to be considered a drag (5px threshold)
        const dx = Math.abs(e.clientX - this.dragStartX);
        const dy = Math.abs(e.clientY - this.dragStartY);
        if (dx > 5 || dy > 5) {
            this.wasDragging = true;
        }

        const rect = this.bouquetZone.getBoundingClientRect();

        // Calculate new position relative to bouquet zone
        let newX = e.clientX - rect.left - this.dragOffsetX;
        let newY = e.clientY - rect.top - this.dragOffsetY;

        // Clamp position within bounds
        const imgWidth = this.draggedElement.offsetWidth;
        const imgHeight = this.draggedElement.offsetHeight;

        newX = Math.max(0, Math.min(newX, rect.width - imgWidth));
        newY = Math.max(0, Math.min(newY, rect.height - imgHeight));

        // Update element position
        this.draggedElement.style.left = newX + 'px';
        this.draggedElement.style.top = newY + 'px';

        // Save position
        this.flowerPositions[this.draggedInstanceId] = { x: newX, y: newY };
    },

    handleDragEnd(e) {
        if (!this.isDragging) return;

        if (this.draggedElement) {
            this.draggedElement.style.zIndex = '';
            this.draggedElement.style.cursor = 'grab';
        }

        this.isDragging = false;
        this.draggedInstanceId = null;
        this.draggedElement = null;
    },

    getInitialPosition(index, totalCount) {
        // Distribute flowers in a nice pattern
        const zoneWidth = this.bouquetZone.offsetWidth;
        const zoneHeight = this.bouquetZone.offsetHeight;

        // Create a semi-circular arrangement at the bottom
        const centerX = zoneWidth / 2;
        const baseY = zoneHeight * 0.6;

        // Spread horizontally based on count
        const spread = Math.min(zoneWidth * 0.7, totalCount * 60);
        const startX = centerX - spread / 2;
        const stepX = totalCount > 1 ? spread / (totalCount - 1) : 0;

        const x = totalCount > 1 ? startX + stepX * index : centerX - 40;
        const y = baseY + Math.abs(index - (totalCount - 1) / 2) * 15;

        return { x: x - 40, y: y };
    },

    getFlowerZIndex(instanceId) {
        if (this.flowerZIndexes[instanceId] === undefined) {
            // Assign initial z-index based on order in bouquet
            const index = game.currentBouquet.indexOf(instanceId);
            this.flowerZIndexes[instanceId] = index >= 0 ? index : 0;
        }
        return this.flowerZIndexes[instanceId];
    },

    changeLayerUp(instanceId) {
        const currentZ = this.getFlowerZIndex(instanceId);
        // Find flower with next higher z-index
        let nextZ = null;
        let nextId = null;
        game.currentBouquet.forEach(id => {
            const z = this.getFlowerZIndex(id);
            if (z > currentZ && (nextZ === null || z < nextZ)) {
                nextZ = z;
                nextId = id;
            }
        });
        if (nextId !== null) {
            // Swap z-indexes
            this.flowerZIndexes[instanceId] = nextZ;
            this.flowerZIndexes[nextId] = currentZ;
            this.renderBouquetZone();
        }
    },

    changeLayerDown(instanceId) {
        const currentZ = this.getFlowerZIndex(instanceId);
        // Find flower with next lower z-index
        let prevZ = null;
        let prevId = null;
        game.currentBouquet.forEach(id => {
            const z = this.getFlowerZIndex(id);
            if (z < currentZ && (prevZ === null || z > prevZ)) {
                prevZ = z;
                prevId = id;
            }
        });
        if (prevId !== null) {
            // Swap z-indexes
            this.flowerZIndexes[instanceId] = prevZ;
            this.flowerZIndexes[prevId] = currentZ;
            this.renderBouquetZone();
        }
    },

    moveToTop(instanceId) {
        // Find max z-index
        let maxZ = 0;
        game.currentBouquet.forEach(id => {
            const z = this.getFlowerZIndex(id);
            if (z > maxZ) maxZ = z;
        });
        this.flowerZIndexes[instanceId] = maxZ + 1;
        this.renderBouquetZone();
    },

    moveToBottom(instanceId) {
        // Find min z-index
        let minZ = Infinity;
        game.currentBouquet.forEach(id => {
            const z = this.getFlowerZIndex(id);
            if (z < minZ) minZ = z;
        });
        this.flowerZIndexes[instanceId] = minZ - 1;
        this.renderBouquetZone();
    },

    setupListeners() {
        window.addEventListener('new-customer', (e) => this.renderCustomer(e.detail));
        window.addEventListener('bouquet-updated', () => {
            this.renderBouquetZone();
            this.updateStatsPreview();
            this.renderInventory(); // Re-render inventory to update available flowers
        });
        window.addEventListener('inventory-updated', () => {
            this.renderInventory();
            if (game.phase === 'SPOILAGE') this.renderSpoilage();
        });
        window.addEventListener('money-updated', () => this.updateHeader());
        window.addEventListener('day-updated', () => this.updateHeader());
        window.addEventListener('phase-changed', (e) => this.handlePhaseChange(e.detail));

        this.btnSell.addEventListener('click', () => this.handleOffer());
        this.btnClear.addEventListener('click', () => {
            game.currentBouquet = [];
            this.selectedInstanceId = null;
            window.dispatchEvent(new CustomEvent('bouquet-updated'));
        });

        this.btnRemove.addEventListener('click', () => {
            if (this.selectedInstanceId) {
                game.removeFromBouquet(this.selectedInstanceId);
                this.selectedInstanceId = null;
                // renderBouquetZone is called by event listener
            }
        });

        this.btnFinishSpoilage.addEventListener('click', () => game.finishSpoilage());
        this.btnFinishShopping.addEventListener('click', () => game.finishShopping());

        // Layer control buttons
        this.btnLayerUp.addEventListener('click', () => {
            if (this.selectedInstanceId) this.changeLayerUp(this.selectedInstanceId);
        });
        this.btnLayerDown.addEventListener('click', () => {
            if (this.selectedInstanceId) this.changeLayerDown(this.selectedInstanceId);
        });
        this.btnLayerTop.addEventListener('click', () => {
            if (this.selectedInstanceId) this.moveToTop(this.selectedInstanceId);
        });
        this.btnLayerBottom.addEventListener('click', () => {
            if (this.selectedInstanceId) this.moveToBottom(this.selectedInstanceId);
        });

        this.btnCloseResult.addEventListener('click', () => {
            this.resultModal.classList.add('hidden');
            // Check if last result was success or fail to trigger next actions?
            // Actually, we should trigger next action based on game state, but logic is inside game.
            // Game logic methods like confirmSale/rejectSale already handle nextCustomer() call.
            // BUT those methods need to be called! 
            // The modal is just for Show.
            // Wait, when do we call confirmSale?
            // Answer: When user Closes the modal.
            // We need to store the pendulum decision.
            if (this.lastResult && this.lastResult.success) {
                game.confirmSale(this.lastResult.stats.price);
            } else {
                game.rejectSale();
            }
        });
    },

    handlePhaseChange(phase) {
        if (phase === 'DAY') {
            this.dayView.classList.remove('hidden');
            this.spoilageModal.classList.add('hidden');
            this.shopModal.classList.add('hidden');
        } else if (phase === 'SPOILAGE') {
            this.spoilageModal.classList.remove('hidden');
            this.renderSpoilage();
        } else if (phase === 'SHOP') {
            this.spoilageModal.classList.add('hidden');
            this.shopModal.classList.remove('hidden');
            this.renderShop();
        }
    },

    updateHeader() {
        this.dayDisplay.textContent = game.day;
        this.moneyDisplay.textContent = game.money;
    },

    renderInventory() {
        this.inventoryGrid.innerHTML = '';
        const available = game.inventory.filter(i => !game.currentBouquet.includes(i.instanceId));

        // Group items by key: id_freshness_price
        const groups = {};

        available.forEach(item => {
            const price = game.calculateItemPrice(item.instanceId);
            const key = `${item.flowerId}_${item.currentFreshness}_${price}`;

            if (!groups[key]) {
                groups[key] = {
                    flowerId: item.flowerId,
                    freshness: item.currentFreshness,
                    price: price,
                    instances: []
                };
            }
            groups[key].instances.push(item);
        });

        Object.values(groups).forEach(group => {
            const f = FLOWERS.find(x => x.id === group.flowerId);
            const count = group.instances.length;

            const card = document.createElement('div');
            card.className = 'flower-card';
            card.innerHTML = `
                ${count > 1 ? `<div class="count-badge">${count}</div>` : ''}
                <img src="assets/flowers/${f.id}_top.png" class="flower-icon-img" alt="${f.commName}">
                <div class="flower-info">
                    <h4>${f.commName}</h4>
                    <span class="flower-freshness">Св: ${group.freshness}дн</span>
                    <span class="price-tag">${group.price}₽</span>
                </div>
            `;

            // On click, add the first available instance from this group
            card.addEventListener('click', () => {
                if (group.instances.length > 0) {
                    game.addToBouquet(group.instances[0].instanceId);
                }
            });

            this.inventoryGrid.appendChild(card);
        });
    },

    renderCustomer(customer) {
        if (!customer) {
            this.customerArea.classList.add('hidden');
            return;
        }
        this.customerArea.classList.remove('hidden');
        this.customerReq.textContent = `"${customer.text}"`;

        const e = customer.expectations;
        this.reqTags.innerHTML = `
            Ожидания:
            Св > ${e.freshness} |
            Эф > ${e.effect} |
            Об > ${e.volume} |
            <b>Бюджет: ${customer.budget}₽</b>
        `;
    },

    renderBouquetZone() {
        this.bouquetZone.innerHTML = '';
        if (game.currentBouquet.length === 0) {
            this.bouquetZone.innerHTML = '<p class="placeholder">Нажмите на цветы из запасов слева, чтобы добавить их в букет</p>';
            this.btnRemove.classList.add('hidden');
            this.layerControls.classList.add('hidden');
            // Clear positions and z-indexes for removed flowers
            this.flowerPositions = {};
            this.flowerZIndexes = {};
            return;
        }

        // Toggle Remove button and layer controls visibility
        if (this.selectedInstanceId) {
            this.btnRemove.classList.remove('hidden');
            this.layerControls.classList.remove('hidden');
        } else {
            this.btnRemove.classList.add('hidden');
            this.layerControls.classList.add('hidden');
        }

        // Clean up positions and z-indexes for flowers no longer in bouquet
        const currentIds = new Set(game.currentBouquet);
        Object.keys(this.flowerPositions).forEach(id => {
            if (!currentIds.has(parseInt(id))) {
                delete this.flowerPositions[id];
            }
        });
        Object.keys(this.flowerZIndexes).forEach(id => {
            if (!currentIds.has(parseInt(id))) {
                delete this.flowerZIndexes[id];
            }
        });

        const totalCount = game.currentBouquet.length;

        game.currentBouquet.forEach((instanceId, index) => {
            const item = game.inventory.find(i => i.instanceId === instanceId);
            const f = FLOWERS.find(x => x.id === item.flowerId);

            const img = document.createElement('img');
            img.src = `assets/flowers/${f.id}_angle.png`;
            img.className = 'bouquet-item-img';
            img.draggable = false; // Prevent native drag
            img.style.cursor = 'grab';

            if (this.selectedInstanceId === instanceId) {
                img.classList.add('selected');
            }
            img.alt = f.commName;
            img.title = f.commName + ' (перетащите для перемещения)';

            // Set position from saved or calculate initial
            if (this.flowerPositions[instanceId]) {
                img.style.left = this.flowerPositions[instanceId].x + 'px';
                img.style.top = this.flowerPositions[instanceId].y + 'px';
            } else {
                // Calculate and save initial position
                const pos = this.getInitialPosition(index, totalCount);
                this.flowerPositions[instanceId] = pos;
                img.style.left = pos.x + 'px';
                img.style.top = pos.y + 'px';
            }

            // Apply z-index for layering
            const zIndex = this.getFlowerZIndex(instanceId);
            img.style.zIndex = zIndex;

            // Mouse down starts drag
            img.addEventListener('mousedown', (e) => {
                if (e.button === 0) { // Left mouse button
                    this.handleDragStart(e, instanceId, img);
                }
            });

            // Click for selection (only if not dragging)
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                // Only toggle selection if we didn't drag
                if (!this.wasDragging) {
                    if (this.selectedInstanceId === instanceId) {
                        this.selectedInstanceId = null;
                    } else {
                        this.selectedInstanceId = instanceId;
                    }
                    this.renderBouquetZone();
                }
                this.wasDragging = false;
            });

            this.bouquetZone.appendChild(img);
        });
    },

    updateStatsPreview() {
        if (!game.currentCustomer) return;
        if (game.currentBouquet.length === 0) {
            this.bouquetStats.textContent = '';
            this.btnSell.disabled = true;
            return;
        }

        const finalPrice = game.calculateFinalPrice();
        const budget = game.currentCustomer.budget;
        const stats = game.calculateBouquetStats();

        this.bouquetStats.innerHTML = `
            Свежесть: ${stats.freshness}<br>
            Эффект: ${stats.effect.toFixed(2)}<br>
            Объем: ${stats.volume}<br>
            Утонч: ${stats.refinement.toFixed(2)}<br>
            <span class="budget-display ${finalPrice > budget ? 'over' : 'ok'}">
                Цена: ${finalPrice} / ${budget} ₽
            </span>
        `;

        // Disable "Offer" button if over budget? Or let them try and fail?
        // Prompt says: "Player must not exceed". Let's disable for UX.
        this.btnSell.disabled = (finalPrice > budget);
    },

    handleOffer() {
        const result = game.evaluateOffer();
        this.lastResult = result; // Store for Close Button interaction
        this.showResultModal(result);
    },

    showResultModal(result) {
        this.resultModal.classList.remove('hidden');
        this.resultTitle.textContent = result.success ? "Покупатель доволен!" : "Покупатель отказался";
        this.resultTitle.style.color = result.success ? "green" : "red";

        const s = result.stats;
        const e = result.expectations;
        const c = result.checks;

        // Row generator
        const row = (label, val, check) => `
            <div class="stat-item ${check ? 'success' : 'fail'}">
                <span>${label}:</span>
                <strong>${val}</strong>
            </div>
        `;

        // 1. Populate Expected
        // We show what was required.
        this.expectList.innerHTML = `
            <div class="stat-item"><span>Свежесть:</span> <strong>> ${e.freshness}</strong></div>
            <div class="stat-item"><span>Эффект:</span> <strong>> ${e.effect}</strong></div>
            <div class="stat-item"><span>Сочетаемость:</span> <strong>> ${e.composition}</strong></div>
            <div class="stat-item"><span>Утонченность:</span> <strong>> ${e.refinement}</strong></div>
            <div class="stat-item"><span>Объем:</span> <strong>> ${e.volume}</strong></div>
            <div class="stat-item"><span>Бюджет:</span> <strong>< ${e.price}₽</strong></div>
        `;

        // 2. Populate Actual
        this.actualList.innerHTML = `
            ${row("Свежесть", s.freshness, c.freshness)}
            ${row("Эффект", s.effect.toFixed(2), c.effect)}
            ${row("Сочет.", s.composition.toFixed(2), c.composition)}
            ${row("Утонч.", s.refinement.toFixed(2), c.refinement)}
            ${row("Объем", s.volume, c.volume)}
            ${row("Цена", s.price + "₽", c.price)}
        `;

        // 3. Visual Composition
        this.bouquetVisual.innerHTML = '<div class="bouquet-visual-container"></div>';
        const container = this.bouquetVisual.querySelector('.bouquet-visual-container');

        // Logic to fan out flowers
        const count = game.currentBouquet.length;
        // Calculate spread
        const maxAngle = 40; // Total spread degrees
        const startAngle = -maxAngle / 2;
        const step = count > 1 ? maxAngle / (count - 1) : 0;

        game.currentBouquet.forEach((id, index) => {
            const item = game.inventory.find(i => i.instanceId === id);
            const f = FLOWERS.find(x => x.id === item.flowerId);

            const img = document.createElement('img');
            img.src = `assets/flowers/${f.id}_angle.png`;
            img.className = 'bouquet-flower-img';

            // Calculate rotation and translation
            const angle = count > 1 ? startAngle + (step * index) : 0;
            // Push side ones a bit out
            const xOffset = angle * 2;

            img.style.transform = `translateX(-50%) translateX(${xOffset}px) rotate(${angle}deg)`;
            img.style.left = '50%';
            img.style.zIndex = index; // Layer them

            container.appendChild(img);
        });
    },

    renderSpoilage() {
        this.spoilageGrid.innerHTML = '';
        const sorted = [...game.inventory].sort((a, b) => a.currentFreshness - b.currentFreshness);

        sorted.forEach(item => {
            const f = FLOWERS.find(x => x.id === item.flowerId);
            const card = document.createElement('div');
            card.className = `flower-card ${item.currentFreshness <= 0 ? 'wilted' : ''}`;
            card.innerHTML = `
                <span class="flower-icon">🥀</span>
                <div class="flower-info">
                    <h4>${f.commName}</h4>
                    <span>Св: ${item.currentFreshness}</span>
                </div>
                ${item.currentFreshness <= 0 ? '<button class="btn-trash">🗑️</button>' : ''}
            `;

            if (item.currentFreshness <= 0) {
                const btn = card.querySelector('.btn-trash');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    game.trashFlower(item.instanceId);
                });
            }
            this.spoilageGrid.appendChild(card);
        });
    },

    renderShop() {
        this.wholesaleGrid.innerHTML = '';
        FLOWERS.forEach(f => {
            const card = document.createElement('div');
            card.className = 'buy-card flower-card';
            card.innerHTML = `
                <h4>${f.commName}</h4>
                <p>Цена: ${f.basePrice}₽</p>
                <p class="small">Св:${f.stats.freshness} Эф:${f.stats.effect}</p>
                <button>Купить</button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                if (game.money >= f.basePrice) {
                    game.buyFlower(f.id);
                } else {
                    alert('Недостаточно денег!');
                }
            });
            this.wholesaleGrid.appendChild(card);
        });
    }
};

ui.init();
