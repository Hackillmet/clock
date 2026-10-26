
const getElement = (selector) => document.querySelector(selector);

const clamp = (value, min = 0, max = 1) => {
    return Math.max(min, Math.min(max, value));
};

const easeInOutCubic = (progress) => {
    if (progress < 0.5) {
        return 4 * progress * progress * progress;
    }

    return 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const createGearPath = (teethCount, outerRadius, innerRadius, holeCount) => {
    let path = "";
    const toothAngle = (2 * Math.PI) / teethCount;

    for (let tooth = 0; tooth < teethCount; tooth++) {
        const angle = tooth * toothAngle;

        const points = [
            [angle - toothAngle * 0.27, innerRadius],
            [angle - toothAngle * 0.15, outerRadius],
            [angle + toothAngle * 0.15, outerRadius],
            [angle + toothAngle * 0.27, innerRadius]
        ];

        points.forEach(([pointAngle, radius], index) => {
            const command = tooth === 0 && index === 0 ? "M" : "L";
            const x = (Math.cos(pointAngle) * radius).toFixed(1);
            const y = (Math.sin(pointAngle) * radius).toFixed(1);

            path += `${command}${x} ${y}`;
        });
    }

    path += "Z";

    const createCirclePath = (x, y, radius) => {
        return `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0Z`;
    };

    path += createCirclePath(0, 0, innerRadius * 0.14);

    for (let hole = 0; hole < holeCount; hole++) {
        const angle = (hole * 2 * Math.PI) / holeCount;
        const x = Math.cos(angle) * innerRadius * 0.58;
        const y = Math.sin(angle) * innerRadius * 0.58;

        path += createCirclePath(x, y, innerRadius * 0.2);
    }

    return path;
};

const createSpiralPath = (startRadius, endRadius, turns) => {
    let path = "";
    const totalAngle = turns * 2 * Math.PI;

    for (let angle = 0; angle <= totalAngle; angle += 0.15) {
        const progress = angle / totalAngle;
        const radius = startRadius + (endRadius - startRadius) * progress;
        const x = (Math.cos(angle) * radius).toFixed(1);
        const y = (Math.sin(angle) * radius).toFixed(1);

        path += `${angle === 0 ? "M" : "L"}${x} ${y}`;
    }

    return path;
};

const renderCaseBack = () => {
    let caseBackMarkup = `
        <circle r="140" fill="url(#steel)"/>
        <circle r="133" fill="none" stroke="#000" stroke-opacity=".3"/>
        <circle r="86" fill="#5f6a65"/>
        <circle r="86" fill="none" stroke="#fff" stroke-opacity=".3"/>
        <path id="tp" d="M-112 0a112 112 0 1 1 224 0a112 112 0 1 1 -224 0" fill="none"/>
        <text font-size="9" letter-spacing="2.6" fill="#000" fill-opacity=".55" font-family="Cormorant Garamond,serif">
            <textPath href="#tp">AUREL · MANUFACTURE · CALIBRE 01 · AUTOMATIC · 72H · WATER RESISTANT 50 M ·</textPath>
        </text>
    `;

    for (let screw = 0; screw < 8; screw++) {
        const angle = screw * Math.PI / 4 + 0.4;
        const x = Math.cos(angle) * 124;
        const y = Math.sin(angle) * 124;

        caseBackMarkup += `
            <g transform="translate(${x} ${y}) rotate(${screw * 45})">
                <circle r="5" fill="#9aa39e"/>
                <path d="M-4 0H4" stroke="#222" stroke-width="1.4"/>
            </g>
        `;
    }

    caseBackMarkup += `
        <text y="6" text-anchor="middle" font-size="26" fill="#000" fill-opacity=".5"
            font-style="italic" font-family="Cormorant Garamond,serif">Aurel</text>
    `;

    getElement("#sBack").innerHTML = caseBackMarkup;
};

const renderMainspring = () => {
    getElement("#sSpring").innerHTML = `
        <circle r="128" fill="#0f1a15" fill-opacity=".9" stroke="#fff" stroke-opacity=".12"/>
        <g class="sp">
            <path d="${createGearPath(64, 78, 72, 0)}" fill="url(#steel)" fill-rule="evenodd"/>
            <circle r="66" fill="#142019"/>
            <path d="${createSpiralPath(7, 62, 7)}" fill="none" stroke="#3b6ab5" stroke-width="2.6"/>
        </g>
        <circle r="8" fill="url(#gold)"/>
        <circle r="3" fill="#7a1420"/>
    `;
};

const renderGears = () => {
    const gears = [
        { x: -30, y: 10, teeth: 40, outer: 66, inner: 59, holes: 6, direction: 1 },
        { x: 62, y: -34, teeth: 24, outer: 40, inner: 34, holes: 5, direction: -1 },
        { x: 52, y: 52, teeth: 18, outer: 31, inner: 25, holes: 4, direction: -1 }
    ];

    let gearMarkup = `
        <circle r="138" fill="url(#plateg)"/>
        <circle r="138" fill="url(#perl)"/>
        <circle r="138" fill="none" stroke="#fff" stroke-opacity=".15"/>
    `;

    gears.forEach((gear) => {
        gearMarkup += `
            <g transform="translate(${gear.x} ${gear.y})">
                <g class="rot" data-n="${gear.teeth}" data-d="${gear.direction}">
                    <path d="${createGearPath(gear.teeth, gear.outer, gear.inner, gear.holes)}"
                        fill="url(#steel)" fill-rule="evenodd"
                        stroke="#000" stroke-opacity=".35" stroke-width=".6"/>
                </g>
                <circle r="4" fill="#9c1d2c"/>
                <circle r="4" fill="none" stroke="#e8c27a"/>
            </g>
        `;
    });

    gearMarkup += `
        <g transform="translate(-90 -66)">
            <g class="bal">
                <circle r="26" fill="none" stroke="url(#gold)" stroke-width="4"/>
                <path d="M-26 0H26M0-26V26" stroke="#c9a864" stroke-width="2"/>
                <path d="${createSpiralPath(3, 19, 5)}" fill="none" stroke="#ecd9a2" stroke-width=".9"/>
            </g>
            <circle r="3.5" fill="#9c1d2c"/>
        </g>
    `;

    getElement("#sGears").innerHTML = gearMarkup;
};

const renderCaseRing = () => {
    getElement("#sRing").innerHTML = `
        <path fill-rule="evenodd" fill="url(#steel)"
            d="M-150 0a150 150 0 1 0 300 0a150 150 0 1 0 -300 0ZM-126 0a126 126 0 1 0 252 0a126 126 0 1 0 -252 0Z"/>
        <circle r="138" fill="none" stroke="#fff" stroke-opacity=".28"/>
        <circle r="126" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.5"/>
        <clipPath id="cc">
            <rect x="146" y="-13" width="24" height="26" rx="5"/>
        </clipPath>
        <rect x="146" y="-13" width="24" height="26" rx="5" fill="url(#steel)"/>
        <g clip-path="url(#cc)">
            <path id="cg"
                d="M146-17h24M146-13h24M146-9h24M146-5h24M146-1h24M146 3h24M146 7h24M146 11h24M146 15h24M146 19h24"
                stroke="#000" stroke-opacity=".4" stroke-width="1.4"/>
        </g>
    `;
};

const renderDial = () => {
    let dialMarkup = `
        <circle r="127" fill="url(#dialg)"/>
        <circle r="127" fill="none" stroke="#000" stroke-opacity=".4"/>
    `;

    for (let mark = 0; mark < 90; mark++) {
        dialMarkup += `
            <path transform="rotate(${mark * 4})" d="M0 0V-127"
                stroke="#fff" stroke-opacity="${mark % 2 ? 0.2 : 0}" stroke-width="2.2"/>
        `;
    }

    for (let mark = 0; mark < 60; mark++) {
        const length = mark % 5 ? -117 : -113;
        const width = mark % 5 ? 0.7 : 1.6;

        dialMarkup += `
            <path transform="rotate(${mark * 6})" d="M0-122V${length}"
                stroke="#2b3430" stroke-width="${width}"/>
        `;
    }

    for (let hour = 1; hour <= 12; hour++) {
        const angle = hour * Math.PI / 6;
        const x = (Math.sin(angle) * 91).toFixed(1);
        const y = (-Math.cos(angle) * 91).toFixed(1);

        dialMarkup += `
            <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
                font-size="22" font-weight="500" fill="#1b2420"
                font-family="Cormorant Garamond,Georgia,serif">${hour}</text>
        `;
    }

    dialMarkup += `
        <text y="-52" text-anchor="middle" font-size="19" font-style="italic"
            fill="#1b2420" font-family="Cormorant Garamond,serif">Aurel</text>
        <text y="-40" text-anchor="middle" font-size="5.4" letter-spacing="2"
            fill="#4a5550" font-family="Hanken Grotesk,sans-serif">CALIBRE 01</text>
        <text y="70" text-anchor="middle" font-size="5.4" letter-spacing="2"
            fill="#4a5550" font-family="Hanken Grotesk,sans-serif">AUTOMATIC · 72H</text>
        <circle cy="34" r="17" fill="none" stroke="#2b3430" stroke-opacity=".55"/>
    `;

    getElement("#sDial").innerHTML = dialMarkup;
};

const renderHands = () => {
    getElement("#sHands").innerHTML = `
        <g id="hh">
            <path d="M-4.5 10L0-66L4.5 10Z" fill="#24407a" stroke="#0e1a33" stroke-width=".6"/>
        </g>
        <g id="hm">
            <path d="M-3.2 14L0-104L3.2 14Z" fill="#24407a" stroke="#0e1a33" stroke-width=".6"/>
        </g>
        <g id="hs" transform="translate(0 34)">
            <g id="hs2">
                <path d="M0 4V-14" stroke="#24407a" stroke-width="1"/>
            </g>
        </g>
        <g id="hsec">
            <path d="M0 24V-112" stroke="#b3262e" stroke-width="1.2"/>
            <circle cy="20" r="3.6" fill="#b3262e"/>
        </g>
        <circle r="6" fill="url(#steel)" stroke="#0e1a33" stroke-width=".5"/>
        <circle r="2" fill="#b3262e"/>
    `;
};

const renderGlass = () => {
    getElement("#sGlass").innerHTML = `
        <circle r="132" fill="url(#glassg)" stroke="#fff" stroke-opacity=".4" stroke-width="1.5"/>
        <g id="shn">
            <path d="M-98-68A122 122 0 0 1 38-118A150 150 0 0 0-98-68Z" fill="url(#shine)"/>
            <path d="M70 96A126 126 0 0 0 112 52A130 130 0 0 1 70 96Z" fill="#fff" fill-opacity=".22"/>
        </g>
    `;
};

const renderStraps = () => {
    getElement("#sStrapT").innerHTML = `
        <path d="M-70 -100L70 -100L60 -262Q0 -274 -60 -262Z" fill="url(#leather)"/>
        <path d="M-58 -106L58 -106L51 -254Q0 -264 -51 -254Z"
            fill="none" stroke="#e3c98f" stroke-opacity=".7"
            stroke-width="1.2" stroke-dasharray="5 4"/>
        <rect x="-58" y="-250" width="116" height="24" rx="4"
            fill="none" stroke="url(#steel)" stroke-width="5"/>
        <rect x="-3" y="-254" width="6" height="32" rx="2" fill="url(#steel)"/>
    `;

    let lowerStrapMarkup = `
        <path d="M-70 100L70 100L60 262Q0 274 -60 262Z" fill="url(#leather)"/>
        <path d="M-58 106L58 106L51 254Q0 264 -51 254Z"
            fill="none" stroke="#e3c98f" stroke-opacity=".7"
            stroke-width="1.2" stroke-dasharray="5 4"/>
        <rect x="-66" y="130" width="132" height="12"
            fill="#2a190e" stroke="#e3c98f" stroke-opacity=".5"/>
    `;

    for (let hole = 0; hole < 5; hole++) {
        lowerStrapMarkup += `
            <circle cy="${166 + hole * 20}" r="4"
                fill="#160c06" stroke="#c9a864" stroke-opacity=".7"/>
        `;
    }

    getElement("#sStrapB").innerHTML = lowerStrapMarkup;
};

const renderBackgroundGear = () => {
    getElement("#bgp").setAttribute("d", createGearPath(48, 98, 88, 8));
};

const watchParts = [
    {
        layer: "glass",
        title: "Сапфировое стекло",
        description: "Синтетический сапфир толщиной 2,2 мм с антибликовым слоем. По твёрдости уступает только алмазу, поэтому циферблат остаётся чистым годами."
    },
    {
        layer: "dial",
        title: "Циферблат и стрелки",
        description: "Серебристый циферблат с лучевой отделкой, арабские цифры и стрелки из синеной стали. Секундная стрелка идёт плавно, без остановок."
    },
    {
        layer: "ring",
        title: "Корпус",
        description: "Сталь с родиевым покрытием, диаметр 40 мм. Полировка и сатинирование вручную, одиннадцать операций на каждый корпус."
    },
    {
        layer: "gears",
        title: "Колёсная передача",
        description: "Колёса, анкер и баланс на рубиновых камнях. Баланс делает 28 800 полуколебаний в час и задаёт точность хода."
    },
    {
        layer: "spring",
        title: "Заводная пружина",
        description: "Барабан хранит энергию на 72 часа. Спираль из закалённой стали длиной больше тридцати сантиметров."
    },
    {
        layer: "back",
        title: "Задняя крышка",
        description: "Крышка на восьми винтах с гравировкой мастерской. Часы выдерживают давление на глубине 50 метров."
    },
    {
        layer: "strap",
        title: "Ремешок",
        description: "Итальянская кожа, прошивка вручную и застёжка из стали. Ремешок снимается без инструментов за пару секунд."
    }
];

const renderWatch = () => {
    renderCaseBack();
    renderMainspring();
    renderGears();
    renderCaseRing();
    renderDial();
    renderHands();
    renderGlass();
    renderStraps();
    renderBackgroundGear();
};

const renderCaptions = () => {
    const captionList = getElement("#capList");

    captionList.innerHTML = watchParts
        .map((part) => `<li>${part.title}</li>`)
        .join("");
};

const updateCaption = (partIndex, captionItems, watchLayers) => {
    captionItems.forEach((item, index) => {
        item.classList.toggle("on", index === partIndex);
    });

    watchLayers.forEach((layer) => {
        const shouldDim = partIndex !== -1 && layer.dataset.g !== watchParts[partIndex].layer;
        layer.classList.toggle("dim", shouldDim);
    });

    if (partIndex !== -1) {
        getElement("#capT").textContent = watchParts[partIndex].title;
        getElement("#capD").textContent = watchParts[partIndex].description;
    }
};

const updateWatchHands = (time) => {
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = time.getHours() % 12 + minutes / 60;

    getElement("#hh").style.transform = `rotate(${hours * 30}deg)`;
    getElement("#hm").style.transform = `rotate(${minutes * 6}deg)`;
    getElement("#hsec").style.transform = `rotate(${seconds * 6}deg)`;
};

const updateMovingParts = (scrollPosition, animationTime, state, root) => {
    state.wind *= 0.985;
    state.windingAngle += state.wind * 16;

    state.mouseX += (state.targetMouseX - state.mouseX) * 0.06;
    state.mouseY += (state.targetMouseY - state.mouseY) * 0.06;

    root.style.setProperty("--mx", state.mouseX.toFixed(3));
    root.style.setProperty("--my", state.mouseY.toFixed(3));

    document.querySelectorAll(".rot").forEach((gear) => {
        const direction = Number(gear.dataset.d);
        const teeth = Number(gear.dataset.n);
        const rotation = (scrollPosition * 0.22 + animationTime * 6 + state.windingAngle) * direction * 40 / teeth;

        gear.style.transform = `rotate(${rotation}deg)`;
    });

    getElement(".sp").style.transform = `rotate(${scrollPosition * 0.06 - state.windingAngle * 0.5}deg)`;

    const balanceRotation = Math.sin(animationTime * 5 * Math.PI) * (110 + state.wind * 70);
    getElement(".bal").style.transform = `rotate(${balanceRotation}deg)`;

    getElement("#cg").style.transform = `translateY(${(state.windingAngle * 0.08) % 4}px)`;

    getElement("#shn").style.transform = `translate(${state.mouseX * -22}px, ${state.mouseY * -14}px)`;

    getElement("#bgr").style.transform = `rotate(${scrollPosition * 0.04}deg)`;
};

const startWatchAnimation = () => {
    const root = document.documentElement;
    const scene = getElement("#scene");
    const caption = getElement("#cap");
    const hero = getElement("#hero");
    const captionItems = [...getElement("#capList").children];
    const watchLayers = [...document.querySelectorAll(".layer")];

    const animationState = {
        lastPartIndex: -2,
        wind: 0,
        windingAngle: 0,
        mouseX: 0,
        mouseY: 0,
        targetMouseX: 0,
        targetMouseY: 0
    };

    const updateFrame = () => {
        const sceneTop = scene.offsetTop;
        const scrollRange = Math.max(1, scene.offsetHeight - window.innerHeight);
        const progress = clamp((window.scrollY - sceneTop) / scrollRange);

        const disassemblyProgress = progress < 0.1
            ? 0
            : progress < 0.34
                ? easeInOutCubic((progress - 0.1) / 0.24)
                : progress < 0.66
                    ? 1
                    : progress < 0.9
                        ? 1 - easeInOutCubic((progress - 0.66) / 0.24)
                        : 0;

        root.style.setProperty("--e", disassemblyProgress.toFixed(4));
        root.style.setProperty("--p", progress.toFixed(4));
        root.style.setProperty("--rz", (disassemblyProgress * (progress - 0.5) * 60).toFixed(2));

        const partIndex = disassemblyProgress > 0.96
            ? Math.min(6, Math.floor(clamp((progress - 0.34) / 0.32) * 7))
            : -1;

        if (partIndex !== animationState.lastPartIndex) {
            animationState.lastPartIndex = partIndex;
            updateCaption(partIndex, captionItems, watchLayers);
        }

        caption.style.opacity = disassemblyProgress > 0.5 ? 1 : 0;
        hero.style.opacity = progress < 0.07 ? 1 : 0;
        hero.style.pointerEvents = progress < 0.07 ? "auto" : "none";

        const currentTime = new Date();
        const animationTime = performance.now() / 1000;

        updateWatchHands(currentTime);

        updateMovingParts(
            window.scrollY,
            animationTime,
            animationState,
            root
        );

        requestAnimationFrame(updateFrame);
    };

    requestAnimationFrame(updateFrame);

    window.addEventListener("load", () => {
        setTimeout(() => document.body.classList.add("ready"), 700);
    });

    setTimeout(() => document.body.classList.add("ready"), 2500);

    getElement("#wind").addEventListener("click", () => {
        animationState.wind = 1;
    });

    getElement("#stage").addEventListener("click", () => {
        animationState.wind = 1;
    });

    window.addEventListener("pointermove", (event) => {
        animationState.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        animationState.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    getElement("#f").addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = getElement("#em");
        const statusMessage = getElement("#ok");

        statusMessage.textContent = `Спасибо. Мы напишем на ${emailInput.value} в течение дня.`;

        event.target.reset();
    });
};

renderWatch();
renderCaptions();
startWatchAnimation();
