import axios from '../../../axios-orders';
import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';


class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCOde: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault()
            this.setState({loading: true})
            const order = {
                ingredients: this.props.ingredients,
                price: this.props.price,
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
            axios.post('/orders.json', order)
                .then(response => {
                    this.setState({ loading: false });
                    this.props.history.push('/')
                })
                .catch(error => {
                    this.setState({loading: false})
                })
    }

    render() {
        let form = (
            <form>
                    <Input inputtype='input' type='text' name='name' placeholder='Your Name'></Input>
                    <Input inputtype='input' type='email' name='email' placeholder='Your Mail'></Input>
                    <Input inputtype='input' type='text' name='street' placeholder='Street'></Input>
                    <Input inputtype='input' type='text' name='postal' placeholder='Postal Code'></Input>
                    <Button btnType='Success' clicked={this.orderHandler}>Order</Button>
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
