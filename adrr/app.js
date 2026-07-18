    const brands = ["Tạp Hóa", "Shop", "Cửa Hàng", "Đại Lý", "Salon", "Quán Ăn", "Tiệm Điện Thoại", "Điện Máy", "Tiệm Bánh", "Cửa Tiệm", "MiniMart"];
    const namesDict = ["Lan", "Hùng", "Mai", "Tuấn", "Thanh", "Vinh", "Mỹ", "Phượng", "Đức", "Khánh", "An", "Thịnh", "Vy", "Hà", "Linh"];
    const shopSuffixes = ["Shop", "Online Shop", "Store", "Official", "Express", "ExpressVN", "Delivery", "Market", "Trading", "Center", "Plus", "Pro", "Max", "Mini", "Home", "Family", "House", "Group", "Team", "Club", "VIP", "9x", "8x", "GenZ", "One", "New", "Best", "Fast", "Smart", "Star", "City", "VN", "SG", "HN", "Local", "PlusVN"];

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function showToast(msg) {
        let t = document.getElementById("toast");
        t.innerText = msg;
        t.style.display = "block";
        clearTimeout(t._timer);
        t._timer = setTimeout(() => { t.style.display = "none"; }, 1500);
    }

    function insertInvisibleBypass(str) {
        if (!str) return '';
        const invisibleChars = ['\u200C', '\u200D', '\u2060'];
        return Array.from(str).map(char => {
            return char + (Math.random() > 0.4 ? getRandom(invisibleChars) : '');
        }).join('');
    }

    const numToVietnameseText = {
        '0': 'Không', '1': 'Một', '2': 'Hai', '3': 'Ba', '4': 'Bốn',
        '5': 'Năm', '6': 'Sáu', '7': 'Bảy', '8': 'Tám', '9': 'Chín'
    };

    function generateSuperBypassPhone(srcPhone) {
        let clean = srcPhone.replace(/\D/g, '');
        if (clean.length < 9) return srcPhone;

        let s1 = clean.slice(0, 4);
        let s2 = clean.slice(4, 7);
        let s3 = clean.slice(7);

        // Đổi số 0 đầu tiên thành chữ 'o' hoặc 'O' (Homoglyph) hoặc giữ nguyên
        let homoglyphZero = clean.replace(/^0/, getRandom(['o', 'O', '0']));
        let h1 = homoglyphZero.slice(0, 4);
        let h2 = homoglyphZero.slice(4, 7);
        let h3 = homoglyphZero.slice(7);

        let styles = [
            `${s1}.${s2}.${s3}`,
            `${h1}.${h2}.${h3}`,
            `o${clean.substring(1,4)} ${s2} ${s3}`,
            `${s1} ${s2} ${s3.substring(0,2)}` + (numToVietnameseText[s3.substring(2)] || ''),
            `${s1}_${s2}_${s3}`,
            `${h1} ${h2} ${h3}`,
            `0${clean.substring(1,4)}.${s2}.${s3}`,
            `${s1} ${s2}.${s3}`,
            `${h1} ${s2} ${h3.substring(0,2)}` + (numToVietnameseText[s3.substring(2)] || '')
        ];

        let result = getRandom(styles);
        return result;
    }

    function reverseAndTweakAddress(srcAddr) {
        let addr = (srcAddr || '').trim();
        if (!addr) return '';

        let parts = addr.split(',').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length === 0) return '';

        let streetPart = parts[0]; 
        let houseNum = '';
        let streetName = streetPart;

        let numRegex = /^(\d+[\w]*\/\d+[\w]*|\d+[A-Za-z]?)\s+(.+)$/i;
        if (numRegex.test(streetPart)) {
            let match = streetPart.match(numRegex);
            houseNum = match[1]; 
            streetName = match[2]; 
        }

        let adminParts = parts.slice(1); 
        let reversedAdminParts = [...adminParts].reverse(); 
        let variants = [];

        variants.push([streetPart, ...reversedAdminParts].join(', '));

        if (houseNum) {
            variants.push([streetName, ...reversedAdminParts, houseNum].join(', '));
            variants.push([streetName, houseNum, ...reversedAdminParts].join(', '));

            let streetWords = streetName.split(' ').filter(w => w.length > 0);
            if (streetWords.length > 1) {
                let lastWord = streetWords.pop(); 
                variants.push([lastWord, ...reversedAdminParts, `(${houseNum})`].join(', '));
            } else {
                variants.push([streetName, ...reversedAdminParts, `(${houseNum})`].join(', '));
            }
        } else {
            let roll = Math.random();
            if (roll < 0.5 && parts.length > 1) {
                variants.push([...adminParts, streetPart].join(', ')); 
            } else {
                variants.push(parts.reverse().join(', '));
            }
        }

        let finalAddr = getRandom(variants);

        if (document.getElementById("opt_shopee_bypass").checked) {
            finalAddr = insertInvisibleBypass(finalAddr);
        }

        return finalAddr;
    }

    function generateTweakedName(name, cleanParts) {
        if (!name) return "";
        let words = name.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return "";

        let firstName = words[words.length - 1];
        let lastName = words[0];
        let midName = words.slice(1, words.length - 1).join(' ');

        let s1 = cleanParts.s1;
        let pFull = cleanParts.full;

        // Tạo biến thể tên đệm ngẫu nhiên, không bị lặp code cũ
        let suffix = getRandom(shopSuffixes);
        
        // Chỉ lặp lại ký tự cuối 1 lần, xác suất 50/50 để tránh trùng lặp "Quangg" quá nhiều
        let doubleFirstChar = Math.random() > 0.5 ? firstName + firstName[firstName.length - 1] : firstName;
        
        let nameVariants = [
            `${firstName} ${suffix}`,
            `${firstName} ${lastName} ${suffix}`,
            `${lastName} ${doubleFirstChar}`,
            `${doubleFirstChar} ${midName ? midName : ''}`.trim(),
            `${firstName} (${s1.substring(1)}...)`,
            `${firstName} (${pFull})`,
            `Anh ${firstName} (${s1})`,
            `Chị ${firstName} ${suffix}`,
            `${suffix} ${firstName}`,
            `${firstName} ${getRandom(shopSuffixes)} ${Math.floor(Math.random() * 90 + 10)}` // Ex: Quang Shop 45
        ];

        let result = getRandom(nameVariants);
        if (document.getElementById("opt_shopee_bypass").checked) {
            result = insertInvisibleBypass(result);
        }
        return result;
    }

    function buildFullNoteStructure(tweakedPhone) {
        let templates = [
`[Gọi ngay ${tweakedPhone}]`,
`[Alô ${tweakedPhone}]`,
`(L.Hệ giao hàng: ${tweakedPhone})`,
`[Call me: ${tweakedPhone}]`,
`[LH trực tiếp ${tweakedPhone}]`,
`[Không đổi số: ${tweakedPhone}]`,
`[Sđt nhận hàng: ${tweakedPhone}]`,
`[Gọj ${tweakedPhone}]`,
`[Dđ ${tweakedPhone}]`,
`(Gjáo gọj: ${tweakedPhone})`,
`(Ljên hệ: ${tweakedPhone})`,
`[Call_me ${tweakedPhone}]`,
`(_Shjp gọj: ${tweakedPhone})`,
`(Khg đổj số: ${tweakedPhone})`,
`[SĐT chính chủ: ${tweakedPhone}]`,
`[Hot_Line: ${tweakedPhone}]`,
`(_Nhận hàg alo: ${tweakedPhone})`,
`[LH ${tweakedPhone}]`,
`[Sđt ${tweakedPhone}]`,
`[Alo ${tweakedPhone}]`,
`(Giao gọi: ${tweakedPhone})`,
`(Liên hệ: ${tweakedPhone})`,
`[Call me ${tweakedPhone}]`,
`(Đt bàn giao: ${tweakedPhone})`,
`- Số ĐT: ${tweakedPhone}`,
`/ Phone Nhận hàng: ${tweakedPhone}`,
`[Gặp nhận hàng: ${tweakedPhone}]`,
`_Ship gọi ${tweakedPhone}`,
`(Không đổi số: ${tweakedPhone})`,
`[Mọi chi tiết gọi ${tweakedPhone}]`,
`[Số chính chủ: ${tweakedPhone}]`,
`(đt liên lạc: ${tweakedPhone})`,
`[Hotline ${tweakedPhone}]`,
`- ĐT Nhận: ${tweakedPhone}`,
`(Alo khi tới: ${tweakedPhone})`,
`[Vui lòng gọi ${tweakedPhone}]`,
`[Liên hệ trực tiếp ${tweakedPhone}]`,
`[Giao sdt ${tweakedPhone} nha ship]`,
`[sdtnhanhang ${tweakedPhone}]`,
`[sdtcuadonhang ${tweakedPhone}]`,
`[SĐT nhận hàng ${tweakedPhone}]`,
`[Số nhận ${tweakedPhone}]`,
`[ĐT nhận ${tweakedPhone}]`,
`[ĐT người nhận ${tweakedPhone}]`,
`[SĐT người nhận ${tweakedPhone}]`,
`[Liên hệ người nhận ${tweakedPhone}]`,
`[Gọi người nhận ${tweakedPhone}]`,
`[Alo người nhận ${tweakedPhone}]`,
`[Gọi trước khi giao ${tweakedPhone}]`,
`[Giao gọi ${tweakedPhone}]`,
`[Đến nơi gọi ${tweakedPhone}]`,
`[Tới nơi gọi ${tweakedPhone}]`,
`[Gọi khi giao ${tweakedPhone}]`,
`[Gọi lúc giao ${tweakedPhone}]`,
`[Có hàng gọi ${tweakedPhone}]`,
`[Shipper gọi ${tweakedPhone}]`,
`[Ship gọi ${tweakedPhone}]`,
`[Ship liên hệ ${tweakedPhone}]`,
`[Ship alo ${tweakedPhone}]`,
`[LH giao hàng ${tweakedPhone}]`,
`[Liên hệ giao ${tweakedPhone}]`,
`[ĐT giao hàng ${tweakedPhone}]`,
`[SĐT giao hàng ${tweakedPhone}]`,
`[Số giao hàng ${tweakedPhone}]`,
`[SĐT chính ${tweakedPhone}]`,
`[Số chính ${tweakedPhone}]`,
`[Liên hệ chính ${tweakedPhone}]`,
`[Alo số này ${tweakedPhone}]`,
`[Gọi số này ${tweakedPhone}]`,
`[Nhận hàng alo ${tweakedPhone}]`,
`[Giao tới alo ${tweakedPhone}]`,
`[Đừng đổi số ${tweakedPhone}]`,
`[Giữ số này ${tweakedPhone}]`,
`(SĐT nhận: ${tweakedPhone})`,
`(Liên hệ nhận: ${tweakedPhone})`,
`(Giao hàng gọi: ${tweakedPhone})`,
`(Có hàng alo: ${tweakedPhone})`,
`(Shipper LH: ${tweakedPhone})`,
`(Số liên hệ: ${tweakedPhone})`,
`(Phone nhận: ${tweakedPhone})`,
        ];
        return getRandom(templates);
    }

    function processBypassAi() {
        let nameInput  = document.getElementById("source_name").value.trim();
        let phoneInput = document.getElementById("source_phone").value.trim();
        let addrInput  = document.getElementById("source_address").value.trim();

        let isNameChecked = document.getElementById("opt_tweak_name").checked;
        let isBypassChecked = document.getElementById("opt_shopee_bypass").checked;

        if (!phoneInput) {
            showToast("Vui lòng nhập Số điện thoại gốc!");
            return;
        }

        let cleanParts = {
            full: phoneInput.replace(/\D/g, ''),
            s1: phoneInput.replace(/\D/g, '').slice(0, 4),
            s2: phoneInput.replace(/\D/g, '').slice(4, 7),
            s3: phoneInput.replace(/\D/g, '').slice(7)
        };

        let tweakedName = "";
        if (nameInput) {
            tweakedName = isNameChecked ? generateTweakedName(nameInput, cleanParts) : nameInput;
        }
        document.getElementById("res_tweaked_name").value = tweakedName;

        let finalPhoneNote = generateSuperBypassPhone(phoneInput);
        if (isBypassChecked) {
            finalPhoneNote = buildFullNoteStructure(finalPhoneNote);
        }
        document.getElementById("res_phone_note").value = finalPhoneNote;

        let processedAddress = reverseAndTweakAddress(addrInput);
        let hasAddress = processedAddress.length > 0;

        let finalFullAddress = "";
        if (hasAddress) {
            let prefixBrandStr = `(${getRandom(brands)} ${getRandom(namesDict)}) `;
            finalFullAddress = `${prefixBrandStr}${processedAddress} ${finalPhoneNote}`.trim();
        } else {
            finalFullAddress = finalPhoneNote;
        }

        document.getElementById("res_full_address").value = finalFullAddress;
        document.getElementById("addr_hint").style.display = hasAddress ? "none" : "block";

        showToast("Đã sinh biến thể thành công!");
    }

    function copyText(id) {
        let el = document.getElementById(id);
        if (!el.value) {
            showToast("Không có nội dung để sao chép!");
            return;
        }
        el.focus();
        el.select();
        el.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(el.value).then(() => {
            showToast("Đã sao chép thành công!");
        }).catch(() => {
            showToast("Copy thất bại, hãy copy thủ công!");
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") processBypassAi();
    });
