#!/bin/bash

set -x

apt install -y locales
locale-gen en_US.UTF-8
# dpkg-reconfigure locales

apt install -y openjdk-11-jre-headless jetty9 libpng-dev libjpeg-dev libtiff-dev imagemagick ffmpeg nginx
apt install --no-install-recommends -y fonts-noto fonts-noto-cjk fonts-noto-unhinted fonts-noto-color-emoji \
	fonts-noto-ui-core fonts-noto-mono fonts-liberation fontconfig libreoffice libreoffice-java-common ure \
	texlive-latex-base texlive-latex-extra texlive-science texlive-fonts-recommended dvipng

curl -o /tmp/postscriptum.deb https://deb.scenari.software/pool/main/p/postscriptum-0.13-app/postscriptum-0.13-app_0.13.8-beta_amd64.deb
curl -o /tmp/postscriptum.deb https://deb.scenari.software/pool/main/p/postscriptum-0.13-app/postscriptum-0.13-app_0.13.8-beta_amd64.deb
apt install -y /tmp/postscriptum.deb
rm -f /opt/postscriptum
ln -s /opt/postscriptum-0.12 /opt/postscriptum


webapp_work_dir="/var/lib/studio-paon"
webapp_logs_dir="/var/log/studio-paon"
webapp_code="scenari"

set -e


mkdir -p ${webapp_work_dir}/
chown jetty:jetty ${webapp_work_dir}/

mkdir -p ${webapp_logs_dir}/
chown jetty:jetty ${webapp_logs_dir}/

mkdir -p /etc/systemd/system/jetty9.service.d
touch /etc/systemd/system/jetty9.service.d/override.conf
echo "ReadWritePaths=/var/lib/jetty9 ${webapp_work_dir} ${webapp_logs_dir}" >> /etc/systemd/system/jetty9.service.d/override.conf
echo "LimitNOFILE=8192" >> /etc/systemd/system/jetty9.service.d/override.conf

echo "JAVA_OPTIONS=\"-Djava.awt.headless=true -Xmx3072M -Xms3072M\"" >> /etc/default/jett

systemctl restart jetty9 


cp nginx.conf /etc/nginx/sites-available/studio-paon.edrlab.org
mkdir -p /studio-paon/deploy && cp -r /home/dev.edrlab/studio-paon/releases/edrlab/paon_gen_svMake/studioPaonCommons_1.2.0 /studio-paon/deploy
sudo find /studio-paon/deploy -type f -name "${webapp_code}.war" -exec sudo chown jetty:jetty {} \; -exec sudo mv {} /usr/share/jetty9/webapps/${webapp_code}.war \;
sudo rm -rf /var/www/studio-paon; sudo find /studio-paon/deploy -type d -name "static" -exec sudo cp -r "{}" /var/www/studio-paon \;
sudo systemctl restart jetty9
sudo systemctl reload nginx
sudo systemctl status nginx
sudo systemctl status jetty9
