@echo off
cd %cd%
cd ..
cd ..

set prodir=%cd%\tool\protobuf\protocol
set luadir=%cd%\tool\protobuf\plugins\protobuf-lua\
set jsonpbbuilddir=%cd%\pb\
set luapbbuilddir=..\koa-game-client\Assets\Resources\AB\lua\pb\

for /R %prodir% %%f in (*.proto) do ( 
	echo Build Lua_pb File:%luapbbuilddir%%%~nf_pb.lua.txt
	%luadir%protoc.exe --plugin=protoc-gen-lua="%luadir%plugin\protoc-gen-lua5_3.bat" --lua_out=%luapbbuilddir% -I %prodir% %%f
	echo Build Json_pb File:%jsonpbbuilddir%%%~nf_pb.json
	node ./node_modules/protobufjs/bin/pbjs %%f > %jsonpbbuilddir%%%~nf_pb.json
)


pause