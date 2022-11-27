locals {
  service_name = "pirates-csg-api"
  service_port = 8000
  ecs_desired_count = 2
  ecs_max_count = 8

  environment_variables = [
    {
      name  = "ENV_TYPE"
      value = "production"
    },
    {
      name  = "PORT"
      value = "8000"
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
      name      = "MONGO_CONNECTION_URI"
      valueFrom = "${aws_secretsmanager_secret.secrets.arn}:MONGO_CONNECTION_URI::"
    }
  ]
}

