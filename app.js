/* ============================================
   StudyPointer - Application Logic
   v2: Tokenizer syntax highlighter + Slideshow
   ============================================ */

class StudyPointerApp {
    constructor() {
        this.currentLecture = -1;
        this.completedLectures = new Set();
        this.slideshow = null;
        this.loadProgress();
        this.initElements();
        this.initEvents();
        this.renderNav();
        this.showWelcome();
    }

    initElements() {
        this.sidebar = document.getElementById('sidebar');
        this.menuToggle = document.getElementById('menuToggle');
        this.lectureNav = document.getElementById('lectureNav');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.lectureDisplay = document.getElementById('lectureDisplay');
        this.lectureNumber = document.getElementById('lectureNumber');
        this.lectureTitle = document.getElementById('lectureTitle');
        this.conceptSection = document.getElementById('conceptSection');
        this.codeBlock = document.getElementById('codeBlock');
        this.outputBlock = document.getElementById('outputBlock');
        this.outputContainer = document.getElementById('outputContainer');
        this.memoryViz = document.getElementById('memoryViz');
        this.memoryLegend = document.getElementById('memoryLegend');
        this.keypointsList = document.getElementById('keypointsList');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.bottomPrevBtn = document.getElementById('bottomPrevBtn');
        this.bottomNextBtn = document.getElementById('bottomNextBtn');
        this.lectureIndicator = document.getElementById('lectureIndicator');
        this.copyBtn = document.getElementById('copyBtn');
        this.startBtn = document.getElementById('startBtn');
    }

    initEvents() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        this.bottomPrevBtn.addEventListener('click', () => this.navigate(-1));
        this.bottomNextBtn.addEventListener('click', () => this.navigate(1));
        this.startBtn.addEventListener('click', () => this.goToLecture(0));
        this.copyBtn.addEventListener('click', () => this.copyCode());

        const slideshowBtn = document.getElementById('slideshowBtn');
        if (slideshowBtn) slideshowBtn.addEventListener('click', () => this.openSlideshow(0));
        const lecSlideshowBtn = document.getElementById('lecSlideshowBtn');
        if (lecSlideshowBtn) lecSlideshowBtn.addEventListener('click', () => {
            const idx = Math.max(0, this.currentLecture);
            this.openSlideshow(idx);
        });

