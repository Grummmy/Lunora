import os
import json
logo ="""
                               .-'''-.                      
.---.                         '   _    \\                    
|   |              _..._    /   /` '.   \\                   
|   |            .'     '. .   |     \\  '                   
|   |           .   .-.   .|   '      |  '.-,.--.           
|   |           |  '   '  |\\    \\     / / |  .-. |    __    
|   |   _    _  |  |   |  | `.   ` ..' /  | |  | | .:--.'.  
|   |  | '  / | |  |   |  |    '-...-'`   | |  | |/ |   \\ | 
|   | .' | .' | |  |   |  |               | |  '- `" __ | | 
|   | /  | /  | |  |   |  |               | |      .'.''| | 
'---'|   `'.  | |  |   |  |               | |     / /   | |_
     '   .'|  '/|  |   |  |               |_|     \\ \\._,\\ '/
      `-'  `--' '--'   '--'                        `--'  `" """

command = "node bot.js %name%"

def yesOrNo(ans):
    if ans[0] in ['y', 'д', '+']:
        return True
    return False

print(logo)
print('\n+========================================================================+')
print('Вы запустили файл создания файла запуска Lunora!')
print('Если вы не желаете ставить значение запрашиваемого параметра - нажмити enter\n и будет использовано значение по умолчанию')
print('Данный файл может создавать файлы запуска неограниченное кол-во раз')
print('+========================================================================+\n')
while True:
    filename = input('Как бы вы хотели назвать получившийся .bat файл? Можно использовать любые символы\nТак же, после создания файла его можно будет свободно переименовывать\n').strip()
    if filename:
        if os.path.isfile(f"{filename}.bat"):
            if not yesOrNo(input(f"Файл {filename}.bat уже существует! Перезаписать файл? ")):
                continue
        break
    print('\033[31mНу введи хоть что-нибудь.. не быть же файлу ноунеймом как ты!\033[0m')

print('Введите..')
host = input('Айпи адресс сервера. По умолчанию: localhost | Пример: mc.myserver.fun\n').strip()
if host:
    command = f"{command} --host {host}"

while True:
    version = input('Версия бота. По умолчанию: 1.16.5 | Пример: 1.19.4\n').strip()
    if not version:
        break
    elif all(ch in ['.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] for ch in version):
        command = f"{command} --version {version}"
        break
    print('\033[31mВерсия должна содержать только цифры и точки!\033[0m')

while True:
    port = input('Порт бота, должен быть целым числом. По умолчанию: 25565 | Пример: 25564\n').strip()
    if not port:
        break
    elif port.isdigit():
        command = f"{command} --port {port}"
        break
    print('\033[31mПорт должен быть числом!\033[0m')

brand = input('Название клиента бота, никак не влияет на работу бота.\nПо умолчанию: newUwU | Пример: Optifine\n').strip()
if brand:
    command = f"{command} --brand {brand}"

while True:
    config = input('Файл конфигурации бота, писать без расширения .json.\nПо умолчанию: config | Пример: config2\n').strip()
    if config:
        if os.path.exists(f"{config}.json"):
            command = f"{command} --cfg-file {config}"
            break
    else:
        config = 'config'
        break
    print(f"\033[31mФайл конфигурации {config}.json не найден!\033[0m")

while True:
    captcha = input('Конфигурация капчи из файла конфигурации.\nПо умолчанию: auraland | Пример: politmilitary\n').strip()
    if captcha:
        if os.path.isfile(f"{config}.json"):
            with open(f"{config}.json") as f:
                cfg = json.load(f)
            if captcha in cfg["captcha"]:
                command = f"{command} --captcha {captcha}"
                break
            else:
                print(f"\033[31mКонфигурация капчи {captcha} не найдена в файле {config}.json!\033[0m")
        else:
            break
    else:
        break

while True:
    last_img = input("""Номер изображения для тригера запуска капчи, номера идут от 0 до 999999, включительно.
Номера могут быть найдены в папке maps, можно написать или полный номер, или короткий.
По умолчанию: самое большое число в из выбранной конфигурации капчи | Пример: 10\n""").strip()
    if not last_img:
        break
    elif last_img.isdigit():
        command = f"{command} --trgr-img {last_img}"
        break
    print('\033[31mНомер изображения должен быть числом!\033[0m')

print('\nА далее простенькие ответы да/нет или yes/no или д/н или y/n или даже +/-\n')

s = input('Сохранять ли чат в файл <название сервера>.txt? По умолчанию: не сохранять\n')
if s and yesOrNo(s):
    command += ' -s'
c = input('Складывать и показывать ли капчу? По умолчанию: не складывать и не показывать\n')
if c and yesOrNo(c):
    command += ' -c'
i = input('Использовать ли интерфейс? По умолчанию: не использовать\n')
if i and yesOrNo(i):
    command += ' -i'
tgc = input('Прислать ли капчу через телеграм бота? По умолчаниб: не присылать\nДля отправки капчи через телеграм бота нужно корректно заполнить раздел \033[1mtg\033[0m в \033[1mconfig.json\033[0m\n')
if tgc and yesOrNo(tgc):
    command += ' -tgc'

print('\nПоследний вопрос! Для полной автоматизации запуска вы можете поставить дефолтный никнейм,')
print('если его не ставить, то при запуске файла он просто будет запрашиватся')
username = input('Ну так что, какой никнейм ставим? ').strip()
if username:
    command = command.replace('%name%', username)
else:
    command = f"set \\p name=Введите ник бота \n{command}"
with open(f"""{filename}.bat""", 'w') as file:
    file.write(f"@echo off\nchcp 65001\n{command}")