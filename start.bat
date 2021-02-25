@echo off
::添加Server配置项并修改长度变量
SET SERVER_CONFIG_Length=5
SET SERVER_CONFIG[0].Type=center-server
SET SERVER_CONFIG[0].Count=1
SET SERVER_CONFIG[1].Type=http-server
SET SERVER_CONFIG[1].Count=1
SET SERVER_CONFIG[2].Type=connect-server
SET SERVER_CONFIG[2].Count=1
SET SERVER_CONFIG[3].Type=game-server
SET SERVER_CONFIG[3].Count=1
SET SERVER_CONFIG[4].Type=web-server
SET SERVER_CONFIG[4].Count=1

cd %cd%

call:startAllServer
pause
exit

:startAllServer
for /l %%i in (1,1,%SERVER_CONFIG_Length%) do (
	setlocal enabledelayedexpansion
	SET /A index=%%i-1
	::获取Type、Count
	for /F "usebackq delims==. tokens=1-3" %%I IN (`SET SERVER_CONFIG[!index!]`) DO (
	  	SET SERVER_CONFIG.%%J=%%K
	)
	::遍历获得服务器具体配置
	for /l %%j in (1,1,!SERVER_CONFIG.Count!) do (
		SET /A jindex=%%j-1
		SET Type=!SERVER_CONFIG.Type!
		SET Count=!SERVER_CONFIG.Count!
		SET Name=!Type!!jindex!
		echo:!jindex! - Name:!Name! Type:!Type! Count:!Count!
		::循环业务逻辑
		start "!Name!" /MIN node ./!Type!/app !jindex!
		echo:start server : !Name!
	)
)


echo:-----------all server start over-----------
choice /C:er /M:"exit or restart all server:"
if %errorlevel%==1 call:exit
if %errorlevel%==2 call:restart
GOTO:EOF

:closeAllServer

for /l %%i in (1,1,%SERVER_CONFIG_Length%) do (
	setlocal enabledelayedexpansion
	SET /A index=%%i-1
	::获取Type、Count
	for /F "usebackq delims==. tokens=1-3" %%I IN (`SET SERVER_CONFIG[!index!]`) DO (
	  	SET SERVER_CONFIG.%%J=%%K
	)
	::遍历获得服务器具体配置
	for /l %%j in (1,1,!SERVER_CONFIG.Count!) do (
		SET /A jindex=%%j-1
		SET Type=!SERVER_CONFIG.Type!
		SET Count=!SERVER_CONFIG.Count!
		SET Name=!Type!!jindex!
		echo:!jindex! - Name:!Name! Type:!Type! Count:!Count!
		::循环业务逻辑
		taskkill /FI "WINDOWTITLE eq !Name!" /IM node.exe /F
		echo:close server : !Name!
	)
)

echo:-----------all server close over-----------
GOTO:EOF

:exit
call:closeAllServer
exit
GOTO:EOF

:restart
call:closeAllServer
call:startAllServer
GOTO:EOF


::遍历服务器数组模板
:serverArrForTemplate

for /l %%i in (1,1,%SERVER_CONFIG_Length%) do (
	setlocal enabledelayedexpansion
	SET /A index=%%i-1
	::获取Type、Count
	for /F "usebackq delims==. tokens=1-3" %%I IN (`SET SERVER_CONFIG[!index!]`) DO (
	  	SET SERVER_CONFIG.%%J=%%K
	)
	::遍历获得服务器具体配置
	for /l %%j in (1,1,!SERVER_CONFIG.Count!) do (
		SET /A jindex=%%j-1
		SET Type=!SERVER_CONFIG.Type!
		SET Count=!SERVER_CONFIG.Count!
		SET Name=!Type!!jindex!
		echo:!jindex! - Name:!Name! Type:!Type! Count:!Count!
	)
)

GOTO:EOF
