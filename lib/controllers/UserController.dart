import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'package:MeBa/models/User.dart' show User;


class UserController{

  UserController() {
    Firestore.instance.settings(timestampsInSnapshotsEnabled: true);
  }

  User returnUserModel(QuerySnapshot records){
    if(records.documents.length > 0){
       DocumentSnapshot record = records.documents[0];
       return new User(
           userId: record['id'],
           identifier: record['identifier'],
           firstName: record['firstName'],
           lastName: record['lastName'],
           phoneNumber: record['phoneNumber']
       );
    }
    return new User();
  }

  Future<User> getUser(String identifier){
    return Firestore.instance.collection("members").where("identifier", isEqualTo: identifier).limit(1).getDocuments()
        .then((users) => returnUserModel(users));
  }

  Future<User> findUserByPhone(String phoneNumber){
    return Firestore.instance.collection("members").where("phoneNumber", isEqualTo: phoneNumber).limit(1).getDocuments()
        .then((users) => returnUserModel(users));
  }

  void addUser(User user){
    Firestore.instance.collection("members").document("NewUniqueId").setData({
      "profileImageBase64":user.profileImageBase64,
      "identifier": user.identifier,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "phoneNumber": user.phoneNumber
    });
  }
}