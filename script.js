/* ==========================================================================
   BLOCKCHAIN SECURITY LAB - FAMOUS ATTACKS INTERACTIVE SIMULATOR
   Comprehensive Simulation State Machines & Audio Synthesizer Engine
   Offline Educational Demonstrator for College Presentations & Evaluations
   ========================================================================== */

// Global Audio Synthesizer (Web Audio API - Zero External Dependencies)
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
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'coin') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'warning') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.setValueAtTime(260, now + 0.1);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'alarm') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(440, now + 0.12);
            osc.frequency.setValueAtTime(880, now + 0.24);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1);
            osc.frequency.setValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        }
    } catch (e) {
        console.warn("Audio Context notice:", e);
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const txt = document.getElementById("soundStatusText");
    const btn = document.getElementById("soundToggleBtn");
    if (txt && btn) {
        if (soundEnabled) {
            txt.innerText = "ON";
            btn.classList.remove("muted");
            playSound('click');
        } else {
            txt.innerText = "OFF";
            btn.classList.add("muted");
        }
    }
}

// Visual Floating Particle System
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

    const p = document.createElement("div");
    p.className = `flying-particle ${type}`;
    p.innerText = text;
    p.style.left = `${startX}px`;
    p.style.top = `${startY}px`;
    container.appendChild(p);

    setTimeout(() => {
        p.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1.1)`;
        p.style.opacity = "0";
    }, 20);

    setTimeout(() => {
        p.remove();
    }, 850);
}

// ==========================================================================
// NAVIGATION & PRESENTATION MODE CONTROLLER
// ==========================================================================

let activeTabId = 'home';
let isPresentationMode = false;
let currentPresStep = 1;

const tabTitles = {
    home: "Overview & Architecture",
    fiftyone: "51% Consensus Attack Simulation",
    sybil: "Sybil Attack Simulation",
    doublespend: "Double Spending Simulation",
    dao: "The DAO Reentrancy Exploit",
    ronin: "Ronin Bridge Multi-Sig Compromise",
    bugs: "Smart Contract Bugs (Underflow & Access)",
    prevention: "Prevention Matrix",
    quiz: "Classroom Quick Quiz"
};

function switchLabTab(tabId) {
    playSound('click');
    activeTabId = tabId;

    // Toggle navigation buttons
    document.querySelectorAll(".nav-tab").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });

    // Toggle tab panels
    document.querySelectorAll(".tab-panel").forEach(panel => {
        const isTarget = panel.id === `tab-${tabId}`;
        panel.classList.toggle("active", isTarget);
        panel.classList.toggle("hidden", !isTarget);
    });

    // Update speaker notes drawer tab
    const noteMap = {
        home: "speakerNoteHome",
        fiftyone: "speakerNoteFiftyOne",
        sybil: "speakerNoteSybil",
        doublespend: "speakerNoteDoubleSpend",
        dao: "speakerNoteDAO",
        ronin: "speakerNoteRonin",
        bugs: "speakerNoteBugs",
        prevention: "speakerNotePrevention",
        quiz: "speakerNotePrevention"
    };

    document.querySelectorAll(".speaker-note-tab").forEach(note => {
        note.classList.add("hidden");
    });
    const targetNote = document.getElementById(noteMap[tabId] || "speakerNoteHome");
    if (targetNote) targetNote.classList.remove("hidden");

    // Update Presentation Mode banner
    const presTitle = document.getElementById("presCurrentTitle");
    if (presTitle) {
        presTitle.innerText = tabTitles[tabId] || "Interactive Lab";
    }

    // Tab-specific lifecycle hooks
    if (tabId === 'sybil') {
        setTimeout(drawSybilLines, 100);
    } else if (tabId === 'ronin') {
        renderValidators();
    } else if (tabId === 'fiftyone') {
        render51Nodes();
    }
}

function toggleSpeakerNotes() {
    playSound('click');
    const drawer = document.getElementById("speakerNotesDrawer");
    if (drawer) {
        drawer.classList.toggle("hidden");
    }
}

function togglePresentationMode() {
    playSound('click');
    isPresentationMode = !isPresentationMode;
    const banner = document.getElementById("presentationBanner");
    const btn = document.getElementById("presModeBtn");

    if (banner && btn) {
        if (isPresentationMode) {
            banner.classList.remove("hidden");
            btn.classList.add("active");
            document.body.classList.add("presentation-active");
            const presTitle = document.getElementById("presCurrentTitle");
            if (presTitle) presTitle.innerText = tabTitles[activeTabId] || "Interactive Lab";
        } else {
            banner.classList.add("hidden");
            btn.classList.remove("active");
            document.body.classList.remove("presentation-active");
        }
    }
}

function presNextStep() {
    playSound('click');
    const order = ['home', 'fiftyone', 'sybil', 'doublespend', 'dao', 'ronin', 'bugs', 'prevention', 'quiz'];
    let idx = order.indexOf(activeTabId);
    if (idx < order.length - 1) {
        switchLabTab(order[idx + 1]);
    } else {
        switchLabTab(order[0]);
    }
}

function presPrevStep() {
    playSound('click');
    const order = ['home', 'fiftyone', 'sybil', 'doublespend', 'dao', 'ronin', 'bugs', 'prevention', 'quiz'];
    let idx = order.indexOf(activeTabId);
    if (idx > 0) {
        switchLabTab(order[idx - 1]);
    }
}

function presRestart() {
    playSound('click');
    if (activeTabId === 'fiftyone') resetFiftyOneDemo();
    else if (activeTabId === 'sybil') resetSybilDemo();
    else if (activeTabId === 'doublespend') resetDsDemo();
    else if (activeTabId === 'dao') resetDemo();
    else if (activeTabId === 'ronin') resetRoninDemo();
    else if (activeTabId === 'bugs') {
        if (currentSubBug === 'underflow') resetUnderflowDemo();
        else if (currentSubBug === 'access') resetAccessDemo();
        else resetDualAttackSim();
    }
}

function presTriggerAttack() {
    if (activeTabId === 'fiftyone') nextFiftyOneStep();
    else if (activeTabId === 'sybil') nextSybilStep();
    else if (activeTabId === 'doublespend') nextDsStep();
    else if (activeTabId === 'dao') attackStep();
    else if (activeTabId === 'ronin') nextRoninStep();
    else if (activeTabId === 'bugs') {
        if (currentSubBug === 'underflow') triggerUnderflowExploit();
        else if (currentSubBug === 'access') triggerClaimOwnership();
        else runDualAttackSim();
    }
}

function presTriggerProtect() {
    if (activeTabId === 'fiftyone') setFiftyOneMode('patched');
    else if (activeTabId === 'sybil') setSybilMode('patched');
    else if (activeTabId === 'doublespend') setDsMode('patched');
    else if (activeTabId === 'dao') setDaoMode('patched');
    else if (activeTabId === 'ronin') setRoninMode('patched');
    else if (activeTabId === 'bugs') setBugMode('patched');
}

// ==========================================================================
// SIMULATION 1: 51% CONSENSUS MAJORITY ATTACK
// ==========================================================================

let fiftyOneMode = 'vulnerable'; // 'vulnerable' or 'patched'
let fiftyOneStep = 0;
let honestPower = 70;
let attackerPower = 30;
let autoFiftyOneInterval = null;

function setFiftyOneMode(mode) {
    stopAutoFiftyOne();
    fiftyOneMode = mode;
    const btnV = document.getElementById("fiftyOneModeVuln");
    const btnP = document.getElementById("fiftyOneModePatched");
    if (btnV) btnV.classList.toggle("active", mode === 'vulnerable');
    if (btnP) btnP.classList.toggle("active", mode === 'patched');

    resetFiftyOneDemo(false);
    const consoleEl = document.getElementById("fiftyOneConsole");
    if (consoleEl) {
        if (mode === 'vulnerable') {
            consoleEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">[MODE: VULNERABLE]</span> Standard Proof-of-Work without finality checkpoints. If an attacker acquires >50% hashrate, they can secretly outmine the network and force a chain reorganization under the Nakamoto Longest Chain Rule.`;
        } else {
            consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[MODE: PATCHED / SECURED]</span> Proof-of-Stake with Casper Finality Checkpoints. Checkpoints are voted on by a 2/3 validator supermajority. Reorganizing past a finalized block (Block 102) is strictly rejected by all nodes, completely neutralizing 51% reorgs!`;
        }
    }
    playSound('click');
}

function render51Nodes() {
    const honestGrid = document.getElementById("gridHonestNodes");
    const attackerGrid = document.getElementById("gridAttackerNodes");
    if (!honestGrid || !attackerGrid) return;

    honestGrid.innerHTML = "";
    attackerGrid.innerHTML = "";

    const honestCount = Math.max(1, Math.round(honestPower / 10));
    const attackerCount = Math.max(1, Math.round(attackerPower / 10));

    for (let i = 1; i <= honestCount; i++) {
        const node = document.createElement("div");
        node.className = "miner-node honest";
        node.title = `Honest Miner #${i}`;
        node.innerText = "⛏️";
        honestGrid.appendChild(node);
    }

    for (let i = 1; i <= attackerCount; i++) {
        const node = document.createElement("div");
        node.className = "miner-node attacker";
        node.title = `Attacker Node #${i}`;
        node.innerText = "⚔️";
        attackerGrid.appendChild(node);
    }

    const cHonest = document.getElementById("countHonestVisual");
    const cAttacker = document.getElementById("countAttackerVisual");
    if (cHonest) cHonest.innerText = honestCount;
    if (cAttacker) cAttacker.innerText = attackerCount;
}

function update51Visuals() {
    const valHonest = document.getElementById("valHonestPower");
    const valAttacker = document.getElementById("valAttackerPower");
    const barHonest = document.getElementById("barHonest");
    const barAttacker = document.getElementById("barAttacker");
    const statusBadge = document.getElementById("status51Badge");
    const reorgRisk = document.getElementById("reorgRiskLabel");
    const attSub = document.getElementById("attackerStatusSub");

    if (valHonest) valHonest.innerText = `${honestPower}%`;
    if (valAttacker) valAttacker.innerText = `${attackerPower}%`;
    if (barHonest) barHonest.style.width = `${honestPower}%`;
    if (barAttacker) barAttacker.style.width = `${attackerPower}%`;

    render51Nodes();

    const isMajority = attackerPower > 50;
    if (statusBadge) {
        if (isMajority) {
            statusBadge.className = "status-pill danger";
            statusBadge.innerText = `⚠️ ATTACKER MAJORITY (${attackerPower}% Hashrate)`;
        } else {
            statusBadge.className = "status-pill safe";
            statusBadge.innerText = `Network is healthy (Honest: ${honestPower}%)`;
        }
    }

    if (reorgRisk) {
        if (isMajority) {
            reorgRisk.innerText = "CRITICAL (REORG IMMINENT)";
            reorgRisk.style.color = "#ef4444";
        } else {
            reorgRisk.innerText = "VERY LOW (SAFE)";
            reorgRisk.style.color = "#34d399";
        }
    }

    if (attSub) {
        if (isMajority) {
            attSub.innerText = "Status: MAJORITY (>50%) — Can Outpace Honest Network";
            attSub.style.color = "#ef4444";
        } else {
            attSub.innerText = "Status: Minor Share (No Reorg Possible)";
            attSub.style.color = "inherit";
        }
    }
}

