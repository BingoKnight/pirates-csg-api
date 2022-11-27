data "aws_vpc" "main" {
  filter {
    name  = "tag:Name"
    values = ["pirates-csg-vpc"]
  }
}

data "aws_security_groups" "private" {
  filter {
    name   = "group-name"
    values = ["private-sg"]
  }
}

data "aws_security_groups" "public" {
  filter {
    name   = "group-name"
    values = ["public-sg"]
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "tag:Name"
    values = ["privatesn-*"]
  }
}

data "aws_subnets" "public" {
  filter {
    name   = "tag:Name"
    values = ["publicsn-*"]
  }
}

