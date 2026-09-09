@echo off
echo [*] Compiling CryptoTrace C-Core (libtracer.dll)...
gcc -shared -o libtracer.dll -O3 tracer_core.c
if %ERRORLEVEL% EQU 0 (
    echo [+] Compilation successful: libtracer.dll
) else (
    echo [!] Compilation failed with error code %ERRORLEVEL%
)
