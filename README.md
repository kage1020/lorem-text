```
npm install
npm run dev
```

```
npm run deploy
```

## JWK

```jsonc
{
    "publicKey": {
        "kty": "RSA", // Key Type
        "key_ops": [ // Key Usage
            "encrypt"
        ],
        "alg": "RSA-OAEP-512", // Algorithm
        "ext": true, // Extractable
        "n": "qpzze...", // modulus
        "e": "AQAB" // exponent
    },
    "privateKey": {
        "kty": "RSA", // Key Type
        "key_ops": [ // Key Usage
            "decrypt"
        ],
        "alg": "RSA-OAEP-512", // Algorithm
        "ext": true, // Extractable
        "d": "CBbv5...", // private key
        "n": "qpzze...", // modulus
        "e": "AQAB", // exponent
        "p": "7DTwE...", // prime1
        "q": "uOjo8...", // prime2
        "dp": "zDktB...", // CRT Exponent1
        "dq": "MtHwl...", // CRT Exponent2
        "qi": "AnLwV..." // CRT Coefficient
    }
}
```
