data "aws_route_table" "internal_route_table" {
  subnet_id = data.aws_subnets.private.ids[0]
}
