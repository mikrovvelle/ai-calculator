# ai-calculator
This is a demo for operationalizing AI and Calculators in MarkLogic Data Hub

# Run MarkLogic Docker
docker login -u <username>
docker run -d -it -p 8000-8020:8000-8020 \
     -v ~/aidata:/var/opt/MarkLogic \
     -e MARKLOGIC_INIT=true \
     -e MARKLOGIC_ADMIN_USERNAME=admin \
     -e MARKLOGIC_ADMIN_PASSWORD=admin \
     store/marklogicdb/marklogic-server-centos:10.0-1.1-dev \
     --name=aidata

# Install CNTK and Jupyter Docker
docker pull microsoft/cntk:2.3-cpu-python3.5
## Run the container while linking to MarkLogic and setting the current directory as a mount
docker run -d -p 8888:8888 --name cntk-jupyter-notebooks --link ai -v `pwd`:/mount -t microsoft/cntk:2.3-cpu-python3.5
## Run Jupyter
docker exec -it cntk-jupyter-notebooks bash -c "source /cntk/activate-cntk && jupyter-notebook --no-browser --port=8888 --ip=0.0.0.0 --notebook-dir=/mount --allow-root"
// docker exec -it cntk-jupyter-notebooks bash -c "source /cntk/activate-cntk && jupyter-notebook --no-browser --port=8888 --ip=0.0.0.0 --notebook-dir=/cntk/Tutorials --allow-root"
## Update Matplotlib
Within Jupyter:
     !pip install --upgrade pip
     !pip install matplotlib --upgrade
     !pip install keras
     !pip install tensorflow
     !pip install --upgrade setuptools  --ignore-installed
     !pip install numpy --upgrade --ignore-installed

# Starting the data hub framework
` java -jar marklogic-datahub-5.0.2.war

# Ingest CBS data
Run the cbs_index flow

# Retrieve from Data Hub
## Convert SQL to Optic plan
const op = require('/MarkLogic/optic');
op.fromSQL("select * from cbs_index").export();
## Get the data from the Rows API
POST http://localhost:8011/v1/rows
{
"$optic": {
"ns": "op", 
"fn": "operators", 
"args": [
{
"ns": "op", 
"fn": "from-sql", 
"args": [
"select * from cbs_index", 
null
]
}
]
}
}
Accept: 'text/csv'

# Install skl2onnx (using the right kernel)
` /usr/local/opt/python/bin/python3.7 -m pip install skl2onnx

# Run Jupyter notebook
` jupyter notebook


# Run a bash shell
` docker ps
` docker exec -it <container_id> bash
