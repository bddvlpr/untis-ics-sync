{
  mkYarnPackage,
  fetchYarnDeps,
  makeWrapper,
  lib,
  nodejs,
}:
mkYarnPackage rec {
  pname = "untis-ics-sync";
  version = "0.7.3";

  src = ./.;

  offlineCache = fetchYarnDeps {
    yarnLock = src + "/yarn.lock";
    hash = "sha256-9PL3HMN26sGmcDzEAaPpuAApISYOILByj1eJJIMlO9A=";
  };

  nativeBuildInputs = [makeWrapper];

  packageJSON = ./package.json;
  yarnLock = ./yarn.lock;

  buildPhase = ''
    yarn --offline run build
  '';

  postInstall = ''
    makeWrapper ${lib.getExe nodejs} "$out/bin/untis-ics-sync" \
      --add-flags "$out/libexec/untis-ics-sync/deps/untis-ics-sync/dist/main.js"
  '';

  meta = with lib; {
    description = "Serves a calendar API (ICS) for events provided from Untis";
    homepage = "https://github.com/bddvlpr/untis-ics-sync";
    license = licenses.bsd3;
    maintainers = with maintainers; [bddvlpr];
    mainProgram = "untis-ics-sync";
  };
}
