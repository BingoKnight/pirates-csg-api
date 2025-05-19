SERVICE_NAME=pirates-csg-api
CONTAINER_STATUS=$(docker ps -f name=$SERVICE_NAME -f status=exited | awk 'NR==2')

if [ -z $CONTAINER_STATUS ]
then
    docker start ${SERVICE_NAME}
fi
