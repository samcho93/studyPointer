const lectures = [
    // ========== 1강: 메모리의 구조 ==========
    {
        title: "메모리의 구조",
        content: `
            <h4>프로그램과 메모리</h4>
            <p>C 프로그램이 실행되면 운영체제는 해당 프로세스에게 가상 메모리 공간을 할당합니다. 이 메모리 공간은 크게 <strong>코드(Code)</strong>, <strong>데이터(Data)</strong>, <strong>힙(Heap)</strong>, <strong>스택(Stack)</strong> 네 가지 영역으로 나뉩니다. 각 영역은 서로 다른 목적을 가지며, 프로그램 실행 중 서로 다른 방식으로 관리됩니다.</p>

            <h4>네 가지 메모리 영역</h4>
            <ul>
                <li><strong>코드(Code/Text) 영역:</strong> 컴파일된 기계어 명령어가 저장됩니다. 프로그램 실행 중 변경되지 않는 읽기 전용(Read-Only) 영역입니다. 함수의 실행 코드가 이곳에 위치합니다.</li>
                <li><strong>데이터(Data) 영역:</strong> 전역 변수와 <code>static</code> 변수가 저장됩니다. 프로그램 시작 시 할당되고 프로그램 종료 시 해제됩니다. 초기화된 변수와 초기화되지 않은 변수(BSS)로 나뉩니다.</li>
                <li><strong>힙(Heap) 영역:</strong> <code>malloc()</code>, <code>calloc()</code> 등으로 동적 할당되는 메모리 영역입니다. 프로그래머가 직접 할당과 해제를 관리해야 합니다. 낮은 주소에서 높은 주소 방향으로 성장합니다.</li>
                <li><strong>스택(Stack) 영역:</strong> 지역 변수, 함수 매개변수, 복귀 주소 등이 저장됩니다. 함수 호출 시 자동으로 할당되고, 함수 종료 시 자동으로 해제됩니다. 높은 주소에서 낮은 주소 방향으로 성장합니다.</li>
            </ul>

            <h4>64비트 시스템의 메모리 주소</h4>
            <p>64비트 시스템에서 메모리 주소는 8바이트(64비트)로 표현됩니다. 이론적으로 2<sup>64</sup>바이트(16EB)의 메모리 주소를 표현할 수 있지만, 실제로는 하위 48비트만 사용합니다. 주소는 보통 16진수로 표기하며, <code>0x7FFE...</code>와 같은 형태입니다.</p>

            <div class="info-box">64비트 시스템에서 모든 포인터의 크기는 자료형에 관계없이 항상 8바이트입니다. <code>int*</code>, <code>char*</code>, <code>double*</code> 모두 동일하게 8바이트를 차지합니다.</div>

            <h4>메모리 배치 순서</h4>
            <p>일반적으로 메모리 주소가 낮은 곳부터 코드, 데이터, 힙, 스택 순서로 배치됩니다. 힙은 위로(높은 주소 방향), 스택은 아래로(낮은 주소 방향) 성장하며, 중간의 빈 공간을 공유합니다.</p>

            <div class="warning-box">힙과 스택이 서로를 향해 성장하기 때문에, 무한 재귀나 과도한 동적 할당 시 두 영역이 충돌하여 스택 오버플로우 또는 메모리 부족이 발생할 수 있습니다.</div>
        `,
        code: `#include <stdio.h>
#include <stdlib.h>

int global_var = 100;           // 데이터 영역
static int static_var = 200;    // 데이터 영역

void my_function() {            // 코드 영역
    printf("함수 실행 중\\n");
}

int main() {
    int local_var = 10;          // 스택 영역
    int *heap_var = (int *)malloc(sizeof(int)); // 힙 영역
    *heap_var = 50;

    printf("=== 메모리 영역별 주소 ===\\n");
    printf("코드 영역 (함수):  %p\\n", (void *)my_function);
    printf("데이터 영역 (전역): %p\\n", (void *)&global_var);
    printf("데이터 영역 (정적): %p\\n", (void *)&static_var);
    printf("힙 영역 (동적):    %p\\n", (void *)heap_var);
    printf("스택 영역 (지역):  %p\\n", (void *)&local_var);

    free(heap_var);
    return 0;
}`,
        output: `=== 메모리 영역별 주소 ===
코드 영역 (함수):  0x00401130
데이터 영역 (전역): 0x00604040
데이터 영역 (정적): 0x00604044
힙 영역 (동적):    0x00602010
스택 영역 (지역):  0x7FFE2A3C18B4`,
        memory: {
            regions: [
                {
                    name: "코드(Code) 영역",
                    type: "code",
                    cells: [
                        { address: "0x00401130", name: "my_function", value: "기계어 명령어", type: "func", typeLabel: "function", isPointer: false },
                        { address: "0x00401160", name: "main", value: "기계어 명령어", type: "func", typeLabel: "function", isPointer: false }
                    ]
                },
                {
                    name: "데이터(Data) 영역",
                    type: "data",
                    cells: [
                        { address: "0x00604040", name: "global_var", value: "100", type: "int", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x00604044", name: "static_var", value: "200", type: "int", typeLabel: "int (4B)", isPointer: false }
                    ]
                },
                {
                    name: "힙(Heap) 영역",
                    type: "heap",
                    cells: [
                        { address: "0x00602010", name: "*heap_var", value: "50", type: "int", typeLabel: "int (4B)", isPointer: false }
                    ]
                },
                {
                    name: "스택(Stack) 영역",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18B4", name: "local_var", value: "10", type: "int", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18B8", name: "heap_var", value: "0x00602010", type: "ptr", typeLabel: "int* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "heap_var", to: "*heap_var", label: "동적 할당된 메모리를 가리킴" }
            ],
            annotations: [
                { type: "info", text: "코드 영역은 낮은 주소(0x004...)에, 스택 영역은 높은 주소(0x7FFE...)에 위치합니다." },
                { type: "warning", text: "힙 영역은 위로(↑), 스택 영역은 아래로(↓) 성장합니다." }
            ]
        },
        keyPoints: [
            "프로그램 메모리는 코드, 데이터, 힙, 스택 네 가지 영역으로 구분됩니다.",
            "코드 영역은 읽기 전용이며 컴파일된 기계어가 저장됩니다.",
            "데이터 영역에는 전역 변수와 static 변수가 저장됩니다.",
            "힙 영역은 malloc() 등으로 동적 할당하며 프로그래머가 관리합니다.",
            "스택 영역은 지역 변수와 함수 호출 정보가 자동으로 관리됩니다.",
            "64비트 시스템에서 메모리 주소는 8바이트로 표현됩니다."
        ]
    },

    // ========== 2강: 변수와 메모리 ==========
    {
        title: "변수와 메모리",
        content: `
            <h4>변수란 무엇인가?</h4>
            <p>변수는 데이터를 저장하기 위한 <strong>이름이 붙은 메모리 공간</strong>입니다. 변수를 선언하면 컴파일러는 해당 자료형의 크기만큼 메모리를 확보하고, 변수명을 통해 그 메모리 공간에 접근할 수 있게 해줍니다. 변수의 본질은 결국 메모리의 특정 위치에 있는 바이트 덩어리입니다.</p>

            <h4>자료형별 메모리 크기</h4>
            <p>C언어의 기본 자료형은 각각 다른 크기의 메모리를 사용합니다. 64비트 시스템 기준으로 일반적인 크기는 다음과 같습니다:</p>
            <ul>
                <li><code>char</code> : 1바이트 (8비트) - 문자 하나 또는 -128~127 정수</li>
                <li><code>short</code> : 2바이트 (16비트) - -32,768~32,767 정수</li>
                <li><code>int</code> : 4바이트 (32비트) - 약 ±21억 범위 정수</li>
                <li><code>long</code> : 8바이트 (64비트, Linux 기준) - 매우 큰 범위 정수</li>
                <li><code>float</code> : 4바이트 (32비트) - 단정밀도 실수</li>
                <li><code>double</code> : 8바이트 (64비트) - 배정밀도 실수</li>
            </ul>

            <h4>변수 선언과 메모리 할당</h4>
            <p>변수를 선언하면 컴파일러는 스택 영역에서 해당 자료형 크기만큼 메모리를 할당합니다. 예를 들어 <code>int a = 42;</code>를 선언하면, 스택에서 4바이트를 확보하고 그 위치에 42라는 값을 저장합니다. 변수명 <code>a</code>는 컴파일 후에는 사라지고, 메모리 주소로 대체됩니다.</p>

            <div class="info-box"><code>sizeof</code> 연산자를 사용하면 자료형이나 변수의 메모리 크기를 바이트 단위로 확인할 수 있습니다. 이 값은 컴파일 시점에 결정됩니다.</div>

            <h4>메모리에서의 변수 배치</h4>
            <p>스택에 선언된 지역 변수들은 연속적으로 배치되지만, 컴파일러 최적화와 패딩(padding)에 의해 주소가 반드시 연속적이지 않을 수 있습니다. 변수의 주소는 <code>&</code> 연산자로 확인할 수 있으며, 이것이 바로 포인터의 기초가 됩니다.</p>

            <div class="warning-box">자료형의 크기는 플랫폼(32비트/64비트)과 컴파일러에 따라 달라질 수 있습니다. <code>sizeof</code>를 사용하여 항상 확인하는 습관을 기르세요.</div>
        `,
        code: `#include <stdio.h>

int main() {
    char   c = 'A';
    short  s = 100;
    int    i = 42;
    long   l = 123456789L;
    float  f = 3.14f;
    double d = 2.71828;

    printf("=== 자료형별 크기 (sizeof) ===\\n");
    printf("char   : %zu 바이트, 값: %c\\n", sizeof(c), c);
    printf("short  : %zu 바이트, 값: %d\\n", sizeof(s), s);
    printf("int    : %zu 바이트, 값: %d\\n", sizeof(i), i);
    printf("long   : %zu 바이트, 값: %ld\\n", sizeof(l), l);
    printf("float  : %zu 바이트, 값: %.2f\\n", sizeof(f), f);
    printf("double : %zu 바이트, 값: %.5f\\n", sizeof(d), d);

    printf("\\n=== 변수의 메모리 주소 ===\\n");
    printf("c의 주소: %p\\n", (void *)&c);
    printf("s의 주소: %p\\n", (void *)&s);
    printf("i의 주소: %p\\n", (void *)&i);
    printf("l의 주소: %p\\n", (void *)&l);
    printf("f의 주소: %p\\n", (void *)&f);
    printf("d의 주소: %p\\n", (void *)&d);

    return 0;
}`,
        output: `=== 자료형별 크기 (sizeof) ===
char   : 1 바이트, 값: A
short  : 2 바이트, 값: 100
int    : 4 바이트, 값: 42
long   : 8 바이트, 값: 123456789
float  : 4 바이트, 값: 3.14
double : 8 바이트, 값: 2.71828

=== 변수의 메모리 주소 ===
c의 주소: 0x7FFE2A3C18A7
s의 주소: 0x7FFE2A3C18A8
i의 주소: 0x7FFE2A3C18AC
l의 주소: 0x7FFE2A3C18B0
f의 주소: 0x7FFE2A3C18B8
d의 주소: 0x7FFE2A3C18C0`,
        memory: {
            regions: [
                {
                    name: "스택(Stack) 영역 - main 함수",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18A7", name: "c", value: "'A' (0x41)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C18A8", name: "s", value: "100", type: "int", typeLabel: "short (2B)", isPointer: false },
                        { address: "0x7FFE2A3C18AC", name: "i", value: "42", type: "int", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18B0", name: "l", value: "123456789", type: "int", typeLabel: "long (8B)", isPointer: false },
                        { address: "0x7FFE2A3C18B8", name: "f", value: "3.14", type: "float", typeLabel: "float (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18C0", name: "d", value: "2.71828", type: "double", typeLabel: "double (8B)", isPointer: false }
                    ]
                }
            ],
            arrows: [],
            annotations: [
                { type: "info", text: "각 변수는 자료형 크기만큼 메모리를 차지합니다. char는 1바이트, int는 4바이트, double은 8바이트입니다." },
                { type: "info", text: "주소 간의 차이를 통해 각 변수가 차지하는 바이트 수를 확인할 수 있습니다." }
            ]
        },
        keyPoints: [
            "변수는 이름이 붙은 메모리 공간이며, 자료형에 따라 크기가 결정됩니다.",
            "char은 1바이트, int는 4바이트, double은 8바이트를 차지합니다.",
            "sizeof 연산자로 자료형이나 변수의 메모리 크기를 확인할 수 있습니다.",
            "& 연산자로 변수의 메모리 주소를 얻을 수 있습니다.",
            "변수명은 컴파일 후 메모리 주소로 변환되며, 실행 시에는 주소만 남습니다.",
            "자료형의 크기는 시스템과 컴파일러에 따라 다를 수 있으므로 sizeof로 확인하세요."
        ]
    },

    // ========== 3강: 포인터의 개념 ==========
    {
        title: "포인터의 개념",
        content: `
            <h4>포인터란 무엇인가?</h4>
            <p>포인터(Pointer)는 <strong>메모리 주소를 값으로 저장하는 변수</strong>입니다. 일반 변수가 정수, 실수, 문자 같은 데이터를 저장하는 반면, 포인터는 다른 변수가 위치한 메모리 주소를 저장합니다. "어디에 있는지"를 기억하는 변수라고 생각하면 됩니다.</p>

            <h4>왜 포인터가 필요한가?</h4>
            <p>포인터를 사용하면 다음과 같은 일이 가능합니다:</p>
            <ul>
                <li>함수에서 호출자의 변수를 직접 수정할 수 있습니다 (Call by Reference 효과)</li>
                <li>동적 메모리 할당으로 실행 중 메모리를 유연하게 관리할 수 있습니다</li>
                <li>배열과 문자열을 효율적으로 다룰 수 있습니다</li>
                <li>자료구조(연결 리스트, 트리 등)를 구현할 수 있습니다</li>
            </ul>

            <h4>포인터 선언과 주소 연산자 (&)</h4>
            <p>포인터를 선언할 때는 자료형 뒤에 <code>*</code>를 붙입니다. 예를 들어 <code>int *ptr;</code>은 "정수형 변수의 주소를 저장할 수 있는 포인터 변수 ptr"을 선언합니다. 다른 변수의 주소를 얻으려면 <code>&</code>(주소 연산자, address-of operator)를 사용합니다.</p>

            <div class="info-box">64비트 시스템에서 포인터 변수의 크기는 항상 <strong>8바이트</strong>입니다. <code>int*</code>든 <code>char*</code>든 <code>double*</code>든 포인터 자체의 크기는 동일합니다. 포인터는 메모리 주소를 저장하는 것이고, 64비트 주소를 저장하려면 8바이트가 필요하기 때문입니다.</div>

            <h4>포인터의 동작 원리</h4>
            <p>다음 코드를 살펴봅시다:</p>
            <ul>
                <li><code>int num = 42;</code> → 스택에 4바이트를 확보하고 42를 저장</li>
                <li><code>int *ptr = &num;</code> → 스택에 8바이트를 확보하고 num의 주소를 저장</li>
            </ul>
            <p>이제 <code>ptr</code>에는 <code>num</code>의 메모리 주소가 들어있습니다. <code>ptr</code>을 통해 <code>num</code>에 간접적으로 접근할 수 있게 됩니다.</p>

            <div class="warning-box">초기화하지 않은 포인터(와일드 포인터)는 쓰레기 주소를 가지고 있어 매우 위험합니다. 포인터는 반드시 유효한 주소로 초기화하거나 <code>NULL</code>로 초기화하세요.</div>
        `,
        code: `#include <stdio.h>

int main() {
    int num = 42;
    int *ptr = &num;    // ptr에 num의 주소를 저장

    printf("=== 변수 num 정보 ===\\n");
    printf("num의 값:   %d\\n", num);
    printf("num의 주소: %p\\n", (void *)&num);
    printf("num의 크기: %zu 바이트\\n", sizeof(num));

    printf("\\n=== 포인터 ptr 정보 ===\\n");
    printf("ptr의 값 (저장된 주소): %p\\n", (void *)ptr);
    printf("ptr의 주소:            %p\\n", (void *)&ptr);
    printf("ptr의 크기:            %zu 바이트\\n", sizeof(ptr));

    printf("\\n=== 확인 ===\\n");
    printf("ptr == &num ? %s\\n", (ptr == &num) ? "YES" : "NO");

    return 0;
}`,
        output: `=== 변수 num 정보 ===
num의 값:   42
num의 주소: 0x7FFE2A3C18B4
num의 크기: 4 바이트

=== 포인터 ptr 정보 ===
ptr의 값 (저장된 주소): 0x7FFE2A3C18B4
ptr의 주소:            0x7FFE2A3C18B8
ptr의 크기:            8 바이트

=== 확인 ===
ptr == &num ? YES`,
        memory: {
            regions: [
                {
                    name: "스택(Stack) 영역 - main 함수",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18B4", name: "num", value: "42", type: "int", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18B8", name: "ptr", value: "0x7FFE2A3C18B4", type: "ptr", typeLabel: "int* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "ptr", to: "num", label: "ptr이 num의 주소를 저장" }
            ],
            annotations: [
                { type: "info", text: "ptr의 값(0x7FFE2A3C18B4)은 num의 주소와 동일합니다. 포인터는 다른 변수의 위치를 기억합니다." },
                { type: "info", text: "num은 4바이트(int), ptr은 8바이트(64비트 포인터)를 차지합니다." }
            ]
        },
        keyPoints: [
            "포인터는 메모리 주소를 값으로 저장하는 변수입니다.",
            "포인터 선언: 자료형 뒤에 *를 붙입니다 (예: int *ptr).",
            "& 연산자(주소 연산자)로 변수의 메모리 주소를 얻습니다.",
            "64비트 시스템에서 모든 포인터의 크기는 8바이트입니다.",
            "포인터 자체도 변수이므로 자신만의 주소를 가집니다.",
            "초기화하지 않은 포인터는 위험하므로 반드시 초기화해야 합니다."
        ]
    },

    // ========== 4강: 포인터 선언과 초기화 ==========
    {
        title: "포인터 선언과 초기화",
        content: `
            <h4>다양한 포인터 선언 방법</h4>
            <p>포인터는 가리키려는 대상의 자료형에 맞게 선언해야 합니다. <code>int</code> 변수를 가리키려면 <code>int *</code>, <code>char</code> 변수를 가리키려면 <code>char *</code>, <code>double</code> 변수를 가리키려면 <code>double *</code>로 선언합니다. 자료형이 다른 포인터로 변수를 가리키면 데이터를 잘못 해석하게 됩니다.</p>

            <h4>선언 스타일</h4>
            <p><code>*</code>의 위치는 자유롭지만, 의미는 동일합니다:</p>
            <ul>
                <li><code>int *ptr;</code> — C 개발자들이 선호하는 스타일</li>
                <li><code>int* ptr;</code> — C++ 개발자들이 선호하는 스타일</li>
                <li><code>int * ptr;</code> — 양쪽에 공백을 두는 스타일</li>
            </ul>
            <p>하지만 한 줄에 여러 포인터를 선언할 때는 주의가 필요합니다. <code>int *a, b;</code>에서 <code>a</code>는 포인터이지만 <code>b</code>는 일반 <code>int</code> 변수입니다. 포인터를 여러 개 선언하려면 <code>int *a, *b;</code>처럼 각각 <code>*</code>를 붙여야 합니다.</p>

            <h4>포인터 초기화</h4>
            <p>포인터를 선언할 때는 반드시 초기화해야 합니다. 초기화 방법은 세 가지가 있습니다:</p>
            <ul>
                <li><strong>변수의 주소로 초기화:</strong> <code>int *ptr = &num;</code> — 가장 일반적인 방법</li>
                <li><strong>NULL로 초기화:</strong> <code>int *ptr = NULL;</code> — 아직 가리킬 대상이 없을 때</li>
                <li><strong>동적 할당 주소로 초기화:</strong> <code>int *ptr = malloc(sizeof(int));</code></li>
            </ul>

            <div class="danger-box"><strong>절대 하지 말아야 할 것:</strong> 초기화하지 않은 포인터를 사용하는 것! <code>int *ptr;</code>만 선언하고 <code>*ptr = 10;</code>처럼 사용하면 쓰레기 주소에 값을 쓰게 되어 프로그램이 충돌하거나 예측 불가능한 동작을 합니다.</div>

            <h4>NULL 포인터</h4>
            <p><code>NULL</code>은 "아무것도 가리키지 않는 포인터"를 나타내는 특별한 값입니다. 값은 0이며, 포인터가 유효한 메모리를 가리키고 있는지 확인할 때 사용합니다. <code>if (ptr != NULL)</code>로 포인터의 유효성을 검사하는 것은 안전한 프로그래밍의 기본입니다.</p>

            <div class="info-box">C11 표준부터는 <code>NULL</code> 대신 타입 안전한 <code>nullptr</code>을 제공하는 컴파일러도 있지만, 대부분의 C 코드에서는 <code>NULL</code>을 사용합니다.</div>
        `,
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // 다양한 자료형 포인터 선언과 초기화
    int    num = 42;
    char   ch = 'Z';
    double pi = 3.141592;

    int    *ip = &num;     // int 포인터
    char   *cp = &ch;      // char 포인터
    double *dp = &pi;      // double 포인터
    int    *np = NULL;     // NULL 포인터

    printf("=== 각 포인터의 정보 ===\\n\\n");

    printf("[int 포인터 ip]\\n");
    printf("  저장된 주소: %p\\n", (void *)ip);
    printf("  포인터 크기: %zu 바이트\\n\\n", sizeof(ip));

    printf("[char 포인터 cp]\\n");
    printf("  저장된 주소: %p\\n", (void *)cp);
    printf("  포인터 크기: %zu 바이트\\n\\n", sizeof(cp));

    printf("[double 포인터 dp]\\n");
    printf("  저장된 주소: %p\\n", (void *)dp);
    printf("  포인터 크기: %zu 바이트\\n\\n", sizeof(dp));

    printf("[NULL 포인터 np]\\n");
    printf("  저장된 주소: %p\\n", (void *)np);
    printf("  np == NULL ? %s\\n", (np == NULL) ? "YES" : "NO");

    return 0;
}`,
        output: `=== 각 포인터의 정보 ===

[int 포인터 ip]
  저장된 주소: 0x7FFE2A3C18A0
  포인터 크기: 8 바이트

[char 포인터 cp]
  저장된 주소: 0x7FFE2A3C189F
  포인터 크기: 8 바이트

[double 포인터 dp]
  저장된 주소: 0x7FFE2A3C1890
  포인터 크기: 8 바이트

[NULL 포인터 np]
  저장된 주소: (nil)
  np == NULL ? YES`,
        memory: {
            regions: [
                {
                    name: "스택(Stack) 영역 - 원본 변수",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C1890", name: "pi", value: "3.141592", type: "double", typeLabel: "double (8B)", isPointer: false },
                        { address: "0x7FFE2A3C189F", name: "ch", value: "'Z' (0x5A)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C18A0", name: "num", value: "42", type: "int", typeLabel: "int (4B)", isPointer: false }
                    ]
                },
                {
                    name: "스택(Stack) 영역 - 포인터 변수",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18A8", name: "ip", value: "0x7FFE2A3C18A0", type: "ptr", typeLabel: "int* (8B)", isPointer: true },
                        { address: "0x7FFE2A3C18B0", name: "cp", value: "0x7FFE2A3C189F", type: "ptr", typeLabel: "char* (8B)", isPointer: true },
                        { address: "0x7FFE2A3C18B8", name: "dp", value: "0x7FFE2A3C1890", type: "ptr", typeLabel: "double* (8B)", isPointer: true },
                        { address: "0x7FFE2A3C18C0", name: "np", value: "0x0 (NULL)", type: "ptr", typeLabel: "int* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "ip", to: "num", label: "int 포인터" },
                { from: "cp", to: "ch", label: "char 포인터" },
                { from: "dp", to: "pi", label: "double 포인터" }
            ],
            annotations: [
                { type: "info", text: "ip, cp, dp 모두 크기는 8바이트로 동일합니다. 포인터 크기는 자료형과 무관합니다." },
                { type: "warning", text: "np는 NULL(0x0)로 초기화되어 아무 곳도 가리키지 않습니다. NULL 포인터를 역참조하면 프로그램이 충돌합니다." }
            ]
        },
        keyPoints: [
            "포인터는 가리킬 대상의 자료형에 맞게 선언해야 합니다 (int*, char*, double*).",
            "int *a, b; 에서 a만 포인터이고 b는 일반 int입니다. 주의하세요!",
            "포인터는 반드시 유효한 주소 또는 NULL로 초기화해야 합니다.",
            "NULL 포인터는 아무것도 가리키지 않음을 명시적으로 나타냅니다.",
            "모든 종류의 포인터는 64비트 시스템에서 8바이트 크기입니다.",
            "초기화하지 않은 포인터(와일드 포인터)는 프로그램 충돌의 주요 원인입니다."
        ]
    },

    // ========== 5강: 역참조 연산자(*) ==========
    {
        title: "역참조 연산자(*)",
        content: `
            <h4>역참조(Dereference)란?</h4>
            <p>역참조란 포인터가 가리키는 메모리 주소로 찾아가서 그곳에 저장된 <strong>실제 값을 읽거나 수정</strong>하는 것입니다. 역참조 연산자 <code>*</code>를 포인터 변수 앞에 붙이면, 포인터가 저장하고 있는 주소의 메모리에 접근합니다. 이를 "간접 참조(indirect reference)"라고도 부릅니다.</p>

            <h4>* 연산자의 두 가지 역할</h4>
            <p><code>*</code> 기호는 C언어에서 두 가지 서로 다른 역할을 합니다. 혼동하지 마세요:</p>
            <ul>
                <li><strong>선언 시:</strong> <code>int *ptr;</code> — "ptr은 int형 포인터 변수다"라는 의미 (자료형의 일부)</li>
                <li><strong>사용 시:</strong> <code>*ptr = 100;</code> — "ptr이 가리키는 주소의 값에 접근"이라는 의미 (역참조 연산자)</li>
            </ul>

            <h4>역참조로 값 읽기</h4>
            <p>포인터 <code>ptr</code>이 변수 <code>num</code>을 가리키고 있을 때, <code>*ptr</code>은 <code>num</code>의 값과 동일합니다. 즉, <code>*ptr</code>은 <code>num</code>의 별명(alias)처럼 동작합니다. <code>printf("%d", *ptr);</code>는 <code>printf("%d", num);</code>과 같은 결과를 출력합니다.</p>

            <h4>역참조로 값 쓰기</h4>
            <p><code>*ptr = 100;</code>이라고 하면, ptr이 가리키는 메모리 위치(즉, num의 위치)에 100을 기록합니다. 이렇게 하면 <code>num</code>의 값이 100으로 변경됩니다. 이것이 포인터의 핵심 능력입니다 — <strong>다른 변수의 값을 간접적으로 수정</strong>할 수 있습니다.</p>

            <div class="info-box"><code>*ptr</code>을 읽으면(우변에 사용) 값을 가져오고, <code>*ptr</code>에 쓰면(좌변에 사용) 값을 변경합니다. 즉, <code>*ptr</code>은 L-value와 R-value 모두로 사용될 수 있습니다.</div>

            <div class="danger-box"><strong>주의:</strong> NULL 포인터나 유효하지 않은 주소를 역참조하면 <strong>세그멘테이션 폴트(Segmentation Fault)</strong>가 발생하여 프로그램이 즉시 종료됩니다. 역참조 전에 항상 포인터가 유효한지 확인하세요.</div>
        `,
        code: `#include <stdio.h>

int main() {
    int num = 42;
    int *ptr = &num;

    printf("=== 역참조로 값 읽기 ===\\n");
    printf("num의 값:  %d\\n", num);
    printf("*ptr의 값: %d\\n", *ptr);
    printf("num == *ptr ? %s\\n", (num == *ptr) ? "YES" : "NO");

    printf("\\n=== 역참조로 값 쓰기 ===\\n");
    printf("변경 전: num = %d\\n", num);

    *ptr = 100;    // 포인터를 통해 num의 값 변경!

    printf("변경 후: num = %d\\n", num);
    printf("변경 후: *ptr = %d\\n", *ptr);

    printf("\\n=== num을 직접 변경하면 *ptr도 변경 ===\\n");
    num = 999;
    printf("num = %d, *ptr = %d\\n", num, *ptr);

    return 0;
}`,
        output: `=== 역참조로 값 읽기 ===
num의 값:  42
*ptr의 값: 42
num == *ptr ? YES

=== 역참조로 값 쓰기 ===
변경 전: num = 42
변경 후: num = 100
변경 후: *ptr = 100

=== num을 직접 변경하면 *ptr도 변경 ===
num = 999, *ptr = 999`,
        memory: {
            regions: [
                {
                    name: "스택 - 변경 전 (num = 42)",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18B4", name: "num", value: "42", type: "int", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18B8", name: "ptr", value: "0x7FFE2A3C18B4", type: "ptr", typeLabel: "int* (8B)", isPointer: true }
                    ]
                },
                {
                    name: "스택 - *ptr = 100 실행 후",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18B4", name: "num", value: "100", type: "int", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18B8", name: "ptr", value: "0x7FFE2A3C18B4", type: "ptr", typeLabel: "int* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "ptr", to: "num", label: "*ptr = 100 으로 num의 값이 변경됨" }
            ],
            annotations: [
                { type: "info", text: "왼쪽은 변경 전(42), 오른쪽은 *ptr = 100 실행 후 상태입니다. ptr의 값(주소)은 변하지 않았지만, 가리키는 곳의 값이 변했습니다." },
                { type: "warning", text: "*ptr = 100은 ptr 자체를 바꾸는 것이 아니라, ptr이 가리키는 메모리(num)의 값을 바꿉니다." }
            ]
        },
        keyPoints: [
            "역참조 연산자 *는 포인터가 가리키는 메모리의 값에 접근합니다.",
            "*ptr을 우변에 쓰면 값을 읽고, 좌변에 쓰면 값을 변경합니다.",
            "선언 시 *는 '포인터 변수'를 뜻하고, 사용 시 *는 '역참조'를 뜻합니다.",
            "포인터를 통해 원본 변수의 값을 간접적으로 수정할 수 있습니다.",
            "NULL 포인터나 잘못된 주소를 역참조하면 세그멘테이션 폴트가 발생합니다.",
            "*ptr과 num은 같은 메모리를 참조하므로 하나를 변경하면 다른 것도 변경됩니다."
        ]
    },

    // ========== 6강: 포인터와 자료형의 관계 ==========
    {
        title: "포인터와 자료형의 관계",
        content: `
            <h4>왜 포인터에 자료형이 필요한가?</h4>
            <p>포인터가 단순히 메모리 주소만 저장한다면, 왜 <code>int*</code>, <code>char*</code>, <code>double*</code>처럼 자료형을 구분해야 할까요? 그 이유는 <strong>역참조할 때 몇 바이트를 읽을지</strong>를 결정하기 위해서입니다. 메모리는 바이트 단위로 이루어져 있고, 같은 주소에서 시작하더라도 읽는 바이트 수에 따라 전혀 다른 값이 됩니다.</p>

            <h4>자료형에 따른 메모리 접근 크기</h4>
            <ul>
                <li><code>char*</code>로 역참조하면 해당 주소에서 <strong>1바이트</strong>만 읽습니다</li>
                <li><code>int*</code>로 역참조하면 해당 주소에서 <strong>4바이트</strong>를 읽습니다</li>
                <li><code>double*</code>로 역참조하면 해당 주소에서 <strong>8바이트</strong>를 읽습니다</li>
            </ul>
            <p>따라서 같은 주소를 가리키더라도 포인터의 자료형에 따라 읽어오는 값이 달라집니다. 이것이 포인터에 자료형이 필요한 핵심 이유입니다.</p>

            <h4>void 포인터 (void*)</h4>
            <p><code>void*</code>는 "자료형이 지정되지 않은 범용 포인터"입니다. 어떤 자료형의 주소든 저장할 수 있지만, 직접 역참조할 수는 없습니다. 역참조하려면 적절한 자료형으로 캐스팅해야 합니다.</p>
            <ul>
                <li><code>void *vp = &num;</code> — 모든 자료형의 주소 저장 가능</li>
                <li><code>*vp = 10;</code> — 컴파일 에러! void*는 직접 역참조 불가</li>
                <li><code>*(int *)vp = 10;</code> — int*로 캐스팅 후 역참조 가능</li>
            </ul>

            <div class="info-box"><code>void*</code>는 <code>malloc()</code>의 반환 타입이기도 합니다. <code>malloc()</code>은 자료형을 모르는 상태로 메모리를 할당하므로 <code>void*</code>를 반환하며, 사용자가 원하는 타입으로 캐스팅합니다.</div>

            <div class="danger-box">잘못된 자료형의 포인터로 메모리에 접근하면 데이터를 잘못 해석하거나, 메모리 경계를 넘어 접근하여 정의되지 않은 동작(Undefined Behavior)이 발생할 수 있습니다.</div>
        `,
        code: `#include <stdio.h>

int main() {
    int num = 0x41424344;  // ASCII: 'D','C','B','A' (리틀 엔디안)

    int   *ip = &num;
    char  *cp = (char *)&num;
    void  *vp = &num;

    printf("=== 같은 주소, 다른 해석 ===\\n");
    printf("주소: %p\\n\\n", (void *)&num);

    printf("int*로 읽기 (4바이트):  0x%X (%d)\\n", *ip, *ip);
    printf("char*로 읽기 (1바이트): 0x%X ('%c')\\n",
           (unsigned char)*cp, *cp);

    printf("\\n=== 각 바이트 확인 (리틀 엔디안) ===\\n");
    for (int i = 0; i < 4; i++) {
        printf("주소 %p: 0x%02X ('%c')\\n",
               (void *)(cp + i),
               (unsigned char)*(cp + i),
               *(cp + i));
    }

    printf("\\n=== void 포인터 캐스팅 ===\\n");
    printf("void*를 int*로: %d\\n", *(int *)vp);
    printf("void*를 char*로: '%c'\\n", *(char *)vp);

    return 0;
}`,
        output: `=== 같은 주소, 다른 해석 ===
주소: 0x7FFE2A3C18B0

int*로 읽기 (4바이트):  0x41424344 (1094861636)
char*로 읽기 (1바이트): 0x44 ('D')

=== 각 바이트 확인 (리틀 엔디안) ===
주소 0x7FFE2A3C18B0: 0x44 ('D')
주소 0x7FFE2A3C18B1: 0x43 ('C')
주소 0x7FFE2A3C18B2: 0x42 ('B')
주소 0x7FFE2A3C18B3: 0x41 ('A')

=== void 포인터 캐스팅 ===
void*를 int*로: 1094861636
void*를 char*로: 'D'`,
        memory: {
            regions: [
                {
                    name: "스택 - num의 바이트별 저장 (리틀 엔디안)",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18B0", name: "num[byte0]", value: "0x44 ('D')", type: "char", typeLabel: "byte", isPointer: false },
                        { address: "0x7FFE2A3C18B1", name: "num[byte1]", value: "0x43 ('C')", type: "char", typeLabel: "byte", isPointer: false },
                        { address: "0x7FFE2A3C18B2", name: "num[byte2]", value: "0x42 ('B')", type: "char", typeLabel: "byte", isPointer: false },
                        { address: "0x7FFE2A3C18B3", name: "num[byte3]", value: "0x41 ('A')", type: "char", typeLabel: "byte", isPointer: false }
                    ]
                },
                {
                    name: "스택 - 포인터 변수들",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18B8", name: "ip", value: "0x7FFE2A3C18B0", type: "ptr", typeLabel: "int* (8B)", isPointer: true },
                        { address: "0x7FFE2A3C18C0", name: "cp", value: "0x7FFE2A3C18B0", type: "char*", typeLabel: "char* (8B)", isPointer: true },
                        { address: "0x7FFE2A3C18C8", name: "vp", value: "0x7FFE2A3C18B0", type: "void*", typeLabel: "void* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "ip", to: "num[byte0]", label: "4바이트 읽음 (0x41424344)" },
                { from: "cp", to: "num[byte0]", label: "1바이트 읽음 (0x44)" },
                { from: "vp", to: "num[byte0]", label: "캐스팅 필요" }
            ],
            annotations: [
                { type: "info", text: "세 포인터 모두 같은 주소(0x7FFE2A3C18B0)를 가리키지만, 자료형에 따라 읽는 바이트 수가 다릅니다." },
                { type: "warning", text: "리틀 엔디안 시스템에서는 낮은 바이트(0x44)가 낮은 주소에 먼저 저장됩니다." }
            ]
        },
        keyPoints: [
            "포인터의 자료형은 역참조 시 몇 바이트를 읽을지 결정합니다.",
            "char*는 1바이트, int*는 4바이트, double*는 8바이트를 읽습니다.",
            "같은 주소라도 포인터 자료형에 따라 해석되는 값이 달라집니다.",
            "void*는 범용 포인터로, 어떤 주소든 저장 가능하지만 직접 역참조할 수 없습니다.",
            "void*를 역참조하려면 적절한 자료형으로 캐스팅해야 합니다.",
            "리틀 엔디안 시스템에서는 낮은 바이트가 낮은 주소에 먼저 저장됩니다."
        ]
    },

    // ========== 7강: 포인터 연산 ==========
    {
        title: "포인터 연산",
        content: `
            <h4>포인터 연산이란?</h4>
            <p>포인터에 정수를 더하거나 빼면, 단순히 주소값에 그 숫자를 더하는 것이 아닙니다. <strong>포인터의 자료형 크기만큼 곱해서</strong> 주소가 이동합니다. 이것이 포인터 연산(Pointer Arithmetic)의 핵심입니다. 예를 들어 <code>int*</code> 포인터에 1을 더하면 주소가 4바이트(sizeof(int))만큼 증가합니다.</p>

            <h4>포인터 + 정수 연산</h4>
            <p>포인터 <code>p</code>에 정수 <code>n</code>을 더하면:</p>
            <ul>
                <li><code>p + n</code>의 실제 주소 = <code>p의 주소 + n * sizeof(*p)</code></li>
                <li><code>int *p</code>일 때 <code>p + 1</code> → 주소가 4바이트 증가</li>
                <li><code>char *p</code>일 때 <code>p + 1</code> → 주소가 1바이트 증가</li>
                <li><code>double *p</code>일 때 <code>p + 1</code> → 주소가 8바이트 증가</li>
            </ul>

            <h4>포인터 - 정수 연산</h4>
            <p>포인터에서 정수를 빼면 반대 방향으로 이동합니다. <code>p - n</code>의 실제 주소는 <code>p의 주소 - n * sizeof(*p)</code>입니다.</p>

            <h4>포인터 간 뺄셈</h4>
            <p>같은 자료형의 두 포인터를 빼면 그 사이에 있는 <strong>요소의 개수</strong>를 반환합니다. 바이트 수가 아닙니다! 예를 들어 <code>int</code> 배열에서 두 포인터의 차이가 3이면 그 사이에 int 3개가 있다는 뜻입니다.</p>

            <div class="info-box">포인터 연산은 배열을 다룰 때 매우 유용합니다. 배열의 요소를 순회하거나 특정 위치에 접근할 때 포인터 연산을 활용합니다. 다음 강의에서 배열과 포인터의 관계를 자세히 배웁니다.</div>

            <h4>증감 연산자와 포인터</h4>
            <p><code>ptr++</code>은 포인터를 다음 요소로 이동시키고, <code>ptr--</code>는 이전 요소로 이동시킵니다. 이 역시 자료형 크기만큼 이동합니다.</p>

            <div class="warning-box">포인터 연산으로 할당된 메모리 범위를 벗어나면 정의되지 않은 동작이 발생합니다. 배열 경계 내에서만 포인터 연산을 사용하세요.</div>
        `,
        code: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ip = arr;           // 배열의 첫 번째 요소를 가리킴
    char *cp = (char *)arr;  // 같은 주소를 char*로

    printf("=== int* 포인터 연산 (4바이트씩 이동) ===\\n");
    printf("ip     = %p, *ip   = %d\\n", (void *)ip, *ip);
    printf("ip + 1 = %p, *(ip+1) = %d\\n", (void *)(ip+1), *(ip+1));
    printf("ip + 2 = %p, *(ip+2) = %d\\n", (void *)(ip+2), *(ip+2));
    printf("ip + 3 = %p, *(ip+3) = %d\\n", (void *)(ip+3), *(ip+3));

    printf("\\n=== char* 포인터 연산 (1바이트씩 이동) ===\\n");
    printf("cp     = %p\\n", (void *)cp);
    printf("cp + 1 = %p\\n", (void *)(cp+1));
    printf("cp + 4 = %p (다음 int 위치)\\n", (void *)(cp+4));

    printf("\\n=== 포인터 간 뺄셈 ===\\n");
    int *start = &arr[0];
    int *end   = &arr[4];
    printf("end - start = %td (요소 수)\\n", end - start);
    printf("주소 차이: %td 바이트\\n",
           (char *)end - (char *)start);

    return 0;
}`,
        output: `=== int* 포인터 연산 (4바이트씩 이동) ===
ip     = 0x7FFE2A3C1890, *ip   = 10
ip + 1 = 0x7FFE2A3C1894, *(ip+1) = 20
ip + 2 = 0x7FFE2A3C1898, *(ip+2) = 30
ip + 3 = 0x7FFE2A3C189C, *(ip+3) = 40

=== char* 포인터 연산 (1바이트씩 이동) ===
cp     = 0x7FFE2A3C1890
cp + 1 = 0x7FFE2A3C1891
cp + 4 = 0x7FFE2A3C1894 (다음 int 위치)

=== 포인터 간 뺄셈 ===
end - start = 4 (요소 수)
주소 차이: 16 바이트`,
        memory: {
            regions: [
                {
                    name: "스택 - int 배열 arr[5]",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C1890", name: "arr[0]", value: "10", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C1894", name: "arr[1]", value: "20", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C1898", name: "arr[2]", value: "30", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C189C", name: "arr[3]", value: "40", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18A0", name: "arr[4]", value: "50", type: "arr", typeLabel: "int (4B)", isPointer: false }
                    ]
                },
                {
                    name: "스택 - 포인터 변수",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18A8", name: "ip", value: "0x7FFE2A3C1890", type: "ptr", typeLabel: "int* (8B)", isPointer: true },
                        { address: "0x7FFE2A3C18B0", name: "ip+1", value: "0x7FFE2A3C1894", type: "ptr", typeLabel: "+4바이트", isPointer: true },
                        { address: "0x7FFE2A3C18B8", name: "ip+2", value: "0x7FFE2A3C1898", type: "ptr", typeLabel: "+8바이트", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "ip", to: "arr[0]", label: "ip → arr[0]" },
                { from: "ip+1", to: "arr[1]", label: "ip+1 → arr[1] (4바이트 이동)" },
                { from: "ip+2", to: "arr[2]", label: "ip+2 → arr[2] (8바이트 이동)" }
            ],
            annotations: [
                { type: "info", text: "int* 포인터에 +1 하면 주소가 4(sizeof(int))만큼 증가하여 다음 int 요소를 가리킵니다." },
                { type: "warning", text: "char* 포인터에 +1 하면 주소가 1만 증가합니다. 같은 +1이라도 자료형에 따라 이동량이 다릅니다!" }
            ]
        },
        keyPoints: [
            "포인터 + n은 주소를 n * sizeof(자료형) 만큼 이동시킵니다.",
            "int*에 +1하면 4바이트 이동, char*에 +1하면 1바이트 이동합니다.",
            "포인터 간 뺄셈은 바이트 수가 아닌 요소 개수를 반환합니다.",
            "ptr++, ptr--로 포인터를 다음/이전 요소로 이동시킬 수 있습니다.",
            "포인터 연산은 배열 순회에 핵심적으로 사용됩니다.",
            "할당된 메모리 범위를 벗어나는 포인터 연산은 정의되지 않은 동작입니다."
        ]
    },

    // ========== 8강: 배열과 메모리 ==========
    {
        title: "배열과 메모리",
        content: `
            <h4>배열의 메모리 구조</h4>
            <p>배열은 <strong>같은 자료형의 데이터를 연속된 메모리 공간</strong>에 저장하는 자료구조입니다. <code>int arr[5];</code>를 선언하면 메모리에서 <code>5 * sizeof(int) = 20바이트</code>의 연속된 공간이 확보됩니다. 배열의 요소들은 반드시 물리적으로 인접한 메모리에 위치합니다.</p>

            <h4>배열명의 의미</h4>
            <p>C언어에서 배열명은 <strong>배열의 첫 번째 요소의 주소</strong>를 나타냅니다. 즉, <code>arr</code>과 <code>&arr[0]</code>은 동일한 값을 가집니다. 이것은 매우 중요한 특성으로, 배열명이 사실상 포인터처럼 동작하는 기반이 됩니다.</p>
            <ul>
                <li><code>arr</code> == <code>&arr[0]</code> → 첫 번째 요소의 주소</li>
                <li><code>arr + 1</code> == <code>&arr[1]</code> → 두 번째 요소의 주소</li>
                <li><code>arr + i</code> == <code>&arr[i]</code> → i번째 요소의 주소</li>
            </ul>

            <h4>배열 인덱스와 주소 계산</h4>
            <p><code>arr[i]</code>의 메모리 주소는 다음과 같이 계산됩니다:</p>
            <p><code>arr[i]의 주소 = 배열 시작 주소 + i * sizeof(원소)</code></p>
            <p>예를 들어 <code>int arr[5]</code>의 시작 주소가 <code>0x7FFE2A3C1890</code>이면:</p>
            <ul>
                <li><code>arr[0]</code> → <code>0x7FFE2A3C1890</code></li>
                <li><code>arr[1]</code> → <code>0x7FFE2A3C1894</code> (+4)</li>
                <li><code>arr[2]</code> → <code>0x7FFE2A3C1898</code> (+8)</li>
            </ul>

            <div class="info-box">배열의 연속 저장 특성 덕분에 인덱스만으로 O(1) 시간에 임의 접근(Random Access)이 가능합니다. 이것이 배열의 가장 큰 장점입니다.</div>

            <h4>배열의 크기</h4>
            <p><code>sizeof(arr)</code>은 배열 전체의 바이트 크기를 반환합니다. 배열 요소의 개수를 구하려면 <code>sizeof(arr) / sizeof(arr[0])</code>을 사용합니다.</p>

            <div class="warning-box">배열이 함수의 매개변수로 전달되면 포인터로 변환(decay)되므로, 함수 내에서 <code>sizeof</code>로 배열 크기를 알 수 없습니다. 배열 크기를 별도의 매개변수로 전달해야 합니다.</div>
        `,
        code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    printf("=== 배열 기본 정보 ===\\n");
    printf("배열 전체 크기: %zu 바이트\\n", sizeof(arr));
    printf("요소 하나 크기: %zu 바이트\\n", sizeof(arr[0]));
    printf("요소 개수:      %zu\\n", sizeof(arr) / sizeof(arr[0]));

    printf("\\n=== 배열명과 첫 번째 요소 주소 ===\\n");
    printf("arr      = %p\\n", (void *)arr);
    printf("&arr[0]  = %p\\n", (void *)&arr[0]);
    printf("동일한가? %s\\n", (arr == &arr[0]) ? "YES" : "NO");

    printf("\\n=== 각 요소의 주소와 값 ===\\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d]: 주소 = %p, 값 = %d\\n",
               i, (void *)&arr[i], arr[i]);
    }

    printf("\\n=== 주소 간격 확인 ===\\n");
    for (int i = 0; i < 4; i++) {
        printf("&arr[%d] - &arr[%d] = %td 바이트\\n",
               i+1, i,
               (char *)&arr[i+1] - (char *)&arr[i]);
    }

    return 0;
}`,
        output: `=== 배열 기본 정보 ===
배열 전체 크기: 20 바이트
요소 하나 크기: 4 바이트
요소 개수:      5

=== 배열명과 첫 번째 요소 주소 ===
arr      = 0x7FFE2A3C1890
&arr[0]  = 0x7FFE2A3C1890
동일한가? YES

=== 각 요소의 주소와 값 ===
arr[0]: 주소 = 0x7FFE2A3C1890, 값 = 10
arr[1]: 주소 = 0x7FFE2A3C1894, 값 = 20
arr[2]: 주소 = 0x7FFE2A3C1898, 값 = 30
arr[3]: 주소 = 0x7FFE2A3C189C, 값 = 40
arr[4]: 주소 = 0x7FFE2A3C18A0, 값 = 50

=== 주소 간격 확인 ===
&arr[1] - &arr[0] = 4 바이트
&arr[2] - &arr[1] = 4 바이트
&arr[3] - &arr[2] = 4 바이트
&arr[4] - &arr[3] = 4 바이트`,
        memory: {
            regions: [
                {
                    name: "스택 - int arr[5] (연속 메모리)",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C1890", name: "arr[0]", value: "10", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C1894", name: "arr[1]", value: "20", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C1898", name: "arr[2]", value: "30", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C189C", name: "arr[3]", value: "40", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18A0", name: "arr[4]", value: "50", type: "arr", typeLabel: "int (4B)", isPointer: false }
                    ]
                }
            ],
            arrows: [],
            annotations: [
                { type: "info", text: "배열 요소들은 메모리에 연속으로 저장됩니다. 각 int 요소 사이의 간격은 정확히 4바이트입니다." },
                { type: "info", text: "arr(배열명) = &arr[0] = 0x7FFE2A3C1890 → 배열명은 첫 번째 요소의 주소입니다." }
            ]
        },
        keyPoints: [
            "배열은 같은 자료형의 데이터를 연속된 메모리 공간에 저장합니다.",
            "배열명(arr)은 배열 첫 번째 요소의 주소(&arr[0])와 동일합니다.",
            "arr[i]의 주소 = 시작 주소 + i * sizeof(원소) 로 계산됩니다.",
            "sizeof(arr) / sizeof(arr[0])으로 배열 요소 개수를 구할 수 있습니다.",
            "연속 저장 덕분에 인덱스로 O(1) 임의 접근이 가능합니다.",
            "함수에 배열을 전달하면 포인터로 변환되어 크기 정보가 사라집니다."
        ]
    },

    // ========== 9강: 배열과 포인터의 관계 ==========
    {
        title: "배열과 포인터의 관계",
        content: `
            <h4>배열과 포인터의 핵심 관계</h4>
            <p>C언어에서 배열과 포인터는 매우 밀접한 관계가 있습니다. 가장 중요한 등가 관계는 다음과 같습니다:</p>
            <p style="text-align:center;font-size:18px;font-weight:bold;color:#1d4ed8;margin:16px 0;"><code>arr[i]</code> == <code>*(arr + i)</code></p>
            <p>이 관계는 배열 인덱스 접근이 사실 포인터 연산의 편의 표기법(syntactic sugar)임을 의미합니다. <code>arr[i]</code>라고 쓰면, 컴파일러는 내부적으로 <code>*(arr + i)</code>로 변환하여 처리합니다.</p>

            <h4>배열명은 포인터 상수</h4>
            <p>배열명은 포인터와 비슷하게 동작하지만 중요한 차이가 있습니다. 배열명은 <strong>포인터 상수(constant pointer)</strong>입니다:</p>
            <ul>
                <li><code>arr = &other;</code> — 불가능! 배열명에 다른 주소를 대입할 수 없음</li>
                <li><code>arr++;</code> — 불가능! 배열명을 증가시킬 수 없음</li>
                <li><code>int *ptr = arr;</code> — 가능! 배열명을 포인터에 대입 가능</li>
                <li><code>ptr++;</code> — 가능! 포인터 변수는 변경 가능</li>
            </ul>

            <h4>포인터로 배열 순회</h4>
            <p>포인터 변수를 사용하면 배열을 효율적으로 순회할 수 있습니다. 포인터를 배열의 시작 주소로 초기화한 후, <code>ptr++</code>로 다음 요소로 이동하면서 접근합니다. 인덱스 없이도 배열의 모든 요소에 접근할 수 있습니다.</p>

            <div class="info-box">흥미로운 사실: <code>arr[i]</code>와 <code>i[arr]</code>은 동일합니다! 둘 다 <code>*(arr + i)</code>로 변환되기 때문입니다. 물론 <code>i[arr]</code>은 가독성이 나쁘므로 사용하지 않습니다.</div>

            <h4>배열과 포인터의 차이점</h4>
            <ul>
                <li><code>sizeof(arr)</code>은 배열 전체 크기를 반환하지만, <code>sizeof(ptr)</code>은 포인터 크기(8바이트)만 반환합니다</li>
                <li>배열명은 상수이므로 값을 변경할 수 없지만, 포인터 변수는 다른 주소를 대입할 수 있습니다</li>
                <li><code>&arr</code>은 배열 전체의 주소이고, <code>&ptr</code>은 포인터 변수 자체의 주소입니다</li>
            </ul>

            <div class="warning-box">배열을 함수 매개변수로 전달하면 <code>int arr[]</code>은 <code>int *arr</code>과 동일하게 취급됩니다. 이때 배열의 크기 정보가 사라지므로 주의하세요.</div>
        `,
        code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int *ptr = arr;  // ptr = &arr[0]

    printf("=== arr[i] vs *(arr+i) 동치 관계 ===\\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d,  *(arr+%d) = %d,  *(ptr+%d) = %d\\n",
               i, arr[i], i, *(arr+i), i, *(ptr+i));
    }

    printf("\\n=== 포인터로 배열 순회 ===\\n");
    int *p = arr;
    for (int i = 0; i < 5; i++) {
        printf("*p = %d (주소: %p)\\n", *p, (void *)p);
        p++;  // 다음 요소로 이동
    }

    printf("\\n=== sizeof 차이 ===\\n");
    printf("sizeof(arr) = %zu (배열 전체)\\n", sizeof(arr));
    printf("sizeof(ptr) = %zu (포인터 크기)\\n", sizeof(ptr));

    printf("\\n=== 주소 비교 ===\\n");
    printf("arr    = %p\\n", (void *)arr);
    printf("&arr   = %p\\n", (void *)&arr);
    printf("ptr    = %p\\n", (void *)ptr);
    printf("&ptr   = %p\\n", (void *)&ptr);

    return 0;
}`,
        output: `=== arr[i] vs *(arr+i) 동치 관계 ===
arr[0] = 10,  *(arr+0) = 10,  *(ptr+0) = 10
arr[1] = 20,  *(arr+1) = 20,  *(ptr+1) = 20
arr[2] = 30,  *(arr+2) = 30,  *(ptr+2) = 30
arr[3] = 40,  *(arr+3) = 40,  *(ptr+3) = 40
arr[4] = 50,  *(arr+4) = 50,  *(ptr+4) = 50

=== 포인터로 배열 순회 ===
*p = 10 (주소: 0x7FFE2A3C1890)
*p = 20 (주소: 0x7FFE2A3C1894)
*p = 30 (주소: 0x7FFE2A3C1898)
*p = 40 (주소: 0x7FFE2A3C189C)
*p = 50 (주소: 0x7FFE2A3C18A0)

=== sizeof 차이 ===
sizeof(arr) = 20 (배열 전체)
sizeof(ptr) = 8 (포인터 크기)

=== 주소 비교 ===
arr    = 0x7FFE2A3C1890
&arr   = 0x7FFE2A3C1890
ptr    = 0x7FFE2A3C1890
&ptr   = 0x7FFE2A3C18A8`,
        memory: {
            regions: [
                {
                    name: "스택 - int arr[5]",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C1890", name: "arr[0]", value: "10", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C1894", name: "arr[1]", value: "20", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C1898", name: "arr[2]", value: "30", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C189C", name: "arr[3]", value: "40", type: "arr", typeLabel: "int (4B)", isPointer: false },
                        { address: "0x7FFE2A3C18A0", name: "arr[4]", value: "50", type: "arr", typeLabel: "int (4B)", isPointer: false }
                    ]
                },
                {
                    name: "스택 - 포인터 변수",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C18A8", name: "ptr", value: "0x7FFE2A3C1890", type: "ptr", typeLabel: "int* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "ptr", to: "arr[0]", label: "ptr = arr = &arr[0]" }
            ],
            annotations: [
                { type: "info", text: "arr[i] == *(arr + i) == *(ptr + i) == ptr[i] : 모두 같은 결과입니다." },
                { type: "warning", text: "sizeof(arr)=20 vs sizeof(ptr)=8 — 배열명과 포인터는 sizeof에서 다른 결과를 반환합니다." },
                { type: "info", text: "arr과 &arr의 값은 같지만, &ptr은 포인터 변수 자체의 주소로 다른 값입니다." }
            ]
        },
        keyPoints: [
            "arr[i] == *(arr + i) : 배열 인덱스는 포인터 연산의 편의 표기입니다.",
            "배열명은 포인터 상수로, 값을 변경할 수 없습니다 (arr = ... 불가).",
            "포인터 변수는 변경 가능하므로 ptr++로 배열을 순회할 수 있습니다.",
            "sizeof(배열명)은 전체 크기, sizeof(포인터)는 항상 8바이트(64비트)입니다.",
            "함수에 배열을 전달하면 포인터로 변환되어(decay) 크기 정보가 사라집니다.",
            "arr[i]와 i[arr]은 동일하지만 후자는 사용하지 않습니다."
        ]
    },

    // ========== 10강: 문자열과 포인터 ==========
    {
        title: "문자열과 포인터",
        content: `
            <h4>C언어의 문자열</h4>
            <p>C언어에는 별도의 문자열 자료형이 없습니다. 문자열은 <strong>null 문자(<code>'\0'</code>)로 끝나는 char 배열</strong>입니다. 예를 들어 <code>"Hello"</code>라는 문자열은 메모리에 <code>'H', 'e', 'l', 'l', 'o', '\0'</code>으로 총 6바이트가 저장됩니다. 이 마지막 <code>'\0'</code>(null terminator)이 문자열의 끝을 표시합니다.</p>

            <h4>char 배열 vs char 포인터</h4>
            <p>문자열을 다루는 두 가지 방법이 있으며, 중요한 차이가 있습니다:</p>
            <ul>
                <li><code>char str1[] = "Hello";</code> — <strong>스택</strong>에 배열이 생성되고 문자열이 복사됩니다. 내용 수정 가능!</li>
                <li><code>char *str2 = "Hello";</code> — <strong>데이터(읽기 전용) 영역</strong>의 문자열 리터럴을 가리키는 포인터입니다. 내용 수정 불가!</li>
            </ul>

            <h4>메모리 배치의 차이</h4>
            <p><code>char str1[] = "Hello";</code>의 경우, 컴파일러는 스택에 6바이트를 확보하고 "Hello\0"를 복사합니다. <code>str1</code>은 이 스택 배열의 시작 주소입니다. <code>str1[0] = 'h';</code>와 같은 수정이 가능합니다.</p>
            <p><code>char *str2 = "Hello";</code>의 경우, "Hello\0"는 프로그램의 데이터(읽기 전용) 영역에 저장되고, <code>str2</code>는 스택에 8바이트 포인터로 그 주소를 저장합니다. <code>str2[0] = 'h';</code>는 읽기 전용 메모리를 수정하려는 시도이므로 정의되지 않은 동작(보통 크래시)이 발생합니다.</p>

            <div class="danger-box"><strong>주의:</strong> <code>char *str = "Hello";</code>에서 <code>str[0] = 'X';</code>와 같이 문자열 리터럴을 수정하면 세그멘테이션 폴트가 발생합니다! 수정이 필요하면 반드시 <code>char str[] = "Hello";</code>로 선언하세요.</div>

            <h4>문자열 포인터의 활용</h4>
            <p>포인터를 사용하여 문자열의 각 문자를 순회할 수 있습니다. <code>while (*p != '\0')</code> 또는 간단히 <code>while (*p)</code>로 문자열 끝까지 반복할 수 있습니다. <code>'\0'</code>의 ASCII 값은 0이므로 false로 평가됩니다.</p>

            <div class="info-box"><code>char *str = "Hello";</code>에서 <code>str</code> 자체는 수정 가능합니다. 즉, <code>str = "World";</code>처럼 다른 문자열 리터럴을 가리키도록 변경할 수 있습니다. 수정 불가능한 것은 가리키는 곳의 내용입니다.</div>
        `,
        code: `#include <stdio.h>
#include <string.h>

int main() {
    char str1[] = "Hello";     // 스택에 배열 생성 (수정 가능)
    char *str2  = "World";     // 데이터 영역의 리터럴 (수정 불가)

    printf("=== char 배열 (str1) ===\\n");
    printf("내용: %s\\n", str1);
    printf("주소: %p (스택 영역)\\n", (void *)str1);
    printf("크기: %zu 바이트 (null 포함)\\n", sizeof(str1));

    printf("\\n=== char 포인터 (str2) ===\\n");
    printf("내용: %s\\n", str2);
    printf("가리키는 주소: %p (데이터 영역)\\n", (void *)str2);
    printf("포인터 크기:   %zu 바이트\\n", sizeof(str2));

    // str1은 수정 가능
    str1[0] = 'h';
    printf("\\n=== str1 수정 후 ===\\n");
    printf("str1 = %s (수정 성공!)\\n", str1);

    // str2는 다른 리터럴을 가리킬 수 있음
    str2 = "C언어";
    printf("str2 = %s (다른 리터럴 가리킴)\\n", str2);

    printf("\\n=== 포인터로 문자열 순회 ===\\n");
    char *p = str1;
    while (*p != '\0') {
        printf("'%c' (0x%02X) ", *p, (unsigned char)*p);
        p++;
    }
    printf("'\0' (0x00)\\n");

    return 0;
}`,
        output: `=== char 배열 (str1) ===
내용: Hello
주소: 0x7FFE2A3C1890 (스택 영역)
크기: 6 바이트 (null 포함)

=== char 포인터 (str2) ===
내용: World
가리키는 주소: 0x00404010 (데이터 영역)
포인터 크기:   8 바이트

=== str1 수정 후 ===
str1 = hello (수정 성공!)
str2 = C언어 (다른 리터럴 가리킴)

=== 포인터로 문자열 순회 ===
'h' (0x68) 'e' (0x65) 'l' (0x6C) 'l' (0x6C) 'o' (0x6F) '\0' (0x00)`,
        memory: {
            regions: [
                {
                    name: "데이터(Data) 영역 - 문자열 리터럴",
                    type: "data",
                    cells: [
                        { address: "0x00404010", name: "\"World\"[0]", value: "'W' (0x57)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x00404011", name: "\"World\"[1]", value: "'o' (0x6F)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x00404012", name: "\"World\"[2]", value: "'r' (0x72)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x00404013", name: "\"World\"[3]", value: "'l' (0x6C)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x00404014", name: "\"World\"[4]", value: "'d' (0x64)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x00404015", name: "\"World\"[5]", value: "'\0' (0x00)", type: "char", typeLabel: "char (1B)", isPointer: false }
                    ]
                },
                {
                    name: "스택(Stack) 영역",
                    type: "stack",
                    cells: [
                        { address: "0x7FFE2A3C1890", name: "str1[0]", value: "'H' (0x48)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C1891", name: "str1[1]", value: "'e' (0x65)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C1892", name: "str1[2]", value: "'l' (0x6C)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C1893", name: "str1[3]", value: "'l' (0x6C)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C1894", name: "str1[4]", value: "'o' (0x6F)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C1895", name: "str1[5]", value: "'\0' (0x00)", type: "char", typeLabel: "char (1B)", isPointer: false },
                        { address: "0x7FFE2A3C18A0", name: "str2", value: "0x00404010", type: "char*", typeLabel: "char* (8B)", isPointer: true }
                    ]
                }
            ],
            arrows: [
                { from: "str2", to: "\"World\"[0]", label: "데이터 영역의 리터럴을 가리킴" }
            ],
            annotations: [
                { type: "info", text: "str1[]은 스택에 문자열을 복사하여 저장합니다. 수정 가능한 자신만의 사본입니다." },
                { type: "danger", text: "str2는 데이터(읽기 전용) 영역의 리터럴을 가리킵니다. *str2 = 'X'는 세그멘테이션 폴트!" },
                { type: "warning", text: "str1은 6바이트(배열), str2는 8바이트(포인터). sizeof 결과가 다릅니다." }
            ]
        },
        keyPoints: [
            "C 문자열은 '\0'(null)으로 끝나는 char 배열입니다.",
            "char str[] = \"Hello\"는 스택에 복사되어 수정 가능합니다.",
            "char *str = \"Hello\"는 읽기 전용 데이터 영역을 가리켜 수정 불가능합니다.",
            "문자열 리터럴을 수정하면 세그멘테이션 폴트가 발생합니다.",
            "sizeof(배열)은 문자열+null 바이트 수, sizeof(포인터)는 항상 8바이트입니다.",
            "포인터를 이용한 문자열 순회: while (*p) { ... p++; }"
        ]
    },

