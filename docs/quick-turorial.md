## Prepare the Hello world

**Requirement**

nodejs > 7.1

**Install**

```npm install k -g```

**Scaffold**

k has some quickly way to create a app, by the scaffold.
Here we used the ```k new [app]```.

```
$ cd ./home

$ k new appname

$ npm install

(wait for a while and completed)
```
Then we can see the files.

![The Dir](img/quick-turorial-dir.png)

**Run**

Run the ```node index.js``` could see the ```hello world ``` on http://127.0.0.1:3000 .

**Modify some word**

Open the ```/home/app/controller/main.js``` , you can see the code below:

```
class main {
    async index(ctx){
        //let obj = ctx.model('user')
        await ctx.render('welcome', {'welcome' : "hello world!"})
    }
}
module.exports = main
```

Now we modify something:

```
class main {
    async index(ctx){
        //let obj = ctx.model('user')
        await ctx.render('welcome', {'welcome' : "welcome to my app!"})
    }
}
module.exports = main
```

```Ctrl+c```  the previous command and re-run the ```node index.js```.

so, we can see ```welcome to my app!``` on the http://127.0.0.1:3000 .

## Create a guestbook in 10 minute

### Prepare the Pages

Begin, we prepare a zip of the HTML pages and the style etc.

[Download the pages for guestbook](img/quick-turorial-pages.zip)

> In real world develop job, there would offered some semi-finished pages for you, and you can start up quickly.
>
> In open source world, the Bootstrap is also a best tools for you to create the pages quickly.

Upzip the pages to the ```/home/public/``` dir:

![Upzip Pages](img/quick-turorial-upzip.png)

Move the ```guestbook.html``` to the ```/home/app/view```

![Move Html](img/quick-turorial-movehtml.png)

### Prepare the Database

> we suppose you have some web development skills, so you can make a MySQL database to use.

First create a database for the guestbook.

```
CREATE TABLE `guestbook` (
    `id` INT(11) NOT NULL AUTO_INCREMENT ,
    `title` VARCHAR(50),
    `contents` VARCHAR(200),
    `username` VARCHAR(20),
    `createtime` INT(11),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;
```

Config the ```/home/app/config.js``` with the database info.

```
const lodash = require('lodash')
const env = process.env.NODE_ENV || 'development'
let config = {
    'default': {
        'router_map': {
            '/index.html': 'main/index',
            '/': 'main/index',
        },
        'mysql' : {
            host     : 'localhost', // database host address
            user     : 'root',      // database username
            password : '123456',    // database password
            database : 'test'       // database name
        },
        'view_opts' : {
            'map' : {
                html: 'twig'
            }
        },
    },
    'development': {},
    'production': {}
}
module.exports = lodash.assign(config.default, config[env], {'default': {'env': env}})
```

### Prepare the Model

Use the scaffold, the command ```k m [model]```.

```
$ cd ./home

$ k m guestbook

generated: /home/app/model/guestbook.js
```

ok, we got the guestbook model file:

![model file](img/quick-turorial-modelfile.png)

the file contents:

```
module.exports = function (Model) {
    class guestbook extends Model{
    }
    return guestbook
}
```

### Write post before show the guestbook

We should do with the write the post in guestbook, before we see it.

Open the template file ```/home/app/view/guestbook.html```, find the ```form``` in about line 110:
```
<form method="POST" action="#">
```

modify to :
```
<form method="POST" action="/write">
```

now the form will post to the url ```/write```

We set the url in the ```/home/app/config.js```, so it can directing to a action(main/write).
```
        'router_map': {
            '/index.html': 'main/index',
            '/write' : 'main/write',
            '/': 'main/index',
        },
```
Open the controller ```/home/app/controller/main.js```, add a action:

```

class main {
    async index(ctx){
        //let obj = ctx.model('user')
        await ctx.render('welcome', {'welcome' : "welcome to my app!"})
    }

    async write(ctx) {
        console.log(ctx.request.body)
    }
}
module.exports = main
```

by the config and the write() method, we can see the data posted by the form and received by the write() method.

the ```console.log(ctx.request.body)``` show the posted data.

when post the form,

![post form](img/quick-turorial-form.png)

the console will display:

