module.exports = function _order() {
    /**
     * Constructor description.
     * 
     * @arg {String} [minutes=5] The minimum number of minutes when the order should arrive.
     */
    return function order(orderOptions) {
        return {
            /**
             * Order a drink.
             *
             * @param {String} drink The drink to order.
             * @param {Object} options The options when ordering a drink.
             *
             * @arg {String} [temperature=cold] The temperature of the drink.
             * 
             * @returns {String} The ordered drink.
             */
            drink: function drink(drink, options) {
                console.log(`Your ordered drink: ${drink}, temperature is ${options.temperature}`);
                return 0;
            },
            /**
             * Order food.
             *
             * @param {String} food The food to order.
             * @param {Object} options The options when ordering food.
             *
             * @arg {String} [dessert=sundae] The included dessert.
             * 
             * @returns {String} The ordered food.
             */
            food: function food(food, options) {
                console.log(`Your ordered food: ${food}, dessert is ${options.dessert}`);
                return 0;
            },
        };
    };
};