// Lecture 11: Call by Value vs Call by Reference
{
    title: "Call by Value vs Call by Reference",
    content: `
        <h4>값에 의한 호출 (Call by Value)</h4>
        <p>함수에 인자를 전달할 때, <strong>값이 복사</strong>되어 매개변수에 전달됩니다. 따라서 함수 내부에서 매개변수를 변경해도 <strong>원본 변수에는 영향이 없습니다</strong>.</p>
        <ul>
            <li>함수 호출 시 인자의 <strong>값</strong>만 복사됨</li>
            <li>매개변수는 독립적인 지역 변수</li>
            <li>함수 내부에서 값을 변경해도 원본은 그대로</li>
        </ul>

        <h4>참조에 의한 호출 (Call by Reference)</h4>
        <p>C언어에는 엄밀히 참조(reference)가 없지만, <strong>포인터를 이용하여</strong> 참조에 의한 호출과 같은 효과를 낼 수 있습니다. 함수에 변수의 <strong>주소</strong>를 전달하면, 함수 내부에서 포인터를 통해 원본 변수에 접근하고 변경할 수 있습니다.</p>
        <ul>
            <li>함수에 변수의 <strong>주소(&amp;변수)</strong>를 전달</li>
            <li>매개변수는 포인터로 선언</li>
            <li>역참조(<code>*</code>)를 통해 원본 값 변경 가능</li>
        </ul>

        <h4>swap 함수 비교</h4>
        <p>두 변수의 값을 교환하는 swap 함수는 Call by Value와 Call by Reference의 차이를 보여주는 대표적인 예제입니다.</p>

        <div class="warning-box">
            <strong>주의:</strong> Call by Value로 구현한 swap 함수는 지역 변수만 교환하므로 원본 변수에 영향을 주지 않습니다. 반드시 포인터를 사용해야 합니다.
        </div>

        <div class="info-box">
            <strong>핵심:</strong> 함수에서 외부 변수의 값을 변경하려면 반드시 해당 변수의 주소를 포인터로 전달해야 합니다.
        </div>
    `,
    code: `#include <stdio.h>

// 실패하는 swap (Call by Value)
void swap_fail(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("[swap_fail 내부] a=%d, b=%d\\n", a, b);
}

// 성공하는 swap (Call by Reference - 포인터 사용)
void swap_success(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
    printf("[swap_success 내부] *a=%d, *b=%d\\n", *a, *b);
}

int main(void) {
    int x = 10, y = 20;

    printf("=== 교환 전 ===\\n");
    printf("x=%d, y=%d\\n\\n", x, y);

    // Call by Value (실패)
    swap_fail(x, y);
    printf("[swap_fail 후] x=%d, y=%d\\n\\n", x, y);

    // Call by Reference (성공)
    swap_success(&x, &y);
    printf("[swap_success 후] x=%d, y=%d\\n", x, y);

    return 0;
}`,
    output: `=== 교환 전 ===
x=10, y=20

[swap_fail 내부] a=20, b=10
[swap_fail 후] x=10, y=20

[swap_success 내부] *a=20, *b=10
[swap_success 후] x=20, y=10`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "x", value: "10 → 20", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0044", name: "y", value: "20 → 10", type: "int", typeLabel: "int", isPointer: false }
                ]
            },
            {
                name: "Stack - swap_fail()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0020", name: "a", value: "10 (복사본)", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0024", name: "b", value: "20 (복사본)", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0028", name: "temp", value: "10", type: "int", typeLabel: "int", isPointer: false }
                ]
            },
            {
                name: "Stack - swap_success()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0010", name: "a", value: "0x7FFE0040", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0018", name: "b", value: "0x7FFE0044", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0008", name: "temp", value: "10", type: "int", typeLabel: "int", isPointer: false }
                ]
            }
        ],
        arrows: [
            { from: "a (swap_success)", to: "x (main)", label: "포인터가 원본을 가리킴" },
            { from: "b (swap_success)", to: "y (main)", label: "포인터가 원본을 가리킴" }
        ],
        annotations: [
            { type: "warning", text: "swap_fail의 a, b는 x, y의 복사본이므로 교환해도 원본에 영향 없음" },
            { type: "info", text: "swap_success의 a, b는 x, y의 주소를 담고 있어 역참조로 원본 변경 가능" }
        ]
    },
    keyPoints: [
        "Call by Value: 값이 복사되어 전달되므로 함수 내부에서 변경해도 원본에 영향 없음",
        "Call by Reference(포인터): 주소를 전달하면 역참조(*)를 통해 원본 변수를 직접 변경 가능",
        "swap 함수는 반드시 포인터를 매개변수로 받아야 올바르게 동작함",
        "함수 호출 시 &연산자로 주소를 전달하고, 함수 내부에서 *연산자로 역참조하여 값 변경"
    ]
},