        document.addEventListener('keydown', (e) => {
            if (this.slideshow && this.slideshow.isOpen) return;
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    renderNav() {
        this.lectureNav.innerHTML = lectures.map((lec, i) => `
            <div class="nav-item ${this.completedLectures.has(i) ? 'completed' : ''}"
                 data-index="${i}" onclick="app.goToLecture(${i})">
                <span class="nav-item-num">${i + 1}</span>
                <span class="nav-item-title">${lec.title}</span>
            </div>
        `).join('');
    }

    showWelcome() {
        this.welcomeScreen.style.display = '';
        this.lectureDisplay.style.display = 'none';
        this.lectureNumber.textContent = '';
        this.lectureTitle.textContent = 'C\uc5b8\uc5b4 \ud3ec\uc778\ud130 \uc644\uc804\uc815\ubcf5';
        this.updateNavButtons();
    }

    goToLecture(index) {
        if (index < 0 || index >= lectures.length) return;
        this.currentLecture = index;
        this.sidebar.classList.remove('open');
        this.completedLectures.add(index);
        this.saveProgress();
        this.renderLecture(index);
        this.updateNav();
        this.updateNavButtons();
        this.updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navigate(direction) {
        const next = this.currentLecture + direction;
        if (next >= 0 && next < lectures.length) {
            this.goToLecture(next);
        }
    }

    renderLecture(index) {
        const lec = lectures[index];
        this.welcomeScreen.style.display = 'none';
        this.lectureDisplay.style.display = '';

        this.lectureNumber.textContent = `${index + 1}\uac15`;
        this.lectureTitle.textContent = lec.title;
        this.lectureIndicator.textContent = `${index + 1} / ${lectures.length}`;

        this.conceptSection.innerHTML = `
            <h3><span class="section-icon">&#128218;</span> ${lec.title}</h3>
            ${lec.content}
        `;

        this.codeBlock.innerHTML = this.highlightC(lec.code.trim());

        if (lec.output) {
            this.outputContainer.style.display = '';
            this.outputBlock.textContent = lec.output.trim();
        } else {
            this.outputContainer.style.display = 'none';
        }

        this.renderMemoryViz(lec.memory);

        this.keypointsList.innerHTML = lec.keyPoints.map(p =>
            `<li>${p}</li>`
        ).join('');
    }

    /* ==========================================
       Tokenizer-based C Syntax Highlighter
       Prevents "syn-preproc" text leak bug
       ========================================== */
    highlightC(code) {
        const tokens = [];
        let i = 0;
        const len = code.length;

        while (i < len) {
            // Preprocessor: # at line start
            if (code[i] === '#' && (i === 0 || code[i - 1] === '\n')) {
                let end = code.indexOf('\n', i);
                if (end === -1) end = len;
                tokens.push({ t: 'preproc', v: code.substring(i, end) });
                i = end;
                continue;
            }

            // Line comment
            if (code[i] === '/' && i + 1 < len && code[i + 1] === '/') {
                let end = code.indexOf('\n', i);
                if (end === -1) end = len;
                tokens.push({ t: 'comment', v: code.substring(i, end) });
                i = end;
                continue;
            }

            // Block comment
            if (code[i] === '/' && i + 1 < len && code[i + 1] === '*') {
                let end = code.indexOf('*/', i + 2);
                end = end === -1 ? len : end + 2;
                tokens.push({ t: 'comment', v: code.substring(i, end) });
                i = end;
                continue;
            }

            // String literal
            if (code[i] === '"') {
                let j = i + 1;
                while (j < len && code[j] !== '"') { if (code[j] === '\\') j++; j++; }
                if (j < len) j++;
                tokens.push({ t: 'string', v: code.substring(i, j) });
                i = j;
                continue;
            }

            // Char literal
            if (code[i] === "'") {
                let j = i + 1;
                while (j < len && code[j] !== "'") { if (code[j] === '\\') j++; j++; }
                if (j < len) j++;
                tokens.push({ t: 'string', v: code.substring(i, j) });
                i = j;
                continue;
            }

            // Number
            if (/\d/.test(code[i]) && (i === 0 || !/\w/.test(code[i - 1]))) {
                let j = i;
                if (code[j] === '0' && j + 1 < len && (code[j + 1] === 'x' || code[j + 1] === 'X')) {
                    j += 2;
                    while (j < len && /[0-9a-fA-F]/.test(code[j])) j++;
                } else {
                    while (j < len && /[\d.]/.test(code[j])) j++;
                }
                while (j < len && /[fFlLuU]/.test(code[j])) j++;
                tokens.push({ t: 'number', v: code.substring(i, j) });
                i = j;
                continue;
            }

            // Identifier / keyword / type / function
            if (/[a-zA-Z_]/.test(code[i])) {
                let j = i;
                while (j < len && /\w/.test(code[j])) j++;
                const word = code.substring(i, j);

                const KEYWORDS = new Set(['return', 'if', 'else', 'for', 'while', 'do', 'switch',
                    'case', 'break', 'continue', 'typedef', 'struct', 'union', 'enum',
                    'sizeof', 'const', 'static', 'extern', 'volatile', 'register',
                    'unsigned', 'signed', 'default', 'goto', 'NULL']);
                const TYPES = new Set(['int', 'char', 'float', 'double', 'void', 'long',
                    'short', 'size_t', 'FILE']);

                // Peek ahead for function call
                let k = j;
                while (k < len && code[k] === ' ') k++;
                const isFunc = code[k] === '(';

                if (KEYWORDS.has(word)) {
                    tokens.push({ t: 'keyword', v: word });
                } else if (TYPES.has(word)) {
                    tokens.push({ t: 'type', v: word });
                } else if (isFunc) {
                    tokens.push({ t: 'func', v: word });
                } else {
                    tokens.push({ t: 'plain', v: word });
                }
                i = j;
                continue;
            }

            // Plain character (whitespace, operators, punctuation)
            tokens.push({ t: 'plain', v: code[i] });
            i++;
        }

        const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const classMap = {
            preproc: 'syn-preproc', comment: 'syn-comment', string: 'syn-string',
            number: 'syn-number', keyword: 'syn-keyword', type: 'syn-type', func: 'syn-func'
        };

        return tokens.map(tk => {
            const escaped = esc(tk.v);
            const cls = classMap[tk.t];
            return cls ? `<span class="${cls}">${escaped}</span>` : escaped;
        }).join('');
    }

    /* ==========================================
       Memory Visualization
       ========================================== */
    renderMemoryViz(memData) {
        if (!memData || !memData.regions) {
            this.memoryViz.innerHTML = '<p style="text-align:center;color:#94a3b8;">\uba54\ubaa8\ub9ac \uc2dc\uac01\ud654 \ub370\uc774\ud130\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.</p>';
            return;
        }
        this.memoryViz.innerHTML = StudyPointerApp.buildMemoryHTML(memData);
        this.renderLegend(memData);
    }

    static buildMemoryHTML(memData) {
        let html = '';
        let cellIndex = 0;

        memData.regions.forEach(region => {
            const headerClass = region.type === 'stack' ? 'stack-header' :
                region.type === 'heap' ? 'heap-header' :
                region.type === 'data' ? 'data-header' :
                region.type === 'code' ? 'code-header-bg' : '';

            html += `<div class="memory-region">
                <div class="region-header ${headerClass}">${region.name}</div>
                <table class="memory-table">
                    <thead><tr><th>\uc8fc\uc18c</th><th>\ubcc0\uc218\uba85</th><th>\uac12</th><th>\ud0c0\uc785</th></tr></thead>
                    <tbody>`;

            region.cells.forEach(cell => {
                const cellClass = StudyPointerApp.getCellClass(cell.type);
                const valueClass = cell.isPointer ? 'mem-value-ptr' : '';
                html += `<tr class="${cellClass}" id="cell-${cellIndex++}" data-name="${cell.name}">
                    <td class="mem-addr">${cell.address}</td>
                    <td class="mem-name">${cell.name}</td>
                    <td class="mem-value ${valueClass}">${cell.value}</td>
                    <td class="mem-type">${cell.typeLabel || cell.type}</td>
                </tr>`;
            });
            html += '</tbody></table></div>';
        });

        if (memData.arrows && memData.arrows.length > 0) {
            html += '<div class="arrow-descriptions">';
            memData.arrows.forEach(arrow => {
                html += `<div class="arrow-desc-item">
                    <span>${arrow.from}</span>
                    <span class="arrow-desc-arrow">&rarr;</span>
                    <span>${arrow.to}</span>
                    ${arrow.label ? `<span style="color:#475569;font-family:sans-serif;">(\u200B${arrow.label})</span>` : ''}
                </div>`;
            });
            html += '</div>';
        }

        if (memData.annotations) {
            html += '<div style="margin-top:12px;">';
            memData.annotations.forEach(ann => {
                const cls = ann.type === 'warning' ? 'warning-box' : ann.type === 'danger' ? 'danger-box' : 'info-box';
                html += `<div class="${cls}">${ann.text}</div>`;
            });
            html += '</div>';
        }
        return html;
    }

    static getCellClass(type) {
        const map = {
            'int': 'mem-cell-int', 'char': 'mem-cell-char', 'float': 'mem-cell-int',
            'double': 'mem-cell-double', 'ptr': 'mem-cell-ptr', 'int*': 'mem-cell-ptr',
            'char*': 'mem-cell-ptr', 'void*': 'mem-cell-ptr', 'int**': 'mem-cell-double',
            'arr': 'mem-cell-arr', 'heap': 'mem-cell-heap', 'func': 'mem-cell-func',
            'free': 'mem-cell-free', 'funcptr': 'mem-cell-func',
        };
        return map[type] || '';
    }

    renderLegend(memData) {
        const types = new Set();
        memData.regions.forEach(r => r.cells.forEach(c => types.add(c.type)));

        const legendMap = {
            'int': { color: 'var(--mem-int)', border: 'var(--mem-int-border)', label: '\uc815\uc218\ud615 \ubcc0\uc218' },
            'char': { color: 'var(--mem-char)', border: 'var(--mem-char-border)', label: '\ubb38\uc790\ud615 \ubcc0\uc218' },
            'float': { color: 'var(--mem-int)', border: 'var(--mem-int-border)', label: '\uc2e4\uc218\ud615 \ubcc0\uc218' },
            'double': { color: 'var(--mem-double)', border: 'var(--mem-double-border)', label: '\uc2e4\uc218\ud615 \ubcc0\uc218' },
            'ptr': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: '\ud3ec\uc778\ud130 \ubcc0\uc218' },
            'int*': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: '\ud3ec\uc778\ud130 \ubcc0\uc218' },
            'char*': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: '\ud3ec\uc778\ud130 \ubcc0\uc218' },
            'void*': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: 'void \ud3ec\uc778\ud130' },
            'int**': { color: 'var(--mem-double)', border: 'var(--mem-double-border)', label: '\uc774\uc911 \ud3ec\uc778\ud130' },
            'arr': { color: 'var(--mem-arr)', border: 'var(--mem-arr-border)', label: '\ubc30\uc5f4 \uc694\uc18c' },
            'heap': { color: 'var(--mem-heap)', border: 'var(--mem-heap-border)', label: '\ud799 \uba54\ubaa8\ub9ac' },
            'func': { color: 'var(--mem-func)', border: 'var(--mem-func-border)', label: '\ud568\uc218 \uc601\uc5ed' },
            'funcptr': { color: 'var(--mem-func)', border: 'var(--mem-func-border)', label: '\ud568\uc218 \ud3ec\uc778\ud130' },
            'free': { color: 'var(--mem-free)', border: 'var(--mem-free-border)', label: '\ud574\uc81c\ub41c \uba54\ubaa8\ub9ac' },
        };

