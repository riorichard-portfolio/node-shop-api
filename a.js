const crypto = require('crypto');

// Pre-computed values (seperti di real app)
const preComputedUUID = crypto.randomUUID();
const preComputedEmail = "test@test.com";

// Direct property access  
const obj1 = {
    uuid: preComputedUUID,
    email: preComputedEmail
};

// Function getter (REFERENCE ONLY - seperti pattern Anda)
const obj2 = {
    uuid: () => preComputedUUID,
    email: () => preComputedEmail
};

// Benchmark
console.time('direct');
for (let i = 0; i < 1e6; i++) {
    const x = obj1.uuid;
    const y = obj1.email;
}
console.timeEnd('direct');

console.time('getter-reference');
for (let i = 0; i < 1e6; i++) {
    const x = obj2.uuid();
    const y = obj2.email();
}
console.timeEnd('getter-reference');