require("@nomiclabs/hardhat-waffle");

const INFURA_URL = "https://rinkeby.infura.io/v3/2b056270b45f4aac9f2dbeed2877173e";
const PRIVATE_KEY = "d5485c1600de8fb0cc32689e28efeba643cfb88dabc2219ba6199ff5a035dfd3"; 

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifact"
  },
  networks: {
    rinkeby: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};