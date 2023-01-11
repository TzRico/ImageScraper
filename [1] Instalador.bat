@echo off
title Launch

if exist node_modules\ (
  echo Você já instalou isso
  echo Navegue até o diretório global ou o diretório privado
) else (
  echo Os módulos serão instalados.
  pause  
  call npm i >> NUL
  echo Instalado com sucesso!
  echo Execute novamente este arquivo.
)