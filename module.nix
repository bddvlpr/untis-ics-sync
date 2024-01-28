self: {
  config,
  lib,
  pkgs,
  ...
}: let
  cfg = config.services.untis-ics-sync;
in {
  options.services.untis-ics-sync = let
    inherit (lib) mkEnableOption mkPackageOption mkOption types;
    inherit (pkgs.stdenv.hostPlatform) system;
  in {
    enable = mkEnableOption "Untis ICS Sync";
    package = mkPackageOption self.packages.${system} "default" {};

    envFile = mkOption {
      type = types.path;
      description = "The environment file with credentials.";
    };

    user = mkOption {
      type = types.str;
      default = "untis-ics-sync";
      description = "The user to run untis-ics-sync under.";
    };
    group = mkOption {
      type = types.str;
      default = "untis-ics-sync";
      description = "The group to run untis-ics-sync under.";
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.untis-ics-sync = {
      description = "untis-ics-sync";
      wantedBy = ["multi-user.target"];
      wants = ["network-online.target"];
      after = ["network-online.target"];

      serviceConfig = {
        Restart = "on-failure";
        ExecStart = "${lib.getExe cfg.package}";
        Environment = [
          "BULL_REDIS_PATH=${config.services.redis.servers.untis-ics-sync.unixSocket}"
        ];
        EnvironmentFile = cfg.envFile;
        User = cfg.user;
        Group = cfg.group;
      };
    };

    services.redis.servers.untis-ics-sync = {
      enable = true;
      user = cfg.user;
    };

    users = {
      users.untis-ics-sync = lib.mkIf (cfg.user == "untis-ics-sync") {
        isSystemUser = true;
        group = cfg.group;
      };
      groups.untis-ics-sync = lib.mkIf (cfg.group == "untis-ics-sync") {};
    };
  };
}
