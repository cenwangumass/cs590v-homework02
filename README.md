# CPU Specifications Visualization

## Question 1: Scatterplot Summary

### What are they?

Traditionally, a scatterplot is a plot displaying two variables in Cartesian coordinates. Every data point in the dataset is represented by one point and the point’s position in the plot is determined by the value of its variables. That being said, scatterplot has been extended and has many other forms. For example, scatterplot can be made in 3D; color can be added to data points so one more variable can be shown; or we can use vectors instead of points to draw the point so it can be used in physics to show a flow field.

### How are they created?

We can create a basic scatterplot by the following pseudocode:

```
for all records {
    normalize x and y coordinates to fit on graph;
    for the record (x, y) draw something // icon or glyph;
}
wait for the user to interact;
```

Inside the loop, we first decide on the graph physical (screen) and logical sizes and on the grid we will use. This maps the range of the selected variables to the range of the screen. The second step is then drawing the point after deciding shape, size, color, etc. of the point. This is the graphical representation of the point.

The scatterplot can be elaborated by adding title, axes, legend, grids, etc.

### How are they used?

Scatterplot is usually used for identification of relationship between the two variables. For example, if we plot weight as x variable and height as y variable, it is possible to tell that there is a correlation between the two variables. Another use case would be identifying different clusters. For example, when plotting the IRIS dataset, we can identify there are three different types of the flower. But, as said before, scatterplot can be extended to do many other things like visualizing a flow field, or showing what is happening in the world with geographical data.

### Features

1. Point graphical representation: color, shape, solid or hollow, size, opacity
2. Data point label: the font, the size, is it always visible or only shows when hovering above, its location
3. The aspect of the plot: a ratio like 16:9
4. Legend: where it is located, whether it has a border, text for every category or value
5. Plot title: the font, the size, the location
6. Grid: whether to include it, how many lines in the x and y respectively, the color of the lines
7. Background color of the plot: color and its opacity
8. Trend line: a statistical model can be fit with the data and include a trend line in the plot, the color of the line, whether to include the model’s parameters on the plot
9. Axis label: the font, the size, the location (middle or at the end)
10. Axis range: the minimum value and maximum value
11. Subplots: include more than one scatterplot in one figure, the total number of plots, how many rows and how many plots in each row, do they share the same x or y axis
12. Histogram: include a histogram next to x and y axis, how many bins to use, the color of the area
13. Projection in 3D scatterplot: which plane to project, projected points color, shape, etc.
14. Movement of points in interactive scatterplot: movement rule, speed, direction
15. User interactions: zoom in and zoom out, drag and drop, selection, etc.
16. Querying: the user can filter the data by some conditions, the location of query input, does it support natural language

## Question 2: A New Feature

The new feature is blinking or flashing points on a screen. On a traditional scatterplot, the user can only see two or three variables. It is possible to have a data point having similar values for the current x and y variable but very different values for other variables that are not currently shown on the plot. In this case, the data point will sit in a large cluster and the user cannot know it's an outlier. With blinking or flashing points, the user will notice something is unusual for the data point and start to explore why it's an outlier. The technique can also be used in monitoring systems to remind the user that something goes wrong.

## Question 3: Dataset

The dataset is a list of CPUs manufactured by Intel. It includes 45 variables like the name of the CPU, its frequency, etc. Here, I preprocessed the data to include only six variables: name, frequency, price, lithography, platform (running on desktop, server, embedded systems or mobile) and released year. The dataset is downloaded at: [Computer Parts (CPUs and GPUs)](https://www.kaggle.com/iliassekkaf/computerparts).

## Question 4: Trends

1. The price of server CPUs are getting higher and higher (less than $2000 in 2006 and more than $12000 in 2017). However, the price of desktop CPUs remains almost the same. Maybe because server CPUs have technologies not available to desktop CPUs. We can compute the average price for server CPUs and desktop CPUs by year and plot the data as a line graph.

2. Our highest CPU frequency is still improving contrary to the claim that Moore's law has been dead. A possible reason is that 14 nm still has not reached the physical limit and by adding more components onto the CPU, it is still possible to improve the frequency. We can select the CPUs with the highest frequency for different platforms and plot the frequency as a line plot.

3. Very surprisingly, server CPUs usually don't have a very high frequency and desktop CPUs usually have higher frequency. Maybe this is a deliberate design choice. Running at a lower frequency, CPUs may be more stable which is necessary for server CPUs. Also, Intel may consider CPU power consumption and a lower frequency consumes less power. We can plot 1D scatter plot of frequency and identify the clusters. If the trend is valid, we should see a server CPU cluster and a desktop CPU cluster with the former's centroid has a smaller value than the latter's.