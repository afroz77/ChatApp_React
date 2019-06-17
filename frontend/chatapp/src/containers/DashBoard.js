import React from 'react';
import {Button ,Card, TextField} from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class DashBoard extends React.Component{

    constructor(props){
        super(props);
        this.state={
            'newMessage' : "",
        }
    }

    render(){
        return(
            <Card > 
                <h3 >Login Here</h3>
                <TextField
                    label="User Name"
                    value={this.state.userName}
                    onChange={this.handleuserNameChange}                        
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    label="Password"
                    value={this.state.password}
                    onChange={this.handlepasswordChange}                        
                    margin="normal"
                    variant="outlined"
                />
                
                <Button variant="contained"
                        fullWidth 
                        color="primary" 
                        onClick={this.notify}>Login
                </Button>
                 <ToastContainer autoClose={2000} />
                
            </Card>
        )
    }
}
