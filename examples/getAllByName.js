const { getAllByName } = await import('../lib/usBabyNames.mjs');

const getAll = async (theName) => {
    const nationalNameData = await getAllByName(theName);
    console.log('nationalNameData', nationalNameData);
};

getAll('jonathan');
