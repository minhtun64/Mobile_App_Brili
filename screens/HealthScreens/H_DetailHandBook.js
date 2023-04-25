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
               <View style={styles.containerback}> 
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <Image
                         style={styles.back}
                         source={require("../../assets/icons/back.png")}
                         ></Image>
                    </TouchableOpacity>
               </View>
               <View style={styles.containerOptionBtn}>
                    <ScrollView  showsVerticalScrollIndicator={false}>
                         <View style={styles.newsItem}>
                              <Image
                                   style={styles.newsAvt}
                                   source={require("../../assets/images/avtNews.png")}
                              ></Image>
                              <View style={styles.newsText}>
                                   <Text style={styles.newsTitle}>
                                        Những loại thực phẩm tốt cho tiêu hóa cún nhà bạn !!!
                                   </Text>
                                   <Text style={styles.newsDes}>
                                        Mọi loài nên có một chế độ ăn uống phù hợp về mặt sinh học, và. . .
                                   </Text>
                              </View>
                         </View>
                         <View style={styles.newsItem}>
                              <Image
                                   style={styles.newsAvt}
                                   source={require("../../assets/images/avtNews.png")}
                              ></Image>
                              <View style={styles.newsText}>
                                   <Text style={styles.newsTitle}>
                                        Những loại thực phẩm tốt cho tiêu hóa cún nhà bạn !!!
                                   </Text>
                                   <Text style={styles.newsDes}>
                                        Mọi loài nên có một chế độ ăn uống phù hợp về mặt sinh học, và. . .
                                   </Text>
                              </View>
                         </View>
                         <View style={styles.newsItem}>
                              <Image
                                   style={styles.newsAvt}
                                   source={require("../../assets/images/avtNews.png")}
                              ></Image>
                              <View style={styles.newsText}>
                                   <Text style={styles.newsTitle}>
                                        Những loại thực phẩm tốt cho tiêu hóa cún nhà bạn !!!
                                   </Text>
                                   <Text style={styles.newsDes}>
                                        Mọi loài nên có một chế độ ăn uống phù hợp về mặt sinh học, và. . .
                                   </Text>
                              </View>
                         </View>
                         <View style={styles.newsItem}>
                              <Image
                                   style={styles.newsAvt}
                                   source={require("../../assets/images/avtNews.png")}
                              ></Image>
                              <View style={styles.newsText}>
                                   <Text style={styles.newsTitle}>
                                        Những loại thực phẩm tốt cho tiêu hóa cún nhà bạn !!!
                                   </Text>
                                   <Text style={styles.newsDes}>
                                        Mọi loài nên có một chế độ ăn uống phù hợp về mặt sinh học, và. . .
                                   </Text>
                              </View>
                         </View>
                         <View style={styles.newsItem}>
                              <Image
                                   style={styles.newsAvt}
                                   source={require("../../assets/images/avtNews.png")}
                              ></Image>
                              <View style={styles.newsText}>
                                   <Text style={styles.newsTitle}>
                                        Những loại thực phẩm tốt cho tiêu hóa cún nhà bạn !!!
                                   </Text>
                                   <Text style={styles.newsDes}>
                                        Mọi loài nên có một chế độ ăn uống phù hợp về mặt sinh học, và. . .
                                   </Text>
                              </View>
                         </View>
                    </ScrollView>
               </View>
                    
   
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
     containerback:{
          flexDirection:"row",
          justifyContent:"flex-start",
          width:"100%",
          marginLeft:"10%"
     },
     back: {
          width: 34,
          height: 30,
          marginTop: 8,

     },
     newsItem:{
          flexDirection:"row",
          marginLeft:"5%",
          marginRight:"44%",
     },
     newsAvt:{
          width:150,
          height:150,
          marginRight:10
     },
     newsTitle:{
          fontFamily: "lexend-medium",
          fontSize:14,
          fontWeight:'bold',
          color:'#A51A29',
          marginTop:8

     },
     newsDes:{
          fontFamily: "lexend-medium",
          fontSize:13,
          fontWeight:'bold',
          color:'rgba(165, 26, 41, 0.7)',
          marginTop:8
     
     }
    
   });