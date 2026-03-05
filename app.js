/* ============================================
   StudyPointer - Application Logic
   ============================================ */

class StudyPointerApp {
    constructor() {
        this.currentLecture = -1;
        this.completedLectures = new Set();
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

        document.addEventListener('keydown', (e) => {
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
        this.lectureTitle.textContent = 'C언어 포인터 완전정복';
        this.updateNavButtons();
    }

    goToLecture(index) {
        if (index < 0 || index >= lectures.length) return;
        this.currentLecture = index;
        this.sidebar.classList.remove('open');

        // Mark as completed
        this.completedLectures.add(index);
        this.saveProgress();

        this.renderLecture(index);
        this.updateNav();
        this.updateNavButtons();
        this.updateProgress();

        // Scroll to top
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

        this.lectureNumber.textContent = `${index + 1}강`;
        this.lectureTitle.textContent = lec.title;
        this.lectureIndicator.textContent = `${index + 1} / ${lectures.length}`;

        // Concept
        this.conceptSection.innerHTML = `
            <h3><span class="section-icon">&#128218;</span> ${lec.title}</h3>
            ${lec.content}
        `;

        // Code
        this.codeBlock.innerHTML = this.highlightC(lec.code);

        // Output
        if (lec.output) {
            this.outputContainer.style.display = '';
            this.outputBlock.textContent = lec.output;
        } else {
            this.outputContainer.style.display = 'none';
        }

        // Memory Visualization
        this.renderMemoryViz(lec.memory);

        // Key Points
        this.keypointsList.innerHTML = lec.keyPoints.map(p =>
            `<li>${p}</li>`
        ).join('');
    }

    renderMemoryViz(memData) {
        if (!memData || !memData.regions) {
            this.memoryViz.innerHTML = '<p style="text-align:center;color:#94a3b8;">메모리 시각화 데이터가 없습니다.</p>';
            return;
        }

        let html = '';
        const cellIds = {};
        let cellIndex = 0;

        // Render each region
        memData.regions.forEach(region => {
            const headerClass = region.type === 'stack' ? 'stack-header' :
                region.type === 'heap' ? 'heap-header' :
                region.type === 'data' ? 'data-header' :
                region.type === 'code' ? 'code-header-bg' : '';

            html += `<div class="memory-region">
                <div class="region-header ${headerClass}">${region.name}</div>
                <table class="memory-table">
                    <thead><tr>
                        <th>주소</th>
                        <th>변수명</th>
                        <th>값</th>
                        <th>타입</th>
                    </tr></thead>
                    <tbody>`;

            region.cells.forEach(cell => {
                const cellClass = this.getCellClass(cell.type);
                const valueClass = cell.isPointer ? 'mem-value-ptr' : '';
                const cellId = `cell-${cellIndex}`;
                cellIds[cell.name] = cellId;
                cellIndex++;

                html += `<tr class="${cellClass}" id="${cellId}" data-name="${cell.name}">
                    <td class="mem-addr">${cell.address}</td>
                    <td class="mem-name">${cell.name}</td>
                    <td class="mem-value ${valueClass}">${cell.value}</td>
                    <td class="mem-type">${cell.typeLabel || cell.type}</td>
                </tr>`;
            });

            html += '</tbody></table></div>';
        });

        // Arrow descriptions
        if (memData.arrows && memData.arrows.length > 0) {
            html += '<div class="arrow-descriptions">';
            memData.arrows.forEach(arrow => {
                html += `<div class="arrow-desc-item">
                    <span>${arrow.from}</span>
                    <span class="arrow-desc-arrow">&rarr;</span>
                    <span>${arrow.to}</span>
                    ${arrow.label ? `<span style="color:#64748b;font-family:sans-serif;">(${arrow.label})</span>` : ''}
                </div>`;
            });
            html += '</div>';
        }

        // Annotations
        if (memData.annotations) {
            html += '<div style="margin-top:12px;">';
            memData.annotations.forEach(ann => {
                const boxClass = ann.type === 'warning' ? 'warning-box' :
                    ann.type === 'danger' ? 'danger-box' : 'info-box';
                html += `<div class="${boxClass}">${ann.text}</div>`;
            });
            html += '</div>';
        }

        this.memoryViz.innerHTML = html;

        // Render legend
        this.renderLegend(memData);
    }

    getCellClass(type) {
        const map = {
            'int': 'mem-cell-int',
            'char': 'mem-cell-char',
            'float': 'mem-cell-int',
            'double': 'mem-cell-double',
            'ptr': 'mem-cell-ptr',
            'int*': 'mem-cell-ptr',
            'char*': 'mem-cell-ptr',
            'void*': 'mem-cell-ptr',
            'int**': 'mem-cell-double',
            'arr': 'mem-cell-arr',
            'heap': 'mem-cell-heap',
            'func': 'mem-cell-func',
            'free': 'mem-cell-free',
            'funcptr': 'mem-cell-func',
        };
        return map[type] || '';
    }

    renderLegend(memData) {
        const types = new Set();
        memData.regions.forEach(r => r.cells.forEach(c => types.add(c.type)));

        const legendMap = {
            'int': { color: 'var(--mem-int)', border: 'var(--mem-int-border)', label: '정수형 변수' },
            'char': { color: 'var(--mem-char)', border: 'var(--mem-char-border)', label: '문자형 변수' },
            'float': { color: 'var(--mem-int)', border: 'var(--mem-int-border)', label: '실수형 변수' },
            'double': { color: 'var(--mem-double)', border: 'var(--mem-double-border)', label: '실수형 변수' },
            'ptr': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: '포인터 변수' },
            'int*': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: '포인터 변수' },
            'char*': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: '포인터 변수' },
            'void*': { color: 'var(--mem-ptr)', border: 'var(--mem-ptr-border)', label: 'void 포인터' },
            'int**': { color: 'var(--mem-double)', border: 'var(--mem-double-border)', label: '이중 포인터' },
            'arr': { color: 'var(--mem-arr)', border: 'var(--mem-arr-border)', label: '배열 요소' },
            'heap': { color: 'var(--mem-heap)', border: 'var(--mem-heap-border)', label: '힙 메모리' },
            'func': { color: 'var(--mem-func)', border: 'var(--mem-func-border)', label: '함수 영역' },
            'funcptr': { color: 'var(--mem-func)', border: 'var(--mem-func-border)', label: '함수 포인터' },
            'free': { color: 'var(--mem-free)', border: 'var(--mem-free-border)', label: '해제된 메모리' },
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
        const pct = (done / total) * 100;
        this.progressBar.style.width = pct + '%';
        this.progressText.textContent = `${done} / ${total} 완료`;
    }

