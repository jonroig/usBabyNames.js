const { getStateNameData } = await import('../lib/usBabyNames.mjs');

const getStateData = async () => {
    const theNames = await getStateNameData('kamala', 'f');
    console.log('theNames', theNames);
};

getStateData();
