# 🛡️ Blockchain Security Lab: Interactive Attack & Defense Simulator

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: JavaScript](https://img.shields.io/badge/Language-ES6%2B%20JavaScript-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Markup: HTML5 / CSS3](https://img.shields.io/badge/UI-HTML5%20%7C%20CSS3%20Glassmorphism-E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Solidity Compatible](https://img.shields.io/badge/Solidity-%5E0.8.0%20%7C%200.4.18-363636.svg?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Live%20Simulation-00C853.svg)](#-live-demo)
[![Evaluation: TY BCT](https://img.shields.io/badge/Academic-TY%20B.Tech%20Sem%205%20BCT%20TAE--2-blueviolet.svg)](#-academic-evaluation--presentation-script)

**An educational, interactive Web3 exploit and defense laboratory simulating the mechanics of historic blockchain vulnerabilities.**

[🌐 Live Demo](https://madhura2137.github.io/Blockchain-Attacks/) • [⚡ Features](#-key-features) • [🎯 Simulation Modules](#-the-six-interactive-simulation-modules) • [🔬 Architecture](#-under-the-hood-architecture) • [🚀 Quick Start](#-quick-start--how-to-run) • [🎤 Viva Q&A](#-frequently-asked-viva-questions)

</div>

---

## 🌐 Live Demo

Interact with the live simulation directly in your web browser:  
👉 **[Launch Blockchain Security Lab Online](https://madhura2137.github.io/Blockchain-Attacks/)**

*(Zero installation, zero dependencies, runs 100% offline and client-side in pure HTML5, CSS3, and Vanilla JavaScript)*

---

## 📖 Executive Summary

Smart contracts and distributed ledgers govern hundreds of billions of dollars in decentralized liquidity. Because **code is law** and blockchain transactions are **immutable**, software bugs and game-theoretic design flaws cannot be silently patched on-the-fly like traditional web servers. Once deployed, any vulnerability can be irreversibly exploited by adversarial actors worldwide.

This interactive educational demonstrator provides safe, visual, offline simulations of 6 landmark security vulnerabilities and attacks in blockchain history:

1. ⛏️ **51% Consensus Majority Attack** — Mining pools seizing >50% hashrate to secretly outpace canonical chains and force massive chain reorganizations.
2. 🎭 **Sybil Attack (Identity Forgery)** — A single adversary spinning up virtual sock-puppet nodes to overpower naive democratic peer voting.
3. 🪙 **Double Spending (UTXO Race Attack)** — Exploiting zero-confirmation merchants by broadcasting conflicting transactions spending the same coin twice.
4. 🔄 **The DAO Reentrancy Catastrophe (2016)** — $60M drained via recursive fallback execution before internal balances update, causing the Ethereum / Ethereum Classic hard fork.
5. 🌉 **Ronin Bridge Multi-Sig Compromise ($625M - 2022)** — Harvesting private keys of 5 out of 9 validator nodes to authorize illicit cross-chain withdrawals.
6. 🐛 **Smart Contract Bugs (Underflow & Access Control)** — Arithmetic underflow in pre-0.8 Solidity (`0 - 1 = 255`) and missing `onlyOwner` access modifiers allowing total contract takeover.

---

## ⚡ Key Features

- 🧒 **ELI5 Everyday Metaphor Banners**:
  - Each attack begins with an intuitive real-world analogy (e.g. *The 51-Student Bus Takeover*, *The Free Ice Cream Disguise Trick*, *The Glitched ATM*, *The Teleporting $100 Bill*).
- 🔀 **Vulnerable vs. Patched Toggle**:
  - Switch between vulnerable configurations and industry-standard mitigations (Checks-Effects-Interactions, Casper FFG Checkpoints, Proof-of-Stake, 6-Confirmation Rule, OpenZeppelin Ownable).
- 🎛️ **Standardized Step-by-Step State Machines**:
  - `Normal Action`: Observe valid, healthy consensus operations first.
  - `Next Attack Step (Step X of Y)`: Step incrementally through each phase of an exploit.
  - `Auto-Play Attack`: Hands-free automated playback with custom pacing for presentation delivery.
  - `Reset Demo`: Instant return to initial baseline for audience Q&A.
- 📟 **macOS-Style Live Terminal Logs**:
  - Formatted narration console with red, yellow, and green status indicators explaining every state change in plain English.
- 🎨 **Visual Architecture Canvases**:
  - Competing blockchain visualizer showing orphaned blocks and the Longest Chain Rule.
  - SVG dynamic puppet wires connecting sock-puppet nodes to a single adversary mastermind.
  - Mechanical spinning odometer visualizer for integer underflows.
  - Multi-sig 9-lock vault door graphic and live Quorum meter.
  - Call Stack visualizer showing frame recursion depth during reentrancy.
- 🔊 **Zero-Dependency Synthesizer Audio Engine**:
  - Real-time audio tones synthesized natively using the **Web Audio API** (deposit chime, warning alarms, transaction sirens, and success chimes).
- 📊 **Prevention Matrix & Classroom Quiz**:
  - Comprehensive comparison matrix comparing Root Causes, Attack Vectors, Historic Losses, and Standard Mitigations across all 6 attacks.
  - 6-question multiple choice quick quiz with real-time scoring and instant feedback.
- 🎓 **Presenter Mode (`P`) & Speaker Notes Drawer (`S`)**:
  - Built-in slide presentation banner and slide-out speaker notes drawer with talking points and analogies for classroom delivery.

---

## 🎯 The Six Interactive Simulation Modules

### 1. ⛏️ 51% Attack (Nakamoto Consensus Reorg)
* **Everyday Metaphor**: The 51-Student Bus Takeover.
* **Mechanism**: When an attacker controls >50% hashrate, they secretly mine a longer private fork while honest miners work publicly. When released, Nakamoto's Longest Chain Rule forces all nodes to abandon the honest chain (orphaning blocks) and erasing confirmed transactions.
* **Defense**: Casper FFG finality checkpoints (blocks past 2 epochs cannot be reorganized) and massive economic proof-of-work scale.

### 2. 🎭 Sybil Attack (Fake Digital Personas)
* **Everyday Metaphor**: The Free Ice Cream Disguise Trick.
* **Mechanism**: In a naive 1-IP-1-Vote system, an adversary spawns dozens of virtual socket identities for $0 to outvote honest peers and loot the DAO treasury.
* **Defense**: Proof-of-Stake (voting power proportional to capital collateral, e.g. 32 ETH) and Proof-of-Work (computational cost), making identity forging economically meaningless.

### 3. 🪙 Double Spending (Conflicting UTXO Race Attack)
* **Everyday Metaphor**: The Teleporting $100 Bill.
* **Mechanism**: Exploiting a 0-confirmation merchant. Alice buys a laptop from Bob and walks out with the product. Immediately, she broadcasts a conflicting transaction spending the same UTXO to Charlie with 5x higher gas fee. Rational miners mine Charlie's transaction, dropping Bob's payment.
* **Defense**: 6-confirmation rule; merchants wait for block depth before releasing physical goods.

### 4. 🔄 The DAO Reentrancy Attack ($60M Drained)
* **Everyday Metaphor**: The Glitched ATM Loop.
* **Mechanism**: The vulnerable `withdraw()` function executes external call `msg.sender.call.value()` *before* decrementing `balances[msg.sender]`. The attacker's fallback function catches the ether and calls `withdraw()` recursively before storage updates.
* **Defense**: Checks-Effects-Interactions (CEI) pattern (update state *first*, transfer *second*) and OpenZeppelin `nonReentrant` mutex guards.

### 5. 🌉 Ronin Bridge Multi-Sig Compromise ($625M)
* **Everyday Metaphor**: The 9-Key Bank Vault Door.
* **Mechanism**: Axie Infinity's cross-chain bridge required 5 out of 9 validator signatures to authorize withdrawals. Lazarus Group hacked Sky Mavis's internal network to harvest 4 keys, and leveraged a lingering authorization on an Axie DAO validator to obtain the critical 5th signature.
* **Defense**: Expansion to 11-of-15 validator quorum, multi-institutional validator decentralization, and hardware timelocks.

### 6. 🐛 Smart Contract Bugs: Underflow & Access Control
* **Everyday Metaphor**: The Car Odometer Rolling Backwards & The Key Left in the Front Door.
* **Mechanism**:
  - *Integer Underflow*: In `uint8`, subtracting `0 - 1` wraps around to `255` (visualized by spinning odometer reels).
  - *Missing Access Control*: Failing to attach the `onlyOwner` modifier to administrative functions (`changeOwner()`, `emergencyWithdrawAll()`) allows any external caller to seize total ownership.
* **Defense**: Solidity 0.8+ default panic reverts on underflow/overflow, SafeMath, and OpenZeppelin `Ownable`.

---

## 🔬 Under-The-Hood Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN SECURITY INTERACTIVE LAB                    │
├──────────────────────────────────┬──────────────────────────────────────────┤
│           FRONT-END              │              LOGIC ENGINE                │
│  - Semantic HTML5 (9 Tabs)       │  - Simulation State Machines             │
│  - CSS3 Glassmorphism UI         │  - Web Audio API Sound Synthesizer       │
│  - SVG Puppet Wire Renderer      │  - Dynamic DOM Nodes & Block Visualizers │
│  - Mechanical Odometer Reels     │  - Real-time Terminal Log Formatter      │
│  - Multi-Sig Vault Door Graphic  │  - Presentation Controller (Shortcuts)   │
└──────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 🚀 Quick Start & How to Run

### Method 1: Instant Browser View (Zero Installation)
Simply double-click `index.html` on any device or computer. The simulator requires **no server, no node_modules, and no internet connection**.

### Method 2: Local HTTP Server (Optional)
If you prefer running via a local server:

```bash
# Using Python 3:
python -m http.server 8000

# Using Node.js npx:
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## ⌨️ Keyboard Shortcuts for Presenters

| Shortcut | Action | Description |
| :---: | :--- | :--- |
| <kbd>P</kbd> | **Toggle Presentation Mode** | Toggles top presentation navigation bar and slides view. |
| <kbd>S</kbd> | **Toggle Speaker Notes** | Opens slide-out presenter notes drawer with talking points. |
| <kbd>→</kbd> | **Next Tab / Attack** | Advances sequentially to the next simulation module. |
| <kbd>←</kbd> | **Previous Tab / Attack** | Returns to the previous simulation module. |

---

## 🎤 Academic Evaluation & Presentation Script

Use this script during your classroom or viva presentation:

```text
================================================================================
                    5-MINUTE VIVA PRESENTATION SCRIPT
================================================================================

1. INTRODUCTION (30s)
   "Good morning respected professors. Distributed ledgers and smart contracts
   are immutable and manage hundreds of billions of dollars. Because 'code is law',
   logic vulnerabilities cannot be patched on-the-fly once deployed. Today, I 
   present an interactive offline laboratory demonstrating 6 fundamental attacks
   and their cryptographic/architectural solutions."

2. MODULE 1: 51% CONSENSUS ATTACK (45s)
   - "Under Nakamoto Consensus, nodes follow the Longest Chain Rule.
     If an attacker acquires >50% hashrate, they can secretly outmine the honest
     network and force a chain reorganization, orphaning verified transactions."
   - Demo: Click 'Next Attack Step' ➔ Show private fork outracing honest chain ➔
     Show orphan reorg ➔ Switch to Patched (Casper FFG Checkpoints) ➔ Show reorg blocked.

3. MODULE 2: SYBIL IDENTITY FORGERY (45s)
   - "In naive peer networks, counting IP addresses allows 1 attacker to spin up
     6 virtual personas for $0 and usurp governance decisions."
   - Demo: Show SVG puppet wires connected to 1 laptop ➔ Show rigged ballot ➔
     Switch to Proof-of-Stake ➔ Show bot identities have 0 stake and 0 voting power.

4. MODULE 3: DOUBLE SPENDING (45s)
   - "When merchants accept 0-confirmation transactions, an attacker can broadcast
     a competing transaction with higher gas fees, claiming the same UTXO coin."
   - Demo: Show Bob handing laptop on 0-conf ➔ Show Tx-B mining into Block #502 ➔
     Show Bob defrauded ➔ Switch to 6-Confirmation Rule ➔ Bob detects mempool race and saves product.

5. MODULE 4: THE DAO REENTRANCY (45s)
   - "In The DAO hack, external call msg.sender.call.value() was invoked BEFORE
     updating internal balances. An attacker's fallback function re-entered withdraw()
     recursively, draining all 30 ETH."
   - Demo: Show Call Stack recursion ➔ Switch to Patched ➔ Show Checks-Effects-Interactions (CEI).

6. MODULE 5: RONIN BRIDGE 5/9 QUORUM (45s)
   - "Axie Infinity's Ronin Bridge used a 5-of-9 validator multi-sig. Lazarus Group
     compromised 4 Sky Mavis nodes and obtained a 5th signature via stale RPC permissions."
   - Demo: Compromise 5 keys ➔ Vault door unlocks ➔ Switch to Patched 11-of-15 model.

7. MODULE 6: CONTRACT BUGS - UNDERFLOW & ACCESS (45s)
   - "Pre-0.8 Solidity suffered from unsigned integer underflow (0 - 1 = 255).
     Additionally, omitting onlyOwner on admin functions allows any account to claim ownership."
   - Demo: Show spinning mechanical odometer rolling backwards ➔ Show ownership theft ➔ Show SafeMath / onlyOwner patch.

8. CONCLUSION (30s)
   - "Security in Web3 requires defense-in-depth: Checks-Effects-Interactions, 
     formal verification, multi-institutional staking, and strict confirmation depth.
     Thank you! I welcome any questions."
================================================================================
```

---

## ❓ Frequently Asked Viva Questions

<details>
<summary><strong>Q1: Why doesn't a 51% attack break private key cryptography?</strong></summary>

> **Answer:** A 51% attack targets the *consensus ordering* layer, NOT the *cryptographic signature* layer. An attacker cannot forge ECDSA digital signatures or steal arbitrary private keys. What they can do is outpace the honest network to reverse their *own* previous spendings (double spending) or censor other people's transactions from entering blocks.
</details>

<details>
<summary><strong>Q2: How does Proof-of-Stake prevent Sybil attacks?</strong></summary>

> **Answer:** In Proof-of-Stake, consensus voting weight is directly proportional to scarce financial capital locked as collateral (e.g., 32 ETH per validator), NOT the number of virtual socket connections or IP addresses. Spinning up 1,000 fake IP addresses with 0 ETH gives an attacker exactly 0% voting influence.
</details>

<details>
<summary><strong>Q3: What is the Checks-Effects-Interactions (CEI) pattern in Solidity?</strong></summary>

> **Answer:** CEI is a defensive programming pattern designed to neutralize reentrancy vulnerabilities:
> 1. **Checks:** Validate preconditions (e.g. `require(balances[msg.sender] >= amount)`).
> 2. **Effects:** Update contract internal state/balances *first* (e.g. `balances[msg.sender] -= amount`).
> 3. **Interactions:** Perform external calls and transfer Ether *last* (e.g. `(bool success, ) = msg.sender.call{value: amount}("")`).
</details>

<details>
<summary><strong>Q4: Why did Axie Infinity's Ronin Bridge compromise succeed despite using multi-sig?</strong></summary>

> **Answer:** The bridge used a 5-out-of-9 threshold. However, 4 validator keys were held by a single entity (Sky Mavis), and the 5th was an Axie DAO validator that had previously granted temporary signature authority to Sky Mavis that was never revoked. When Sky Mavis's internal network was breached via social engineering, the attacker gained control of all 5 keys simultaneously, defeating the purpose of decentralization.
</details>

<details>
<summary><strong>Q5: How does Solidity 0.8+ prevent integer underflow and overflow?</strong></summary>

> **Answer:** Prior to Solidity 0.8, arithmetic operations in the EVM wrapped around automatically upon reaching numeric limits (`0 - 1 = 255` in `uint8`), requiring the `SafeMath` library. Starting with Solidity 0.8.0, the compiler injects opcode-level overflow and underflow checks by default that automatically revert the transaction with Panic code `0x11` whenever arithmetic boundaries are breached.
</details>

---

## 📁 Repository Structure

```text
Blockchain-Attacks/
├── index.html                   # Master interactive simulation dashboard (9 tabs)
├── style.css                    # Professional cybersecurity dark theme & animations
├── script.js                    # State machines, Web Audio synthesizer, & presenter controls
├── LICENSE                      # MIT Open Source License
├── README.md                    # Comprehensive documentation, viva script, & architecture
└── Blockchain-Security-Demo/    # Standalone mirror package for offline portability
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Built exclusively for academic, research, and classroom educational demonstrations.
