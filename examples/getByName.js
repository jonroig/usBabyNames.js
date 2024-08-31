const { getByName } = await import('../lib/usBabyNames.mjs');

const getByNamed = async () => {
    const theNames = await getByName('debbie');
    console.log('theNames', theNames);
};

getByNamed();
