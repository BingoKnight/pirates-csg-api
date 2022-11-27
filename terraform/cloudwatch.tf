resource "aws_cloudwatch_log_group" "pirates_csg_api_cluster_log_group" {
  name              = "${local.service_name}-ecs-cluster"
  retention_in_days = 120

  tags = {
    Environment = terraform.workspace
  }
}

resource "aws_cloudwatch_log_group" "pirates_csg_api_log_group" {
  name              = "ecs/${local.service_name}-logs"
  retention_in_days = 120

  tags = {
    Environment = terraform.workspace
  }
}

