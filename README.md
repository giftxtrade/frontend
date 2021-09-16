<p align="center">
    <a href="http://giftxtrade.com/" target="blank">
        <img src="https://giftxtrade.com/logos/logo_profile_rounded.svg" width='50' alt="GiftTrade Logo" />
    </a>
</p>

<p align="center">
    The platform that aims to simplify your online gift exchange and secret santa for <i>free</i>.
</p>

## Description
The GiftTrade frontend repository serves as the main repo for the [giftxtrade.com](https://giftxtrade.com) web app. This repo is designed to be able to run with a fully working API ([giftxtradeapi.com](https://giftxtradeapi.com)) and makes use of Redux for state management.


## Set up

### Clone repository
```
git clone git@github.com:giftxtrade/frontend.git
```

### Install dependencies
```
npm install
```

### Define environment variables
GifTrade uses environment variables to help speed up development time and to make sure both developement and prodcution code are similar with little to no tweaks. Therefore, we define these variables to ensure this behaviour.

#### Step 1: Create `.env.local` file
Ensure that you create a file named `.env.local` within the root of the project.

#### Step 2: Populate file
Add the following to the `.env.local` file:
```
NEXT_PUBLIC_API_BASE=http://localhost:3001/
NEXT_PUBLIC_BASE=http://localhost:3000/
```


## Run with developement mode
Ensure that the API server is running and is taken care of. Then start the frontend devlopement server
```
npm run dev
```
This will start a server on port `3000` and will listen to all changes made to the files and update/refresh automatically.