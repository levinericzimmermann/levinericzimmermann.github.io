with (import <nixpkgs> {});
with pkgs;
with pkgs.python310Packages;

let

  asciiMagic = buildPythonPackage rec {
    pname = "ascii-magic";
    version = "2.3.0";
  
    src = fetchPypi {
      pname = "ascii_magic";
      inherit version;
      sha256 = "sha256-PtQaHLFn3u1cz8YotmnzWjoD9nvdctzBi+X/2KJkPYU=";
    };
  
    propagatedBuildInputs = [
      colorama
      pillow
    ];
  
    # Project is not tagging releases and tests are not shipped with PyPI source
    doCheck = false;
  
    pythonImportsCheck = [
      "ascii_magic"
    ];
  
  };

  mypython = python310.buildEnv.override {
    extraLibs = with python310Packages; [
      asciiMagic
    ];
  };

in

  mkShell {
      buildInputs = [
          mypython
      ];

  }
