const getByName = async () => {
    const { getByName } = await import('../lib/usBabyNames.mjs');
    const theNames = await getByName('debbie');
    console.log('theNames', theNames);
};

getByName();
