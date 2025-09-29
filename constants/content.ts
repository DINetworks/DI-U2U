// Centralized content constants for static text and data
// This makes it easier to maintain and internationalize content

export const APP_CONTENT = {
  // Navigation and branding
  app: {
    name: "Gasless Meta-Transactions",
    tagline: "Pay Gas Fees in U2U Across All Chains",
  },

  // Home page content
  home: {
    hero: {
      title: "Gasless Meta-Transactions",
      subtitle: "Pay Gas Fees in U2U Across All Chains",
      infoButtonTitle: "Learn more about gasless transactions",
    },
    features: {
      title: "Key Features of the Protocol",
      items: [
        {
          title: "DEX Aggregators",
          description: "Swap tokens across multiple DEXs with optimal rates",
          icon: "🚀",
        },
        {
          title: "Lending Protocols",
          description: "Supply and borrow assets across lending platforms",
          icon: "💰",
        },
        {
          title: "Liquidity Provisioning",
          description: "Provide liquidity and earn rewards",
          icon: "📊",
        },
        {
          title: "Staking & Farming",
          description: "Stake tokens and farm yield rewards",
          icon: "🔗",
        },
      ],
    },
    components: {
      title: "Main Components of the Protocol",
      items: [
        {
          title: "Gasless Batch Transfer",
          description: "Execute multiple transfers without gas fees",
          icon: "⚡",
        },
        {
          title: "Gas Credit System",
          description: "Prepaid gas credits using U2U tokens",
          icon: "💳",
        },
        {
          title: "Multi-Chain Support",
          description: "Works across all supported blockchains",
          icon: "🌐",
        },
        {
          title: "Smart Contract Integration",
          description: "Seamless integration with DeFi protocols",
          icon: "🔧",
        },
      ],
    },
  },

  // Info Drawer content
  infoDrawer: {
    header: {
      title: "Gasless Meta-Transactions Guide",
      subtitle: "Learn how gasless transactions work and explore all features",
    },
    sections: {
      whatAreGasless: {
        title: "What are Gasless Transactions?",
        content:
          "Gasless transactions allow you to execute blockchain operations without paying gas fees in the native token of the chain. Instead, you pay in U2U tokens, which are converted to cover your gas costs across all supported chains.",
        benefits:
          "Benefits: No need to hold native tokens, unified payment system, cross-chain compatibility",
      },
      howItWorks: {
        title: "How It Works",
        steps: [
          {
            title: "Deposit U2U Tokens",
            content:
              "Deposit U2U tokens into your gas credit vault to build up credits for gasless transactions.",
          },
          {
            title: "Approve Tokens",
            content:
              "Approve tokens you want to transfer gaslessly through the meta-transaction gateway.",
          },
          {
            title: "Execute Gasless Transfers",
            content:
              "Create batch transfers that execute without paying gas fees in native tokens.",
          },
        ],
      },
      componentGuide: {
        title: "Component Guide",
        components: [
          {
            title: "Gasless Batch Transfer",
            content:
              "Main component for creating multiple token transfers. Add/remove transfer rows, select tokens, enter amounts and recipient addresses.",
          },
          {
            title: "Gas Credit Card",
            content:
              "Shows your current U2U credit balance. Use deposit/withdraw buttons to manage your gas credits.",
          },
          {
            title: "Approved Tokens Card",
            content:
              "Lists all tokens you've approved for gasless transfers. Add new approvals or remove existing ones.",
          },
          {
            title: "Contracts Info",
            content:
              "Displays important contract addresses and network information for transparency.",
          },
        ],
      },
      proTips: {
        title: "Pro Tips",
        tips: [
          "Maintain sufficient U2U balance for gas credits",
          "Batch multiple transfers to save on overall gas costs",
          "Check gas estimates before confirming transactions",
          "Approved tokens remain approved until manually disapproved",
        ],
      },
    },
    footer: {
      buttonText: "Got it!",
    },
  },

  // First Time Guide content
  firstTimeGuide: {
    steps: [
      {
        title: "Welcome to Gasless Meta-Transactions! 🎉",
        content:
          "This platform allows you to execute blockchain transactions without paying gas fees in native tokens. Instead, you pay in U2U tokens across all supported chains.",
        benefits: [
          "No need to hold native tokens for each chain",
          "Unified payment system across all chains",
          "Batch multiple transfers to save costs",
          "Real-time gas cost estimation",
        ],
        instructions: [],
        costOptimization: [],
        securityNotes: [],
      },
      {
        title: "Step 1: Build Your Gas Credit 💰",
        content:
          "First, you need to deposit U2U tokens to build up your gas credit balance. This credit will be used to pay for gas fees across all supported chains.",
        benefits: [],
        instructions: [
          'Click the "Deposit" button in the Gas Credit Card',
          "Select a U2U token from the dropdown",
          "Enter the amount you want to deposit",
          "Approve the transaction and confirm",
        ],
        costOptimization: [],
        securityNotes: [],
      },
      {
        title: "Step 2: Approve Tokens for Transfer ✅",
        content:
          "Before you can transfer tokens gaslessly, you need to approve them for the meta-transaction gateway. This allows the system to execute transfers on your behalf.",
        benefits: [],
        instructions: [
          'Click "Approve Token" in the Approved Tokens Card',
          "Search and select the token you want to approve",
          "Confirm the approval transaction",
          "Once approved, the token appears in your approved list",
        ],
        costOptimization: [],
        securityNotes: [],
      },
      {
        title: "Step 3: Create Gasless Transfers 🚀",
        content:
          "Now you're ready to create gasless batch transfers! You can send multiple tokens to different addresses in a single transaction.",
        benefits: [],
        instructions: [
          "Select approved tokens from the dropdown",
          "Enter recipient addresses (must be valid)",
          "Specify transfer amounts",
          "Add multiple transfer rows as needed",
          "Review costs and confirm the transaction",
        ],
        costOptimization: [],
        securityNotes: [],
      },
      {
        title: "Pro Tips & Best Practices 💡",
        content:
          "Click the info icon next to the page title anytime to access the full guide and documentation.",
        benefits: [],
        instructions: [],
        costOptimization: [
          "Batch multiple transfers together",
          "Check gas estimates before confirming",
          "Monitor your credit balance",
        ],
        securityNotes: [
          "Double-check recipient addresses",
          "Verify token approvals",
          "Keep sufficient U2U balance",
        ],
      },
    ],
    navigation: {
      previous: "Previous",
      next: "Next",
      skip: "Don't show me again",
      finish: "Get Started",
    },
  },

  // Common UI elements
  ui: {
    buttons: {
      connectWallet: "Connect Wallet",
      deposit: "Deposit",
      withdraw: "Withdraw",
      approve: "Approve",
      disapprove: "Disapprove",
      reviewTransfer: "Review Transfer",
      confirmTransfer: "Confirm Transfer",
      cancel: "Cancel",
      close: "Close",
      viewTransaction: "View Transaction",
      switchNetwork: "Switch Network",
      disconnect: "Disconnect Wallet",
    },
    labels: {
      amount: "Amount",
      receiver: "Receiver Address",
      token: "Token",
      balance: "Balance",
      credit: "Credit",
      network: "Network",
      address: "Address",
    },
    messages: {
      insufficientCredits:
        "Insufficient credits. You need {amount} more U2U credits.",
      invalidAddress: "Invalid address format",
      insufficientBalance: "Insufficient balance",
      depositRequired:
        "Please deposit U2U first to enable gasless transactions",
      approvalRequired: "Token approval required",
      transactionPending: "Transaction pending...",
      transactionSuccess: "Transaction successful!",
      transactionFailed: "Transaction failed",
    },
    placeholders: {
      enterAmount: "Enter amount",
      enterAddress: "0x...",
      selectToken: "Select token",
    },
  },

  // Bridge content
  bridge: {
    title: "IU2U Cross-Chain Bridge",
    subtitle:
      "Seamlessly transfer IU2U tokens across multiple blockchain networks",
    description:
      "Experience true interoperability with IU2U's decentralized bridge protocol. Transfer tokens, execute cross-chain contracts, and interact with dApps across supported chains.",

    tabs: {
      deposit: {
        title: "Deposit/Withdraw",
        description: "Convert between native U2U and IU2U tokens",
      },
      transfer: {
        title: "Cross-Chain Transfer",
        description: "Send IU2U tokens to other blockchain networks",
      },
      contract: {
        title: "Contract Interaction",
        description: "Execute smart contracts across different chains",
      },
    },

    operations: {
      deposit: {
        title: "Deposit U2U → IU2U",
        description:
          "Convert your native U2U tokens to IU2U tokens for cross-chain use",
        buttonText: "Deposit Tokens",
      },
      withdraw: {
        title: "Withdraw IU2U → U2U",
        description: "Convert IU2U tokens back to native U2U tokens",
        buttonText: "Withdraw Tokens",
      },
      transfer: {
        title: "Cross-Chain Transfer",
        description: "Send IU2U tokens to any supported blockchain network",
        buttonText: "Transfer Tokens",
      },
      contractCall: {
        title: "Contract Call",
        description: "Execute smart contract functions across different chains",
        buttonText: "Execute Contract",
      },
      contractCallWithToken: {
        title: "Contract Call with Tokens",
        description: "Execute contracts while sending IU2U tokens",
        buttonText: "Execute with Tokens",
      },
    },

    labels: {
      fromChain: "From Chain",
      toChain: "To Chain",
      amount: "Amount",
      recipient: "Recipient Address",
      contractAddress: "Contract Address",
      functionData: "Function Call Data",
      balance: "Balance",
      max: "MAX",
      sendWithCall: "Send IU2U with call",
    },

    placeholders: {
      enterAmount: "Enter amount",
      enterAddress: "0x...",
      enterContractAddress: "0x...",
      enterFunctionData: "0x...",
    },

    messages: {
      connectWallet: "Please connect your wallet to use the IU2U Bridge",
      insufficientBalance: "Insufficient balance",
      invalidAddress: "Invalid address format",
      transactionPending: "Transaction pending...",
      transactionSuccess: "Transaction completed successfully",
      transactionFailed: "Transaction failed",
      preparingSignature: "Preparing signature...",
      estimatingCost: "Estimating transaction cost...",
      switchNetwork: "Please switch to the correct network",
    },

    supportedChains: {
      u2u: "U2U Solaris Mainnet",
      polygon: "Polygon",
      bsc: "BSC",
      base: "Base",
    },

    features: [
      {
        title: "Cross-Chain Transfers",
        description:
          "Send IU2U tokens seamlessly between supported blockchain networks",
      },
      {
        title: "Contract Interactions",
        description: "Execute smart contract functions across different chains",
      },
      {
        title: "Decentralized Security",
        description:
          "Powered by decentralized relayers ensuring secure cross-chain communication",
      },
      {
        title: "Real-time Tracking",
        description:
          "Monitor your cross-chain transactions with real-time status updates",
      },
    ],
  },

  // Tooltips and help text
  tooltips: {
    switchNetwork: "Switch Network",
    copyAddress: "Copy address to clipboard",
    viewOnExplorer: "View transaction on blockchain explorer",
    gasCredit: "Your current U2U gas credit balance",
    approvedTokens: "Tokens approved for gasless transfers",
  },
} as const;

// Type for content keys
export type ContentKey = keyof typeof APP_CONTENT;
