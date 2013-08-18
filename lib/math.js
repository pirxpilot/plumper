function div(a, b) {
	return Math.floor(a / b); // we only have positive a and b
}

function sign(n) {
	return n < 0 ? -1 : 1;
}

function same(p1, p2) {
	return p1[0] === p2[0] && p1[1] === p2[1];
}

module.exports = {
	div: div,
	sign: sign,
	same: same
};