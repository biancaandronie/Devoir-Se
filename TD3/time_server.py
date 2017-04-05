"""
@author Andronie Bianca
@version 0.1
@date 05.04.2017
"""
import socket
import time


# get local machine name
host = socket.gethostname()

port = 6666
# create a socket object
serversocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# bind to the port
serversocket.bind((host, port))

serversocket.setblocking(0)

print "Le serveur a commence."
while True:
    try:
        data, addr = serversocket.recvfrom(1024)   
        print time.ctime(time.time()) + str(addr) + ": " + str(data)
    except:
	pass
serversocket.close()
