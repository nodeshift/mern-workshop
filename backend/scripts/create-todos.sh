#!/bin/bash

numTodos=5
if [ ! -z $1 ] ; then
  numTodos=$1
fi

theAuthor="NodeConf"

counter=1
while [ $counter -le $numTodos ] ; do
  todoData="{\"author\":\"$theAuthor\",\"task\": \"Task $counter\"}"
  curl -X POST -H 'Content-Type: application/json' -d "$todoData" http://localhost:30555/api/todos
  ((counter++))
done
