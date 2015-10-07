#!/bin/bash

# FikesMedia 
# Support Team <support@fikesmedia.com>
#
# Distribution Customization Injection
# Description:	Prepares Xubuntu 14.04
#     for UniFikes OS packages including
#     Server Manager, apt sources, and 
#     XFCE gui customizations.
#
# Copyright 2015 All Rights Reserved


# Remove Packages
apt-get purge firefox gnome-mines gnome-sudoku simple-scan gimp xchat transmission-gtk orage abiword gnumeric thunderbird pidgin gmusicbrowser 

# Add New Packages
apt-get install gksu chromium-browser bum

# Add Repositories
echo "#Ubiquiti " > /etc/apt/sources.d/ubiquiti.list
echo >> /etc/apt/sources.d/ubiquiti.list
echo "#UniFi" >> /etc/apt/sources.d/ubiquiti.list
echo "deb http://www.ubnt.com/downloads/unifi/debian stable ubiquiti" >> /etc/apt/sources.d/ubiquiti.list
echo >> /etc/apt/sources.d/ubiquiti.list
echo "#MongoDB" >> /etc/apt/sources.d/ubiquiti.list
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" >> /etc/apt/sources.d/ubiquiti.list
echo >> /etc/apt/sources.d/ubiquiti.list
echo "#UniFi Video" >> /etc/apt/sources.d/ubiquiti.list
echo "deb [arch=amd64] http://www.ubnt.com/downloads/unifi-video/apt trusty ubiquiti" >> /etc/apt/sources.d/ubiquiti.list
echo >> /etc/apt/sources.d/ubiquiti.list
echo "#mFi" >> /etc/apt/sources.d/ubiquiti.list
echo "deb http://www.ubnt.com/downloads/mfi/distros/deb/ubuntu ubuntu ubiquiti" >> /etc/apt/sources.d/ubiquiti.list

echo "#Webmin Repo" > /etc/apt/sources.d/webmin.list
echo "deb http://download.webmin.com/download/repository sarge contrib" >> /etc/apt/sources.d/webmin.list
echo "deb http://webmin.mirror.somersettechsolutions.co.uk/repository sarge contrib" >> /etc/apt/sources.d/webmin.list

# Trust Repos
apt-key adv --keyserver keyserver.ubuntu.com --recv C0A52C50
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
wget -O - http://www.ubnt.com/downloads/unifi-video/apt/unifi-video.gpg.key | sudo apt-key add -
apt-key adv --keyserver keyserver.ubuntu.com --recv C0A52C50
wget -q http://www.webmin.com/jcameron-key.asc -O- | sudo apt-key add -

