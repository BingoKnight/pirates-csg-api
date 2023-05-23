#!/bin/sh

ECR_REPO=.dkr.ecr.us-east-1.amazonaws.com
SERVICE_NAME=pirates-csg-api
ECR_IMAGE=${SERVICE_NAME}:latest
CONTAINER_PORT=8080
HOST_PORT=8080

aws ecr get-login-password --region us-east-1 --profile pirates-csg-admin | docker login --username AWS --password-stdin ${ECR_REPO}

docker build -t ${SERVICE_NAME} .

docker tag ${ECR_IMAGE} ${ECR_REPO}/${ECR_IMAGE}
docker push ${ECR_REPO}/${ECR_IMAGE}

ssh -T pirates-csg-server <<EOF
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPO}
docker stop ${SERVICE_NAME};
docker rm ${SERVICE_NAME};
docker pull ${ECR_REPO}/${ECR_IMAGE};
docker run --name ${SERVICE_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} --env-file .env ${ECR_REPO}/${ECR_IMAGE};
EOF

