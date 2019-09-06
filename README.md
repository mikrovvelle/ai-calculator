# ai-calculator
This is a demo for operationalizing AI and Calculators in MarkLogic Data Hub

# Run MarkLogic
docker login -u <username>
docker run -d --name=ai -it -p 8000-8020:8000-8020 \
     -v ~/aidata:/var/opt/MarkLogic \
     -e MARKLOGIC_INIT=true \
     -e MARKLOGIC_ADMIN_USERNAME=admin \
     -e MARKLOGIC_ADMIN_PASSWORD=admin \
     store/marklogicdb/marklogic-server-centos:10.0-1.1-dev

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

# Run Jupyter notebook
` jupyter notebook