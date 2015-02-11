# MultiDBs-Vis-WebClient

Visualization

In this project, we need to visualize the data from the data sources registered in the MetaStore.

When visualizing targeted data, users are first directed to a new page named dashboard. In dashboard, users need to create a new canvas in order to visualize targeted data. Different users can create different canvases. A canvas has name, user ID, creation time and other attributes. Then users need to create a new story. A canvas is like a container that has different stories. And a story is like data sources. Users can add one or more than one targeted datasets into a story. After that, users can choose various types of charts for targeted data in the story, including pie charts, motion charts and so on.

In order to accomplish these functions, the work of visualization contains four parts. The first part deals with tables which stores information about canvases, stories and charts. The second part called DAO is used for connecting databases using Hibernate. The third part is called Manager, which is used for implementing different functions using Hibernate, such as adding canvases. The last part is Java classes which call different functions to accomplish our goals.

To implement these functions, we need to use HTML, CSS, JavaScript and KnocoutJS for the interface design. And we need to use Java, RESTful API and Hibernate for the back-end design. Besides these techniques, we may need many other thechniques to accomplish the functions.