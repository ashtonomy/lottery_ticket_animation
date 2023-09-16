var margin = {top: 100, right: 150, bottom: 100, left: 150}
var outerW = 1600,
	outerH = 900;
var width = outerW - margin.right - margin.left,
	height = outerH - margin.top - margin.bottom;

var svg = d3.select(".pruning_animation")
	.append("svg")
	.attr("class", "plot")
	.attr("width", "100%")
	.attr("viewBox", "0 0 " + outerW + " " + outerH)
	.append("g")
	.attr("class", "plot_space")
	.attr("transform", 
		"translate(" + margin.left + "," + margin.top + ")"
	);
	

// Model + Training configuration

var topNodes = 5;
var innerNodes = 7;
var lastNodes = 5;

var biasCount = innerNodes * 2 + lastNodes;
var weightCount = innerNodes * (topNodes + innerNodes + lastNodes);
var params = biasCount + weightCount;

// Timing vars
var pulseSpeed = 300;
var startDelay = 0;
var trainingRunSpeed = pulseSpeed*6-600;

var epochs = 2;
var trainingRuns = 20;

var radius = 25;
var row_one = [];
var x_val = 0 * (width/4);
for (let i = 0; i < topNodes; i++) { 
	row_one.push(svg.append("circle")
		.attr("stroke", 'white')
		//.attr('stroke', d3.interpolateViridis(0.5))
		.attr("class", "circle")
		.attr("cx", x_val)
		.attr("cy", (i+1)*(height/(topNodes+1)))
		.attr("r", radius)
		.style("fill", "#282828"));
}

var row_two = [];
var links_one = [];
var weights_one = [];
x_val = 1 * (width/4);
for (let i = 0; i < innerNodes; i++) { 
	row_two.push(svg.append("circle")
		.attr("stroke", 'white')
		.attr("class", "circle")
		.attr("cx", x_val)
		.attr("cy", (i+1)*(height/(innerNodes+1)))
		.attr("r", radius)
		.style("fill", "#282828"));

	links_one[i] = [];
	weights_one[i] = [];
	
	for (let j = 0; j < topNodes; j++) {
		var link = d3.linkHorizontal()({
			source: [row_one[j].attr("cx"), row_one[j].attr("cy")],
			target: [x_val, (i+1)*(height/(innerNodes+1))]
		});
		links_one[i].push(svg.append('path')
			.attr('d', link)
			.attr('stroke', d3.interpolateOranges(0))
			//.attr('stroke', d3.interpolateViridis(0.5))
			.attr('stroke-width', 1)
			.attr('class', 'link')
			.attr('fill', 'none'));
		weights_one[i].push(1);
	}
}

var row_three = [];
var links_two = [];
var weights_two = [];
x_val = 2 * (width/4);
for (let i = 0; i < innerNodes; i++) { 
	row_three.push(svg.append("circle")
		.attr("stroke", 'white')
		//.attr('stroke', d3.interpolateViridis(0.5))
		.attr("class", "circle")
		.attr("cx", x_val)
		.attr("cy", (i+1)*(height/(innerNodes+1)))
		.attr("r", radius)
		.style("fill", "#282828"));

		links_two[i] = [];
		weights_two[i] = [];

		for (let j = 0; j < innerNodes; j++) {
			var link = d3.linkHorizontal()({
				source: [row_two[j].attr("cx"), row_two[j].attr("cy")],
				target: [x_val, (i+1)*(height/(innerNodes+1))]
			});
			links_two[i].push(svg.append('path')
				.attr('d', link)
				.attr('class', 'link')
				.attr('stroke', d3.interpolateOranges(0))
				//.attr('stroke', d3.interpolateViridis(0.5))
				.attr('stroke-width', 1)
				.attr('fill', 'none'));
			weights_two[i].push(1);
		}
}

var row_four = [];
var links_three = [];
var weights_three = [];
x_val = 3 * (width/4);
for (let i = 0; i < lastNodes; i++) { 
	row_four.push(svg.append("circle")
		.attr("stroke", 'white')
		.attr("class", "circle")
		.attr("cx", x_val)
		.attr("cy", (i+1)*(height/(lastNodes+1)))
		.attr("r", radius)
		.style("fill", "#282828"));

	links_three[i] = [];
	weights_three[i] = [];

	for (let j = 0; j < innerNodes; j++) {
		var link = d3.linkHorizontal()({
			source: [row_three[j].attr("cx"), row_three[j].attr("cy")],
			target: [x_val, (i+1)*(height/(lastNodes+1))]
		});
		links_three[i].push(svg.append('path')
			.attr('d', link)
			//.attr('stroke', d3.interpolateViridis(0.5))
			.attr('stroke', d3.interpolateOranges(0))
			.attr('stroke-width', 1)
			.attr('class', 'link')
			.attr('fill', 'none'));
		weights_three[i].push(1);
	}
}

