const INGREDIENT_PRICES = {
    baseLiquid: 2.50, // Base price for any liquid
    fruit: 0.75,      // Price per fruit selection
    veggie: 0.50,     // Price per veggie selection
    booster: 1.00,    // Price per booster selection
    sweetener: {      // Specific prices for sweeteners
        none: 0.00,
        honey: 0.25,
        'maple syrup': 0.25,
        agave: 0.25,
        stevia: 0.25
    },
    baseSmoothieCost: 5.00 // A base cost for the smoothie before ingredients
};
/**
 * Smoothie Class
 * Represents a custom smoothie order with various ingredients and options.
 */
class Smoothie {
    /**
     * Creates an instance of Smoothie.
     * @param {string} smoothieName - Custom name for the smoothie (optional).
     * @param {string} baseLiquid - The chosen liquid base (e.g., "almond milk").
     * @param {string[]} fruits - An array of selected fruits.
     * @param {string[]} veggies - An array of selected vegetables.
     * @param {string[]} boosters - An array of selected boosters.
     * @param {string} sweetener - The chosen sweetener (e.g., "honey").
     * @param {string} iceLevel - The chosen ice level (e.g., "regular ice").
     * @param {string} specialInstructions - Any special instructions from the customer.
     */
    constructor(smoothieName, baseLiquid, fruits, veggies, boosters, sweetener, iceLevel, specialInstructions) {
        this.smoothieName = smoothieName || "Custom Blend"; // Default name if not provided
        this.baseLiquid = baseLiquid;
        this.fruits = fruits;
        this.veggies = veggies;
        this.boosters = boosters;
        this.sweetener = sweetener;
        this.iceLevel = iceLevel;
        this.specialInstructions = specialInstructions;
    }

    /**
     * Generates a human-readable description of the smoothie.
     * @returns {string} A formatted string describing the smoothie.
     */
    getDescription() {
        let description = `<h3>${this.smoothieName}</h3>`;
        description += `<p><strong>Base:</strong> ${this.capitalizeFirstLetter(this.baseLiquid)}</p>`;

        if (this.fruits.length > 0) {
            const formattedFruits = this.fruits.map(fruit => this.capitalizeFirstLetter(fruit)).join(', ');
            description += `<p><strong>Fruits:</strong> ${formattedFruits}</p>`;
        } else {
            description += `<p><strong>Fruits:</strong> None selected</p>`;
        }

        if (this.veggies.length > 0) {
            const formattedVeggies = this.veggies.map(veggie => this.capitalizeFirstLetter(veggie)).join(', ');
            description += `<p><strong>Veggies:</strong> ${formattedVeggies}</p>`;
        } else {
            description += `<p><strong>Veggies:</strong> None selected</p>`;
        }

        if (this.boosters.length > 0) {
            const formattedBoosters = this.boosters.map(booster => this.capitalizeFirstLetter(booster)).join(', ');
            description += `<p><strong>Boosters:</strong> ${formattedBoosters}</p>`;
        } else {
            description += `<p><strong>Boosters:</strong> None selected</p>`;
        }

        description += `<p><strong>Sweetener:</strong> ${this.capitalizeFirstLetter(this.sweetener)}</p>`;
        description += `<p><strong>Ice Level:</strong> ${this.capitalizeFirstLetter(this.iceLevel)}</p>`;

        if (this.specialInstructions) {
            description += `<p><strong>Special Instructions:</strong> ${this.specialInstructions}</p>`;
        }

        return description;
    }

    /**
     * Calculates the total price of the smoothie based on selected ingredients.
     * @returns {number} The total price of the smoothie.
     */
    calculatePrice() {
        let totalPrice = INGREDIENT_PRICES.baseSmoothieCost; // Start with base smoothie cost

        totalPrice += INGREDIENT_PRICES.baseLiquid; // Add base liquid cost

        // Add cost for each fruit selected
        totalPrice += this.fruits.length * INGREDIENT_PRICES.fruit;

        // Add cost for each veggie selected
        totalPrice += this.veggies.length * INGREDIENT_PRICES.veggie;

        // Add cost for each booster selected
        totalPrice += this.boosters.length * INGREDIENT_PRICES.booster;

        // Add sweetener cost based on specific price
        totalPrice += INGREDIENT_PRICES.sweetener[this.sweetener] || 0; // Fallback to 0 if sweetener not found

        // Ice level doesn't impact price in this model, but could be added here if desired.

        return totalPrice;
    }

