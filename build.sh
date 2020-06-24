
echo "********************************************************"
echo "build project by docker";
echo "********************************************************"

#sh -c "docker build -f Dockerfile.compile -t ng-app-build . &&  docker run --name ng-app-build ng-app-build  && docker cp ng-app-build:/usr/src/app/dist ./dist/  && docker build -f Dockerfile.package -t coopersoft/construct-archives-webclient:v1 ."
# snapshot
# latest
#docker rm -f ng-app-build


docker build -t coopersoft/construct-webclient:latest .
docker login
docker push coopersoft/construct-webclient:latest