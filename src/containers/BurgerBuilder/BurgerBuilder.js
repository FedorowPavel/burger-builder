import React, { Component } from 'react';
import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BulidControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler';

import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index'




class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        
    }

    componentDidMount() {
        
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
        
        return sum > 0
    }

    purchasehandler = () => {
        this.setState({ purchasing: true });
    }

    purschaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.props.history.push("/checkout")
    }


    render() {
        const disabledInfo = {
            ...this.props.ings
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        pusrchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchasehandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary
                            price={this.props.price}
                            purchaseCanceled={this.purschaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}
                            ingredients={this.props.ings}
                        />
        }

        
        
        return (
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purschaseCancelHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(withErrorhandler(BurgerBuilder, axios));