// Lecture 12: 포인터 매개변수 활용
{
    title: "포인터 매개변수 활용",
    content: `
        <h4>여러 값을 함수에서 변경하기</h4>
        <p>C 함수는 <strong>하나의 값만 return</strong>할 수 있습니다. 그러나 포인터 매개변수를 사용하면 함수에서 <strong>여러 개의 변수를 동시에 변경</strong>할 수 있습니다.</p>
        <ul>
            <li>return은 하나의 값만 반환 가능</li>
            <li>포인터 매개변수를 통해 여러 결과를 동시에 전달</li>
            <li>함수의 반환값은 성공/실패 여부로 사용하고, 실제 결과는 포인터로 전달하는 패턴이 일반적</li>
        </ul>

        <h4>scanf가 &를 사용하는 이유</h4>
        <p><code>scanf</code> 함수는 사용자로부터 입력을 받아 변수에 저장하는 함수입니다. 변수에 값을 <strong>직접 써넣어야</strong> 하므로, 변수의 <strong>주소(&amp;)</strong>를 전달해야 합니다.</p>

        <div class="info-box">
            <strong>scanf 원리:</strong> <code>scanf("%d", &amp;num)</code>에서 &amp;num은 num의 주소를 scanf에 전달합니다. scanf는 이 주소를 통해 사용자 입력값을 num에 직접 저장합니다.
        </div>

        <h4>실전 활용 패턴</h4>
        <p>아래 예제는 두 수의 합과 차를 동시에 계산하여 포인터 매개변수를 통해 반환하는 함수를 보여줍니다.</p>

        <div class="info-box">
            <strong>팁:</strong> 출력 매개변수(output parameter)라고도 부르며, 함수가 계산 결과를 호출자에게 돌려주는 중요한 패턴입니다.
        </div>
    `,
    code: `#include <stdio.h>

// 두 수의 합과 차를 동시에 계산
void calc_sum_diff(int a, int b, int *sum, int *diff) {
    *sum = a + b;    // 포인터를 통해 합을 저장
    *diff = a - b;   // 포인터를 통해 차를 저장
}

// 배열의 최대값, 최소값, 평균을 동시에 구하기
void array_stats(int arr[], int size,
                 int *max, int *min, double *avg) {
    *max = arr[0];
    *min = arr[0];
    int total = 0;

    for (int i = 0; i < size; i++) {
        if (arr[i] > *max) *max = arr[i];
        if (arr[i] < *min) *min = arr[i];
        total += arr[i];
    }
    *avg = (double)total / size;
}

int main(void) {
    // 예제 1: 합과 차 계산
    int sum, diff;
    calc_sum_diff(30, 12, &sum, &diff);
    printf("합: %d, 차: %d\\n\\n", sum, diff);

    // 예제 2: 배열 통계
    int data[] = {45, 12, 78, 34, 91, 23};
    int max_val, min_val;
    double avg_val;

    array_stats(data, 6, &max_val, &min_val, &avg_val);
    printf("최대: %d\\n", max_val);
    printf("최소: %d\\n", min_val);
    printf("평균: %.1f\\n", avg_val);

    return 0;
}`,
    output: `합: 42, 차: 18

최대: 91
최소: 12
평균: 47.2`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0060", name: "sum", value: "42", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0064", name: "diff", value: "18", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0068", name: "max_val", value: "91", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE006C", name: "min_val", value: "12", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0070", name: "avg_val", value: "47.2", type: "double", typeLabel: "double", isPointer: false }
                ]
            },
            {
                name: "Stack - calc_sum_diff()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0030", name: "a", value: "30", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0034", name: "b", value: "12", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0038", name: "sum", value: "0x7FFE0060", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0040", name: "diff", value: "0x7FFE0064", type: "ptr", typeLabel: "int*", isPointer: true }
                ]
            }
        ],
        arrows: [
            { from: "sum (calc_sum_diff)", to: "sum (main)", label: "합 결과 저장" },
            { from: "diff (calc_sum_diff)", to: "diff (main)", label: "차 결과 저장" }
        ],
        annotations: [
            { type: "info", text: "포인터 매개변수를 통해 함수 외부의 여러 변수를 동시에 변경할 수 있습니다." },
            { type: "info", text: "scanf(&num)도 같은 원리: num의 주소를 전달하여 scanf가 직접 값을 저장합니다." }
        ]
    },
    keyPoints: [
        "C 함수는 return으로 하나의 값만 반환 가능하지만, 포인터 매개변수로 여러 값을 동시에 전달 가능",
        "scanf(&변수)는 변수의 주소를 전달하여 scanf가 입력값을 직접 저장하는 원리",
        "출력 매개변수(output parameter) 패턴: 결과를 포인터를 통해 호출자에게 전달",
        "함수의 return 값은 성공/실패 상태로, 실제 결과는 포인터로 전달하는 것이 C의 일반적인 패턴"
    ]
},

