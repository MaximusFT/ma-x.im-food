import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dietitianProducts } from '../content/dietitians/catalog.mjs';
const recipes=JSON.parse(await readFile(new URL('../src/generated/recipes.json',import.meta.url),'utf8')).filter(r=>r.collection==='dietitians');
const table=JSON.parse(await readFile(new URL('../content/food-table/products.json',import.meta.url),'utf8'));
assert.equal(recipes.length,21);
assert.deepEqual([...new Set(recipes.map(r=>r.day))],[3,4,5,7,8,9,10]);
for(const day of [3,4,5,7,8,9,10]) {
 const selected=recipes.filter(r=>r.day===day);
 assert.deepEqual(selected.map(r=>r.category),['Завтраки','Обеды','Ужины']);
 assert.equal(new Set(selected.map(r=>r.source.split(' — ')[0])).size,1);
}
// Verify actual per-person amounts against the existing imported table,
// rather than treating a green group as unlimited or mixing broccoli parts.
const doseIds={avocado:'pdf-003','green-pepper':'pdf-044',broccoli:'pdf-050',zucchini:'pdf-119','oyster-mushrooms':'pdf-082','spring-onion-tops':'pdf-102'};
const keys=['kcal','protein','fat','carbs'];
for(const r of recipes){
 assert.equal(r.servings,2);
 assert.equal(r.status,'testing');
 assert.ok(r.source.includes('2026-11-27_20-18-35.jpg'));
 assert.ok(r.batchNote.includes('На фото количества приняты за одну порцию'));
 assert.ok(r.steps.some(s=>s.includes('Взвесить')));
 assert.ok(r.equipment.every(s=>!/аэрогрил/i.test(s)));
 assert.ok(r.ingredients.every(i=>!/томат|помидор/i.test(i.name)));
 for(const forbidden of ['garlic','onion','red-pepper','mushrooms','bulgur','couscous']) assert.ok(!r.ingredients.some(i=>i.productId===forbidden));
 for(const [id,tableId] of Object.entries(doseIds)){
  const amount=r.ingredients.filter(i=>i.productId===id).reduce((sum,i)=>sum+i.amount,0)/2;
  const threshold=Number.parseFloat(table.find(row=>row.id===tableId).safeDose);
  assert.ok(amount<=threshold,`${r.id}: ${id} ${amount} > ${threshold}`);
 }
 for(const [k,key] of keys.entries()){
  const total=r.ingredients.reduce((sum,i)=>sum+dietitianProducts[i.productId][k+2]*(i.productId==='eggs'?i.amount*0.5:i.amount/100),0);
  assert.ok(Math.abs(total-r.nutritionTotal[key])<0.001);
  assert.ok(Math.abs(total/2-r.nutrition[key])<0.001);
 }
 assert.ok(r.estimatedYieldGrams>0);
}
const get=(day,meal,id)=>recipes.find(r=>r.id===`dietitian-day-${day}-${meal}`).ingredients.find(i=>i.productId===id)?.amount;
assert.equal(get(3,'lunch','water'),900);
assert.equal(get(3,'lunch','spring-onion-tops'),10);
assert.equal(get(5,'lunch','rice'),100); // source 150 g cooked rice per person -> 50 g dry
assert.equal(get(8,'dinner','chicken-breast'),500); // source cooked poultry -> explicit raw estimate
assert.equal(get(9,'dinner','rice'),70); // source cooked couscous -> dry rice
assert.equal(get(10,'lunch','green-pepper'),100);
assert.equal(get(10,'dinner','white-cabbage'),120);
assert.ok(recipes.find(r=>r.id==='dietitian-day-8-lunch').steps.some(s=>s.includes('готовности сырой курицы')));
console.log('Validated 21 dietitian photo adaptations, all 7 source days, two-person amounts, table doses, raw/cooked conversions and nutrition totals.');
