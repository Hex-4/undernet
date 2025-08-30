import time
import board
import digitalio

led = digitalio.DigitalInOut(board.GP16)
led.direction = digitalio.Direction.OUTPUT
u = 0.35

def dit():
    led.value = True
    time.sleep(1*u)
    led.value = False
    time.sleep(1*u)
    
def dah():
    led.value = True
    time.sleep(3*u)
    led.value = False
    time.sleep(1*u)
    
def char():
    led.value = False
    time.sleep(2*u)
    
def word():
    led.value = False
    time.sleep(6*u)

def signal(s):
    for i in s:
        if i == "-":
            dah()
        elif i == ".":
            dit()
        elif i == " ":
            char()

while True:
    signal("-.... ----- ..--- ----.")
    word()
    print("STARTING")