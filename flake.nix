{
  description = "A TUI for managing Hyprland workspaces and monitors";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_24
          bun
          nodePackages.typescript
        ];

        shellHook = ''
          echo "Node version: $(node -v)"
          echo "Bun version: $(bun -v)"
        '';
      };
    };
}
