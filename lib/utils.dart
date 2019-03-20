import 'package:flutter/material.dart';


ListTile generateFormLine({String initialValue, Function saveAction, Icon leadingIcon, String hintText, bool isMandatory=false, TextInputType keyboardType=TextInputType.text}) {
  return new ListTile(
      leading: leadingIcon,
      title: new TextFormField(
        initialValue: initialValue,
        onSaved: (value) => saveAction(value),
        textAlign: TextAlign.left,
        decoration: InputDecoration(hintText: hintText),
        keyboardType: keyboardType,
        validator: (value) {
          if (isMandatory && value.isEmpty) {
            return "Mandatory field. Do not lreave blank";
          }
        },
      )
  );
}