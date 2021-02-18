@echo off
set exedir=%cd%\tool\protoc-gen-lua\protobuf-lua\
set prodir=%cd%\protocol
set builddir=F:\Git\ggame\koa-game-client\Assets\Resources\AB\lua\pb


::生成语句
set code=--plugin=protoc-gen-lua="%exedir%\plugin\protoc-gen-lua.bat" --lua_out=%builddir% -I %prodir% 

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
echo Build Procotol File:!var!

%exedir%protoc.exe !code!!var!

)



pause