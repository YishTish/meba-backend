import 'package:flutter/material.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../models/User.dart' show User;
import '../models/Event.dart' show Event;
import '../controllers/EventController.dart' show EventController;
import '../views/NewEvent.dart' show EventRoute;


class EventsPage extends StatefulWidget {
  EventsPage({Key key, this.user}) : super(key: key);
  final User user;

  @override
  State createState() => new _EventsPageState();
}

class _EventsPageState extends State<EventsPage> {
  User user;

  @override
  void initState() {
    super.initState();
    setState(() {user = widget.user;});
  }

  @override
  Widget build(BuildContext context) {
    if (this.user == null) {
      return new Container();
    } else {
      return new Scaffold(
          appBar: new AppBar(
              leading: new CircleAvatar(
                radius: 15,
                backgroundImage: NetworkImage(user.profileImageBase64),
              ),
              title: new Text(user.firstName + " " + user.lastName)
          ),
          body: new EventsWidget(),
          floatingActionButton: new FloatingActionButton(
            onPressed: _routeToForm,
            child: new IconButton(
                icon: Icon(Icons.add),
                color: Colors.white,
                onPressed: _routeToForm),
          )
      );
    }
  }

  void _routeToForm(){
    Route route = MaterialPageRoute(builder: (context) => EventRoute(EventController.createEvent()));
    Navigator.push(context, route);
  }
}

class EventsWidget extends StatefulWidget {
  EventsState createState() {
    return new EventsState();
  }
}
//
class EventsState extends State {
  EventController eventController;
  List<Event> events;

  @override
  void initState() {
    if (events == null) {
      events = new List();
    }
    super.initState();
    eventController = new EventController();
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
  final Event event;
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
