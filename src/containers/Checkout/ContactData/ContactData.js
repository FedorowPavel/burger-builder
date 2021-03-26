import axios from '../../../axios-orders';
import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';


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
                valid: false
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
                valid: false
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
                valid: false
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
                valid: false
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
                valid: false
            },

            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'fastest' },
                        { value: 'cheapest', displayValue: 'cheapest' }
                    ]
                },
                value: ''
            }
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const formData = {};
        for (let formElementIdentifire in this.state.orderForm) {
            formData[formElementIdentifire] = this.state.orderForm[formElementIdentifire].value
        }


            const order = {
                ingredients: this.props.ingredients,
                price: this.props.price,
                orderData: formData,
                
            }
            axios.post('/orders.json', order)
                .then(response => {
                    this.setState({ loading: false });
                    this.props.history.push('/')
                })
                .catch(error => {
                    this.setState({loading: false})
                })
    }

    checkValidity(value, rules) {

        let isValid = false;

        if (rules.required) {
            isValid = value.trim() !== ''
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength
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
        updatedOrderForm[inputIdentifire] = updatedOrderFormElement

        console.log(updatedOrderFormElement);
        this.setState({orderForm: updatedOrderForm})
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
                        changed={(event)=>this.inputChangedHandler(event, formElement.id)} />
                   ))}
                    <Button btnType='Success'>Order</Button>
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

export default ContactData;

