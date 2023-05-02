resource "aws_ecs_cluster" "pirates_csg_api_cluster" {
  name = "${local.service_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "pirates_csg_api_task_definition" {
  family                   = local.service_name
  execution_role_arn       = aws_iam_role.pirates_csg_api_ecs_execution_role.arn
  task_role_arn            = aws_iam_role.pirates_csg_api_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  depends_on = [aws_ecr_repository.ecr-repo]

  container_definitions = jsonencode([
    {
      name               = local.service_name
      image              = "${aws_ecr_repository.ecr-repo.repository_url}:latest"
      essential          = true
      environment        = local.environment_variables
      secrets            = local.secret_variables

      logConfiguration = {
        logDriver = "awslogs"
        options   = {
          awslogs-group  = aws_cloudwatch_log_group.pirates_csg_api_log_group.name
          awslogs-region = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }

      portMappings = [
        {
          containerPort = local.service_port
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "pirates_csg_api" {
  name            = local.service_name
  cluster         = aws_ecs_cluster.pirates_csg_api_cluster.id
  task_definition = aws_ecs_task_definition.pirates_csg_api_task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = local.ecs_desired_count

  lifecycle {
  #   # Allow autoscaling to modify desired_count without upsetting Terraform
  #   # Comment out when intentionally modifing desired count because this will block that change
    ignore_changes = [desired_count]
  }

  network_configuration {
    security_groups  = data.aws_security_groups.private.ids
    subnets          = data.aws_subnets.private.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.pirates_csg_api_lb_tg.arn
    container_name   = aws_ecs_task_definition.pirates_csg_api_task_definition.family
    container_port   = local.service_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
}

resource "aws_appautoscaling_target" "pirates_csg_api_autoscaling_target" {
  max_capacity       = local.ecs_max_count
  min_capacity       = local.ecs_desired_count
  resource_id        = "service/${aws_ecs_cluster.pirates_csg_api_cluster.name}/${aws_ecs_service.pirates_csg_api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "pirates_csg_api_request_scaling_policy" {
  name               = "PiratesCsgAPIRequestScaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${aws_lb.pirates_csg_api_alb.arn_suffix}/${aws_lb_target_group.pirates_csg_api_lb_tg.arn_suffix}"
    }
    scale_out_cooldown = 10
    scale_in_cooldown  = 60
    target_value       = 20
  }
}

resource "aws_appautoscaling_policy" "pirates_csg_api_cpu_scaling_policy" {
  name               = "PiratesCsgAPICPUScaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_out_cooldown = 15
    scale_in_cooldown  = 60
    target_value       = 50
  }
}

resource "aws_appautoscaling_policy" "pirates_csg_api_memory_scaling_policy" {
  name               = "PiratesCsgAPIMemoryScaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.pirates_csg_api_autoscaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    scale_out_cooldown = 15
    scale_in_cooldown  = 60
    target_value       = 50
  }
}

