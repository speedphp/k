## Data access of k framework

k offer a very easy way to use MySQL, let's look into it.

### Data Model

Data model is the beginning of all data access method.




### Simple ORM


#### findAll() find many records by conditions

**Usage** ```findAll(conditions, sort, fields = '*', limit)```

**Arguments**

1. ```conditions```, key-value object format, refer to the condition for search in the database table. There are two formats :
    - simple key-value object, that is **AND** logic for the condition. Such as ```{'id' : 100}``` means ```id=100``` and ```{'age':18, 'gender':'male'}``` means ```age=18 and gender=male```.
    - also there is a special key ```where```. When the condition of key-value has a ```where``` key, that means **WHERE AND MAPPING** logic. Such as ```{'where':'age > :age or gender = :gender', 'age' : 18, 'gender':'male'}``` that means ```where age > 18 or gender = 'male'``` .

    The ```where``` key can find records of ``` > < or like``` conditions etc.

    Default: null, means get all records, forget the condition.

    Example:

    Type|Code
    ---|---
    SQL | ```SELECT * FROM students WHERE score > 90 AND ( classname = 'class1' OR classname = 'class2' );```
    findAll | ```findAll({'where':'score > :score AND ( classname = :c1 OR classname = :c2', 'score':90, 'c1':'class1', 'c2':'class2'}) ```

    Type|Code
    ---|---
    SQL | ```SELECT * FROM records WHERE ip like "218.26.35.%";```
    findAll | ```findAll({'where':'ip like :ip', 'ip':"218.26.35.%"}) ```

2. ```sort```, string format, refer to the sort of the records being search. In SQL, that is the ```ORDER BY``` field.

    Default: null, means no ```ORDER BY```.

    Example:

    Type|Code
    ---|---
    SQL | ```SELECT * FROM  spgb_gb ORDER BY post_time ASC;```
    findAll | ```findAll(null, "post_time ASC") ```

    Type|Code
    ---|---
    SQL | ```SELECT * FROM  spgb_gb ORDER BY post_time DESC;```
    findAll | ```findAll(null, "post_time DESC") ```

    Type|Code
    ---|---
    SQL | ```SELECT * FROM spgb_gb WHERE name = 'jake' ORDER BY post_time ASC, replay DESC;```
    findAll | ```findAll({'name':'jake'}, "post_time ASC, replay DESC") ```

3. ```fields```, string format, refer to witch fields of result would get back. The value is name of fields, separated by commas.

    Default: * , means get all fields.

    Example:

    Type|Code
    ---|---
    SQL | ```SELECT gid, name, contents FROM spgb_gb;```
    findAll | ```findAll(null, null, "gid, name, contents") ```

    Type|Code
    ---|---
    SQL | ```SELECT spgb_gb.gid, spgb_gd.name, spgb_gb.contents FROM spgb_gb;```
    findAll | ```findAll(null, null, "spgb_gb.gid, spgb_gd.name, spgb_gb.contents") ```

pagination


sql support


mutil db configuration
