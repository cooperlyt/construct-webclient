
echo "********************************************************"
echo "build project by docker";
echo "********************************************************"

#sh -c "docker build -f Dockerfile.compile -t ng-app-build . &&  docker run --name ng-app-build ng-app-build  && docker cp ng-app-build:/usr/src/app/dist ./dist/  && docker build -f Dockerfile.package -t coopersoft/construct-archives-webclient:v1 ."
# snapshot
# latest
#docker rm -f ng-app-build


docker build -t coopersoft/construct-webclient:1.0.1 .
docker login
docker push coopersoft/construct-webclient:1.0.1