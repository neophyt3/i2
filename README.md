# Setup instruction
- Clone repo
- Inside the clone directory, execute the following command
```
>npm install
```
- After npm install, lets setup database 
    - Change the connection db uri in, app/config/db.js file
    - Change the cwd - current working directory to /dist/scripts
```
>cd ./dist/scripts
```
-Run the following command to setup data in db
```
>node dbSetup.js
```
- From root directory, exec the below command
```
>npm start
```

