resource "aws_secretsmanager_secret" "secrets" {
    name = "${local.service_name}-secrets-manager"
    tags = {
        environment = terraform.workspace
    }
}

resource "aws_secretsmanager_secret_version" "default_secrets" {
    secret_id     = aws_secretsmanager_secret.secrets.id
    secret_string = jsonencode(var.secrets)
}

