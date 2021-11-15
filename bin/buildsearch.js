a = new ActiveXObject("scripting.filesystemobject")
x = new ActiveXObject("wscript.shell")
b = x.exec('findstr /b \"' + WScript.Arguments(0) + '\" build\\DISPLAY.CONF')

entries = []

while (!b.stdout.atendofstream)
{
  c = b.stdout.readline()
  d = c.indexOf("#")

  if (d >= 0)
  {
    c = c.substr(0, d)
  }

  if (c.indexOf("[eof]") >= 0)
  {
    break
  }

  if (c.length > 0)
  {
    entries.push(c)
  }
}

a.createtextfile(WScript.Arguments(1)).write(";\r\n; Game count\r\n;\r\n; This file is automatically generated\r\n;\r\n" + "!word " + "         ".substr(0, 8 - entries.length.toString().length) + entries.length + "\r\n")

source = a.createtextfile("build\\okvs.tmp")
source.writeline("*=0")
source.writeline("!le16 " + entries.length + ", 0")

for (i = 0; i < entries.length; i++)
{
  bits = entries[i].indexOf(",")
  dhgr = entries[i].substr(bits - 2, 1)
  cheat = entries[i].substr(bits - 1, 1)
  eq = entries[i].indexOf("=")
  key = ((eq >= 0) ? entries[i].substr(bits + 1, eq - bits - 1) : entries[i])
  value = ((eq >= 0) ? entries[i].substr(eq + 1) : "")
  source.writeline("!byte " + (key.length + value.length + 5).toString())
  source.writeline("!byte " + key.length)
  source.writeline("!text \"" + key + "\"")
  source.writeline("!byte " + value.length)
  source.writeline("!text \"" + value + "\"")
  source.writeline("!byte 1")
  source.writeline("!byte " + ((dhgr * 128) + Number(cheat)))
}

source.close()
new ActiveXObject("wscript.shell").run('cmd /c %acme% -o ' + WScript.Arguments(2) + ' build\\okvs.tmp', 0, 1)
