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
import { openSTXTransfer, openContractDeploy } from '@stacks/connect';
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
            recipient: 'SP1GWQJAMVRP2C443XRAAC83J171AJQFJ354Q7Q1Q',
            amount: '1000000',
            memo: 'Donation',
            network: new StacksMainnet(), // for mainnet, `new StacksMainnet()`
            appDetails: {
              name: 'Toro',
              icon: "/ologo-nobg.png",
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
          address: "bc1qn7m8qqz3yaw0qeffd5tlcr2yqeh7m4l8vwwyvd", //replace this with whatever address you want to send to
          amount: "10000", // the amount you want to send denoted in satoshis
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
            "Click to sign in and accept the Tōrō Terms of Service and Privacy Policy.\n\n"+
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


    const [amount, setAmount] = useState('')
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')

    const codeBody = `((define-trait sip010-ft-trait((transfer (uint principal principal (optional (buff 34))) (response bool uint))(get-name () (response (string-ascii 32) uint))(get-symbol () (response (string-ascii 32) uint))(get-decimals () (response uint uint))(get-balance (principal) (response uint uint))(get-total-supply () (response uint uint))(get-token-uri () (response (optional (string-utf8 256)) uint))))(define-fungible-token toro u${amount})(define-constant ERR_OWNER_ONLY (err u100))(define-constant ERR_NOT_TOKEN_OWNER (err u101))(define-constant CONTRACT_OWNER tx-sender)(define-constant TOKEN_URI u"https://arweave.net/xJvMfBLp8gQ0skquODho7UcC_BqQ5On7bVenRlBinsU")(define-constant TOKEN_NAME "${name}")(define-constant TOKEN_SYMBOL "${symbol}")(define-constant TOKEN_DECIMALS u8)(define-constant err-forbidden (err u403))(define-read-only (get-balance (who principal))(ok (ft-get-balance toro who)))(define-read-only (get-total-supply)(ok (ft-get-supply toro)))(define-read-only (get-name)(ok TOKEN_NAME))(define-read-only (get-symbol)(ok TOKEN_SYMBOL))(define-read-only (get-decimals)(ok TOKEN_DECIMALS))(define-read-only (get-token-uri)(ok (some TOKEN_URI)))(define-data-var contract-owner principal tx-sender)(define-public (set-contract-owner (new-owner principal))(begin(try! (is-contract-owner))(ok (var-set contract-owner new-owner))))(define-public (mint (amount uint)(destination principal))(begin(try! (is-contract-owner))(try! (ft-mint? toro amount destination))(print {notification: "mint"})(ok true)))(define-public (burn (amount uint)(owner principal))(begin(try! (is-contract-owner))(try! (ft-burn? toro amount owner))(print {notification: "burn", payload: amount})(ok true)))(define-public (transfer(amount uint)(sender principal)(recipient principal)(memo (optional (buff 34))))(begin(asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)(try! (ft-transfer? toro amount sender recipient))(match memo to-print (print to-print) 0x)(ok true)))(define-private (is-contract-owner)(ok (asserts! (is-eq (var-get contract-owner) contract-caller) err-forbidden))))`;

    const deployContract = async () => {
        openContractDeploy({
            contractName: 'toro-toro-toro',
            codeBody,
            network: new StacksMainnet(), // for mainnet, `new StacksMainnet()`
            appDetails: {
              name: 'Tōrō',
              icon: "/ologo-nobg.png",
            },
            onFinish: data => {
              console.log('Stacks Transaction:', data.stacksTransaction);
              console.log('Transaction ID:', data.txId);
              console.log('Raw transaction:', data.txRaw);
            },
          });
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
                        <button onClick={signBitcoin}>Sign Terms</button>
                    </div>
                </div>
            )}
            </div>
            <br />
            <hr className="dashed w-full opacity-50"></hr>
            <br />
            <div>
            {(
                
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
                    className="text-center form-control block mb-2 w-20 lg:w-full px-2 py-2 font-normal text-white bg-blue-800 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="NAME"
                    onChange={(e) => setName(e.target.value)}
                    />
                    <input
                    type="text"
                    name="value"
                    className="text-center form-control block mb-2 w-20 lg:w-full px-2 py-2 font-normal text-white bg-blue-800 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="SYMBOL"
                    onChange={(e) => setSymbol(e.target.value)}
                    />
                    <input
                    type="text"
                    name="value"
                    className="text-center form-control block mb-2 w-20 lg:w-full px-2 py-2 font-normal text-white bg-blue-800 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="SUPPLY"
                    onChange={(e) => setAmount(e.target.value)}
                    />
                    <div>
                        <div className="text-white">
                            <button onClick={deployContract}>Deploy Memetoken</button>
                        </div>
                    </div>
                </form>
            )}
            </div>
            <br />
            <hr className="dashed w-full opacity-50"></hr>
            <br />
            <div>
            {(
                <div>
                    <div className="text-white">
                        <button onClick={sendBitcoin}>Donate Bitcoin</button>
                    </div>
                    <br/>
                    <div className="text-white">
                        <button onClick={sendStacks}>Donate Stacks</button>
                    </div>
                </div>
            )}
            </div>
            

        </div>
    );
}

export default Stacks;