    /**
     * Helper function to capitalize the first letter of a string.
     * @param {string} string - The input string.
     * @returns {string} The string with its first letter capitalized.
     */
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// --- DOM Elements ---
const smoothieOrderForm = document.getElementById('smoothieOrderForm');
const smoothieDisplay = document.getElementById('smoothieDisplay');
const orderSmoothieBtn = document.getElementById('orderSmoothieBtn');

// --- Event Listener for Form Submission ---
orderSmoothieBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission to handle with JS

    // --- Gather Form Data ---
    const smoothieName = document.getElementById('smoothieName').value.trim();
    const baseLiquid = document.getElementById('baseLiquid').value;

    // Get selected fruits (checkboxes)
    const fruits = Array.from(document.querySelectorAll('input[name="fruit"]:checked'))
                        .map(checkbox => checkbox.value);

    // Get selected veggies (checkboxes)
    const veggies = Array.from(document.querySelectorAll('input[name="veggie"]:checked'))
                         .map(checkbox => checkbox.value);

    // Get selected boosters (checkboxes)
    const boosters = Array.from(document.querySelectorAll('input[name="booster"]:checked'))
                          .map(checkbox => checkbox.value);

    // Get selected sweetener (radio buttons)
    const sweetener = document.querySelector('input[name="sweetener"]:checked').value;

    // Get selected ice level (radio buttons)
    const iceLevel = document.querySelector('input[name="iceLevel"]:checked').value;

    const specialInstructions = document.getElementById('specialInstructions').value.trim();

    // --- Input Validation (simple) ---
    if (!baseLiquid) {
        alert('Please select a base liquid for your smoothie!');
        return; // Stop function if validation fails
    }

    // --- Create Smoothie Object ---
    const customerSmoothie = new Smoothie(
        smoothieName,
        baseLiquid,
        fruits,
        veggies,
        boosters,
        sweetener,
        iceLevel,
        specialInstructions
    );

    // --- Generate and Display Output ---
    const smoothieDescription = customerSmoothie.getDescription();
    const smoothiePrice = customerSmoothie.calculatePrice();

    // Dynamically choose a smoothie image based on ingredients
    const smoothieImageSrc = getSmoothieImage(fruits, veggies);

    smoothieDisplay.innerHTML = `
        <div class="smoothie-card">
            <img src="${smoothieImageSrc}" alt="${customerSmoothie.smoothieName}" class="smoothie-image">
            ${smoothieDescription}
            <p class="smoothie-price"><strong>Total Price:</strong> $${smoothiePrice.toFixed(2)}</p>
        </div>
    `;

    // Scroll to the display section for better UX
    smoothieDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/**
 * Helper function to determine which smoothie image to display
 * based on selected fruits and veggies.
 * This is a simplified logic for "Take it Further".
 * @param {string[]} fruits - Array of selected fruits.
 * @param {string[]} veggies - Array of selected veggies.
 * @returns {string} The path to the appropriate smoothie image.
 */
function getSmoothieImage(fruits, veggies) {
    // Check for green ingredients
    const hasGreenVeggies = veggies.some(veggie => ['spinach', 'kale'].includes(veggie));
    const hasAvocado = fruits.includes('avocado'); // Avocado is a fruit botanically, but often used for green smoothies

    if (hasGreenVeggies || hasAvocado) {
        return 'images/green-smoothie.png'; // Assuming you have a green smoothie image
    }

    // Check for berry ingredients
    const hasBerries = fruits.some(fruit => ['strawberry', 'blueberry', 'raspberry'].includes(fruit));
    if (hasBerries) {
        return 'images/berry-smoothie.png'; // Assuming you have a berry smoothie image
    }

    // Check for tropical ingredients
    const hasTropical = fruits.some(fruit => ['mango', 'pineapple'].includes(fruit));
    if (hasTropical) {
        return 'images/tropical-smoothie.png'; // Assuming you have a tropical smoothie image
    }

    // Default image if no specific category matches
    return 'images/default-smoothie.png'; // Assuming a generic smoothie image
}

// Initial state: ensure the placeholder text is visible
document.addEventListener('DOMContentLoaded', () => {
    smoothieDisplay.innerHTML = '<p class="placeholder-text">Your delicious smoothie details will appear here!</p>';
});
