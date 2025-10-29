//JavaScript program to swap two variables

//take input from the users
let a = parseInt(prompt('Enter the first variable: '));
let b = parseInt(prompt('Enter the second variable: '));
let c = parseInt(prompt('Enter the third variable: '));

// addition and subtraction operator
a = a + b;
b = a - b;
a = a - b;
c=a+b;

console.log(`The value of a after swapping: ${a}`);
console.log(`The value of b after swapping: ${b}`);
console.log(`The value of c after swapping: ${c}`);


