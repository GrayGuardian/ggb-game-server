#!/usr/bin/python
#coding=utf-8
import sys
import os
reload(sys)
sys.setdefaultencoding('utf-8')

import xlrd

jsRoot = "../../common/template/"
luaRoot = "../../../ggb-game-client/Assets/Resources/AB/lua/template/"
xlsfile = os.getcwd()+"\\template.xlsx" # 打开指定路径中的xls文件
book = xlrd.open_workbook(xlsfile)#得到Excel文件的book对象，实例化对象

config = [
	{"name":"role","sheet":"角色表"}
];


def writeToFile( name,sheet ):
	nrows = sheet.nrows
	if nrows <= 3:
		print "必须大于3行"
		return
	names = sheet.row_values(1)
	types = sheet.row_values(2)

	jsContent = "const tpl=[\n";
	luaContent = "local tpl={\n"

	for x in xrange(3,nrows):
		jsContent +="{"
		luaContent+="{"
		values = sheet.row_values(x);
		for i in xrange(len(values)):
			# print names[i],types[i],values[i]
			value = str(values[i])
			if types[i] == "int":
				value = str(int(values[i]))
			elif types[i] == "float":
				value = str(values[i])
			elif types[i] == "bool":
				try:
					value = "true" if 0!=int(values[i]) else 'false';
				except ValueError as e:
					value = "false"
			elif types[i] == "string":
				value = str("'"+values[i]+"'")
			elif types[i] == "array":
				value = str(values[i])

			# print names[i],types[i],value
			jsContent += names[i]+":"+value+","
			luaContent+=names[i]+"="+value+","

		jsContent +="},\n"
		luaContent+="},\n"
			
	jsContent += "]\n"
	jsContent += "module.exports = tpl"
	luaContent+="}\n"
	luaContent += "return tpl"

	# print(jsContent)
	# print(luaContent)

	filePath = jsRoot+"template_"+name+".js"
	fnew = open(filePath, "w")
	fnew.write(jsContent);
	print "Build Js Name:"+name+" File:"+filePath

	filePath = luaRoot+"template_"+name+".lua.txt"
	fnew = open(filePath, "w")
	fnew.write(luaContent);
	print "Build Lua Name:"+name+" File:"+filePath



for info in config:
	sheet = book.sheet_by_name(info["sheet"]) # 通过sheet索引获得sheet对象
	
	jsTplContent = "const Template = {};\n"


	writeToFile(info["name"],sheet)