// Lecture 13: 함수의 포인터 리턴
{
    title: "함수의 포인터 리턴",
    content: `
        <h4>함수에서 포인터 반환하기</h4>
        <p>함수가 포인터를 반환할 수 있습니다. 그러나 <strong>무엇을 가리키는 포인터를 반환하느냐</strong>에 따라 심각한 버그가 발생할 수 있습니다.</p>

        <h4>위험: 지역 변수의 주소 반환</h4>
        <p>함수의 지역 변수는 함수가 종료되면 <strong>스택에서 사라집니다</strong>. 이미 사라진 메모리의 주소를 반환하면 <strong>댕글링 포인터(dangling pointer)</strong>가 됩니다.</p>

        <div class="danger-box">
            <strong>절대 금지:</strong> 지역 변수의 주소를 반환하면 정의되지 않은 동작(Undefined Behavior)이 발생합니다. 반환된 포인터가 가리키는 메모리는 이미 해제된 상태입니다.
        </div>

        <h4>안전한 방법 1: static 변수의 주소 반환</h4>
        <p><code>static</code> 변수는 함수가 종료되어도 메모리에 유지됩니다. 따라서 static 변수의 주소를 반환하는 것은 안전합니다. 단, 다음 호출에서 값이 덮어써질 수 있다는 점에 주의해야 합니다.</p>

        <h4>안전한 방법 2: 동적 할당 메모리 주소 반환</h4>
        <p><code>malloc</code>으로 할당한 힙 메모리는 <code>free</code>하기 전까지 유지됩니다. 따라서 동적 할당한 메모리의 주소를 반환하는 것이 가장 일반적인 패턴입니다.</p>

        <div class="warning-box">
            <strong>주의:</strong> 동적 할당한 메모리를 반환하면, 호출자가 반드시 <code>free()</code>로 해제해야 합니다. 그렇지 않으면 메모리 누수가 발생합니다.
        </div>
    `,
    code: `#include <stdio.h>
#include <stdlib.h>

// [위험] 지역 변수의 주소 반환 - 댕글링 포인터!
int* dangerous_func(void) {
    int local = 42;
    return &local;  // 경고! 지역 변수 주소 반환
}

// [안전] static 변수의 주소 반환
int* safe_static(int value) {
    static int result;
    result = value * 2;
    return &result;
}

// [안전] 동적 할당 메모리 반환
int* safe_malloc(int size) {
    int *arr = (int *)malloc(sizeof(int) * size);
    if (arr == NULL) return NULL;

    for (int i = 0; i < size; i++) {
        arr[i] = (i + 1) * 10;
    }
    return arr;  // 힙 메모리이므로 안전
}

int main(void) {
    // 1. 위험한 사용 (사용 금지!)
    // int *bad = dangerous_func();
    // printf("%d\\n", *bad);  // 정의되지 않은 동작!

    // 2. static 변수 반환
    int *sp = safe_static(5);
    printf("static 결과: %d\\n", *sp);

    // 3. 동적 할당 반환
    int *arr = safe_malloc(3);
    if (arr != NULL) {
        printf("동적 배열: %d, %d, %d\\n",
               arr[0], arr[1], arr[2]);
        free(arr);  // 반드시 해제!
    }

    return 0;
}`,
    output: `static 결과: 10
동적 배열: 10, 20, 30`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0050", name: "sp", value: "0x601040", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0058", name: "arr", value: "0x600010", type: "ptr", typeLabel: "int*", isPointer: true }
                ]
            },
            {
                name: "Stack - dangerous_func() [이미 해제됨]",
                type: "stack",
                cells: [
                    { address: "0x7FFE0020", name: "local", value: "??? (해제됨)", type: "free", typeLabel: "int (해제)", isPointer: false }
                ]
            },
            {
                name: "Data 영역 (static)",
                type: "data",
                cells: [
                    { address: "0x601040", name: "result", value: "10", type: "int", typeLabel: "static int", isPointer: false }
                ]
            },
            {
                name: "Heap 영역 (malloc)",
                type: "heap",
                cells: [
                    { address: "0x600010", name: "arr[0]", value: "10", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600014", name: "arr[1]", value: "20", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600018", name: "arr[2]", value: "30", type: "heap", typeLabel: "int", isPointer: false }
                ]
            }
        ],
        arrows: [
            { from: "sp", to: "result (static)", label: "static 변수 가리킴" },
            { from: "arr", to: "arr[0] (heap)", label: "힙 메모리 가리킴" }
        ],
        annotations: [
            { type: "danger", text: "dangerous_func()의 local은 함수 종료 시 스택에서 제거됨 → 댕글링 포인터!" },
            { type: "info", text: "static 변수는 Data 영역에 위치하여 프로그램 종료 시까지 유지됨" },
            { type: "info", text: "malloc으로 할당한 Heap 메모리는 free() 전까지 유지됨 → 안전한 반환" }
        ]
    },
    keyPoints: [
        "지역 변수의 주소를 반환하면 댕글링 포인터가 되어 정의되지 않은 동작 발생 (절대 금지)",
        "static 변수는 Data 영역에 상주하므로 주소 반환이 안전하나, 값이 덮어쓰일 수 있음에 주의",
        "malloc으로 할당한 힙 메모리의 주소를 반환하는 것이 가장 일반적이고 안전한 패턴",
        "동적 할당 메모리를 반환받은 호출자는 반드시 free()로 메모리를 해제해야 함"
    ]
},

