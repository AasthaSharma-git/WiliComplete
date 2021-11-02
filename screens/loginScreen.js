import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';

import firebase from 'firebase';
export default class Login extends React.Component {

    constructor(){
        super();
        this.state={
            email:"",
            password:""
        }
    }

    authentication=async(email,password)=>{
         
      if(email&&password){
          
        try{
            const response=await firebase.auth().signInWithEmailAndPassword(email,password);


            if(response){
              this.props.navigation.navigate('TabScreen');
            }

        }
        catch(error){


            switch(error.code){
         
                case 'auth/user-not-found':
                    alert('User not found');
                    break;
                case 'auth/invalid-email':
                    alert('Email not found');
                    break;



            }





        }



      }
      else{
          alert('Enter email and password!')
      }





    }
    render() {
        return (

            <View>
             <View style={{marginTop:250}}>
             <TextInput placeholder = "email or username"
            style = {styles.Textinput}
            onChangeText={(text)=>{
                this.setState({
                    email:text
                })
            }}
            keyboardType="email-address"
            >
            </TextInput> 
            <TextInput style = {styles.Textinput}
            placeholder = "password" 
            onChangeText={(text)=>{
                this.setState({
                    password:text
                })
            }}
            secureTextEntry={true}
            >
            </TextInput>    
                 
                 
           </View>   
            
            <TouchableOpacity style = {
                styles.submitBtn
            } 
            
            onPress={()=>{this.authentication(this.state.email,this.state.password)}}
            >
            <Text style={styles.submitTxt}> Submit </Text> 
            </TouchableOpacity> 
            </View>



        )
    }

}
const styles = StyleSheet.create({
    Textinput: {
        borderWidth: 2,
        backgroundColor: "#f7e9c3",
        marginTop: 50,
        fontSize: 25,
        width: 300,
        height: 50,
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center"
    },
    submitBtn: {
        backgroundColor: "blue",
        padding: 10,
        margin: 20,
        marginTop:50,
        alignItems: "center",
        width: 150,
        alignSelf: "center"

    },
    submitTxt: {
        textAlign: 'center',
        fontSize: 30,
        color:"white"
    }
})