/* =========================================================
   BLOCKCHAIN SECURITY LAB - SIMULATION ENGINE
   Interactive Visual Demos: DAO Reentrancy, Ronin Bridge, Smart Contract Bugs
   ========================================================= */

// Audio Synthesizer (Web Audio API)
let audioCtx = null;
let soundEnabled = true;

function playSound(type) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'coin') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'warning') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.setValueAtTime(260, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'alarm') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(850, now);
            osc.frequency.setValueAtTime(450, now + 0.15);
            osc.frequency.setValueAtTime(850, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(660, now + 0.1);
            osc.frequency.setValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        }
    } catch (e) {
        console.warn("Audio Context error:", e);
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const txt = document.getElementById("soundStatusText");
    const btn = document.getElementById("soundToggleBtn");
    if (soundEnabled) {
        txt.innerText = "ON";
        btn.classList.remove("muted");
        playSound('click');
    } else {
        txt.innerText = "OFF";
        btn.classList.add("muted");
    }
}

// Visual Floating Token Particles
function spawnCoinParticle(sourceId, targetId, text = "🪙 +10 ETH", type = "gold") {
    const src = document.getElementById(sourceId);
    const tgt = document.getElementById(targetId);
    const container = document.getElementById("coinParticleContainer");
    if (!src || !tgt || !container) return;

    const sRect = src.getBoundingClientRect();
    const tRect = tgt.getBoundingClientRect();

    const startX = sRect.left + sRect.width / 2;
    const startY = sRect.top + sRect.height / 2;
    const endX = tRect.left + tRect.width / 2;
    const endY = tRect.top + tRect.height / 2;

    const particle = document.createElement("div");
    particle.className = `flying-token ${type}`;
    particle.innerText = text;
    particle.style.setProperty("--startX", `${startX}px`);
    particle.style.setProperty("--startY", `${startY}px`);
    particle.style.setProperty("--endX", `${endX}px`);
    particle.style.setProperty("--endY", `${endY}px`);

    container.appendChild(particle);
    playSound('coin');

    setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
    }, 1300);
}

// Presenter Notes Toggle
function toggleSpeakerNotes() {
    playSound('click');
    const drawer = document.getElementById("speakerNotesDrawer");
    drawer.classList.toggle("hidden");
}

function updateSpeakerNotesTab(activeTab) {
    const tabs = {
        'dao': 'speakerNoteDAO',
        'ronin': 'speakerNoteRonin',
        'bugs': 'speakerNoteBugs',
        'quiz': null
    };
    ['speakerNoteDAO', 'speakerNoteRonin', 'speakerNoteBugs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
    if (tabs[activeTab]) {
        const activeNote = document.getElementById(tabs[activeTab]);
        if (activeNote) activeNote.classList.remove("hidden");
    }
}

// Navigation Tab Switcher
function switchLabTab(tabId) {
    playSound('click');
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("hidden", panel.id !== `tab-${tabId}`);
        panel.classList.toggle("active", panel.id === `tab-${tabId}`);
    });
    updateSpeakerNotesTab(tabId);
}


/* =========================================================
   SIMULATION 1: THE DAO REENTRANCY ATTACK
   ========================================================= */

let contractFunds = 30;
let attackerBalance = 10;
let attackerReceived = 0;
let attackCount = 0;

let daoMode = 'vulnerable'; // 'vulnerable' or 'patched'
let autoDaoInterval = null;
let daoCallStack = [];

function setDaoMode(mode) {
    playSound('click');
    daoMode = mode;
    document.getElementById("daoModeVuln").classList.toggle("active", mode === 'vulnerable');
    document.getElementById("daoModePatched").classList.toggle("active", mode === 'patched');

    const flowBadge = document.getElementById("flowModeBadge");
    const codeBox = document.getElementById("daoSolidityCode");
    const codeLabel = document.getElementById("codeModeLabel");

    const a1Icon = document.getElementById("action1Icon");
    const a1Title = document.getElementById("action1Title");
    const a1Sub = document.getElementById("action1Sub");
    const a2Icon = document.getElementById("action2Icon");
    const a2Title = document.getElementById("action2Title");
    const a2Sub = document.getElementById("action2Sub");

    if (mode === 'vulnerable') {
        flowBadge.className = "flow-badge vuln";
        flowBadge.innerText = "Mode: Vulnerable (Send before State Update)";

        a1Icon.innerText = "💰";
        a1Title.innerText = "2. Send ETH";
        a1Sub.innerText = "msg.sender.call{value}";

        a2Icon.innerText = "📝";
        a2Title.innerText = "3. Update Balance";
        a2Sub.innerText = "balances[sender] = 0";

        codeLabel.className = "code-badge danger";
        codeLabel.innerText = "VULNERABLE PATTERN";
        codeBox.innerHTML = `<code>// ❌ VULNERABLE: Send ETH before balance update!
function withdraw() public {
    uint256 bal = balances[msg.sender];
    require(bal > 0);
    
    // BUG HERE: External call hands control to attacker
    (bool sent, ) = msg.sender.call{value: bal}(""); 
    require(sent, "Failed to send ETH");
    
    // Too late! This line is never reached before reentrancy!
    balances[msg.sender] = 0;
}</code>`;

        document.getElementById("explanationText").innerText =
            "The vulnerable contract sends ETH to the caller BEFORE updating their recorded balance. When the attacker's fallback function receives ETH, it calls withdraw() recursively before line 2 runs!";
    } else {
        flowBadge.className = "flow-badge safe";
        flowBadge.innerText = "Mode: Patched (Checks-Effects-Interactions Pattern)";

        a1Icon.innerText = "📝";
        a1Title.innerText = "2. Update Balance (0)";
        a1Sub.innerText = "balances[sender] = 0";

        a2Icon.innerText = "💰";
        a2Title.innerText = "3. Send ETH";
        a2Sub.innerText = "msg.sender.call{value}";

        codeLabel.className = "code-badge safe";
        codeLabel.innerText = "SECURE CEI PATTERN";
        codeBox.innerHTML = `<code>// 🛡️ SECURE: Checks-Effects-Interactions Pattern!
function withdraw() public nonReentrant {
    uint256 bal = balances[msg.sender];
    require(bal > 0, "Zero balance");
    
    // 1. EFFECT: Update internal state FIRST!
    balances[msg.sender] = 0;
    
    // 2. INTERACTION: External transfer AFTER state change!
    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Transfer failed");
}</code>`;

        document.getElementById("explanationText").innerText =
            "In the Patched contract, the user's recorded balance is zeroed out BEFORE sending any ETH. When the attacker re-enters, require(balances[msg.sender] > 0) fails and reverts the exploit!";
    }

    resetDemo();
}