// Bring top nodes to front
for (let i = 0; i < topNodes; i++) {
	row_one[i].raise();
}

// Bring inner nodes to front
for (let i = 0; i < 7; i++) {
	row_two[i].raise();
	row_three[i].raise();
}

// Bring last nodes to front
for (let i = 0; i < lastNodes; i++) {
	row_four[i].raise();
}

function getBetaRandomVariable() {
	return Math.pow(Math.sin((Math.random()*Math.PI)/2), 2);
}


/********************************************************************
 * 
 * Annotations
 * 
 ********************************************************************/
 
// Init text object
var step = 0;
var pruningIter = 0;

svg.append("text")
	.attr("id", "weight_text")
	.attr("class", "text")
	.attr("x", 0)
	.attr("y", 0)
	.text("Params: " + (weightCount + biasCount).toString());

svg.append("text")
	.attr("id", "pruning_iter_text")
	.attr("class", "text")
	.attr("x", 0)
	.attr("y", 24)
	.text("Pruning Iter: " + pruningIter.toString());

svg.append("text")
	.attr("id", "step_text")
	.attr("class", "text")
	.attr("x", 0)
	.attr("y", 48)
	.text("Step: " + step.toString());

svg.append("text")
	.attr("id", "algo_text")
	.attr("class", "text")
	.style("text-anchor", "middle")
	// .attr("dominant-baseline", "central") 
	.attr("x", 3 * width/8)
	.attr("y", 0)
	.text("0. Randomly initialize network.");

function updateAlgoText(text) {
	svg.select("#algo_text")
		.text(text);
}

function updatePruningIter(){
	pruningIter++;
	svg.select("#pruning_iter_text")	
		.text("Pruning Iter: " + pruningIter.toString())
}

function updateStep(){
	step++;
	svg.select("#step_text")	
		.text("Step: " + step.toString())
}

function updateWeightCount(thresholdWeight){
	
	var currParams = params;
	
	weightCount = svg.selectAll("path")
		.filter(function() {
			return d3.select(this).attr("stroke-width") >= thresholdWeight;
		})
		.size();
	
	var newParams = weightCount + biasCount;
	var paramDiff = currParams - newParams;
	
	svg.select("#weight_text")	
		.transition()
		// .delay(trainingRunSpeed)
		.duration(pulseSpeed + trainingRunSpeed)
		.textTween(
			() => t => `Params: ${(currParams - (t*paramDiff)).toFixed()}`
		);
}

/********************************************************************
 * 
 * Training Animation
 * 
 ********************************************************************/

function activateTrainingRun() {
	
	// Execute simultaneously
	for (let i = 0; i < 3; i++) {

		var validPath = false;
		while (!validPath) {
			// Randomly choose weights to activate with Beta RV distr
			// var ind1 = Math.floor(getBetaRandomVariable() * topNodes);
			// var ind2 = Math.floor(getBetaRandomVariable() * innerNodes);
			// var ind3 = Math.floor(getBetaRandomVariable() * innerNodes);
			// var ind4 = Math.floor(getBetaRandomVariable() * lastNodes);
			
			// Randomly choose weights
			var ind1 = Math.floor(Math.random() * topNodes);
			var ind2 = Math.floor(Math.random() * innerNodes);
			var ind3 = Math.floor(Math.random() * innerNodes);
			var ind4 = Math.floor(Math.random() * lastNodes);

			// Only activate if path exists
			if (weights_one[ind2][ind1] && weights_two[ind3][ind2] && weights_three[ind4][ind3]) {
				links_one[ind2][ind1]
					.transition()
					.ease(d3.easeLinear)
					.duration(pulseSpeed)
					.attr("stroke-width", function() { return (weights_one[ind2][ind1] + 1) * 3; })
					.attr("stroke", d3.interpolateOranges((weights_one[ind2][ind1] + 1)/15))
					.transition()
					.duration(pulseSpeed)
					.attr("stroke-width", function() { 
						weights_one[ind2][ind1] += 1; 
						return weights_one[ind2][ind1];
					});
				
				links_two[ind3][ind2]
					.transition()
					.delay(4*pulseSpeed/3)
					.ease(d3.easeLinear)
					.duration(pulseSpeed)
					.attr("stroke-width", function() { return (weights_two[ind3][ind2] + 1) * 3; })
					.attr("stroke", d3.interpolateOranges((weights_two[ind3][ind2] + 1)/15))
					.transition()
					.duration(pulseSpeed)
					.attr("stroke-width", function() { 
						weights_two[ind3][ind2] += 1; 
						return weights_two[ind3][ind2];
					});
				
				links_three[ind4][ind3]
					.transition()
					.delay(2*pulseSpeed)
					.ease(d3.easeLinear)
					.duration(pulseSpeed)
					.attr("stroke-width", function() { return (weights_three[ind4][ind3] + 1) * 3; })
					.attr("stroke", d3.interpolateOranges((weights_three[ind4][ind3] + 1)/15))
					.transition()
					.duration(pulseSpeed)
					.attr("stroke-width", function() { 
						weights_three[ind4][ind3] += 1; 
						return weights_three[ind4][ind3];
					});
				validPath = true;
			}
			else {
				validPath = false;
			}
		}
	}
}

