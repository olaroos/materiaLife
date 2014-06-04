# -*- coding: ISO-8859-1-*-

import json
import os
import cgi
import codecs
 

openFile = codecs.open('data', 'r', 'utf-8')
fileData = openFile.read()
openFile.close()


j = json.loads(fileData, encoding="utf-8")
print json.dumps(j,ensure_ascii=False)


 
