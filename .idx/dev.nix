# Google Project IDX Configuration
# See: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05";

  # Development packages
  packages = [
    pkgs.nodejs_22
    pkgs.pnpm
    pkgs.python312Full
    pkgs.python312Packages.pip
    pkgs.python312Packages.numpy
    pkgs.git
    pkgs.gh
    pkgs.zip
    pkgs.unzip
  ];

  # Environment variables
  env = {};

  idx = {
    # VS Code extensions
    extensions = [
      "dbaeumer.vscode-eslint"
      "ms-python.python"
      "bradlc.vscode-tailwindcss"
    ];

    # Workspace lifecycle hooks
    workspace = {
      onCreate = {
        install-deps = "pnpm install";
      };
      onStart = {};
    };

    # Live browser previews
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["pnpm", "run", "dev", "--", "--port", "$PORT", "--hostname", "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
