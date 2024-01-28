# untis-ics-sync

[![Node CI](https://github.com/bddvlpr/untis-ics-sync/actions/workflows/node-ci.yaml/badge.svg)](https://github.com/bddvlpr/untis-ics-sync/actions/workflows/node-ci.yaml) [![Docker CD](https://github.com/bddvlpr/untis-ics-sync/actions/workflows/docker-cd.yaml/badge.svg)](https://github.com/bddvlpr/untis-ics-sync/actions/workflows/docker-cd.yaml)

Serves a calendar API (ICS) for events provided from Untis.

## Use case

Some schools, universities, or workspaces do not enable the iCalendar API that Untis provides by default. Due to this limitation, I've written my implementation to dynamically sync class schedules to my agenda.

## Installation

### Using Docker

To deploy a quick Docker environment, fill in the target school credentials in `docker-compose.yml` and start the service by running `docker compose up -d`. Do note that if you'd like to use SSL, add any reverse proxy such as Nginx, Caddy or Traefik. View the table below for all possible environment variables.

### Using NixOS

Firstly add this repository to your flake's inputs.
```nix
{
  inputs = {
    # ...
    untis-ics-sync.url = "github:bddvlpr/untis-ics-sync/<rev/version>";
    untis-ics-sync.inputs.nixpkgs.follows = "nixpkgs";
  };

  # ...
}
```

Secondly, enable the service. Please **DO NOT** use a writeText derivative as this will add your credentials to the Nix store. Use agenix or nix-sops. A local Redis service will automatically be started.
```nix
{
  inputs,
  ...
}: {
  imports = [
    inputs.untis-ics-sync.nixosModules.default
  ];

  services.untis-ics-sync = {
    enable = true;
    envFile = ./; # Path to your credentials.
  };
}
```

## Environment
| Name | Type | Default | Description |
| - | - | - | - |
| UNTIS_SCHOOLNAME | string | `null` | The school's (Untis) service name. |
| UNTIS_USERNAME | string | `null` | The school's user name. |
| UNTIS_PASSWORD | string | `null` | The school's password. |
| UNTIS_BASEURL | string | `null` | The school's (Untis) base-url. |
| BULL_REDIS_HOST | string | `null` | The Redis service hostname or address. |
| BULL_REDIS_PORT | number | `null` | The Redis service port. |
| BULL_REDIS_PATH | string | `null` | The Redis service path for Unix socket connection. |
| CORS_ORIGIN | string | http://localhost:5173 | CORS Origin header to be sent for untis-ics-sync-ui. |
| MAINTENANCE_TITLE | string | `null` | Maintenance notification title. |
| MAINTENANCE_DESCRIPTION | string | `null` | Maintenance notification description. |
| MAINTENANCE_LOCATION | string | `null` | Maintenance notification location. |
| LESSONS_TIMETABLE_BEFORE | number | 7 | The amount of days to fetch before today. |
| LESSONS_TIMETABLE_AFTER | number | 14 | The amount of days to fetch after today. |
