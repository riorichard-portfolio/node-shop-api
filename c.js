const crypto = require('crypto');

// Simulasi data yang kompleks (seperti di real app)
const preComputedData = {
    userId: crypto.randomUUID(),
    email: "user@example.com",
    profile: {
        name: "John Doe",
        age: 30,
        preferences: { theme: "dark", notifications: true }
    },
    metadata: {
        createdAt: new Date(),
        lastLogin: new Date(),
        sessionCount: 15
    }
};

// SCENARIO 1: DEEP COPY approach (traditional)
function useCaseToRepoWithCopy() {
    // Simulasi usecase layer menerima data
    // const useCaseData = JSON.parse(JSON.stringify(preComputedData)); // Deep copy

    // Pass ke repo layer dengan copy lagi
    return repositoryLayerWithCopy(preComputedData);
}

function repositoryLayerWithCopy(data) {
    // Repo membuat copy lagi untuk immutability
    // const repoData = { ...data, profile: { ...data.profile } };

    // Akses data di repo
    const userId = data.userId;
    const email = data.email;
    const theme = data.profile.preferences.theme;

    return { userId, email, theme };
}

class UsecaseData {
    OuserId
    Oemail
    Oprofile
    Ometadata
    constructor(
        OuserId,
        Oemail,
        Oprofile,
        Ometadata) {
        this.OuserId = OuserId
        this.Oemail = Oemail
        this.Oprofile = Oprofile
        this.Ometadata = Ometadata
    }
    userId() { return this.OuserId }
    email() { return this.Oemail }
    profile() { return this.Oprofile }
    metadata() { return this.Ometadata }
}

// SCENARIO 2: GETTER REFERENCE approach (your pattern)
function useCaseToRepoWithGetter() {
    // Usecase layer dengan getter references
    const useCaseData = new UsecaseData(preComputedData.userId, preComputedData.email, preComputedData.profile, preComputedData.metadata)

    // Pass ke repo layer - TANPA copy, hanya references
    return repositoryLayerWithGetter(useCaseData);
}

function repositoryLayerWithGetter(data) {
    // Repo akses data via getter - zero copy
    const userId = data.userId();
    const email = data.email();
    const theme = data.profile().preferences.theme;

    return { userId, email, theme };
}

// Benchmark performance & memory
console.time('DEEP-COPY-approach');
for (let i = 0; i < 1e5; i++) {
    useCaseToRepoWithCopy();
}
console.timeEnd('DEEP-COPY-approach');

console.time('GETTER-REFERENCE-approach');
for (let i = 0; i < 1e5; i++) {
    useCaseToRepoWithGetter();
}
console.timeEnd('GETTER-REFERENCE-approach');

// Memory comparison
function measureMemory(description, fn, iterations = 1e5) {
    if (global.gc) global.gc();
    const memBefore = process.memoryUsage();
    fn(iterations);
    const memAfter = process.memoryUsage();

    console.log(`\n${description}:`);
    console.log(`Heap used: ${Math.round((memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024 * 100) / 100} MB`);
}

console.log('\n=== MEMORY USAGE FOR 100K ITERATIONS ===');
measureMemory('DEEP COPY', useCaseToRepoWithCopy);
measureMemory('GETTER REFERENCE', useCaseToRepoWithGetter);

// Object creation memory
console.log('\n=== OBJECT CREATION COMPARISON ===');
const memBefore = process.memoryUsage();
const copyObjects = Array(1000).fill().map(() => useCaseToRepoWithCopy());
const memAfterCopy = process.memoryUsage();

const getterObjects = Array(1000).fill().map(() => useCaseToRepoWithGetter());
const memAfterGetter = process.memoryUsage();

console.log(`1,000 DEEP COPY objects: ${Math.round((memAfterCopy.heapUsed - memBefore.heapUsed) / 1024 / 1024 * 100) / 100} MB`);
console.log(`1,000 GETTER objects: ${Math.round((memAfterGetter.heapUsed - memAfterCopy.heapUsed) / 1024 / 1024 * 100) / 100} MB`);