        const shown = new Set();
        let html = '';
        types.forEach(t => {
            const info = legendMap[t];
            if (info && !shown.has(info.label)) {
                shown.add(info.label);
                html += `<div class="legend-item">
                    <div class="legend-color" style="background:${info.color};border-color:${info.border}"></div>
                    <span>${info.label}</span>
                </div>`;
            }
        });
        this.memoryLegend.innerHTML = html;
    }

    /* ==========================================
       Navigation & Progress
       ========================================== */
    updateNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            const idx = parseInt(item.dataset.index);
            item.classList.remove('active');
            if (idx === this.currentLecture) item.classList.add('active');
            if (this.completedLectures.has(idx)) item.classList.add('completed');
        });
    }

    updateNavButtons() {
        const isFirst = this.currentLecture <= 0;
        const isLast = this.currentLecture >= lectures.length - 1;
        const isWelcome = this.currentLecture === -1;
        this.prevBtn.disabled = isFirst || isWelcome;
        this.nextBtn.disabled = isLast || isWelcome;
        this.bottomPrevBtn.disabled = isFirst || isWelcome;
        this.bottomNextBtn.disabled = isLast;
    }

    updateProgress() {
        const total = lectures.length;
        const done = this.completedLectures.size;
        this.progressBar.style.width = (done / total * 100) + '%';
        this.progressText.textContent = `${done} / ${total} \uc644\ub8cc`;
    }

    copyCode() {
        const lec = lectures[this.currentLecture];
        if (!lec) return;
        navigator.clipboard.writeText(lec.code.trim()).then(() => {
            this.copyBtn.textContent = '\ubcf5\uc0ac\ub428!';
            setTimeout(() => { this.copyBtn.textContent = '\ubcf5\uc0ac'; }, 2000);
        }).catch(() => {
            this.copyBtn.textContent = '\uc2e4\ud328';
            setTimeout(() => { this.copyBtn.textContent = '\ubcf5\uc0ac'; }, 2000);
        });
    }

    saveProgress() {
        try { localStorage.setItem('studypointer_completed', JSON.stringify([...this.completedLectures])); } catch (e) {}
    }
    loadProgress() {
        try {
            const s = localStorage.getItem('studypointer_completed');
            if (s) this.completedLectures = new Set(JSON.parse(s));
        } catch (e) {}
    }

    /* ==========================================
       Slideshow Mode
       ========================================== */
    openSlideshow(startLecture = 0) {
        if (!this.slideshow) {
            this.slideshow = new SlideShow(this);
        }
        this.slideshow.open(startLecture);
    }
}


