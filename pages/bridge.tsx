// IU2U Bridge Page
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { useWeb3 } from '@/hooks/useWeb3';
import { useIU2UBalance, useIU2UTokenOperations, useIU2UGatewayOperations, useNativeU2UBalance } from '@/hooks/useIU2U';
import { SUPPORTED_BRIDGE_CHAINS } from '@/config/bridge';
import { BridgeTransaction } from '@/types/bridge';
import ChainSelector from '@/components/bridge/ChainSelector';
import TokenAmountInput from '@/components/bridge/TokenAmountInput';
import AddressInput from '@/components/bridge/AddressInput';
import BridgeActionButton from '@/components/bridge/BridgeActionButton';
import BridgeTransactionHistory from '@/components/bridge/BridgeTransactionHistory';
import { APP_CONTENT } from '@/constants/content';
import { Chain } from 'viem';

const BridgePage: NextPage = () => {
  const { isConnected, address } = useWeb3();

  // Bridge state
  const [selectedSourceChain, setSelectedSourceChain] = useState<Chain | null>(null);
  const [selectedDestinationChain, setSelectedDestinationChain] = useState<Chain | null>(null);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [payload, setPayload] = useState('');
  const [isDepositMode, setIsDepositMode] = useState(true);
  const [isContractCall, setIsContractCall] = useState(false);
  const [activeTab, setActiveTab] = useState('deposit');
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);

  // IU2U hooks
  const { formattedBalance: iu2uBalance, isLoading: balanceLoading, refetch: refetchBalance } = useIU2UBalance();
  const { formattedBalance: nativeU2UBalance, isLoading: nativeBalanceLoading } = useNativeU2UBalance();
  const tokenOps = useIU2UTokenOperations();
  const gatewayOps = useIU2UGatewayOperations();

  // Initialize default chains
  useEffect(() => {
    if (SUPPORTED_BRIDGE_CHAINS.length > 0) {
      setSelectedSourceChain(SUPPORTED_BRIDGE_CHAINS[0]); // U2U Nebulas Testnet
      setSelectedDestinationChain(SUPPORTED_BRIDGE_CHAINS[1]); // Polygon
    }
  }, []);

  // Handle deposit U2U -> IU2U
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const receipt = await tokenOps.deposit(amount);
      console.log('Deposit successful:', receipt);

      // Add transaction to history
      const transaction: BridgeTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        sourceChain: selectedSourceChain?.name || '',
        amount,
        symbol: 'IU2U',
        status: 'pending',
        timestamp: Date.now()
      };
      setTransactions(prev => [transaction, ...prev]);

      // Reset form
      setAmount('');
      refetchBalance();
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  // Handle withdraw IU2U -> U2U
  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const receipt = await tokenOps.withdraw(amount);
      console.log('Withdrawal successful:', receipt);

      // Add transaction to history
      const transaction: BridgeTransaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        sourceChain: selectedSourceChain?.name || '',
        amount,
        symbol: 'IU2U',
        status: 'pending',
        timestamp: Date.now()
      };
      setTransactions(prev => [transaction, ...prev]);

      // Reset form
      setAmount('');
      refetchBalance();
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  // Handle cross-chain token transfer
  const handleSendToken = async () => {
    if (!selectedDestinationChain || !recipientAddress || !amount) return;

    try {
      const receipt = await gatewayOps.sendToken(
        selectedDestinationChain.name,
        recipientAddress,
        'IU2U',
        amount
      );
      console.log('Cross-chain transfer successful:', receipt);

      // Add transaction to history
      const transaction: BridgeTransaction = {
        id: Date.now().toString(),
        type: 'sendToken',
        sourceChain: selectedSourceChain?.name || '',
        destinationChain: selectedDestinationChain.name,
        recipient: recipientAddress,
        amount,
        symbol: 'IU2U',
        status: 'pending',
        timestamp: Date.now()
      };
      setTransactions(prev => [transaction, ...prev]);

      // Reset form
      setAmount('');
      setRecipientAddress('');
      refetchBalance();
    } catch (error) {
      console.error('Cross-chain transfer failed:', error);
    }
  };

  // Handle contract call
  const handleContractCall = async () => {
    if (!selectedDestinationChain || !contractAddress || !payload) return;

    try {
      const receipt = isContractCall && amount
        ? await gatewayOps.callContractWithToken(
            selectedDestinationChain.name,
            contractAddress,
            payload,
            'IU2U',
            amount
          )
        : await gatewayOps.callContract(
            selectedDestinationChain.name,
            contractAddress,
            payload
          );

      console.log('Contract call successful:', receipt);

      // Add transaction to history
      const transaction: BridgeTransaction = {
        id: Date.now().toString(),
        type: isContractCall && amount ? 'callContractWithToken' : 'callContract',
        sourceChain: selectedSourceChain?.name || '',
        destinationChain: selectedDestinationChain.name,
        contractAddress,
        amount: isContractCall && amount ? amount : '',
        symbol: 'IU2U',
        status: 'pending',
        timestamp: Date.now()
      };
      setTransactions(prev => [transaction, ...prev]);

      // Reset form
      setAmount('');
      setContractAddress('');
      setPayload('');
      refetchBalance();
    } catch (error) {
      console.error('Contract call failed:', error);
    }
  };


  return (
    <DefaultLayout>
      <Head>
        <title>IU2U Bridge - Cross-Chain Token Transfers</title>
        <meta name="description" content="Bridge IU2U tokens across multiple EVM-compatible blockchains" />
      </Head>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col bg-black/2 items-center justify-center gap-4 py-6 md:py-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="inline-block max-w-4xl text-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4">
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              IU2U Cross-Chain Bridge
            </h1>
            <motion.button
              onClick={() => {/* TODO: Add info drawer */}}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <svg
                className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.button>
          </div>
          <h2 className={subtitle({ class: "mt-4 text-gray-300" })}>
            Transfer IU2U tokens seamlessly across multiple blockchains
          </h2>
        </motion.div>

        <div className="w-full grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-white">Bridge Operations</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Operation Type Tabs */}
                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    className="w-full"
                  >
                    <Tab key="deposit" title="Deposit/Withdraw">
                      <div className="space-y-4 mt-4">
                        {/* Chain Selector */}
                        <ChainSelector
                          chains={SUPPORTED_BRIDGE_CHAINS}
                          selectedChain={selectedSourceChain}
                          onChainSelect={setSelectedSourceChain}
                          label="Select Chain"
                        />

                        {/* Amount Input */}
                        <TokenAmountInput
                          amount={amount}
                          onAmountChange={setAmount}
                          balance={iu2uBalance}
                          symbol="IU2U"
                          maxAmount={iu2uBalance}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                          {isConnected ? (
                            <>
                              <BridgeActionButton
                                onClick={handleDeposit}
                                disabled={!amount || parseFloat(amount) <= 0 || tokenOps.isLoading}
                                loading={tokenOps.isLoading}
                              >
                                Deposit U2U → IU2U
                              </BridgeActionButton>

                              <BridgeActionButton
                                onClick={handleWithdraw}
                                disabled={!amount || parseFloat(amount) <= 0 || tokenOps.isLoading}
                                loading={tokenOps.isLoading}
                              >
                                Withdraw IU2U → U2U
                              </BridgeActionButton>
                            </>
                          ) : (
                            <BridgeActionButton
                              onClick={() => {/* TODO: Connect wallet */}}
                              disabled={false}
                              loading={false}
                            >
                              Connect Wallet to Deposit/Withdraw
                            </BridgeActionButton>
                          )}
                        </div>
                      </div>
                    </Tab>

                    <Tab key="transfer" title="Cross-Chain Transfer">
                      <div className="space-y-4 mt-4">
                        {/* Source Chain */}
                        <ChainSelector
                          chains={SUPPORTED_BRIDGE_CHAINS}
                          selectedChain={selectedSourceChain}
                          onChainSelect={setSelectedSourceChain}
                          label="From Chain"
                        />

                        {/* Destination Chain */}
                        <ChainSelector
                          chains={SUPPORTED_BRIDGE_CHAINS}
                          selectedChain={selectedDestinationChain}
                          onChainSelect={setSelectedDestinationChain}
                          label="To Chain"
                        />

                        {/* Recipient Address */}
                        <AddressInput
                          address={recipientAddress}
                          onAddressChange={setRecipientAddress}
                          label="Recipient Address"
                          placeholder="0x..."
                        />

                        {/* Amount Input */}
                        <TokenAmountInput
                          amount={amount}
                          onAmountChange={setAmount}
                          balance={iu2uBalance}
                          symbol="IU2U"
                          maxAmount={iu2uBalance}
                        />

                        {/* Transfer Button */}
                        {isConnected ? (
                          <BridgeActionButton
                            onClick={handleSendToken}
                            disabled={!selectedDestinationChain || !recipientAddress || !amount || gatewayOps.isLoading}
                            loading={gatewayOps.isLoading}
                          >
                            Send IU2U Cross-Chain
                          </BridgeActionButton>
                        ) : (
                          <BridgeActionButton
                            onClick={() => {/* TODO: Connect wallet */}}
                            disabled={false}
                            loading={false}
                          >
                            Connect Wallet to Transfer
                          </BridgeActionButton>
                        )}
                      </div>
                    </Tab>

                    <Tab key="contract" title="Contract Call">
                      <div className="space-y-4 mt-4">
                        {/* Source Chain */}
                        <ChainSelector
                          chains={SUPPORTED_BRIDGE_CHAINS}
                          selectedChain={selectedSourceChain}
                          onChainSelect={setSelectedSourceChain}
                          label="From Chain"
                        />

                        {/* Destination Chain */}
                        <ChainSelector
                          chains={SUPPORTED_BRIDGE_CHAINS}
                          selectedChain={selectedDestinationChain}
                          onChainSelect={setSelectedDestinationChain}
                          label="To Chain"
                        />

                        {/* Contract Address */}
                        <AddressInput
                          address={contractAddress}
                          onAddressChange={setContractAddress}
                          label="Contract Address"
                          placeholder="0x..."
                        />

                        {/* Payload */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Function Call Data
                          </label>
                          <textarea
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            placeholder="0x..."
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>

                        {/* Contract Call Options */}
                        <div className="flex flex-col items-start gap-4">
                          <label className="flex items-center gap-2 text-white">
                            <input
                              type="checkbox"
                              checked={isContractCall}
                              onChange={(e) => setIsContractCall(e.target.checked)}
                              className="rounded"
                            />
                            Send IU2U with call
                          </label>

                          {isContractCall && (
                            <TokenAmountInput
                              amount={amount}
                              onAmountChange={setAmount}
                              balance={iu2uBalance}
                              symbol="IU2U"
                              maxAmount={iu2uBalance}
                            />
                          )}
                        </div>

                        {/* Contract Call Button */}
                        {isConnected ? (
                          <BridgeActionButton
                            onClick={handleContractCall}
                            disabled={!selectedDestinationChain || !contractAddress || !payload || gatewayOps.isLoading}
                            loading={gatewayOps.isLoading}
                          >
                            {isContractCall && amount ? 'Call Contract with IU2U' : 'Call Contract'}
                          </BridgeActionButton>
                        ) : (
                          <BridgeActionButton
                            onClick={() => {/* TODO: Connect wallet */}}
                            disabled={false}
                            loading={false}
                          >
                            Connect Wallet to Call Contract
                          </BridgeActionButton>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BridgeTransactionHistory
                transactions={transactions}
                onTransactionClick={(tx: BridgeTransaction) => console.log('Transaction clicked:', tx)}
              />
            </motion.div>

            {/* Balance Display */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
                <CardBody className="text-center space-y-4">
                  <div className="text-white">
                    <p className="text-sm opacity-75">Your IU2U Balance</p>
                    <p className="text-2xl font-bold">
                      {isConnected ? (
                        balanceLoading ? '...' : `${iu2uBalance} IU2U`
                      ) : (
                        <span className="text-gray-400 text-lg">Connect wallet to view balance</span>
                      )}
                    </p>
                  </div>

                  {/* Show native U2U balance when on U2U testnet */}
                  {isConnected && selectedSourceChain?.id === 2484 && (
                    <div className="text-white border-t border-white/20 pt-4">
                      <p className="text-sm opacity-75">Your U2U Balance (Native)</p>
                      <p className="text-xl font-semibold">
                        {nativeBalanceLoading ? '...' : `${nativeU2UBalance} U2U`}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default BridgePage;