// Lecture 14: const와 포인터
{
    title: "const와 포인터",
    content: `
        <h4>const 키워드와 포인터의 조합</h4>
        <p><code>const</code> 키워드를 포인터와 함께 사용하면, <strong>무엇을 변경할 수 없게 할 것인지</strong> 세밀하게 제어할 수 있습니다. <code>const</code>의 위치에 따라 의미가 완전히 달라집니다.</p>

        <h4>1. const int *p (포인터가 가리키는 값을 변경 불가)</h4>
        <p>포인터 <code>p</code>를 통해 가리키는 대상의 <strong>값을 변경할 수 없습니다</strong>. 하지만 포인터 자체는 다른 주소를 가리킬 수 있습니다.</p>
        <ul>
            <li><code>*p = 100;</code> → 컴파일 에러</li>
            <li><code>p = &other;</code> → 허용</li>
        </ul>

        <h4>2. int *const p (포인터 자체를 변경 불가)</h4>
        <p>포인터 <code>p</code>가 가리키는 <strong>주소를 변경할 수 없습니다</strong>. 하지만 가리키는 대상의 값은 변경할 수 있습니다.</p>
        <ul>
            <li><code>*p = 100;</code> → 허용</li>
            <li><code>p = &other;</code> → 컴파일 에러</li>
        </ul>

        <h4>3. const int *const p (둘 다 변경 불가)</h4>
        <p>가리키는 대상의 <strong>값도, 포인터의 주소도</strong> 모두 변경할 수 없습니다.</p>

        <div class="info-box">
            <strong>읽는 법:</strong> <code>*</code> 기준으로 왼쪽에 <code>const</code>가 있으면 "가리키는 값 변경 불가", 오른쪽에 있으면 "포인터 주소 변경 불가"로 읽습니다.
        </div>

        <table class="compare-table">
            <tr>
                <th>선언</th>
                <th>값 변경 (*p = ...)</th>
                <th>주소 변경 (p = ...)</th>
            </tr>
            <tr>
                <td><code>const int *p</code></td>
                <td>불가</td>
                <td>가능</td>
            </tr>
            <tr>
                <td><code>int *const p</code></td>
                <td>가능</td>
                <td>불가</td>
            </tr>
            <tr>
                <td><code>const int *const p</code></td>
                <td>불가</td>
                <td>불가</td>
            </tr>
        </table>
    `,
    code: `#include <stdio.h>

int main(void) {
    int a = 10, b = 20;

    // 1. const int *p: 가리키는 값 변경 불가
    const int *p1 = &a;
    printf("=== const int *p ===\\n");
    printf("*p1 = %d\\n", *p1);
    // *p1 = 100;  // 컴파일 에러! 값 변경 불가
    p1 = &b;       // OK! 다른 주소를 가리킬 수 있음
    printf("p1을 &b로 변경 후: *p1 = %d\\n\\n", *p1);

    // 2. int *const p: 포인터 자체 변경 불가
    int *const p2 = &a;
    printf("=== int *const p ===\\n");
    printf("*p2 = %d\\n", *p2);
    *p2 = 100;    // OK! 가리키는 값 변경 가능
    // p2 = &b;   // 컴파일 에러! 주소 변경 불가
    printf("*p2를 100으로 변경: *p2 = %d\\n", *p2);
    printf("a도 변경됨: a = %d\\n\\n", a);

    // 3. const int *const p: 둘 다 변경 불가
    const int *const p3 = &b;
    printf("=== const int *const p ===\\n");
    printf("*p3 = %d\\n", *p3);
    // *p3 = 200;  // 컴파일 에러! 값 변경 불가
    // p3 = &a;    // 컴파일 에러! 주소 변경 불가
    printf("p3은 값도 주소도 변경 불가\\n");

    return 0;
}`,
    output: `=== const int *p ===
*p1 = 10
p1을 &b로 변경 후: *p1 = 20

=== int *const p ===
*p2 = 10
*p2를 100으로 변경: *p2 = 100
a도 변경됨: a = 100

=== const int *const p ===
*p3 = 20
p3은 값도 주소도 변경 불가`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "a", value: "10 → 100", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0044", name: "b", value: "20", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0048", name: "p1", value: "0x7FFE0040 → 0x7FFE0044", type: "ptr", typeLabel: "const int*", isPointer: true },
                    { address: "0x7FFE0050", name: "p2", value: "0x7FFE0040 (고정)", type: "ptr", typeLabel: "int* const", isPointer: true },
                    { address: "0x7FFE0058", name: "p3", value: "0x7FFE0044 (고정)", type: "ptr", typeLabel: "const int* const", isPointer: true }
                ]
            }
        ],
        arrows: [
            { from: "p1", to: "b", label: "주소 변경 가능, 값 변경 불가" },
            { from: "p2", to: "a", label: "주소 변경 불가, 값 변경 가능" },
            { from: "p3", to: "b", label: "둘 다 변경 불가" }
        ],
        annotations: [
            { type: "info", text: "const int *p: *p로 값 변경 불가, p는 다른 주소 대입 가능" },
            { type: "warning", text: "int *const p: p는 다른 주소 대입 불가, *p로 값 변경 가능" },
            { type: "danger", text: "const int *const p: 값도 주소도 변경 불가 — 읽기 전용 포인터" }
        ]
    },
    keyPoints: [
        "const int *p: 포인터가 가리키는 값을 변경할 수 없음 (읽기 전용 데이터)",
        "int *const p: 포인터 자체의 주소를 변경할 수 없음 (고정 주소 포인터)",
        "const int *const p: 값도 주소도 변경 불가 (완전한 읽기 전용)",
        "* 기준 왼쪽 const = 값 보호, 오른쪽 const = 주소 보호로 기억"
    ]
},

