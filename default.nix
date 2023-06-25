{pkgs ? import <nixpkgs> {}, ...}:
with pkgs;
  mkYarnPackage rec {
    name = "untis-ics-sync";
    version = "0.4.1";

    src = ./.;

    offlineCache = fetchYarnDeps {
      yarnLock = src + "/yarn.lock";
      sha256 = "1rws4lcyr32jmk5glvn42wq2p2scply2zsyy4r4bgl0mz59zz3i4";
    };

    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;

    buildPhase = ''
      export HOME=$(mktemp -d)
      yarn --offline build
    '';

    distPhase = "true";
  }
