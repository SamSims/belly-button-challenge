// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
let sampinfo = metadata.filter((samp)=> samp.id ==sample);
    // Use d3 to select the panel with id of `#sample-metadata`
datapanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
datapanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
let datavals = Object.keys(sampinfo[0]);
for(let i=0;i<datavals.length;i++){
  datapanel.append("div").text(`${datavals[i].toUpperCase()}: ${sampinfo[0][datavals[i]]}`)
}
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
let samples = data.samples;
    // Filter the samples for the object with the desired sample number
let chartid = samples.filter((samp)=> samp.id ==sample);
    // Get the otu_ids, otu_labels, and sample_values
let otu_ids =chartid[0].otu_ids;
let otu_labels = chartid[0].otu_labels;
let sample_values =chartid[0].sample_values;
    // Build a Bubble Chart
let bub = {
  x: otu_ids,
  y: sample_values,
  mode: "markers",
marker:{
color:otu_ids,
size:sample_values
},
  text: otu_labels,
};
let bublayout ={
 title:"Bacteria Cultures Per Sample",
xaxis:{
title:{
  display:true,
  text:"OTU ID"
}
},
yaxis:{
  title:{
    display:true,
    text:"Number of Bacteria"
}
}
};

    // Render the Bubble Chart
Plotly.newPlot("bubble",[bub],bublayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
otu_idstrings = otu_ids.map(a=>`OTU ${a.toString()}`);
slicedsamplevals = sample_values.slice(0,10);
slicedotulables = otu_idstrings.slice(0,10);
slicedsamplevals.reverse();
slicedotulables.reverse();
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
let barc ={
  x:slicedsamplevals,
  y:slicedotulables,
  type:"bar",
  orientation:"h"
};
let barlayout ={
title:"Top 10 Bacteria Cultures Found",
xaxis:{
  title:{
    display:true,
    text:"Number of Bacteria"
  }
  },
};

    // Render the Bar Chart
Plotly.newPlot("bar",[barc],barlayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
let subnames = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
for (let i = 0;i<subnames.length;i++){
  dropdown.append("option").text(`${subnames[i]}`).property("value", subnames[i]);
};

    // Get the first sample from the list
sample = subnames[0]

    // Build charts and metadata panel with the first sample
buildMetadata(sample);
buildCharts(sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
let newsamp = dropdown.property("value");
buildMetadata(newsamp);
buildCharts(newsamp);
}

// Initialize the dashboard
init();
