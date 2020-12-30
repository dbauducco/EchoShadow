## EchoShadow
The easy way to spectate Quest mathces from a PC on the same network. Works for private and public matches!

## What you need
- A PC capable of running Echo on spectator mode
- The IP Address for the Quest
- Two Oculus Accounts
  * One for the playing on the Quest (main account)
  * One for the spectator client on PC (alt account)

## Setting Up
# Preparing the local PC
1. Log into Oculus on the PC with the alt account
2. Install EchoVR from the Oculus store.
3. Under Libary > EchoVR > Options you can find the install location. Save this for future reference.
4. Launch EchoVR once. You will get an error that no headset is found. You can just ignore it, click okay, and Echo will close.
5. Go to %appdata%/../local/rad/loneecho/xxxxsettings.json and open it.
6. Edit the "APIEnabled" option to true.
7. Save the file and exit.

# Preparing the Quest
1. Obtain and write down the IP address for the Quest. It can either be found on SideQuest or by clicking on the current Wi-Fi network in the Quest settings.
2. Inside the EchoVR settings on the Oculus Quest, enable the API setting.

# Installing and Configuring EchoShadow
1. Run EchoShadow
2. Click on the Settigns Icon (If prompted, choose to open with Text Edit or Notepad).
3. Adjust the EchoVRPath to the path to your installed Echo.
4. Adjust the RemoteIPAddress to the IP Address of your Quest.
5. Save and close the file.
6. Close EchoShadow.

## Running
Open up EchoShadow and you are good to go!

## Contributing

Pull requests are always welcome 😃. You can clone the repo, install dependencies with
```bash
yarn install
```
and then run locally using
```bash
yarn run dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
