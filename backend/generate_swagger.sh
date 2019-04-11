#!/usr/bin/env bash
echo "Generating api boilerplate from Swagger definitions"
swagger-codegen/run-in-docker.sh generate -i /input_swagger/swagger.json -l nodejs-server -t /input_swagger -o /gen/generated -DpackageName=MeBa
echo "Copying generated code from codegen directory"
cp -Rf swagger-codegen/generated/* generated/
echo "Copying swagger.yaml to api"
cp -R generated/api/swagger.yaml api/
echo "Copying controllers files"
rm -R api/controllers/*
cp -R generated/controllers api/
echo "Copying newly created service files"
rsync -r --ignore-existing --include=*/ --include=*/.js generated/service api/service
#cp -R generated/service api/