function normalFiftyOneMining() {
    stopAutoFiftyOne();
    playSound('coin');
    spawnCoinParticle("gridHonestNodes", "honestBlocksContainer", "⛏️ New Block", "gold");

    honestPower = 70;
    attackerPower = 30;
    update51Visuals();

    const b103H = document.getElementById("block103H");
    const b104H = document.getElementById("block104H");
    if (b103H) b103H.classList.remove("orphaned");
    if (b104H) b104H.classList.remove("orphaned");

    const hLen = document.getElementById("honestChainLen");
    const aLen = document.getElementById("attackerChainLen");
    if (hLen) hLen.innerText = "Length: 4 Blocks (Canonical Chain)";
    if (aLen) aLen.innerText = "Length: 2 Blocks (Inactive Fork)";

    ["block103A", "block104A", "block105A"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden-block");
    });
    ["altArrow1", "altArrow2", "altArrow3"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = "0.3";
    });

    const consoleEl = document.getElementById("fiftyOneConsole");
    if (consoleEl) {
        consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[NORMAL HONEST MINING]</span> Honest miners (70% network hashrate) produce Block 103 and Block 104 in open consensus. Every transaction is verified by the majority and confirmed sequentially in the canonical ledger. Reorg risk: 0%.`;
    }
}

function nextFiftyOneStep() {
    playSound('click');
    if (fiftyOneStep >= 4) {
        resetFiftyOneDemo(false);
    }
    fiftyOneStep++;
    executeFiftyOneStep();
}

function executeFiftyOneStep() {
    const stepInd = document.getElementById("fiftyOneStepIndicator");
    const consoleEl = document.getElementById("fiftyOneConsole");
    const hLen = document.getElementById("honestChainLen");
    const aLen = document.getElementById("attackerChainLen");
    const b103H = document.getElementById("block103H");
    const b104H = document.getElementById("block104H");
    const b103A = document.getElementById("block103A");
    const b104A = document.getElementById("block104A");
    const b105A = document.getElementById("block105A");
    const arr1 = document.getElementById("altArrow1");
    const arr2 = document.getElementById("altArrow2");
    const arr3 = document.getElementById("altArrow3");

    if (fiftyOneStep === 1) {
        attackerPower = 55;
        honestPower = 45;
        update51Visuals();
        playSound('warning');

        if (stepInd) stepInd.innerText = "Step 2 of 4";
        if (consoleEl) {
            consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 1 of 4: SECRET HASHPOWER LEASE]</span> 🦹 Attacker secretly rents 55% of global hashrate via cloud mining / rented ASICs. For the first time, 1 entity produces hashes faster than all honest nodes combined! Honest miners are unaware and continue mining on the public chain.`;
        }
    } else if (fiftyOneStep === 2) {
        if (b103A) b103A.classList.remove("hidden-block");
        if (b104A) b104A.classList.remove("hidden-block");
        if (arr1) arr1.style.opacity = "1";
        if (arr2) arr2.style.opacity = "1";
        if (aLen) aLen.innerText = "Length: 4 Blocks (Secret Private Fork)";

        if (stepInd) stepInd.innerText = "Step 3 of 4";
        if (consoleEl) {
            consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 2 of 4: PUBLIC PAYMENT + SECRET FORK]</span> 🕵️ Attacker broadcasts a 100 ETH deposit to an exchange in public Block 103. Simultaneously, attacker secretly mines Block 103A and 104A in private, redirecting that SAME 100 ETH back to their own wallet! The secret chain is kept unbroadcasted.`;
        }
    } else if (fiftyOneStep === 3) {
        if (b105A) b105A.classList.remove("hidden-block");
        if (arr3) arr3.style.opacity = "1";
        if (aLen) aLen.innerText = "Length: 5 Blocks (LONGER THAN HONEST CHAIN!)";

        playSound('coin');
        if (stepInd) stepInd.innerText = "Step 4 of 4";
        if (consoleEl) {
            consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 3 of 4: EXCHANGE RELEASES CASH]</span> 💰 The exchange sees 2 confirmations on the public chain (Blocks 103-104) and lets the attacker cash out $300,000 USD fiat! The attacker wires the money away. Meanwhile, the attacker's 55% hashrate completes secret Block 105A. The private chain is now 5 blocks long vs the honest chain's 4 blocks!`;
        }
    } else if (fiftyOneStep === 4) {
        stopAutoFiftyOne();
        if (fiftyOneMode === 'vulnerable') {
            playSound('alarm');
            if (b103H) b103H.classList.add("orphaned");
            if (b104H) b104H.classList.add("orphaned");
            if (hLen) hLen.innerText = "Length: 4 Blocks (ORPHANED / REORGANIZED)";
            if (aLen) aLen.innerText = "Length: 5 Blocks (CANONICAL LONGEST CHAIN)";

            if (stepInd) stepInd.innerText = "Exploit Completed!";
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">[STEP 4 of 4: CHAIN REORGANIZATION!]</span> 🚨 Attacker releases their 5-block chain to the world! Under Nakamoto Longest Chain rules, all nodes worldwide abandon Blocks 103 & 104 (ORPHANED). The 100 ETH deposit never happened on the new chain. Attacker successfully kept the 100 ETH AND kept the $300,000 cash!`;
            }
        } else {
            playSound('success');
            if (stepInd) stepInd.innerText = "Attack Blocked!";
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[DEFENSE ACTIVE: FINALITY CHECKPOINT]</span> 🛡️ Casper FFG Checkpoint: Block 102 was finalized by a 2/3 validator supermajority. The protocol strictly rejects any reorg past a finalized checkpoint regardless of chain length! Attacker's fork is discarded, and attacker wasted millions in electricity.`;
            }
        }
    }
}

function toggleAutoFiftyOne() {
    if (autoFiftyOneInterval) {
        stopAutoFiftyOne();
    } else {
        playSound('click');
        const icon = document.getElementById("autoFiftyOneIcon");
        const text = document.getElementById("autoFiftyOneText");
        const btn = document.getElementById("btnFiftyOneAuto");
        if (icon) icon.innerText = "⏹️";
        if (text) text.innerText = "Stop Auto-Play";
        if (btn) btn.classList.add("active");

        if (fiftyOneStep >= 4) {
            resetFiftyOneDemo(false);
        }

        autoFiftyOneInterval = setInterval(() => {
            if (fiftyOneStep < 4) {
                nextFiftyOneStep();
            } else {
                stopAutoFiftyOne();
            }
        }, 2200);
    }
}

function stopAutoFiftyOne() {
    if (autoFiftyOneInterval) {
        clearInterval(autoFiftyOneInterval);
        autoFiftyOneInterval = null;
    }
    const icon = document.getElementById("autoFiftyOneIcon");
    const text = document.getElementById("autoFiftyOneText");
    const btn = document.getElementById("btnFiftyOneAuto");
    if (icon) icon.innerText = "▶️";
    if (text) text.innerText = "Auto-Play Attack";
    if (btn) btn.classList.remove("active");
}

function resetFiftyOneDemo(playSoundEffect = true) {
    if (playSoundEffect) playSound('click');
    stopAutoFiftyOne();
    fiftyOneStep = 0;
    honestPower = 70;
    attackerPower = 30;
    update51Visuals();

    const stepInd = document.getElementById("fiftyOneStepIndicator");
    if (stepInd) stepInd.innerText = "Step 1 of 4";

    const b103H = document.getElementById("block103H");
    const b104H = document.getElementById("block104H");
    if (b103H) b103H.classList.remove("orphaned");
    if (b104H) b104H.classList.remove("orphaned");

    ["block103A", "block104A", "block105A"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden-block");
    });
    ["altArrow1", "altArrow2", "altArrow3"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = "0.3";
    });

    const hLen = document.getElementById("honestChainLen");
    const aLen = document.getElementById("attackerChainLen");
    if (hLen) hLen.innerText = "Length: 4 Blocks";
    if (aLen) aLen.innerText = "Length: 2 Blocks (Inactive)";

    const consoleEl = document.getElementById("fiftyOneConsole");
    if (consoleEl) {
        consoleEl.innerHTML = "Network consensus initialized. Honest miners hold 70% consensus power. Choose Normal Honest Mining or click Next Attack Step.";
    }
}

function reset51Sim() { resetFiftyOneDemo(true); }
function increaseAttackerPower() { nextFiftyOneStep(); }
function restoreHonest51() { setFiftyOneMode('patched'); }

// ==========================================================================
// SIMULATION 2: SYBIL ATTACK (IDENTITY FORGERY)
// ==========================================================================

let sybilMode = 'vulnerable'; // 'vulnerable' or 'patched'
let sybilStep = 0;
let sybilFakeCount = 0;
let autoSybilInterval = null;
const MAX_SYBIL_BOTS = 6;

