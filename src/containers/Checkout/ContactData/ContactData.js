import axios from '../../../axios-orders';
import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import {connect } from 'react-redux'


class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },

            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },

            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    maxLength: 6
                },
                valid: false,
                touched: false
            },

            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },

            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },

            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'fastest' },
                        { value: 'cheapest', displayValue: 'cheapest' }
                    ]
                },
                value: '',
                validation: {},
                valid: true,
            }
        },
        loading: false,
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const formData = {};
        for (let formElementIdentifire in this.state.orderForm) {
            formData[formElementIdentifire] = this.state.orderForm[formElementIdentifire].value
        }


            const order = {
                ingredients: this.props.ings,
                price: this.props.price,
                orderData: formData,
                
            }
            
    }

    checkValidity(value, rules) {

        let isValid = true;

        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        return isValid;
    }


    inputChangedHandler = (event, inputIdentifire) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }

        const updatedOrderFormElement = {
            ...updatedOrderForm[inputIdentifire]
        }

        updatedOrderFormElement.value = event.target.value;
        updatedOrderFormElement.valid = this.checkValidity(updatedOrderFormElement.value, updatedOrderFormElement.validation)
        updatedOrderFormElement.touched = true

        updatedOrderForm[inputIdentifire] = updatedOrderFormElement

        console.log(updatedOrderFormElement);

        let formIsValid = true;

        for (let inputIdentifire in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifire].valid && formIsValid
        }
        console.log(formIsValid);
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    }
    
    render() {

        const formElementsArray = [];

        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }


        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event)=>this.inputChangedHandler(event, formElement.id)} />
                   ))}
                    <Button btnType='Success' disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter you data</h4>
                {form}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);