function updateScreen() {
    document.getElementById("contractFunds").innerText = contractFunds + " ETH";
    document.getElementById("attackerBalance").innerText = attackerBalance + " ETH";
    document.getElementById("attackerReceived").innerText = attackerReceived + " ETH";

    // Vault Progress bar
    const pct = Math.max(0, Math.min(100, (contractFunds / 30) * 100));
    const vaultBar = document.getElementById("daoVaultBar");
    vaultBar.style.width = pct + "%";
    vaultBar.classList.toggle("danger", contractFunds <= 10);

    const vaultStatus = document.getElementById("daoVaultStatus");
    if (contractFunds === 30) {
        vaultStatus.innerText = "Status: Healthy Liquidity";
        vaultStatus.style.color = "var(--text-muted)";
    } else if (contractFunds > 0) {
        vaultStatus.innerText = `Status: Reserves Draining (${contractFunds} ETH remaining)`;
        vaultStatus.style.color = "var(--accent-orange)";
    } else {
        vaultStatus.innerText = "Status: 💀 VAULT FULLY DRAINED!";
        vaultStatus.style.color = "var(--accent-red)";
    }

    renderCallStack();
}

function renderCallStack() {
    const list = document.getElementById("callStackList");
    const depthBadge = document.getElementById("reentrancyDepthBadge");

    if (daoCallStack.length === 0) {
        list.innerHTML = `<div class="stack-frame empty-frame">Stack is idle. Click a button to begin execution.</div>`;
        depthBadge.innerText = "Depth: 0 (Idle)";
        depthBadge.style.color = "#38bdf8";
        return;
    }

    depthBadge.innerText = `Depth: ${daoCallStack.length} (${daoCallStack.length > 1 ? 'REENTRANT' : 'Active'})`;
    depthBadge.style.color = daoCallStack.length > 1 ? "var(--accent-red)" : "var(--accent-green)";

    list.innerHTML = daoCallStack.map((frame, idx) => {
        const isReentrant = idx > 0;
        return `<div class="stack-frame ${isReentrant ? 'reentrant' : ''}">
            <span>[#${idx + 1}] ${frame.call}</span>
            <span>${frame.caller} ➔ ${frame.target}</span>
        </div>`;
    }).join("");
}

function highlightDaoNodes(activeNodeIds, reenterActive = false) {
    ['nodeAttacker', 'nodeCheck', 'nodeAction1', 'nodeAction2'].forEach(id => {
        const el = document.getElementById(id);
        el.className = "node";
    });

    activeNodeIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add(daoMode === 'vulnerable' && reenterActive ? "danger-active" : "active");
    });

    const reenterEl = document.querySelector(".reenter-loop");
    if (reenterEl) {
        reenterEl.classList.toggle("active", reenterActive);
    }
}

function normalWithdrawal() {
    playSound('click');
    stopAutoDao();

    if (attackerBalance <= 0) {
        document.getElementById("message").innerHTML = "❌ <strong>Withdrawal rejected.</strong> Attacker recorded balance is already 0 ETH.";
        playSound('warning');
        return;
    }

    daoCallStack = [
        { call: "withdraw()", caller: "Attacker", target: "DAO" }
    ];

    highlightDaoNodes(['nodeAttacker', 'nodeCheck', 'nodeAction1', 'nodeAction2'], false);

    contractFunds -= attackerBalance;
    attackerReceived += attackerBalance;
    attackerBalance = 0;

    spawnCoinParticle("daoVaultCard", "daoAttackerCard", "🪙 +10 ETH", "gold");
    updateScreen();
    playSound('success');

    document.getElementById("message").innerHTML =
        "✅ <strong>Normal Withdrawal Succeeded:</strong> Attacker withdrew their legitimate 10 ETH. Recorded balance is now 0 ETH. Contract still has 20 ETH intact.";

    setTimeout(() => {
        daoCallStack = [];
        renderCallStack();
    }, 1500);
}

function attackStep() {
    if (autoDaoInterval) stopAutoDao();
    executeDaoAttackStep();
}

function executeDaoAttackStep() {
    if (daoMode === 'vulnerable') {
        attackStepVulnerable();
    } else {
        attackStepPatched();
    }
}

