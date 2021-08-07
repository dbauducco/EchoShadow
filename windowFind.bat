:loop
tasklist /FI "WINDOWTITLE eq Untitled - Notepad"
`.\\resources\\winSK.exe` -d -i 1000 -w "Untitled - Notepad" Test1
timeout /t 5
tasklist /FI "WINDOWTITLE eq Untitled - Notepad"
`.\\resources\\winSK.exe` -d -i 1000 -w "Untitled - Notepad" Test2
".//resources//winSK.exe" -w "Untitled - Notepad" Test
timeout /t 5
goto loop