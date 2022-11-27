locals {
  base_role_policy = jsonencode(
    {
      Statement = [
        {
          Action    = "sts:AssumeRole"
          Effect    = "Allow"
          Sid       = ""
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          }
        }
      ]
      Version   = "2012-10-17"
    }
  )
}

resource "aws_iam_role" "pirates_csg_api_role" {
  name = "${local.service_name}-role"

  assume_role_policy = local.base_role_policy
}

resource "aws_iam_role" "pirates_csg_api_ecs_execution_role" {
  name = "${local.service_name}-ecs-execution-role"

  assume_role_policy = local.base_role_policy
}

resource "aws_iam_policy" "policy_secrets" {
   name        = "${local.service_name}SecretsPermission"
   description = "${local.service_name}SecretsPermission"

   policy = <<EOF
{
     "Version": "2012-10-17",
     "Statement": [
       {
           "Sid": "",
           "Effect": "Allow",
           "Action": [
               "secretsmanager:*"
           ],
           "Resource": "*"
       }
     ]
}
 EOF
}

resource "aws_iam_policy" "deploy_in_vpc" {
  name        = "${local.service_name}DeployInVpc"
  description = "${local.service_name}DeployInVpc"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "",
          "Effect": "Allow",
          "Action": [
            "ec2:DescribeNetworkInterfaces",
            "ec2:CreateNetworkInterface",
            "ec2:DeleteNetworkInterface",
            "ec2:DescribeInstances",
            "ec2:AttachNetworkInterface"
          ],
          "Resource": "*"
      }
    ]
}
EOF
}

resource "aws_iam_policy" "s3_access" {
  name        = "${local.service_name}S3Access"
  description = "${local.service_name}S3Access"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "",
          "Effect": "Allow",
          "Action": [
            "s3:*"
          ],
          "Resource": "*"
      }
    ]
}
EOF
}

resource "aws_iam_policy" "cloudwatch_access" {
  name        = "${local.service_name}CloudwatchAccess"
  description = "${local.service_name}CloudwatchAccess"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "",
          "Effect": "Allow",
          "Action": [
            "cloudwatch:*"
          ],
          "Resource": "*"
      }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_ecs_task_execution_access" {
  role       = aws_iam_role.pirates_csg_api_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "attach_ecs_secrets_access" {
  role       = aws_iam_role.pirates_csg_api_ecs_execution_role.name
  policy_arn = aws_iam_policy.policy_secrets.arn
}

resource "aws_iam_role_policy_attachment" "attach_deploy_in_vpc" {
  role       = aws_iam_role.pirates_csg_api_role.name
  policy_arn = aws_iam_policy.deploy_in_vpc.arn
}

resource "aws_iam_role_policy_attachment" "attach_s3_access" {
  role       = aws_iam_role.pirates_csg_api_role.name
  policy_arn = aws_iam_policy.s3_access.arn
}

resource "aws_iam_role_policy_attachment" "attach_policy_secrets" {
  role       = aws_iam_role.pirates_csg_api_role.name
  policy_arn = aws_iam_policy.policy_secrets.arn
}

resource "aws_iam_role_policy_attachment" "attach_cloudwatch_access" {
  role       = aws_iam_role.pirates_csg_api_role.name
  policy_arn = aws_iam_policy.cloudwatch_access.arn
}