function attackStepVulnerable() {
    if (contractFunds <= 0) {
        stopAutoDao();
        document.getElementById("message").innerHTML =
            "💀 <strong>EXPLOIT FINISHED:</strong> DAO Contract is completely drained (0 ETH)! Attacker stole 30 ETH.";
        playSound('alarm');
        return;
    }

    attackCount++;
    const stolen = 10;
    contractFunds -= stolen;
    attackerReceived += stolen;

    spawnCoinParticle("daoVaultCard", "daoAttackerCard", "🪙 +10 ETH STOLEN", "red");

    // Push frame to call stack
    daoCallStack.push({
        call: `withdraw() [Frame ${attackCount}]`,
        caller: attackCount === 1 ? "Attacker" : "fallback()",
        target: "DAO Vault"
    });

    highlightDaoNodes(['nodeAttacker', 'nodeAction1'], true);
    updateScreen();

    if (attackCount === 1) {
        playSound('warning');
        document.getElementById("message").innerHTML =
            "⚠️ <strong>Step 1:</strong> DAO verifies 10 ETH balance & sends 10 ETH to Attacker. <em>CRUCIAL BUG:</em> Recorded balance has NOT been set to 0 yet!";
        document.getElementById("explanationText").innerText =
            "The contract transferred the ETH before updating state. Control flow now transfers to the attacker's contract fallback/receive function.";
    } else if (attackCount === 2) {
        playSound('alarm');
        document.getElementById("message").innerHTML =
            "🔁 <strong>Step 2 — REENTRANCY TRIGGERED:</strong> Attacker's <code>fallback()</code> catches the 10 ETH and immediately re-enters <code>withdraw()</code>! The balance still shows 10 ETH!";
        document.getElementById("explanationText").innerText =
            "Because the balance was never zeroed out, the contract's require(balances[msg.sender] > 0) passes again! Another 10 ETH is sent!";
    } else if (attackCount === 3) {
        playSound('alarm');
        document.getElementById("message").innerHTML =
            "💀 <strong>Step 3:</strong> Final re-entrant call empties the last 10 ETH from the vault. Total stolen: 30 ETH (10 own + 20 stolen).";
        document.getElementById("explanationText").innerText =
            "The call stack now unwinds, but it's too late: all 30 ETH are in the attacker's wallet. The DAO is bankrupt.";
    }
}

function attackStepPatched() {
    stopAutoDao();
    attackCount++;

    if (attackCount === 1) {
        playSound('warning');
        highlightDaoNodes(['nodeAttacker', 'nodeCheck', 'nodeAction1'], false);

        attackerBalance = 0; // EFFECT happens first!
        contractFunds -= 10;
        attackerReceived += 10;

        spawnCoinParticle("daoVaultCard", "daoAttackerCard", "🪙 +10 ETH (Legit)", "gold");

        daoCallStack = [
            { call: "withdraw()", caller: "Attacker", target: "DAO" }
        ];

        updateScreen();

        document.getElementById("message").innerHTML =
            "🛡️ <strong>Step 1 (Patched):</strong> DAO checks balance (10 ETH) and immediately sets <code>balances[msg.sender] = 0</code> <em>BEFORE</em> sending the 10 ETH.";
        document.getElementById("explanationText").innerText =
            "Notice the recorded balance is already 0 ETH! Now the contract transfers 10 ETH to the attacker.";
    } else {
        playSound('alarm');
        highlightDaoNodes(['nodeAttacker', 'nodeCheck'], true);

        document.getElementById("message").innerHTML =
            "🛑 <strong>Step 2 — REENTRANCY DEFENSE ACTIVATED:</strong> Attacker's fallback tries to re-enter <code>withdraw()</code>, but <code>balances[msg.sender] == 0</code>! <br><span style='color:#34d399'>❌ REVERT: Execution Reverted (Zero Balance)</span>. Exploit thwarted!";
        
        document.getElementById("explanationText").innerText =
            "Because of the Checks-Effects-Interactions pattern (or OpenZeppelin ReentrancyGuard), the attacker's recursive call fails immediately. The remaining 20 ETH in the vault is 100% safe!";

        setTimeout(() => {
            daoCallStack = [];
            renderCallStack();
            highlightDaoNodes([], false);
        }, 2000);
    }
}

function toggleAutoDaoAttack() {
    if (autoDaoInterval) {
        stopAutoDao();
    } else {
        playSound('click');
        document.getElementById("autoDaoIcon").innerText = "⏸️";
        document.getElementById("autoDaoText").innerText = "Pause Attack";
        autoDaoInterval = setInterval(() => {
            if (contractFunds <= 0 || (daoMode === 'patched' && attackCount >= 2)) {
                stopAutoDao();
            } else {
                executeDaoAttackStep();
            }
        }, 1400);
    }
}

function stopAutoDao() {
    if (autoDaoInterval) {
        clearInterval(autoDaoInterval);
        autoDaoInterval = null;
        document.getElementById("autoDaoIcon").innerText = "▶️";
        document.getElementById("autoDaoText").innerText = "Auto-Play Attack";
    }
}

function resetDemo() {
    playSound('click');
    stopAutoDao();

    contractFunds = 30;
    attackerBalance = 10;
    attackerReceived = 0;
    attackCount = 0;
    daoCallStack = [];

    highlightDaoNodes([], false);
    updateScreen();

    document.getElementById("message").innerText =
        "Demo reset. Ready to start demonstration.";

    if (daoMode === 'vulnerable') {
        document.getElementById("explanationText").innerText =
            "The vulnerable contract sends ETH before updating the attacker's recorded balance.";
    } else {
        document.getElementById("explanationText").innerText =
            "The secure contract updates recorded balance to 0 before sending ETH, blocking recursive exploits.";
    }
}


