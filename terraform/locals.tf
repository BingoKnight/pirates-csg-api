locals {
  service_name = "pirates-csg-api"
  service_port = 8000
  ecs_desired_count = 1
  ecs_max_count = 8

  environment_variables = [
    {
      name  = "NODE_ENV"
      value = "production"
    },
    {
      name  = "PORT"
      value = "8000"
    },
    {
      name  = "BASE_URL"
      value = "https://api.piratescsg.net"
    }
  ]

  secret_variables = [
    {
      name      = "DB_USER"
      valueFrom = "${aws_secretsmanager_secret.secrets.arn}:DB_USER::"
    },
    {
      name      = "DB_PASSWORD"
      valueFrom = "${aws_secretsmanager_secret.secrets.arn}:DB_PASSWORD::"
    },
    {
      name      = "DB_NAME"
      valueFrom = "${aws_secretsmanager_secret.secrets.arn}:DB_NAME::"
    },
    {
      name      = "MONGO_CONNECTION_URI"
      valueFrom = "${aws_secretsmanager_secret.secrets.arn}:MONGO_CONNECTION_URI::"
    },
    {
      name      = "JWT_SECRET"
      valueFrom = "${aws_secretsmanager_secret.secrets.arn}:JWT_SECRET::"
    }
  ]
}

