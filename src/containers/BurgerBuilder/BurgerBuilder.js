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
import * as actionTypes from '../../store/actions'




class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         this.setState({ ingredients: response.data })
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     })
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
        // alert('You continue!')
   
        const queryParams = [];
        console.log(this.state.ingredients);

        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }

        queryParams.push('price=' + this.props.price)

        console.log(queryParams);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
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
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(withErrorhandler(BurgerBuilder, axios));