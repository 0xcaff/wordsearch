terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "0xcaff"

    workspaces {
      name = "wordsearch"
    }
  }
}

provider "google" {
  credentials = var.google_credentials
  project = "wordsearch-172001"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_pubsub_topic" "default" {
  name = "data-firebase-import"
}

resource "google_cloud_scheduler_job" "data-firebase-import-periodically" {
    name        = "data-firebase-import-periodically"
    schedule    = "* * * * *"
    time_zone   = "America/Los_Angeles"

    pubsub_target {
        attributes = {}
        data       = ""
        topic_name = "projects/wordsearch-172001/topics/projects/wordsearch-172001/topics/data-firebase-import"
    }
}

resource "google_cloudfunctions_function" "default" {
  name = "function-1"
  runtime = "nodejs10"
  entry_point = "helloWorld"
  environment_variables = {}
  trigger_http = true
}