/* =========================================================
   SIMULATION 2: RONIN BRIDGE VALIDATOR MULTI-SIG HACK
   ========================================================= */

let roninStep = 0;
let roninMode = 'vulnerable'; // 'vulnerable' or 'patched'
let autoRoninInterval = null;

const VULN_VALIDATORS = [
    { id: 1, name: "Sky Mavis Key 1", entity: "Sky Mavis Workstation", compromised: false },
    { id: 2, name: "Sky Mavis Key 2", entity: "Sky Mavis Workstation", compromised: false },
    { id: 3, name: "Sky Mavis Key 3", entity: "Sky Mavis Workstation", compromised: false },
    { id: 4, name: "Sky Mavis Key 4", entity: "Sky Mavis Workstation", compromised: false },
    { id: 5, name: "Axie DAO Key", entity: "Axie DAO (Gasless RPC)", compromised: false },
    { id: 6, name: "Animoca Key", entity: "Independent External", compromised: false },
    { id: 7, name: "Binance Key", entity: "Independent External", compromised: false },
    { id: 8, name: "Nonfungible Key", entity: "Independent External", compromised: false },
    { id: 9, name: "DappRadar Key", entity: "Independent External", compromised: false }
];

const PATCHED_VALIDATORS = [
    { id: 1, name: "Sky Mavis Key", entity: "Sky Mavis (HSM Hardware)", compromised: false },
    { id: 2, name: "Google Cloud", entity: "External Independent", compromised: false },
    { id: 3, name: "Animoca Brands", entity: "External Independent", compromised: false },
    { id: 4, name: "Nansen Analytics", entity: "External Independent", compromised: false },
    { id: 5, name: "DappRadar Node", entity: "External Independent", compromised: false },
    { id: 6, name: "Bitfrost Node", entity: "External Independent", compromised: false },
    { id: 7, name: "Delphi Digital", entity: "External Independent", compromised: false },
    { id: 8, name: "ConsenSys Val", entity: "External Independent", compromised: false },
    { id: 9, name: "Chainlink Lab", entity: "External Independent", compromised: false },
    { id: 10, name: "Coinbase Cloud", entity: "External Independent", compromised: false },
    { id: 11, name: "Jump Crypto", entity: "External Independent", compromised: false }
];

let activeValidators = JSON.parse(JSON.stringify(VULN_VALIDATORS));

function renderValidators() {
    const grid = document.getElementById("validatorsGrid");
    grid.innerHTML = activeValidators.map(val => {
        return `<div class="validator-node ${val.compromised ? 'compromised' : 'secure'}">
            <span class="val-icon">${val.compromised ? '🗝️❌' : '🗝️'}</span>
            <span class="val-name">${val.name}</span>
            <span class="val-entity">${val.entity}</span>
            <span class="val-status">${val.compromised ? 'KEY COMPROMISED' : 'KEY SECURE'}</span>
        </div>`;
    }).join("");
}

function setRoninMode(mode) {
    playSound('click');
    roninMode = mode;
    document.getElementById("roninModeVuln").classList.toggle("active", mode === 'vulnerable');
    document.getElementById("roninModePatched").classList.toggle("active", mode === 'patched');

    const summaryBadge = document.getElementById("validatorSummaryBadge");
    const thresholdLabel = document.getElementById("roninThresholdLabel");

    if (mode === 'vulnerable') {
        activeValidators = JSON.parse(JSON.stringify(VULN_VALIDATORS));
        summaryBadge.innerText = "9 Total Keys (4 Sky Mavis, 1 Axie DAO, 4 External)";
        thresholdLabel.innerText = "Keys Turned to Open Vault (Need 5)";
    } else {
        activeValidators = JSON.parse(JSON.stringify(PATCHED_VALIDATORS));
        summaryBadge.innerText = "11 Independent Keys + 48h Timelock + On-Chain Circuit Breaker";
        thresholdLabel.innerText = "Keys Turned to Open Vault (Need 9 of 11)";
    }

    resetRoninDemo();
}

function nextRoninStep() {
    if (autoRoninInterval) stopAutoRonin();
    executeRoninStep();
}

function executeRoninStep() {
    if (roninMode === 'vulnerable') {
        executeRoninStepVuln();
    } else {
        executeRoninStepPatched();
    }
}

