#!/usr/bin/env bash

RASNODE=/boot/rasnode

#RASNODE=./

INSTALLPATH=~/apps

echo "To cancel the startup procedure, please press Ctrl-C now."

sleep 5

if [ -d "$RASNODE" ]; then

	echo "Starting rasnode installation"

	if [ ! -d "$INSTALLPATH" ]; then
	  echo "First time installing"
	  echo "Copying files"
		cp -r $RASNODE $INSTALLPATH
	fi

	DIFF=$(diff $RASNODE/node.yml $INSTALLPATH/node.yml)
	if [ "$DIFF" != "" ]
	then
		echo "Deleting existing code"
		rm -rf $INSTALLPATH
		echo "Copying files"
		cp -r $RASNODE $INSTALLPATH
	fi

	echo "Installing NPM dependencies"
	cd $INSTALLPATH && npm install
	echo "Running Gulp Script"
	gulp clean && gulp
else
	echo "Rasnode directory doesn't exist, please install it in $RASNODE"
fi