    highlightC(code) {
        // Escape HTML
        let s = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Preprocessor directives
        s = s.replace(/(#\s*(?:include|define|ifdef|ifndef|endif|pragma|if|else|elif|undef)\b[^\n]*)/g,
            '<span class="syn-preproc">$1</span>');

        // Comments
        s = s.replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>');
        s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-comment">$1</span>');

        // Strings
        s = s.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="syn-string">$1</span>');

        // Keywords
        const keywords = ['return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
            'continue', 'typedef', 'struct', 'union', 'enum', 'sizeof', 'const', 'static',
            'extern', 'volatile', 'register', 'unsigned', 'signed', 'default', 'goto', 'NULL'];
        const kwPattern = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
        s = s.replace(kwPattern, '<span class="syn-keyword">$1</span>');

        // Types
        const types = ['int', 'char', 'float', 'double', 'void', 'long', 'short', 'size_t'];
        const typePattern = new RegExp('\\b(' + types.join('|') + ')\\b', 'g');
        s = s.replace(typePattern, '<span class="syn-type">$1</span>');

        // Function calls
        s = s.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="syn-func">$1</span>');

        // Numbers
        s = s.replace(/\b(\d+\.?\d*[fFlLuU]?)\b/g, '<span class="syn-number">$1</span>');

        return s;
    }

    copyCode() {
        const lec = lectures[this.currentLecture];
        if (!lec) return;
        navigator.clipboard.writeText(lec.code).then(() => {
            this.copyBtn.textContent = '복사됨!';
            setTimeout(() => { this.copyBtn.textContent = '복사'; }, 2000);
        }).catch(() => {
            this.copyBtn.textContent = '실패';
            setTimeout(() => { this.copyBtn.textContent = '복사'; }, 2000);
        });
    }

    saveProgress() {
        try {
            localStorage.setItem('studypointer_completed',
                JSON.stringify([...this.completedLectures]));
        } catch (e) { }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('studypointer_completed');
            if (saved) {
                this.completedLectures = new Set(JSON.parse(saved));
            }
        } catch (e) { }
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StudyPointerApp();
});
