APP_RUN_DIR=/home/educa/edupia.vn/nodejs/chatio/run
LOG_FILE=$APP_RUN_DIR/logcript.txt
case "$1" in
start)
    {
    while :		
            do
            service=`cat $APP_RUN_DIR/chatio.nodejs.pid`
            if (( $(ps -ef | grep -v grep | grep $service | wc -l) > 0 ))
            then
                echo "$(date) : $service is running!!!" >>$LOG_FILE
            else
                node bin/www 1>>logchatio.log 2>>logchatio.error &
                echo $!>$APP_RUN_DIR/chatio.nodejs.pid
            fi
		sleep 30
            done
    }&      
	echo $!>$APP_RUN_DIR/start.bash.pid
 
    ;;
stop)
   kill `cat $APP_RUN_DIR/start.bash.pid`
   rm $APP_RUN_DIR/start.bash.pid
   kill `cat $APP_RUN_DIR/chatio.nodejs.pid`
   rm $APP_RUN_DIR/chatio.nodejs.pid
   ;;
restart)
   $0 stop
   $0 start
   ;;
status)
   if [ -e $APP_RUN_DIR/start.bash.pid ]; then
      echo start bash shell is running, pid=`cat $APP_RUN_DIR/start.bash.pid`
   else
      echo bash shell is NOT running
      exit 1
   fi
   ;;
*)
   echo "Usage: $0 {start|stop|status|restart}"
esac
exit 0
