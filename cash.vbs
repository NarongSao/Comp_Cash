Dim WinScriptHost
Set WinScriptHost = CreateObject("WScript.Shell")
WinScriptHost.Run Chr(34) & "D:\hosting\cash\cash.bat" & Chr(34), 0
Set WinScriptHost = Nothing