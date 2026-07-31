@echo off
start "Laravel" cmd /c "cd /d E:\vyarufoodTiffin\backend && php artisan serve --host=0.0.0.0 --port=8000"
start "Angular" cmd /c "cd /d E:\vyarufoodTiffin\admin && ng serve --host 0.0.0.0 --port 4200"
echo Both servers starting...
echo Angular: http://localhost:4200
echo Laravel: http://localhost:8000
