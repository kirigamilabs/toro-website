'use client'
import {
    AppConfig,
    UserSession,
    showConnect,
  } from "@stacks/connect";
import { useState, useEffect } from "react";
import '@btckit/types';
import Image from 'next/image'

function Bitcoin({address}) {
    const [message, setMessage] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    const [userData, setUserData] = useState(undefined);

    const appConfig = new AppConfig(["store_write"]);
    const userSession = new UserSession({ appConfig });

    const [currentAddress, setAddress] = useState("");
    const [p2trAddress, setP2TRAddress] = useState("");
    const [stxAddress, setSTXAddress] = useState("");

    const [nonce, setNonce] = useState("");

    const appDetails = {
        name: "Toro",
        icon: "/toro.JPG",
    };

    useEffect(() => {
        fetch("../api/nonce")
            .then((res) => res.json())
            .then((res) => {
                setNonce(res['nonce']); 
            }
                )
    }, [])

    /** 
    useEffect(() => {
        if (userSession.isSignInPending()) {
            
        userSession.handlePendingSignIn().then((userData) => {
            // @ts-ignore
            setUserData(userData);
        });
        } else if (userSession.isUserSignedIn()) {
            // @ts-ignore
            setUserData(userSession.loadUserData());
        }
    }, []);
    */

    const connectWallet = () => {
        showConnect({
            appDetails,
            onFinish: () => getAddresses(),
            userSession,
        });
    };


    const disconnectWallet = async () => {
        userSession.signUserOut()
        setUserData(undefined);
        setAddress("");
        setP2TRAddress("");
        setSTXAddress("");
    };


    const stakeBitcoin = async () => {
        const sendAmount = Number(amount) * 100000000
        console.log('stake amount',amount)
        console.log(sendAmount.toString())
        console.log(address)

        const resp = await window.btc?.request("sendTransfer", {
          address: address, //replace this with whatever address you want to send to
          amount: sendAmount.toString(), // the amount you want to send denoted in satoshis
          network: "mainnet"
        });

        console.log(resp)
      
        // Storing txid in local storage
        // We'll get back the transaction IF, which we can then use to do whatever we want
        if (typeof window !== "undefined") {
        // @ts-ignore
          localStorage.setItem("txid", JSON.stringify(resp?.['result']['txid']));
        }
      
        // We may want to do something once this transaction has confirmed, so we can set it to pending here and then use an API like mempool.space to query the Bitcoin chain for information about this transaction
        localStorage.setItem("txStatus", "pending");
    };
    
    const signBitcoin = async () => { 
        const resp = await window.btc?.request('signMessage', { 
            message: "Welcome to Tōrō ():\n\n"+
            "Click to sign in and accept the Toro Terms of Service and Privacy Policy.\n\n"+
            "This request will not trigger a blockchain transaction.\n\n"+
            "Your authentication status will reset after 8 hours.\n\n"+
            "Wallet address : \n"+
            currentAddress+"\n\n"+
            "Nonce : \n"+
            nonce,
            paymentType: 'p2wpkh' //(default) or 'p2tr'
        });

        //update nonce
        fetch("../api/nonce").then((res) => res.json()).then((res) => (setNonce(res['nonce'])))

    };

    
    const getAddresses = async () => {
        const resp = await window.btc?.request('getAddresses')
        // @ts-ignore
        setAddress(resp.result.addresses[0].address)
        // @ts-ignore
        setP2TRAddress(resp.result.addresses[1].address)
        // @ts-ignore
        setSTXAddress(resp.result.addresses[2].address)
        // @ts-ignore
        // setAddress(userData.profile.btcAddress.p2wpkh.mainnet)

        setUserData(userData);
    }

    const [receiver, setReceiver] = useState('')
    const [amount, setAmount] = useState('')
    const [signamessage, setSAM] = useState('')


    var displayname = currentAddress?.slice(0, 5) + '..' + currentAddress?.slice(-5)

    if ( ( !window.btc) ) {
    return (
        <div className="text-center items-center justify-center">
            <br />
            <hr className="dashed w-full opacity-20"></hr>
            <br />
            <div className="mx-auto flex justify-center opacity-90">
                <form
                    onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const value = formData.get('value') as `${number}`
                    }}
                >
                    <input
                    type="text"
                    name="value"
                    className="text-center form-control block mb-2 w-20 lg:w-full px-2 py-2 font-normal text-white bg-orange-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="AMOUNT"
                    onChange={(e) => setAmount(e.target.value)}
                    />
                    <button type="submit" onClick={stakeBitcoin}>Stake BTC</button>
                    <br />
                    <br />
                    <hr className="dashed w-full opacity-20"></hr>
                    <br></br>
                </form>
            </div>
        </div>
    );
    }
    return (
        <div className="text-center items-center justify-center">
            <div className="text-center items-center justify-center">
                {userSession.isSignInPending() && (
                    <button
                    className="p-3 bg-orange-700 rounded text-white "
                    onClick={connectWallet}
                    >
                    <b>Connecting ...</b>
                    </button>
                )}
                {!userSession.isUserSignedIn() && (
                    <button
                    className="p-3 bg-orange-700 rounded text-white "
                    onClick={connectWallet}
                    >
                    <b>Select Wallet</b>
                    </button>
                )}
                {userSession.isUserSignedIn() && (
                    <div className = "text-center items-center justify-center">
                        
                        <button
                            className="p-2 bg-orange-700 rounded text-white"
                            onClick={disconnectWallet}
                            >
                        <a className = "group flex max-w-fit items-center">
                        <Image
                            src="/icon-512x512.png"
                            alt="Leather Logo"
                            className="dark:invert"
                            width={36}
                            height={23}
                            priority
                        />
                            { displayname }
                        </a>
                        </button>
                        
                    </div>
                    )
                }
            </div>
            <br />
            <hr className="dashed w-full opacity-20"></hr>
            <br />
            <div className="mx-auto flex justify-center opacity-90">
                <form
                    onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const value = formData.get('value') as `${number}`
                    }}
                >
                    <input
                    type="text"
                    name="value"
                    className="text-center form-control block mb-2 w-20 lg:w-full px-2 py-2 font-normal text-white bg-orange-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="AMOUNT"
                    onChange={(e) => setAmount(e.target.value)}
                    />
                    <button type="submit" onClick={stakeBitcoin}>Stake BTC</button>
                    <br />
                    <br />
                    <hr className="dashed w-full opacity-20"></hr>
                    <br></br>
                </form>
            </div>
        </div>
    );
}

export default Bitcoin;