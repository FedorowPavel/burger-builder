import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from './ContactData.css'

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCOde: ''
        }
    }

    render() {
        return (
            <div className={classes.ContactData}>
                <h4>Enter you data</h4>
                <form>
                    <input className={ classes.Input } type='text' name='name' placeholder='Your Name'></input>
                    <input className={ classes.Input } type='email' name='email' placeholder='Your Mail'></input>
                    <input className={ classes.Input } type='text' name='street' placeholder='Street'></input>
                    <input className={ classes.Input } type='text' name='postal' placeholder='Postal Code'></input>
                    <Button btnType='Success'>Order</Button>
                </form>
            </div>
        )
    }
}

export default ContactData;

