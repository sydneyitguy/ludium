# Ludium week 4
Practice exercise for managing a simple ERC20 airdrop

## 📄 Contracts
- MungToken: ERC20 token with Mintable capability
- Airdrop: An airdrop contract that mint 100 MUNG token on every claim

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
----------------|----------|----------|----------|----------|----------------|
File            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------|----------|----------|----------|----------|----------------|
 contracts/     |        0 |        0 |       50 |        0 |                |
  MungToken.sol |        0 |        0 |       50 |        0 |             12 |
----------------|----------|----------|----------|----------|----------------|
All files       |        0 |        0 |       50 |        0 |                |
----------------|----------|----------|----------|----------|----------------|
```

## ⛽️ Gas Consumption
```md
·------------------------|---------------------------|---------------|-----------------------------·
|  Solc version: 0.8.18  ·  Optimizer enabled: true  ·  Runs: 20000  ·  Block limit: 30000000 gas  │
·························|···························|···············|······························
|  Methods                                                                                         │
··············|··········|·············|·············|···············|···············|··············
|  Contract   ·  Method  ·  Min        ·  Max        ·  Avg          ·  # calls      ·  usd (avg)  │
··············|··········|·············|·············|···············|···············|··············
|  Deployments           ·                                           ·  % of limit   ·             │
·························|·············|·············|···············|···············|··············
|  MungToken             ·          -  ·          -  ·      1045284  ·        3.5 %  ·          -  │
·------------------------|-------------|-------------|---------------|---------------|-------------·
```
