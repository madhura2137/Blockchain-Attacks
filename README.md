# 🛡️ Blockchain Security Lab: Interactive Attack & Defense Simulator

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: JavaScript](https://img.shields.io/badge/Language-ES6%2B%20JavaScript-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Markup: HTML5 / CSS3](https://img.shields.io/badge/UI-HTML5%20%7C%20CSS3%20Glassmorphism-E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Solidity Compatible](https://img.shields.io/badge/Solidity-%5E0.8.0%20%7C%200.4.18-363636.svg?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Live%20Simulation-00C853.svg)](#-live-demo)
[![Evaluation: TY BCT](https://img.shields.io/badge/Academic-TY%20B.Tech%20Sem%205%20BCT%20TAE--2-blueviolet.svg)](#-academic-evaluation--presentation-script)

**An educational, interactive Web3 exploit and defense laboratory simulating the mechanics of historic blockchain vulnerabilities.**

[🌐 Live Demo](https://madhura2137.github.io/Blockchain-Attacks/) • [⚡ Features](#-key-features) • [🎯 Simulation Modules](#-the-three-historic-simulation-modules) • [🔬 EVM Architecture](#-under-the-hood-evm-architecture) • [🚀 Quick Start](#-quick-start--how-to-run) • [🎤 Viva Q&A](#-frequently-asked-viva-questions)

</div>

---

## 🌐 Live Demo

You can interact with the live simulation directly in your web browser:  
👉 **[Launch Blockchain Security Lab Online](https://madhura2137.github.io/Blockchain-Attacks/)**

*(Zero installation, zero dependencies, runs 100% client-side in vanilla JavaScript)*

---

## 📖 Executive Summary

Smart contracts deployed on public blockchains are **immutable** and govern billions of dollars in decentralized liquidity. Because "code is law", logical vulnerabilities in smart contract logic cannot simply be patched on-the-fly like traditional web applications. Once a contract is deployed, any vulnerability can be exploited irreversibly by external callers.

This interactive lab visualizes and dissects three landmark security catastrophes in blockchain history:

1. 🔴 **The DAO Reentrancy Attack (2016)** — $60M stolen (3.6M ETH), precipitating the historic Ethereum / Ethereum Classic chain fork.
2. 🌉 **The Ronin Bridge Multi-Sig Compromise (March 2022)** — $625M exploit of Axie Infinity's cross-chain validator network via key harvesting and stale RPC signing permissions.
3. 🔓 **Unprotected Initializer / Parity Multi-Sig Hack (2017)** — Missing access modifiers in initialization functions enabling arbitrary state usurping and freeze of hundreds of millions in Ether.

---

## ⚡ Key Features

- 🎭 **Dual Interaction Modes**:
  - **Visual Story Mode**: Intuitive high-level flow with animated balance bars, ETH coin particle transfers, audio effects, and step-by-step narrative.
  - **Under-The-Hood EVM Mode**: Deep low-level mechanics showing real-time **Call Stack Depth**, **Memory Slots**, **Storage Modifications**, and **Gas Counters**.
- 🔍 **Dual-Pane Solidity Code Inspector**:
  - Side-by-side comparison of **Vulnerable Code** vs **Patched Code**.
  - Synchronized line highlighting that follows each step of the exploit and defense execution.
- 🎛️ **Full Playback Controls**:
  - `Next Step (⚔️)`: Manually step through the exploit/defense cycle one state at a time.
  - `Auto Play (▶)`: Automated continuous execution with customizable simulation speeds (1x, 1.5x, 2x).
  - `Reset (🔄)`: Instant zero-state reset with full storage restoration.
- 🔊 **Zero-Dependency Synthesizer Audio Engine**:
  - Real-time audio tones generated using the **Web Audio API** (deposit chime, recursive reentrancy warning siren, transaction revert buzzer, and defense confirmation beep).
- 🧩 **Interactive Knowledge Quizzes**:
  - Built-in assessment quiz at the conclusion of each module to test understanding of root causes, EVM storage, and design patterns.

---

## 🎯 The Three Historic Simulation Modules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BLOCKCHAIN SECURITY LAB MODULES                       │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│   1. The DAO Hack       │   2. Ronin Bridge Hack  │   3. Parity Multi-Sig   │
│   (Reentrancy)          │   (Validator Quorum)    │   (Unprotected Init)    │
│                         │                         │                         │
│  • Storage vs Transfer  │  • 5 of 9 PoA Scheme    │  • Constructor vs Func  │
│  • Fallback function    │  • Key Harvesting       │  • Storage Hijacking    │
│  • Recursive call stack │  • Stale RPC Whitelist  │  • Missing Modifiers    │
│  • CEI & ReentrancyGuard│  • Timelocks & 9/11     │  • OpenZeppelin Init    │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

### Module 1: The DAO Reentrancy Attack (2016)

#### 💥 The Vulnerability (Root Cause)
In Solidity, sending Ether via `.call{value: amount}("")` hands execution control over to the recipient address. If the recipient is a contract, its `receive()` or `fallback()` function triggers immediately. 

In The DAO's contract, the developer executed the external transfer **before** decrementing the user's recorded storage balance:

```solidity
// ❌ VULNERABLE: State mutated AFTER external call
function withdraw() public {
    uint256 amount = balances[msg.sender];
    require(amount > 0);

    // 1. Hands execution control to caller before zeroing balance!
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);

    // 2. Storage effect never reached until entire call stack finishes
    balances[msg.sender] = 0; 
}
```

```
[Attacker]                  [Vulnerable DAO]
    │                               │
    │─────── 1. withdraw() ────────>│ (checks balances[attacker] == 10 ETH)
    │                               │
    │<─── 2. ETH (10 ETH) ──────────│ (sends ETH via external call)
    │     triggers receive()        │
    │                               │
    │─────── 3. withdraw() AGAIN ──>│ (balance STILL reads 10 ETH!)
    │                               │
    │<─── 4. ETH (10 ETH) ──────────│ (sends another 10 ETH!)
    │     triggers receive()        │
    │                               │
    │─────── 5. withdraw() AGAIN ──>│ (repeats until DAO vault = 0 ETH)
```

#### 🛡️ The Defense (Checks-Effects-Interactions & Mutex Guard)
1. **Checks-Effects-Interactions (CEI) Pattern**: Always update contract storage (`balances[msg.sender] = 0`) *prior* to initiating any external calls.
2. **ReentrancyGuard**: Use a mutex status lock (`nonReentrant` modifier) that reverts if re-entered.

```solidity
// ✅ SECURE: Checks-Effects-Interactions + Mutex
function withdraw() public nonReentrant {
    // 1. Checks
    uint256 amount = balances[msg.sender];
    require(amount > 0, "Zero balance");

    // 2. Effects (Storage updated FIRST!)
    balances[msg.sender] = 0;

    // 3. Interactions (External call executed LAST)
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

---

### Module 2: Ronin Network Cross-Chain Bridge Hack ($625M - March 2022)

#### 💥 The Vulnerability (Root Cause)
Axie Infinity's Ronin sidechain used a **Proof-of-Authority (PoA)** model with 9 validator nodes. Any deposit or withdrawal across the bridge to Ethereum required signatures from a quorum of at least **5 out of 9** validators.

- **4 Nodes** were owned and hosted directly by Sky Mavis.
- **1 Node** was run by the Axie DAO.
- In November 2021, due to heavy user traffic, Axie DAO granted Sky Mavis permission to sign transactions on its behalf via an RPC endpoint whitelist. This permission was **never revoked**.
- In March 2022, the Lazarus Group compromised a Sky Mavis engineer's machine via a spear-phishing fake job offer PDF, obtaining access to the 4 Sky Mavis private keys plus the Axie DAO RPC signing proxy—giving them the requisite 5/9 quorum to drain 173,600 ETH and 25.5M USDC.

```
[Sky Mavis Node 1] ──► [COMPROMISED] ──┐
[Sky Mavis Node 2] ──► [COMPROMISED] ──┤
[Sky Mavis Node 3] ──► [COMPROMISED] ──┼──► 5 / 9 Quorum Reached!
[Sky Mavis Node 4] ──► [COMPROMISED] ──┤    Bridge Funds Unlocked ($625M)
[Axie DAO Node 5 ] ──► [COMPROMISED] ──┘    (Stale Nov 2021 Whitelist)
──────────────────────────────────────
[Animoca Node 6  ] ──► [SECURE]
[Binance Node 7  ] ──► [SECURE]
[Delphi Node 8   ] ──► [SECURE]
[Dialectic Node 9] ──► [SECURE]
```

#### 🛡️ The Defense (Multi-Tier Bridge Architecture)
1. **Decentralized Quorum Increase**: Expand validator set to 11+ independent institutions, requiring 9 of 11 signatures (80%+ threshold).
2. **Timelock Delays**: Transactions exceeding a threshold (e.g., $100,000) are placed into a mandatory 24-hour withdrawal queue.
3. **Automated Anomaly Circuit Breaker**: Real-time heuristics freeze outgoing bridge contracts if volume exceeds historical statistical standard deviations.

---

### Module 3: Parity Multi-Sig Unprotected Initializer (2017)

#### 💥 The Vulnerability (Root Cause)
To reduce deployment gas costs, Parity deployed a single master `WalletLibrary` containing all wallet logic, and lightweight user multi-sig proxy contracts forwarded calls to it via `delegatecall`.

However, the initialization function inside the library was a standard `public` function lacking any check verifying whether initialization had already taken place:

```solidity
// ❌ VULNERABLE: No initializer check, no access modifier
function initWallet(address[] _owners, uint _required, uint _daylimit) public {
    // Anyone can call this at any time on the uninitialized library!
    initDaylimit(_daylimit);
    initMultiowned(_owners, _required);
}
```

An external attacker invoked `initWallet([attackerAddress], 1, ...)` directly on the shared library, becoming its sole owner, and subsequently called `kill()` (`selfdestruct`), destroying the library and permanently freezing **513,774 ETH** across 587 multi-sig wallets.

#### 🛡️ The Defense (OpenZeppelin Initializable Pattern)
1. Use OpenZeppelin's `Initializable` contract standard.
2. Guard the function with an `initializer` modifier enforcing that execution occurs strictly once:

```solidity
// ✅ SECURE: Guaranteed single-execution guard
bool private _initialized;

modifier initializer() {
    require(!_initialized, "Contract instance has already been initialized");
    _initialized = true;
    _;
}

function initialize(address[] memory _owners, uint256 _required) public initializer {
    // Safe initialization
}
```

---

## 🔬 Under-The-Hood EVM Architecture

The laboratory features a dedicated **EVM Forensics Engine** that exposes what actually happens inside the Ethereum Virtual Machine during attacks:

```
┌────────────────────────────────────────────────────────┐
│                   EVM EXECUTION STATE                  │
├──────────────────────────┬─────────────────────────────┤
│      CALL STACK          │       STORAGE SLOTS         │
│  [Depth 3] withdraw()    │  Slot 0: 0x0 (owner)        │
│  [Depth 2] withdraw()    │  Slot 1: 0x000... (balance) │
│  [Depth 1] withdraw()    │  Slot 2: 0x1 (mutex lock)   │
├──────────────────────────┼─────────────────────────────┤
│      MEMORY BUFFER       │       GAS METER             │
│  0x00: 0x2e1a7d4d (hash) │  Gas Left: 2,841,200        │
│  0x20: 0x000000000000000a│  Burnt Gas: 158,800         │
└──────────────────────────┴─────────────────────────────┘
```

- **Call Stack Monitor**: Renders every frame pushed onto the EVM call stack during recursive loops, demonstrating stack growth up to the 1024-frame EVM limit.
- **Storage Diff Tracker**: Color-codes mutated slots (green = updated, red = stale/vulnerable).
- **Gas Profiler**: Dynamically tallies gas consumed by opcodes (`SLOAD`, `SSTORE`, `CALL`, `REVERT`).

---

## 🚀 Quick Start & How to Run

### Option 1: Double-Click (Zero Setup)
1. Clone this repository:
   ```bash
   git clone https://github.com/madhura2137/Blockchain-Attacks.git
   ```
2. Open the cloned folder and double-click `index.html`.
3. The lab runs immediately in any modern browser (**Chrome**, **Edge**, **Firefox**, **Brave**, **Safari**).

### Option 2: Local HTTP Server (VS Code / Python / Node)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```
Navigate to `http://localhost:8000` in your web browser.

---

## ⚙️ Enabling GitHub Pages (To Host Your Own Live Site)

To host this repository online for free using GitHub Pages:

1. Go to your repository on GitHub: `https://github.com/madhura2137/Blockchain-Attacks`.
2. Click on **Settings** (top right tab).
3. In the left sidebar, click on **Pages**.
4. Under **Build and deployment** > **Branch**:
   - Select `main` branch.
   - Folder: `/ (root)`.
5. Click **Save**.
6. Within 1-2 minutes, your live website will be published at:  
   `https://madhura2137.github.io/Blockchain-Attacks/`

---

## 🎤 Academic Evaluation & Presentation Script

Use this script during your classroom or viva presentation:

```text
================================================================================
                    3-MINUTE VIVA PRESENTATION SCRIPT
================================================================================

1. INTRODUCTION (30s)
   "Good morning respected professor. Smart contracts on blockchain networks are
   immutable and manage billions of dollars. Because 'code is law', a logic bug
   cannot be patched in-place once deployed. Today, I present an interactive Web3
   Security Simulator showcasing 3 historic exploits: The DAO Reentrancy, the 
   $625M Ronin Bridge multi-sig breach, and Parity's unprotected initializer."

2. MODULE 1: THE DAO REENTRANCY (60s)
   - Show Normal Withdrawal: "In honest operation, balance checks pass, 10 ETH is
     sent, and recorded balance drops to 0."
   - Show Attack Flow: "In the vulnerable code, line 7 executes the external call
     BEFORE line 11 updates storage. The attacker's fallback re-calls withdraw()
     recursively while balance still reads 10 ETH. 30 ETH is drained from a 10 ETH
     deposit."
   - Show Patched Code: "Switching to Patched Mode demonstrates the Checks-Effects-
     Interactions pattern. Updating storage first neutralizes reentrancy, while
     OpenZeppelin's nonReentrant mutex reverts any recursive attempt."

3. MODULE 2: RONIN BRIDGE COMPROMISE (45s)
   - Show 5/9 Quorum: "Ronin relied on a 5 of 9 Proof-of-Authority threshold. 
     Through spear-phishing and a forgotten RPC signing whitelist on Axie DAO, 
     Lazarus obtained 5 valid keys, satisfying quorum and draining $625M."
   - Show Defense: "Mitigation enforces 9/11 independent signers, 24h timelocks
     for large transfers, and automated volume anomaly circuit breakers."

4. MODULE 3: PARITY UNPROTECTED INITIALIZER (30s)
   - Show Exploit: "Constructors run only at deployment. For libraries and proxies,
     developers use init functions. Parity left initWallet() public without an
     access modifier, allowing anyone to claim ownership and call selfdestruct."
   - Show Defense: "We fix this with OpenZeppelin's Initializable pattern."
================================================================================
```

---

## ❓ Frequently Asked Viva Questions

| # | Question | Comprehensive Answer |
|:-:|:---|:---|
| **1** | **What is reentrancy in smart contracts?** | Reentrancy occurs when a contract makes an external call to an untrusted contract before completing its internal state updates. The recipient contract hijacks the control flow and calls back into the caller repeatedly before storage updates finish. |
| **2** | **What is the Checks-Effects-Interactions (CEI) pattern?** | It is an essential Solidity development pattern: 1) **Checks**: validate conditions (`require`); 2) **Effects**: mutate contract state/storage; 3) **Interactions**: perform external contract calls or value transfers last. |
| **3** | **Why did Ethereum split into ETH and ETC after The DAO?** | The DAO held 15% of all circulating Ether. The community voted to implement an irregular state transition (hard fork) to refund victims. Those advocating code immutability remained on the original chain, now known as **Ethereum Classic (ETC)**. |
| **4** | **What is a Mutex / ReentrancyGuard?** | A state lock pattern (such as OpenZeppelin's `nonReentrant`). It sets a storage slot to a non-zero value upon entering a function, and reverts if any sub-call attempts to enter any guarded function before the initial execution returns. |
| **5** | **Why did the Ronin Bridge exploit take 6 days to detect?** | Because cryptographically, the transaction was valid. It possessed 5 authentic ECDSA signatures satisfying the contract's quorum logic. Without off-chain monitoring, timelocks, or anomaly detection, the contract executed the valid request as designed. |
| **6** | **What is the difference between `call`, `delegatecall`, and `transfer`?** | `call` executes code in the context of the external contract; `delegatecall` executes code from the target library within the caller's storage context; `transfer` forwards a hard gas stipend limit of 2300 gas (deprecated due to changing gas costs). |
| **7** | **Why can't constructors be used in proxy / upgradeable contracts?** | Constructors execute in the context of contract deployment and are not stored in runtime bytecode. Proxies delegate calls to the implementation logic contract, meaning only runtime functions can mutate proxy storage slots. |
| **8** | **How does Solidity 0.8.x handle arithmetic overflow/underflow?** | Prior to 0.8.0, arithmetic operations wrapped silently without reverting (requiring SafeMath). In Solidity 0.8.0+, all integer arithmetic includes native compiler-level overflow/underflow checks that automatically revert the transaction. |

---

## 📁 Repository Structure

```
Blockchain-Attacks/
├── index.html                   # Core interactive laboratory web application
├── style.css                    # Web3 dark theme, responsive layout & animations
├── script.js                    # EVM state machine, audio synthesizer & simulation logic
├── README.md                    # Comprehensive documentation, viva scripts & architecture
├── LICENSE                      # MIT Open Source License
├── .gitignore                   # Standard exclusions for OS, editor & build artifacts
└── Blockchain-Security-Demo/    # Standalone package directory
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <b>Developed for Third Year B.Tech / B.E. Blockchain Technology (BCT) Academic Evaluation & Demonstration</b><br>
  <sub>Contributions, issues, and star ratings are welcome!</sub>
</div>
