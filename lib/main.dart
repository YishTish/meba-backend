
import 'dart:convert';
import 'dart:typed_data';
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'login.dart' as Login;
import 'models/User.dart' show User;
import 'package:MeBa/controllers/EventController.dart' as EventController;
import 'models/Event.dart' as EventModel;
import 'views/NewEvent.dart' as EventForm;
import 'views/EventsList.dart' show EventsPage;
import 'views/SignInForm.dart' show LoginPage;

void main() {
  runApp(new MeBa());
}

class MeBa extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "MeBa Application",
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new MeBaHomePage(initialUser: null),
    );
  }
}

class MeBaHomePage extends StatefulWidget {
  MeBaHomePage({Key key, this.initialUser}) : super(key: key);
  final User initialUser;


  @override
  State createState() => new _MeBaHomePageState();
}

class _MeBaHomePageState extends State<MeBaHomePage> {
  User user;
  _MeBaHomePageState() {
    Login.SignIn signIn = new Login.SignIn();
    signIn.handleSignIn().then((signedInUser){
      if(widget.initialUser == null){
        if(signedInUser.userId == null){
          loadSignInPage(signedInUser);
        }
        else{
          setState(() {
            user = signedInUser;
          });
        }
      }
    });
  }

  void loadSignInPage(User user){
    Route route = MaterialPageRoute(
        builder: (context) => LoginPage(user: user));
    Navigator.pushReplacement(context, route);
  }

  @override
  Widget build(BuildContext context) {
    if (this.user == null) {
      return new Container();
    } else {
      return new EventsPage(user:this.user);
//      return new Scaffold(
//        appBar: new AppBar(
//          leading: new CircleAvatar(
//            radius: 15,
//            backgroundImage: NetworkImage(user.profileImageBase64),
//          ),
//          title: new Text(user.firstName + " " + user.lastName)
//        ),
//        body: new EventsWidget(),
//        floatingActionButton: new FloatingActionButton(
//          onPressed: _routeToForm,
//            child: new IconButton(
//                icon: Icon(Icons.add),
//                color: Colors.white,
//                onPressed: _routeToForm),
//        )
//      );
    }
  }

  void _routeToForm(){
    Route route = MaterialPageRoute(builder: (context) => EventForm.EventRoute(EventController.EventController.createEvent()));
    Navigator.push(context, route);
  }

//  Widget _buildUserList() {
//    return new ListView.separated(
//        separatorBuilder: (context, index) => Divider(
//              color: Colors.black,
//            ),
//        itemCount: this.userList.length,
//        itemBuilder: (context, index) => Padding(
//            padding: EdgeInsets.all(2.0),
//            child: Center(child: new UserWidget(userList[index]))));
//  }
}
//
class EventsWidget extends StatefulWidget {
  EventsState createState() {
    return new EventsState();
  }
}
//
class EventsState extends State {
  EventController.EventController eventController;
  List<EventModel.Event> events;

  @override
  void initState() {
    if (events == null) {
      events = new List();
    }
    super.initState();
    eventController = new EventController.EventController();
    eventController.getEvents((newEvents) {
      this.setState(() => {this.events = newEvents});
    });
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new ListView.separated(
        separatorBuilder: (context, index) => Divider(
              height: 1,
              color: Colors.black45,
            ),
        itemCount:events.length,
        itemBuilder: (context, index) => Padding(
            padding: EdgeInsets.all(2.0),
            child: EventItem(events[index]
        )
      )
    );
  }
}

class EventItem extends StatelessWidget {
  final EventModel.Event event;
  EventItem(this.event);

  Widget build(BuildContext context) {
    Color iconColor = Colors.blue;
    return ListTile(
        leading: CircleAvatar(
            backgroundColor: Colors.blue, child: Text(event.name[0])),
        title: Text(event.name),
        subtitle: Text(event.eventDateTime),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            IconButton(
              iconSize: 20,
              alignment: Alignment(0, 0),
              disabledColor: Colors.yellow,
              color: iconColor,
              icon: Icon(FontAwesomeIcons.handPointUp),
              onPressed: (() {
                print("Clicked on Icon");
              }),
              splashColor: Colors.green,
              highlightColor: Colors.blue,
            ),
            IconButton(
              iconSize: 20,
              alignment: Alignment(0, 0),
              disabledColor: Colors.yellow,
              color: iconColor,
              icon: Icon(FontAwesomeIcons.handPointDown),
              onPressed: (() {
                print("Clicked on Icon");
              }),
              splashColor: Colors.green,
              highlightColor: Colors.blue,
            ),
            IconButton(
              iconSize: 20,
              alignment: Alignment(0, 0),
              disabledColor: Colors.yellow,
              color: iconColor,
              icon: Icon(FontAwesomeIcons.bell),
              onPressed: (() {
                print("Clicked on Icon");
              }),
              splashColor: Colors.green,
              highlightColor: Colors.blue,
            )
          ],
        ));
  }
}
