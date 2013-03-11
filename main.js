var book_builder = require('btctrader').books;
var talib = require('talib');

// we can ask the book builder to create a book of any supported type
// as long as the returned book object emits the right events it will work
var bitfloor = book_builder.build({
    // common options
    exchange: 'bitfloor', // bitfloor or mtgox
    protocol: 'rest', // only 'rest' is supported for now
    depth: 'L1', // only L1 is supported for now

    // exchange specific
    host: 'api.bitfloor.com',
    product: 1,
});


// errors will be emitted to the typical error event
bitfloor.on('error', function(err) {
	console.log("error:", err);
});

var ticks = [];

bitfloor.on('changed', function(details){

	ticks.push(details);
	console.log("tick:", details);
	doCalc();

});

function doCalc(){

	
	talib.execute({
		name: "LINEARREG",
		startIdx: 0,
		endIdx: ticks.length -1,
		inReal: ticks.map(function(tick){
			return tick.price;
		}),
		optInTimePeriod: 3
	}, function(result){
		console.log("LINEARREG result:",result);
	});
	

}

console.log(talib.explain("LINEARREG").inputs)
console.log(talib.explain("ADX").inputs)

console.log(talib.functions);