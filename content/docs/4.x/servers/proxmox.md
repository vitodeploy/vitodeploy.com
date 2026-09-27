# Proxmox VE

## Introduction

Vito can create servers on your own [Proxmox VE](https://www.proxmox.com) host or cluster. You connect Vito to the Proxmox API once and map each Ubuntu version to a cloud-init template. From then on, creating a server works like it does with a cloud provider: pick a node and a size, and Vito clones the template, boots it and installs the server.

This guide takes you from an empty Proxmox host to a ready server.

## How it works

When you create a server on Proxmox, Vito:

1. Takes the next free VM ID and makes a **full clone** of the template mapped to the operating system you picked, on the node you picked.
2. Sets the VM's CPU cores and memory to match the plan, and configures cloud-init: the `root` user with a new SSH key for this server, and either a static IP or DHCP.
3. Grows the boot disk to the plan's size. Disks are never shrunk.
4. Starts the VM, waits until it accepts SSH and runs the normal Vito installation.

Vito waits up to 10 minutes for the clone, the first boot and SSH to be ready.

## Requirements

- **Proxmox VE 8.1 or newer.**
- **Vito can reach the Proxmox API** on port `8006` of your Proxmox host.
- **Vito can reach your servers over SSH** (port `22`) on the IP address they get. If Vito runs outside your network, for example on a cloud VPS, and your VMs only get private LAN addresses, Vito can't connect to them. Run Vito on the same network, or connect the networks with a VPN.
- **A cloud-init template for each Ubuntu version** you want to use, built from Ubuntu's official cloud images. [Step 2](#step-2-create-a-cloud-init-template) shows how.

:::warning
Build your templates from Ubuntu **cloud images**. A VM installed from an Ubuntu ISO usually ignores the cloud-init settings from Proxmox, so Vito can't log in to servers cloned from it.
:::

## Step 1: Create an API token

Vito talks to Proxmox with an API token. Run these commands in the Proxmox host's shell. In the web UI, select the node and click **Shell**.

```sh
pveum user add vito@pve --comment "VitoDeploy"
pveum acl modify / --users vito@pve --roles PVEVMAdmin,PVEDatastoreUser,PVESDNUser,PVEAuditor
pveum user token add vito@pve vito --privsep 0
```

The last command prints the token. Keep these two values for [step 3](#step-3-connect-proxmox-to-vito):

- **Token ID**: the `full-tokenid` value, `vito@pve!vito`.
- **Token secret**: the `value` UUID. Proxmox shows it only once.

The roles give Vito what it needs:

| Role | Why Vito needs it |
| --- | --- |
| `PVEVMAdmin` | Clone templates, configure, start, stop and delete VMs, and read the guest agent |
| `PVEDatastoreUser` | Allocate disk space for the cloned VMs |
| `PVESDNUser` | Attach the VMs to your network bridge |
| `PVEAuditor` | Optional. Read each node's CPU and memory, so Vito can grey out plans that don't fit |

:::warning
If you create the token in the web UI instead (**Datacenter → Permissions → API Tokens → Add**), untick **Privilege Separation**. A token with privilege separation doesn't get its user's roles, so it can't see any VMs, and Vito shows **"The API token cannot see any VMs"** when you connect. If you want to keep privilege separation, grant the roles above to the token itself under **Datacenter → Permissions → Add → API Token Permission**, on path `/`.
:::

## Step 2: Create a cloud-init template

Create one template for each Ubuntu version you want to use. These commands build an Ubuntu 24.04 template with VM ID `9000`. Run them in the Proxmox host's shell:

```sh
cd /root
wget https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img

# Only needed for DHCP, see "DHCP or static IP" below
apt install -y libguestfs-tools
virt-customize -a noble-server-cloudimg-amd64.img --install qemu-guest-agent

qm create 9000 --name ubuntu-2404-cloud --memory 2048 --cores 2 --ostype l26 \
  --net0 virtio,bridge=vmbr0 --scsihw virtio-scsi-pci
qm set 9000 --scsi0 local-lvm:0,import-from=/root/noble-server-cloudimg-amd64.img
qm set 9000 --ide2 local-lvm:cloudinit --boot order=scsi0 --serial0 socket --vga serial0 --agent 1
qm template 9000
```

Adjust these values to your setup:

- **`9000`**: any free VM ID. Use a different one for each template.
- **`vmbr0`**: the bridge your servers connect to. Every server copies this network device, including its VLAN tag and firewall setting.
- **`local-lvm`**: the storage for the template's disk and cloud-init drive.

For another Ubuntu version, repeat the commands with a different VM ID and image:

| Ubuntu | Cloud image |
| --- | --- |
| 24.04 | `https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img` |
| 22.04 | `https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img` |

To check a template, run `qm config 9000`. The output should include `template: 1` and a cloud-init drive such as `ide2: local-lvm:vm-9000-cloudinit,media=cdrom`.

:::info
The template's disk is small, about 3.5 GB. Don't resize it: Vito grows each server's disk to the size of its plan.
:::

### DHCP or static IP

Each server either gets the static IP you enter when you create it, or an address from your DHCP server.

With DHCP, Vito reads the server's IP from the QEMU guest agent. Ubuntu's cloud images don't include the agent, which is why the commands above install it with `virt-customize`. If you always use static IPs, you can skip those two lines.

Servers use the Proxmox host's DNS settings, unless you set DNS servers on the template's **Cloud-Init** tab.

### Clusters

Each online node in the cluster is a region in Vito. Proxmox can only clone a template to another node when the template is on **shared storage**, such as Ceph or NFS. If your templates are on local storage, either create servers on the node that holds the template, or create a template on each node and a separate Vito connection per node.

## Step 3: Connect Proxmox to Vito

In Vito, go to **Settings → Server Providers**, click **Connect**, choose **Proxmox VE** and fill in the form:

| Field | Value |
| --- | --- |
| **API URL** | Your Proxmox address starting with `https://`, for example `https://192.168.1.10:8006`. Anything after the port is ignored, so you can paste a URL copied from the browser. |
| **Disk Storage** | Optional. The storage for the servers' disks, for example `local-lvm`. Leave it empty to use the template's storage. |
| **API Token ID** | `vito@pve!vito` |
| **API Token Secret** | The secret from step 1. |
| **Ubuntu template fields** | The VM ID of your template for each Ubuntu version, for example `9000` for 24.04. Leave the versions you don't use empty. At least one is required. |
| **Verify SSL certificate** | Turn this off if Proxmox still uses its default self-signed certificate. |

When you click **Connect**, Vito checks the token, then checks that each mapped VM ID exists, is a QEMU template and has a cloud-init drive.

:::tip
The connection form has a **View guide** button with the commands from steps 1 and 2, ready to copy.
:::

## Step 4: Create a server

[Create a server](./create.md) as usual and pick your Proxmox connection as the provider. Then choose:

- **Region**: the Proxmox node to create the server on.
- **Plan**: the size of the server. Plans larger than the node's CPU or memory are greyed out; this needs the `PVEAuditor` role.
- **Operating System**: an Ubuntu version that has a template mapped on the connection.
- **Static IP (CIDR)** and **Gateway**: for a static address, for example `192.168.1.50/24` and `192.168.1.1`. Leave both empty to use DHCP.

| Plan | vCPU | Memory | Disk |
| --- | --- | --- | --- |
| xsmall | 1 | 1 GB | 25 GB |
| small | 1 | 2 GB | 50 GB |
| medium | 2 | 4 GB | 80 GB |
| large | 4 | 8 GB | 160 GB |
| xlarge | 8 | 16 GB | 320 GB |
| 2xlarge | 16 | 32 GB | 640 GB |

The VM appears in Proxmox under your server's name, with `Managed by Vito (server #…)` in its **Notes**. You can follow the installation's progress in Vito.

## Deleting a server

When you delete a Proxmox server and choose **Delete from Vito and Proxmox VE**, Vito stops the VM and destroys it along with its disks.

Vito only destroys the VM it created for that server. It recognizes the VM by the `Managed by Vito (server #…)` line in the VM's **Notes**, so keep that line. If it's missing or names another server, Vito leaves the VM untouched, still removes the server from Vito, and notifies you to delete the VM yourself.

## Troubleshooting

### "The API token cannot see any VMs"

The token has Privilege Separation turned on and no permissions of its own. See the warning in [step 1](#step-1-create-an-api-token).

### "VM 9000 was not found or the API token cannot access it"

Check the VM ID. If it's correct, the token can't see that VM: make sure the roles from step 1 are granted on `/`.

### "VM 9000 is not a QEMU template"

Convert the VM to a template with `qm template 9000`. Containers (LXC) aren't supported.

### "Template 9000 has no cloud-init drive"

Add one with `qm set 9000 --ide2 local-lvm:cloudinit`, or in the web UI under **Hardware → Add → CloudInit Drive**. If the template was installed from an ISO, rebuild it from a cloud image as shown in [step 2](#step-2-create-a-cloud-init-template).

### "Couldn't connect to proxmox"

Vito couldn't reach the API or the token was rejected. Check that the API URL and port are reachable from the Vito server, and that the token ID and secret are right. If Proxmox uses a self-signed certificate, turn off **Verify SSL certificate**.

### "No Proxmox template is mapped to Ubuntu 24.04 on this connection"

The connection has no template for the operating system you picked. Pick another Ubuntu version, or create a connection that maps a template for it.

### Creating the server fails with "Proxmox API error"

Proxmox refused the clone, and the rest of the message is Proxmox's reason. A common one is creating a server on a node that can't reach the template's storage; see [Clusters](#clusters).

### The installation fails with "Proxmox task failed"

A Proxmox task failed while the server was being provisioned: the clone, the disk resize or the first start. The rest of the message comes from Proxmox. Common causes are a full storage or a plan that's too large for the node.

### The installation fails with "The server did not become reachable within 600 seconds"

The VM was created, but Vito couldn't log in over SSH. Open the VM's **Console** in Proxmox to see whether it booted and which IP it got, then check that:

- The Vito server can reach that IP on port 22, with no firewall in between.
- With DHCP, the template has the QEMU guest agent installed. Without it, Vito never learns the IP.
- With a static IP, the address, prefix and gateway match the bridge's network.
- The template was built from a cloud image, not installed from an ISO.

To retry, delete the server and create it again.