function setSybilMode(mode) {
    stopAutoSybil();
    sybilMode = mode;
    const btnV = document.getElementById("sybilModeVuln");
    const btnP = document.getElementById("sybilModePatched");
    if (btnV) btnV.classList.toggle("active", mode === 'vulnerable');
    if (btnP) btnP.classList.toggle("active", mode === 'patched');

    resetSybilDemo(false);
    const consoleEl = document.getElementById("sybilConsole");
    if (consoleEl) {
        if (mode === 'vulnerable') {
            consoleEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">[MODE: VULNERABLE]</span> Naive 1-IP-1-Vote Model. Digital identities are free and unlimited. An adversary can forge dozens of sock-puppet nodes to usurp peer voting or routing.`;
        } else {
            consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[MODE: PATCHED / SECURED]</span> Proof-of-Stake Model. Each voting validator must lock 32 ETH in collateral. Fake personas without stake have 0% voting weight, rendering identity forgery useless!`;
        }
    }
    playSound('click');
}

function drawSybilLines() {
    const svg = document.getElementById("sybilSvgCanvas");
    const master = document.querySelector(".attacker-master-card") || document.getElementById("cardAttackerMaster");
    const grid = document.getElementById("gridFakeBots");
    const stage = document.getElementById("sybilNetworkStage");
    if (!svg || !master || !grid || !stage) return;

    svg.innerHTML = "";
    if (sybilFakeCount === 0) return;

    const stageRect = stage.getBoundingClientRect();
    const mRect = master.getBoundingClientRect();
    const startX = mRect.right - stageRect.left;
    const startY = mRect.top + mRect.height / 2 - stageRect.top;

    const botCards = grid.querySelectorAll(".identity-card.bot");
    botCards.forEach(bot => {
        const bRect = bot.getBoundingClientRect();
        const endX = bRect.left - stageRect.left;
        const endY = bRect.top + bRect.height / 2 - stageRect.top;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const cpX1 = startX + (endX - startX) * 0.5;
        const cpY1 = startY;
        const cpX2 = startX + (endX - startX) * 0.5;
        const cpY2 = endY;

        path.setAttribute("d", `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`);
        path.setAttribute("stroke", "#ef4444");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-dasharray", "4,4");
        path.setAttribute("opacity", "0.85");
        svg.appendChild(path);
    });
}

window.addEventListener("resize", drawSybilLines);

function normalSybilVote() {
    stopAutoSybil();
    resetSybilDemo(false);
    playSound('success');

    const consoleEl = document.getElementById("sybilConsole");
    if (consoleEl) {
        consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[HONEST NETWORK VOTE]</span> 4 legitimate human participants cast votes on Network Proposal #42 ("Upgrade Block Size to 2MB"). Result: Alice (YES), Bob (YES), Charlie (YES), David (NO). Outcome: 75% approval. Consensus accurately reflects community will.`;
    }
}

function nextSybilStep() {
    playSound('click');
    if (sybilStep >= 3) {
        resetSybilDemo(false);
    }
    sybilStep++;
    executeSybilStep();
}

function executeSybilStep() {
    const stepInd = document.getElementById("sybilStepIndicator");
    const consoleEl = document.getElementById("sybilConsole");
    const grid = document.getElementById("gridFakeBots");
    const fakeCountEl = document.getElementById("sybilFakeCount");
    const headerCountEl = document.getElementById("fakeBotHeaderCount");
    const ratioEl = document.getElementById("sybilInfluenceRatio");
    const statusTag = document.getElementById("sybilStatusTag");
    const puppetLabel = document.getElementById("puppetLabel");

    if (sybilStep === 1) {
        sybilFakeCount = 6;
        playSound('warning');

        if (grid) {
            grid.innerHTML = "";
            for (let i = 1; i <= sybilFakeCount; i++) {
                const card = document.createElement("div");
                card.className = "identity-card bot";
                card.id = `sybilBot${i}`;
                card.innerHTML = `
                    <span class="id-avatar">🤖</span>
                    <span class="id-name">Bot Node #${i}</span>
                    <span class="id-tag" style="color: #f87171;">Fake Persona</span>
                `;
                grid.appendChild(card);
            }
        }

        if (fakeCountEl) fakeCountEl.innerText = "6";
        if (headerCountEl) headerCountEl.innerText = "6";
        if (ratioEl) ratioEl.innerText = "60%";
        if (puppetLabel) puppetLabel.style.display = "inline-block";

        if (statusTag) {
            statusTag.className = "status-pill danger";
            statusTag.innerText = "⚠️ Sybil Majority (>50% Fake Identities)";
        }

        setTimeout(drawSybilLines, 60);

        if (stepInd) stepInd.innerText = "Step 2 of 3";
        if (consoleEl) {
            consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 1 of 3: SOCK-PUPPET INJECTION]</span> 🦹 Single adversary spins up 6 fake bot personas from one laptop! Red puppet wires show that all 6 nodes report to 1 puppet master. Attacker now controls 60% of network seats for $0 cost!`;
        }
    } else if (sybilStep === 2) {
        playSound('click');

        const honestCards = document.querySelectorAll("#colRealUsers .identity-card");
        honestCards.forEach(c => {
            let tag = c.querySelector(".vote-badge");
            if (!tag) {
                tag = document.createElement("span");
                tag.className = "vote-badge no";
                tag.style.cssText = "display:block; margin-top:4px; font-size:11px; font-weight:700; color:#ef4444;";
                c.appendChild(tag);
            }
            tag.innerText = "Voted: NO ❌";
        });

        const botCards = document.querySelectorAll("#gridFakeBots .identity-card");
        botCards.forEach(c => {
            let tag = c.querySelector(".vote-badge");
            if (!tag) {
                tag = document.createElement("span");
                tag.className = "vote-badge yes";
                tag.style.cssText = "display:block; margin-top:4px; font-size:11px; font-weight:700; color:#10b981;";
                c.appendChild(tag);
            }
            tag.innerText = "Voted: YES ✅";
        });

        if (stepInd) stepInd.innerText = "Step 3 of 3";
        if (consoleEl) {
            consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 2 of 3: RIGGED BALLOT CAST]</span> 🗳️ Malicious Proposal #99 submitted: <em>"Drain Treasury to Attacker Wallet"</em>. 4 honest humans vote NO (40%). Attacker commands all 6 bot puppets to vote YES (60%). Fake digital clones easily overwhelm real humans!`;
        }
    } else if (sybilStep === 3) {
        stopAutoSybil();
        if (sybilMode === 'vulnerable') {
            playSound('alarm');
            if (stepInd) stepInd.innerText = "Exploit Completed!";
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">[STEP 3 of 3: DEMOCRACY HIJACKED!]</span> 🚨 Malicious Proposal #99 PASSES 60% to 40%! Treasury funds looted. The system failed because it assumed: 1 IP Address = 1 Independent Human Being.`;
            }
        } else {
            playSound('success');
            if (stepInd) stepInd.innerText = "Attack Blocked!";
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[DEFENSE ACTIVE: PROOF-OF-STAKE]</span> 🛡️ Proof-of-Stake Security: Voting power requires capital collateral (32 ETH per validator). The 6 fake sockets hold 0 ETH, giving them 0% voting weight. Honest humans hold 100% of staked capital, voting NO 100% to 0%. Malicious proposal defeated!`;
            }
        }
    }
}

function toggleAutoSybil() {
    if (autoSybilInterval) {
        stopAutoSybil();
    } else {
        playSound('click');
        const icon = document.getElementById("autoSybilIcon");
        const text = document.getElementById("autoSybilText");
        const btn = document.getElementById("btnSybilAuto");
        if (icon) icon.innerText = "⏹️";
        if (text) text.innerText = "Stop Auto-Play";
        if (btn) btn.classList.add("active");

        if (sybilStep >= 3) {
            resetSybilDemo(false);
        }

        autoSybilInterval = setInterval(() => {
            if (sybilStep < 3) {
                nextSybilStep();
            } else {
                stopAutoSybil();
            }
        }, 2400);
    }
}

function stopAutoSybil() {
    if (autoSybilInterval) {
        clearInterval(autoSybilInterval);
        autoSybilInterval = null;
    }
    const icon = document.getElementById("autoSybilIcon");
    const text = document.getElementById("autoSybilText");
    const btn = document.getElementById("btnSybilAuto");
    if (icon) icon.innerText = "▶️";
    if (text) text.innerText = "Auto-Play Attack";
    if (btn) btn.classList.remove("active");
}

function resetSybilDemo(playSoundEffect = true) {
    if (playSoundEffect) playSound('click');
    stopAutoSybil();
    sybilStep = 0;
    sybilFakeCount = 0;

    const grid = document.getElementById("gridFakeBots");
    if (grid) grid.innerHTML = "";

    const fakeCountEl = document.getElementById("sybilFakeCount");
    const headerCountEl = document.getElementById("fakeBotHeaderCount");
    const ratioEl = document.getElementById("sybilInfluenceRatio");
    const statusTag = document.getElementById("sybilStatusTag");
    const puppetLabel = document.getElementById("puppetLabel");
    const stepInd = document.getElementById("sybilStepIndicator");

    if (fakeCountEl) fakeCountEl.innerText = "0";
    if (headerCountEl) headerCountEl.innerText = "0";
    if (ratioEl) ratioEl.innerText = "0%";
    if (puppetLabel) puppetLabel.style.display = "none";
    if (stepInd) stepInd.innerText = "Step 1 of 3";

    if (statusTag) {
        statusTag.className = "status-pill safe";
        statusTag.innerText = "Fair Consensus (100% Real)";
    }

    const voteBadges = document.querySelectorAll(".vote-badge");
    voteBadges.forEach(b => b.remove());

    const svg = document.getElementById("sybilSvgCanvas");
    if (svg) svg.innerHTML = "";

    const consoleEl = document.getElementById("sybilConsole");
    if (consoleEl) {
        consoleEl.innerHTML = "Peer network initialized with 4 legitimate human participants. Each controls one natural identity. Choose Fair Vote or click Next Attack Step.";
    }
}

function resetSybilSim() { resetSybilDemo(true); }
function spawnSybilBots(count) { nextSybilStep(); }
function testSybilVote() { normalSybilVote(); }

// ==========================================================================
// SIMULATION 3: DOUBLE SPENDING (CONFLICTING UTXO TRANSACTIONS)
// ==========================================================================

let dsMode = 'vulnerable'; // 'vulnerable' or 'patched'
let dsStep = 0;
let balAlice = 1;
let balBob = 0;
let balCharlie = 0;
let autoDsInterval = null;

function setDsMode(mode) {
    stopAutoDs();
    dsMode = mode;
    const btnV = document.getElementById("dsModeVuln");
    const btnP = document.getElementById("dsModePatched");
    if (btnV) btnV.classList.toggle("active", mode === 'vulnerable');
    if (btnP) btnP.classList.toggle("active", mode === 'patched');

    resetDsDemo(false);
    const consoleEl = document.getElementById("dsConsole");
    if (consoleEl) {
        if (mode === 'vulnerable') {
            consoleEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">[MODE: VULNERABLE]</span> 0-Confirmation Merchant Model. Merchant hands over goods as soon as a transaction appears in the unconfirmed mempool, creating a critical race vulnerability.`;
        } else {
            consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[MODE: PATCHED / SECURED]</span> 6-Confirmation Rule. Merchant holds merchandise safely in escrow until the transaction has received immutable blockchain confirmations, eliminating 0-conf double spend risk!`;
        }
    }
    playSound('click');
}

function updateDSBalances() {
    const bA = document.getElementById("balAlice");
    const bB = document.getElementById("balBob");
    const bC = document.getElementById("balCharlie");
    if (bA) bA.innerText = `🪙 ${balAlice} COIN${balAlice === 1 ? '' : 'S'}`;
    if (bB) bB.innerText = `🪙 ${balBob} COIN${balBob === 1 ? '' : 'S'}`;
    if (bC) bC.innerText = `🪙 ${balCharlie} COIN${balCharlie === 1 ? '' : 'S'}`;
}

function normalPaymentDS() {
    stopAutoDs();
    resetDsDemo(false);
    playSound('coin');
    spawnCoinParticle("chipAlice", "chipBob", "🪙 1 Coin", "gold");

    balAlice = 0;
    balBob = 1;
    balCharlie = 0;
    updateDSBalances();

    const statusA = document.getElementById("statusTxA");
    const statusB = document.getElementById("statusTxB");
    const slot = document.getElementById("blockTxSlot");
    const phase = document.getElementById("consensusPhase");
    const statusBob = document.getElementById("statusBobGood");

    if (statusA) {
        statusA.innerText = "Confirmed in Block #502 ✅";
        statusA.style.color = "#34d399";
    }
    if (statusB) {
        statusB.innerText = "Unbroadcasted";
        statusB.style.color = "inherit";
    }
    if (statusBob) {
        statusBob.className = "status-pill safe";
        statusBob.innerText = "Payment Confirmed (Laptop Shipped)";
    }
    if (slot) {
        slot.innerHTML = `<span style="color: #34d399; font-weight: 700;">[Tx-01: Alice ➔ Bob (1 Coin) Confirmed]</span>`;
    }
    if (phase) phase.innerText = "Block #502 Finalized";

    const consoleEl = document.getElementById("dsConsole");
    if (consoleEl) {
        consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[HONEST PAYMENT CONFIRMED]</span> Alice broadcasts Tx-01 paying Bob 1 Coin for a laptop. Transaction is mined into Block #502. Bob receives payment and ships product. UTXO #7492 is marked spent.`;
    }
}

