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

resource "aws_vpc_endpoint" "secretsmanager_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.secretsmanager"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = data.aws_security_groups.private.ids
  subnet_ids          = data.aws_subnets.private.ids
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ecr_dkr_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = data.aws_security_groups.private.ids
  subnet_ids          = data.aws_subnets.private.ids
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ecr_api_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.ecr.api"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = data.aws_security_groups.private.ids
  subnet_ids          = data.aws_subnets.private.ids
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "logs_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.logs"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = data.aws_security_groups.private.ids
  subnet_ids          = data.aws_subnets.private.ids
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "s3_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type   = "Gateway"
  route_table_ids     = [data.aws_route_table.internal_route_table.route_table_id]
}

resource "aws_vpc_endpoint" "mongo_atlas_endpoint" {
  vpc_id              = data.aws_vpc.main.id
  service_name        = "com.amazonaws.vpce.us-east-1.vpce-svc-0b6ab6d74d4856940"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = data.aws_security_groups.private.ids
  subnet_ids          = data.aws_subnets.private.ids
}

