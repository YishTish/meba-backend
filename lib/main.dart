import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';
import 'package:http/http.dart' as http;
import 'package:MeBa/User.dart' as User;
import 'package:MeBa/Event.dart' as Event;


void main() {
  runApp(new MeBa());
}

  // This widget is the root of your application.

class MeBa extends StatelessWidget {
//  final Future<User> user;

//  MeBa({Key key, this.user}) : super(key: key);

  @override
  Widget build(BuildContext context){
    return MaterialApp(
      title: "MeBa Application",
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new MeBaHomePage(title: "MeBa Application"),
      );
  }
}

class MeBaHomePage extends StatefulWidget {
  MeBaHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MeBaHomePageState createState(){
    print("Create state!");
    return new _MeBaHomePageState();
  }
}

class _MeBaHomePageState extends State<MeBaHomePage> {
  var userList = <User.User>[];
  var num = 0;

  _getUsers() async{
    final stream = await User.getUsers();
    stream.listen((user) => setState(() => userList.add(user)));
  }

  @override
  void initState() {
    print("now let's init state");
    // TODO: implement initState
    super.initState();
    num = 6;
    _getUsers();
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title + num.toString()),
      ),
      body: _buildUserList(),
//      body: new ListView(
//        children: userList.map((user) => new UserWidget(user)).toList(),
//      )
    );
  }

  Widget _buildUserList(){
    return new ListView.separated(
      separatorBuilder: (context, index) => Divider(
        color: Colors.black,
      ),
      itemCount: this.userList.length,
      itemBuilder: (context, index) => Padding(
          padding: EdgeInsets.all(2.0),
          child: Center(child: new UserWidget(userList[index]))
        )
    );
  }
}

class UserListView extends ListView{
  UserListView(this.users);
  final List<User.User> users;

  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 20,
      itemBuilder: (context, index) =>
          Padding(
              padding: EdgeInsets.all(8.0),
              child: Center(child: Text(users[index].lastName))
          ),
    );
  }
}

class RandomWordState extends State<RandomWords>{
  final List<WordPair>_suggestions = <WordPair>[];
  final TextStyle _biggerFont = const TextStyle(fontSize: 18.0);
  final Set<WordPair> _saved = new Set<WordPair>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Startup Name Generator'),
        actions: <Widget> [
          new IconButton(icon: const Icon(Icons.list), onPressed: _pushSaved),
        ]
      ),
      body: _buildSuggestions(),
    );
  }

  void _pushSaved(){
    Navigator.of(context).push(
      new MaterialPageRoute<void>(
        builder: (BuildContext context) {
          final Iterable<ListTile> tiles = _saved.map(
              (WordPair pair) {
                return new ListTile(
                    title: new Text(
                      pair.asPascalCase,
                      style: _biggerFont
                    )
                );
              }
          );
        final List<Widget> divided = ListTile
          .divideTiles(
            context: context,
            tiles: tiles,
        ).toList();

        return new Scaffold(
          appBar: new AppBar(
            title: const Text("Saved Suggerstions"),
          ),
          body: new ListView(children: divided),
        );
        },
      ),
    );
  }


  Widget _buildSuggestions(){
    return ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemBuilder: (context, i){
          if(i.isOdd) return Divider();

          final index = i ~/ 2;
          if(index >= _suggestions.length){
            _suggestions.addAll(generateWordPairs().take(10));
          }
          return _buildRow(_suggestions[index]);
        }
        );
  }

  Widget _buildRow(WordPair pair){
    final bool alreadySaved = _saved.contains(pair);
    return ListTile(
      title: Text(
        pair.asPascalCase,
        style: _biggerFont
      ),
      trailing: new Icon(
        alreadySaved ? Icons.favorite : Icons.favorite_border,
        color: alreadySaved ? Colors.red : null,
      ),
      onTap: () {
        setState(() {
          if(alreadySaved){
            _saved.remove(pair);
          }
          else{
            _saved.add(pair);
          }
        });
      },
    );
  }
}

class RandomWords extends StatefulWidget{
  RandomWordState createState() =>new RandomWordState();
}

class UserWidget extends StatelessWidget{
  UserWidget(this.user);
  final User.User user;

  @override
  Widget build(BuildContext context){
    return new GestureDetector(
      child: (
          new ListTile(
            leading: new CircleAvatar(
              child: new Text(user.firstName[0]+user.lastName[0]),
              backgroundColor: Colors.purple,
            ),
            title: new Text(user.firstName + " " + user.lastName),
            subtitle: new Text(user.dateOfBirth),
            isThreeLine: false,
          )
      ),
      onTap: (){
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => Event.EventRoute(user.firstName))
        );
      },
    );
  }

//    return new ListTile(
//      leading: new CircleAvatar(
//        child: new Text(user.firstName[0]+user.lastName[0]),
//        backgroundColor: Colors.purple,
//      ),
//      title: new Text(user.firstName + " " + user.lastName),
//      subtitle: new Text(user.dateOfBirth),
//      isThreeLine: false,
//    );
//    FutureBuilder<User>(
//      future: getUser(),
//      builder: (context, snapshot) {
//        if(snapshot.hasData){
//          return Text(snapshot.data.firstName);
//        }
//        else if (snapshot.hasError){
//          return Text("${snapshot.error}");
//        }
//        return CircularProgressIndicator();
//      },
//    );
//  }
}

//class _UserState extends State<UserWidget> {
////  var userList = <Users.User>[];
////
////  _getUsers() async{
////    final stream = await Users.getUser();
////    stream.listen((user) => setState(() => userList.add(user)));
////  }
////
////  @override
////  void initState() {
////    // TODO: implement initState
////    super.initState();
////    _getUsers();
////  }
////
////  @override
////  Widget build(BuildContext context) {
////    // TODO: implement build
////    return new Scaffold(
////      appBar: new AppBar(
////        title: new Text(widget.title),
////      ),
////      body: new ListView(
////        children: userList.map((user) => new UserWidget(user)).toList(),
////      ),
////    );
////  }
////
////}
