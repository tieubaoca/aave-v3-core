import getAaveOracleParams from './aaveOracleParams';

async function getLogParams() {
  const aaveOracleParams = getAaveOracleParams();
  console.log(aaveOracleParams);
}

getLogParams();
