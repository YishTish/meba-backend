import 'dart:convert';

import 'package:MeBa/User.dart' as User;
import 'package:flutter/material.dart';

class EventRoute extends StatelessWidget{
  EventRoute(this.eventName);
  final String eventName;
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(this.eventName),
      ),
      body: new EventBody()
    );
  }
}

class EventBody extends StatefulWidget{
  @override
  EventState createState() {
    return new EventState();
  }
}

class EventState extends State<EventBody>{

  @override
  Widget build(BuildContext context) {
    return new Column(
        children: <Widget>[
          TextWidget("Location: 2323 Street one, Ohio"),
          TextWidget("Time: 22:00:00 EST"),
          TextWidget("Organizer: Bob"),
          TextWidget("Number of people coming: 12"),
          new Container(
            color: Colors.black12,
            child: new Row(
              children: <Widget>[
               IconButton(
                 icon: Icon(Icons.thumb_up),
                 tooltip: "Coming",
                 color: Colors.green,
                 iconSize: 45,
                 onPressed: (){print("I am coming!");},
               ),
               Container(width: 200,),
               IconButton(
                 icon: Icon(Icons.thumb_down),
                 tooltip: "Not Coming",
                 iconSize: 45,
                 color: Colors.red,
                 onPressed: (){print("I am not coming!");},
               ),
              ],
              mainAxisAlignment: MainAxisAlignment.center,
            ),
//            padding: EdgeInsets.all(50),
//            margin: EdgeInsets.all(50),

          )
        ],
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      verticalDirection: VerticalDirection.down,
      crossAxisAlignment: CrossAxisAlignment.start,
    );
  }
}

class TextWidget extends StatelessWidget{
  TextWidget(this.text);
  final String text;

  Widget build(BuildContext context){
    return Container(
      padding: EdgeInsets.all(18),
      child: Text(this.text,
        textAlign: TextAlign.right,
        style: TextStyle(
          color: Colors.blue,
          fontSize: 25,
          fontFamily: 'roboto',
        ),
      )
    );
  }

}