function executeRoninStepVuln() {
    roninStep++;
    const consoleEl = document.getElementById("roninConsole");
    const sigCount = document.getElementById("roninSignatureCount");
    const sigBar = document.getElementById("roninSigBar");
    const stepInd = document.getElementById("roninStepIndicator");
    const door = document.getElementById("roninVaultDoor");
    const doorIcon = document.getElementById("roninDoorIcon");
    const doorText = document.getElementById("roninDoorStatusText");

    if (roninStep === 1) {
        playSound('warning');
        stepInd.innerText = "Step 2 of 5";
        document.getElementById("roninHackerState").className = "status-pill danger";
        document.getElementById("roninHackerState").innerText = "🎣 Phishing Campaign Active";
        consoleEl.innerHTML = "🎣 <strong>Step 1: Spear Phishing PDF:</strong> Lazarus Group hackers pose as a recruiter on LinkedIn and send a malicious PDF fake job offer to a senior Sky Mavis engineer. The engineer's computer is compromised via spyware.";
    } else if (roninStep === 2) {
        playSound('alarm');
        stepInd.innerText = "Step 3 of 5";
        // Compromise 4 Sky Mavis keys
        activeValidators[0].compromised = true;
        activeValidators[1].compromised = true;
        activeValidators[2].compromised = true;
        activeValidators[3].compromised = true;
        renderValidators();

        sigCount.innerText = "4 / 5";
        sigBar.style.width = "80%";
        doorText.innerText = "⚠️ 4 OF 5 KEYS TURNED! ALMOST OPEN!";
        doorText.style.color = "var(--accent-orange)";

        consoleEl.innerHTML = "🚨 <strong>Step 2: 4 Keys Extracted:</strong> The spyware steals private keys for Sky Mavis Validator Nodes 1, 2, 3, and 4! Attacker now holds 4 valid cryptographic keys.";
    } else if (roninStep === 3) {
        playSound('alarm');
        stepInd.innerText = "Step 4 of 5";
        // Compromise 5th node: Axie DAO
        activeValidators[4].compromised = true;
        renderValidators();

        sigCount.innerText = "5 / 5";
        sigBar.style.width = "100%";

        door.classList.add("unlocked");
        doorIcon.innerText = "🔓";
        doorIcon.classList.add("open");
        doorText.innerText = "🚨 VAULT UNLOCKED & COMPROMISED!";
        doorText.style.color = "var(--accent-red)";

        consoleEl.innerHTML = "⚡ <strong>Step 3: 5th Key via Forgotten Whitelist:</strong> Axie DAO had previously whitelisted Sky Mavis RPC to sign transactions gas-free and never revoked it. Attacker uses this to turn the 5th key! 5/5 keys turned—the vault door swings open!";
    } else if (roninStep === 4) {
        playSound('warning');
        stepInd.innerText = "Step 5 of 5";
        consoleEl.innerHTML = "📝 <strong>Step 4: Forging Malicious Withdrawal:</strong> The attacker crafts a withdrawal transaction for 173,600 ETH and 25.5M USDC, signed with all 5 stolen keys, and broadcasts it to Ethereum Ronin Bridge Contract.";
    } else if (roninStep === 5) {
        playSound('alarm');
        stepInd.innerText = "Completed";

        spawnCoinParticle("roninVaultCard", "roninAttackerCard", "💵 $625,000,000 DRAINED", "red");

        document.getElementById("roninVaultBalance").innerText = "$0 USD";
        document.getElementById("roninVaultBar").style.width = "0%";
        document.getElementById("roninVaultBar").classList.add("danger");
        document.getElementById("roninVaultStatus").innerText = "💀 CRITICAL: $625M STOLEN FROM BRIDGE!";
        document.getElementById("roninVaultStatus").style.color = "var(--accent-red)";

        document.getElementById("roninAttackerLoot").innerText = "$625,000,000";
        document.getElementById("roninAttackerSub").innerText = "173,600 ETH + 25.5M USDC";
        document.getElementById("roninHackerState").innerText = "💀 Bridge Drained ($625M)";

        consoleEl.innerHTML = "💀 <strong>Step 5 — $625M HEIST COMPLETE:</strong> The Ethereum smart contract verified 5 valid keys were present and released 173,600 ETH + 25.5M USDC to the hacker! The largest crypto hack in history was complete.";
        stopAutoRonin();
    }
}

function executeRoninStepPatched() {
    roninStep++;
    const consoleEl = document.getElementById("roninConsole");
    const sigCount = document.getElementById("roninSignatureCount");
    const sigBar = document.getElementById("roninSigBar");
    const stepInd = document.getElementById("roninStepIndicator");

    if (roninStep === 1) {
        playSound('warning');
        stepInd.innerText = "Step 2 of 3";
        consoleEl.innerHTML = "🎣 <strong>Step 1: Phishing Attempt Launched:</strong> Hacker targets engineer, but validator keys are locked inside Hardware Security Modules (HSMs) and Multi-Party Computation (MPC). Only 1 key could ever be stolen.";
    } else if (roninStep === 2) {
        playSound('warning');
        stepInd.innerText = "Step 3 of 3";
        activeValidators[0].compromised = true;
        renderValidators();

        sigCount.innerText = "1 / 9";
        sigBar.style.width = "11%";
        consoleEl.innerHTML = "🛑 <strong>Step 2: Quorum Failed:</strong> The bridge now requires 9 of 11 independent organizations (Google Cloud, Nansen, Animoca, etc.). Compromising one internal workstation leaves the hacker 8 keys short!";
    } else if (roninStep === 3) {
        playSound('success');
        stepInd.innerText = "Completed";
        consoleEl.innerHTML = "🛡️ <strong>Step 3 — 48h Timelock & Circuit Breaker Triggered:</strong> Even if a threshold were reached, any withdrawal over $100k triggers a 48-hour timelock and on-chain anomaly alert, allowing operators to freeze the bridge before a single dollar is lost!";
        stopAutoRonin();
    }
}

function toggleAutoRonin() {
    if (autoRoninInterval) {
        stopAutoRonin();
    } else {
        playSound('click');
        document.getElementById("autoRoninIcon").innerText = "⏸️";
        document.getElementById("autoRoninText").innerText = "Pause Attack";
        autoRoninInterval = setInterval(() => {
            const maxStep = roninMode === 'vulnerable' ? 5 : 3;
            if (roninStep >= maxStep) {
                stopAutoRonin();
            } else {
                executeRoninStep();
            }
        }, 1600);
    }
}

function stopAutoRonin() {
    if (autoRoninInterval) {
        clearInterval(autoRoninInterval);
        autoRoninInterval = null;
        document.getElementById("autoRoninIcon").innerText = "▶️";
        document.getElementById("autoRoninText").innerText = "Auto-Play Attack";
    }
}

