# -*- mode: ruby -*-
# vi: set ft=ruby :


ipythonPort = 8888
ipythonHost = 4545
sparkUIPort = 4040


$script = <<SCRIPT

# Increase Swap Memory
swapsize=4000
grep -q "swapfile" /etc/fstab
if [ $? -ne 0 ]; then
	fallocate -l ${swapsize}M /home/vagrant/swapfile
	chmod 600 /home/vagrant/swapfile
	mkswap /home/vagrant/swapfile
	swapon /home/vagrant/swapfile
	echo '/home/vagrant/swapfile none swap defaults 0 0' >> /etc/fstab
fi
df -h
cat /proc/swaps
cat /proc/meminfo | grep Swap


# APT-GET
sudo apt-get update
sudo apt-get upgrade


# PIP
sudo apt-get -y install python-pip


# ANACONDA
anaconda=Anaconda-2.3.0-Linux-x86_64.sh
if [[ ! -f $anaconda ]]; then
	wget --quiet https://3230d63b5fc54e62148e-c95ac804525aac4b6dba79b00b39d1d3.ssl.cf1.rackcdn.com/$anaconda
fi
chmod +x $anaconda
./$anaconda -b -p /home/vagrant/anaconda
cat >> /home/vagrant/.bashrc << END
export PATH=/home/vagrant/anaconda/bin:$PATH
END
rm $anaconda


# JAVA
sudo apt-get -y install openjdk-7-jdk


# APACHE SPARK
spark=spark-1.5.1-bin-hadoop2.6.tgz
if [[ ! -f $spark ]]; then
	wget --quiet http://d3kbcqa49mib13.cloudfront.net/$spark
fi
tar xvf $spark
rm $spark
mv spark-1.5.1-bin-hadoop2.6 spark


# Install findspark, seaborn, pattern, gensim, and (MLJ: Added textblob)
/home/vagrant/anaconda/bin/pip install findspark seaborn gensim pattern textblob


# (MLJ: Added Install textblob nltk_data)
# first remove existing nltk_data for clean download
sudo rm -rf /home/vagrant/nltk_data
sudo rm -rf /root/nltk_data
# download, will end up at root
sudo python -m textblob.download_corpora
# move to /home/vagrant/nltk_data
sudo mv /root/nltk_data /home/vagrant/nltk_data

# Setting Spark Environment Variables
echo 'SPARK_HOME=/home/vagrant/spark' >> /etc/environment
echo 'PYSPARK_PYTHON=/home/vagrant/anaconda/bin/python' >> /etc/environment


# Start ipython notebook
sed -i "13i su vagrant -c 'cd /home/vagrant && /home/vagrant/anaconda/bin/ipython notebook --ip=\\"*\\"'" /etc/rc.local

SCRIPT


Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: ipythonPort, host: ipythonHost,
    auto_correct: true

  config.vm.network "forwarded_port", guest: sparkUIPort, host: 4646,
    auto_correct: true

  config.vm.provider :virtualbox do |v|
  	v.memory = 10240
  	v.cpus = 4
  end

  config.vm.provision :shell, inline: $script
  config.vm.synced_folder ".", "/home/vagrant/lyrics-lab"

end
