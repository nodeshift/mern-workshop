#!/bin/bash

numTodos=1
if [ ! -z $1 ] ; then
  numTodos=$1
fi

theAuthor="author here"

counter=1
while [ $counter -le $numTodos ] ; do
  todoData="{\"providedID\":\"$counter\",\"author\":\"$theAuthor\",\"text\": \"comment $counter\"}"
  curl -X POST -H 'Content-Type: application/json' -d "$todoData" http://localhost:30555/api/todos
  ((counter++))
done