function resetRoninDemo() {
    playSound('click');
    stopAutoRonin();
    roninStep = 0;

    activeValidators.forEach(v => v.compromised = false);
    renderValidators();

    const door = document.getElementById("roninVaultDoor");
    const doorIcon = document.getElementById("roninDoorIcon");
    const doorText = document.getElementById("roninDoorStatusText");
    door.classList.remove("unlocked");
    doorIcon.innerText = "🔒";
    doorIcon.classList.remove("open");
    doorText.innerText = "LOCKED & SECURED";
    doorText.style.color = "#38bdf8";

    document.getElementById("roninVaultBalance").innerText = "$625,000,000";
    document.getElementById("roninVaultBar").style.width = "100%";
    document.getElementById("roninVaultBar").classList.remove("danger");
    document.getElementById("roninVaultStatus").innerText = "Status: All Bridge Reserves Intact";
    document.getElementById("roninVaultStatus").style.color = "var(--text-muted)";

    document.getElementById("roninSignatureCount").innerText = roninMode === 'vulnerable' ? "0 / 5" : "0 / 9";
    document.getElementById("roninSigBar").style.width = "0%";

    document.getElementById("roninAttackerLoot").innerText = "$0 USD";
    document.getElementById("roninAttackerSub").innerText = "0 ETH / 0 USDC";
    document.getElementById("roninHackerState").className = "status-pill safe";
    document.getElementById("roninHackerState").innerText = "Idle / Scouting";

    document.getElementById("roninStepIndicator").innerText = "Step 1 of " + (roninMode === 'vulnerable' ? "5" : "3");
    document.getElementById("roninConsole").innerText = "Bridge is operating normally. Ready to simulate the validator compromise attack.";
}


/* =========================================================
   SIMULATION 3: SMART CONTRACT BUGS (UNDERFLOW & ACCESS CONTROL)
   ========================================================= */

let currentSubBug = 'underflow'; // 'underflow' or 'access'
let bugMode = 'vulnerable'; // 'vulnerable' or 'patched'

function switchSubBug(subBug) {
    playSound('click');
    currentSubBug = subBug;
    document.getElementById("btnSubBugUnderflow").classList.toggle("active", subBug === 'underflow');
    document.getElementById("btnSubBugAccess").classList.toggle("active", subBug === 'access');

    document.getElementById("subBugUnderflowView").classList.toggle("hidden", subBug !== 'underflow');
    document.getElementById("subBugAccessView").classList.toggle("hidden", subBug !== 'access');

    updateBugExplanations();
}

function setBugMode(mode) {
    playSound('click');
    bugMode = mode;
    document.getElementById("bugModeVuln").classList.toggle("active", mode === 'vulnerable');
    document.getElementById("bugModePatched").classList.toggle("active", mode === 'patched');

    updateBugExplanations();
    if (currentSubBug === 'underflow') {
        resetUnderflowDemo();
    } else {
        resetAccessDemo();
    }
}

function updateBugExplanations() {
    const title = document.getElementById("bugExplainTitle");
    const text = document.getElementById("bugExplainText");
    const codeBadge = document.getElementById("bugCodeBadge");
    const codeBox = document.getElementById("bugSolidityCode");

    if (currentSubBug === 'underflow') {
        if (bugMode === 'vulnerable') {
            title.innerText = "💡 Why Does the Underflow Bug Happen?";
            text.innerHTML = "In programming, an unsigned 256-bit integer (<code>uint256</code>) cannot represent negative numbers. It can only store values between <code>0</code> and $2^{256}-1$. When you subtract <code>1</code> from <code>0</code> without safety checks, the computer wraps backward to the maximum possible number—giving the attacker an astronomical fortune!";
            codeBadge.className = "code-badge danger";
            codeBadge.innerText = "VULNERABLE (UNCHECKED ARITHMETIC)";
            codeBox.innerHTML = `<code>// ❌ VULNERABLE: Pre-Solidity 0.8 unchecked subtraction!
function transfer(address to, uint256 amount) public {
    // BUG: If balances[msg.sender] is 0, (0 - 1) wraps to 2^256 - 1!
    balances[msg.sender] -= amount; 
    balances[to] += amount;
}</code>`;
        } else {
            title.innerText = "🛡️ How Solidity 0.8+ & SafeMath Prevent Underflow";
            text.innerHTML = "Starting with Solidity 0.8.0, arithmetic operations include built-in overflow and underflow checks. If a calculation results in an underflow (like <code>0 - 1</code>), the EVM throws a <code>Panic(0x11)</code> and immediately rolls back the transaction!";
            codeBadge.className = "code-badge safe";
            codeBadge.innerText = "SECURE (SOLIDITY 0.8+ BUILT-IN CHECK)";
            codeBox.innerHTML = `<code>// 🛡️ SECURE: Solidity 0.8+ automatic checked arithmetic!
function transfer(address to, uint256 amount) public {
    // Automatically reverts with Panic(0x11) if amount > balances[msg.sender]!
    balances[msg.sender] -= amount; 
    balances[to] += amount;
}</code>`;
        }
    } else {
        // Access Control
        if (bugMode === 'vulnerable') {
            title.innerText = "💡 Why Does Missing Access Control Happen?";
            text.innerHTML = "In smart contracts, all public functions can be called by ANY account on the blockchain unless explicitly restricted. When a developer writes a sensitive admin function like <code>changeOwner()</code> and forgets the <code>onlyOwner</code> modifier, anyone can take over the entire contract!";
            codeBadge.className = "code-badge danger";
            codeBadge.innerText = "VULNERABLE (MISSING ONLYOWNER)";
            codeBox.innerHTML = `<code>// ❌ VULNERABLE: Missing onlyOwner modifier!
function changeOwner(address _newOwner) public {
    // BUG: Anyone on the blockchain can call this and become owner!
    owner = _newOwner; 
}

function emergencyWithdrawAll() public {
    require(msg.sender == owner, "Not owner");
    payable(msg.sender).transfer(address(this).balance);
}</code>`;
        } else {
            title.innerText = "🛡️ How OpenZeppelin Ownable Enforces Access Control";
            text.innerHTML = "By inheriting OpenZeppelin's <code>Ownable</code> pattern and applying the <code>onlyOwner</code> modifier, the contract verifies <code>require(msg.sender == owner)</code> before executing sensitive code. If an unauthorized caller tries to invoke it, the call reverts!";
            codeBadge.className = "code-badge safe";
            codeBadge.innerText = "SECURE (PROTECTED BY ONLYOWNER)";
            codeBox.innerHTML = `<code>// 🛡️ SECURE: Protected by OpenZeppelin Ownable!
function changeOwner(address _newOwner) public onlyOwner {
    // Only the current owner can pass this modifier!
    owner = _newOwner; 
}</code>`;
        }
    }
}