function nextDsStep() {
    playSound('click');
    if (dsStep >= 3) {
        resetDsDemo(false);
    }
    dsStep++;
    executeDsStep();
}

function executeDsStep() {
    const stepInd = document.getElementById("dsStepIndicator");
    const consoleEl = document.getElementById("dsConsole");
    const cardB = document.getElementById("cardTxB");
    const conflictBadge = document.getElementById("conflictBadgeWrap");
    const statusA = document.getElementById("statusTxA");
    const statusB = document.getElementById("statusTxB");
    const slot = document.getElementById("blockTxSlot");
    const phase = document.getElementById("consensusPhase");
    const statusBob = document.getElementById("statusBobGood");
    const statusCharlie = document.getElementById("statusCharlieGood");

    if (dsStep === 1) {
        if (statusA) {
            statusA.innerText = "Pending in Mempool (0-Conf)...";
            statusA.style.color = "#fbbf24";
        }
        if (phase) phase.innerText = "Mempool Broadcast (0-Conf)";

        if (dsMode === 'vulnerable') {
            if (statusBob) {
                statusBob.className = "status-pill danger";
                statusBob.innerText = "Laptop Handed Over! (0-Conf)";
            }
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 1 of 3: 0-CONF ACCEPTANCE]</span> 🛍️ Alice sends Tx-A to Bob for a $1,500 laptop. Bob is a 0-confirmation merchant. Seeing Tx-A in the unconfirmed mempool, Bob immediately hands Alice the laptop! But Tx-A is NOT yet mined into any block.`;
            }
        } else {
            if (statusBob) {
                statusBob.className = "status-pill safe";
                statusBob.innerText = "Waiting for Confirmations (0/6)";
            }
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[STEP 1 of 3: 6-CONF POLICY ENFORCED]</span> 🛡️ Alice sends Tx-A to Bob. Bob enforces a 6-confirmation policy. The laptop stays safely locked in the store warehouse until Tx-A is finalized on-chain!`;
            }
        }

        if (stepInd) stepInd.innerText = "Step 2 of 3";
    } else if (dsStep === 2) {
        playSound('warning');
        if (cardB) cardB.style.opacity = "1";
        if (conflictBadge) conflictBadge.style.display = "block";
        if (statusB) {
            statusB.innerText = "Pending Mempool (5x HIGHER FEE)";
            statusB.style.color = "#fbbf24";
        }
        if (statusCharlie) {
            statusCharlie.className = "status-pill warning";
            statusCharlie.innerText = "Conflicting Claim Pending";
        }
        if (phase) phase.innerText = "Mempool Conflict Resolution";
        if (slot) {
            slot.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ CONFLICT: Both Tx-A & Tx-B claim Coin #7492!</span>`;
        }

        if (stepInd) stepInd.innerText = "Step 3 of 3";
        if (consoleEl) {
            consoleEl.innerHTML = `<span style="color:#f59e0b; font-weight:700;">[STEP 2 of 3: CONFLICTING TX BROADCAST]</span> ⚡ The instant Alice gets the laptop, she broadcasts Tx-B sending the SAME Coin #7492 to Charlie with a 5x higher miner fee (Replace-By-Fee)! Both transactions compete in the mempool.`;
        }
    } else if (dsStep === 3) {
        stopAutoDs();
        if (dsMode === 'vulnerable') {
            playSound('alarm');
            balAlice = 0;
            balBob = 0;
            balCharlie = 1;
            updateDSBalances();

            if (statusA) {
                statusA.innerText = "INVALIDATED & DROPPED ❌";
                statusA.style.color = "#ef4444";
            }
            if (statusB) {
                statusB.innerText = "Confirmed in Block #502 ✅";
                statusB.style.color = "#34d399";
            }
            if (statusBob) {
                statusBob.className = "status-pill danger";
                statusBob.innerText = "DEFRAUDED! ($1,500 Loss, 0 Coins)";
            }
            if (statusCharlie) {
                statusCharlie.className = "status-pill safe";
                statusCharlie.innerText = "Payment Received (1 Coin)";
            }
            if (slot) {
                slot.innerHTML = `
                    <div style="font-size: 0.82rem; line-height: 1.5;">
                        <div style="color: #34d399; font-weight:700;">✓ Block #502: Tx-B Confirmed (Highest Fee)</div>
                        <div style="color: #ef4444; text-decoration: line-through;">✗ Tx-A Dropped (UTXO Double Spend)</div>
                    </div>
                `;
            }
            if (phase) phase.innerText = "Block #502 Finalized";

            if (stepInd) stepInd.innerText = "Exploit Completed!";
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">[STEP 3 of 3: DOUBLE SPEND SUCCESSFUL]</span> 🚨 Block #502 mined Tx-B! Coin #7492 was spent to Charlie. Tx-A was permanently evicted as an illegal double spend. Bob handed over a $1,500 laptop and received $0! Alice got the laptop completely free.`;
            }
        } else {
            playSound('success');
            balAlice = 0;
            balBob = 0;
            balCharlie = 1;
            updateDSBalances();

            if (statusA) {
                statusA.innerText = "REJECTED ❌";
                statusA.style.color = "#ef4444";
            }
            if (statusB) {
                statusB.innerText = "Confirmed in Block #502 ✅";
                statusB.style.color = "#34d399";
            }
            if (statusBob) {
                statusBob.className = "status-pill safe";
                statusBob.innerText = "Protected! Shipment Halted";
            }
            if (statusCharlie) {
                statusCharlie.className = "status-pill safe";
                statusCharlie.innerText = "Received Coin #7492";
            }
            if (phase) phase.innerText = "Block #502 Finalized";

            if (stepInd) stepInd.innerText = "Attack Blocked!";
            if (consoleEl) {
                consoleEl.innerHTML = `<span style="color:#10b981; font-weight:700;">[DEFENSE ACTIVE: 6-CONFIRMATION RULE]</span> 🛡️ Secure Merchant Rule: Because Bob waited for block confirmations, he spotted the conflicting Tx-B in the mempool and canceled shipment! Bob saved his $1,500 laptop. Double spend neutralized!`;
            }
        }
    }
}

function toggleAutoDs() {
    if (autoDsInterval) {
        stopAutoDs();
    } else {
        playSound('click');
        const icon = document.getElementById("autoDsIcon");
        const text = document.getElementById("autoDsText");
        const btn = document.getElementById("btnDsAuto");
        if (icon) icon.innerText = "⏹️";
        if (text) text.innerText = "Stop Auto-Play";
        if (btn) btn.classList.add("active");

        if (dsStep >= 3) {
            resetDsDemo(false);
        }

        autoDsInterval = setInterval(() => {
            if (dsStep < 3) {
                nextDsStep();
            } else {
                stopAutoDs();
            }
        }, 2400);
    }
}

function stopAutoDs() {
    if (autoDsInterval) {
        clearInterval(autoDsInterval);
        autoDsInterval = null;
    }
    const icon = document.getElementById("autoDsIcon");
    const text = document.getElementById("autoDsText");
    const btn = document.getElementById("btnDsAuto");
    if (icon) icon.innerText = "▶️";
    if (text) text.innerText = "Auto-Play Attack";
    if (btn) btn.classList.remove("active");
}

function resetDsDemo(playSoundEffect = true) {
    if (playSoundEffect) playSound('click');
    stopAutoDs();
    dsStep = 0;
    balAlice = 1;
    balBob = 0;
    balCharlie = 0;
    updateDSBalances();

    const cardB = document.getElementById("cardTxB");
    const conflictBadge = document.getElementById("conflictBadgeWrap");
    const statusA = document.getElementById("statusTxA");
    const statusB = document.getElementById("statusTxB");
    const slot = document.getElementById("blockTxSlot");
    const phase = document.getElementById("consensusPhase");
    const statusBob = document.getElementById("statusBobGood");
    const statusCharlie = document.getElementById("statusCharlieGood");
    const stepInd = document.getElementById("dsStepIndicator");

    if (cardB) cardB.style.opacity = "0.5";
    if (conflictBadge) conflictBadge.style.display = "none";
    if (stepInd) stepInd.innerText = "Step 1 of 3";

    if (statusA) {
        statusA.innerText = "Ready";
        statusA.style.color = "inherit";
    }
    if (statusB) {
        statusB.innerText = "Unbroadcasted";
        statusB.style.color = "inherit";
    }
    if (statusBob) {
        statusBob.className = "status-pill safe";
        statusBob.innerText = "Waiting for Payment";
    }
    if (statusCharlie) {
        statusCharlie.className = "status-pill safe";
        statusCharlie.innerText = "Waiting for Payment";
    }
    if (slot) slot.innerHTML = `<span class="empty-slot-text">[Waiting for Consensus Confirmation...]</span>`;
    if (phase) phase.innerText = "Mempool Waiting";

    const consoleEl = document.getElementById("dsConsole");
    if (consoleEl) {
        consoleEl.innerHTML = "Ledger consistent. Alice possesses 1 coin (Coin #7492). Choose Normal Payment or click Next Attack Step.";
    }
}

