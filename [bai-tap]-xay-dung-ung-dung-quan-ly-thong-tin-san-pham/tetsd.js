let arr = ['   name:"tyty",email:"tyht",phone:"rt",expires:"1655227172947"   '];
let string = `{${arr[0]}}`;
eval('var obj=' + string);
console.log(obj);
