# ai-calculator

This is a demo for operationalizing AI and Calculators in MarkLogic Data Hub.

## Prerequisites

- A sane Macos with docker.
- Have valid docker credentials in `$DOCKERUSER` and `$DOCKERPW`
- Java 8

## Run MarkLogic Docker

On the host machine:

```sh
docker login -u $DOCKERUSER -p $DOCKERPW
mkdir -p /Users/shared/aidata
docker run -d -it -p 8000-8020:8000-8020 \
     -v /Users/shared/aidata:/var/opt/MarkLogic \
     -e MARKLOGIC_INIT=true \
     -e MARKLOGIC_ADMIN_USERNAME=admin \
     -e MARKLOGIC_ADMIN_PASSWORD=admin \
     --name aidata3 store/marklogicdb/marklogic-server:10.0-1-dev-centos
```

## Install CNTK and Jupyter Docker

Run the container while linking to MarkLogic and setting the current directory as a mount

```sh
docker pull microsoft/cntk:2.3-cpu-python3.5
docker run -d -p 8888:8888 \
     --name cntk-jupyter-notebooks \
     --link aidata -v `pwd`:/mount \
     -t microsoft/cntk:2.3-cpu-python3.5
```

## Starting the data hub framework

On the host machine (use Java 8), leave this command running in its own shell.

```sh
java -jar marklogic-datahub-5.0.2.war
```

## Ingest CBS data

Before logging into the Data Hub UI, put the `data` directory from this project where the Data Hub can find it.

From the host machine in the project root:

```sh
mkdir -p /Users/Shared/aiingest
cp -r data /Users/Shared/aiingest 
```

Then, open the Data Hub UI (at http://0.0.0.0:8080). Run the `cbs_index` flow.

## Retrieve from Data Hub

### Convert SQL to Optic plan

This step is informational. The results are already part of the Jupyter notebook that will be run later. On the QConsole (http://0.0.0.0:8000/qconsole), run the following Javascript:

```js
const op = require('/MarkLogic/optic');
op.fromSQL("select * from cbs_index").export();
```

This should return a JSON object like the body of the POST below.

### Get the data from the Rows API

The results of the last command will be used in the body of a POST to the `/v1/rows` API on the FINAL database (http://localhost:8011/v1/rows), with header `Accept: 'text/csv'`, and valid DIGEST credentials.

POST Body:

```json
{
     "$optic": {
     "ns": "op", 
     "fn": "operators", 
     "args": [{
          "ns": "op", 
          "fn": "from-sql", 
          "args": [
               "select * from cbs_index", 
               null
               ]
          }]
     }
}
```

The above JSON is already saved URL-encoded within the Jupyter Notebook, `CBS_Linear_Regression_Model.ipynb`. It can be tested in Postman or with `curl`.

## Run Jupyter

```sh
docker exec -it cntk-jupyter-notebooks bash -c "source /cntk/activate-cntk && jupyter-notebook --no-browser --port=8888 --ip=0.0.0.0 --notebook-dir=/mount --allow-root"
```

## Run the Jupyter notebook

Open the Jupyter notebook at http://0.0.0.0:8888/, or better yet follow the link (with the `?token=` parameter) in the output of the above `docker exec` command. Execute each command in sequence.
