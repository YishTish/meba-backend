
import 'package:flutter/material.dart';

import '../models/User.dart' show User;
import '../controllers/UserController.dart' show UserController;
import '../utils.dart' as utils;
import '../main.dart' show MeBaHomePage;


class LoginPage extends StatelessWidget{

  final User user;
  LoginPage({this.user});

  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text("Register"),
      ),
      body: new SignInBody(user:user)
    );
  }
}

class SignInBody extends StatefulWidget{

  final User user;
  SignInBody({this.user});
//  SignIn _signIn = new SignIn();

  SignInState createState(){
    return new SignInState();
  }
}

class SignInState extends State<SignInBody>{

  Widget build(BuildContext context){
    return new Column(
      children: <Widget>[
        Container(
          child: Center(
            child: Text("You need to sign in. Please click below to sign in with your Google Account"),
          ),
        ),
        LoginForm(widget.user)
      ],
    );
  }
}

class LoginForm extends StatefulWidget{
  final User user;
  LoginForm (this.user);

  @override
  UserFormState createState() {
    return new UserFormState();
  }

}

class UserFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();


  @override
  Widget build(BuildContext context) {
    User user = widget.user;
    return Form(
        autovalidate: true,
        key: _formKey,
        child:
        Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            utils.generateFormLine(initialValue: user.firstName, leadingIcon: Icon(Icons.text_fields), hintText: "First Name", saveAction: (value) => user.firstName = value, isMandatory: false),
            utils.generateFormLine(initialValue: user.lastName, leadingIcon: Icon(Icons.text_fields), hintText: "Last Name", saveAction: (value) => user.lastName = value, isMandatory: false),
            utils.generateFormLine(initialValue: user.phoneNumber, leadingIcon: Icon(Icons.phone), hintText: "Phone Number", saveAction: (value) => user.phoneNumber = value, isMandatory: true, keyboardType: TextInputType.number),
            Container(
              alignment: Alignment.center,
              margin: EdgeInsets.symmetric(horizontal: 10, vertical: 30),
              child: RaisedButton(
                  onPressed: (){
                    _formKey.currentState.save();
                    new UserController().addUser(user);
                    },
                  color: Colors.blue,
                  textColor:  Colors.white,
                  child: Text("Register")
              ),
            )
          ],
        )
    );
  }

  void saveUserAndReturnToMain(){
    _formKey.currentState.save();
    new UserController().addUser(widget.user);
    Route route = MaterialPageRoute(
        builder: (context) => MeBaHomePage(initialUser: user));
    Navigator.pushReplacement(context, route);

  }
}

