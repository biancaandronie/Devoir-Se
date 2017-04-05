"""
@author Andronie Bianca
@version 0.1
@date 05.04.2017
"""

import socket
import threading

th = threading.Lock()
fermer = False

print "Pour fermer le chat vous devez appuyer sur 'w'"

def fonction(name, sock):
    while not fermer: 
        try:
            th.acquire()
            while True:
                data, addr = sock.recvfrom(1024)
        except:
            pass
        finally:
            th.release()

host = socket.gethostname()

port = 6666

server = (host, port)

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

s.connect((host, port))

s.setblocking(0)

recv_th = threading.Thread(target=fonction, args=("RecvThread",s))

recv_th.start()

s.sendto("Usager qui est dans le chat",server)

message = raw_input("Introduire: ")

while message != 'w':
    if message != '':
        s.sendto(message, server)
    th.acquire()
    message = raw_input("Introduire: ")
    th.release()

s.sendto("L'usager a ete deconnecte",server)

fermer = True
recv_th.join()
s.close()
