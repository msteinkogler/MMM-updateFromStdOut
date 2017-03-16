# MMM-updateFromStdOut
A Magic Mirror module to receive input via stdout from a program running in the background
and updating the mirror with this information. Initially used for receiving temperature readings from
a USB DVB-T stick acting as a 433Mhz SDR, receiving input from a cheap wireless weather sensor (GT-WT-01).

This is published more as a template to use output received via stdout from any arbitrary program running in the background. 
And also so I don't forget the stuff I learned in the course of implementing this ;)

# If you want to use it as I did
I used [this blog entry](http://goughlui.com/2013/12/20/rtl-sdr-433-92mhz-askook-decoding-of-various-devices-with-rtl_433/)
as a starting point, which will lead you to installing [rtl_433](https://github.com/merbanan/rtl_433). When you tweaked the
parameters for rtl_433 right to receive and parse your weather stations's output, customize node_helper.js to use these
command line parameters.

# Stuff I learned
1. **In this case, use spawn, not exec.**

   You use the *spawn* method with the *detached* parameter set to *true* to keep the spawned program running in the background

2. **Socket communication needs to be initialized by the module code**

   If *node_helper.js* wants to communicate with the module code (in my case *MMM-updateFromStdOut.js*) via sockets , then the 
   *module code* needs to initialize communication (i.e. send the first request via the socket). Only then can 
   *node_helper.js* send stuff via the socket connection.