// Lecture 15: 동적 메모리 할당 기초
{
    title: "동적 메모리 할당 기초",
    content: `
        <h4>동적 메모리 할당이란?</h4>
        <p>프로그램 실행 중에 필요한 만큼의 메모리를 <strong>힙(Heap) 영역</strong>에서 할당받는 것입니다. 지역 변수(스택)와 달리 프로그래머가 직접 할당하고 해제해야 합니다.</p>

        <h4>주요 함수들</h4>
        <ul>
            <li><code>malloc(size)</code>: size 바이트만큼 메모리 할당 (초기화 안 됨)</li>
            <li><code>calloc(n, size)</code>: n개의 size 바이트 메모리 할당 (0으로 초기화)</li>
            <li><code>realloc(ptr, size)</code>: 기존 할당 메모리의 크기를 변경</li>
            <li><code>free(ptr)</code>: 할당된 메모리 해제</li>
        </ul>

        <h4>힙 영역의 특성</h4>
        <ul>
            <li>프로그래머가 직접 할당/해제 관리</li>
            <li>함수가 끝나도 메모리가 유지됨</li>
            <li>할당 실패 시 NULL 반환</li>
            <li>해제하지 않으면 <strong>메모리 누수(memory leak)</strong> 발생</li>
        </ul>

        <div class="danger-box">
            <strong>메모리 누수 방지:</strong> malloc/calloc으로 할당한 메모리는 반드시 free()로 해제해야 합니다. 해제하지 않으면 프로그램이 끝날 때까지 메모리가 점유됩니다.
        </div>

        <div class="warning-box">
            <strong>주의:</strong> free() 후 해당 포인터를 다시 사용하면 댕글링 포인터 문제가 발생합니다. free() 후에는 포인터를 NULL로 설정하는 것이 안전합니다.
        </div>
    `,
    code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // 1. malloc: 초기화되지 않은 메모리 할당
    int *p1 = (int *)malloc(sizeof(int) * 3);
    if (p1 == NULL) {
        printf("malloc 실패!\\n");
        return 1;
    }
    p1[0] = 10; p1[1] = 20; p1[2] = 30;
    printf("malloc: %d, %d, %d\\n", p1[0], p1[1], p1[2]);

    // 2. calloc: 0으로 초기화된 메모리 할당
    int *p2 = (int *)calloc(3, sizeof(int));
    if (p2 == NULL) {
        free(p1);
        return 1;
    }
    printf("calloc: %d, %d, %d (0으로 초기화)\\n",
           p2[0], p2[1], p2[2]);

    // 3. realloc: 메모리 크기 변경
    p1 = (int *)realloc(p1, sizeof(int) * 5);
    if (p1 == NULL) {
        free(p2);
        return 1;
    }
    p1[3] = 40; p1[4] = 50;
    printf("realloc: %d, %d, %d, %d, %d\\n",
           p1[0], p1[1], p1[2], p1[3], p1[4]);

    // 4. free: 메모리 해제
    free(p1);
    p1 = NULL;  // 댕글링 포인터 방지
    free(p2);
    p2 = NULL;

    printf("메모리 해제 완료\\n");
    return 0;
}`,
    output: `malloc: 10, 20, 30
