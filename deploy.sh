#!/bin/sh

aws ecr get-login-password --region us-east-1 --profile pirates-csg-admin | docker login --username AWS --password-stdin 785117170351.dkr.ecr.us-east-1.amazonaws.com

docker build -t pirates-csg-api .

docker tag pirates-csg-api:latest 785117170351.dkr.ecr.us-east-1.amazonaws.com/pirates-csg-api:latest

docker push 785117170351.dkr.ecr.us-east-1.amazonaws.com/pirates-csg-api:latest

aws ecs update-service --service pirates-csg-api --cluster pirates-csg-api-cluster --force-new-deployment --profile pirates-csg-admin

