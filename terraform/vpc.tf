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

resource "aws_vpc_endpoint" "mongo_atlas_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.vpce.us-east-1.vpce-svc-0b6ab6d74d4856940"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = data.aws_security_groups.private.ids
  subnet_ids          = data.aws_subnets.private.ids
}

