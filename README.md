# untis-ics-sync

Serves a calendar API (ICS) for events provided from Untis.

## Use case

Some schools, universities or workspaces do not enable the iCalendar API that Untis provides by default.
Due to this limitation I've wrote my own implementation to dynamically sync class schedules to my agenda.

## Installation

Simply clone the repository and cd into it.  
`git clone https://github.com/bddvlpr/untis-ics-sync && cd untis-ics-sync`.

### Setup SSL

Create a new directory called `ssl` with certificate `cert.pem` and key `key.pem` in it. Make sure to enable https in the `.env` file.

### Using Docker

To run the app using Docker, copy over the `.env.example` to `.env` and fill in the parameters to get the app to work.

Deploy the app using `docker compose up -d`, remove it using `docker compose down -v`.

### Using Yarn

To run the app using Yarn, copy over the `.env.example` to `.env` and fill in the parameters to get the app to work.

Hotrun the app using `yarn dev`, or build it using `yarn build`.
