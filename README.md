## EchoShadow

The easy way to spectate Quest mathces from a PC on the same network. Works for private and public matches!

## What you need

- A PC capable of running Echo on spectator mode
- The IP Address for the Quest
- Two Oculus Accounts
  - One for the playing on the Quest (main account)
  - One for the spectator client on PC (alt account)

## Setting Up

### Preparing the local PC

1. Log into Oculus on the PC with the alt account
2. Install EchoVR from the Oculus store.
3. Under Libary > EchoVR > Details you can find the install location. Clicking on the install location will copy it. Save this for future reference.
  - Most paths will look like either of the following:
    - `C:\Program Files\Oculus\Software\Software\ready-at-dawn-echo-arena\`
    - `D:\Software\ready-at-dawn-echo-arena\`

### Preparing the Quest

1. Obtain and write down the IP address for the Quest. It can either be found on SideQuest or by clicking on the current Wi-Fi network in the Quest settings. A different way of obtaining it is to log into your router's admin portal.
2. Inside the EchoVR settings on the Oculus Quest, enable the API setting.

### Installing and Configuring EchoShadow

1. Run EchoShadow
2. Click on the Settings Icon (If prompted, choose to open with Text Edit or Notepad).
3. Adjust the echoPath to the path to your installed Echo. You have to add a second '\\' to every '\\', such that they are all '\\\\', as the example below:
  - `C:\\Program Files\\Oculus\\Software\\Software\\ready-at-dawn-echo-arena\\`
4. Adjust the remoteApiIpAddress to the IP Address of your Quest.s
5. Save and close the file.
6. Close EchoShadow.

## Running

Open up EchoShadow and you are good to go!

## Reporting issues and Support
We have our own Discord! You can contact @Sphinxed or @MostCalm in there for any questions or issues
https://discord.gg/QPFerM23A8

Also, open Github Issues if you know how! We'd appreciate it :D

## Contributing

Pull requests are always welcome 😃. You can clone the repo, install dependencies with

```bash
yarn install
```

and then run locally using

```bash
yarn dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