function resetDSDemo() { resetDsDemo(true); }
function runNormalTxDS() { normalPaymentDS(); }
function prepareDoubleSpendDS() { nextDsStep(); }
function resolveConsensusDS() { setDsMode('patched'); }


// SIMULATION 4: THE DAO REENTRANCY ATTACK
// ==========================================================================

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
    const btnVuln = document.getElementById("daoModeVuln");
    const btnPatched = document.getElementById("daoModePatched");
    if (btnVuln && btnPatched) {
        btnVuln.classList.toggle("active", mode === 'vulnerable');
        btnPatched.classList.toggle("active", mode === 'patched');
    }

    const flowBadge = document.getElementById("daoPipelineCaption");
    const codeBox = document.getElementById("daoSolidityCode");
    const codeLabel = document.getElementById("codeModeLabel");

    if (mode === 'vulnerable') {
        if (flowBadge) {
            flowBadge.style.color = "#f87171";
            flowBadge.innerText = "⚠️ Vulnerable Order: External interaction occurs BEFORE internal storage state is updated!";
        }
        if (codeLabel) {
            codeLabel.className = "code-badge danger";
            codeLabel.innerText = "VULNERABLE PATTERN";
        }
        if (codeBox) {
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
        }
        const exp = document.getElementById("explanationText");
        if (exp) {
            exp.innerText = "The vulnerable contract sends ETH to the caller BEFORE updating their recorded balance. When the attacker's fallback function receives ETH, it calls withdraw() recursively before the balance update line runs!";
        }
    } else {
        if (flowBadge) {
            flowBadge.style.color = "#34d399";
            flowBadge.innerText = "🛡️ Secure Order (CEI): Contract state updated to 0 BEFORE external value transfer occurs.";
        }
        if (codeLabel) {
            codeLabel.className = "code-badge safe";
            codeLabel.innerText = "SECURE CEI PATTERN";
        }
        if (codeBox) {
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
        }
        const exp = document.getElementById("explanationText");
        if (exp) {
            exp.innerText = "In the Patched contract, the user's recorded balance is zeroed out BEFORE sending any ETH. When the attacker re-enters, require(balances[msg.sender] > 0) fails and reverts the exploit!";
        }
    }

    resetDemo();
}

function updateScreen() {
    const elFunds = document.getElementById("contractFunds");
    const elRecBal = document.getElementById("attackerBalance");
    const elStolen = document.getElementById("attackerReceived");
    const elBar = document.getElementById("daoVaultBar");
    const elDepth = document.getElementById("callDepthValue");

    if (elFunds) elFunds.innerText = contractFunds + " ETH";
    if (elRecBal) elRecBal.innerText = attackerBalance + " ETH";
    if (elStolen) elStolen.innerText = attackerReceived + " ETH";

    if (elBar) {
        const pct = Math.max(0, Math.min(100, (contractFunds / 30) * 100));
        elBar.style.width = pct + "%";
        elBar.classList.toggle("danger", contractFunds <= 10);
    }

    const vaultStatus = document.getElementById("daoVaultStatus");
    if (vaultStatus) {
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
    }

    if (elDepth) {
        elDepth.innerText = `Depth ${daoCallStack.length}`;
        elDepth.style.color = daoCallStack.length > 1 ? "var(--accent-red)" : "var(--accent-green)";
    }

    renderCallStack();
}

function renderCallStack() {
    const list = document.getElementById("callStackList");
    if (!list) return;

    if (daoCallStack.length === 0) {
        list.innerHTML = `<div class="stack-frame empty-frame">Stack is idle. Click a button to begin execution.</div>`;
        return;
    }

    list.innerHTML = daoCallStack.map((frame, idx) => {
        const isReentrant = idx > 0;
        return `<div class="stack-frame ${isReentrant ? 'reentrant' : ''}">
            <span>[#${idx + 1}] ${frame.call}</span>
            <span>${frame.caller} ➔ ${frame.target}</span>
        </div>`;
    }).join("");
}

function normalWithdrawal() {
    playSound('click');
    stopAutoDao();

    if (attackerBalance <= 0) {
        const msg = document.getElementById("message");
        if (msg) msg.innerHTML = "❌ <strong>Withdrawal rejected.</strong> Attacker recorded balance is already 0 ETH.";
        playSound('warning');
        return;
    }

    daoCallStack = [
        { call: "withdraw()", caller: "Attacker", target: "DAO" }
    ];

    contractFunds -= attackerBalance;
    attackerReceived += attackerBalance;
    attackerBalance = 0;

    spawnCoinParticle("daoVaultCard", "daoAttackerCard", "🪙 +10 ETH", "gold");
    updateScreen();
    playSound('success');

    const msg = document.getElementById("message");
    if (msg) {
        msg.innerHTML = "✅ <strong>Normal Withdrawal Succeeded:</strong> Attacker withdrew their legitimate 10 ETH. Recorded balance is now 0 ETH. Contract still has 20 ETH intact.";
    }

    const stepBanner = document.getElementById("daoStepBanner");
    if (stepBanner) {
        stepBanner.innerHTML = `<span class="banner-step-num" style="background:#10b981;">SECURE</span><span class="banner-step-text">Normal withdrawal executed: Check ➔ Update Balance ➔ Send ETH.</span>`;
    }

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
    const reenterArrow = document.getElementById("reenterArrow");
    const msg = document.getElementById("message");
    const stepBanner = document.getElementById("daoStepBanner");

    if (contractFunds <= 0) {
        stopAutoDao();
        if (msg) msg.innerHTML = "💀 <strong>EXPLOIT FINISHED:</strong> DAO Contract is completely drained (0 ETH)! Attacker stole 30 ETH.";
        if (stepBanner) stepBanner.innerHTML = `<span class="banner-step-num" style="background:#dc2626;">💀 DRAINED</span><span class="banner-step-text">All 30 ETH drained from vault. Exploit complete.</span>`;
        playSound('alarm');
        return;
    }

    attackCount++;
    const stolen = 10;
    contractFunds -= stolen;
    attackerReceived += stolen;

    spawnCoinParticle("daoVaultCard", "daoAttackerCard", "🪙 +10 ETH STOLEN", "red");

    daoCallStack.push({
        call: `withdraw() [Frame ${attackCount}]`,
        caller: attackCount === 1 ? "Attacker" : "fallback()",
        target: "DAO Vault"
    });

    updateScreen();

    if (attackCount === 1) {
        playSound('warning');
        if (msg) msg.innerHTML = "⚠️ <strong>Step 1:</strong> DAO verifies 10 ETH balance & sends 10 ETH to Attacker. <em>CRUCIAL BUG:</em> Recorded balance has NOT been set to 0 yet!";
        if (stepBanner) stepBanner.innerHTML = `<span class="banner-step-num" style="background:#ef4444;">STEP 1</span><span class="banner-step-text">DAO sends 10 ETH. <strong>CRITICAL:</strong> Recorded balance is still 10 ETH!</span>`;
    } else if (attackCount === 2) {
        playSound('alarm');
        if (reenterArrow) reenterArrow.style.display = "block";
        if (msg) msg.innerHTML = "🔁 <strong>Step 2 — REENTRANCY TRIGGERED:</strong> Attacker's <code>fallback()</code> catches the 10 ETH and immediately re-enters <code>withdraw()</code>! The balance still shows 10 ETH!";
        if (stepBanner) stepBanner.innerHTML = `<span class="banner-step-num" style="background:#ef4444;">STEP 2 (RE-ENTER)</span><span class="banner-step-text">Attacker fallback catches ETH and calls withdraw() AGAIN before balance updates!</span>`;
    } else if (attackCount === 3) {
        playSound('alarm');
        attackerBalance = 0; // stack finally unwinds
        updateScreen();
        if (msg) msg.innerHTML = "💀 <strong>Step 3:</strong> Final re-entrant call empties the last 10 ETH from the vault. Total stolen: 30 ETH.";
        if (stepBanner) stepBanner.innerHTML = `<span class="banner-step-num" style="background:#dc2626;">💀 CONTRACT DRAINED</span><span class="banner-step-text">Contract vault: 0 ETH. Attacker received: 30 ETH! Call stack now unwinds.</span>`;
    }
}

function attackStepPatched() {
    stopAutoDao();
    attackCount++;
    const msg = document.getElementById("message");
    const stepBanner = document.getElementById("daoStepBanner");
    const reenterArrow = document.getElementById("reenterArrow");

    if (attackCount === 1) {
        playSound('warning');
        attackerBalance = 0; // EFFECT happens first!
        contractFunds -= 10;
        attackerReceived += 10;

        spawnCoinParticle("daoVaultCard", "daoAttackerCard", "🪙 +10 ETH (Legit)", "gold");

        daoCallStack = [
            { call: "withdraw()", caller: "Attacker", target: "DAO" }
        ];

        updateScreen();

        if (msg) msg.innerHTML = "🛡️ <strong>Step 1 (Patched):</strong> DAO checks balance (10 ETH) and immediately sets <code>balances[msg.sender] = 0</code> <em>BEFORE</em> sending the 10 ETH.";
        if (stepBanner) stepBanner.innerHTML = `<span class="banner-step-num" style="background:#10b981;">STEP 1 (CEI)</span><span class="banner-step-text">Balance updated to 0 ETH FIRST, then 10 ETH transferred.</span>`;
    } else {
        playSound('alarm');
        if (reenterArrow) reenterArrow.style.display = "block";
        if (msg) msg.innerHTML = "🛑 <strong>Step 2 — REENTRANCY DEFENSE ACTIVATED:</strong> Attacker's fallback tries to re-enter <code>withdraw()</code>, but <code>balances[msg.sender] == 0</code>! <br><span style='color:#34d399'>❌ SECOND WITHDRAWAL REJECTED: Zero Balance</span>. Exploit thwarted!";
        if (stepBanner) stepBanner.innerHTML = `<span class="banner-step-num" style="background:#10b981;">🛡️ BLOCKED</span><span class="banner-step-text">❌ SECOND WITHDRAWAL REJECTED: require(balance > 0) reverts!</span>`;

        setTimeout(() => {
            daoCallStack = [];
            renderCallStack();
            if (reenterArrow) reenterArrow.style.display = "none";
        }, 2000);
    }
}

