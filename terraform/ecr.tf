resource "aws_ecr_repository" "ecr-repo" {
  name = local.service_name
  tags = {
      service =  local.service_name
  }
}

resource "aws_ecr_lifecycle_policy" "ecr-repo-lifecycle-policy" {
  repository = aws_ecr_repository.ecr-repo.name
  policy = jsonencode({
    "rules" : [
      {
        "rulePriority" : 1,
        "description" : "Keep last 3 images only",
        "selection" : {
          "tagStatus" : "any",
          "countType" : "imageCountMoreThan",
          "countNumber" : 3
        },
        "action" : {
          "type" : "expire"
        }
      }
    ]
  })
}

