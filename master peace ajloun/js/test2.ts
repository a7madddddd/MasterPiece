 let i = [2, 3, 5, 7];

if (i[0] < i[1], i[2] < i[3]) {

    console.log(i[0]);
}
if (i[1] < i[0], i[2] < i[3]) {

    console.log(i[1])
}
if (i[2] < i[1], i[0] < i[3]) {
}
console.log(i[2])
if (i[3] < i[1], i[2] < i[0]) {

    console.log(i[3])
}