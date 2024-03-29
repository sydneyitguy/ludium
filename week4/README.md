# Ludium week 4
Practice exercise for managing a simple ERC20 airdrop

## 📄 Contracts
- MungToken: ERC20 token with Mintable capability
  - Goerli testnet: [0x838Ab5ccdf9336098e4dFDCD054d23CE6874eE21](https://goerli.etherscan.io/address/0x838Ab5ccdf9336098e4dFDCD054d23CE6874eE21#code)
- MungAirdrop: An airdrop contract that mint 100 MUNG token on every claim
  - Goerli testnet: [0xd1db48709B305C952A9DE47f60cfecE70f43E915](https://goerli.etherscan.io/address/0xd1db48709B305C952A9DE47f60cfecE70f43E915#code)

## 🧪 Test
```shell
npx hardhat test
npx hardhat coverage # see test coverage report
npx hardhat node
```

## 🎄 Deploy
```shell
npx hardhat compile && npx hardhat run --network goerli scripts/deploy.js
```

## ☂️ Test Coverage
```md
------------------|----------|----------|----------|----------|----------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------|----------|----------|----------|----------|----------------|
 contracts/       |      100 |      100 |      100 |      100 |                |
  IMungToken.sol  |      100 |      100 |      100 |      100 |                |
  MungAirdrop.sol |      100 |      100 |      100 |      100 |                |
  MungToken.sol   |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
All files         |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
```

## ⛽️ Gas Consumption
```md
·-------------------------------------|---------------------------|---------------|-----------------------------·
|        Solc version: 0.8.18         ·  Optimizer enabled: true  ·  Runs: 20000  ·  Block limit: 30000000 gas  │
······································|···························|···············|······························
|  Methods                            ·                15 gwei/gas                ·       1632.92 usd/eth       │
················|·····················|·············|·············|···············|···············|··············
|  Contract     ·  Method             ·  Min        ·  Max        ·  Avg          ·  # calls      ·  usd (avg)  │
················|·····················|·············|·············|···············|···············|··············
|  MungAirdrop  ·  airdrop            ·      86819  ·     121019  ·       113419  ·            9  ·       2.78  │
················|·····················|·············|·············|···············|···············|··············
|  MungToken    ·  mint               ·          -  ·          -  ·        70360  ·            1  ·       1.72  │
················|·····················|·············|·············|···············|···············|··············
|  MungToken    ·  transferOwnership  ·          -  ·          -  ·        28593  ·            1  ·       0.70  │
················|·····················|·············|·············|···············|···············|··············
|  Deployments                        ·                                           ·  % of limit   ·             │
······································|·············|·············|···············|···············|··············
|  MungAirdrop                        ·          -  ·          -  ·       277003  ·        0.9 %  ·       6.78  │
······································|·············|·············|···············|···············|··············
|  MungToken                          ·          -  ·          -  ·      1045284  ·        3.5 %  ·      25.60  │
·-------------------------------------|-------------|-------------|---------------|---------------|-------------·
```
