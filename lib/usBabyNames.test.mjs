import { 
  getByName,
	getByYear,
	getById,
	get,
	getNameRankAndBirthsByYear,
	getDetailed,
	getStateNameData,
	getAllByName
 } from '../lib/usBabyNames.mjs';

describe('usBabyNames module', () => {

  test('getByName should return the correct data for a given name', async () => {
    const name = 'kamala';
    const output = await getByName(name);
    expect(output[0].births).toBe(6);
  });
  

  test('getStateNameData should return the correct data for a given name', async () => {
    const name = 'kamala'; 
    const output = await getStateNameData(name);
    expect(output[0].births).toBe(5);
  });


  test('getByYear should return the correct data for a given year', async () => {
    const year = 2019; 
    const output = await getByYear(year);
    output.find((item) => {
      if (item.name === 'olivia' && item.sex === 'f') {
        expect(item.births).toBe(18508);
      }
    });
  });


  test('getNameRankAndBirthsByYear should return the correct data for a given year', async () => {
    const output = await getNameRankAndBirthsByYear('kamala');
    expect(output['1955'].births).toBe(6);
  });


  test('getDetailed should return the correct data for a given name', async () => {
    const name = 'kamala';
    const output = await getDetailed(name, 'f');
    expect(output.name).toBe('kamala');
  });


  test('getById should return the correct data for a given id', async () => {
    const id = 668;
    const output = await getById(id);
    expect(output.id).toBe(668);
  }); 


  test('getAllByName should return the correct data for a given name', async () => {
    const name = 'kamala';
    const output = await getAllByName(name);
    expect(output.byYear[1964].usa.f.births).toBe(105);
    expect(output.byYear[1964].ca.f.births).toBe(10);
    expect(output.detailF.name).toBe('kamala');
  });

  
  test('get filters by id', async () => {
    const output = await get({ id: 668 });
    expect(output[0].id).toBe(668);
  });


  test('get filters by name', async () => {
    const output = await get({ name: 'kamala' });
    expect(output[0].name).toBe('kamala');
  });


  test('get filters by year', async () => {
    const output = await get({ year: 1964 });
    expect(output[0].year).toBe(1964);
  });


  test('get filters by rank', async () => {
    const output = await get({ rank: 668 });
    expect(output[0].rank).toBe(668);
  });


  test('get filters by rank range', async () => {
    const output = await get({ 
      rankRange: {
        start: 668,
        end: 888
      }
    });
    expect(output[0].rank).toBe(668);
    expect(output[output.length -1].rank).toBe(888);
  });


  test.only('get filters by birth range', async () => {
    const output = await get({
      birthsRange: {
        start: 668,
        end: 888
      }
    });

    const allInsideRange = output.some((item) => {
      if (item.births <= 668 || item.births >= 888) {
        return true
      }
    });

    expect(allInsideRange).toBe(true);
  });

});