/* 
 * "In both cases, after the network 
 * has been sufficiently pruned, its weights are
 * reset back to the original initializations."
 *  - Frankle & Carbin 2019
 * 
 */

function finishTraining() {
	
	svg.selectAll("path")
		.filter(function() {
			return d3.select(this).attr("stroke-width") > 0;
		})
		.transition()
		.ease(d3.easeLinear)
		.duration(3*pulseSpeed/2)
		.attr('stroke', d3.interpolateOranges(0))
		.attr("stroke-width", 1);
}

/********************************************************************
 * 
 * Pruning Weights
 * 
 ********************************************************************/

 function activatePruneWeights(thresholdWeight) {
	svg.selectAll("path")
		.filter(function() {
			return d3.select(this).attr("stroke-width") > 0;
		})
		.filter(function() {
			return d3.select(this).attr("stroke-width") < thresholdWeight;
 		})
		.transition()
		.delay(trainingRunSpeed)
		.ease(d3.easeLinear)
		.duration(3*pulseSpeed/2)
		.attr("stroke-width", thresholdWeight+3)
		.transition()
		.ease(d3.easeLinear)
		.duration(3*pulseSpeed/2)
		.attr("stroke-width", 0);
	
	for (let i = 0; i < innerNodes; i++) {
		for (let j = 0; j < topNodes; j++) {
			if (weights_one[i][j] > 0 && weights_one[i][j] < thresholdWeight) {
				to_prune = weights_one[i][j]
				weights_one[i][j] = 0;

				if (!weights_one[i]) {

				}
			}
		}
		for (let k = 0; k < innerNodes; k++) {
			if (weights_two[i][k] > 0 && weights_two[i][k] < thresholdWeight) {
				temp = weights_two[i][k];
				weights_two[i][k] = 0;
			}
		}
	}

	for (let i = 0; i < lastNodes; i++) {
		for (let j = 0; j < innerNodes; j++) {
			if (weights_three[i][j] < thresholdWeight) {
				weights_three[i][j] = 0;
			}
		}
	}
}

/********************************************************************
 * 
 * Timing Control Logic
 * 
 ********************************************************************/

// Init cumDelay to pulseSpeed*3 to add a small delay before starting
var cumDelay = startDelay;
for (let i = 0; i < trainingRuns*epochs+epochs; i++) {
	if ( i === trainingRuns ) {
		setTimeout(updateAlgoText, cumDelay, "3. Prune s% of parameters by smallest-magnitude");
		setTimeout(activatePruneWeights, cumDelay, 2);
		setTimeout(updateWeightCount, cumDelay+trainingRunSpeed, 2);
		setTimeout(updatePruningIter, trainingRunSpeed+cumDelay+3*pulseSpeed);
		cumDelay += 3*trainingRunSpeed;
	}
	else if (i === 2*trainingRuns+1) {
		setTimeout(updateAlgoText, cumDelay, "3. Prune s% of parameters by smallest-magnitude");
		setTimeout(activatePruneWeights, cumDelay, (trainingRuns/5));
		setTimeout(updateWeightCount, cumDelay+pulseSpeed, (trainingRuns/5));
		setTimeout(updatePruningIter, cumDelay+3*pulseSpeed);
		cumDelay += 2*trainingRunSpeed;
	}
	else {
		if ((i != 0) && (i % (trainingRuns-1) === 0)) {
			setTimeout(updateAlgoText, cumDelay, "2. Train network for j iterations");
			setTimeout(updateStep, cumDelay);
			setTimeout(activateTrainingRun, cumDelay);
			cumDelay += 3*trainingRunSpeed;
		}
		else {
			setTimeout(updateAlgoText, cumDelay, "2. Train network for j iterations.");
			setTimeout(updateStep, cumDelay);
			setTimeout(activateTrainingRun, cumDelay);
			cumDelay += trainingRunSpeed;
		}
	}
}

setTimeout(finishTraining, cumDelay + trainingRunSpeed*4);
setTimeout(updateAlgoText, cumDelay + trainingRunSpeed*3, "4. Reset remaining parameters to their initial values");
