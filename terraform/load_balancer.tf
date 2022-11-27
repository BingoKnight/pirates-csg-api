resource "random_string" "alb_tg_suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "aws_lb_target_group" "pirates_csg_api_lb_tg" {
  name        = "${local.service_name}-lb-tg-${random_string.alb_tg_suffix.result}"
  port        = local.service_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.main.id

  health_check {
    enabled             = true
    interval            = 300
    protocol            = "HTTP"
    path                = "/v1/health"
    matcher             = "200-299"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 10
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb" "pirates_csg_api_alb" {
  name               = "${local.service_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = data.aws_security_groups.public.ids
  subnets            = data.aws_subnets.public.ids 

  enable_deletion_protection = true
  idle_timeout               = 60

  # access_logs {
  #   bucket  = aws_s3_bucket.sync_producer_api_lb_access_logs.bucket
  #   enabled = true
  # }

  tags = {
    Environment = terraform.workspace
  }
}

resource "aws_lb_listener" "pirates_csg_api_listener" {
  load_balancer_arn = aws_lb.pirates_csg_api_alb.arn
  port              = "80"
  protocol          = "HTTP"
  # port              = "443"
  # protocol          = "HTTPS"
  # ssl_policy        = "ELBSecurityPolicy-2016-08"
  # certificate_arn   = aws_acm_certificate.pirates_csg_certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.pirates_csg_api_lb_tg.arn
  }
}

