import 'dart:io';
import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:http/http.dart' as http;

import 'models/User.dart' show User;
import 'controllers/UserController.dart' show UserController;
import 'utils.dart' as utils;


final GoogleSignIn _googleSignIn = GoogleSignIn();
final FirebaseAuth _auth = FirebaseAuth.instance;

class SignIn{
  FirebaseUser _firebaseUser;
  String _userImage64;

  Future<User> handleSignIn() async {
    final GoogleSignInAccount googleUser = await _googleSignIn.signIn();
    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    final memberDetails = await http.get("http://10.0.2.2:3000/v1/member/123",
      headers: {HttpHeaders.authorizationHeader: "Bearer "+googleAuth.idToken});
    if(memberDetails.statusCode != 200){
      print("status code: "+ memberDetails.statusCode.toString());
      print(memberDetails.body);
    }
    else{
      print(memberDetails.body);
    }

    final AuthCredential credential = GoogleAuthProvider.getCredential(idToken: googleAuth.idToken, accessToken: googleAuth.accessToken);
    this._firebaseUser = await _auth.signInWithCredential(credential);

    User user = await new UserController().getUser(_firebaseUser.uid);
    if(user.userId == null) {
      List<String> nameArray = _firebaseUser.displayName.split(" ");
      user.firstName = nameArray[0] ?? "";
      user.lastName = nameArray[1] ?? "";
      user.identifier = _firebaseUser.uid;
      await getUserImageBase64().then((base64String) => user.profileImageBase64 = base64String);
      user.profileImageBase64 = await getUserImageBase64();
    }
    return user;
  }

  Future<String> getUserImageBase64() async {
    final response = await http.get(_firebaseUser.photoUrl);
    if(response.statusCode == 200 ){
      String imageBase64 = base64.encode(response.bodyBytes);
      print(imageBase64);
      return imageBase64;
    }
    else{
      return "";
    }
  }

  get user => _firebaseUser;
  get userImageBase64  => _userImage64;
}

//class LoginPage extends StatelessWidget{
//
//  final FirebaseUser user;
//  LoginPage({this.user});
//
//  Widget build(BuildContext context){
//    return Scaffold(
//      appBar: AppBar(
//        title: Text("Sign In"),
//      ),
//      body: new SignInBody(user:user)
//    );
//  }
//}
//
//class SignInBody extends StatefulWidget{
//
//  final FirebaseUser user;
//  SignInBody({this.user});
////  SignIn _signIn = new SignIn();
//
//  SignInState createState(){
//    return new SignInState();
//  }
//}
//
//class SignInState extends State<SignInBody>{
//
//  Widget build(BuildContext context){
//    return new Column(
//      children: <Widget>[
//        Container(
//          child: Center(
//            child: Text("You need to sign in. Please click below to sign in with your Google Account"),
//          ),
//        ),
//        LoginForm(widget.user)
//      ],
//    );
//  }
//
//  buttonPressed() async{
//    print("Pressed function");
//    SignIn signIn = new SignIn();
//    try{
//      await signIn.handleSignIn();
//      print(signIn.user);
//    }
//    catch(e){
//      print("Failed to sign in");
//      print(e);
//    }
//  }
//
//}
//
//class LoginForm extends StatefulWidget{
//  final FirebaseUser user;
//  LoginForm (this.user);
//
//  @override
//  UserFormState createState() {
//    return new UserFormState();
//  }
//
//}
//
//class UserFormState extends State<LoginForm> {
//  final _formKey = GlobalKey<FormState>();
//  FirebaseUser _user;
//
//  @override
//  Widget build(BuildContext context) {
//    _user = widget.user;
//    return Form(
//      autovalidate: true,
//      key: _formKey,
//      child:
//        Column(
//          mainAxisSize: MainAxisSize.min,
//          crossAxisAlignment: CrossAxisAlignment.start,
//          children: <Widget>[
//            utils.generateFormLine(initialValue: '', leadingIcon: Icon(Icons.text_fields), hintText: "First Name", saveAction: (value) => _user.firstName = value, isMandatory: false),
//            utils.generateFormLine(initialValue: '', leadingIcon: Icon(Icons.text_fields), hintText: "Last Name", saveAction: (value) => _user.lastName = value, isMandatory: false),
//            utils.generateFormLine(initialValue: '', leadingIcon: Icon(Icons.phone), hintText: "Phone Number", saveAction: (value) => _user.phoneNumber = value, isMandatory: true, keyboardType: TextInputType.number),
//            Container(
//              alignment: Alignment.center,
//              margin: EdgeInsets.symmetric(horizontal: 10, vertical: 30),
//              child: RaisedButton(
//                onPressed: null,
//                color: Colors.blue,
//                textColor:  Colors.white,
//                child: Text("Register")
//              ),
//            )
//          ],
//        )
//    );
//  }
//}