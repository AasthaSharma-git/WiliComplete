import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";

class BookTransaction extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedStudentId: "",
      scannedBookId: "",
      buttonState: "normal",
    };
  }

  getCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    var id = this.state.buttonState;
    if (id === "studentId") {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: "normal",
      });
    } else if (id === "bookId") {
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: "normal",
      });
    }
  };

  handleTransaction=async()=>{
  
   var transactionType=await this.checkBookEligibility();
   if(!transactionType){
     alert('Book not Found!');
   }
   else{
      
    if(transactionType==='Issue'){

      var studentEligibility=await this.checkStudentEligibilityForBookIssue();
      if(studentEligibility){
        this.initiateBookIssue()
      }

    }
    else if(transactionType==='Return'){

      var studentEligibility=await this.checkStudentEligibilityForBookReturn();
      if(studentEligibility){
        this.initiateBookReturn()
      }

    }





   }


}


checkStudentEligibilityForBookReturn=async()=>{
  var eligible;
  var transactionRef = await db.collection("transactions").where("bookId","==",this.state.scannedBookId).limit(1).get();

  if(transactionRef.docs.length==0){
    eligible=false;
    alert("No Transaction has happened for this book");
  }else{
    transactionRef.docs.map((doc)=>{
      var lastTransaction=doc.data();
      console.log(lastTransaction.studentId)
      if(lastTransaction.studentId===this.state.scannedStudentId){
        eligible=true;
      }else{
        eligible=false;
        alert("This book is not Issued by the student");
      }
    })
  }
  return eligible;

}

checkStudentEligibilityForBookIssue=async()=>{
    var eligible;
    var studentRef = await db.collection("students").where("studentId","==",this.state.scannedStudentId).get();
    

    if(studentRef.docs.length==0){
      eligible=false;
      alert("Student Not Found!")
    }else{
      studentRef.docs.map((doc)=>{
          var student=doc.data();
          // come in chat mam (seesion chat)
          if(student.numberOfBooksIssued<2){
            eligible=true;
          }
          else{
            eligible=false;
            alert("The student have Issued 2 books already!")
          }
      })
    }
      return eligible;
}























checkBookEligibility=async()=>{
      var transaction;
      var bookRef=await db.collection("books").where("bookId","==",this.state.scannedBookId).get();

      if(bookRef.docs.length==0){
        transaction=false;
      }
      else{
         
        bookRef.docs.map((doc)=>{
          var book=doc.data();
          if(book.bookAvailability){
            transaction='Issue';
          }
          else{
            transaction='Return';
          }


        })

      



      }


      return transaction;






}





















initiateBookIssue=async()=>{


  await db.collection("transactions").add({
'bookId':this.state.scannedBookId,
'studentId':this.state.scannedStudentId,
'transactionType':'Issue',
'date':firebase.firestore.Timestamp.now().toDate()
  });

await db.collection("books").doc(this.state.scannedBookId).update({
  'bookAvailability':false
});

await db.collection("students").doc(this.state.scannedStudentId).update({
  'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)

});




}
initiateBookReturn=async()=>{

 await db.collection("transactions").add({
   'bookId':this.state.scannedBookId,
   'studentId':this.state.scannedStudentId,
   'transactionType':'return',
   'date':firebase.firestore.Timestamp.now().toDate()
 })

await db.collection("books").doc(this.state.scannedBookId).update({
  'bookAvailability':true
});

await db.collection("students").doc(this.state.scannedStudentId).update({
  'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
});


}






















  render() {
    const cp = this.state.hasCameraPermissions;
    const bs = this.state.buttonState;
    const scanned = this.state.scanned;

    if (bs !== "normal" && cp) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (bs === "normal") {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Image
            source={require("../assets/library.jpg")}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center",
              marginTop: 80,
            }}
          />

          <View style={[styles.scan1, { marginTop: 10, alignSelf: "center" }]}>
            <TextInput
              style={styles.input}
              placeholder="Book Id"
              onChangeText={
                (text)=>{
                  this.setState({
                    scannedBookId:text
                  })
                }
              }
              value={this.state.scannedBookId}
            ></TextInput>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.getCameraPermission("bookId");
              }}
            >
              <Text>Scan</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.scan1, { alignSelf: "center" }]}>
            <TextInput
              style={styles.input}
              placeholder="Student Id"
              onChan
              onChangeText={
                (text)=>{
                  this.setState({
                    scannedStudentId:text
                  })
                }


              }
              value={this.state.scannedStudentId}
            ></TextInput>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.getCameraPermission("studentId")}
            >
              <Text>Scan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={this.handleTransaction}
            style={styles.submit}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
          </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "gray",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 10,
  },

  input: {
    marginLeft: 20,
    marginTop: 50,
    borderWidth: 2,
    borderColor: "black",
    width: 200,
    height: 50,
    backgroundColor: "skyblue",
    borderRadius: 10,
  },

  scan1: {
    flexDirection: "row",
  },
  submit: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "gray",
    height: 50,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
  },

  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
   
  }
});

export default BookTransaction;