function toggleAutoDaoAttack() {
    if (autoDaoInterval) {
        stopAutoDao();
    } else {
        playSound('click');
        const icon = document.getElementById("autoDaoIcon");
        const txt = document.getElementById("autoDaoText");
        if (icon) icon.innerText = "⏸️";
        if (txt) txt.innerText = "Pause Attack";
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
        const icon = document.getElementById("autoDaoIcon");
        const txt = document.getElementById("autoDaoText");
        if (icon) icon.innerText = "▶️";
        if (txt) txt.innerText = "Auto-Play Attack";
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

    const reenterArrow = document.getElementById("reenterArrow");
    if (reenterArrow) reenterArrow.style.display = "none";

    updateScreen();

    const msg = document.getElementById("message");
    if (msg) msg.innerText = "Demo reset. Ready to start demonstration.";

    const stepBanner = document.getElementById("daoStepBanner");
    if (stepBanner) {
        stepBanner.innerHTML = `<span class="banner-step-num">READY</span><span class="banner-step-text">Click "Start Reentrancy Attack" or "Next Attack Step" to begin.</span>`;
    }
}

// ==========================================================================
// SIMULATION 5: RONIN BRIDGE VALIDATOR MULTI-SIG HACK
// ==========================================================================

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
    if (!grid) return;
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
    const btnV = document.getElementById("roninModeVuln");
    const btnP = document.getElementById("roninModePatched");
    if (btnV && btnP) {
        btnV.classList.toggle("active", mode === 'vulnerable');
        btnP.classList.toggle("active", mode === 'patched');
    }

    const summaryBadge = document.getElementById("validatorSummaryBadge");
    const thresholdLabel = document.getElementById("roninThresholdLabel");

    if (mode === 'vulnerable') {
        activeValidators = JSON.parse(JSON.stringify(VULN_VALIDATORS));
        if (summaryBadge) summaryBadge.innerText = "9 Total Keys (4 Sky Mavis, 1 Axie DAO, 4 External)";
        if (thresholdLabel) thresholdLabel.innerText = "5 / 9 Required Approvals";
    } else {
        activeValidators = JSON.parse(JSON.stringify(PATCHED_VALIDATORS));
        if (summaryBadge) summaryBadge.innerText = "11 Independent Keys + 48h Timelock + On-Chain Circuit Breaker";
        if (thresholdLabel) thresholdLabel.innerText = "9 / 11 Required Approvals";
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
    const roninSigCount = document.getElementById("roninSigCount");
    const sigBar = document.getElementById("roninSigBar");
    const progressBar = document.getElementById("roninProgressBar");
    const stepInd = document.getElementById("roninStepIndicator");
    const door = document.getElementById("roninVaultDoor");
    const doorIcon = document.getElementById("roninDoorIcon");
    const doorText = document.getElementById("roninDoorStatusText");

    if (roninStep === 1) {
        playSound('warning');
        if (stepInd) stepInd.innerText = "Step 2 of 5";
        const hState = document.getElementById("roninHackerState");
        if (hState) {
            hState.className = "status-pill danger";
            hState.innerText = "🎣 Phishing Campaign Active";
        }
        if (consoleEl) {
            consoleEl.innerHTML = "🎣 <strong>Step 1: Spear Phishing PDF:</strong> Lazarus Group hackers pose as a recruiter on LinkedIn and send a malicious PDF fake job offer to a senior Sky Mavis engineer. The engineer's computer is compromised via spyware.";
        }
    } else if (roninStep === 2) {
        playSound('alarm');
        if (stepInd) stepInd.innerText = "Step 3 of 5";
        activeValidators[0].compromised = true;
        activeValidators[1].compromised = true;
        activeValidators[2].compromised = true;
        activeValidators[3].compromised = true;
        renderValidators();

        if (sigCount) sigCount.innerText = "4 / 5";
        if (roninSigCount) roninSigCount.innerText = "4";
        if (sigBar) sigBar.style.width = "80%";
        if (progressBar) progressBar.style.width = "44%";
        if (doorText) {
            doorText.innerText = "⚠️ 4 OF 5 KEYS TURNED! ALMOST OPEN!";
            doorText.style.color = "var(--accent-orange)";
        }

        if (consoleEl) {
            consoleEl.innerHTML = "🚨 <strong>Step 2: 4 Keys Extracted:</strong> The spyware steals private keys for Sky Mavis Validator Nodes 1, 2, 3, and 4! Attacker now holds 4 valid cryptographic keys.";
        }
    } else if (roninStep === 3) {
        playSound('alarm');
        if (stepInd) stepInd.innerText = "Step 4 of 5";
        activeValidators[4].compromised = true;
        renderValidators();

        if (sigCount) sigCount.innerText = "5 / 5";
        if (roninSigCount) roninSigCount.innerText = "5";
        if (sigBar) sigBar.style.width = "100%";
        if (progressBar) progressBar.style.width = "56%";

        if (door) door.classList.add("unlocked");
        if (doorIcon) {
            doorIcon.innerText = "🔓";
            doorIcon.classList.add("open");
        }
        if (doorText) {
            doorText.innerText = "🚨 5/9 THRESHOLD REACHED — VAULT UNLOCKED!";
            doorText.style.color = "var(--accent-red)";
        }

        if (consoleEl) {
            consoleEl.innerHTML = "⚡ <strong>Step 3: 5th Key via Stale RPC Whitelist:</strong> Axie DAO had previously whitelisted Sky Mavis RPC to sign transactions gas-free. Attacker uses this to turn the 5th key! 5/9 keys turned—authorization threshold reached!";
        }
    } else if (roninStep === 4) {
        playSound('warning');
        if (stepInd) stepInd.innerText = "Step 5 of 5";
        if (consoleEl) {
            consoleEl.innerHTML = "📝 <strong>Step 4: Forging Unauthorized Withdrawal:</strong> The attacker crafts a fraudulent withdrawal transaction for 173,600 ETH and 25.5M USDC, signed with all 5 stolen keys, and broadcasts it to the Ethereum bridge contract.";
        }
    } else if (roninStep === 5) {
        playSound('alarm');
        if (stepInd) stepInd.innerText = "Completed";

        spawnCoinParticle("roninVaultCard", "roninAttackerCard", "💵 $625,000,000 DRAINED", "red");

        const rBal = document.getElementById("roninVaultBalance");
        const rBar = document.getElementById("roninVaultBar");
        const rStat = document.getElementById("roninVaultStatus");
        const rLoot = document.getElementById("roninAttackerLoot");
        const rSub = document.getElementById("roninAttackerSub");
        const rState = document.getElementById("roninHackerState");

        if (rBal) rBal.innerText = "$0 USD";
        if (rBar) {
            rBar.style.width = "0%";
            rBar.classList.add("danger");
        }
        if (rStat) {
            rStat.innerText = "💀 CRITICAL: $625M STOLEN FROM BRIDGE!";
            rStat.style.color = "var(--accent-red)";
        }
        if (rLoot) rLoot.innerText = "$625,000,000";
        if (rSub) rSub.innerText = "173,600 ETH + 25.5M USDC";
        if (rState) rState.innerText = "💀 Bridge Drained ($625M)";

        if (consoleEl) {
            consoleEl.innerHTML = "💀 <strong>Step 5 — $625M HEIST COMPLETE:</strong> The Ethereum smart contract verified 5 valid keys were present and released 173,600 ETH + 25.5M USDC to the hacker! Unauthorized withdrawal accepted in this simplified model.";
        }
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
        if (stepInd) stepInd.innerText = "Step 2 of 3";
        if (consoleEl) {
            consoleEl.innerHTML = "🎣 <strong>Step 1: Phishing Attempt Launched:</strong> Hacker targets engineer, but validator keys are locked inside Hardware Security Modules (HSMs) and Multi-Party Computation (MPC).";
        }
    } else if (roninStep === 2) {
        playSound('warning');
        if (stepInd) stepInd.innerText = "Step 3 of 3";
        activeValidators[0].compromised = true;
        renderValidators();

        if (sigCount) sigCount.innerText = "1 / 9";
        if (sigBar) sigBar.style.width = "11%";
        if (consoleEl) {
            consoleEl.innerHTML = "🛑 <strong>Step 2: Quorum Failed:</strong> The bridge now requires 9 of 11 independent organizations (Google Cloud, Nansen, Animoca, etc.). Compromising one internal workstation leaves the hacker 8 keys short!";
        }
    } else if (roninStep === 3) {
        playSound('success');
        if (stepInd) stepInd.innerText = "Completed";
        if (consoleEl) {
            consoleEl.innerHTML = "🛡️ <strong>Step 3 — 48h Timelock & Circuit Breaker Triggered:</strong> Even if threshold were reached, any withdrawal over $100k triggers a timelock and anomaly alert, allowing operators to freeze the bridge before money leaves!";
        }
        stopAutoRonin();
    }
}

function toggleAutoRonin() {
    if (autoRoninInterval) {
        stopAutoRonin();
    } else {
        playSound('click');
        const icon = document.getElementById("autoRoninIcon");
        const txt = document.getElementById("autoRoninText");
        if (icon) icon.innerText = "⏸️";
        if (txt) txt.innerText = "Pause Attack";
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
        const icon = document.getElementById("autoRoninIcon");
        const txt = document.getElementById("autoRoninText");
        if (icon) icon.innerText = "▶️";
        if (txt) txt.innerText = "Auto-Play Attack";
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
    if (door) door.classList.remove("unlocked");
    if (doorIcon) {
        doorIcon.innerText = "🔒";
        doorIcon.classList.remove("open");
    }
    if (doorText) {
        doorText.innerText = "LOCKED & SECURED";
        doorText.style.color = "#38bdf8";
    }

    const rBal = document.getElementById("roninVaultBalance");
    const rBar = document.getElementById("roninVaultBar");
    const rStat = document.getElementById("roninVaultStatus");
    const rCount = document.getElementById("roninSignatureCount");
    const rSigCount = document.getElementById("roninSigCount");
    const rSigBar = document.getElementById("roninSigBar");
    const rProg = document.getElementById("roninProgressBar");
    const rLoot = document.getElementById("roninAttackerLoot");
    const rSub = document.getElementById("roninAttackerSub");
    const rState = document.getElementById("roninHackerState");
    const stepInd = document.getElementById("roninStepIndicator");
    const consoleEl = document.getElementById("roninConsole");

    if (rBal) rBal.innerText = "$625,000,000";
    if (rBar) {
        rBar.style.width = "100%";
        rBar.classList.remove("danger");
    }
    if (rStat) {
        rStat.innerText = "Status: All Bridge Reserves Intact";
        rStat.style.color = "var(--text-muted)";
    }
    if (rCount) rCount.innerText = roninMode === 'vulnerable' ? "0 / 5" : "0 / 9";
    if (rSigCount) rSigCount.innerText = "0";
    if (rSigBar) rSigBar.style.width = "0%";
    if (rProg) rProg.style.width = "0%";
    if (rLoot) rLoot.innerText = "$0 USD";
    if (rSub) rSub.innerText = "0 ETH / 0 USDC";
    if (rState) {
        rState.className = "status-pill safe";
        rState.innerText = "Idle / Scouting";
    }
    if (stepInd) stepInd.innerText = "Step 1 of " + (roninMode === 'vulnerable' ? "5" : "3");
    if (consoleEl) consoleEl.innerText = "Bridge is operating normally. Ready to simulate the validator compromise attack.";
}

// ==========================================================================
// SIMULATION 6: SMART CONTRACT BUGS (UNDERFLOW, ACCESS CONTROL & CEI)
// ==========================================================================

let currentSubBug = 'underflow'; // 'underflow', 'access', or 'cei'
let bugMode = 'vulnerable'; // 'vulnerable' or 'patched'

function switchSubBug(subBug) {
    playSound('click');
    currentSubBug = subBug;

    const bUnder = document.getElementById("btnSubBugUnderflow");
    const bAcc = document.getElementById("btnSubBugAccess");
    const bCEI = document.getElementById("btnSubBugCEI");

    if (bUnder) bUnder.classList.toggle("active", subBug === 'underflow');
    if (bAcc) bAcc.classList.toggle("active", subBug === 'access');
    if (bCEI) bCEI.classList.toggle("active", subBug === 'cei');

    const vUnder = document.getElementById("subBugUnderflowView");
    const vAcc = document.getElementById("subBugAccessView");
    const vCEI = document.getElementById("subBugCEIView");
    const modeCard = document.getElementById("bugDefenseModeCard");
    const termLogs = document.getElementById("bugTerminalLogs");
    const expGrid = document.getElementById("bugExplanationGrid");

    if (vUnder) vUnder.classList.toggle("hidden", subBug !== 'underflow');
    if (vAcc) vAcc.classList.toggle("hidden", subBug !== 'access');
    if (vCEI) vCEI.classList.toggle("hidden", subBug !== 'cei');

    if (subBug === 'cei') {
        if (modeCard) modeCard.style.display = "none";
        if (termLogs) termLogs.style.display = "none";
        if (expGrid) expGrid.style.display = "none";
    } else {
        if (modeCard) modeCard.style.display = "flex";
        if (termLogs) termLogs.style.display = "block";
        if (expGrid) expGrid.style.display = "grid";
        updateBugExplanations();
    }
}

function setBugMode(mode) {
    playSound('click');
    bugMode = mode;
    const btnV = document.getElementById("bugModeVuln");
    const btnP = document.getElementById("bugModePatched");
    if (btnV && btnP) {
        btnV.classList.toggle("active", mode === 'vulnerable');
        btnP.classList.toggle("active", mode === 'patched');
    }

    updateBugExplanations();
    if (currentSubBug === 'underflow') {
        resetUnderflowDemo();
    } else if (currentSubBug === 'access') {
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
            if (title) title.innerText = "💡 Why Does the Underflow Bug Happen?";
            if (text) text.innerHTML = "In programming, an unsigned 256-bit integer (<code>uint256</code>) cannot represent negative numbers. It can only store values between <code>0</code> and 2^256-1. When you subtract <code>1</code> from <code>0</code> without safety checks, the computer wraps backward to the maximum possible number—giving the attacker an astronomical fortune!";
            if (codeBadge) {
                codeBadge.className = "code-badge danger";
                codeBadge.innerText = "VULNERABLE (UNCHECKED ARITHMETIC)";
            }
            if (codeBox) {
                codeBox.innerHTML = `<code>// ❌ VULNERABLE: Pre-Solidity 0.8 unchecked subtraction!
function transfer(address to, uint256 amount) public {
    // BUG: If balances[msg.sender] is 0, (0 - 1) wraps to 2^256 - 1!
    balances[msg.sender] -= amount; 
    balances[to] += amount;
}</code>`;
            }
        } else {
            if (title) title.innerText = "🛡️ How Solidity 0.8+ & SafeMath Prevent Underflow";
            if (text) text.innerHTML = "Starting with Solidity 0.8.0, arithmetic operations include built-in overflow and underflow checks. If a calculation results in an underflow (like <code>0 - 1</code>), the EVM throws a <code>Panic(0x11)</code> and immediately rolls back the transaction!";
            if (codeBadge) {
                codeBadge.className = "code-badge safe";
                codeBadge.innerText = "SECURE (SOLIDITY 0.8+ BUILT-IN CHECK)";
            }
            if (codeBox) {
                codeBox.innerHTML = `<code>// 🛡️ SECURE: Solidity 0.8+ automatic checked arithmetic!
function transfer(address to, uint256 amount) public {
    // Automatically reverts with Panic(0x11) if amount > balances[msg.sender]!
    balances[msg.sender] -= amount; 
    balances[to] += amount;
}</code>`;
            }
        }
    } else if (currentSubBug === 'access') {
        if (bugMode === 'vulnerable') {
            if (title) title.innerText = "💡 Why Does Missing Access Control Happen?";
            if (text) text.innerHTML = "In smart contracts, all public functions can be called by ANY account on the blockchain unless explicitly restricted. When a developer writes a sensitive admin function like <code>changeOwner()</code> and forgets the <code>onlyOwner</code> modifier, anyone can take over the entire contract!";
            if (codeBadge) {
                codeBadge.className = "code-badge danger";
                codeBadge.innerText = "VULNERABLE (MISSING ONLYOWNER)";
            }
            if (codeBox) {
                codeBox.innerHTML = `<code>// ❌ VULNERABLE: Missing onlyOwner modifier!
function changeOwner(address _newOwner) public {
    // BUG: Anyone on the blockchain can call this and become owner!
    owner = _newOwner; 
}

function emergencyWithdrawAll() public {
    require(msg.sender == owner, "Not owner");
    payable(msg.sender).transfer(address(this).balance);
}</code>`;
            }
        } else {
            if (title) title.innerText = "🛡️ How OpenZeppelin Ownable Enforces Access Control";
            if (text) text.innerHTML = "By inheriting OpenZeppelin's <code>Ownable</code> pattern and applying the <code>onlyOwner</code> modifier, the contract verifies <code>require(msg.sender == owner)</code> before executing sensitive code. If an unauthorized caller tries to invoke it, the call reverts!";
            if (codeBadge) {
                codeBadge.className = "code-badge safe";
                codeBadge.innerText = "SECURE (PROTECTED BY ONLYOWNER)";
            }
            if (codeBox) {
                codeBox.innerHTML = `<code>// 🛡️ SECURE: Protected by OpenZeppelin Ownable!
function changeOwner(address _newOwner) public onlyOwner {
    // Only the current owner can pass this modifier!
    owner = _newOwner; 
}</code>`;
            }
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
        if (r1 && r2 && r3 && rEnd) {
            [r1, r2, r3, rEnd].forEach(r => r.classList.add("spinning"));
        }
        if (consoleEl) {
            consoleEl.innerHTML = "🧮 <strong>Underflow Triggered:</strong> Calculating <code>0 - 1</code> in uint256 without SafeMath...";
        }

        setTimeout(() => {
            if (r1 && r2 && r3 && rEnd) {
                [r1, r2, r3, rEnd].forEach(r => r.classList.remove("spinning"));
                r1.innerText = "1";
                r2.innerText = "1";
                r3.innerText = "5";
                rEnd.innerText = "5";
            }

            const maxUint = "115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,935";
            if (fullText) {
                fullText.innerText = maxUint + " Tokens (2^256 - 1)";
                fullText.style.color = "#f87171";
            }
            if (mathResult) {
                mathResult.innerText = "1.1579 × 10^77 (Max uint256)";
                mathResult.style.color = "#f87171";
            }
            if (statusPill) {
                statusPill.className = "status-pill danger";
                statusPill.innerText = "💀 CRITICAL UNDERFLOW: 2^256 - 1 TOKENS CREATED!";
            }

            spawnCoinParticle("odometerCard", "odometerCard", "🔢 1.15 × 10^77 FREE TOKENS", "gold");

            if (consoleEl) {
                consoleEl.innerHTML = `💀 <strong>ODOMETER WRAPPED AROUND:</strong> Because unsigned integers cannot store negative values, subtracting 1 from 0 wrapped all the way to 2^256 - 1. The attacker now has <strong>115 quadrillion vigintillion tokens</strong> created from thin air!`;
            }
        }, 600);

    } else {
        playSound('warning');
        if (mathResult) {
            mathResult.innerText = "🛑 REVERT: Panic(0x11)";
            mathResult.style.color = "#34d399";
        }
        if (statusPill) {
            statusPill.className = "status-pill safe";
            statusPill.innerText = "🛡️ DEFENDED: Underflow Blocked (Reverted)";
        }
        if (consoleEl) {
            consoleEl.innerHTML = `🛡️ <strong>TRANSACTION REVERTED:</strong> Solidity 0.8+ checked arithmetic detected that subtracting 1 from 0 would cause an underflow. It threw <code>Panic(0x11)</code> and rolled back all state changes. Balance remains 0. Safe!`;
        }
        playSound('success');
    }
}

function resetUnderflowDemo() {
    playSound('click');
    const r1 = document.getElementById("reel1");
    const r2 = document.getElementById("reel2");
    const r3 = document.getElementById("reel3");
    const rEnd = document.getElementById("reelEnd");
    const fullText = document.getElementById("odometerFullText");
    const statusPill = document.getElementById("odometerStatus");
    const mathResult = document.getElementById("mathResultText");
    const consoleEl = document.getElementById("bugConsole");

    if (r1) r1.innerText = "0";
    if (r2) r2.innerText = "0";
    if (r3) r3.innerText = "0";
    if (rEnd) rEnd.innerText = "0";
    if (fullText) {
        fullText.innerText = "0 Tokens";
        fullText.style.color = "var(--text-primary)";
    }
    if (mathResult) {
        mathResult.innerText = "0";
        mathResult.style.color = "var(--text-primary)";
    }
    if (statusPill) {
        statusPill.className = "status-pill safe";
        statusPill.innerText = "Balance Normal: 0 Tokens";
    }
    if (consoleEl) {
        consoleEl.innerText = "Odometer reset. Ready to test underflow math.";
    }
}

// Sub-Bug 2: Missing Access Control
function triggerClaimOwnership() {
    const consoleEl = document.getElementById("bugConsole");
    const ownerAddr = document.getElementById("ownerAddressText");
    const ownerDesc = document.getElementById("ownerDescText");
    const ownerStatus = document.getElementById("accessOwnerStatus");
    const btnDrain = document.getElementById("btnDrainAccessVault");

    if (bugMode === 'vulnerable') {
        playSound('alarm');
        if (ownerAddr) {
            ownerAddr.innerText = "0xHacker_Anonymous (ATTACKER)";
            ownerAddr.style.color = "#f87171";
        }
        if (ownerDesc) {
            ownerDesc.innerText = "⚠️ Contract Hijacked via changeOwner()";
            ownerDesc.style.color = "#f87171";
        }
        if (ownerStatus) {
            ownerStatus.className = "status-pill danger";
            ownerStatus.innerText = "💀 ROGUE OWNER TAKEOVER";
        }
        if (btnDrain) btnDrain.disabled = false;

        if (consoleEl) {
            consoleEl.innerHTML = "🚨 <strong>OWNERSHIP HIJACKED:</strong> Attacker invoked <code>changeOwner(0xHacker)</code>. Because the developer forgot the <code>onlyOwner</code> modifier, the contract blindly made the hacker the new admin! Now click Step 2 to drain the vault.";
        }
    } else {
        playSound('warning');
        if (consoleEl) {
            consoleEl.innerHTML = "🛡️ <strong>ACCESS DENIED:</strong> Attacker called <code>changeOwner(0xHacker)</code>, but the <code>onlyOwner</code> modifier checked <code>require(msg.sender == owner)</code>. Attacker is not deployer! Transaction reverted!";
        }
        playSound('success');
    }
}

function triggerDrainAccessVault() {
    playSound('alarm');
    const vBal = document.getElementById("accessVaultBalance");
    const vBar = document.getElementById("accessVaultBar");
    const aLoot = document.getElementById("accessAttackerLoot");
    const aStat = document.getElementById("accessAttackerStatus");
    const consoleEl = document.getElementById("bugConsole");

    spawnCoinParticle("accessOwnerCard", "accessAttackerCard", "💵 $10,000,000 DRAINED", "red");

    if (vBal) vBal.innerText = "$0 USD";
    if (vBar) {
        vBar.style.width = "0%";
        vBar.classList.add("danger");
    }
    if (aLoot) aLoot.innerText = "$10,000,000";
    if (aStat) {
        aStat.className = "status-pill danger";
        aStat.innerText = "💀 Loot Secured: $10,000,000";
    }

    if (consoleEl) {
        consoleEl.innerHTML = "💀 <strong>TREASURY DRAINED:</strong> As the new unauthorized owner, the hacker invoked <code>emergencyWithdrawAll()</code> and stole all $10,000,000! Always enforce strict access control modifiers.";
    }
}

function resetAccessDemo() {
    playSound('click');
    const vBal = document.getElementById("accessVaultBalance");
    const vBar = document.getElementById("accessVaultBar");
    const ownerAddr = document.getElementById("ownerAddressText");
    const ownerDesc = document.getElementById("ownerDescText");
    const ownerStatus = document.getElementById("accessOwnerStatus");
    const aLoot = document.getElementById("accessAttackerLoot");
    const aStat = document.getElementById("accessAttackerStatus");
    const btnDrain = document.getElementById("btnDrainAccessVault");
    const consoleEl = document.getElementById("bugConsole");

    if (vBal) vBal.innerText = "$10,000,000";
    if (vBar) {
        vBar.style.width = "100%";
        vBar.classList.remove("danger");
    }
    if (ownerAddr) {
        ownerAddr.innerText = "0xAdmin_Creator (Deployer)";
        ownerAddr.style.color = "var(--text-primary)";
    }
    if (ownerDesc) {
        ownerDesc.innerText = "Authorized Administrator";
        ownerDesc.style.color = "var(--text-muted)";
    }
    if (ownerStatus) {
        ownerStatus.className = "status-pill safe";
        ownerStatus.innerText = "Legitimate Owner In Control";
    }
    if (aLoot) aLoot.innerText = "$0";
    if (aStat) {
        aStat.className = "status-pill safe";
        aStat.innerText = "Regular Guest (Zero Privileges)";
    }
    if (btnDrain) btnDrain.disabled = true;

    if (consoleEl) {
        consoleEl.innerText = "Access control demo reset. Authorized admin in control.";
    }
}

// Sub-Bug 3: Dual Side-by-Side CEI Comparison
function runDualAttackSim() {
    playSound('warning');
    const vulnOut = document.getElementById("vulnOutputBox");
    const vulnText = document.getElementById("vulnSimText");
    const safeOut = document.getElementById("safeOutputBox");
    const safeText = document.getElementById("safeSimText");

    if (vulnOut && vulnText) {
        vulnOut.style.animation = "pulseBorder 1s infinite";
        vulnText.innerHTML = `<strong>💀 EXPLOIT SUCCEEDS:</strong> Attacker's fallback receives payment, interrupts execution before balance is updated, and re-invokes <code>withdraw()</code>. Vault is completely emptied!`;
    }

    if (safeOut && safeText) {
        safeText.innerHTML = `<strong>🛡️ EXPLOIT PREVENTED:</strong> Storage balance was decremented to 0 BEFORE the transfer. The recursive call hits <code>require(balances > 0)</code> and reverts! Plus, <code>nonReentrant</code> mutex prevents re-entry.`;
    }

    setTimeout(() => {
        playSound('alarm');
    }, 400);

    setTimeout(() => {
        playSound('success');
    }, 1000);
}

function resetDualAttackSim() {
    playSound('click');
    const vulnOut = document.getElementById("vulnOutputBox");
    const vulnText = document.getElementById("vulnSimText");
    const safeText = document.getElementById("safeSimText");

    if (vulnOut) vulnOut.style.animation = "none";
    if (vulnText) vulnText.innerHTML = "External fallback calls <code>withdraw()</code> recursively. Vault is drained!";
    if (safeText) safeText.innerHTML = "Balance is already 0. Reentrant call triggers <code>require()</code> revert!";
}

// ==========================================================================
// CLASSROOM QUICK QUIZ
// ==========================================================================

const quizAnswers = {
    1: {
        correct: 1,
        explanation: "Correct! A 51% attacker can attempt chain reorganizations (reversing recent transfers) and censor transactions. They CANNOT steal other users' private keys or forge arbitrary signatures."
    },
    2: {
        correct: 2,
        explanation: "Correct! Proof-of-Work links voting weight to scarce physical energy and computation. Creating 10,000 virtual accounts gives you zero extra power unless you supply real electricity and hardware."
    },
    3: {
        correct: 1,
        explanation: "Correct! Distributed consensus and UTXO/account validation order transactions deterministically, confirming only the first valid transaction into a block and rejecting conflicts."
    },
    4: {
        correct: 1,
        explanation: "Correct! Checks-Effects-Interactions (CEI) ensures parameter validations (Checks) happen first, state/storage mutations (Effects) happen second, and external contract calls (Interactions) occur last."
    },
    5: {
        correct: 2,
        explanation: "Correct! On-chain, the transaction was mathematically authentic because 5 legitimate ECDSA private keys signed it (satisfying the 5/9 multi-sig threshold). The contract had no way of knowing the keys were stolen off-chain."
    },
    6: {
        correct: 0,
        explanation: "Correct! Solidity 0.8+ introduced built-in checked arithmetic that throws a Panic(0x11) exception and reverts the entire transaction whenever an arithmetic overflow or underflow is encountered."
    }
};

let userQuizScores = {};

function answerQuiz(qNum, optionIdx) {
    const card = document.getElementById(`quizCard${qNum}`);
    const feedback = document.getElementById(`qFeedback${qNum}`);
    if (!card || !feedback) return;

    const qData = quizAnswers[qNum];
    const isCorrect = optionIdx === qData.correct;

    const buttons = card.querySelectorAll(".quiz-opt");
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === qData.correct) {
            btn.classList.add("correct");
        } else if (idx === optionIdx && !isCorrect) {
            btn.classList.add("wrong");
        }
    });

    feedback.classList.remove("hidden");
    if (isCorrect) {
        playSound('success');
        feedback.className = "quiz-feedback correct";
        feedback.innerHTML = `<strong>✓ Correct!</strong> ${qData.explanation}`;
        userQuizScores[qNum] = true;
    } else {
        playSound('warning');
        feedback.className = "quiz-feedback wrong";
        feedback.innerHTML = `<strong>✗ Incorrect.</strong> ${qData.explanation}`;
        userQuizScores[qNum] = false;
    }

    updateQuizScore();
}

