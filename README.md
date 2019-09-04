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

