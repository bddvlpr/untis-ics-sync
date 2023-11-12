{pkgs ? import <nixpkgs> {}}:
with pkgs;
  mkYarnPackage rec {
    pname = "untis-ics-sync";
    version = "0.5.7";

    src = ./.;

    offlineCache = fetchYarnDeps {
      yarnLock = src + "/yarn.lock";
      hash = "sha256-NHghkf5Nziyz3M7E4941sV5JFqY7RYMTlZqYsQPZLpU=";
    };

    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;

    buildPhase = ''
      export HOME=$(mktemp -d)
      yarn --offline build
    '';

    distPhase = "true";
  }