function updateQuizScore() {
    const scoreEl = document.getElementById("quizScore");
    if (!scoreEl) return;
    let count = 0;
    for (let k in userQuizScores) {
        if (userQuizScores[k] === true) count++;
    }
    scoreEl.innerText = count;
}

function resetAllQuizzes() {
    playSound('click');
    userQuizScores = {};
    for (let i = 1; i <= 6; i++) {
        const card = document.getElementById(`quizCard${i}`);
        const feedback = document.getElementById(`qFeedback${i}`);
        if (card) {
            const buttons = card.querySelectorAll(".quiz-opt");
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove("correct", "wrong");
            });
        }
        if (feedback) {
            feedback.classList.add("hidden");
            feedback.innerHTML = "";
        }
    }
    updateQuizScore();
}

// ==========================================================================
// INITIALIZATION ON PAGE LOAD
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initial renders & state setup
    resetFiftyOneDemo(false);
    resetSybilDemo(false);
    resetDsDemo(false);
    renderValidators();
    updateScreen();

    // Keyboard shortcuts for presenters
    document.addEventListener("keydown", (e) => {
        if (e.key === "p" || e.key === "P") {
            togglePresentationMode();
        } else if (e.key === "s" || e.key === "S") {
            toggleSpeakerNotes();
        } else if (e.key === "ArrowRight") {
            presNextStep();
        } else if (e.key === "ArrowLeft") {
            presPrevStep();
        }
    });
});
