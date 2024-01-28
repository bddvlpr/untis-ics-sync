# untis-ics-sync

Serves a calendar API (ICS) for events provided from Untis.

## Use case

Some schools, universities, or workspaces do not enable the iCalendar API that Untis provides by default. Due to this limitation, I've written my implementation to dynamically sync class schedules to my agenda.

## Installation

Simply clone the repository and cd into it using `git clone https://github.com/bddvlpr/untis-ics-sync && cd untis-ics-sync`.
If you're planning on using Docker, you could use the [bddvlpr/untis-ics-sync](https://hub.docker.com/r/bddvlpr/untis-ics-sync/) image from Docker Hub instead of the git repository.

## Redis

Version 0.7.0 and above require a redis server to be supplied in environment variables for queue processing. Either externally provide one, or define one in a Docker compose environment.

### Setup SSL

From version 0.2.6 and forward, SSL will not be natively supported anymore. Please use a reverse proxy instead of supplying the docker container with an SSL certificate.

### Using Docker

To run the app using Docker, copy over the `.env.example` to `.env` and fill in the parameters to get the app to work.
Deploy the app (in a test environment) using `docker run -d --env-list .env -p 3000:3000 bddvlpr/untis-ics-sync`.

### Using Yarn

To run the app using Yarn, copy over the `.env.example` to `.env` and fill in the parameters to get the app to work.
Hot run the app using `yarn start:dev`, or build it using `yarn build`.

