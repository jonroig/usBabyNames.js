const getByBirthsRange = async () => {
    const usBabyNamesModule = await import('../lib/usBabyNames.mjs');
    const theNames = await usBabyNamesModule.get({
        birthsRange: {start: 0, end: 10},
        year: 1975
    });
    console.log('theNames', theNames);
};

getByBirthsRange();