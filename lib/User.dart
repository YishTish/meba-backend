import 'dart:convert';

import 'package:http/http.dart' as http;

class User{
  final int userId;
  final String firstName;
  final String lastName;
  final String dateOfBirth;

  User({this.userId, this.firstName, this.lastName, this.dateOfBirth});

  User.fromJson(Map jsonMap)
    : userId = jsonMap['user_id'],
    firstName = jsonMap['first_name'],
      lastName = jsonMap['last_name'],
      dateOfBirth = jsonMap['date_of_birth'];
}

Future<Stream<User>> getUsers() async {

  var client = new http.Client();
  var url =  Uri.parse("http://10.0.2.2:3000");
  print(url.path);
  var streamedResponse = await client.send(new http.Request("get",url));

  return streamedResponse.stream
  .transform(utf8.decoder)
  .transform(json.decoder)
  .expand((jsonBody) => (jsonBody as List))
  .map((jsonUser) => new User.fromJson(jsonUser));
//  if (response.statusCode == 200){
//    return User.fromJson(json.decode(response.body));
//  }
//  else{
//    throw Exception('Failed to load user');
//  }
}