/* ==============================================
   SlideShow - Fullscreen Presentation Viewer
   ============================================== */
class SlideShow {
    constructor(app) {
        this.app = app;
        this.slides = [];
        this.currentSlide = 0;
        this.isOpen = false;
        this.overlay = document.getElementById('slideshowOverlay');
        this.content = document.getElementById('slideContent');
        this.counter = document.getElementById('slideCounter');
        this.progressFill = document.getElementById('slideProgressFill');
        this.lecLabel = document.getElementById('slideLecLabel');
        this.initEvents();
    }

    initEvents() {
        document.getElementById('slideClose').addEventListener('click', () => this.close());
        document.getElementById('slidePrev').addEventListener('click', () => this.go(-1));
        document.getElementById('slideNext').addEventListener('click', () => this.go(1));
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.go(-1);
            if (e.key === 'ArrowRight') this.go(1);
            if (e.key === 'Home') { this.currentSlide = 0; this.render(); }
            if (e.key === 'End') { this.currentSlide = this.slides.length - 1; this.render(); }
        });
    }

    generateSlides() {
        const slides = [];

        // Intro
        slides.push({ type: 'intro' });

        // TOC
        slides.push({ type: 'toc' });

        // Each lecture: title, concept, code, memory, keypoints
        lectures.forEach((lec, i) => {
            slides.push({ type: 'section', idx: i });
            slides.push({ type: 'concept', idx: i });
            slides.push({ type: 'code', idx: i });
            slides.push({ type: 'memory', idx: i });
            slides.push({ type: 'keypoints', idx: i });
        });

        // Outro
        slides.push({ type: 'outro' });

        return slides;
    }

    open(startLecture = 0) {
        this.slides = this.generateSlides();
        // Jump to the section slide of the requested lecture
        if (startLecture > 0) {
            const targetIdx = this.slides.findIndex(s => s.type === 'section' && s.idx === startLecture);
            this.currentSlide = targetIdx >= 0 ? targetIdx : 0;
        } else {
            this.currentSlide = 0;
        }
        this.isOpen = true;
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.render();
    }

    close() {
        this.isOpen = false;
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    go(dir) {
        const next = this.currentSlide + dir;
        if (next >= 0 && next < this.slides.length) {
            this.currentSlide = next;
            this.render();
        }
    }

    render() {
        const slide = this.slides[this.currentSlide];
        this.content.innerHTML = this.renderSlide(slide);
        this.counter.textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
        this.progressFill.style.width = ((this.currentSlide + 1) / this.slides.length * 100) + '%';

        // Update lecture label
        if (slide.idx !== undefined) {
            this.lecLabel.textContent = `${slide.idx + 1}\uac15. ${lectures[slide.idx].title}`;
        } else {
            this.lecLabel.textContent = '';
        }

        // Nav button states
        document.getElementById('slidePrev').disabled = this.currentSlide === 0;
        document.getElementById('slideNext').disabled = this.currentSlide === this.slides.length - 1;
    }

    renderSlide(slide) {
        switch (slide.type) {
            case 'intro': return this.slideIntro();
            case 'toc': return this.slideTOC();
            case 'section': return this.slideSection(slide.idx);
            case 'concept': return this.slideConcept(slide.idx);
            case 'code': return this.slideCode(slide.idx);
            case 'memory': return this.slideMemory(slide.idx);
            case 'keypoints': return this.slideKeypoints(slide.idx);
            case 'outro': return this.slideOutro();
            default: return '';
        }
    }

    slideIntro() {
        return `<div class="sl sl-intro">
            <div class="sl-intro-icon">*ptr</div>
            <h1>C\uc5b8\uc5b4 \ud3ec\uc778\ud130 \uc644\uc804\uc815\ubcf5</h1>
            <p class="sl-subtitle">64\ube44\ud2b8 \uc2dc\uc2a4\ud15c \uae30\ubc18 \uba54\ubaa8\ub9ac \uc2dc\uac01\ud654 \ud559\uc2b5</p>
            <div class="sl-intro-meta">
                <span>&#128218; 20\uac1c \uac15\uc88c</span>
                <span>&#128187; \uc2e4\uc804 \uc608\uc81c</span>
                <span>&#128202; \uba54\ubaa8\ub9ac \ub9f5</span>
            </div>
            <p class="sl-intro-note">C++ \ud3ec\uc778\ud130\ub97c \uc704\ud55c \uc608\ube44 \uacfc\uc815</p>
        </div>`;
    }

    slideTOC() {
        const half = Math.ceil(lectures.length / 2);
        const col1 = lectures.slice(0, half).map((l, i) =>
            `<div class="sl-toc-item"><span class="sl-toc-num">${i + 1}</span>${l.title}</div>`
        ).join('');
        const col2 = lectures.slice(half).map((l, i) =>
            `<div class="sl-toc-item"><span class="sl-toc-num">${half + i + 1}</span>${l.title}</div>`
        ).join('');
        return `<div class="sl sl-toc">
            <h2>&#128218; \uac15\uc88c \ubaa9\ucc28</h2>
            <div class="sl-toc-grid"><div>${col1}</div><div>${col2}</div></div>
        </div>`;
    }

    slideSection(idx) {
        const lec = lectures[idx];
        return `<div class="sl sl-section">
            <div class="sl-section-num">${idx + 1}</div>
            <h1>${lec.title}</h1>
            <div class="sl-section-bar"></div>
        </div>`;
    }

    slideConcept(idx) {
        const lec = lectures[idx];
        const parser = new DOMParser();
        const doc = parser.parseFromString('<div>' + lec.content + '</div>', 'text/html');
        const root = doc.body.firstChild;
        const h4s = root.querySelectorAll('h4');
        let bullets = '';
        h4s.forEach((h4, bi) => {
            const title = h4.textContent;
            let desc = '';
            let next = h4.nextElementSibling;
            if (next) {
                if (next.tagName === 'P') {
                    desc = this.truncText(next.textContent, 100);
                } else if (next.tagName === 'UL') {
                    const lis = [...next.querySelectorAll('li')].slice(0, 4);
                    desc = lis.map(li => {
                        const t = li.textContent.trim();
                        const c = t.indexOf(':');
                        return c > 0 && c < 30 ? t.substring(0, c) : (t.length > 45 ? t.substring(0, 42) + '...' : t);
                    }).join(' \u00b7 ');
                }
            }
            bullets += `<div class="sl-bullet">
                <div class="sl-bullet-marker">${bi + 1}</div>
                <div>
                    <div class="sl-bullet-title">${this.escHtml(title)}</div>
                    ${desc ? '<div class="sl-bullet-desc">' + this.escHtml(desc) + '</div>' : ''}
                </div>
            </div>`;
        });
        const calloutEl = root.querySelector('.info-box, .warning-box');
        let callout = '';
        if (calloutEl) {
            const isWarn = calloutEl.classList.contains('warning-box');
            const txt = this.truncText(calloutEl.textContent, 130);
            callout = `<div class="sl-callout ${isWarn ? 'sl-callout-warn' : 'sl-callout-info'}">
                <span>${this.escHtml(txt)}</span>
            </div>`;
        }
        return `<div class="sl sl-concept">
            <h2 class="sl-slide-title"><span class="sl-badge">${idx + 1}\uac15</span> ${this.escHtml(lec.title)}</h2>
            <div class="sl-bullet-list">${bullets}</div>
            ${callout}
        </div>`;
    }

    slideCode(idx) {
        const lec = lectures[idx];
        const highlighted = this.app.highlightC(lec.code.trim());
        let html = `<div class="sl sl-code">
            <h2 class="sl-slide-title"><span class="sl-badge">${idx + 1}\uac15</span> \uc608\uc81c \ucf54\ub4dc</h2>
            <div class="sl-code-wrapper">
                <pre class="sl-code-block"><code>${highlighted}</code></pre>`;
        if (lec.output) {
            html += `<div class="sl-output">
                <div class="sl-output-title">\uc2e4\ud589 \uacb0\uacfc</div>
                <pre class="sl-output-block">${this.escHtml(lec.output.trim())}</pre>
            </div>`;
        }
        html += `</div></div>`;
        return html;
    }

    slideMemory(idx) {
        const lec = lectures[idx];
        const memHTML = StudyPointerApp.buildMemoryHTML(lec.memory);
        return `<div class="sl sl-memory">
            <h2 class="sl-slide-title"><span class="sl-badge">${idx + 1}\uac15</span> \uba54\ubaa8\ub9ac \ub9f5</h2>
            <div class="sl-memory-body">${memHTML}</div>
        </div>`;
    }

    slideKeypoints(idx) {
        const lec = lectures[idx];
        const items = lec.keyPoints.map(p => `<li>${p}</li>`).join('');
        return `<div class="sl sl-keypoints">
            <h2 class="sl-slide-title"><span class="sl-badge">${idx + 1}\uac15</span> \ud575\uc2ec \ud3ec\uc778\ud2b8</h2>
            <ul class="sl-kp-list">${items}</ul>
        </div>`;
    }

    slideOutro() {
        return `<div class="sl sl-outro">
            <div class="sl-outro-icon">&#127942;</div>
            <h1>\ud559\uc2b5 \uc644\ub8cc!</h1>
            <p>C++ \ud3ec\uc778\ud130\ub85c\uc758 \uc5ec\uc815\uc744 \uc2dc\uc791\ud558\uc138\uc694</p>
        </div>`;
    }

    truncText(text, max) {
        text = text.trim();
        const m = text.match(/^(.+?[.!?])\s/);
        if (m && m[1].length <= max) return m[1];
        if (text.length <= max) return text;
        return text.substring(0, max - 3) + '...';
    }

    escHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

}


// Initialize
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StudyPointerApp();
});
