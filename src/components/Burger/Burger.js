import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {

    //Object.key giмes arraye from object keys
    let transformedIngridients = Object.keys(props.ingredients)
        .map(igKey => {
            //create an array with empty values but N-length 
            //where N = count of this ingredient = props.ingredients[igKey]
            return [...Array(props.ingredients[igKey])]
                //return N count for each ingredient
                .map((_, i) => {
                    return <BurgerIngredient key={igKey + i} type={igKey}/>
                })
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, [])
    
    if (transformedIngridients.length === 0) {
        transformedIngridients = <p>Please start adding ingredients</p>
    }

    console.log(transformedIngridients);

    
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngridients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
    );
}

export default burger;