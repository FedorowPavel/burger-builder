import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxillary/Auxillary';

const withErrorhandler = (WrappedComponemt, axios) => {

    return class extends Component {
        state = {
            error: null,
        }

        componentWillMount() {
            this.reqIntercaptor = axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req
            })
            this.resIntercaptor = axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error });
            })
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqIntercaptor);
            axios.interceptors.request.eject(this.resIntercaptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null})
        }

        render() {
            return (
                <Aux>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponemt {...this.props}/>
                </Aux>
            )
        }
    } 
}

export default withErrorhandler;