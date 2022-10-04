---
layout: post
title: How do I export data from Heroku Postgresql to CSV?
tags: ["heroku", "postgresql", 'post']
description: "A quick tidbit about exporting data from Heroku to CSV"
date: 2019-03-19
---
[Source](https://www.codeography.com/2016/02/11/export-heroku-postgres-to-csv.html)

You can copy data from a Heroku postgres database to your local working directory by running: 

```
heroku pg:sql 
app::DATABASE=> \copy (SELECT * FROM some_table) TO some_table.csv CSV DELIMITER ','
```