calloc: 0, 0, 0 (0으로 초기화)
realloc: 10, 20, 30, 40, 50
메모리 해제 완료`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "p1", value: "0x600010", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0048", name: "p2", value: "0x600030", type: "ptr", typeLabel: "int*", isPointer: true }
                ]
            },
            {
                name: "Heap - malloc/realloc (p1)",
                type: "heap",
                cells: [
                    { address: "0x600010", name: "p1[0]", value: "10", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600014", name: "p1[1]", value: "20", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600018", name: "p1[2]", value: "30", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x60001C", name: "p1[3]", value: "40", type: "heap", typeLabel: "int (realloc)", isPointer: false },
                    { address: "0x600020", name: "p1[4]", value: "50", type: "heap", typeLabel: "int (realloc)", isPointer: false }
                ]
            },
            {
                name: "Heap - calloc (p2)",
                type: "heap",
                cells: [
                    { address: "0x600030", name: "p2[0]", value: "0", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600034", name: "p2[1]", value: "0", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600038", name: "p2[2]", value: "0", type: "heap", typeLabel: "int", isPointer: false }
                ]
            }
        ],
        arrows: [
            { from: "p1", to: "p1[0]", label: "malloc → realloc 할당" },
            { from: "p2", to: "p2[0]", label: "calloc 할당 (0 초기화)" }
        ],
        annotations: [
            { type: "info", text: "malloc: 요청한 크기만큼 할당, 초기값은 쓰레기값" },
            { type: "info", text: "calloc: 요청한 크기만큼 할당하고 모든 바이트를 0으로 초기화" },
            { type: "warning", text: "realloc: 기존 데이터를 유지하면서 크기 변경, 주소가 바뀔 수 있음" },
            { type: "danger", text: "free() 후 반드시 포인터를 NULL로 설정하여 댕글링 포인터 방지" }
        ]
    },
    keyPoints: [
        "malloc(size): 초기화 없이 메모리 할당, calloc(n, size): 0으로 초기화하여 할당",
        "realloc(ptr, size): 기존 메모리 크기를 변경하며, 주소가 바뀔 수 있음에 주의",
        "할당 실패 시 NULL이 반환되므로 반드시 NULL 체크 필요",
        "free()로 메모리 해제 후 포인터를 NULL로 설정하여 댕글링 포인터와 메모리 누수 방지"
    ]
},

// Lecture 16: 동적 메모리와 포인터 활용
{
    title: "동적 메모리와 포인터 활용",
    content: `
        <h4>동적 배열 생성</h4>
        <p>프로그램 실행 중에 배열의 크기를 결정해야 할 때 <strong>동적 배열</strong>을 사용합니다. <code>malloc</code>이나 <code>calloc</code>으로 힙에 연속된 메모리를 할당하고, 포인터를 배열처럼 사용합니다.</p>
        <ul>
            <li>실행 시간에 크기를 결정할 수 있어 유연함</li>
            <li>포인터와 배열 연산(<code>[]</code>)을 통해 접근</li>
            <li>사용 후 반드시 <code>free()</code>로 해제</li>
        </ul>

        <h4>동적 2차원 배열</h4>
        <p>2차원 배열을 동적으로 생성하려면 <strong>포인터 배열</strong>을 활용합니다. 먼저 행(row)에 대한 포인터 배열을 할당하고, 각 행에 대해 열(column) 크기만큼 메모리를 할당합니다.</p>

        <div class="info-box">
            <strong>할당 순서:</strong> 1) 행 포인터 배열 할당 → 2) 각 행에 열 메모리 할당<br>
            <strong>해제 순서:</strong> 1) 각 행 메모리 해제 → 2) 행 포인터 배열 해제 (할당의 역순!)
        </div>

        <div class="warning-box">
            <strong>주의:</strong> 동적 2차원 배열의 해제 시 반드시 <strong>할당의 역순</strong>으로 해제해야 합니다. 행 포인터 배열을 먼저 해제하면 각 행의 메모리에 접근할 수 없게 되어 메모리 누수가 발생합니다.
        </div>
    `,
    code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 3;

    // === 1. 동적 1차원 배열 ===
    int *arr = (int *)malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }
    printf("=== 동적 1차원 배열 ===\\n");
    for (int i = 0; i < n; i++) {
        printf("arr[%d] = %d\\n", i, arr[i]);
    }
    free(arr);

    // === 2. 동적 2차원 배열 (3행 4열) ===
    int rows = 3, cols = 4;
    printf("\\n=== 동적 2차원 배열 (%dx%d) ===\\n", rows, cols);

    // 행 포인터 배열 할당
    int **matrix = (int **)malloc(sizeof(int *) * rows);

    // 각 행에 열 메모리 할당
    for (int i = 0; i < rows; i++) {
        matrix[i] = (int *)malloc(sizeof(int) * cols);
        for (int j = 0; j < cols; j++) {
            matrix[i][j] = i * cols + j + 1;
        }
    }

    // 출력
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%3d ", matrix[i][j]);
        }
        printf("\\n");
    }

    // 해제 (할당의 역순)
    for (int i = 0; i < rows; i++) {
        free(matrix[i]);  // 각 행 해제
    }
    free(matrix);         // 행 포인터 배열 해제

    printf("메모리 해제 완료\\n");
    return 0;
}`,
    output: `=== 동적 1차원 배열 ===
arr[0] = 10
arr[1] = 20
arr[2] = 30

=== 동적 2차원 배열 (3x4) ===
  1   2   3   4
  5   6   7   8
  9  10  11  12
메모리 해제 완료`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "matrix", value: "0x600050", type: "int**", typeLabel: "int**", isPointer: true },
                    { address: "0x7FFE0048", name: "rows", value: "3", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE004C", name: "cols", value: "4", type: "int", typeLabel: "int", isPointer: false }
                ]
            },
            {
                name: "Heap - 행 포인터 배열",
                type: "heap",
                cells: [
                    { address: "0x600050", name: "matrix[0]", value: "0x600080", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x600058", name: "matrix[1]", value: "0x6000A0", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x600060", name: "matrix[2]", value: "0x6000C0", type: "ptr", typeLabel: "int*", isPointer: true }
                ]
            },
            {
                name: "Heap - 행 데이터",
                type: "heap",
                cells: [
                    { address: "0x600080", name: "row0: [1,2,3,4]", value: "1, 2, 3, 4", type: "heap", typeLabel: "int[4]", isPointer: false },
                    { address: "0x6000A0", name: "row1: [5,6,7,8]", value: "5, 6, 7, 8", type: "heap", typeLabel: "int[4]", isPointer: false },
                    { address: "0x6000C0", name: "row2: [9,10,11,12]", value: "9, 10, 11, 12", type: "heap", typeLabel: "int[4]", isPointer: false }
                ]
            }
        ],
        arrows: [
            { from: "matrix", to: "matrix[0]", label: "행 포인터 배열" },
            { from: "matrix[0]", to: "row0", label: "0행 데이터" },
            { from: "matrix[1]", to: "row1", label: "1행 데이터" },
            { from: "matrix[2]", to: "row2", label: "2행 데이터" }
        ],
        annotations: [
            { type: "info", text: "matrix는 int** 타입으로, 각 행의 int* 포인터를 담는 배열을 가리킴" },
            { type: "warning", text: "해제 순서: 각 행(matrix[i]) 먼저 해제 → matrix 배열 해제 (할당의 역순)" }
        ]
    },
    keyPoints: [
        "동적 1차원 배열: malloc(sizeof(type) * 크기)로 할당하고 []로 접근",
        "동적 2차원 배열: 행 포인터 배열(int**)을 먼저 할당하고, 각 행에 열 데이터를 할당",
        "해제 순서는 할당의 역순: 각 행 데이터 먼저 free() → 행 포인터 배열 free()",
        "동적 배열은 실행 시간에 크기를 결정할 수 있어 유연하지만 메모리 관리에 주의 필요"
    ]
},

// Lecture 17: 이중 포인터 (더블 포인터)
{
    title: "이중 포인터 (더블 포인터)",
    content: `
        <h4>포인터의 포인터 개념</h4>
        <p><strong>이중 포인터(double pointer)</strong>는 포인터를 가리키는 포인터입니다. <code>int **pp</code>는 <code>int *</code> 타입의 변수를 가리킵니다.</p>
        <ul>
            <li><code>pp</code>: 포인터 <code>p</code>의 주소를 저장</li>
            <li><code>*pp</code>: <code>p</code>의 값 (즉, <code>a</code>의 주소)</li>
            <li><code>**pp</code>: <code>a</code>의 값에 접근</li>
        </ul>

        <h4>int **pp 선언과 사용</h4>
        <p>이중 포인터는 <code>int **pp = &amp;p;</code>로 선언합니다. 여기서 <code>p</code>는 <code>int *</code> 타입의 포인터 변수입니다.</p>

        <div class="info-box">
            <strong>체인 관계:</strong> <code>pp → p → a</code><br>
            <code>pp</code>는 <code>p</code>의 주소를 저장하고, <code>p</code>는 <code>a</code>의 주소를 저장합니다.
        </div>

        <h4>함수에서 포인터 값을 변경할 때</h4>
        <p>함수에서 <strong>포인터 변수 자체의 값(주소)</strong>을 변경하려면 이중 포인터가 필요합니다. 단순 포인터를 매개변수로 전달하면 포인터의 복사본이 전달되므로, 원본 포인터를 변경할 수 없습니다.</p>

        <div class="warning-box">
            <strong>주의:</strong> 함수 내에서 malloc으로 메모리를 할당하고 외부 포인터에 연결하려면, 이중 포인터(int **)를 매개변수로 사용해야 합니다.
        </div>
    `,
    code: `#include <stdio.h>
#include <stdlib.h>

// 포인터 자체를 변경하는 함수 (이중 포인터 필요)
void allocate_array(int **pp, int size) {
    *pp = (int *)malloc(sizeof(int) * size);
    for (int i = 0; i < size; i++) {
        (*pp)[i] = (i + 1) * 100;
    }
}

int main(void) {
    // === 이중 포인터 기본 ===
    int a = 42;
    int *p = &a;
    int **pp = &p;

    printf("=== 이중 포인터 체인 ===\\n");
    printf("a   = %d\\n", a);
    printf("*p  = %d\\n", *p);
    printf("**pp = %d\\n\\n", **pp);

    printf("&a  = %p\\n", (void *)&a);
    printf("p   = %p\\n", (void *)p);
    printf("*pp = %p\\n", (void *)*pp);
    printf("&p  = %p\\n", (void *)&p);
    printf("pp  = %p\\n\\n", (void *)pp);

    // **pp를 통한 값 변경
    **pp = 99;
    printf("**pp = 99 실행 후: a = %d\\n\\n", a);

    // === 함수에서 포인터 변경 ===
    int *arr = NULL;
    allocate_array(&arr, 3);

    printf("=== 함수에서 할당된 배열 ===\\n");
    for (int i = 0; i < 3; i++) {
        printf("arr[%d] = %d\\n", i, arr[i]);
    }

    free(arr);
    return 0;
}`,
    output: `=== 이중 포인터 체인 ===
a   = 42
*p  = 42
**pp = 42

&a  = 0x7ffe0040
p   = 0x7ffe0040
*pp = 0x7ffe0040
&p  = 0x7ffe0048
pp  = 0x7ffe0048

**pp = 99 실행 후: a = 99

=== 함수에서 할당된 배열 ===
arr[0] = 100
arr[1] = 200
arr[2] = 300`,
    memory: {
        regions: [
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "a", value: "42 → 99", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0048", name: "p", value: "0x7FFE0040", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0050", name: "pp", value: "0x7FFE0048", type: "int**", typeLabel: "int**", isPointer: true },
                    { address: "0x7FFE0058", name: "arr", value: "NULL → 0x600010", type: "ptr", typeLabel: "int*", isPointer: true }
                ]
            },
            {
                name: "Stack - allocate_array()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0020", name: "pp", value: "0x7FFE0058", type: "int**", typeLabel: "int**", isPointer: true },
                    { address: "0x7FFE0028", name: "size", value: "3", type: "int", typeLabel: "int", isPointer: false }
                ]
            },
            {
                name: "Heap (malloc)",
                type: "heap",
                cells: [
                    { address: "0x600010", name: "arr[0]", value: "100", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600014", name: "arr[1]", value: "200", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600018", name: "arr[2]", value: "300", type: "heap", typeLabel: "int", isPointer: false }
                ]
            }
        ],
        arrows: [
            { from: "pp (main)", to: "p", label: "이중 포인터" },
            { from: "p", to: "a", label: "포인터" },
            { from: "pp (allocate_array)", to: "arr (main)", label: "외부 포인터의 주소" },
            { from: "arr", to: "arr[0]", label: "할당된 힙 메모리" }
        ],
        annotations: [
            { type: "info", text: "pp → p → a 체인: **pp로 a의 값에 접근하고 변경 가능" },
            { type: "warning", text: "allocate_array에서 *pp = malloc(...)으로 main의 arr 포인터를 직접 변경" }
        ]
    },
    keyPoints: [
        "이중 포인터(int **pp)는 포인터의 주소를 저장하여 포인터를 간접 접근하는 포인터",
        "pp → p → a 체인에서 **pp로 최종 값에 접근, *pp로 중간 포인터 값에 접근",
        "함수에서 외부 포인터 변수 자체를 변경하려면 이중 포인터(int **)를 매개변수로 사용",
        "동적 배열을 함수 내에서 할당하여 외부로 전달할 때 이중 포인터 패턴이 필수적"
    ]
},

// Lecture 18: 포인터 배열과 배열 포인터
{
    title: "포인터 배열과 배열 포인터",
    content: `
        <h4>포인터 배열 (Array of Pointers)</h4>
        <p><code>int *arr[3]</code>은 <strong>포인터들의 배열</strong>입니다. 배열의 각 요소가 <code>int *</code> 타입의 포인터입니다.</p>
        <ul>
            <li>배열 크기만큼의 포인터를 저장</li>
            <li>각 포인터가 서로 다른 변수나 배열을 가리킬 수 있음</li>
            <li>문자열 배열에서 자주 사용: <code>char *names[3]</code></li>
        </ul>

        <h4>배열 포인터 (Pointer to Array)</h4>
        <p><code>int (*arr)[3]</code>은 <strong>크기가 3인 int 배열을 가리키는 포인터</strong>입니다. 하나의 포인터가 배열 전체를 가리킵니다.</p>
        <ul>
            <li>2차원 배열을 함수에 전달할 때 사용</li>
            <li>포인터 연산 시 배열 크기만큼 이동</li>
            <li>선언 시 괄호가 필수: <code>int (*p)[3]</code></li>
        </ul>

        <div class="info-box">
            <strong>핵심 차이:</strong> <code>int *arr[3]</code>에서 <code>[]</code>이 <code>*</code>보다 우선순위가 높아 "배열"이 먼저 적용됩니다. 반면 <code>int (*arr)[3]</code>에서 괄호로 <code>*</code>를 먼저 적용하면 "포인터"가 됩니다.
        </div>

        <table class="compare-table">
            <tr>
                <th>구분</th>
                <th>포인터 배열 <code>int *arr[3]</code></th>
                <th>배열 포인터 <code>int (*arr)[3]</code></th>
            </tr>
            <tr>
                <td>의미</td>
                <td>3개의 int 포인터로 된 배열</td>
                <td>int[3] 배열을 가리키는 포인터 1개</td>
            </tr>
            <tr>
                <td>크기</td>
                <td>포인터 3개 = 24바이트 (64비트)</td>
                <td>포인터 1개 = 8바이트 (64비트)</td>
            </tr>
            <tr>
                <td>주 용도</td>
                <td>문자열 배열, 서로 다른 변수 가리킴</td>
                <td>2차원 배열 매개변수, 행 단위 이동</td>
            </tr>
        </table>
    `,
    code: `#include <stdio.h>

int main(void) {
    int a = 10, b = 20, c = 30;

    // === 1. 포인터 배열: int *arr[3] ===
    int *pArr[3] = { &a, &b, &c };

    printf("=== 포인터 배열 (int *pArr[3]) ===\\n");
    for (int i = 0; i < 3; i++) {
        printf("pArr[%d] = %p, *pArr[%d] = %d\\n",
               i, (void *)pArr[i], i, *pArr[i]);
    }

    // === 2. 배열 포인터: int (*p)[4] ===
    int matrix[3][4] = {
        { 1,  2,  3,  4},
        { 5,  6,  7,  8},
        { 9, 10, 11, 12}
    };

    int (*pRow)[4] = matrix;  // 배열 포인터

    printf("\\n=== 배열 포인터 (int (*pRow)[4]) ===\\n");
    for (int i = 0; i < 3; i++) {
        printf("pRow[%d]: ", i);
        for (int j = 0; j < 4; j++) {
            printf("%3d ", pRow[i][j]);
        }
        printf("\\n");
    }

    // 배열 포인터의 포인터 연산
    printf("\\nsizeof(*pRow) = %zu (int[4] 크기)\\n",
           sizeof(*pRow));
    printf("pRow     = %p\\n", (void *)pRow);
    printf("pRow + 1 = %p (16바이트 이동)\\n",
           (void *)(pRow + 1));

    return 0;
}`,
    output: `=== 포인터 배열 (int *pArr[3]) ===
pArr[0] = 0x7ffe0040, *pArr[0] = 10
pArr[1] = 0x7ffe0044, *pArr[1] = 20
pArr[2] = 0x7ffe0048, *pArr[2] = 30

=== 배열 포인터 (int (*pRow)[4]) ===
pRow[0]:   1   2   3   4
pRow[1]:   5   6   7   8
pRow[2]:   9  10  11  12

sizeof(*pRow) = 16 (int[4] 크기)
pRow     = 0x7ffe0050
pRow + 1 = 0x7ffe0060 (16바이트 이동)`,
    memory: {
        regions: [
            {
                name: "Stack - 포인터 배열",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "a", value: "10", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0044", name: "b", value: "20", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0048", name: "c", value: "30", type: "int", typeLabel: "int", isPointer: false },
                    { address: "0x7FFE0020", name: "pArr[0]", value: "0x7FFE0040", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0028", name: "pArr[1]", value: "0x7FFE0044", type: "ptr", typeLabel: "int*", isPointer: true },
                    { address: "0x7FFE0030", name: "pArr[2]", value: "0x7FFE0048", type: "ptr", typeLabel: "int*", isPointer: true }
                ]
            },
            {
                name: "Stack - 배열 포인터",
                type: "stack",
                cells: [
                    { address: "0x7FFE0050", name: "matrix[0]", value: "1, 2, 3, 4", type: "arr", typeLabel: "int[4]", isPointer: false },
                    { address: "0x7FFE0060", name: "matrix[1]", value: "5, 6, 7, 8", type: "arr", typeLabel: "int[4]", isPointer: false },
                    { address: "0x7FFE0070", name: "matrix[2]", value: "9, 10, 11, 12", type: "arr", typeLabel: "int[4]", isPointer: false },
                    { address: "0x7FFE0080", name: "pRow", value: "0x7FFE0050", type: "ptr", typeLabel: "int(*)[4]", isPointer: true }
                ]
            }
        ],
        arrows: [
            { from: "pArr[0]", to: "a", label: "포인터 배열 → 개별 변수" },
            { from: "pArr[1]", to: "b", label: "" },
            { from: "pArr[2]", to: "c", label: "" },
            { from: "pRow", to: "matrix[0]", label: "배열 포인터 → 배열 전체" }
        ],
        annotations: [
            { type: "info", text: "포인터 배열(int *arr[3]): 3개의 포인터가 각각 다른 변수를 가리킴" },
            { type: "info", text: "배열 포인터(int (*p)[4]): 1개의 포인터가 int[4] 배열 전체를 가리킴, +1 시 16바이트 이동" }
        ]
    },
    keyPoints: [
        "int *arr[3]은 포인터 배열: 3개의 int 포인터로 구성된 배열",
        "int (*arr)[3]은 배열 포인터: int[3] 배열 전체를 가리키는 포인터 1개",
        "연산자 우선순위: []가 *보다 높으므로, 괄호로 *를 먼저 적용해야 배열 포인터가 됨",
        "배열 포인터에 +1 하면 배열 크기(sizeof(int)*열수) 바이트만큼 이동"
    ]
},

