@echo off
set luadir=%cd%\tool\protoc-gen-lua\protobuf-lua\
set prodir=%cd%\protocol
set builddir=F:\Git\ggame\koa-game-client\Assets\Resources\AB\lua\pb

cd %cd%

::生成语句
set code=--plugin=protoc-gen-lua="%luadir%\plugin\protoc-gen-lua5_3.bat" --lua_out=%builddir% -I %prodir% 

::遍历procotol所在子文件夹
for /f "delims=" %%i in ('dir /ad/b/s "%prodir%"') do (
setlocal enabledelayedexpansion
set var=%%i
::echo !var!
set code=!code!-I !var! 
)

echo %code%
::导出所有procotol
for /R %prodir% %%f in (*.proto) do ( 
setlocal enabledelayedexpansion
set var=%%f
set file_name=%%~nf
::导出Lua
echo Build Procotol File:!var!
%luadir%protoc.exe !code!!var!
::导出json
node ./node_modules/protobufjs/bin/pbjs -t json !var! > ./pb/!file_name!.json
)



pause