// Sub-Bug 1: Underflow Exploit
function triggerUnderflowExploit() {
    const consoleEl = document.getElementById("bugConsole");
    const r1 = document.getElementById("reel1");
    const r2 = document.getElementById("reel2");
    const r3 = document.getElementById("reel3");
    const rEnd = document.getElementById("reelEnd");
    const fullText = document.getElementById("odometerFullText");
    const statusPill = document.getElementById("odometerStatus");
    const mathResult = document.getElementById("mathResultText");

    if (bugMode === 'vulnerable') {
        playSound('alarm');
        // Visual reel animation
        [r1, r2, r3, rEnd].forEach(r => r.classList.add("spinning"));
        consoleEl.innerHTML = "🧮 <strong>Underflow Triggered:</strong> Calculating <code>0 - 1</code> in uint256 without SafeMath...";

        setTimeout(() => {
            [r1, r2, r3, rEnd].forEach(r => r.classList.remove("spinning"));
            r1.innerText = "1";
            r2.innerText = "1";
            r3.innerText = "5";
            rEnd.innerText = "5";

            const maxUint = "115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,935";
            fullText.innerText = maxUint + " Tokens (2^256 - 1)";
            fullText.style.color = "#f87171";

            mathResult.innerText = "1.1579 × 10^77 (Max uint256)";
            mathResult.style.color = "#f87171";

            statusPill.className = "status-pill danger";
            statusPill.innerText = "💀 CRITICAL UNDERFLOW: $2^{256}-1$ TOKENS CREATED!";

            spawnCoinParticle("odometerCard", "odometerCard", "🔢 1.15 × 10^77 FREE TOKENS", "gold");

            consoleEl.innerHTML = `💀 <strong>ODOMETER WRAPPED AROUND:</strong> Because unsigned integers cannot store negative values, subtracting 1 from 0 wrapped all the way to $2^{256}-1$. The attacker now has <strong>115 quadrillion vigintillion tokens</strong> created from thin air!`;
        }, 600);

    } else {
        playSound('warning');
        mathResult.innerText = "🛑 REVERT: Panic(0x11)";
        mathResult.style.color = "#34d399";

        statusPill.className = "status-pill safe";
        statusPill.innerText = "🛡️ DEFENDED: Underflow Blocked (Reverted)";

        consoleEl.innerHTML = `🛡️ <strong>TRANSACTION REVERTED:</strong> Solidity 0.8+ checked arithmetic detected that subtracting 1 from 0 would cause an underflow. It threw <code>Panic(0x11)</code> and rolled back all state changes. Balance remains 0. Safe!`;
        playSound('success');
    }
}

function resetUnderflowDemo() {
    playSound('click');
    document.getElementById("reel1").innerText = "0";
    document.getElementById("reel2").innerText = "0";
    document.getElementById("reel3").innerText = "0";
    document.getElementById("reelEnd").innerText = "0";

    const fullText = document.getElementById("odometerFullText");
    fullText.innerText = "0 Tokens";
    fullText.style.color = "#94a3b8";

    const mathResult = document.getElementById("mathResultText");
    mathResult.innerText = "0";
    mathResult.style.color = "#f1f5f9";

    const statusPill = document.getElementById("odometerStatus");
    statusPill.className = "status-pill safe";
    statusPill.innerText = "Balance Normal: 0 Tokens";

    document.getElementById("bugConsole").innerText = "Odometer reset. Ready to test subtraction.";
}

