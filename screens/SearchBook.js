import React from 'react';
import {View,Text,ScrollView,FlatList,TextInput,StyleSheet,TouchableOpacity} from 'react-native';
import db from '../config'




class SearchBook extends React.Component{
  constructor(){
    super();
    this.state={
       
      allTransactions:[],
      lastVisibleTransaction:null,
      search:''


    }
  }
  componentDidMount=async()=>{
    // var transactions=await db.collection("transactions").limit(10).get();
    // transactions.docs.map((doc)=>{
    //  this.setState({
    //    allTransactions:[...this.state.allTransactions,doc.data()],
    //    lastVisibleTransaction:doc
    //  })

    // })

  


  }
  fetchMoreTransactions=async()=>{
  var transactions=await db.collection("transactions").startAfter(this.state.lastVisibleTransaction).limit(10).get();
  
  transactions.docs.map((doc)=>{
    this.setState({
      allTransactions:[...this.state.allTransactions,doc.data()],
      lastVisibleTransaction:doc
    })

   })
}
searchTransaction=async()=>{

var enteredText=this.state.search.split("");
console.log(enteredText[0]);
if(enteredText[0].toUpperCase()==='B'){

  var transaction=await db.collection("transactions").where("bookId","==",this.state.search).get();
  transaction.docs.map((doc)=>{
    this.setState({
      allTransactions:[...this.state.allTransactions,doc.data()],
      lastVisibleTransaction:doc
    })
  })






}
else if(enteredText[0].toUpperCase()==='S'){

  var transaction=await db.collection("transaction").where("studentId","==",this.state.search).get();
  transaction.docs.map((doc)=>{
    this.setState({
      allTransactions:[...this.state.allTransactions,doc.data()],
      lastVisibleTransaction:doc
    })
  })

}








}






  render(){
   return(
       <View style={{marginTop:100}} >
         {/* <ScrollView>
         {this.state.allTransactions.map((item)=>{
           return( 
             <View style={{marginTop:23}}>  
           <Text>{'BookId: '+item.bookId}</Text>
           <Text>{'StudentId: '+item.studentId}</Text>
           <Text>{'Date: '+item.date.toDate()}</Text>
           <Text>{'transactionType: '+item.transactionType}</Text>
           </View>
           )

         })}

         </ScrollView> */}

         <View>
           <TextInput
           style={styles.TextInput}
           placeholder="Enter BookId or StudentId"
           onChangeText={
             (text)=>{
               this.setState({
                 search:text
               })
             }
           }
           />
           <TouchableOpacity style={styles.SrcBtn} onPress={this.searchTransaction}>
             <Text style={styles.srchTxt}>Search</Text>
           </TouchableOpacity>
         </View>


        <FlatList
         data={this.state.allTransactions}
         renderItem={({item})=>{

          return( 
            <View style={{marginTop:23}}>  
          <Text>{'BookId: '+item.bookId}</Text>
          <Text>{'StudentId: '+item.studentId}</Text>
          <Text>{'Date: '+item.date.toDate()}</Text>
          <Text>{'transactionType: '+item.transactionType}</Text>
          </View>
          )





         }} 
         
         onEndReached={this.fetchMoreTransactions}
         onEndReachedThreshold={0.5}
        
        
        
        
        
        
        />










         
       </View>
       


   );



      

 

  }
}

const styles= StyleSheet.create({
  TextInput:{
    backgroundColor:"skyblue",
    margin:20,
    padding:20,
    borderRadius:24
  },
  SrcBtn:{
    padding:10,
    marginTop:25,
    backgroundColor:"yellow",
    width:200,
    alignSelf:"center",
    borderRadius:8,
    alignItems:'center',

  },
  srchTxt:{
    fontSize:30,
    fontFamily:"serif"
  }
})

export default SearchBook;
