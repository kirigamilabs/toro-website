'use client'
import {
    AppConfig,
    UserSession,
    showConnect,
    disconnect,
    openContractCall,
  } from "@stacks/connect";
import { useState, useEffect } from "react";
import '@btckit/types';
import { StacksMainnet } from "@stacks/network";
import { stringUtf8CV } from "@stacks/transactions";
import { openSTXTransfer } from '@stacks/connect';
import Image from 'next/image'

function Stacks() {
    const [message, setMessage] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    const [userData, setUserData] = useState(undefined);

    const appConfig = new AppConfig(["store_write"]);
    const userSession = new UserSession({ appConfig });

    const [currentAddress, setAddress] = useState("");
    const [p2trAddress, setP2TRAddress] = useState("");
    const [stxAddress, setSTXAddress] = useState("");

    const appDetails = {
        name: "Toro",
        icon: "/toro.JPG",
    };

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

    // @ts-ignore
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // @ts-ignore
    const submitMessage = async (e) => {
        e.preventDefault();
    
        const network = new StacksMainnet();
    
        const options = {
          contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          contractName: "hello-stacks",
          functionName: "write-message",
          functionArgs: [stringUtf8CV(message)],
          network,
          appDetails,
          // @ts-ignore
          onFinish: ({ txId }) => console.log(txId),
        };
    
        await openContractCall(options);
    };

    // @ts-ignore
    const handleTransactionChange = (e) => {
        setTransactionId(e.target.value);
    };

    const retrieveMessage = async () => {
        const retrievedMessage = await fetch(
            "https://api.mainnet.hiro.so/extended/v1/tx/events?" +
            new URLSearchParams({
                tx_id: transactionId,
            })
        );
        const responseJson = await retrievedMessage.json();
        setCurrentMessage(responseJson.events[0].contract_log.value.repr);
    };

    const sendStacks = async () => {
        openSTXTransfer({
            recipient: 'ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV',
            amount: '100',
            memo: 'Reimbursement',
            network: new StacksMainnet(), // for mainnet, `new StacksMainnet()`
            appDetails: {
              name: 'My App',
              icon: window.location.origin + '/my-app-logo.svg',
            },
            onFinish: data => {
              console.log('Stacks Transaction:', data.stacksTransaction);
              console.log('Transaction ID:', data.txId);
              console.log('Raw transaction:', data.txRaw);
            },
          });
    }

    const sendBitcoin = async () => {
        const resp = await window.btc?.request("sendTransfer", {
          address: "bc1qga9ggptsz3q86r99l55gjtuf2z4s5gyz0jq0ej", //replace this with whatever address you want to send to
          amount: "11000", // the amount you want to send denoted in satoshis
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
            'pending',
            paymentType: 'p2wpkh' //(default) or 'p2tr'
        });
        console.log(resp)
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


    var displayname = stxAddress?.slice(0, 5) + '..' + stxAddress?.slice(-5)

    if ( ( !window.btc) ) {
    return (
        <div className="text-center items-center justify-center">
            <br />
            <hr className="dashed w-full opacity-50"></hr>
            <br />
            <div>
            {(
                <div>
                    <div className="">
                        <button onClick={sendBitcoin}>Send Bitcoin</button>
                    </div>
                    <div className="">
                        <button onClick={signBitcoin}>Sign Bitcoin</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
    }
    return (
        <div className="text-center items-center justify-center">
            <div className="text-center items-center justify-center">
                {userSession.isSignInPending() && (
                    <button
                    className="p-3 bg-blue-900 rounded text-white "
                    onClick={connectWallet}
                    >
                    <b>Connecting ...</b>
                    </button>
                )}
                {!userSession.isUserSignedIn() && (
                    <button
                    className="p-3 bg-blue-900 rounded text-white "
                    onClick={connectWallet}
                    >
                    <b>Select Wallet</b>
                    </button>
                )}
                {userSession.isUserSignedIn() && (
                    <div className = "text-center items-center justify-center">
                        
                        <button
                            className="p-2 bg-blue-900 rounded text-white"
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
            <hr className="dashed w-full opacity-50"></hr>
            <br />
            <div>
            {(
                <div>
                    <div className="text-white">
                        <button onClick={sendBitcoin}>Send Bitcoin</button>
                    </div>
                    <br/>
                    <div className="text-white">
                        <button onClick={sendStacks}>Send Stacks</button>
                    </div>
                    <br/>
                    <div className="text-white">
                        <button onClick={signBitcoin}>Sign Terms</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default Stacks;