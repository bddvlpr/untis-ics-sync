{pkgs ? import <nixpkgs> {}}:
with pkgs;
  mkYarnPackage rec {
    pname = "untis-ics-sync";
    version = "0.5.0";

    src = ./.;

    offlineCache = fetchYarnDeps {
      yarnLock = src + "/yarn.lock";
      hash = "sha256-HZ+8N/IWux/WsJrcTiTB3ajfwr+s3vcQPrunLqUoaXk=";
    };

    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;

    buildPhase = ''
      export HOME=$(mktemp -d)
      yarn --offline build
    '';

    distPhase = "true";
  }