// Sub-Bug 2: Access Control Exploit
function triggerClaimOwnership() {
    const consoleEl = document.getElementById("bugConsole");
    const crown = document.getElementById("ownerCrown");
    const addr = document.getElementById("ownerAddressText");
    const desc = document.getElementById("ownerDescText");
    const card = document.getElementById("accessOwnerCard");
    const status = document.getElementById("accessOwnerStatus");
    const btnDrain = document.getElementById("btnDrainAccessVault");

    if (bugMode === 'vulnerable') {
        playSound('alarm');
        crown.classList.add("stolen");
        card.classList.add("highlight-glow");
        addr.innerText = "0xHacker_Anonymous (Exploiter)";
        addr.style.color = "var(--accent-red)";
        desc.innerText = "⚠️ Malicious Entity Took Ownership!";
        status.className = "status-pill danger";
        status.innerText = "💀 CONTRACT COMPROMISED!";

        btnDrain.disabled = false;

        consoleEl.innerHTML = `🚨 <strong>Step 1 Succeeded:</strong> Attacker called <code>changeOwner(0xHacker_Anonymous)</code>. Because the developer forgot the <code>onlyOwner</code> modifier, the smart contract accepted the command! The attacker is now the administrator.`;
    } else {
        playSound('warning');
        consoleEl.innerHTML = `🛑 <strong>Step 1 Blocked:</strong> Attacker called <code>changeOwner(0xHacker_Anonymous)</code>, but the function is protected by the <code>onlyOwner</code> modifier. The check <code>require(msg.sender == owner)</code> evaluated to FALSE. <br><span style='color:#34d399'>❌ REVERT: Caller is not the owner!</span>`;
        playSound('success');
    }
}

function triggerDrainAccessVault() {
    playSound('alarm');
    const consoleEl = document.getElementById("bugConsole");
    const vBal = document.getElementById("accessVaultBalance");
    const vBar = document.getElementById("accessVaultBar");
    const loot = document.getElementById("accessAttackerLoot");
    const aStatus = document.getElementById("accessAttackerStatus");

    vBal.innerText = "$0";
    vBar.style.width = "0%";
    vBar.classList.add("danger");

    loot.innerText = "$10,000,000";
    loot.style.color = "var(--accent-red)";
    aStatus.className = "status-pill danger";
    aStatus.innerText = "💰 Drained $10,000,000 Vault!";

    spawnCoinParticle("accessOwnerCard", "subBugAccessView", "💸 $10,000,000 STOLEN", "red");

    consoleEl.innerHTML = `💀 <strong>Step 2 Succeeded:</strong> As the new owner, the attacker called <code>emergencyWithdrawAll()</code> and drained the entire $10,000,000 treasury! This mirrors the famous Parity Multi-Sig Hack of 2017.`;
}

function resetAccessDemo() {
    playSound('click');
    const crown = document.getElementById("ownerCrown");
    const addr = document.getElementById("ownerAddressText");
    const desc = document.getElementById("ownerDescText");
    const card = document.getElementById("accessOwnerCard");
    const status = document.getElementById("accessOwnerStatus");
    const btnDrain = document.getElementById("btnDrainAccessVault");

    crown.classList.remove("stolen");
    card.classList.remove("highlight-glow");
    addr.innerText = "0xAdmin_Creator (Deployer)";
    addr.style.color = "#38bdf8";
    desc.innerText = "Authorized Administrator";
    status.className = "status-pill safe";
    status.innerText = "Legitimate Owner In Control";

    btnDrain.disabled = true;

    document.getElementById("accessVaultBalance").innerText = "$10,000,000";
    document.getElementById("accessVaultBar").style.width = "100%";
    document.getElementById("accessVaultBar").classList.remove("danger");

    document.getElementById("accessAttackerLoot").innerText = "$0";
    document.getElementById("accessAttackerLoot").style.color = "var(--text-primary)";
    document.getElementById("accessAttackerStatus").className = "status-pill safe";
    document.getElementById("accessAttackerStatus").innerText = "Regular Guest (Zero Privileges)";

    document.getElementById("bugConsole").innerText = "Access control demo reset.";
}


/* =========================================================
   SIMULATION 4: CLASSROOM QUIZ VERIFICATION
   ========================================================= */

const quizAnswers = {
    1: {
        correctIndex: 1,
        explanation: "Correct! The Checks-Effects-Interactions (CEI) pattern ensures the user's internal balance is set to 0 before an external transfer occurs, so recursive re-entrant calls fail."
    },
    2: {
        correctIndex: 2,
        explanation: "Correct! The Ronin Bridge attack was caused by 4 Sky Mavis keys being stored on compromised company computers, combined with an active whitelist to Axie DAO's validator, giving the attacker 5 of 9 keys."
    },
    3: {
        correctIndex: 0,
        explanation: "Correct! Starting in Solidity 0.8.0, arithmetic operations automatically revert with Panic(0x11) on underflow or overflow, preventing the classic odometer glitch without needing SafeMath libraries."
    }
};

function checkQuiz(qNum, selectedOption) {
    const card = document.getElementById(`quizCard${qNum}`);
    const feedback = document.getElementById(`quizFeedback${qNum}`);
    const buttons = card.querySelectorAll(".quiz-opt");

    const answerData = quizAnswers[qNum];
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === answerData.correctIndex) {
            btn.classList.add("correct");
        } else if (idx === selectedOption) {
            btn.classList.add("wrong");
        }
    });

    feedback.classList.remove("hidden");
    if (selectedOption === answerData.correctIndex) {
        playSound('success');
        feedback.className = "quiz-feedback success";
        feedback.innerHTML = `🎉 <strong>Correct!</strong> ${answerData.explanation}`;
    } else {
        playSound('warning');
        feedback.className = "quiz-feedback error";
        feedback.innerHTML = `❌ <strong>Incorrect.</strong> ${answerData.explanation}`;
    }
}


/* =========================================================
   INITIALIZATION ON LOAD
   ========================================================= */

window.addEventListener("DOMContentLoaded", () => {
    updateScreen();
    renderValidators();
    updateSpeakerNotesTab('dao');
    updateBugExplanations();
});
