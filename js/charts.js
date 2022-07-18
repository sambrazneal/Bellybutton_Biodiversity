function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArrays = data.samples;
    //console.log(sampleArrays);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredsampleArray= sampleArrays.filter(sampleObj=> sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredsampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(numericIds=> "OTU " + numericIds).reverse();
    var top10_otu_labels = otu_ids.slice(0,10).reverse();
    var top10_sample_values = sample_values.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: top10_sample_values,
      y: yticks,
      text: top10_otu_labels,
      type: "bar",
      orientation: "h",


    };
    var trace = [barData];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"<b> Top 10 Bacteria Cultures Found </b>",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
      },
      font: {color: "black", family: "Arial"}, 
      colorscale:"YlGnBu"

    };
    Plotly.newPlot("bar", trace, barLayout);

    // Bubble 
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"YlGnBu"
      }
  
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title:"OTU ID"},    
      showlegend: false,
      height: 500,
      width: 1000,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
      },
      font: { color: "black", family: "Arial" } 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Create a variable that holds the samples array. 
    var metadata= data.metadata;
    console.log(metadata)


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata = metadata.filter(sampleObj=> sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    metadataResults =filteredMetadata[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
   var wfreq_value = metadataResults.wfreq;
    // Create the yticks for the bar chart.

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq_value,
      title: {text: "Belly Button Washing Frequency <br> Scrubs Per Week", font: {size:16}},
      gauge: {
        axis: { 
            range: [0, 10], 
            tickwidth: 1, 
            tickcolor: "black",
            nticks: 6 
        },
        bar: { color: "gray" },
        bgcolor: "white",
        borderwidth: 4,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "F5F5F5"},
          { range: [2, 4], color: "E8F6DB" },
          { range: [4, 6], color: "B3E1CE" },
          { range: [6, 8], color: "6772B6"},
          { range: [8, 10], color: "446699" }]},
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {margin: {t:0, b: 0 },
    width:500,
    height:400,
    font: { color: "black", family: "Arial" } 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

