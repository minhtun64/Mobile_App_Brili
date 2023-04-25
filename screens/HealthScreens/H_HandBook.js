import {
     TouchableOpacity,
     Button,
     ScrollView,
     Text,
     StyleSheet,
     TouchableWithoutFeedback,
     View,
     Image,
     ImageBackground,
     TextInput,
   } from "react-native";
   import * as Font from "expo-font";
   import {LocaleConfig} from 'react-native-calendars';
   import React, { Component , useCallback, useEffect, useState } from "react";
   import { useSwipe } from "../../hooks/useSwipe";
   import { Calendar } from 'react-native-calendars';
   const NOTEBOOK = "NOTEBOOK";
   const HANDBOOK = "HANDBOOK";
   export default function H_NoteScreen({ navigation }) {
     const [fontLoaded, setFontLoaded] = useState(false);
     const [selected, setselected] = useState("all");

     useEffect(() => {
       const loadFont = async () => {
         await Font.loadAsync({
           "lexend-black": require("../../assets/fonts/Lexend/static/Lexend-Black.ttf"),
           "lexend-bold": require("../../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
           "lexend-extrabold": require("../../assets/fonts/Lexend/static/Lexend-ExtraBold.ttf"),
           "lexend-extralight": require("../../assets/fonts/Lexend/static/Lexend-ExtraLight.ttf"),
           "lexend-light": require("../../assets/fonts/Lexend/static/Lexend-Light.ttf"),
           "lexend-medium": require("../../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
           "lexend-regular": require("../../assets/fonts/Lexend/static/Lexend-Regular.ttf"),
           "lexend-semibold": require("../../assets/fonts/Lexend/static/Lexend-SemiBold.ttf"),
           "lexend-thin": require("../../assets/fonts/Lexend/static/Lexend-Thin.ttf"),
           "SF-Pro-Display": require("../../assets/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf"),
         });
         setFontLoaded(true);
       };
 
       loadFont();
     }, []);
 
     //Lưu ảnh
 
     if (!fontLoaded) {
       return null; // or a loading spinner
     }
     return (
       <View style={styles.container} >
        
         <ImageBackground source={require('../../assets/imagesHealthScreen/imageBackground7.png')} style={styles.image}>     
           <View style={styles.toggleBtn}>
             <TouchableOpacity onPress={() =>navigation.navigate("H_Note")}d style={styles.noneOptionTab}>
               <Text style={styles.noneActive} >Sổ tay</Text>
             </TouchableOpacity>
             <TouchableOpacity  style={styles.OptionTab}>
               <Text  style={styles.TextOptionTab}>Cẩm Nang</Text>
             </TouchableOpacity>
             
           </View>
           <View style={styles.containerHandBook}>
               <View style={styles.containerOptionBtn}>
                    <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
                         <TouchableOpacity onPress={() => setselected("all")} >
                              <View  style={[styles.optionBtn, selected == "all" ? styles.selected : null]}>
                                   <Text style={[styles.optionBtnText, selected == "all" ? styles.selectedText : null]}>
                                        Tất cả
                                   </Text>
                              </View>
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => setselected("dog")} >
                              <View  style={[styles.optionBtn, selected == "dog" ? styles.selected : null]}>
                                   <Text style={[styles.optionBtnText, selected == "dog" ? styles.selectedText : null]}>
                                        Chó
                                   </Text>
                              </View>
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => setselected("cat")} >
                              <View  style={[styles.optionBtn, selected == "cat" ? styles.selected : null]}>
                                   <Text style={[styles.optionBtnText, selected == "cat" ? styles.selectedText : null]}>
                                        Mèo
                                   </Text>
                              </View>
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => setselected("hamster")} >
                              <View  style={[styles.optionBtn, selected == "hamster" ? styles.selected : null]}>
                                   <Text style={[styles.optionBtnText, selected == "hamster" ? styles.selectedText : null]}>
                                        Hamster
                                   </Text>
                              </View>
                         </TouchableOpacity>
                    </ScrollView>
               </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.containerCategory}>
                              <TouchableOpacity onPress={() => navigation.navigate("H_DetailHandBook")}>
                              <View style={styles.Category} >
                                   <Image
                                        style={styles.imgCategory}
                                        source={require("../../assets/images/handbook1.png")}
                                   ></Image>
                                   <Text style={styles.titleCategory}>
                                        Tỉa lông
                                   </Text>
                              </View>
                              </TouchableOpacity>
                              <View style={styles.Category}>
                                   <Image
                                        style={styles.imgCategory}
                                        source={require("../../assets/images/handbook2.png")}
                                   ></Image>
                                   <Text style={styles.titleCategory}>
                                        Tỉa lông
                                   </Text>
                              </View>
                              <View style={styles.Category}>
                                   <Image
                                        style={styles.imgCategory}
                                        source={require("../../assets/images/handbook3.png")}
                                   ></Image>
                                   <Text style={styles.titleCategory}>
                                        Tỉa lông
                                   </Text>
                              </View>
                              <View style={styles.Category}>
                                   <Image
                                        style={styles.imgCategory}
                                        source={require("../../assets/images/handbook1.png")}
                                   ></Image>
                                   <Text style={styles.titleCategory}>
                                        Tỉa lông
                                   </Text>
                              </View>
                              
                         </View>
                    </ScrollView>
            
   
           </View> 
           
         </ImageBackground>  
        

 
       </View>
     );
   }
 
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       position: 'relative',
       zIndex: 1
     },
     image: {
       flex: 1,
       resizeMode: 'cover',
       width: '100%',
       alignItems: 'center',
     //  justifyContent: 'center',
     },
     toggleBtn:{
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'row' ,
     height: '6%',
     width: '80%',
     marginTop:'18%',
     paddingRight:'14%',
     paddingLeft:'14%',
     backgroundColor:'#ffffff',
     borderRadius: 20,
     },
     OptionTab:{
       borderRadius: 20,
       backgroundColor:'#FDDAD4',
       height:'100%',
       width: '80%',
       textAlign:"center",
       justifyContent:"center"
     },
     noneOptionTab:{
       borderRadius: 20,
       backgroundColor:'#ffffff',
       height:'100%',
       width: '80%',
       textAlign:"center",
       justifyContent:"center"
     },
     noneActive:{
       fontFamily: "lexend-medium",
       fontSize:18,
       fontWeight:'bold',
       color:'rgba(165, 26, 41, 0.3)',
       textAlign:"center"
     },
     TextOptionTab:{
       fontFamily: "lexend-medium",
       fontSize:18,
       fontWeight:'bold',
       color:'#A51A29',
       textAlign:"center"
     },
     containerHandBook:{
       backgroundColor:"#FFFFFF",
       width:'100%',
       height:'90%',
       marginTop: '10%',
       borderTopLeftRadius:40,
       borderTopRightRadius:40,
       alignItems:'center',
     },
     containerOptionBtn:{
          marginTop:30,
          height:80,
     },
     optionBtn:{
          borderRadius:20,
          borderWidth: 2,
          minWidth:100,
          borderColor:"#FDDAD4",
          height:45,
          justifyContent:"center",
          alignItems:"center",
          marginLeft:8,
          marginRight:8
     },
     optionBtnText:{
          fontFamily: "lexend-medium",
       fontSize:18,
       fontWeight:'bold',
       color:'#A51A29',
       textAlign:"center"
     },
     selected:{
          
          backgroundColor:"#F5817E"
     },
     selectedText:{
          color:"#ffffff",
     },

     containerCategory:{
          width:"100%",
          height:"auto",
          flexDirection:"row",
          flexWrap:"wrap",
          justifyContent:"space-evenly",
     },
     Category:{
          width:140,
          height:184,
          borderRadius:12,
          borderWidth: 2,
          borderColor:"#F5817E",
          justifyContent:"center",
          alignItems:"center",

          marginTop:20

     },
     imgCategory:{
          width:120,
          height:120,
     },
     titleCategory:{
          fontFamily: "lexend-medium",
          fontSize:18,
          fontWeight:'bold',
          color:'#A51A29',
          textAlign:"center"
     }
   });