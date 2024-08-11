const directDbAccess = async () => {
    const usBabyNamesModule = await import('../lib/usBabyNames.mjs');
    const nameDataDb = usBabyNamesModule.nameDataDb;
    const nameDetailsDb = usBabyNamesModule.nameDetailsDb;
    const nameDetailsSql = "SELECT * from usNameDetails where name = 'jonathan' and sex = 'M' ";
    nameDetailsDb.all(nameDetailsSql, [], (err, rows) => {
        if (err) {
            console.log('err', err);
            console.log (err);
        }
        console.log(rows);
    });

    const nameDataSql = "SELECT * from usNameData where name = 'jonathan' AND sex = 'M' ORDER BY year DESC limit 10";
    nameDataDb.all(nameDataSql, [], (err, rows) => {
        if (err) {
            console.log('err', err);
            console.log (err);
        }
        console.log(rows);
    });


};

directDbAccess();