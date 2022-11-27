variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_profile" {
  type    = string
  default = "pirates-csg-admin"
}

variable "secrets" {
  type      = any
  sensitive = true
}

