#!/bin/sh

ECR_REPO=785117170351.dkr.ecr.us-east-1.amazonaws.com
SERVICE_NAME=pirates-csg-api
ECR_IMAGE=${SERVICE_NAME}:latest
CONTAINER_PORT=8080
HOST_PORT=8080

aws ecr get-login-password --region us-east-1 --profile pirates-csg-admin | docker login --username AWS --password-stdin ${ECR_REPO}

docker build -t ${SERVICE_NAME} .

docker tag ${ECR_IMAGE} ${ECR_REPO}/${ECR_IMAGE}
docker push ${ECR_REPO}/${ECR_IMAGE}

rsync -azP docker-compose-prod.yml pirates-csg-server:~/docker-compose.yml

ssh -T pirates-csg-server <<EOF
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPO};
docker compose pull pirates-csg-app;
docker compose down pirates-csg-app;
docker compose up pirates-csg-app -d;
EOF

