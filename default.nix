{pkgs ? import <nixpkgs> {}}:
with pkgs;
  mkYarnPackage rec {
    pname = "untis-ics-sync";
    version = "0.5.6";

    src = ./.;

    offlineCache = fetchYarnDeps {
      yarnLock = src + "/yarn.lock";
      hash = "sha256-CByo097pqAiGBjfNR82EQQLM8hCRAySQrHJOG0NHYCc=";
    };

    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;

    buildPhase = ''
      export HOME=$(mktemp -d)
      yarn --offline build
    '';

    distPhase = "true";
  }
