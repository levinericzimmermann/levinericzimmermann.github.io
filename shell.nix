# Please see https://matthewrhone.dev/jekyll-in-nixos
with (import <nixpkgs> {});

let

  env = bundlerEnv {
    name = "levin-webpage";
    inherit ruby;
    gemfile = ./Gemfile;
    lockfile = ./Gemfile.lock;
    gemset = ./gemset.nix;
  };


in

  stdenv.mkDerivation {
    name = "levin-webpage";
    buildInputs = [
      env
      ruby
      mypython
    ];
    shellHook = ''
    exec ${env}/bin/jekyll serve --watch
    '';
  }
