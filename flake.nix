{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs @ {
    self,
    flake-parts,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
        "x86_64-linux"
      ];

      perSystem = {pkgs, ...}: {
        formatter = pkgs.alejandra;

        packages = rec {
          default = pkgs.callPackage ./default.nix {};
          untis-ics-sync = default;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [nodejs yarn nest-cli];
        };
      };

      flake = {
        nixosModules = rec {
          default = import ./module.nix self;
          untis-ics-sync = default;
        };
      };
    };
}
