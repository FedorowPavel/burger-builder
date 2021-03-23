import React, { Component } from 'react';
import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BulidControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENTS_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        pusrchasable: false,
        purchasing: false,
        loading: false,
    }

    updatePurchaseState(ingredients) {
        //create arr of strings [salad, bacon....]
        const sum = Object.keys(ingredients)
            //replace string to its values [0, 0, ...]
            .map(igKey => {
                return ingredients[igKey]
            })
            //sum of all ingrediets
            .reduce((sum, el) => {
                return sum + el;
            }, 0)
        
        this.setState({pusrchasable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    purchasehandler = () => {
        this.setState({ purchasing: true });
    }

    purschaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('You continue!')
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "Pavel Fedorow",
                address: {
                    street: 'Folush',
                    zipCode: '230006',
                    country: 'Belarus'
                },
                email: 'text@mail.com',
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders', order)
            .then(response => {
                this.setState({loading: false, purchasing: false})
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false})
            })
    }


    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary =<OrderSummary
                        price={this.state.totalPrice}
                        purchaseCanceled={this.purschaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients} />
        
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purschaseCancelHandler}
                >
                    {orderSummary}
                </Modal>
                <Burger ingredients={ this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    pusrchasable={this.state.pusrchasable}
                    ordered={this.purchasehandler}
                />
            </Aux>
        );
    }
}

export default withErrorhandler(BurgerBuilder, axios);