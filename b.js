const crypto = require('crypto');

function formatMemoryUsage(memory) {
    return `${Math.round(memory / 1024 / 1024 * 100) / 100} MB`;
}

function measureMemory(description, fn, iterations = 1e6) {
    global.gc(); // Force garbage collection before test (butuh --expose-gc)

    const memBefore = process.memoryUsage();
    fn(iterations);
    const memAfter = process.memoryUsage();

    console.log(`\n${description}:`);
    console.log(`Heap used: ${formatMemoryUsage(memAfter.heapUsed - memBefore.heapUsed)}`);
    console.log(`Heap total: ${formatMemoryUsage(memAfter.heapTotal - memBefore.heapTotal)}`);
}

// Pre-computed values
const preComputedUUID = crypto.randomUUID();
const preComputedEmail = "test@test.com";

// Test scenarios
const directTest = (iterations) => {
    const obj1 = {
        uuid: preComputedUUID,
        email: preComputedEmail
    };

    for (let i = 0; i < iterations; i++) {
        const x = obj1.uuid;
        const y = obj1.email;
    }
};

const getterTest = (iterations) => {
    const obj2 = {
        uuid: () => preComputedUUID,
        email: () => preComputedEmail
    };

    for (let i = 0; i < iterations; i++) {
        const x = obj2.uuid();
        const y = obj2.email();
    }
};

// Run with memory measurement
console.log('=== MEMORY USAGE COMPARISON ===');
measureMemory('DIRECT property access', directTest);
measureMemory('GETTER function access', getterTest);

// Juga test creation memory
console.log('\n=== OBJECT CREATION MEMORY ===');
const memBeforeCreate = process.memoryUsage();
const directObjects = Array(10000).fill().map(() => ({
    uuid: preComputedUUID,
    email: preComputedEmail
}));
const memAfterDirect = process.memoryUsage();

const getterObjects = Array(10000).fill().map(() => ({
    uuid: () => preComputedUUID,
    email: () => preComputedEmail
}));
const memAfterGetter = process.memoryUsage();

console.log(`10,000 direct objects: ${formatMemoryUsage(memAfterDirect.heapUsed - memBeforeCreate.heapUsed)}`);
console.log(`10,000 getter objects: ${formatMemoryUsage(memAfterGetter.heapUsed - memAfterDirect.heapUsed)}`);