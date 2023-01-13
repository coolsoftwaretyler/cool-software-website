https://www.cyberciti.biz/faq/create-a-user-account-on-ubuntu-linux/

Alternatively, you can use the useradd command is a low level utility for adding users on Ubuntu. The syntax is:
$ sudo useradd -s /path/to/shell -d /home/{dirname} -m -G {secondary-group} {username}
$ sudo passwd {username}

Let us create a new user named vivek using the useradd command on Ubuntu:
$ sudo useradd -s /bin/bash -d /home/vivek/ -m -G sudo vivek
$ sudo passwd vivek

Where,

-s /bin/bash – Set /bin/bash as login shell of the new account
-d /home/vivek/ – Set /home/vivek/ as home directory of the new Ubuntu account
-m – Create the user’s home directory
-G sudo – Make sure vivek user can sudo i.e. give admin access to the new account
I strongly recommend installing ssh keys while creating the new user account. You must have RSA/ed25519 key pair on your local desktop/laptop. Use the cat command to view your current RSA/ed25519 public key on the desktop:
$ cat ~/.ssh/id_ed25519.pub
$ cat ~/.ssh/id_rsa.pub

View public ssh key on your macos/unix/linux desktop
View public ssh key on your macos/unix/linux desktop

Run the following commands on your Ubuntu server to install above ~/.ssh/id_ed25519.pub key from your desktop:
$ sudo mkdir /home/vivek/.ssh/
$ sudo chmod 0700 /home/vivek/.ssh/
$ sudo -- sh -c "echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILaLvLmaW9qIbUVo1aDHWZE9JewbNfIdTVif2aFGF0E0 vivek@nixcraft' > /home/vivek/.ssh/authorized_keys"
$ sudo chown -R vivek:vivek /home/vivek/.ssh/

Now you can log in with ssh keys:
$ ssh vivek@your-aws-server-ip-here