```
$ node index.js
{ title: 'the title',
  contents: 'the contents',
  username: 'my name' }
```

Next we write the data to the database:

```
   async write(ctx) {
        //console.log(ctx.request.body)
        let newrow = {
            "title": ctx.request.body.title,
            "contents": ctx.request.body.contents,
            "username": ctx.request.body.username,
            "createtime": moment().format('X')
        }
        //console.log(newrow)
        let guestbook = ctx.model('guestbook')
        let newid = await guestbook.create(newrow)
        if (newid) {

            ctx.redirect('/index.html')
        } else {
            ctx.throw(502)
        }
    }
```

The ```createtime``` we hoped to show in a pretty format, so we store the time in timestamp form, use the ```moment``` lib.

1. add a ```dependencies``` in the ```/home/package.json```,

```
  "dependencies": {
    "k": "latest",
    "koa": "^2.3.0",
    "moment": "^2.19.2",
    "twig": "^1.10.5"
  }
```

2. require the ```moment``` in the ```/home/app/controller/main.js```

```
const moment = require("moment")

class main {
...
```

3. then we can use the ```moment().format('X')``` to get the timestamp for now.

**Let's see the code ```main.js``` above:**

1. we format a newrow object, and it's keys the same with the database field names. And it's values comes from the ```ctx.request.body.[name]```, that is the HTML form input field name. For example the form data :
    ```<input type="text" name="title" ...>``` is posted to the ```ctx.request.body.title```.
2. then ```let guestbook = ctx.model('guestbook')```, we create a model named ```guestbook```. The ```ctx.model([model name])``` is a quick helper for developer to create a db object.
3. ```let newid = await guestbook.create(newrow)```, run the ```create``` of the model, and receive the new increase id ```newid```.
4. if the ```newid``` exists, we redirect the page to the front page: ```ctx.redirect('/index.html')```; if not, simply throw a 502 error.

you can post some new rows for next.

### Display the data on the front page

Let's focus on the ```index()``` of ```main.js```, changed it to:

```
    async index(ctx) {
        let guestbook = ctx.model('guestbook')
        let records = await guestbook.findAll()
        moment.locale('zh-cn')
        if (records) {
            for (let r in records) {
                records[r]['createtime'] = moment(records[r]['createtime'], "X").format('MMMM Do h:mm A')
            }
        }
        //console.log(records)
        await ctx.render('guestbook', {'records': records})
    }
```

In the index() method:

1. create the guestbook model.
2. get all the data from the database table, ```let records = await guestbook.findAll()```, by using the findAll(), witch is a function belongs to the model.
3. ```moment.locale('zh-cn')``` set the time field for locale.
4. if the records exists, then for each the ```createtime``` field to change to pretty format.
5. then render the ```guestbook``` template with records, ```ctx.render('guestbook', {'records': records})```.

Open the ```/home/app/view/guestbook.html```, in line 26, modify:

```
            <div class="col-md-8">
                {% for record in records %}
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="media">
                            <div class="media-left">
                                <a href="#">
                                    <img class="media-object" src="/i/img/1.gif" alt="...">
                                </a>
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading">{{record.title}}<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></h4>
                                {{record.contents}}

                                <blockquote class="blockquote-reverse small">
                                    <ul class="list-inline text-muted">

                                        <li>by</li>
                                        <li>{{record.username}}</li>
                                        <li>{{record.createtime}}</li>
                                        <li>
                                            <button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span> 100</button>
                                        </li>
                                    </ul>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
                {% endfor %}
```

See the code above:

1. Use the ```twig``` loop statement ```for``` to expand the ```records``` from ```main.js```.
```
{% for record in records %}

...Loop the records data...

{% endfor %}
```
2. Within the loop, replace some field to ```{{Variable}}```, it means to show the Variable here.

Name | Meaning
---|---
{{record.title}}|the title
{{record.contents}}|the post content
{{record.username}}|username
{{record.createtime}}| the time post is create, format by moment

3. Re-run the ```node index.js```, so you can see the guestbook:

![finish first tour](img/quick-turorial-finish.png)

By now, we finish a guestbook simply.

Next section we will do more data job and Ajax.


### TO BE CONTINUE ###