// Lecture 19: 함수 포인터
{
    title: "함수 포인터",
    content: `
        <h4>함수 포인터란?</h4>
        <p>함수도 메모리의 <strong>코드(code) 영역</strong>에 저장됩니다. 함수 포인터는 이 함수의 시작 주소를 저장하는 포인터입니다.</p>

        <h4>선언 방법</h4>
        <p><code>int (*fp)(int, int)</code>는 <strong>int 두 개를 받아 int를 반환하는 함수</strong>를 가리키는 포인터입니다.</p>
        <ul>
            <li><code>(*fp)</code>: fp가 포인터임을 나타냄 (괄호 필수!)</li>
            <li><code>(int, int)</code>: 매개변수 타입</li>
            <li>맨 앞 <code>int</code>: 반환 타입</li>
        </ul>

        <div class="warning-box">
            <strong>괄호 중요:</strong> <code>int (*fp)(int, int)</code>와 <code>int *fp(int, int)</code>는 완전히 다릅니다! 후자는 "int 포인터를 반환하는 함수 선언"입니다.
        </div>

        <h4>콜백(Callback) 패턴</h4>
        <p>함수 포인터를 다른 함수의 매개변수로 전달하여 <strong>동작을 주입</strong>하는 패턴입니다. 실행 시점에 어떤 함수를 호출할지 결정할 수 있어, 유연하고 확장 가능한 코드를 작성할 수 있습니다.</p>

        <div class="info-box">
            <strong>활용 예시:</strong> qsort의 비교 함수, 이벤트 핸들러, 전략 패턴 등에서 함수 포인터가 사용됩니다.
        </div>
    `,
    code: `#include <stdio.h>

// 사칙연산 함수들
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int divide(int a, int b) {
    if (b == 0) return 0;
    return a / b;
}

// 콜백 패턴: 함수 포인터를 매개변수로 받음
void calculate(int x, int y,
               int (*operation)(int, int),
               const char *name) {
    int result = operation(x, y);
    printf("%s(%d, %d) = %d\\n", name, x, y, result);
}

int main(void) {
    // 함수 포인터 선언 및 사용
    int (*fp)(int, int);

    fp = add;
    printf("fp = add: fp(10, 3) = %d\\n", fp(10, 3));

    fp = sub;
    printf("fp = sub: fp(10, 3) = %d\\n", fp(10, 3));

    // 함수 포인터 배열 (계산기)
    printf("\\n=== 함수 포인터 배열 계산기 ===\\n");
    int (*ops[4])(int, int) = { add, sub, mul, divide };
    const char *names[] = { "add", "sub", "mul", "div" };

    for (int i = 0; i < 4; i++) {
        printf("%s(20, 4) = %d\\n", names[i], ops[i](20, 4));
    }

    // 콜백 패턴 활용
    printf("\\n=== 콜백 패턴 ===\\n");
    calculate(15, 5, add, "add");
    calculate(15, 5, mul, "mul");

    return 0;
}`,
    output: `fp = add: fp(10, 3) = 13
fp = sub: fp(10, 3) = 7

=== 함수 포인터 배열 계산기 ===
add(20, 4) = 24
sub(20, 4) = 16
mul(20, 4) = 80
div(20, 4) = 5

=== 콜백 패턴 ===
add(15, 5) = 20
mul(15, 5) = 75`,
    memory: {
        regions: [
            {
                name: "Code 영역 (함수들)",
                type: "code",
                cells: [
                    { address: "0x401000", name: "add()", value: "함수 코드", type: "func", typeLabel: "function", isPointer: false },
                    { address: "0x401030", name: "sub()", value: "함수 코드", type: "func", typeLabel: "function", isPointer: false },
                    { address: "0x401060", name: "mul()", value: "함수 코드", type: "func", typeLabel: "function", isPointer: false },
                    { address: "0x401090", name: "divide()", value: "함수 코드", type: "func", typeLabel: "function", isPointer: false }
                ]
            },
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "fp", value: "0x401030 (sub)", type: "funcptr", typeLabel: "int(*)(int,int)", isPointer: true },
                    { address: "0x7FFE0048", name: "ops[0]", value: "0x401000", type: "funcptr", typeLabel: "함수 포인터", isPointer: true },
                    { address: "0x7FFE0050", name: "ops[1]", value: "0x401030", type: "funcptr", typeLabel: "함수 포인터", isPointer: true },
                    { address: "0x7FFE0058", name: "ops[2]", value: "0x401060", type: "funcptr", typeLabel: "함수 포인터", isPointer: true },
                    { address: "0x7FFE0060", name: "ops[3]", value: "0x401090", type: "funcptr", typeLabel: "함수 포인터", isPointer: true }
                ]
            }
        ],
        arrows: [
            { from: "fp", to: "sub()", label: "함수 포인터" },
            { from: "ops[0]", to: "add()", label: "" },
            { from: "ops[1]", to: "sub()", label: "" },
            { from: "ops[2]", to: "mul()", label: "" },
            { from: "ops[3]", to: "divide()", label: "" }
        ],
        annotations: [
            { type: "info", text: "함수 포인터는 Code 영역에 위치한 함수의 시작 주소를 저장" },
            { type: "info", text: "함수 포인터 배열로 계산기처럼 다양한 연산을 인덱스로 선택 가능" }
        ]
    },
    keyPoints: [
        "함수 포인터 선언: int (*fp)(int, int) — 괄호로 *를 감싸야 포인터 선언이 됨",
        "함수 이름 자체가 함수의 주소이므로 fp = add; 처럼 대입 가능",
        "함수 포인터 배열: int (*ops[4])(int, int)로 여러 함수를 배열로 관리",
        "콜백 패턴: 함수 포인터를 매개변수로 전달하여 실행 시점에 동작을 결정"
    ]
},

// Lecture 20: 포인터 함수 vs 함수 포인터 비교
{
    title: "포인터 함수 vs 함수 포인터 비교",
    content: `
        <h4>두 개념의 명확한 구분</h4>
        <p>C언어에서 자주 혼동되는 두 가지 개념을 비교합니다.</p>

        <h4>1. 포인터를 리턴하는 함수 (포인터 함수)</h4>
        <p><code>int* func()</code>는 <strong>int 포인터를 반환하는 함수</strong>입니다. 함수 자체는 일반 함수이며, 반환 타입이 포인터입니다.</p>
        <ul>
            <li>선언: <code>int* func(int n)</code></li>
            <li>반환값: 메모리 주소 (포인터)</li>
            <li>용도: 동적 할당 메모리, static 변수의 주소 반환 등</li>
        </ul>

        <h4>2. 함수를 가리키는 포인터 (함수 포인터)</h4>
        <p><code>int (*func)()</code>는 <strong>함수를 가리키는 포인터 변수</strong>입니다. 함수의 주소를 저장하고 간접 호출할 수 있습니다.</p>
        <ul>
            <li>선언: <code>int (*func)(int n)</code></li>
            <li>저장값: 함수의 시작 주소</li>
            <li>용도: 콜백, 전략 패턴, 다형성 구현</li>
        </ul>

        <div class="warning-box">
            <strong>문법 차이 핵심:</strong> <code>int *func()</code>에서 <code>*</code>는 반환 타입에 붙고, <code>int (*func)()</code>에서 <code>*</code>는 함수명에 괄호로 묶여 붙습니다.
        </div>

        <table class="compare-table">
            <tr>
                <th>구분</th>
                <th>포인터 함수 <code>int* func()</code></th>
                <th>함수 포인터 <code>int (*func)()</code></th>
            </tr>
            <tr>
                <td>정체</td>
                <td>함수 (반환 타입이 포인터)</td>
                <td>변수 (함수의 주소를 저장)</td>
            </tr>
            <tr>
                <td>선언 읽기</td>
                <td>"int 포인터를 반환하는 함수"</td>
                <td>"int를 반환하는 함수를 가리키는 포인터"</td>
            </tr>
            <tr>
                <td>괄호 유무</td>
                <td>*에 괄호 없음: <code>int *func()</code></td>
                <td>*에 괄호 있음: <code>int (*func)()</code></td>
            </tr>
            <tr>
                <td>주요 용도</td>
                <td>동적 메모리 반환, 데이터 접근</td>
                <td>콜백, 다형성, 전략 패턴</td>
            </tr>
        </table>

        <h4>콜백과 다형성 패턴</h4>
        <p>함수 포인터를 활용하면 C언어에서도 <strong>다형성(polymorphism)</strong>과 유사한 패턴을 구현할 수 있습니다. 같은 인터페이스(함수 시그니처)를 가진 여러 함수를 실행 시점에 교체하여 호출할 수 있습니다.</p>

        <div class="info-box">
            <strong>실무 팁:</strong> 두 개념을 결합하면 "함수 포인터를 반환하는 함수"나 "포인터를 반환하는 함수의 함수 포인터" 같은 복잡한 형태도 가능합니다. typedef를 사용하면 가독성을 높일 수 있습니다.
        </div>
    `,
    code: `#include <stdio.h>
#include <stdlib.h>

// === 포인터 함수: 포인터를 반환하는 함수 ===
int* create_array(int size, int init_val) {
    int *arr = (int *)malloc(sizeof(int) * size);
    if (arr == NULL) return NULL;
    for (int i = 0; i < size; i++) {
        arr[i] = init_val + i;
    }
    return arr;  // 힙 메모리 주소 반환
}

// === 함수 포인터용 함수들 ===
int ascending(int a, int b) { return a - b; }
int descending(int a, int b) { return b - a; }

// 함수 포인터를 매개변수로 받는 정렬 함수
void bubble_sort(int *arr, int size,
                 int (*compare)(int, int)) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - 1 - i; j++) {
            if (compare(arr[j], arr[j+1]) > 0) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

// === 함수 포인터를 반환하는 함수 ===
typedef int (*CompareFunc)(int, int);

CompareFunc get_comparator(char order) {
    if (order == 'a') return ascending;
    else return descending;
}

void print_array(const char *label, int *arr, int n) {
    printf("%s: ", label);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main(void) {
    // 1. 포인터 함수 사용
    printf("=== 포인터 함수 (포인터를 반환하는 함수) ===\\n");
    int *arr = create_array(5, 50);
    if (arr) {
        print_array("생성된 배열", arr, 5);
    }

    // 2. 함수 포인터 사용
    printf("\\n=== 함수 포인터 (함수를 가리키는 포인터) ===\\n");
    int (*cmp)(int, int) = ascending;
    bubble_sort(arr, 5, cmp);
    print_array("오름차순 정렬", arr, 5);

    cmp = descending;
    bubble_sort(arr, 5, cmp);
    print_array("내림차순 정렬", arr, 5);

    // 3. 함수 포인터를 반환하는 함수 (두 개념 결합)
    printf("\\n=== 두 개념 결합 ===\\n");
    CompareFunc sorter = get_comparator('a');
    bubble_sort(arr, 5, sorter);
    print_array("get_comparator('a')", arr, 5);

    free(arr);
    return 0;
}`,
    output: `=== 포인터 함수 (포인터를 반환하는 함수) ===
생성된 배열: 50 51 52 53 54

=== 함수 포인터 (함수를 가리키는 포인터) ===
오름차순 정렬: 50 51 52 53 54
내림차순 정렬: 54 53 52 51 50

=== 두 개념 결합 ===
get_comparator('a'): 50 51 52 53 54 `,
    memory: {
        regions: [
            {
                name: "Code 영역",
                type: "code",
                cells: [
                    { address: "0x401000", name: "create_array()", value: "함수 코드", type: "func", typeLabel: "int* 반환 함수", isPointer: false },
                    { address: "0x401080", name: "ascending()", value: "함수 코드", type: "func", typeLabel: "비교 함수", isPointer: false },
                    { address: "0x4010B0", name: "descending()", value: "함수 코드", type: "func", typeLabel: "비교 함수", isPointer: false },
                    { address: "0x4010E0", name: "bubble_sort()", value: "함수 코드", type: "func", typeLabel: "정렬 함수", isPointer: false },
                    { address: "0x401150", name: "get_comparator()", value: "함수 코드", type: "func", typeLabel: "함수 포인터 반환", isPointer: false }
                ]
            },
            {
                name: "Stack - main()",
                type: "stack",
                cells: [
                    { address: "0x7FFE0040", name: "arr", value: "0x600010", type: "ptr", typeLabel: "int* (포인터 함수 결과)", isPointer: true },
                    { address: "0x7FFE0048", name: "cmp", value: "0x4010B0", type: "funcptr", typeLabel: "int(*)(int,int)", isPointer: true },
                    { address: "0x7FFE0050", name: "sorter", value: "0x401080", type: "funcptr", typeLabel: "CompareFunc", isPointer: true }
                ]
            },
            {
                name: "Heap (create_array 결과)",
                type: "heap",
                cells: [
                    { address: "0x600010", name: "arr[0]", value: "50", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600014", name: "arr[1]", value: "51", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600018", name: "arr[2]", value: "52", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x60001C", name: "arr[3]", value: "53", type: "heap", typeLabel: "int", isPointer: false },
                    { address: "0x600020", name: "arr[4]", value: "54", type: "heap", typeLabel: "int", isPointer: false }
                ]
            }
        ],
        arrows: [
            { from: "arr (main)", to: "arr[0] (heap)", label: "포인터 함수가 반환한 주소" },
            { from: "cmp", to: "descending()", label: "함수 포인터 → 함수" },
            { from: "sorter", to: "ascending()", label: "get_comparator가 반환한 함수 포인터" }
        ],
        annotations: [
            { type: "info", text: "포인터 함수(int* func): create_array()가 힙 메모리 주소를 반환 → arr에 저장" },
            { type: "info", text: "함수 포인터(int (*fp)()): cmp가 ascending/descending 함수의 코드 주소를 저장" },
            { type: "warning", text: "get_comparator()는 두 개념을 결합: 함수 포인터(CompareFunc)를 반환하는 포인터 함수" }
        ]
    },
    keyPoints: [
        "포인터 함수 int* func(): 포인터를 반환하는 함수 — 동적 메모리나 static 변수 주소 반환에 사용",
        "함수 포인터 int (*func)(): 함수의 주소를 저장하는 변수 — 콜백과 다형성 패턴에 사용",
        "문법 구분: *에 괄호가 없으면 포인터 함수, *에 괄호가 있으면 함수 포인터",
        "typedef를 사용하면 복잡한 함수 포인터 타입을 간결하게 표현할 수 있음"
    ]
}
];
